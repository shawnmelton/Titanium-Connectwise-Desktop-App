var Tickets = function(){}; // class object initialization
Tickets.prototype = {
	db: false, // The database object we will use.
	
	
	/**
	 * @desc Add a new service ticket entry into the database.
	 * @param id - <string>
	 * @param name - <string>
	 * @param company - <string>
	 */
	_add: function(id, name, company) {
		
		
	},
	
	
	/**
	 * @desc Clear out all service tickets in the database.
	 */
	_clear: function() {
		this.db.query('DELETE FROM app_tickets');
	},
	
	
	/**
	 * @desc Pull down the current User's tickets.
	 * @param username - <string>
	 * Insert the tickets into the database so that we don't have to pull them every time.
	 */
	_pull: function(username) {
		var overlay = new Blackout();
		overlay.show("Loading service tickets ... ");
		
		this._dbInit();
		this._clear();
		
		var instance = this.db.get();
		
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = (function(){
			var response = $.parseJSON(this.responseText);			
			$.each(response, function(index, ticket){
				try {
					instance.execute('INSERT INTO app_tickets (ticket_id, ticket_name, ticket_company_name, ticket_date_added) VALUES (?, ?, ?, DATETIME("NOW"))', ticket.ticket_id, ticket.ticket_name, ticket.ticket_company_name);
				} catch(err) {}
			});
		});
				
		xhr.open("GET", "http://dev.cwapi.com/tickets/getForUser/"+ username);
		xhr.send();
		
		overlay.hide();
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
	 * @desc Get the service tickets assigned to the current user.
	 * If we have a connection to the internet, then pull them down from API service.  Otherwise load last local copy.
	 * @param username - <string>
	 * @return <array>
	 */
	get: function(username) {
		this._dbInit();
		
		if( Titanium.Network.online ) {
			this._pull(username);
		}
		
		var tickets = [];
		var results = this.db.query("SELECT ticket_id, ticket_name, ticket_company_name FROM app_tickets ORDER BY ticket_id");
		if( results.isValidRow() ) {
			var ticket = {
				"id": results.fieldByName("ticket_id"),
				"name": results.fieldByName("ticket_name"),
				"company": results.fieldByName("ticket_id")
			}
			
			tickets.push(ticket);			
			results.next();
		}
		results.close();
		return tickets;
	}
};
