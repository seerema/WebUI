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
  
  function WidgetChain(ctx) {
    // Starting widget index
    this.widx = 0;
    this.widgets = [];
    this.slides = {};
    
    // Top level web context DOM element where all widget should be attached/removes
    this.ctx = ctx;
  }
  
  WidgetChain.prototype.clear = function() {
    // TODO Check if any data saved in current widget
    
    this.widgets = [];
    this.ctx.empty();
    this.slides = {};
    
    // For now always return OK
    return true;
  };
  
  WidgetChain.prototype.append = function(widget) {
    this.append_widget(this.widgets, widget);
  };
  
  WidgetChain.prototype.append_widget = function(widgets, widget) {
    // Hide current widget
    if (widgets.length > 0)
      widgets[widgets.length - 1].hide();
    
    // Display the new widget
    widgets.push(widget);
    
    this.ctx.append(widget);
  };
  
  WidgetChain.prototype.append_slide = function(name, widget) {
    var slide = this.slides[name];
    if (slide === undefined) {
      slide = this.init_slides(name);
      
      // Slide show started. Hide current widget
      this.get_current().hide();
    }
    
    this.append_widget(slide.widgets, widget);
    slide.idx++;
  };
  
  WidgetChain.prototype.init_slides = function(name, linked) {
    var slide = {
      idx: 0,
      widgets: []
    };

    if (linked !== undefined)
      slide.linked = linked;

    this.slides[name] = slide;

    return slide;
  };

  WidgetChain.prototype.close_slide = function(name) {
    this.close_slide_ext(name, true);
  };
  
  WidgetChain.prototype.close_slide_ext = function(name, fshow) {
    var slide = this.slides[name];
    this.close_widget(this.slides[name].widgets, fshow);
    slide.idx--;
  };

  WidgetChain.prototype.close_slides = function(name, fsaved) {
    this.close_widgets(this.slides[name].widgets, 0);
    var linked = this.slides[name].linked;

    // Linked flag. Affect if entity list widget needs to be refreshed after save
    var fl = linked !== undefined;
    delete this.slides[name];
    
    // Check if closed slides were linked to another slide
    if (fl) {
      if (fsaved)
        // Remove last slide from linked series and don't show anything
        this.close_slide_ext(linked.to, false);
      else
        // Show last slide from linked series
        this.slides[linked.to].widgets[this.slides[linked.to].idx - 1].show();
    } else {
      // Show last widget
      this.show();
    }

    return fl ? linked.proc : undefined;
  };
  
  WidgetChain.prototype.close_widget = function(widgets, fshow) {
    // Remove current widget
    var widget = widgets.pop();
    widget.remove();
    
    // Display the previous widget
    if (widgets.length > 0 && fshow)
      widgets[widgets.length - 1].show();
  };
  
  WidgetChain.prototype.close = function() {
    this.close_widget(this.widgets, true);
  };
  
  WidgetChain.prototype.close_widgets = function(widgets, idx) {
    while (widgets.length > idx) {
      this.close_widget(widgets, false);
    }
  };
  
  /**
   * Close all widgets in main chain except first one
   */
  WidgetChain.prototype.close_all = function() {
    this.close_widgets(this.widgets, 1);
    
    // Display the first one
    this.show();
  };
  
  /**
   * Show last widget
   */
  WidgetChain.prototype.show = function() {
    this.get_current().show();
  };
  
  /**
   * Get current widget
   */
  WidgetChain.prototype.get_current = function() {
    return this.widgets[this.widgets.length - 1];
  };

  web_app.get_widget_chain = function(ctx) {
    var result = new WidgetChain(ctx);
    return result;
  };
})(jQuery, jWebApp);
