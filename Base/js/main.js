/*
 * Seerema Business Solutions - http://www.seerema.com/
 * 
 * Copyright 2020 IvaLab Inc. and by respective contributors (see below).
 * 
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 * 
 */

"use strict";

(function($, mod) {
  
/**************************************************/
/***********     WEB_APP PARAMETERS     ***********/
/**************************************************/

  var ERR_LIST = {
    10: "LL_ERROR_VALUE_VALIDATION",
    11: "LL_ERROR_CREATE_ENTITY",
    12: "LL_ERROR_SAVE_ENTITY",
    13: "LL_ERROR_DELETE_ENTITY",
    14: "LL_ERROR_REFRESH_ENTITY"
  };
  
  // List of modules. For now hard-coded
  var MODULES = ["catalog", "task", "crm"];

  mod.entity_types = {};
  mod.input_types = {};
  mod.modules = {};

  // Define Web App configuration parameters
  mod.config = {
    // Mod version.
    version: [1,0,0],
    
    // System name
    sys_name: "Seerema Business Solutions",
  
    // Root DOM element id
    web_ctx_id: "sbs",
  
    // Supported version of Web Service. 
    // WebApp won't start if Web Service has different major version or lower version. 
    // The ws_ver[0] also could be a part of ws_path if nothing defined,
    // for example /api/v1
    ws_ver: [1,2],
    
    err_list: ERR_LIST,
    
    menu: [
      {
        title: "LL_HIDE_SIDEBAR",
        icon: "images/hide_sidebar.png",
        action: "toggle_sidebar"
      }
    ],
    
    // List of JavaScript resources to load from mod/js folder
    scripts: ["lang_set.js", "widget_chain.js", "modules/base_module.js",
      "entity_types.js", "input_types.js"],
    
    // Phase loader handler
    phase_loader: mod.web_app.init_phase_loader([["load_users"]], {
      critical: [1],
      on_completed: "load_modules",
    }),
  };

  mod.load_users = function (phase_loader) {
    phase_loader.web_app.get_ajax_phase(phase_loader, mod.web_app.make_rel_req("/user_reg"), 0, 
      function(data) {
        // Save users
        mod.modules.base.data = {
          users: data.data
        }

        return true;
      }, "load_users");
  };

  mod.load_modules = function () {
    // Remove footer
    $(".footer", this.web_app.web_root).remove();

    // Init main context and side navigation
    var view = $('<div class="main-context-wrapper">' +

      // Sidebar
      '<nav class="sidebar"></nav>' +
      
      // Business context
      '<div class="main-ctx-wrapper">' +
        '<div class="main-context"></div>' +
        '<div class="footer d-flex justify-content-center">' +
            this.web_app.get_copyright() + '</div>' +
      '</div>' +
    '</div>');
    
    // Remember side menu
    this.side_menu = $("nav", view);
    
    // Remember top level web context
    this.ctx = $(".main-context", view);
    
    // Initialize linked list with widgest
    this.widgets = this.web_app.get_widget_chain(this.ctx);
    
    // Start sequential modules load
    this.load_module(0, function() {
      mod.init_modules(view)
    });
  };

  mod.load_module = function (idx, on_completed) {
    if (idx < MODULES.length) {
      var name = MODULES[idx];
      // TODO Show module loading message
      this.web_app.load_script("js/modules/" + name + ".js", function(){
        // Call data load
        mod.load_module_data(name, idx, on_completed)
      }, function(error){
        console.error(error);
      });
    } else {
      // Done
      on_completed();
    }
  }

  mod.load_module_data = function(name, idx, on_completed) {
    var module = this.modules[name];
    var obj = module.obj;

    var entities = obj.get_entities();

    // Set counter to load
    module.to_load = 0;
    module.errors = 0;

    // Init data structures
    module.data = {};
    module.hdata = {};

    for (var key in entities) {
      var entity = entities[key];

      // Check if it references othe dictionary
      if (entity.ref_mod !== undefined) {
        module.data[key] = this.modules[entity.ref_mod].data[key];
        continue;
      }

      // Check if api is protected
      if (!this.web_app.is_empty_array(entity.roles)) {
        var roles = $.cookie("ROLES").split(",");
        if (!this.web_app.is_empty_array(roles)) {
          // Access flag
          var faccess = false;

          // Check roles
          for (var i in roles) {
            if ($.inArray(roles[i], entity.roles) >= 0) {
              faccess = true;
              break;
            }
          }

          if (!faccess) {
            // No access. Mark entity as hidden to prevent
            // further processing.
            entity.hidden = true;

            // read-only flag overrides role access
            if (!entity.read_only)
              continue;
          }
        }
      }

      // Check for url to pull all record
      this.web_app.get_ajax_ext(this.web_app.make_rel_req(obj.name +
            "/" + key.replace("::", "/")), 0,
        (function (module, entity, key) {
          return function(data) {
            mod.load_entity(module.obj.name, entity, key, data);
            module.to_load--;
          }
        })(module, entity, key),
        function() {
          module.errors++;
        }
      );

      module.to_load++;
    };

    // Start waiting loop
    setTimeout(function(){
      mod.check_module_dload(module, function(){
        // Finish module load
        module.obj.init();

        // Go recursive -> Load next module
        mod.load_module(++idx, on_completed);
      }, function() {
        module.obj.set_error();

        // Go recursive -> Load next module
        mod.load_module(++idx, on_completed);
      })
    }, 10);
  };

  mod.check_module_dload = function(module, on_completed, on_error) {
    if ((module.to_load - module.errors) == 0) {
      if (module.errors > 0)
        on_error();
      else
        on_completed();
    }
    else
      setTimeout(function(){
        mod.check_module_dload(module, on_completed, on_error);
      }, 10);
  };

  mod.load_entity = function(mod_name, entity, name, data) {
    if (entity.type == "field_list")
      this.index_fields(data);

    // Save original data
    this.modules[mod_name].data[name] = data;
    
    // Re-index data by id
    this.modules[mod_name].hdata[name] = mod.web_app.reindex_data(data, entity.on_reindex);
  };

  mod.index_fields = function(data) {
    for (var i = 0; i < data.length; i++) {
      var ditem = data[i];

      // Remember entity's field_cat id
      var fid = ditem.field_cat.id;

      var hfields = {};
      var fields = ditem["entity_fields"];
      for (var j = 0; j < fields.length; j++) {
        var cfield = fields[j];
        
        // Only index entity fields with same field_cat id as main entity
        if (cfield.field.field_cat.id != fid)
          continue;

        hfields[cfield.field.name] = cfield;
      }

      ditem.hfields = hfields;
    }
  };

  mod.init_modules = function (view) {
    // Init modules
    for (var i in MODULES) {
      var name = MODULES[i];
      var module = this.modules[name].obj;
      var list = "";

      // Check for error flag
      if (module.ferror) {
        list = '<li class="error-flag">' + this.web_app.t('LL_LOAD_FAILED') + '</li>';
      } else {
        var entities = module.get_nav_items();
        for (var j in entities) {
          var entity = entities[j];
          list += '<li>' +
              '<a href="#" entity="' + entity.key + '" class="entity">' +
                this.web_app.t('LL_' + entity.title.toUpperCase()) + '</a>' +
            '</li>';
        }
      }

      var side_menu = $('<ul class="list-unstyled components">' +
          '<li class="active">' +
              '<a href="#' + name + '" data-toggle="collapse" ' +
                  'aria-expanded="false" class="dropdown-toggle">' +
                  this.web_app.t(module.get_title()) + '</a>' +
              '<ul class="collapse list-unstyled" id="' + name + '">' +
                list +
              '</ul>' +
          '</li>' +
        '</ul>'
      );

      // Entity click
      $('a.entity', side_menu).click(
        (function (module) {
          return function() {
            // Read entity name
            var entity = $(this).attr("entity");
            module.show_entities(entity);
          }
        })(module)
      );

      this.side_menu.append(side_menu);
    }

    this.web_app.web_ctx.append(view);
  };
  
  mod.toggle_sidebar = function(item) {
    // Default state is shown
    if (item.data("state") === undefined || 
        item.data("state") == "on") {
      item.data("state", "off");
      
      $("span.menu-title", item).html(this.web_app.t("LL_SHOW_SIDEBAR"));
      $("img", item).attr("src", this.web_app.root_path + "images/show_sidebar.png");
    } else {
      item.data("state", "on");
      
      $("span.menu-title", item).html(this.web_app.t("LL_HIDE_SIDEBAR"));
      $("img", item).attr("src", this.web_app.root_path + "images/hide_sidebar.png");
    }
    
    this.side_menu.toggleClass('active');
  };
  
  mod.get_ref_value = function(data, ref_text) {
    var list = ref_text.split(".");
    var value = data[list[0]];

    for (var i = 1; i < list.length; i++)
      value = value[list[i]];

    return value;
  };

  mod.set_ref_value = function(data, ref_text, value) {
    var list = ref_text.split(".");
    
    // Quick check for simple scenario
    if (list.length == 1) {
      data[list[0]] = value;
    } else {
      var dname = list[0];
      var ditem = data[dname];

      if (ditem === undefined) {
        ditem = {};
        data[dname] = ditem;
      }

      for (var i = 1; i < list.length - 1; i++)
        ditem = ditem[list[i]];

      ditem[list[list.length - 1]] = value;
    }
  };

  /**
   * Return 4 lines address that used in North America
   * @param {Object} address 
   */
  mod.get_us_address = function(address, delim) {
    delim = delim !== undefined ? delim : "\n";

    return address.line1 + delim +
      (this.web_app.is_empty(address.line2) ? "" : address.line2 + delim) + 
      address.city.name + delim + 
      address.city.region.short_name + " " + address.zip + delim + 
      address.city.region.country.name;
  }

  
  mod.get_user_hist_column = function(title, owner_title) {
    return {
      title: "LL_USER",
      type: "entity_selection",
      // Data needs to be translated
      db_name: "user.name",
      ref_entity: "users",
      width: "16em",
      can_show: function(data) {
        return data !== undefined;
      },
      history: {
        title: title,
        type: "owner",

        "columns": [{
          title: "LL_CREATED",
          db_name: "created",
          formatter: function(data) {
            return mod.web_app.format_date_time(data, true);
          }
        },
        {
          title: owner_title,
          db_name: "owner.name"
        },
        {
          title: "LL_AUTHZ_USER",
          db_name: "user.name"
        }]
      },
    }
  };

  mod.get_field_cats_entity = function(title) {
    return {
      api: "field_cat",
      title: title,
      type: "basic_entity",
      api_prefix: "admin/",
      roles: ["ROLE_SBS_ADMIN"],
      
      // Disable adding new field category
      disable_wflow_update: true,


      // Not visible in menu but only can use data
      read_only: true,

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        flang: true,
        max_size: 50,
        width: "15em",
        is_mandatory: true
      }]
    }
  }

  mod.get_fields_entity = function(title, wflow_title) {
    return {
      api: "field",
      title: title,
      type: "basic_entity",
      api_prefix: "admin/",
      roles: ["ROLE_SBS_ADMIN"],

      // Not visible in menu but only can use data
      read_only: true,

      workflows: [{
        // Entity name
        name: "field_cats",

        title: wflow_title,

        // Translation required
        flang: true
      }],

      "columns": [{
        title: "LL_CATEGORY",
        type: "static_value",
        db_name: "field_cat.name",
        flang: true,
      },{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        flang: true,
        max_size: 50,
        width: "15em",
        is_mandatory: true
      }]
    }
  }

})(jQuery, jWebApp.mod);