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

  // Define Web App configuration parameters
  mod.config = {
    // Mod version.
    version: [1,0,0],
    
    // System name
    sys_name: "Mod Demo",
  
    // Root DOM element id
    web_ctx_id: "sbs",
  
    // Supported version of Web Service. 
    // WebApp won't start if Web Service has different major version or lower version. 
    // The ws_ver[0] also could be a part of ws_path if nothing defined,
    // for example /api/v1
    ws_ver: [1,2],
    
    // Is Web App can be configured. Default is false
    menu: [
      {
        title: "LL_SHOW_ERROR",
        icon: "images/red_dialog.png",
        action: "show_demo_error"
      }
    ],
    
    // List of JavaScript resources to load from mod/js folder
    scripts: ["demo.js", "lang_set.js"],
    
    // Relative path to Web Service API. Default: undefined
    // ws_host: "",
    
    // Phase loader handler
    phase_loader: mod.web_app.init_phase_loader([["load_demo_msg"]], {
      critical: [0],
      on_completed: "show_demo_msg",
    }),
  };


  /**************************************************/
  /***********     Demo Mod Methods       ***********/
  /**************************************************/

  mod.load_demo_msg = function(phase_loader) {
    phase_loader.web_app.get_ajax_phase(phase_loader, mod.web_app.make_abs_req("demo.msg"), 0, 
      function(data) {
        return mod.load_demo_msg_success(data);
      }, "load_demo_msg");
  };
  
  // Demo Message
  mod.show_demo_msg = function() {

    // var dstr = $.format(new Date(0), "F", mod.web_app.locale);
    $.datepicker.setDefaults($.datepicker.regional[mod.web_app.lang]);
    var dts = new Date(0);
    var dstr = $.datepicker.formatDate($.datepicker.RFC_1123, dts) + ", " + 
        dts.getHours() + ":" + 
        (dts.getMinutes() == 0 ? "00" : dts.getMinutes()) + ":" +
        (dts.getSeconds() == 0 ? "00" : dts.getSeconds());

    var label = dstr + " - " + mod.web_app.t(mod.demo_msg.label);
    
    mod.web_app.web_ctx.html('<span class="demo dialog-sub-header">' + label + '</span>');
    
    $("button", mod.web_app.web_ctx).click(function() {
      mod.show_demo_error(); 
    });
    
    mod.web_app.show_success_msg(label);
  };
  
  mod.load_demo_msg_success = function (msg) {
    this.demo_msg = eval("(" + msg + ")");
    
    return this.demo_msg !== undefined;
  };
})(jQuery, jWebApp.mod);