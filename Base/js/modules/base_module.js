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

(function($, web_app) {

  // List of protected buttons
  var BTNS_ACCESS_LIST = {
    "delete": ["ROLE_SBS_MANAGER", "ROLE_SBS_ADMIN"]
  };

  function BaseModule() {
    this.mod = web_app.mod;
  }

  BaseModule.prototype.get_btn_access_list = function() {
    return BTNS_ACCESS_LIST;
  }

  // Abstract methods
  BaseModule.prototype.get_linked = function() {};
  BaseModule.prototype.get_entities = function() { return {};};
  
  BaseModule.prototype.get_entity = function(name) {
    return this.get_entities()[name];
  };

  BaseModule.prototype.get_api = function(name) {
    return this.get_entities()[name].api;
  };

  BaseModule.prototype.get_entity_title = function(name, entity) {
    return entity.title !== undefined ? entity.title.toUpperCase() : name.toUpperCase();
  };

  BaseModule.prototype.init = function() {
    var entities = this.get_entities();
    for (var name in entities) {
      var entity = entities[name];
      if (entity.hidden)
        continue;

      entity.xtype = new this.mod.entity_types[entity.type]();
      entity.xtype.make_table_config(this.name, entity, name);
    }
  };

  BaseModule.prototype.set_error = function() {
    // Raise error flag
    this.ferror = true;
  };

  BaseModule.prototype.get_api_prefix = function() {
    return this.name + "/";
  };

  BaseModule.prototype.get_nav_items = function() {
    var result = [];
    var entities = this.get_entities();
    for (var key in entities) {
      var entity = entities[key];
      if (!entity.hidden)
        result.push({
          key: key,
          title: entity.title !== undefined
          ? entity.title
          : key
        });
    }

    return result;
  };

  BaseModule.prototype.show_entities = function(name) {
    // Try Clear previous widgets
    if (!this.mod.widgets.clear())
      return;

    // Find form description
    this.show_entities_ex(name, this.get_entity(name));
  };

  BaseModule.prototype.show_entities_ex = function(name, entity, filter) {
    var widget = $('<div class="widget entity-list">' +
      '<h2 class="text-center">' + this.t("LL_LIST_OF_" + this.get_entity_title(name, entity)) + '</h2>' +
    '</div>');
    
    // Rememver entity name for future update
    widget.data("name", name);

    var xtype = entity.xtype;
    var fextra = xtype.data.length > 10;
    
    var wrapper = $('<div class="entity-list-wrapper"></div>');
    var table = $('<table class="entity-list hover"></table>');

    wrapper.append(table);
    widget.append(wrapper);

    var dconfig = {
      paging: fextra,
      info: fextra,
      searching: fextra, 
      columns: xtype.columns,
      data: xtype.data
    };

    if (entity.defs !== undefined)
      dconfig.columnDefs = entity.defs;
      
    entity.dtable = table.DataTable(dconfig);
        
    var btns = $('<div>' + 
      '<div class="d-flex justify-content-around entity-ctrl-btns">' + 
        (!entity.disable_update
          ? '<button type="button" class="btn btn-primary add">' + this.t("LL_ADD") + '</button>'
          : "") + 
        '<button type="button" class="btn btn-secondary refresh">' + this.t("LL_REFRESH") + '</button>' +
        '<button type="button" class="btn btn-primary wclose">' + this.t("LL_CLOSE") + '</button>' +
      '</div>' + 
    '</div>');

    widget.append(btns);
    web_app.check_btn_authz(btns, this.get_btn_access_list());
    
    // Assign events handler    
    var me = this;
    
    // Assign row click if data not empty
     $('tbody', table).on('click', 'tr', function () {
        var data = entity.dtable.row( this ).data();
        if (data !== undefined) {
          // Add filter, if any
          if (filter !== undefined)
            $.extend(data, filter);
          me.show_update_entity(entity, name, data);
        }
     });
    
    // Assign button clicks
    $('button.wclose', widget).click(function(){
      me.mod.widgets.close();
    });
    
    $('button.refresh', widget).click(function(){
      me.refresh_entity(name, entity);
    });
    
    $('button.add', widget).click(function(){
      me.add_entity(entity, name, filter);
    });
    
    this.mod.widgets.append(widget);
  };

  BaseModule.prototype.add_entity = function(entity, name, filters, sname) {
    if (!web_app.is_empty_array(entity.workflows)) {
      if (filters === undefined) {
        // Start from first workflow
        var wflow = entity.workflows[0];
        
        // Get workflow data
        var me = this;
        this["get_" + wflow.name].call(this, entity, wflow.title,
          function(filters) {
            me.show_add_entity(entity, name, filters, entity.api);
          });
      } else {
        // Check which workflow to start with
        for (var i in entity.workflows) {
          var wflow = entity.workflows[i];
          if (filters[this.get_api(wflow.name)] !== undefined)
            continue;

          // Call workflow that is still new
          var me = this;
          this["get_" + wflow.name].call(this, entity, wflow.title,
            function(filters) {
              me.show_add_entity(entity, name, filters, entity.api);
            });
          return;
        }

        // Call show_add_entity since last workflow found
        this.show_add_entity(entity, name, filters, sname);
      }
    } else {
      this.show_add_entity(entity, name, filters, sname);
    }
  };

  BaseModule.prototype.show_add_entity = function(entity, name, filters, sname) {
    var me = this;
    
    this.show_entity(entity, name, undefined, sname, filters, "LL_ADD_NEW_",
      function(data) {
        // Call pre-process data b4 save
        var upd = entity.xtype.pre_process(me.name, data);

        // Create new entity
        //-- 11
        web_app.put_ajax_data_ext(web_app.make_rel_req(
                me.get_api_prefix() + entity.api, JSON.stringify(upd)), 11,
          function() {
            // Refresh callback
            var fresh;

            // Close all slides, if any
            if (sname !== undefined)
              // Close all slides
              fresh = me.mod.widgets.close_slides(sname, true);
            else  
              // Close current widget and all chain
              me.mod.widgets.close_all();

            me.refresh_entity(name, entity, fresh);
          });
      });
  };

  BaseModule.prototype.show_entity = function(entity, name, data, sname,
                                                filters, stitle, on_save) {
    var widget = this.get_widget(entity, name, data,
                                sname, filters, stitle, on_save);

    var btns = $('<div>' +
      '<div class="d-flex justify-content-around entity-ctrl-btns">' + 
        (widget.data("bshow")
          ? '<button type="button" class="btn btn-secondary back">' +
            this.t("LL_BACK") + '</button>'
          : "") +
        '<button type="button" class="btn cancel">' +
            this.t("LL_CANCEL") + '</button>' +
        (data !== undefined 
          ? '<button type="button" class="btn btn-secondary delete">' +
            this.t("LL_DELETE") + '</button>'
          : "") +
        '<button type="button" class="btn btn-primary save">' +
            this.t("LL_SAVE") + '</button>' +
      '</div>' + 
    '</div>');
  
    web_app.check_btn_authz(btns, this.get_btn_access_list());
    widget.append(btns);
    
    // Assign event handlers
    var me = this;
    
    $('button.cancel', btns).click(function() {
      if (sname !== undefined)
        me.mod.widgets.close_slides(sname, false);
      else  
        me.mod.widgets.close_all();
    });
    
    if (widget.data("bshow"))
      $("button.back", btns).click(function(){
        me.mod.widgets.close_slide(sname);
      });
    
    if (data !== undefined) {
      $('button.delete', btns).click(function(){
        me.delete_entity(entity, name, data);
      });
    }
    
    $('button.save', btns).click(function(){

      // Check entity data b4 save
      var vdata = me.check_b4_save(entity, data);
      
      if (vdata !== undefined)
        // Save data
        on_save(vdata);
    });
    
    if (widget.data("history")) {
      var hlist = widget.data("history");
      
      for (var key in hlist) {
        var hspec = hlist[key];
        
        $('a.' + key + '-history', widget).click(
          (function(hitem) {
            return function() {
              me["show_" + hitem.type + "_history"].call(me, hitem, data);
            }
          })(hspec)
        );
      }
    }

    if (sname !== undefined)
      this.mod.widgets.append_slide(sname, widget);
    else
      this.mod.widgets.append(widget);
    
    if (data !== undefined) {
      // Fill out data
      for (var idx in entity.columns) {
        var column = entity.columns[idx];
        column.xtype.set_value(data);
      }
    }
  };

  BaseModule.prototype.show_status_history = function(hspec, data) {
    this.show_spec_dialog(hspec, data[hspec.type + "_histories"]);
  };

  BaseModule.prototype.show_owner_history = function(hspec, data) {
    this.show_spec_dialog(hspec, data[hspec.type + "_histories"]);
  };

  /**
   * Show static dialog with static table and specified columns 
   * 
   * @param {Object} hspec Dialog specification 
   */
  BaseModule.prototype.show_spec_dialog = function(hspec, data) {
    var dialog = '<div class="widget spec-dialog">' +
      '<h2 class="text-center">' + this.t(hspec.title) + '</h2>' + 
      '<table class="table  table-striped spec-dialog"><tr>';

    for(var i in hspec.columns)
      dialog += '<th scope="col">' + web_app.t(hspec.columns[i].title) + '</th>';

    for (var i in data) {
      var ditem = data[i];
      dialog += '<tr>';
      for(var j in hspec.columns) {
        var column = hspec.columns[j];
        var value = this.mod.get_ref_value(ditem, column.db_name);

        dialog += '<td>' + (column.flang 
          ? web_app.t(value) 
          : (typeof column.formatter == "function"
            ? column.formatter(value) 
            : value)) + '</td>';
      }

      dialog += '</tr>';
    }

    dialog += '</table><div>' +
    '<div class="d-flex justify-content-center entity-ctrl-btns">' + 
      '<button type="button" class="btn close">' +
        this.t("LL_CLOSE") + '</button></div></div></div>';

    var widget = $(dialog);

    var me = this;
    $("button.close", widget).click(function() {
      me.mod.widgets.close();
    });

    this.mod.widgets.append(widget);
  };

  BaseModule.prototype.get_widget = function(entity, name, data, sname,
                                                   filters, stitle, on_save) {
        // Check if custom title defined
    var title;
    if (entity.title_field !== undefined) {
      // Take custom title either from data or from filter
      title = (data !== undefined)
        ? this.mod.get_ref_value(data, entity.title_field)
        : this.mod.get_ref_value(filters, entity.title_field)
    } else {
      title = (entity.title !== undefined 
        ? entity.title.toUpperCase() + "_" : "") + entity.api.toUpperCase();
    }
    
    var widget = $('<div class="widget entity">' +
      '<h2 class="text-center">' + this.t(stitle + title) + '</h2>' +
    '</div>');
    
    var table = $('<table class="entity"></table>');
    
    for (var idx in entity.columns) {
      var column = entity.columns[idx];
      
      // Clear all previously initialized data
      column.xtype.clear();

      // Quick check if include into processing
      if (!column.xtype.can_show(data) 
          || !entity.xtype.can_show(column, filters))
        continue;

      // Remember input
      column.input = column.xtype.get_input(this.name, filters);

      // Quick check if hidden
      if (column.hidden)
        continue;

      // Define input title. It could either simple label or reference on 
      // field containing label
      var filter = column.xtype.get_filter(column, filters);
      var row = $('<tr>' +
        '<td class="field-title">' +
            // Check if custom title set
            this.t(data !== undefined
                ? column.title_field !== undefined
                  ? this.mod.get_ref_value(data, column.title_field)
                  : column.title
                : column.title_filter !== undefined
                  ? this.mod.get_ref_value(filters, column.title_filter)
                  : column.title) +
        ':</td>' + 
        '<td class="field-value"></td>' +
      '</tr>');
      
      // Inject input
      var fval = $("td.field-value", row);
      fval.append(column.input);
      
      if (column.history !== undefined) {
        var hname = column.history.type;
        var hst = $('<a href="#" class="' + hname + '-history ml-1">' + 
          '<img class="history" title="' +
          web_app.t(column.history.title) + 
          '" src="' + web_app.root_path + 'images/' + 
            (column.history.icon !== undefined ? column.history.icon : "history") +
            '.png" /></a>');

        hst.data("type", column.history.type);
        fval.append(hst);

        var hlist = widget.data("history");
        if (hlist === undefined) {
          hlist = {};
          widget.data("history", hlist);
        }
        
        hlist[hname] = column.history;
      }

      if (column.is_mandatory)
        column.xtype.get_input_el().after('<span class="mandatory">*</span>');
      
      table.append(row);
    }
    
    // Condition to show back button -> entity is in the chain and has workflow
    var bshow = sname !== undefined 
        && !web_app.is_empty_array(entity.workflows)
        && this.mod.widgets.slides[sname].idx > 0;

    widget.append(table);
    widget.data("bshow", bshow);

    return widget;
  };
  
  BaseModule.prototype.check_b4_save = function(entity, data) {
    var fempty = 0;
    
    // Scroll throug the list and see if all mandatory fields set
    for (var idx in entity.columns) {
      var column = entity.columns[idx];
      
      // Quick check if input check is required
      if (!column.xtype.input_check_required(data))
        continue;

      var value = column.xtype.get_value();
      
      if (column.is_mandatory && web_app.is_empty(value)) {
        fempty++;
        column.xtype.set_error();
      }
    }
    
    if (fempty > 0) {
      alert(fempty == 1 
        ? this.t("LL_MANDATORY_FIELD_EMPTY") 
        : this.t("LL_SOME_MANDATORY_FIELDS_EMPTY"));
        
      return;
    }
    
    // Go through validation
    var vdata = {};
    for (var idx in entity.columns) {
      var xtype = entity.columns[idx].xtype;

      // Quick check if data needs to be included into final save object
      if (!xtype.can_save(data))
        continue;

      // Run input field validation
      if (!xtype.validate_input())
        return;

      // After all validation done remember value
      xtype.save_value(vdata);
    }

    return vdata;
  };

  BaseModule.prototype.show_workflow_slide = function(
                    entity, data, title, on_select, params) {
    // Just in case init params
    if (params === undefined)
      params = {};
    
    var idx = this.mod.widgets.slides[entity.api] !== undefined
      ? this.mod.widgets.slides[entity.api].idx
      : 0;

    var wflow = entity.workflows[idx];

    // Index data and create list of options
    var hdata = {};
    var opt_list = "";
    for (var i in data) {
      var ditem = data[i];
      hdata[ditem.id] = ditem;

      // Apply on-the-fly translation, if required.
      opt_list += '<option value="' + ditem.id + '">' + 
        (wflow.flang ? this.t(ditem.name) : ditem.name) + '</option>';
    }
    
    var widget = $('<div class="widget wflow-' +
                                wflow.name + '">' +
      '<h2 class="text-center">' +
                  web_app.t(title) + '</h2>' +
      '<div class="text-center p-3">' +
        '<form>' +
          '<div class="d-flex justify-content-center form-group row">' +
            '<select class="field form-control">' +
              // If more than one record to select than add Select statement
              (data.length != 1
                ? '<option value="">' + 
                    web_app.t("LL_SELECT") +'</option>'
                : "") + opt_list +
            '</select>' +
            (!this.get_entity(wflow.name).disable_update
              ? '<button class="btn btn-secondary add-new">' + 
                  web_app.t("LL_ADD_NEW") + '</button>'
              : ""
            ) +
          '</div>' +
        '</form>' +
      '</div>' +
      '<div class="d-flex justify-content-around">' +
        (this.mod.widgets.slides[entity.api] !== undefined
          ? '<button type="button" class="btn btn-secondary back">' +
            this.t("LL_BACK") + '</button>'
          : "") +
        '<button class="btn btn-secondary cancel">' + 
            web_app.t("LL_CANCEL") + '</button>' +
        '<button class="btn btn-primary next">' + 
            web_app.t("LL_NEXT") + '</button>' +
      '</div>' +
    '</div>');
    
    // Identify next button and conditionally disabled it
    var btn_next = $("button.next", widget);
    btn_next.prop("disabled", (data.length != 1));
    
    var select = $("select", widget);
    select.change(function(){
      btn_next.prop("disabled", $(this).val() == "");
    });
    
    // Assign event handlers
    var me = this;
    
    btn_next.click(function() {
      me.proc_workflow_slide(entity, select.val(), hdata, params, on_select);
    });
    
    $("button.cancel", widget).click(function(){
      me.mod.widgets.close_slides(entity.api, false);
    });
    
    $("button.back", widget).click(function(){
      // Go back in workflow chain
      me.mod.widgets.close_slide(entity.api);
    });
    
    $("button.add-new", widget).click(function() {
      // Start new workflow but keep same name for slide show 
      me.add_new_workflow(entity, wflow, params.filters, entity.api, on_select, params);
    });

    this.mod.widgets.append_slide(entity.api, widget);
  };
  
  BaseModule.prototype.add_new_workflow = function(rent, wflow, filters, sname, 
                                                        on_select, params) {
    // Hide for now active widget 
    // it migth be re-drawn or show as is 
    this.mod.widgets.slides[sname].widgets[
        this.mod.widgets.slides[sname].idx - 1].hide();
    
    var entity = this.get_entity(wflow.name);

    // Mark new slides linked to old one
    var me = this;
    this.mod.widgets.init_slides(entity.api, {
      to: sname,
      proc: function() {
        // Repeat last action to display same workflow slide
        me["get_" + wflow.name].call(me, rent, wflow.title, on_select, params); 
      }
    });

    // Start new workflow for new entity.
    // Use entity api as name for new slide show
    this.add_entity(entity, wflow.name, filters, entity.api);
  };

  BaseModule.prototype.proc_workflow_slide = function(entity, idx, hdata, params, on_select) {
    var ditem = hdata[idx];
    
    // Just in case initialize params filters
    if (params.filters === undefined)
      params.filters = {};
    
    var slide = this.mod.widgets.slides[entity.api];
    var filters = params.filters;
    var wflow = entity.workflows[slide.idx - 1];

    // Check for reference value
    var text = wflow.ref_value !== undefined
      ? ditem[this.mod.get_ref_value(ditem, wflow.ref_value)]
      : ditem.name;

    var filter = {
      value: ditem.id,
      
      // Apply on-th-fly translation, if required
      text: wflow.flang ? this.t(text) : text
    };

    if (wflow.ex_fields !== undefined) {
      for (var i in wflow.ex_fields) {
        var field = wflow.ex_fields[i];

        filter[field] = ditem[field];
      }
    }

    filters[this.get_api(wflow.name)] = filter;
    
    // Check to continue workflow or call the final method
    if (slide.idx < entity.workflows.length) {
      // remember current widget
      
      this["get_" + entity.workflows[slide.idx].name].call(this, entity,
        wflow.title, function(filters) {
          on_select(filters);
        }, params);
    } else {
      on_select(filters);
    }
  };

  BaseModule.prototype.refresh_entity = function(name, entity, fresh) {
    // Check if any linked entities
    var lnk;
    var linked = this.get_linked(name);
    if (linked !== undefined) {
      var lnk = [];
      var idx = $.inArray(name, linked);
      for (var i in linked)
        if (i != idx)
          lnk.push(linked[i]);
    }

    this.refresh_entity_data(name, entity, fresh, lnk);
  }

  BaseModule.prototype.refresh_entity_data = function(name, entity, fresh, linked) {
    var me = this;

    //-- 14
    web_app.get_ajax_ext(web_app.make_rel_req(
                            this.get_api_prefix() + name.replace("::", "/")), 14,
      function(data) {
        me.mod.load_entity(me.name, entity, name, data);
        data = entity.xtype.refresh_data(data);

        // Check if any linked elements needs to be updated
        if (linked !== undefined) {
          for (var i in linked) {
            var lnk = linked[i];

            if (!me.get_entity(lnk).hidden) {
              // Check if name of current widget matches with lnk name
              var fr = me.mod.widgets.get_current().data("name") != lnk
                ? function() {} : undefined;

              // Submit empty function to prevent ui update
              me.refresh_entity_data(lnk, me.get_entity(lnk), fr);
            }
          }
        }

        if (fresh === undefined) {
          // Reload UI table (optional)
          entity.dtable.clear();
          entity.dtable.rows.add(data);
        
          entity.dtable.draw();
        } else {
          // Run callback after data refresh
          fresh();
        }
    });
  };

  BaseModule.prototype.delete_entity = function(entity, name, data) {
    if (!web_app.confirm())
      return;
      
    var me = this;
    
    // Delete entity
    //-- 13
    web_app.delete_ajax_ext(web_app.make_rel_req_path(
                    this.get_api_prefix() + entity.api, data.id), 13,
      function() {
        // Close current widget
        me.mod.widgets.close();
        me.refresh_entity(name, entity);
      });
  };
  
  /**
   * Define filters for static fields
   * 
   * @param {Object} entity Entity
   * @param {Object} data Entity data
   */
  BaseModule.prototype.get_static_filter = function(name, entity, data) {
    var filter = {};

    for (var idx in entity.columns) {
      var column = entity.columns[idx];
      
      var ditem;
      var el_name;
      
      // Filter name
      var fname;

      if (column.type == "static_value") {
        var dlist = column.db_name.split(".");

        if (dlist.length > 1) {
          // Remove last element and combine back
          fname = dlist[dlist.length - 2];
          el_name = dlist.pop();
          var db_name = dlist.join(".");

          ditem = this.mod.get_ref_value(data, db_name);

          // Check from what field take value
          var fstatic = column.static !== undefined;
        } else {
          ditem = data;
          fname = name;
          el_name = column.db_name;
        }
          
        var frecord = {
          // span value
          value: ditem.id,

          // span text. Apply on-the-fly translation, if required
          text: column.flang ? this.t(ditem[el_name]) : ditem[el_name]
        };
        
        // Check for extra fields
        if (fstatic && !web_app.is_empty_array(column.static.ex_fields)) {
          for (var i in column.static.ex_fields) {
            var field = column.static.ex_fields[i];
            frecord[field] = db_name !== undefined 
              ? this.mod.get_ref_value(data, db_name + "." + field)
              : data[field];
          }
        }

        // Take last entity name from db_name as filter name
        filter[fname] = frecord;
      }
    }
    
    return filter;
  };
  
  BaseModule.prototype.show_update_entity = function(entity, name, data) {
    var me = this;
    
    // Define filters for static fields
    var filter = this.get_static_filter(name, entity, data);
    
    this.show_entity(entity, name, data, undefined, filter, "LL_UPDATE_EXISTING_",
      function(upd_data) {
        // Set hidden id
        upd_data["id"] = data.id;
        
        // Call pre-process data b4 save
        var upd = entity.xtype.pre_process(me.name, upd_data);

        // Update new entity
        //-- 12
        web_app.post_ajax_data_ext(web_app.make_rel_req_path(
              me.get_api_prefix() + (entity.update_prefix !== undefined
                ? entity.update_prefix : "") + entity.api, data.id, JSON.stringify(upd)), 12,
          function() {
            // Close current widget
            me.mod.widgets.close();
            me.refresh_entity(name, entity);
          });
      });
  };

  BaseModule.prototype.show_entity_slide = function(entity, name, title, on_select) {
    this.show_workflow_slide(entity, 
      this.mod.modules[this.name].data[name], 
        title !== undefined ? title : "LL_SELECT_" +
          this.get_entity(name).api.toUpperCase(), on_select);
  };

  BaseModule.prototype.get_field_cats = function(entity, title, on_select) {
    this.show_entity_slide(entity, "field_cats", title, on_select);
  };

  BaseModule.prototype.t = function(id) {
    return web_app.t(id);
  };

  web_app.mod.modules.base = {
    proto: BaseModule
  };
})(jQuery, jWebApp);
