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
  
  var CRM_API = {
    api: "entity",
    type: "field_list",

    workflows: [{
      title: "LL_SELECT_CUSTOMER_TYPE",

      // Entity name
      name: "field_cats",

      // Translation required
      flang: true
    }],

    "columns": [{
      title: "LL_NAME",
      type: "user_input",
      db_name: "name",
      max_size: 191,
      width: "15em",
      is_mandatory: true
    },
    {
      title: "LL_TYPE",
      type: "static_value",
      db_name: "field_cat.name",
      // Data needs to be translated
      flang: true
    },
    {
      title: "LL_STATUS",
      type: "entity_selection",
      // Data needs to be translated
      flang: true,
      db_name: "status.name",
      ref_entity: "statuses",
      width: "16em",
      can_show: function(data) {
        return data !== undefined;
      },

      history: {
        title: "LL_CRM_STATUS_HISTORY_CHANGE",
        type: "status",

        "columns": [{
          title: "LL_CREATED",
          db_name: "created",
          formatter: function(data) {
            return web_app.format_date_time(data);
          }
        },
        {
          title: "LL_STATUS",
          db_name: "status.name",
          flang: true
        },
        {
          title: "LL_USER",
          db_name: "user.name"
        }]
      },
      is_mandatory: true
    },
    {
      title: "LL_LAST_CONTACTED",
      type: "static_value_list",
      db_name: "cust_comm_histories",
      
      can_show: function(data) {
        return data !== undefined;
      },

      render: function(data, type, row, meta) {
        return web_app.get_top_list_fmt_dts(data, "created");
      },
      
      history: {
        title: "LL_HISTORY_CUSTOMER_COMM",
        type: "cust_comm",
        icon: "action"
      }
    }],

    fcolumns: {
      // Special processing for due to date column
      "LL_DUE_DATE" : {
        type: "date_input",
        width: "6em",
        formatter: function (data) {
          return web_app.format_date_time(data);
        }
      },

      "LL_NOTES": {
        type: "text_area",
        width: "100%",
      },

      // Special processing for address column
      "LL_ADDRESS" : {
        type: "calc_sel_list",

        // Reference module to map data from
        ref_mod: "catalog",

        // Reference entity to map data from
        ref_entity: "addresses",

        // The maximum number of characters to display in entities view
        max_display: 25,

        // Max width (in characters) of select element
        width: "15em",

        // The address section delimiter
        delim: "\n",

        // Reference on address formatter field
        formatter: "@city.region.country.addr_formatter"
      }
    }
  };

  var MGR_CRM_API = $.extend(true, {
    disable_update: true,
    api_prefix: "private/",
    roles: ["ROLE_SBS_ADMIN", "ROLE_SBS_MANAGER", "ROLE_SBS_CRM_MANAGER"],
  }, CRM_API);

  MGR_CRM_API.columns.push(web_app.mod.get_user_hist_column("LL_CRM_OWNER_HISTORY_CHANGE", "LL_CUST_REP"));

  // List of entities with field mapping
  var ENTITIES = {
    "field_cats": web_app.mod.get_field_cats_entity("CRM_FCATS"),

    "fields": web_app.mod.get_fields_entity("CRM_FIELDS", "LL_SELECT_CRM_CATEGORY"),

    // My Active Leads
    'entities::lead': $.extend(true, {title: "my_leads"}, CRM_API),

    // All my clients
    'entities::customer': $.extend(true, {title: "my_customers"}, CRM_API),

    // All customers
    'private::entities': $.extend(true, {title: "all_customers"}, MGR_CRM_API),

    "statuses": {
      hidden: true,

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        flang: true,
        max_size: 255,
        width: "15em",
        is_mandatory: true
      }]
    },

    "users": {
      hidden: true,

      // Reference module to map existing entity
      ref_mod: "base",

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        max_size: 255,
        width: "15em",
        is_mandatory: true
      }]
    },

    "comm_medias": {
      hidden: true,

      // Reference module to map existing entity
      ref_mod: "catalog",
    }
  };
  
  var CUST_COMM_HISTORY = {
    api: "cust_comm_history",
    type: "basic_entity",
    title: "LL_HISTORY_CUSTOMER_COMM",

    "columns": [{
      title: "LL_COMM_MEDIA",
      type: "entity_selection",
      db_name: "comm_media.name",
      ref_entity: "comm_medias",
      width: "16em",
      // Data needs to be translated
      flang: true,
      is_mandatory: true
    },
    {
      title: "LL_DETAILS",
      type: "text_area",
      db_name: "body",
      width: "16em",
      max_size: 65535,
      is_mandatory: true
    },
    {
      title: "LL_CREATED",
      type: "date_input",
      db_name: "created",
      formatter: function(data) {
        return web_app.format_date_time(data);
      },
      is_mandatory: true
    },
    {
      title: "LL_AUTHZ_USER",
      type: "static_value",
      db_name: "user.name",
      can_show: function(data) {
        return data !== undefined;
      },
      // Only display (optionally) but never save
      read_only: true
    },
    {
      // Hidden entity field
      type: "static_value",
      db_name: "entity.name",
      hidden: true
    }]
  };

  // Linked entities that needs to be refreshed
  // when either one changes
  var LINKED = ['entities::lead', 'entities::customer', 'private::entities'];

  function Crm() {
    this.name = "crm";
  };
  
  Crm.prototype = new web_app.mod.modules.base.proto();

  Crm.prototype.init = function() {
    web_app.mod.modules.base.proto.prototype.init.call(this);
    CUST_COMM_HISTORY.xtype = new this.mod.entity_types[CUST_COMM_HISTORY.type]();
    CUST_COMM_HISTORY.xtype.make_table_config(this.name, CUST_COMM_HISTORY, "cust_comm_histories");
  };

  Crm.prototype.get_title = function() {
    return "LL_CRM";
  };

  Crm.prototype.get_entities = function() {
    return ENTITIES;
  };

  Crm.prototype.get_linked = function() {
    return LINKED;
  };

  Crm.prototype.show_cust_comm_history = function(hspec, data) {
    // Inject cust_com_history data
    CUST_COMM_HISTORY.xtype.data = data.cust_comm_histories;
    this.show_entities_ex("cust_comm_histories/" + data.id, 
        CUST_COMM_HISTORY, {entity: {id: data.id, value: data.id}});
  };

  web_app.mod.modules["crm"] = {
    obj: new Crm()
  };
  
})(jQuery, jWebApp);
