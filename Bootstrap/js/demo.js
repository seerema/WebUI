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

(function(mod) {
  mod.show_demo_error = function() {
     mod.web_app.show_error_win("C-DEMO", mod.web_app.t("LL_INFO_MSG"), 99,
      mod.web_app.t("LL_DETAIL_MSG_SHORT") + "<br />" + 
        mod.web_app.t("LL_DETAIL_MSG_LONG"));
  };
})(jWebApp.mod);
