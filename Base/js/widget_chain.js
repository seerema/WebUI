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
    this.marks = [];

    // Top level web context DOM element where all widget should be attached/removes
    this.ctx = ctx;
  }
  
  WidgetChain.prototype.clear = function() {
    // TODO Check if any data saved in current widget
    
    this.widgets = [];
    this.ctx.empty();
    this.slides = {};
    this.marks = [];

    // For now always return OK
    return true;
  };
  
  /**
   * Append widget with entity list and add mark to return later
   * 
   * @param {*} widget 
   */
  WidgetChain.prototype.append_list = function(widget) {
    this.append(widget);
    this.marks.push(this.widgets.length);
  };

  WidgetChain.prototype.append = function(widget) {
    this.append_widget(this.widgets, widget);
  };
  
  WidgetChain.prototype.append_widget = function(widgets, widget) {
    // Hide current widget
    if (widgets.length > 0)
      widgets[widgets.length - 1].hide();
    
    // Add new widget to model and context
    widgets.push(widget);
    this.ctx.append(widget);
  };
  
  WidgetChain.prototype.append_slide = function(widget, name) {
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

  /**
   * Close all widget or current slide show
   * 
   * @param {Slide show name} name 
   */
  WidgetChain.prototype.close_ex = function(name) {
    if (name !== undefined)
      this.close_slides(name);
    else
      this.close_all();
  };

  WidgetChain.prototype.close_slide = function(name) {
    this.close_slide_ext(name, true);
  };
  
  /**
   * Close current widget from slide show
   * @param {string} name slide show name
   * @param {boolean} fshow Flag to show previous widget
   */
  WidgetChain.prototype.close_slide_ext = function(name, fshow) {
    var slide = this.slides[name];
    this.close_widget(slide.widgets, fshow);
    slide.idx--;
  };

  /**
   * Close slide show
   * 
   * @param {string} name Slide name 
   * @param {boolean} fsaved Flag to close all linked slide shows 
   */
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
  
  WidgetChain.prototype.close_list = function() {
    this.marks.pop();
    this.close_widget(this.widgets, true);
  };

  WidgetChain.prototype.close_widgets = function(widgets, idx) {
    while (widgets.length > idx) {
      this.close_widget(widgets, false);
    }
  };
  
  /**
   * Close all widgets in main chain until recent mark
   */
  WidgetChain.prototype.close_all = function() {
    var mark = this.marks[this.marks.length - 1];
    this.close_widgets(this.widgets, mark);
    
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
