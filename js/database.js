var SqlDB = function(){}; // class object initialization
SqlDB.prototype = {
	debug: true,
	connection: false, // The current connection to the database.
	
	/**
	 * @desc Load all database tables, if the do not exist. 
	 */
	checkSchema: function() {
		this.query('CREATE TABLE IF NOT EXISTS cw_accounts (account_id INTEGER PRIMARY KEY, account_name TEXT, account_login_date DATE)');
		this.query('CREATE TABLE IF NOT EXISTS app_statuses (status_id INTEGER PRIMARY KEY, status_type TEXT, status_message TEXT, status_date_added DATE)');
		this.query('CREATE TABLE IF NOT EXISTS app_time_entries ('+
			'entry_id INTEGER PRIMARY KEY,'+
			'entry_date TEXT,'+
			'entry_ticket TEXT,'+
			'entry_time TEXT,'+
			'entry_notes TEXT,'+
			'entry_date_added DATE'+
		')');
		this.query('CREATE TABLE IF NOT EXISTS app_tickets ('+
			'ticket_id INTEGER PRIMARY KEY,'+
			'ticket_company_name TEXT,'+
			'ticket_name TEXT,'+
			'ticket_date_added DATE'+
		')');
	},
	
	/**
	 * @desc Connect to a database
	 */
	connect: function(){
		if( this.isConnected() ) { // Don't reconnect to the database. 
			return;
		}
		
		try {
			//this.connection = openDatabase(this.name, '1.0', this.description, 2 * 1024 * 1024);
			this.connection = Titanium.Database.openFile(Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory(), "app.db"));
			this.checkSchema();
		} catch(err) {
			if( this.debug ) {
				alert(err);
			}
			
			this.connection = false;
		}
	},
	
	
	/**
	 * @desc Retrieve the database connection.
	 * @return <instance>
	 */
	get: function() {
		return this.connection;
	},
	
	/**
	 * @desc Do we currently have an open connection to the database?
	 * @return <boolean>
	 */
	isConnected: function(){
		return (this.connection !== false);
	},
	
	/**
	 * @desc Execute a query or statement on database.
	 * @return Result of execution. 
	 */
	query: function(sql){
		try {
			return this.connection.execute(sql);
		} catch(err) {
			if( this.debug ) {
				alert(sql +"\nError: "+ err);
			}
			
			return false;
		}
	}
};
