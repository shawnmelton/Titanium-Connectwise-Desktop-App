var Blackout = function(){}; // class object initialization
Blackout.prototype = {
	bgElement: false,
	msgElement: false,
	
	/**
	 * @desc Create blackout element if it does not exist.
	 */
	_create: function() {
		$("body").append('<div id="blackout"></div><div id="blackout-msg"><h2></h2><img src="/img/ajax.gif" alt="Loading ..."></div>');
		this.bgElement = $("#blackout");
		this.msgElement = $("#blackout-msg");
	},
	
	
	/**
	 * @desc Does the blackout element already exist?
	 * @return <boolean>
	 */
	_exists: function() {
		return (this.bgElement !== false);
	},
	
	
	/**
	 * @desc Remove the blackout overlay.
	 */
	hide: function() {
		this.msgElement.fadeOut();
		this.bgElement.fadeOut();
	},
	
	
	/**
	 * @desc Show the blackout overlay with the provided message.
	 */
	show: function(msg) {
		if( this._exists() === false ) {
			this._create();
		}
		
		this.msgElement.find("h2").html(msg);
		this.bgElement.fadeIn();
		this.msgElement.fadeIn();
	}
};