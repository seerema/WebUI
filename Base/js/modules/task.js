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
      max_size: 255,
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
    update_prefix: "private/",
    roles: ["ROLE_SBS_ADMIN", "ROLE_SBS_MANAGER", "ROLE_SBS_TASK_MANAGER"],
  }, QUEST_API);

  MGR_QUEST_API.columns.push(
    web_app.mod.get_user_hist_column("LL_CRM_OWNER_HISTORY_CHANGE", "LL_CUST_REP"));

  // List of entities with field mapping
  var ENTITIES = {
    // My Active quests
    'entities::active': $.extend(true, {title: "my_active_quests"}, QUEST_API),

    // All my quests
    'entities': $.extend(true, {title: "my_quests"}, QUEST_API),

    // All quests
    'private::entities': $.extend(true, {title: "private::quests"}, MGR_QUEST_API),

    'fields': {
      hidden: true
    },

    "field_cats": {
      api: "field_cat",
      hidden: true,

      // Disable adding new field category
      disable_update: true,

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

      // Existing external dictionary for this entity
      ref_mod: "base",

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        max_size: 255,
        width: "15em",
        is_mandatory: true
      }]
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
