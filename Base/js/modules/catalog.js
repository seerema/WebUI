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
  
  // List of entities with field mapping
  var ENTITIES = {
   
    "field_cats": web_app.mod.get_field_cats_entity("BUSINESS_FCATS"),

    "fields": web_app.mod.get_fields_entity("BUSINESS_FIELDS", "LL_SELECT_BUSINESS_CATEGORY"),


    'countries': {
      api: "country",
      type: "basic_entity",
      defs: [{
        targets: 1,
        className: 'dt-body-right'
      }],
      
      "columns": [{
        title: "LL_NAME",
        db_name: "name",
        type: "user_input",
        max_size: 191,
        width: "15em",
        is_mandatory: true
      },
      {
        title: "LL_REGION_NAME",
        db_name: "region_name",
        type: "user_input",
        default_value: "LL_PROVINCE",
        max_size: 25,
        width: "15em",
        is_mandatory: true
      },
      {
        title: "LL_POSTAL_NAME",
        db_name: "postal_name",
        type: "user_input",
        default_value: "LL_POSTAL_CODE",
        max_size: 25,
        width: "15em",
        is_mandatory: true
      },
      {
        title: "LL_REGION_FIELD",
        db_name: "region_field",
        type: "user_input",
        default_value: "short_name",
        max_size: 25,
        width: "15em",
        is_mandatory: true
      },
      {
        title: "LL_ADDRESS_FORMATTER",
        db_name: "addr_formatter",
        type: "user_input",
        default_value: "get_us_address",
        max_size: 25,
        width: "15em",
        is_mandatory: true
      }
    ]},
    
    'regions': {
      api: "region",
      type: "basic_entity",
      
      // Custom title for update region
      // It's either taking from data or from previous selection
      title_field: "country.region_name",

      workflows: [{
        // Catalog name
        name: "countries",

        // Add region_name field into the filter for entity add screen
        ex_fields: ["region_name"],
      }],
      defs: [{
          targets: 1,
          className: 'dt-body-right'
        },
        {
          targets: 2,
          className: 'dt-body-right'
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
        title: "LL_SHORT_NAME",
        type: "user_input",
        db_name: "short_name",
        
        max_size: 25,
        width: "5em",
        is_mandatory: false
      },
      {
        title: "LL_COUNTRY",
        type: "static_value",
        db_name: "country.name",

        static: {
          // Add region_name field into the filter for entity update screen
          ex_fields: ["region_name"],
        }
      }
    ]},
    
    'cities': {
      api: "city",
      type: "basic_entity",
      workflows: [{
        // Catalog name
        name: "countries",

        // Add region_name field into the filter for entity add screen
        ex_fields: ["region_name"],
      },
      {
        name: "regions",
      }],
      defs: [{
          targets: 1,
          className: 'dt-body-right'
        },
        {
          targets: 2,
          className: 'dt-body-right'
      }],
      
      "columns": [{
        title: "LL_NAME",
        db_name: "name",
        type: "user_input",
        type: "user_input",
        max_size: 191,
        width: "15em",
        is_mandatory: true
      },
      {
        // Title to display in entity list view
        title: "LL_REGION",

        // Title to display in update entity view
        title_field: "region.country.region_name",

        // Title to display in add entity view
        title_filter: "country.region_name",

        db_name: "region.name",
        type: "static_value",
      },
      {
        title: "LL_COUNTRY",
        db_name: "region.country.name",
        type: "static_value",
        static: {
          // Add region_name field into the filter for entity update screen
          ex_fields: ["region_name"],
        }
      }
    ]},
    
    'addresses': {
      api: "address",
      type: "basic_entity",
      workflows: [
        {
          name: "countries",

          // Add region_name and postal field into the filter for entity add screen
          ex_fields: ["region_name", "postal_name"],
        },
        {
          name: "regions",
        },
        {
          name: "cities",
        }
      ],
      defs: [
        {
          targets: 2,
          className: 'dt-body-right'
        },
        {
          targets: 3,
          className: 'dt-body-center'
        },
        {
          targets: 4,
          className: 'dt-body-right'
        },
        {
          targets: 5,
          className: 'dt-body-right'
        }
      ],
      
      "columns": [{
        title: "LL_ADDR_LINE_1",
        db_name: "line1",
        type: "user_input",
        max_size: 191,
        width: "15em",
        is_mandatory: true
      },
      {
        title: "LL_ADDR_LINE_2",
        db_name: "line2",
        type: "user_input",
        max_size: 191,
        width: "15em",
        def_value: ""
      },
      {
        title: "LL_CITY",
        db_name: "city.name",
        type: "static_value",
      },
      {
        title: "LL_REGION",

        // Reference on title field that needs to be used when add/update entity is shown
        title_field: "city.region.country.region_name",

        // Title to display in add entity view
        title_filter: "country.region_name",

        db_name: "city.region.name",
        type: "static_value",
      },
      {
        title: "LL_POSTAL_CODE",

        // Reference on title field that needs to be used when add/update entity is shown
        title_field: "city.region.country.postal_name",

        // Title to display in add entity view
        title_filter: "country.postal_name",

        db_name: "zip",
        type: "user_input",
        max_size: 25,
        width: "5em",
        is_mandatory: true
      },
      {
        title: "LL_COUNTRY",
        db_name: "city.region.country.name",
        type: "static_value",
        static: {
          // Add region_name field into the filter for entity update screen
          ex_fields: ["region_name"],
        }
      }
    ]},

    'entities': {
      api: "entity",
      type: "field_list",
      title: "business_info",

      workflows: [{
        // Entity name
        name: "field_cats",

        title: "LL_SELECT_BUSINESS_CATEGORY",

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
        title: "LL_CATEGORY",
        type: "static_value",
        db_name: "field_cat.name",
        // Data needs to be translated
        flang: true,
      }],
      
      // Special processing for address column
      fcolumns: {
        "LL_ADDRESS" : {
          type: "calc_sel_list",

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
    },

    'comm_medias': {
      hidden: true,

      "columns": [{
        title: "LL_NAME",
        type: "user_input",
        db_name: "name",
        flang: true,
        max_size: 25,
        width: "15em",
        is_mandatory: true
      }]
    }
  };
  
  function Catalog() {
    this.name = "catalog";
  }
  
  Catalog.prototype = new web_app.mod.modules.base.proto();

  Catalog.prototype.get_title = function() {
    return "LL_CATALOGS";
  }

  Catalog.prototype.get_entities = function() {
    return ENTITIES;
  }

  // ********************  COUNTRY SELECTION  ********************
  
  Catalog.prototype.get_countries = function(entity, title, on_select) {
    this.show_entity_slide(entity, "countries", title, on_select);
  };
  
  // ********************  REGION SELECTION  ********************
    
  Catalog.prototype.get_regions = function(entity, title, on_select, params) {
    var me = this;
    
    // Expected at this stage the value for country id to be setup
    var cid = params.filters.country.value;

    // Sort regions by country id
    var regions = [];

    for (var i in this.mod.modules.catalog.data.regions) {
      var region = this.mod.modules.catalog.data.regions[i];
      if (region.country.id == cid)
        regions.push(region);
    }
    
    this.show_workflow_slide(entity, regions, "LL_SELECT_" + 
      this.mod.modules.catalog.hdata.countries[cid].region_name, 
        on_select, params);
  };
  
  // ********************  CITY SELECTION  ********************
  
  Catalog.prototype.get_cities = function(entity, title, on_select, params) {
    var me = this;
    
    // Expected at this stage the value for country id to be setup
    var cid = params.filters.country.value;

    // Expected at this stage the value for region id to be setup
    var rid = params.filters.region.value;

    // Sort cities by country id and region id
    var cities = [];

    for (var i in this.mod.modules.catalog.data.cities) {
      var city = this.mod.modules.catalog.data.cities[i];
      if (city.region.id == rid && city.region.country.id == cid)
        cities.push(city);
    }

    this.show_workflow_slide(entity, cities, "LL_SELECT_CITY", 
        on_select, params);
  };
  
  web_app.mod.modules["catalog"] = {
    obj: new Catalog()
  };
  
})(jQuery, jWebApp);
