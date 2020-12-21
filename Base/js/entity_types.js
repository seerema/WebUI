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
  
  // Max display size b4 shrinking
  var MAX_DISPLAY_SIZE = 50;

  /********************************************/
  /*              Basic Catalog               */
  /********************************************/

  function BasicEntity() {
    this.web_app = web_app;
    this.mod = web_app.mod;
  };

  BasicEntity.prototype.make_table_config = function(mod_name, entity, name) {
    // Remember name
    this.name = name;
    this.entity = entity;

    // Define list of columns to display
    this.columns = [];
    for (var idx in entity.columns) {
      var column = entity.columns[idx];

      column.xtype = new this.mod.input_types[column.type]();
      column.xtype.init(column);
      
      if (column.hidden)
        continue;

      var cdef = {
        data: column.db_name,
        title: this.web_app.t(column.title)
      };
      
      if (column.def_value !== undefined)
        cdef["defaultContent"] = column.def_value;
      
      // Limit display for only MAX_DISPLAY_SIZE characters, the rest show in tooltip
      if (column.max_size > MAX_DISPLAY_SIZE)
        cdef.render = function(data, type, row, meta) {
          // Quick check
          if (data === undefined)
            return;

          var fextra = data.length > MAX_DISPLAY_SIZE;
          var text = fextra
              ? data.substr(0, MAX_DISPLAY_SIZE - 4) + " ..."
              : data;

          // Shrink it if required
          return fextra ?  '<span data-toggle="tooltip" title="' + data + '">' + 
            text + '</span>' : text;
        };
      
      if (column.render !== undefined)
        cdef.render = column.render;
      else if (typeof column.formatter == "function") {
        cdef.render = (function(column) {
          return function(data, type, row, meta) {
            return column.formatter(data);
          }
        })(column)
      } else if (column.flang) {
        cdef.render = function(data, type, row, meta) {
          return web_app.ts(data);
        };
      }
     
      this.columns.push(cdef);
    }
    
    this.data = this.mod.modules[mod_name].data[name];
  };

  BasicEntity.prototype.pre_process = function(mod_name, data) {
      return data;
  };

  BasicEntity.prototype.refresh_data = function(data) {
      this.data = data;
      return data;
  };

  BasicEntity.prototype.can_show = function(column, data) {
    return true;
  };

  web_app.mod.entity_types["basic_entity"] = BasicEntity;

  /*****************************************/
  /*              Field List               */
  /*****************************************/

  function FieldList() {
  };

  FieldList.prototype = new BasicEntity();

  FieldList.prototype.make_table_config = function(mod_name, entity, name) {
    // Call base method
    BasicEntity.prototype.make_table_config.call(this, mod_name, entity, name);

    var cfields = this.mod.modules[mod_name].data["fields"];

    // List of unique entity fields. Keep this dictionary array
    this.cfmap = {};

    var cf_list = [];

    for (var i = 0; i < cfields.length; i++) {
      var cfield = cfields[i];

      // Same field name can be used in different categories
      if (this.cfmap[cfield.name] !== undefined) {
        this.cfmap[cfield.name][cfield.field_cat.id] = cfield;
        continue;
      }

      this.cfmap[cfield.name] = {};
      this.cfmap[cfield.name][cfield.field_cat.id] = cfield;
      cf_list.push(cfield.name);
    }

    cf_list.sort();

    for (var i in cf_list) {
      var fname = cf_list[i];
        
        // Check if custom formatter defined
        var fconfig = undefined;
        if (entity.fcolumns !== undefined && entity.fcolumns[fname] !== undefined)
          fconfig = entity.fcolumns[fname];

        // Entity configuration record
        var crecord = {
          title: fname,
          db_name: fname,
          max_size: 255,
          width: fconfig !== undefined && fconfig.width !== undefined 
              ? fconfig.width 
              : "15em",
          def_value: ""
        }

        if (fconfig !== undefined) {
          $.extend(crecord, fconfig);
        } else {
          crecord.type = "user_input";
        }

        crecord.xtype = new this.mod.input_types[crecord.type]();
        crecord.xtype.init(crecord);

        entity.columns.push(crecord);

        // DataTable configuration record
        var cdef = {
          title: this.web_app.ts(fname),
          data: fname,
          defaultContent: ""
        };

        var me = this;

        // Render special fields differently
        if (fconfig !== undefined && fconfig.formatter !== undefined) {
        
          cdef.render = (function(crecord) {
            return function (data, type, row, meta) {
              // Quick check for empty value
              if (data === undefined || data == "")
                return;

              // Find reference data
              var ditem = (crecord.ref_entity !== undefined) 
                ? me.mod.modules[crecord.ref_mod !== undefined 
                  ? crecord.ref_mod
                  : mod_name].hdata[crecord.ref_entity][data]
                : data
              if (ditem === undefined)
                return;

              // Find formatter and calc value
              var value;
              var formatter = crecord.formatter;
              if (typeof formatter == "string") {
                formatter = formatter.charAt(0) == "@" 
                  ? me.mod.get_ref_value(ditem, formatter.substr(1))
                  : formatter;

                // Lookup data. For now hard-code the addres formatiing function.
                value = me.mod[formatter].call(me, ditem);
              } else if (typeof formatter == "function") {
                var value = formatter(ditem);
              }

              var text = value;
              if (crecord.max_display !== undefined && crecord.max_display < value.length) {
                // Check if delimiter present
                if (crecord.delim !== undefined)
                  // Take the first line
                  text = value.split(crecord.delim)[0];

                text = text.length > 25
                  ? text.substr(0, 21) + " ..."
                  : text;
              }

              // Shrink it if required
              return '<span data-toggle="tooltip" title="' + value + '">' + 
                text + '</span>';
              
            }
          })(crecord);
        }

        // Display record
        this.columns.push(cdef);
    }
    
    this.refresh_data(this.data);
  };

  FieldList.prototype.pre_process = function(mod_name, data) {
      // Move field data into fields array
      var fcat = [];
      data["entity_fields"] = fcat;

      var cat = (data.id !== undefined)
        ? this.mod.modules[mod_name].hdata[this.name][data.id]
        : {hfields: {}};
      
      for (var key in  this.cfmap) {
        var cfield = this.cfmap[key][data.field_cat.id];
        if (cfield === undefined)
          continue;

        var value = data[cfield.name];

        // Quick check for valid value
        if (value === undefined || value == "" || value == null) {
          if (value !== undefined)
            delete data[cfield.name];
          continue;
        }
          
        var record = {
            value: value,
            field: {
              id: cfield.id
            }
          };
        
        // Check if field has id
        if (cat.hfields[cfield.name] !== undefined)
          record.id = cat.hfields[cfield.name].id;

        fcat.push(record)
        delete data[cfield.name];
      }

      return data;
  };

  FieldList.prototype.refresh_data = function(data) {
      // Go through field list and dynamically update populated fields
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var fields = record["entity_fields"];

      for (var j = 0; j < fields.length; j++) {
          var cfield = fields[j];
          var fname = cfield.field.name;
          record[fname] = cfield.value;
      }
    }

    return BasicEntity.prototype.refresh_data.call(this, data);
  };

  FieldList.prototype.can_show = function(column, data) {
    // Only show fields with same field_cat_id as entity
    var cfr = this.cfmap[column.db_name];

    return cfr === undefined || cfr !== undefined && 
      data !== undefined && cfr[data.field_cat.value] !== undefined;
  };

  web_app.mod.entity_types["field_list"] = FieldList;
})(jQuery, jWebApp);