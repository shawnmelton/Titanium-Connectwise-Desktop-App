/**
 * @desc This class will add pagination to a container's items.
 * @version $Id: $
 */
(function($){
	var FormsPlugin = function(element, options) {
		var form = $(element);		// List wrapper element (container)
		var obj = this;
		var placeholder = "Required!";
		var formElements = false;
		var emailRE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		var phoneRE = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		var dateRE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
		var settings = $.extend({
			ajax: false,	// Submit form using ajax.
			ajaxCallback: false // Pass in the function to call after ajax submission.
		}, options || {});
		
		
		/**************** Private methods ******************/
		
		// Remove errors highlighted on fields.
		var removePlaceholder = (function(){
			if( $(this).val() == placeholder ) {
				$(this).val("");
			}
			
			$(this).removeClass("error");
		});
		
		// Show an error message
		var showErrMsg = (function(){
			if( !$("#error-popup").length ) {
				$("body").append('<div id="error-popup"></div>');
			}
			
			$("#error-popup").html("Please correct the error(s) highlighted below.").fadeIn();
			setTimeout(function(){
				$("#error-popup").fadeOut("slow");
			}, 3000);
		});
		
		
		
		
		/*************** Public methods *******************/
		
		/**
		 * @desc Initialize form validation.
		 */
		this.init = function() {
			formElements = form.find("input, select, textarea");
		
			form.submit(function(event){
				formElements.each(removePlaceholder);
				formElements.each(function(){
					if( ($(this).attr("required") || $(this).hasClass("required")) && $(this).val() == "" ) {
						$(this).addClass("error");
					} else if( $(this).is("input") && ($(this).attr("name") == "email_address" || $(this).attr("type") == "email") && $(this).val() != "" && !$(this).val().match(emailRE) ) {
						$(this).addClass("error");
					} else if( $(this).is("input") && ($(this).attr("name") == "phone_number" || $(this).attr("type") == "telephone") && $(this).val() != "" && !$(this).val().match(phoneRE) ) {
						$(this).addClass("error");
					} else if( $(this).is("input") && ($(this).attr("name") == "date" || $(this).attr("type") == "date") && $(this).val() != "" && !$(this).val().match(dateRE) ) {
						$(this).addClass("error");
					}
				});
				
				if( settings["ajax"] && form.find(".error").length == 0 ) { // Should this script post using ajax?
					$.post(form.attr("action"), form.serialize(), function(response) {
						if( settings["ajaxCallback"] !== false ) {
							window[settings["ajaxCallback"]]();
						}
					});
					
					return false;
				}
				
				var noErrors = (form.find(".error").length == 0);
				if( noErrors === false ) {
					showErrMsg();
				}
				
				return noErrors // There aren't any errors on site.
			});
			
			
			formElements.focus(removePlaceholder);
		};
	};
	
	// Define paginate function call.
	$.fn.validate = function(options) {
		return this.each(function() {
			var plugin = new FormsPlugin(this, options);
			plugin.init();
		});
	};
})(jQuery);
