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

  // Empty option
  var EMPTY_OPTS = '<option></option>';

  /*****************************************/
  /*              Base Input               */
  /*****************************************/

  function BaseInput() {
    this.web_app = web_app;
    this.mod = web_app.mod;
  };

  // Abstract class
  BaseInput.prototype.set_error = function() {};
  BaseInput.prototype.clear_error = function() {};
  BaseInput.prototype.get_value = function() {};
  BaseInput.prototype.get_input = function(mod_name, filter) {};
  BaseInput.prototype.get_input_el = function(mod_name, filter) {};
  BaseInput.prototype.set_value = function(data) {};
  BaseInput.prototype.clear = function(data) {};

  BaseInput.prototype.init = function(column) {
    this.column = column;
  };

  BaseInput.prototype.t = function(lbl_id) {
    return this.web_app.ts(lbl_id);
  };

  BaseInput.prototype.get_filter = function(column, filters) {
    return filters !== undefined
    ? filters[this.column.db_name] !== undefined
      ? filters[this.column.db_name]
      : {}
    : {};;
  };

  /**
   * Set value into data structure for future save
   * 
   * @param {Object} data Data structure to send for save
   * @param {Object} value Saved value
   */
  BaseInput.prototype.save_value = function(data) {
    var value = this.get_value();

    // Ignore undefined
    if (value !== undefined)
      data[this.column.db_name] = value;
  };

  BaseInput.prototype.can_save = function(data) {
    // Ignore hidden and read_only values
    return !this.column.read_only && this.can_show(data);
  };

  BaseInput.prototype.input_check_required = function(data) {
    // Check if hidden or read_only or temporarily not shown
    return !(this.column.hidden || !this.can_show(data));
  };

  BaseInput.prototype.validate_input = function() {
    // Input Filter name
    var fname = this.column.ifilter;
    if (fname === undefined)
      return true;

    var value = this.get_value();
    var filter = web_app.filters[fname];

    if (!web_app.is_empty(filter.validation)) {
      var validation = RegExp(filter.validation);
      var ff = typeof filter.check == "function";
      
      if (!validation.test(value) || ff && !filter.check(value)) {
        //-- 10
        web_app.show_client_error(10, "Value [" + value +
            "] didn't pass filter [" + fname + "] validtion");
        this.set_error();
        
        return false;
      }
    }

    return true;
  };
  
  /** 
   * Conditionally decide show or hide element based on entity data
   * 
   * @param {Object} data 
   */
  BaseInput.prototype.can_show = function(data) {
    return (typeof this.column.can_show == "function"
      ? this.column.can_show(data)
      : true);
  };

  /*****************************************/
  /*            Base Text Input            */
  /*****************************************/

  function BaseTextInput() {
  };

  BaseTextInput.prototype = new BaseInput();

  BaseTextInput.prototype.get_input = function(mod_name, filters) {
    this.input = this.get_text_input(mod_name, filters);
    return this.input;
  };

  BaseTextInput.prototype.get_value = function() {
    return this.input !== undefined ? this.input.val() : undefined;
  };

  /**
   * Set value 
   * 
   * @param {Object} data 
   */
  BaseTextInput.prototype.set_value = function(data) {
    if (this.input !== undefined) {
      var value = data[this.column.db_name];

      // Aplly ont-the-fly translation, if required
      this.input.val(this.column.flang ? this.web_app.ts(value) : value);
    }
  };

  BaseTextInput.prototype.clear = function() {
    delete this.input;
  };

  /**
   * Get input element (or input boundaries)
   */
  BaseTextInput.prototype.get_input_el = function() {
    return this.input;
  };

  /**
   * Indicate error on input element (or input boundaries)
   */
  BaseTextInput.prototype.set_error = function() {
    this.input.addClass("error");
  };

  /**
   * Remove error indication error from input element (or input boundaries)
   */
  BaseTextInput.prototype.clear_error = function() {
    this.input.removeClass("error");
  };

  /*****************************************/
  /*          Base Selection Input         */
  /*****************************************/

  function BaseSelectionInput() {
  };

  BaseSelectionInput.prototype = new BaseInput();

  BaseSelectionInput.prototype.get_input = function(mod_name, filters) {
    this.selection = this.get_selection(mod_name, filters);
    return this.selection;
  };

  BaseSelectionInput.prototype.get_value = function() {
    if (this.selection !== undefined)
      return this.selection.val();
  };

  BaseSelectionInput.prototype.validate_input = function() {
    // Validation never required
    return true;
  };

  BaseSelectionInput.prototype.clear = function() {
    delete this.selection;
  };

  /**
   * Indicate error on input element (or input boundaries)
   */
  BaseSelectionInput.prototype.set_error = function() {
    this.selection.addClass("error");
  };

  /**
   * Remove error indication error from input element (or input boundaries)
   */
  BaseSelectionInput.prototype.clear_error = function() {
    this.selection.removeClass("error");
  };

  /**
   * Get input element (or input boundaries)
   */
  BaseSelectionInput.prototype.get_input_el = function() {
    return this.selection;
  };

  /*****************************************/
  /*              User Input               */
  /*****************************************/

  function UserInput() {}

  UserInput.prototype = new BaseTextInput();

  UserInput.prototype.get_text_input = function(mod_name, filters) {

    var input = $('<input type="text" class="field"' +
      (this.column.max_size !== undefined 
        ? ' maxlength="' + this.column.max_size + '"' 
        : "") + 
      
      (this.column.width !== undefined 
        ? ' style="width:' + this.column.width  + '"' 
        : "") + 
          
      (this.column.default_value !== undefined 
        ? ' value="' + this.column.default_value  + '"' 
        : "") +

      '/>');

      // Add input filter
    web_app.add_filtered_handler_ex(input, this.column.ifilter);

    return input;
  };

  web_app.mod.input_types["user_input"] = UserInput;

  /*****************************************/
  /*              Text Input               */
  /*****************************************/

  function TextArea() {}

  TextArea.prototype = new BaseTextInput();

  TextArea.prototype.get_text_input = function(mod_name, filters) {
    var el = $('<textarea class="field" placeholder="' +
        (this.column.max_size === undefined 
          ? this.web_app.ts("LL_MAX_255_CHAR") 
          : this.column.max_size + " " + this.web_app.t("LL_CHAR_MAX")) + '"' +
      (this.column.max_size !== undefined 
        ? ' maxlength="' + this.column.max_size + '"' 
        : "") + 
      
      (this.column.width !== undefined 
        ? ' style="width:' + this.column.width  + '"' 
        : "") + 
          
      (this.column.default_value !== undefined 
        ? ' value="' + this.column.default_value  + '"' 
        : "") +

      '/>');

    var me = this;
    el.keydown(function(){
      me.clear_error();
    });

    return el;
  };

  web_app.mod.input_types["text_area"] = TextArea;

  /*****************************************/
  /*           Entity Selection            */
  /*****************************************/
  
  function EntitySelection() {}

  EntitySelection.prototype = new BaseSelectionInput();

  EntitySelection.prototype.get_selection = function(mod_name, filters) {
    var filter = this.get_filter(this.column, filters);

    // If filter Id is supplied than find filtering id
    var dfilters;
    if (filter.name !== undefined)
      dfilters = filter.name.split(".");
      
    var opts = "";
    
    var rent = this.mod.modules[mod_name].data[this.column.ref_entity];
    
    // Look for ref entity
    var cnt = 0;
    for (var idx in rent) {
      var record = rent[idx];
      
      // Check if filtering required
      var fadd = true;
      if (!this.web_app.is_empty_array(dfilters)) {
        var fvalue = record;
        for (var idx in dfilters)
          fvalue = fvalue[dfilters[idx]];
          
        fadd = fvalue == filters[this.column.db_name].value;
      }
      
      if (fadd) {
        cnt++;

        // Check if reference field is a link
        var ref_field = this.column.ref_field !== undefined 
          ? this.column.ref_field 
          : "name";

        var text = record[ref_field];
        opts += '<option value="' + record.id + '"' + '>' +
          (this.column.flang ? this.web_app.ts(text) : text) + '</option>';
      }
    }
    
    // Add optional select choice
    if (cnt > 1)
      // Add empty selection
      opts = '<option value="">' + this.t("LL_SELECT") +
          '</option>' + opts;
     
    var selection = $('<select class="field">' + opts + '</select>');

    selection.change(function() {
      $(this).removeClass("error");
    });

    return selection;
  };

  EntitySelection.prototype.set_value = function(data) {
    // Remove last ref field
    var fields = this.column.db_name.split(".");

    // Remove last element and replace with id
    fields.pop();
    this.selection.val(this.mod.get_ref_value(data, fields.join(".") + ".id"));
  };

  EntitySelection.prototype.save_value = function(data) {
    var list = this.column.db_name.split(".");
    // Ignore complex structures
    if (list.length == 2 )
      this.mod.set_ref_value(data, list[0]  + ".id", this.get_value());
  };

  web_app.mod.input_types["entity_selection"] = EntitySelection;

  /*****************************************/
  /*             Static Value              */
  /*****************************************/
  
  function StaticValue() {};

  StaticValue.prototype = new BaseInput();

  StaticValue.prototype.get_input = function(mod_name, filters) {
    this.el = $('<span class="field field-static"></span>');

    var sfilter = this.get_filter(this.column, filters);
    if (sfilter !== undefined) {
      this.el.html(sfilter.text);
      this.el.data("value", sfilter.value);
    }

    return this.el;
  };

  StaticValue.prototype.get_filter = function(column, filters) {
    // Take last entity from db_name as filter name
    var list = this.column.db_name.split("."); 
    var rent = list[list.length - 2];

    return filters !== undefined
      ? filters[rent] !== undefined
        ? filters[rent]
        : {}
    : {};
  };

  StaticValue.prototype.get_value = function() {
    return this.el.data("value");
  };

  StaticValue.prototype.set_value = function(data) {
    var db_name;
    var dlist = this.column.db_name.split(".");

    var flong = dlist.length > 1;
    if (flong) {
      // Remove last element and combine back
      dlist.pop();
      db_name = dlist.join(".");
    } else {
      db_name = this.column.db_name;
    }

    this.el.data("value", flong ? this.mod.get_ref_value(data, db_name + ".id") : data.id);
    var text = flong ? this.mod.get_ref_value(data, this.column.db_name) : data[db_name];
    
    // Apply on-th-fly translation, if required
    this.el.html(this.column.flang ? this.web_app.ts(text) : text);
  };

  StaticValue.prototype.save_value = function(data) {
    // Ignore complex structures
    var list = this.column.db_name.split(".");
    if (list.length == 2) {
      data[list[0]] = {
        "id": this.get_value()
      }
    }
  };

  StaticValue.prototype.input_check_required = function() {
    // Input check never required
    return false;
  };

  StaticValue.prototype.validate_input = function() {
    // Validation never required
    return true;
  };

  web_app.mod.input_types["static_value"] = StaticValue;

  /*****************************************/
  /*          Static Value List            */
  /*****************************************/
  
  function StaticValueList() {};

  StaticValueList.prototype = new StaticValue();

  StaticValueList.prototype.set_value = function(data) {
    this.el.html(web_app.get_top_list_fmt_dts(data[this.column.db_name], "created"));
  };

  StaticValueList.prototype.save_value = function(data) {
    // Do nothing
  };

  web_app.mod.input_types["static_value_list"] = StaticValueList;

  /*****************************************/
  /*       Calculated Selection List       */
  /*****************************************/
  
  function CalculatedSelectionList() {}

  CalculatedSelectionList.prototype = new BaseSelectionInput();

  CalculatedSelectionList.prototype.get_selection = function(mod_name, filters) {
    // Create list of selection
    var rent = this.mod.modules[this.column.ref_mod !== undefined 
      ? this.column.ref_mod
      : mod_name].data[this.column.ref_entity];

    // Aways Add empty selection
    var opts = '<option value="">' + this.web_app.t("LL_SELECT") +
          '</option>';

    for (var idx in rent) {
      var record = rent[idx];
      var formatter = this.column.formatter;
      if (formatter.charAt(0) == "@")
        formatter = this.mod.get_ref_value(record, formatter.substr(1));

      opts += '<option value="' + record.id + '"' + '>' +
        this.mod[formatter].call(this, record, ", ") + '</option>';
    }

    return $('<select class="field"' + 
      (this.column.width !== undefined ? ' style="width:' + this.column.width + '"' : "") +
        '>' + opts + '</select>');
  }

  /**
   * Set value 
   * 
   * @param {Object} data 
   */
  CalculatedSelectionList.prototype.set_value = function(data) {
    if (this.selection !== undefined)
      this.selection.val(data[this.column.db_name]);
  };

  web_app.mod.input_types["calc_sel_list"] = CalculatedSelectionList;
  

  /*****************************************/
  /*               Date Input              */
  /*****************************************/
  
  function DateInput() {
    this.min_interval = 5;

    // Prepare list with hours 00-23
    this.hours = EMPTY_OPTS;
    for (var i = 0; i <= 23; i++)
      this.hours += '<option value="' + i + '">' +
        (i < 10 ? "0" + i : i) + '</option>';

    // Prepare list with minutes in 15 min interval
    this.minutes = EMPTY_OPTS;
    for (var i = 0; i < 60/this.min_interval; i++) {
      var mts = i * this.min_interval ;
      this.minutes += '<option value="' + mts + '">' +
      (mts < 10 ? "0" + mts : mts) + '</option>';
    }
  }

  DateInput.prototype = new BaseInput();

  DateInput.prototype.get_input = function(mod_name, filters) {
    this.dpicker = $('<input class="dpicker"' +
      (this.column.max_size !== undefined 
        ? ' maxlength="' + this.column.max_size + '"' 
        : "") + 
      
      (this.column.width !== undefined 
        ? ' style="width:' + this.column.width  + '"' 
        : "") + 
          
      (this.column.default_value !== undefined 
        ? ' value="' + this.column.default_value  + '"' 
        : "") +
    '/>').datepicker(
      $.datepicker.regional[this.web_app.lang]
    );

    // Set Min Date
    if (this.column.from_now)
      this.dpicker.datepicker("option", "minDate", new Date());

    this.hsel = $('<select class="hours" disabled>' + this.hours + '</select>');
    this.msel = $('<select class="minutes" disabled>' + this.minutes + '</select>');

    this.cbtn = $('<button class="btn btn-secondary ml-2" disabled>' + this.web_app.t("LL_CLEAR") + '</button>');
    this.nbtn = $('<button class="btn btn-primary ml-2">' + this.web_app.t("LL_NOW") + '</button>');

    this.el = $('<div class="field"></div>');

    var me = this;
    this.dpicker.on("change", function() {
      // Check if any date entered or field cleared
      var value = me.dpicker.val();

      if (value)
        me.set_def_time();
      else
        me.clear();
    });

    this.cbtn.on("click", function() {
      me.clear();
    });

    this.nbtn.on("click", function() {
      if (me.dpicker.val() != "")
        me.clear();
      me.set_dts(new Date().toISOString());
    });

    return this.el.append(this.dpicker).append(this.hsel)
      .append("<span>:</span>").append(this.msel).append(this.cbtn).append(this.nbtn);
  };

  /**
   * Set default time when date is selected
   */
  DateInput.prototype.set_def_time = function() {
    if (!this.cbtn.prop("disabled"))
      // Don't set default time if it already set
      return;

    this.set_time("18", 0);
  };

  DateInput.prototype.set_time = function(hours, minutes) {
    // Remove first "undefined" selection from hours and minutes
    $(this.hsel.children()[0]).remove();
    $(this.msel.children()[0]).remove();

    // Set default time 18:00
    $('option[value=' + hours + ']', this.hsel).prop("selected", true);
    $('option[value=' + minutes + ']', this.msel).prop("selected", true);

    this.hsel.prop("disabled", false);
    this.msel.prop("disabled", false);
    this.cbtn.prop("disabled", false);
    this.clear_error();
  };

  DateInput.prototype.clear = function(el) {
    // Quick check
    if (this.el === undefined)
      return;

    // Remove first "undefined" selection from hours and minutes
    this.hsel.prepend(EMPTY_OPTS);
    this.msel.prepend(EMPTY_OPTS);

    // Set undefined hours/min
    this.hsel.val("");
    this.msel.val("");

    this.dpicker.val("");

    this.hsel.prop("disabled", true);
    this.msel.prop("disabled", true);
    this.cbtn.prop("disabled", true);
  };

  /**
   * Get value for validation purposes
   * 
   * @param {Object} el 
   */
  DateInput.prototype.get_value = function() {
    var value = this.dpicker.val();

    if (value == "")
      return "";

    // Get date
    var date = this.dpicker.datepicker("getDate");
    
    if (date == null)
      return "";

    // Add time
    var dts = new Date(date.getTime() +
      Number.parseInt(this.hsel.val()) * 3600000 + 
      Number.parseInt(this.msel.val()) * 60000);
    
    return dts.toISOString();
  };

  DateInput.prototype.set_value = function(data) {
    // Split date & time
    var ditem = data[this.column.db_name];

    // Quick check for nothing
    if (ditem == "" || ditem == undefined)
      return;
     
    // Add Z for UTC offset
    this.set_dts(ditem);
  };

  DateInput.prototype.set_dts = function(ditem) {
    var dts = new Date(ditem + (ditem.substr(ditem.length -1) != "Z" ? "Z" : ""));
    this.dpicker.datepicker("setDate", dts);

    // Round minutes down
    var min = dts.getMinutes();
    this.set_time(dts.getHours(),  Math.floor(min/this.min_interval) * this.min_interval);
  };

  /**
   * Get input element (or input boundaries)
   */
  DateInput.prototype.get_input_el = function() {
    return this.msel;
  };

  /**
   * Indicate error on input element (or input boundaries)
   */
  DateInput.prototype.set_error = function() {
    this.dpicker.addClass("error");
    this.msel.addClass("error");
    this.hsel.addClass("error");
  };

  /**
   * Remove error indication error from input element (or input boundaries)
   */
  DateInput.prototype.clear_error = function() {
    this.dpicker.removeClass("error");
    this.msel.removeClass("error");
    this.hsel.removeClass("error");
  };

  web_app.mod.input_types["date_input"] = DateInput;
})(jQuery, jWebApp);