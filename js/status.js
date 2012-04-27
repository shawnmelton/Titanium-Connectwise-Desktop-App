var AppStatus = function(){}; // class object initialization
AppStatus.prototype = {
	html: false, // Cache app status html.
	db: false, // The database object we will use.
	
	/**
	 * @desc Wipe out any status strings that are being queued.
	 */
	_clear: function() {
		this._dbInit();
		this.db.query('DELETE FROM app_statuses');
	},
	
	
	/**
	 * @desc Initialize the database connection for this object.
	 */
	_dbInit: function() {
		if( this.db !== false ) {
			return;
		}
		
		// set up database object.
		this.db = new SqlDB();
		this.db.connect();
	},
	
	
	/**
	 *  @desc Get any status strings that are queued.
	 *  @return <string> HTML
	 */
	get: function() {
		if( this.html !== false ) {
			return this.html;
		}
		
		this._dbInit();
		
		var htmlStr = "";
		var results = this.db.query('SELECT status_type, status_message FROM app_statuses');
		while( results.isValidRow() ) {
			htmlStr += '<p class="status-string '+ results.fieldByName("status_type") +'">'+ results.fieldByName("status_message") +'</p>';
			results.next();
		}
		results.close();
		
		this._clear();
		
		this.html = htmlStr;
		return htmlStr;
	},
	
	
	/**
	 * @desc Add a status string to the queue.
	 * @param type - [success, notice, error]
	 * @param msg - The text that you would like to display.
	 */
	set: function(type, msg) {
		this._dbInit();
		this.db.query('INSERT INTO app_statuses (status_type, status_message, status_date_added) VALUES ("'+ type +'", "'+ msg +'", DATETIME("NOW"))');
	}
};
