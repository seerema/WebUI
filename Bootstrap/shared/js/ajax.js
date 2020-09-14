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

  /*******************************************/
  /**            System Functions           **/ 
  /*******************************************/
 
  web_app.get_url = function(req) {
    var url;                                    
    if (req.abs) {
      url = req.url;
    } else {
      url = this.base_url + req.api_name;
      
      if (req.path_params !== undefined && req.path_params.length > 0)
        url += "/" + req.path_params.join("/");
        
      if (req.query_params !== undefined) {
        var qs = "";
        for (var key in req.query_params)
          qs += "&" + key + "=" + req.query_params[key];
          
        if (qs.length != "")
          url += "?" + qs.substr(1);
      }
    }
    
    return url;
  };
  
  web_app.get_data = function(req, http_method) {
    return req.data;
  };
  
  web_app.check_ctype  = function(ctype) {
    return ctype;
  };
})(jQuery, jWebApp);
