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
  
  var QUEST_API = {
    api: "entity",
    type: "field_list",

    workflows: [{
      // Entity name
      name: "field_cats",

      title: "LL_SELECT_TASK_CATEGORY",
      
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
        title: "LL_QUEST_STATUS_HISTORY_CHANGE",
        type: "status",

        "columns": [{
          title: "LL_CREATED",
          db_name: "created",
          formatter: function(data) {
            return web_app.format_date_time(data, true);
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
    }],

    // Special processing for address column
    fcolumns: {
      "LL_DUE_DATE" : {
        type: "date_input",
        from_now: true,
        width: "6em",
        formatter: function (data) {
          return web_app.format_date_time(data);
        }
      },

      "LL_NOTES": {
        type: "text_area",
        width: "100%",
      }
    }
  };

  var MGR_QUEST_API = $.extend(true, {
    disable_update: true,
    api_prefix: "private/",
    roles: ["ROLE_SBS_ADMIN", "ROLE_SBS_MANAGER", "ROLE_SBS_TASK_MANAGER"],
  }, QUEST_API);

  MGR_QUEST_API.columns.push(
    web_app.mod.get_user_hist_column("LL_OWNER_HISTORY_CHANGE", "LL_CUST_REP"));

  var TASK_FCATS = web_app.mod.get_field_cats_entity("TASK_FCATS");
  TASK_FCATS.on_reindex = function(ditem) {
    if (ditem.name == "LL_CRM")
      TASK_FCATS.crm_ditem = ditem;
  };

  var TASK_FIELDS = web_app.mod.get_fields_entity("TASK_FIELDS", "LL_SELECT_TASK_CATEGORY");
  TASK_FIELDS.on_reindex = function(ditem) {
    if (ditem.name == "LL_CRM_ID")
      TASK_FIELDS.crm_ditem = ditem;
  };

  // List of entities with field mapping
  var ENTITIES = {
    "field_cats": TASK_FCATS,

    "fields": TASK_FIELDS,

    // My Active quests
    'entities::active': $.extend(true, {title: "my_active_quests"}, QUEST_API),

    // All my quests
    'entities': $.extend(true, {
        title: "my_quests", 
        disable_update: true,
        on_clear_index: function() {
          delete web_app.mod.modules.task.hdata.crm_tasks;
        },
        on_reindex: find_crm_task
      }, QUEST_API),

    // All quests
    'private::entities': $.extend(true, {title: "private::quests",
        on_reindex: find_crm_task}, MGR_QUEST_API),

    "statuses": {
      hidden: true,

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        flang: true,
        max_size: 191,
        width: "15em",
        is_mandatory: true
      }]
    },

    "users": {
      hidden: true,

      // Existing external dictionary for this entity
      ref_mod: "base",

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        max_size: 191,
        width: "15em",
        is_mandatory: true
      }]
    }
  };
  
  function find_crm_task(ditem) {
    var hdata = web_app.mod.modules.task.hdata.crm_tasks;
    if (hdata === undefined) {
      hdata = {};
      web_app.mod.modules.task.hdata.crm_tasks = hdata;
    }

    // Quick check on null
    if (ditem === undefined)
      return;
      
    if (ditem.field_cat.id == TASK_FCATS.crm_ditem.id) {
      // Look for the entity field
      for (var idx in ditem.entity_fields) {
        var ef = ditem.entity_fields[idx];
        if (ef.field.id == TASK_FIELDS.crm_ditem.id) {
          var efl = hdata[ef.value];
          if (efl === undefined) {
            efl = [];
            hdata[ef.value] = efl;
          }

          efl.push(ditem);
          break;
        }
      }
    }
  };

  // Linked entities that needs to be refreshed
  // when either one changes
  var LINKED = ['entities::active', 'entities', 'private::entities'];

  function Task() {
    this.name = "task";
  };
  
  Task.prototype = new web_app.mod.modules.base.proto();

  Task.prototype.get_title = function() {
    return "LL_TASKS";
  };

  Task.prototype.get_entities = function() {
    return ENTITIES;
  };

  Task.prototype.get_linked = function() {
    return LINKED;
  };

  web_app.mod.modules["task"] = {
    obj: new Task()
  };
  
})(jQuery, jWebApp);
