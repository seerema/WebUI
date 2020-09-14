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

(function($) {

  // Version
  var VERSION = "1.0.0";
  
  // Name of language parameter
  var LANG_PARAM_NAME = "lang";

  // Default locale fo each language
  var DEF_LANG_LOCALES = {
    "en" : "US",
    "fr" : "CA",
    "ru" : "RU",
    "es" : "ES",
    'de' : "DE"
  };
  
  var DEFAULT_LANG = (window["DEFAULT_LANG"] !== undefined)
    ? window["DEFAULT_LANG"] : "en";
  
  // List of client error. Reserved id [1..9]
  var ERR_LIST = {
    1: "LL_ERROR_WS_NOT_AVAILABLE",
    2: "LL_ERROR_CHECKING_VERSION",
    3: "LL_ERROR_INCOMPATIBLE_GUI_WS_VERSION",
    4: "LL_ERROR_LOADING_WEB_APP",
    5: "LL_ERROR_LOADING_WEB_APP",
    6: "LL_INVALID_AUTH_CONFIG",
    7: "LL_ERROR_LOGOUT"
  };
  
  // Integer Filter
  var INT_FILTER = {
    regex: '[-\\d]',
    info: "LL_INT_FILTER_INFO",
    validation: '^-?\\d*$'
  };

  // Positive Integer Filter
  var INT_POS_FILTER = {
    regex: '[\\d]',
    info: "LL_INT_FILTER_INFO",
    validation: '^\\d*$'
  };
  
  // Positive Non-Zero Integer Filter
  var INT_POS_NZ_FILTER = {
    regex: '[\\d]',
    info: "LL_INT_FILTER_INFO",
    validation: '^[1-9]{1}\\d*$'
  };
  
  // Numeric Filter
  var NUM_FILTER = {
    regex: '[-\\d\\.]',
    info: "LL_NUM_FILTER_INFO",
    validation: '^-?\\d*(\\.\\d+)?$'
  };
  
  // Date Filter
  var DATE_FILTER = {
    regex: '[\\d-]',
    info: "LL_DATE_FILTER_INFO",
    validation: '^[0|1|2]\\d{3}-[0|1]?\\d-[0|1|2|3]?\\d$',
    class: "date",
    check: function(value) {
      var date = new Date(value);
      return date instanceof Date && !isNaN(date.valueOf());
    }
  };

  // Media types
  var APPLICATION_JSON = "application/json";
  
  /**************** Log ****************/

  function Log() {
    this.enabled = false;
  }

  Log.prototype.enable = function() {
    this.enabled = true;
  };

  Log.prototype.has_console = function() {
    // IE only support console from v 9
    return ( typeof console != "undefined");
  };

  Log.prototype.debug = function(msg) {
    if (this.enabled && this.has_console())
      console.log(msg);
  };

  Log.prototype.error = function(msg) {
    if (this.has_console())
      console.error(msg);
  };

  /**************** Trace ****************/

  function Trace() {
    this.enabled = false;
    this.start = new Date().getTime();
    this.events = [];
  }


  Trace.prototype.init = function(event) {
    this.calc_diff(event);
  };

  Trace.prototype.register = function(event) {
    if (this.enabled)
      this.calc_diff(event);
  };

  Trace.prototype.enable = function() {
    this.enabled = true;
  };

  Trace.prototype.calc_diff = function(event) {
    this.events.push({
      event : event,
      time : (new Date().getTime() - this.start) / 1000
    });
  };

  /**************** Custom module ****************/
  function Mod(web_app) {
    this.web_app = web_app;
  }
  
  Mod.prototype.get_name = function() {
    return this.config.sys_name;
  };
  
  /*****************************/
  /**     Web Application     **/
  /*****************************/
 
  function WebApp() {};

  WebApp.prototype.get_config = function() {
    return this.mod.config;
  };
  
  WebApp.prototype.init = function () {
    this.version = VERSION;

    // Root element id
    if (window["BASE_URL"] !== undefined)
      this.base_url = BASE_URL;
    this.root_path = window["ROOT_PATH"] !== undefined ? ROOT_PATH : "";
    
    // Parse Url Parameters
    this.params = {};
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        url = window.location.href,
        match;

    while (match = regex.exec(url))
      this.params[match[1]] = decodeURIComponent(match[2]);

    // Set debug flag
    this.log = new Log();
    if (this.params["debug"] !== undefined && 
          this.params["debug"].toLowerCase() == "on")
      this.log.enable();
      
    // Set trace flag
    this.trace = new Trace();
    if (this.params["trace"] !== undefined && 
                this.params["trace"].toLowerCase() == "on")
      this.trace.enable();

    // Set language
    var lname = this.params[LANG_PARAM_NAME];
    this.has_lparam = lname !== undefined;
    if (this.has_lparam) {
      // Check if simple lang or lang-LOCALE
      var dpos = lname.indexOf("-");
      this.lang = (dpos > 0) ? lname.substr(0, dpos) : lname;
      this.locale = (dpos > 0) ? lname : lname + "-" + 
            (DEF_LANG_LOCALES[lname] !== undefined ? 
                    DEF_LANG_LOCALES[lname] : lname.toUpperCase());
    } else {
      // Set default lang
      this.lang = DEFAULT_LANG;

      // Set default locale; Temporarily disabled
      this.locale = this.lang + "-" + DEF_LANG_LOCALES[this.lang];
    }
    
    // Assign initial error list
    this.err_list = ERR_LIST;

    // Define filters
    this.filters = {
      "int_filter": INT_FILTER,
      "int_pos_filter":  INT_POS_FILTER,
      "int_pos_nz_filter": INT_POS_NZ_FILTER,
      "num_filter": NUM_FILTER,
      "date_filter": DATE_FILTER
    };
    
    // Loaded lang labels
    this.ll = {};
  
    // All loaded lang set
    this.lls = [];
    
    // List of external modules
    this.modules = {};
    
    this.page_loader_id = "page-loader";
    
    web_app.mod = new Mod(web_app);
  };
  
  WebApp.prototype.load = function (on_ready, base) {
    this.config = this.get_config();
    
    // Show loading message
    this.show_loader(this.t("LL_LOADING_WEB_APP_RESOURCES"));
    
    var me = this;
    this.on_ready = on_ready;
    
    if (this.config.err_list !== undefined)
      ERR_LIST = $.extend(ERR_LIST, this.config.err_list);

    // Check if base defined
    var base = this.config.base;
    
    if (base !== undefined) {
      // Load module
      this.load_script("modules/" + base + "/js/main.js", 
        function() {
          // Call module main to initiate module
          // me.base = window[base + "_main"]();
          me.base = me.modules[base]();
          me.base.init_app(me);
          
          // Set possible parameters
          // me.base.setParams(me.config[base]);
          
          me.base.load(function() {
            me.load_resources();
          }, base);
        }
      );
    } else {
      // Start resource load
      this.load_resources();
    }
  };

  /**
   * Init child application
   */
  WebApp.prototype.init_app = function (app) {
    // Set parent application
    this.app = app;
          
    this.base_url = app.base_url;
    this.root_path = app.root_path;
    this.log = app.log;
    this.trace = app.trace;
    this.lang = app.lang;
    this.locale = app.locale;
    this.err_list = app.err_list;
    this.ll = app.ll;
    this.lls = app.lls;
    
    this.bs = app.bs;
    this.mod = app.mod;
    this.ctx_id = app.ctx_id;
    this.web_ctx = app.web_ctx;
    this.err_win = app.err_win;
    this.login_win = app.login_win;
    this.web_root = app.web_root;
    this.page_loader = app.page_loader;
    this.success_win = app.success_win;
  };
  
  /**
   * Load web app resources
   */
  WebApp.prototype.load_resources = function() {
    var me = this;
    
    // Number of resources to load
    this.rcnt = 0;
    
    // Start loading additional modules (if any)
    var fscripts = (this.config.scripts !== undefined && 
                              this.config.scripts.length > 0);
    if (fscripts)
      this.rcnt += this.config.scripts.length;
    
    var fstyles = (this.config.styles !== undefined && 
                                this.config.styles.length > 0);
    if (fstyles)
      this.rcnt += this.config.styles.length;
    
    if (this.rcnt > 0) {  
      if (fscripts) {
        for (var i in this.config.scripts) {
          this.load_script(this.get_resource_prefix() + 
            "/js/" + this.config.scripts[i], function() {
              me.rcnt--;
          });
        }
      }
      
      if (fstyles) {
        for (var i in this.config.styles) {
          this.load_style(this.get_resource_prefix() + "/css/" + this.config.styles[i],
            function() {
              me.rcnt--;
          });
        }
      }
      
      // Start checking procedure
      window.setTimeout(function() {
        me.check();
      }, 50);
    } else {
      this.on_resource_ready();
    }
  };

  /**
   * Check if all resource loaded
   */
  WebApp.prototype.check = function () {
    var me = this;
    if (this.rcnt > 0)
      window.setTimeout(function() {
        me.check();
      }, 50);
    else
      this.on_resource_ready();
  };
  
  WebApp.prototype.on_resource_ready = function() {
    // Set browser title
    var dtitle = this.ts("LL_TOOL_TITLE");
    if (dtitle != "LL_TOOL_TITLE")
      document.title = this.ts(dtitle);
    
    // Append menu (if any) and menu not initialized yet
    if (web_app.menu === undefined && 
          this.config.menu !== undefined && 
          this.config.menu.length > 0) {
      web_app.menu = (web_app.menu === undefined ? this.config.menu
        : web_app.menu.concat(this.config.menu));
    }
    
    // call resource loaded callback
    this.on_resource_loaded();
      
    // Start phase loader
    this.start();
  };

  WebApp.prototype.on_resource_loaded = function () {};
  
  /**
   * Start phase loader. Called from bootstraper or from parent web app
   */
  WebApp.prototype.start = function() {
    var me = this;
    
    // Quick check if phase loader is defined
    if (this.config.phase_loader === undefined) {
      this.hide_loader();
      this.on_load_completed();
      return;
    }
          
    this.phase_loader = this.config.phase_loader;
    this.phase_loader.web_app = this;
    
    this.start_phase_loader();
  };

  WebApp.prototype.start_phase_loader = function() {
    var me = this;
    
    if (this.phase_loader != undefined) {
      this.show_loader(this.t("LL_LOADING_WEB_APP"));
      
      this.phase_loader.start();
    } else {
      this.display();
    }
  };
  
  WebApp.prototype.on_load_completed = function() {
    if (typeof this.on_ready == "function")
      this.on_ready();
      
    web_app.trace.register(this.config.sys_name + " load completed.");
  };
  
  WebApp.prototype.finish = function() {
    this.create_menu();
    this.display();
  };
  
  WebApp.prototype.create_menu = function() {
    if (this.menu === undefined)
      return;
    
    // Check if menu already initialized
    if ($("img.menu", this.web_root).length > 0)
      return;
      
    var menu_btn = $('<img class="menu" src="' + this.root_path +
      'shared/images/menu.png" />');
    var menu = $('<div class="menu hidden"></div>');
        
    var me = this;
    var ul = $('<ul class="menu"></ul>');  
    for (var idx in this.menu) {
      var item = this.menu[idx];
      
      var li = $('<li class="menu-item">' + (item.icon !== undefined 
            ? '<img src="' + this.root_path + item.icon + '" />' : "") + 
        '<span class="menu-title">' + this.t(item.title) + "</span></li>");
        
      // Assign action
      if (item.action !== undefined) {
        li.click(function() {
          // Close menu first
          menu.hide();
          
          // Start action
          me.mod[item.action](li);
        });
      }
      
      ul.append(li);
    }
    
    // Check if logout required
    if (window["LOGOUT_URL"] !== undefined) {
        var logout = $('<li class="menu-item">' + (item.icon !== undefined 
            ? '<img src="' + this.root_path + 'shared/images/logout.png" />' : "") + 
        this.t("LL_LOGOUT") + "</li>");
        
        logout.click(function() {
            me.logout(menu);
          });
      
        ul.append(logout);
    }
      
    menu.append(ul);
    this.web_root.append(menu_btn);
    this.web_root.append(menu);
    
    menu_btn.click(function() {
      menu.fadeToggle("slow");
    });
  };
  
  WebApp.prototype.logout = function(menu) {
    // Double check
    if (!this.confirm())
      return;
      
    // Close menu first
    menu.hide();
    var me = this;
    
    // Start action
    //-- 7
    me.post_ajax_data(me.make_rel_req(LOGOUT_URL), 7,
      function() {
        // Clear context
        me.web_ctx.empty();
        
        // Reset phase loader
        me.phase_loader.reset();
        
        // Restart bootstrap
        me.bs.check_version();
      }
    );
  };
  
  /****************************************/
  /**     Resource Loading Functions     **/
  /****************************************/
  
  /**
   * Dynamically load external style by adding script element
   * 
   * @param {String} src script url
   * @param {Function} on_load callback on load
   * @param {Function} on_error callback on load 
   */
  WebApp.prototype.load_script = function(src, on_load, on_error) {
    var script = document.createElement("script");
    script.onload = on_load;
    if (typeof on_error == "function")
      script.onerror = on_error;
    script.src = ROOT_PATH + src;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  /**
   * Dynamically load external style by adding link element
   * 
   * @param {String} src style url
   * @param {Function} on_load  callback on load 
   */
  WebApp.prototype.load_style = function(src, on_load) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", ROOT_PATH + src);
    fileref.onload = on_load;
    document.getElementsByTagName("head")[0].appendChild(fileref);
  };

  /**
   * Get subdirectory where JavaScript resources located
   * Subdirectory is relative to web app root path
   */
  WebApp.prototype.get_resource_prefix = function() {
    return ".";
  };

  /**
   * Show web app context
   */
  WebApp.prototype.display = function() {
    this.web_ctx.removeClass("hidden");
  };

  /************************************/
  /**     Page Loading Functions     **/
  /************************************/
 
  WebApp.prototype.show_loader = function(msg) {
    this.page_loader.loading({
      "speed": 400,
      "maxDots": 5,
      "word": msg + " "
    });
  };
    
  WebApp.prototype.hide_loader = function() {
    this.page_loader.loading("stop");
    this.page_loader.hide();
  };
  
  /****************************/
  /**     Success Window     **/
  /****************************/

  WebApp.prototype.show_success_msg = function (msg) {
    $(".ok-msg", this.success_win).html(msg);
    
    var me = this;
    this.success_win.bPopup({
      appendTo: "." + this.ctx_id,
    });
  };

  /**************************/
  /**     Error Window     **/
  /**************************/
 
  WebApp.prototype.get_server_error = function(error) {
    return "ERROR " + error.id + " - " + 
        error.info + "." + (error.details !== undefined ? " " + error.info : "");
  };

  WebApp.prototype.show_client_error = function(error_id, info, cfield) {
    this.show_error_win("C-" + error_id, 
        this.t(this.err_list[error_id]), 0, info, cfield);
  };

  WebApp.prototype.show_client_error_substr = function(error_id, cfield, args) {
    var err_lbl = this.t(ERR_LIST[error_id]);
    for (var key in args)
      err_lbl = err_lbl.replace("[" + key + "]", args[key]);
    this.show_error_win("C-" + error_id, err_lbl, "", cfield);
  }

  WebApp.prototype.show_server_error = function(error) {
    this.show_error_win(error.id, error.info, error.request_id, error.details);
  };
  
  WebApp.prototype.show_error_win = function(id, detail, req_id, info, cfield) {
    // Check if any popup registered
    this.check_close_popup();
	
    $(".err-code", this.err_win).html(id);
    $(".err-details", this.err_win).html(detail);
    if (req_id) {
      $(".req-text", this.err_win).show();
      $(".req-id", this.err_win).html(req_id);
    } else {
       $(".req-text", this.err_win).hide();
    }

    // Hide Info
    $(".err-info", this.err_win).hide();

    if (!this.is_empty(info)) {
      $(".err-info", this.err_win).html(info);
      $(".btn-err-toggle", this.err_win).show();
    } else {
      $(".btn-err-toggle", this.err_win).hide();
    }

    if (cfield !== undefined)
      cfield.addClass("error");

    var me = this.err_win;
    this.err_win.bPopup({
      appendTo: "." + this.ctx_id,
      onClose: function() {
        if (cfield !== undefined)
          cfield.focus();
      },
      onOpen: function() {
        // Temporarily disabled
        // this.css("max-width", this.outerWidth());
      }
    });
  };

  WebApp.prototype.show_ajax_error_ex = function(error_id, ajax_error, cfield) {
    this.show_error_win("C-" + error_id, this.t(this.err_list[error_id]), 
      0, ajax_error, cfield);
  };

  WebApp.prototype.toggle_error_details = function() {
    var me = this;
    
    $(".err-info", this.err_win).toggle("slow", function() {
      // Switch icon
      $(".btn-err-toggle img.top", me.err_win).toggleClass("hidden");
      $(".btn-err-toggle img.bottom", me.err_win).toggleClass("hidden");
    });
  };
  
    /**
   * After error chec,
   *
   * @param ferr {Function} after error callback function
   * @param msg {String} error message
   * @param error {String} either http status code for cases when http call failed
   *    or error structure for server side errors
   */
  WebApp.prototype.ajax_err_check = function(ferr, msg, error) {
    if ( typeof ferr == "function")
      ferr(msg, error);
  };

  /**
   * Convert ajax error variables into string
   *
   * @param {Object} jqXHR superset of the XMLHTTPRequest object
   * @param {String} msg string describing the type of error that occurred.
   *    Possible values for the second argument (besides null) are
   *    "timeout", "error", "abort", and "parsererror".
   * @param {Object} error optional exception object, if one occurred
   * @return String with formatted error message
   */
  WebApp.prototype.get_ajax_error = function(jqXHR, msg, error) {
    msg = msg.toUpperCase();
    if (jqXHR.status !== undefined)
      msg += " " + jqXHR.status;

    if (this.log.enabled) {
      if ( typeof error == "object") {
        if (error.message !== undefined)
          msg += ". " + error.message;
      } else if ( typeof error == "string" && error != jqXHR.status) {
        msg += ". " + ((error.indexOf("ERROR") == 0) ? error : error.toUpperCase());
      }
    }

    return msg;
  };

  /**************************/
  /**     Login Window     **/
  /**************************/
 
  WebApp.prototype.show_login_win = function() {
    this.check_close_popup();
    
    $(".login-error", this.login_win).hide();
    
    // Check if login url defined
    if (window["LOGIN_URL"] === undefined) {
      this.show_client_error(6, "LOGIN_URL is not defined.");
      return;
    }
    
    var me = this;
    this.login_win.bPopup({
      appendTo: "." + this.ctx_id,
      escClose: false,
      modalClose: false,
      onClose: function() {
        // Reload bootstrap
        window.setTimeout(function() {
          me.bs.check_version();
        }, 0);
      },
    });
  };
  
  WebApp.prototype.login = function(btn) {
    var me = this;
    
    var err_msg = $(".login-error", this.login_win);
    
    // Disable sign-in button
    this.enable_wait_btn(btn);
    
    this.post_ajax_data(me.make_rel_req_query(LOGIN_URL, undefined, 
    'usr=' + $("input.username", this.login_win).val() + '&' +
    'pwd=' + $("input.password", this.login_win).val()), 0, 
    function(data) {
      if (me.is_empty(data)) {
        err_msg.show().html("LL_ERROR_EMPTY_AUTH_RESPONSE");
        return;
      }
      
      // Collect roles
      if (me.is_empty_array(data.roles)) {
        err_msg.show().html("LL_ERROR_INVALID_USER_CONFIG_NO_ROLES");
        return;
      }
      
      // Save role list in cookie
      $.cookie("ROLES", data.roles.join(","));
      
      // Enable sign-in button
      me.disable_wait_btn(btn);
      
      // Close popup
      window.setTimeout(function() {
        me.login_win.bPopup().close();
      }, 0);
    },
    function(msg, error) {
      if (error == 401) {
        err_msg.show().html(me.t("LL_ERROR_INVALID_CREDENTIALS"));
      } else {
        err_msg.show().html(msg);
      }
      
      // Enable sign-in button
      me.disable_wait_btn(btn);
      
    }, "application/x-www-form-urlencoded");
  };
  
  WebApp.prototype.check_btn_authz = function(container, config) {
    $("button", container).each(function(){
      var btn = $(this);
      
      // Check any restricted button
      for (var cname in config) {
        
        if (btn.hasClass(cname)) {
          // Check any role matches
          var fmatch = false;

          // Check for roles if was authenticated
          if (window["LOGIN_URL"] !== undefined) {
            var roles = $.cookie("ROLES").split(",");
            for (var idx in roles)
              if ($.inArray(roles[idx], config[cname]) != -1) {
                fmatch = true;
                break;
              }
            
            if (!fmatch)    
              // None of roles matching  Disable button
              btn.attr("disabled", "disabled");
          }
        }
      }
    });
  };
  
  /*******************************/
  /**     Generic Functions     **/
  /*******************************/

  /**
   * Check if any popup open and close if such found.
   */
  WebApp.prototype.check_close_popup = function() {
    // Check if any popup registered
    var bpop = this.web_root.data("popup");
    if (bpop !== undefined)
      bpop.bPopup().close();
  };  
 
  /**
   * Check if variable is empty
   */
  WebApp.prototype.is_empty = function(msg) {
    return (msg === undefined || msg == "");
  };

  /**
   * Check if array is empty
   */
  WebApp.prototype.is_empty_array = function(list) {
    return (list === undefined || list.length == 0);
  };

  WebApp.prototype.uc_first_char = function(msg) {
    return msg.charAt(0).toUpperCase() + msg.substr(1);
  };
  
  WebApp.prototype.get_root_el = function() {
    return $("#" + this.root_el_id);
  };
  
  /**
   * Standard confirm check
   */
  WebApp.prototype.confirm = function() {
    // Double check
    return confirm(this.t("LL_PLEASE_CONFIRM"));
  };
  
  /**
   * Get copyright footer
   */
  WebApp.prototype.get_copyright = function() {
    return '<div class="copyright text-center">' + 
            '<span>&copy; Ivalab ' + (new Date()).getFullYear() + '</span>' + 
        '</div>';
  };
  
  /**
   * Re-index data array by element's' id
   */
  WebApp.prototype.reindex_data = function(data) {
    // Quick check
    if (this.is_empty_array(data))
      return;
      
    var hdata = {};
    for (var idx in data)
      hdata[data[idx].id] = data[idx];
      
    return hdata;
  };
  
  /**
   * Get format date/time from list item value or LL_NEVER
   * @param {Date} value 
   */
  WebApp.prototype.get_top_list_fmt_dts = function(list, key) {
    return this.is_empty_array(list)
          ? web_app.t("LL_NEVER") : this.format_date_time(list[0][key]);
  };

  /**
   * Format date/time from ISO8601 format YYYY-MM-DDTHH:MM:SS
   * @param {Date} value
   * @param {Boolean} Flag to add seconds 
   */
  WebApp.prototype.format_date_time = function(value, fsec) {
    // Add Z to indicate it's UTC time
    var dts = new Date(value + 
      (value.substr(value.length -1) != "Z" ? "Z" : ""));
    return $.datepicker.formatDate(
      $.datepicker.regional[web_app.lang].dateFormat, dts) + " " +
      web_app.format_time(dts, fsec);
  };

  /**
   * Format time portion of Date into HH:MM:SS
   * @param {Date} value 
   */
  WebApp.prototype.format_time = function(value, fsec) {
    var hours = value.getHours();
    var minutes = value.getMinutes();
    var seconds = value.getSeconds();

    return (hours < 10 ? "0" + hours : hours) + ":" + 
      (minutes < 10 ? "0" + minutes : minutes) + 
      (fsec ? ":" + 
        (seconds < 10 ? "0" + seconds : seconds)
        : "");
  };

  /********************************/
  /**     Language Functions     **/
  /********************************/

  WebApp.prototype.is_def_lang = function() {
    return this.lang == DEFAULT_LANG;
  };

  WebApp.prototype.set_def_lang = function() {
    this.set_lang(DEFAULT_LANG);
  };

  WebApp.prototype.set_lang = function(lang) {
    // Skip if lang already initialized via url parameter
    if (this.lang !== undefined)
      return;
      
    this.lang = lang;
    this.locale = this.lang + "-" + DEF_LANG_LOCALES[this.lang];

    // Recreate translated lang labels array
    for (var i in this.lls)
      this.add_ll_set(this.lls[i]);
  };

  /**
   * Load lang labels set into global array and add individual lang labels
   * 
   * @param ll_set {Object} lang labels set
   * 
   */
  WebApp.prototype.load_ll_set = function(ll_set) {
    this.lls.push(ll_set);
    this.add_ll_set(ll_set);
  };
  
  /**
   * Load add individual lang labels
   * 
   * @param ll_set {Object} lang labels set
   * 
   */
  WebApp.prototype.add_ll_set = function(ll_set) {
    // Filter all lang labels for current locale
    for (var lbl_id in ll_set)
      this.ll[lbl_id] = ll_set[lbl_id][this.lang];
  };

  /**
   * Return translated label. If lbl_id not found in
   *  loaded locale labels array than it returns capital lbl_id with
   *  red font tag attached
   *
   * @param {String} lbl_id Label Id in loaded locale labels array
   * @return {String} Translated label according current LANG
   */
  WebApp.prototype.t = function(lbl_id) {
    return this.get_lang_label_ex(lbl_id, false);
  };

  /**
   * Return translated label. If lbl_id not found in
   *  loaded locale labels array than it returns capital lbl_id
   *
   * @param {String} lbl_id Label Id in LANG_LABELS array
   * @return {String} Translated label according current LANG
   *
   */
  WebApp.prototype.ts = function(lbl_id) {
    return this.get_lang_label_ex(lbl_id, true);
  };

  /**
   * Return translated label.
   *
   * @param {String} lbl_id Label Id in loaded locale labels array
   * @param {Boolean} simple Boolean flag to control format of returned data
   * @return {String} Translated label according current lang
   *    If lbl_id not found in loaded locale labels array and
   *    simple == False than it returns capital lbl_id with
   *    red font tag attached
   *
   *    If lbl_id not found in loaded locale labels array and
   *    simple == True than it returns capital lbl_id
   */
  WebApp.prototype.get_lang_label_ex = function(lbl_id, simple) {
    return (this.is_empty(this.ll[lbl_id])) ? ( simple ? lbl_id : 
        '<font color="red"><b>' + lbl_id + '</b></font>') : this.ll[lbl_id];
  };
  
  /*******************************************/
  /**    API Request Service Functions      **/ 
  /*******************************************/
 
  WebApp.prototype.make_abs_req = function(url) {
    return {
      abs: true,
      url: url
    };
  };

  /**
   * Create request with parameter appended to URL 
   *    i.e url?param1=value1&param2=value2 
   * 
   * @param url URL
   * @param query_params HasMap with parameters
   * 
   * @return Request object
   */
  WebApp.prototype.make_abs_req_query = function(url, query_params) {
    if (query_params !== undefined) {
        var qs = "";
        for (var key in query_params)
          qs += "&" + key + "=" + query_params[key];
          
        if (qs.length != "")
          url += "?" + qs.substr(1);
      }
      
    return this.make_abs_req(url);
  };

  WebApp.prototype.make_rel_req_base = function() {
    var req = {
      abs: false,
      query_params: {}
    };

    // Check if debug flag on
    if (this.params["debug"] !== undefined && 
      this.params["debug"].toLowerCase() == "on")
        req.query_params["debug"] = "on";

    return req;
  };

  WebApp.prototype.make_rel_req = function(api, data) {
    var res = this.make_rel_req_base();
    res.api_name = api;
    
    if (data != undefined)
      res.data = data;
      
    return res;
  };
  
  WebApp.prototype.make_rel_req_path = function(api, path_param, data) {
    var res = this.make_rel_req(api);
    if (path_param !== undefined)
      res.path_params = (typeof path_param == "number" 
        ? [path_param] : path_param.split("/"));
    
    if (data != undefined)
      res.data = data;
      
    return res;
  };

  WebApp.prototype.make_rel_req_query = function(api, query_params, data) {
    var res = this.make_rel_req(api);
    $.extend(res.query_params, query_params);
    
    if (data != undefined)
      res.data = data;
      
    return res;
  };

  WebApp.prototype.make_rel_req_ex = function(api, path_param, query_params, data) {
    var res = this.make_rel_req_path(api, path_param, data);
    $.extend(res.query_params, query_params);
    return res;
  };

  /*******************************************/
  /**           Ajax & Wrappers             **/ 
  /*******************************************/
 
    /**
   * Generic ajax request function
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @request Absolute or Relative Request URL
   *    {
   *      absolute: boolean
   *
   *      // Absolute url has only 1 parameter where full url included
   *      url: string
   *
   *      // Relative URL has next section:
   *      api_name: string
   *      path_params: array
   *      query_params: array
   *    }
   * @http_method HTTP Method
   * @error_id Custom Error Id
   * @on_success Function to execute on success call
   * @after_error Function to execute after standard error handler
   * @param {Object} ex_data Extra data to append
   */
  WebApp.prototype.ajax = function(request, http_method, error_id, on_success, after_error, ex_data) {
    var adata = {
      url : jWebApp.get_url(request),
      method : http_method,
      success : function(data) {
        if (data == null && error_id > 0) {
          var err_msg = "Empty Result";
          web_app.show_client_error(error_id, err_msg);
          web_app.ajax_err_check(after_error, err_msg);
        } else if (data.error !== undefined) {
          if (error_id > 0)
            web_app.show_server_error(data.error);

          web_app.ajax_err_check(after_error, 
              web_app.get_server_error(data.error), data.error);
        } else {
          on_success(data);
        }
      },
      error : function(jqXHR, msg, error) {
        var ajax_error = web_app.get_ajax_error(jqXHR, msg, error);

        if (error_id > 0)
          web_app.show_ajax_error_ex(error_id, ajax_error);

        // For negative error include error id into callback message
        var err_msg = (error_id >= 0) 
          ? ajax_error 
          : web_app.t("LL_ERROR_C") + " #C-" + (-error_id) + "<br />" + 
                web_app.t(ERR_LIST[-error_id]) + "<br />" + ajax_error;

        web_app.ajax_err_check(after_error, err_msg, jqXHR.status);
      }
    };

    if (ex_data !== undefined) {
      for (var key in ex_data) {
        var value = ex_data[key];

        if (key == "contentType")
          value = jWebApp.check_ctype(value);
        if (value !== undefined)
          adata[key] = value;
      }
    }

    var rdata = jWebApp.get_data(request, http_method);  
    if (!this.is_empty(rdata))
      adata.data = rdata;
    
    $.ajax(adata);

  };

  /**
   * Generic ajax request function
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {String} error_id Custom Error Id
   * @param {Function} on_success Function to execute on success
   *
   */
  WebApp.prototype.get_ajax = function(req, error_id, on_success) {
    this.ajax_req_base(req, "get", error_id, on_success);
  };
  
  /**
   * Generic ajax request function
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {Function} on_success Function to execute on success
   * @param {Function} on_error Function to execute after standard error handler
   *
   */
  WebApp.prototype.get_ajax_simple = function(req, on_success, on_error) {
    this.ajax_req_base(req, "get", 0, on_success, on_error);
  };

  WebApp.prototype.get_ajax_ext = function(req, error_id, on_success, after_error) {
    this.ajax_req_base(req, "get", error_id, 
      function(data) {
        // Unwrap data and call original handler
        if (data.result)
          on_success(data.data);
      }
    , after_error);
  };

  WebApp.prototype.put_ajax_data_ext = function(req, error_id, 
                                    on_success, after_error, ctype) {
    this.ajax_req_base(req, "put", error_id,
      function(data) {
        // Unwrap data and call original handler
        if (data.result)
          on_success(data.data);
      }, after_error, ctype !== undefined ? ctype : APPLICATION_JSON);
  };

  /**
   * Post ajax request with data
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {Int} error_id Error Id in case of failure
   * @param {Function} on_success Function to execute on success
   *
   */
  WebApp.prototype.post_ajax = function(req, error_id, on_success) {
    this.ajax_req_base(req, "post", error_id, on_success);
  };
  
  /**
   * Post ajax request with data
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {Int} error_id Error Id in case of failure
   * @param {Function} on_success Function to execute on success
   * @param {Function} after_error Function to execute after standard error handler
   * @param {Object} ctype Content type
   *
   */
  WebApp.prototype.post_ajax_data = function(req, error_id, 
                                    on_success, after_error, ctype) {
    this.ajax_req_base(req, "post", error_id, on_success, after_error, ctype);
  };

  /**
   * Post ajax request with data
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {Int} error_id Error Id in case of failure
   * @param {Function} on_success Function to execute on success
   * @param {Function} after_error Function to execute after standard error handler
   * @param {Object} ctype Content type
   *
   */
  WebApp.prototype.post_ajax_data_ext = function(req, error_id, 
                                          on_success, after_error, ctype) {
    this.ajax_req_base(req, "post", error_id, 
      function(data) {
        // Unwrap data and call original handler
        if (data.result)
          return on_success(data.data);
      }, after_error, ctype !== undefined ? ctype : APPLICATION_JSON);
  };
  
  WebApp.prototype.delete_ajax_ext = function(req, error_id, on_success, after_error) {
    this.ajax_req_base(req, "delete", error_id, 
      function(data) {
        // Unwrap data and call original handler
        if (data.result)
          return on_success(data.data);
      },
    after_error);
  };
    
  /**
   * Generic ajax request function
   * To supress show standard error window submit error_id = 0
   * For custom error processing define after_error handler
   *
   * @param {Object} req Request Object
   * @param {String} http_method HTTP Method
   * @param {String} error_id Custom Error Id
   * @param {Function} on_success Function to execute on success
   * @param {Function} after_error Function to execute after standard error handler
   * @param {Boolean} ctype Flag for contentType parameter 
   */
  WebApp.prototype.ajax_req_base = function(req, http_method, 
                          error_id, on_success, after_error, ctype) {
    this.ajax(req, http_method, error_id, on_success, 
                  after_error, ctype !== undefined ? {
      contentType : ctype
    } : ctype);
  };

  WebApp.prototype.get_ajax_phase = function(phase_loader, req, 
                                  error_id, on_success, step_name) {
    this.ajax_req_base(req, "get", error_id,
      function(data) {
        // Always Last
        if (!on_success(data))
          phase_loader.setStepError(step_name);
        else
          phase_loader.setStepCompleted(step_name);
      },
      function(msg) {
        // Always Last
        phase_loader.setStepError(step_name, msg);
      }
    );
  };
  
  WebApp.prototype.get_ajax_phase_ext = function(phase_loader, req, 
                                          error_id, on_success, step_name) {
    var me = this;
    
    this.get_ajax_phase(phase_loader, req, error_id,
      function(data) {
        // Unwrap data and call original handler
        if (data.result)
          return on_success(data.data);
      },step_name
    );
  };
  
  /*******************************************/
  /**             Simple Dialogs            **/ 
  /*******************************************/

  /**
   * Add simple dialog
   */
  WebApp.prototype.add_simple_dialog = function() {
    // Append simple dialog
    var sdialog = $('' +
      '<!-- Simple Dialog -->' +
      '<div class="simple-dialog wrapper hidden dialog">' +
        '<div class="lfloat">' +
          '<label class="sd-label"></label>:&nbsp;' +
            '<input type="text" class="sd-input" autofocus />' +
            '<select class="sd-sel" autofocus "></select>' +
        '</div>' +
        '<div class="sd-ctrl btn-ctrls rfloat">' +
          '<button class="btn-ok"></button>' +
          '<button class="btn-cancel"></button>' +
        '</div>' +
      '</div>');
    
    var me = this;
    web_app.sdialog = $(sdialog[1]);
    $(".sd-sel", this.sdialog).change(function() {
      me.check_sd_sel();
    });
    
    web_app.web_root.append(sdialog);
  };
  
  WebApp.prototype.show_simple_input_dialog = function(params) {
    $(".sd-sel", this.sdialog).hide();
    var input = $(".sd-input", this.sdialog);
    input.show().val(params.value !== undefined ? params.value : "");
    
    // Clear input filter
    input.filter_input();
    
    if (! this.is_empty(params.filter))
      input.filter_input({
        regex: params.filter
    });
  
    this.simple_dialog_prepare(params, input);
  };

  /**
   * Show dialog with selection and 2 buttons Ok/Cancel
   * @param params Array of parameter as
   *        params.data - hash list in format value:text
   *        param.select_title - first (default) entry in selection  
   */
  WebApp.prototype.show_simple_selection_dialog = function(params) {
    $(".sd-input", this.sdialog).hide();
    var input = $(".sd-sel", this.sdialog);
    input.empty().show().append('<option value=""' + ">" + 
          ((params.sel_title === undefined) ? "" : 
                  "-- " + params.sel_title) + " --</option>");
    
    var dval;
    var cnt = 0;
    for(var key in params.data) {
      if (cnt == 0)
        dval = key;
        
      input.append('<option value="' + key + '"' + 
          ">" + params.data[key] + "</option>");
      cnt++;
    }
    
    // Auto-select first option if only one added
    if (cnt == 1)
      input.val(dval);
      
    // Check if anything selected in simple dialog selection and enable button OK
    this.check_sd_sel();
          
    this.simple_dialog_prepare(params, input);
  };
  
  /**
   * Check if anything selected in simple dialog selection and enable button OK
   */
  WebApp.prototype.check_sd_sel = function(params) {
    $(".btn-ok", this.sdialog).prop("disabled", 
          this.is_empty($(".sd-sel", this.sdialog).val()));
  };
  
  WebApp.prototype.simple_dialog_prepare = function(params, input) {
    this.sdialog.data({res: undefined});
    
    $(".sd-label", this.sdialog).html(params.title);
    
    $(".btn-ok", this.sdialog).html(params.btnOk);
    $(".btn-ok", this.sdialog).click(function() {
      params.onOk();
    });
    
    var btnc = $(".btn-cancel", this.sdialog);
    if (params.btnCancel !== undefined) {
      btnc.html(params.btnCancel);
      btnc.attr("disabled", !params.modalClose);
      btnc.show();
    } else {
      btnc.hide();
    }
    
    var me = this;
    btnc.click(function() {
      // Hide dialog
      me.sdlg.close();
      if (typeof params.onCancel == "function")
        params.onCancel();
    });
      
    this.sdlg = this.sdialog.bPopup({
      speed: 450,
      opacity: 0.6,
      escClose: params.modalClose,
      modalClose: params.modalClose,
      transition: 'slideDown',
      appendTo: "." + this.ctx_id,
      onClose: function () {
        $(".btn-ok", this.sdialog).unbind('click');
        $(".btn-cancel", this.sdialog).unbind('click');
        
        if (params.onClose !== undefined) {
          var res = me.sdialog.data("res");
          if (res !== undefined) {
            if (!res.error) {
              if (typeof params.onClose.success == "function")
                params.onClose.success(res);
            } else if (res.error !== undefined) {
              if (typeof params.onClose.cancel == "function")
                params.onClose.error(res.error);
            }
          } else {
            if (typeof params.onClose.cancel == "function")
              params.onClose.cancel();
          }
        }
      }
    },
    function() {
      input.focus();
    });
  };

  /**
   * Close simple dialog and transfer 
   * return parameters res to onClose event from bPopup
   * 
   * @param res Return parameter
   *  
   */
   WebApp.prototype.hide_simple_dialog = function(res) {
    // disable_wait_btns("sd_ctrl");
    this.sdialog.data({res: res}).bPopup().close();
  };

  /*******************************************/
  /**            Filtered Handle            **/ 
  /*******************************************/
 
  /**
   * Add input handler for single element
   * 
   * @item input elements
   * @regex Input regex (optional).
   * 
   */
  WebApp.prototype.add_filtered_handler_ex = function(input, name, on_change) {
    var filter = this.filters[name];
    this.add_filtered_handler(input, filter === undefined 
      ? undefined : filter, on_change);
  };
  
  /**
   * Add input handler for single element
   * 
   * @item input elements
   * @regex Input regex (optional).
   * 
   */
  WebApp.prototype.add_filtered_handler = function(input, filter, on_change) {
    var me = this;
    
    // Use default filter if not set
    var regex = !this.is_empty(filter) 
        ? (!this.is_empty(filter.regex) ? filter.regex : ".*") 
        : ".*";
    
    input.filter_input({
      regex: regex,
      onChange: function(el) {
        me.clear_error(el);
        
        if (typeof on_change == "function")
          on_change(el);
      }
    });
    
    // Check for info
    if (!(this.is_empty(filter) || this.is_empty(filter.info)))
      input.prop("title", this.t(filter.info));
  };
  
  WebApp.prototype.clear_error = function(field) {
    field.removeClass("error");
  };

  /*******************************************/
  /**         Enable/Disable Buttons        **/ 
  /*******************************************/
 
  WebApp.prototype.enable_wait_btns = function(container, direction) {
    // Disable everyting
    $("button", container).each(function() { 
      $(this).hide();
    });
    
    container.addClass("btn-loading" + 
          (direction === undefined ? "" : "-" + direction));
  };
  
  WebApp.prototype.enable_wait_btn = function(btn, direction) {
    btn.hide();
    btn.parent().addClass("btn-loading" + 
          (direction === undefined ? "" : "-" + direction));
  };
  
  WebApp.prototype.disable_wait_btns = function(container, direction) {
    container.removeClass("btn-loading"+ 
          (direction === undefined ? "" : "-" + direction));
    
    // Enable everyting
    $("button", container).each(function() { 
      $(this).show();
    });
  };
  
  WebApp.prototype.disable_wait_btn = function(btn, direction) {
    btn.show();
    btn.parent().removeClass("btn-loading" + 
          (direction === undefined ? "" : "-" + direction));
  };

  WebApp.prototype.clone = function() {
    return new WebApp();
  };
  
  // Initialize Web Ppplication
  var web_app = new WebApp();
  web_app.init();
  
  window["jWebApp"] = web_app;
})(jQuery);
