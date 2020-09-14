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

$(document).ready(function() {
  jWebApp.init_bootstrap().start();
});


/**************** Page Loader Singletons ****************/
(function($, web_app) {
  
  function WebAppBootstrap(web_app) {
    this.web_app = web_app;
    this.web_app.ctx_id = this.web_app.mod.config.web_ctx_id;
    
    // URL List for bootstrap loading
    this.url_list = {
      version: "",
      config: "cfg"
    };
  
    // Init Web Context
    this.web_ctx = this.init_web_ctx();
  };
  
  /**
   * STEP 0 - load base.txt(optional) with web service path.
   * Default is ws/rest subdirectory
   */
  WebAppBootstrap.prototype.start = function() {
    var me = this;
    
    // Quick check for browser compatibility
    var msg = this.check_browser();
    if (msg !== undefined) {
      $("body").html('<font color="red"><center><b>' +
                            msg + '</b><center></font>');
      return;
    }
      
    // Show page loading message before start
    this.web_app.show_loader(this.web_app.t("LL_LOADING_BOOTSTRAP"));
    document.title = this.web_app.mod.get_name() + " | " + this.web_app.ts("LL_LOADING");
    
    // Check if ws_host defined
    // Checking priority is next:
    // 1. config.ws_host configuration (hardcoded)
    // 2. "ws_host" cookie name (saved)
    // 3. ./base.txt server side file (dynamic)
    if (this.web_app.base_url === undefined)
      this.web_app.base_url = (this.web_app.mod.config.ws_host !== undefined) 
          ? this.web_app.root_path + this.web_app.mod.config.ws_host 
          : $.cookie("ws_host");
    
    if (this.web_app.base_url !== undefined) {
      // Continue with version check
      this.check_version();
    } else {
      // Try load base url from base.txt
      this.web_app.get_ajax_simple(this.web_app.make_abs_req("base.txt"),
        function(data) {
          web_app.base_url = web_app.root_path + data.trim();
          me.check_version();
        },
        function() {
          // Default base URL prefix if not defined in config.ws_host configuration 
          // or BASE_URL constant or external ./base.txt
          // Uae API version, for example /api/v2
          web_app.base_url = web_app.root_path +
                  "api/v" + web_app.mod.config.ws_ver[0] + "/";
          
          // If base.txt doesn't exists than 
          // save default setting in cookie in order to stop
          // producint 404 error on each page load
          $.cookie("ws_host", web_app.base_url);
  
          me.check_version();
        }
      );
    }
  };
  
  WebAppBootstrap.prototype.check_browser = function(msg) {
    // 0. Check for supported IE version
    if ($.browser.msie !== undefined && parseInt($.browser.version, 10)) {
      var ver = parseInt($.browser.version, 10);
      return this.web_app.t("LL_ERROR_IE_NOT_SUPPORTED").replace("[ver]", ver);
    }
  };
    
  /**
   * Step 1 - Check Version
   * Load WS version and compare with current 
   */
  WebAppBootstrap.prototype.check_version = function() {
    var me = this;
    
    this.web_app.get_ajax_simple(
          this.web_app.make_rel_req(this.url_list.version),
      function(data) {
        if (web_app.is_empty(data)) {
          web_app.hide_loader();
          
          //-- 2
          web_app.show_client_error(2, "Version is empty");
          return;
        }
        
        // Strip possible double quotes
        // Check major and minor versions. Stop if major versions doesn't match or
        //   major versions match but server minor lower than web app minor
        var ver = data.replace(/^"(.+(?="$))"$/, '$1').split(".");
        var wsv = web_app.mod.config.ws_ver;
        if (ver[0] != wsv[0] || 
              ver[0] == wsv[0] && ver[1] < wsv[1]) {
          web_app.hide_loader();
          
          //-- 3
          web_app.show_client_error_substr(3, undefined, 
                      {xxx: data, yyy: wsv.join(".")});
          return;
        }
        
        // Go to Phase 2
        me.load_config();
      },
      function (err_msg, status) {
      	// For any scenario hide loader
      	web_app.hide_loader();
      	
        // Special handling for 403
        if (status == 403) {
          // Show login popup
          web_app.show_login_win();
        } else {
          //-- 1
          web_app.show_client_error(1, (status == 404)
            ? web_app.t("LL_SERVICE_DOWN") : err_msg);
        }
      }
    );
  };
  
  /**
   * Step 2
   * Load configuration (if keywords configured)
   */
  WebAppBootstrap.prototype.load_config = function() {
    var me = this;
    var cfg_keys = this.web_app.mod.config.cfg_keys;
    
    // Debug parameter is default
    if (cfg_keys === undefined)
      cfg_keys = ["lang"];
    else
      cfg_keys.push("lang");
      
    if (this.web_app.is_empty_array(cfg_keys))
      // Skip configuration phase
      this.web_app.load();
    else
      //-- 7 
      this.web_app.get_ajax(this.web_app.make_rel_req_query(this.url_list.config, {
          lst: cfg_keys.join(",")
        }), 7,
        function(data) {
          me.config = data;
          
          // Set default lang if defined on server side
          if (data["lang"] !== undefined)
            web_app.set_lang(data["lang"]);
            
          web_app.load(function() {
            web_app.finish();
          });
        }
      );
  };
    
  /**
   * Create top DOM element for web context
   */
  WebAppBootstrap.prototype.init_web_ctx = function() {
    var web_root = $('<div class="' + this.web_app.ctx_id + '">' +
      '<div class="' + this.web_app.page_loader_id + '"></div>' +
        
      // WebApp Context
      '<div class="webapp-ctx hidden"></div>' +
      
      // Error Window
      '<div class="error-window ui-state-error ui-corner-all hidden">' +
        '<button class="b-close">X</button>' +
    
        '<div class="dialog-header ui-state-error-text">' + 
            '<span class="ll-error-c">' + this.web_app.t("LL_ERROR_C") + '</span>' +
            ':&nbsp;' +
            '<span class="err-code"></span>' +
        '</div>' +
		
        '<div class="req-text dialog-sub-header hidden">' +
          '<span class="ll-request-id">' + this.web_app.t("LL_REQUEST_ID") + '</span>' +
          '<span class="req-id"></span>' +
        '</div>' +
            
        '<div class="dialog-sub-header" style="white-space: nowrap;">' +
          '<span class="err-details"></span>' +
          '<span class="btn-err-toggle">' +
          '<img class="bottom hidden" src="' + this.web_app.root_path + 
	                                          'shared/images/icon_up.png" />' +
          '<img class="top" src="' + this.web_app.root_path + 
	                                        'shared/images/icon_down.png" />' +
          '</span>' +
        '</div>' +
        '<div class="err-info dialog-text hidden"></div>' +
      '</div>' +
	
      // Success Window
      '<div class="success-window ui-corner-all hidden">' +
        '<button class="b-close">X</button>' +
    
        '<div class="dialog-header"><span class="ok-msg"></span></div>' +
      '</div>' +
        
      // Wait popup
      '<img class="wait-spinner" src="">' +
    
    	// Login popup
    	'<div class="login-window ui-corner-all hidden">' +
        '<form class="form-signin">' +
          '<h2 class="form-signin-heading">' +
            this.web_app.t("LL_SIGN_IN") +
            '</h2>' +
          '<p>' +
            '<label for="username" class="sr-only">Username</label>' +
            '<input type="text" name="username" class="form-control username" placeholder="Username" required="" autofocus="">' +
          '</p>' +
          '<p>' +
            '<label for="password" class="sr-only">Password</label>' +
            '<input type="password" name="password" class="form-control password" placeholder="Password" required="">' +
          '</p>' +
          '<p>' +
            '<span class="login-error hidden"></span>' +
          '</p>' +
          '<input name="_csrf" type="hidden" value="">' +
          '<div>' +
            '<button class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>' +
           '</div>' +
        '</form>' +
      '</div>' +
      
      // Footer
      '<div class="footer">' + this.web_app.get_copyright() + '</div>' +
    '</div>');
    
    // Set waiting popup image
    $("img.wait-spinner", web_root).attr("src",
        this.web_app.root_path + "shared/images/loading_circle.gif");
    
    $("body").append(web_root);
    this.web_app.web_root = web_root;
    this.web_app.footer = $("footer", web_root);
    this.web_app.web_ctx = $(".webapp-ctx", web_root);
    this.web_app.err_win = $(".error-window", web_root);
    this.web_app.login_win = $(".login-window", web_root);
    this.web_app.success_win = $(".success-window", this.web_root);
    this.web_app.page_loader = $("." + this.web_app.page_loader_id, this.web_root);
    
    // Bind error toggle
    var me = this;
    $(".btn-err-toggle", this.web_app.err_win).click(function() {
      web_app.toggle_error_details();
    });
    
    // Bind login button
    $("button", this.web_app.login_win).click(function() {
      web_app.login($(this));
    });
    
    return this.web_app.web_ctx;
  };

  web_app.init_bootstrap = function() {
    this.bs = new WebAppBootstrap(this);
    return this.bs;
  };
})(jQuery, jWebApp);
