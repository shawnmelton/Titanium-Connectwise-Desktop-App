var TimeEntries = function(){}; // class object initialization
TimeEntries.prototype = {
	db: false, // The database object we will use.
	
	
	/**
	 * @desc Clear out all time entries in the database.
	 */
	_clear: function() {
		this.db.query('DELETE FROM app_time_entries');
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
	 * @desc Add the time entry into the database.
	 * @param date <string>
	 * @param ticket <string>
	 * @param time <string>
	 * @param ntoes <string>
	 */
	add: function(date, ticket, time, notes) {
		this._dbInit();
		
		var instance = this.db.get();
		try {
			instance.execute('INSERT INTO app_time_entries (entry_date, entry_ticket, entry_time, entry_notes, entry_date_added) VALUES (?, ?, ?, ?, DATETIME("NOW"))', date, ticket, time, notes);
		} catch(err) {}
	},
	
	
	/**
	 * @desc Get the time entries that are waiting to be pushed to Connectwise.
	 * @return <number> How many entries are pending?
	 */
	getPending: function(){
		this._dbInit();
		var result = this.db.query('SELECT COUNT(entry_id) AS total FROM app_time_entries');
		if( result.isValidRow() ) {
			return result.fieldByName("total");
		}
		result.close();
		
		return 0;
	},
	
	
	/**
	 * @desc Push all of the pending time entries to the server.
	 * @param username - <string>
	 * JSON encode time entries and POST them to API server so they can be sent to CW.
	 */
	push: function(username) {
		if( Titanium.Network.online === false ) {
			return false;
		}
		
		this._dbInit();
		
		var json = "";
		var results = this.db.query('SELECT entry_id, entry_date, entry_ticket, entry_time, entry_notes FROM app_time_entries ORDER BY entry_id ASC');
		while( results.isValidRow() ) {
			json += "{"+
				'"date":"'+ results.fieldByName("entry_date") +'",'+
				'"ticket":"'+ results.fieldByName("entry_ticket") +'",'+
				'"time":"'+ results.fieldByName("entry_time") +'",'+
				'"notes":"'+ results.fieldByName("entry_notes") +'",'+
				'"username":"'+ username +'"'+
			"},";
			
			results.next();
		}
		results.close();
		
		if( json != "" ) { // Make sure we have some entries to send.
			var xhr = Titanium.Network.createHTTPClient();	
			xhr.onload = (function(){
				alert(this.responseText);
			});
						
			xhr.open("POST", "http://dev.cwapi.com/time/add");
			
			var json = new String(json);
			xhr.send({"entries": "["+ json.substring(0, json.length-1).replace('"', '\"').replace('/', '\/') +"]"});
		}
		
		// Clear all time entries IF they are successfully sent.
		this._clear();
	}
};
