var CWAccount = function(){}; // class object initialization
CWAccount.prototype = {
	account: false, // The account associated with this object.
	db: false, // The database object we will use.
	
	/**
	 * @desc Initialize the database connection for this object.
	 */
	dbInit: function() {
		if( this.db !== false ) {
			return;
		}
		
		// set up database object.
		this.db = new SqlDB();
		this.db.connect();
	},
	
	
	/**
	 * @desc Get the current user's CW username.
	 * @return <string> Return false if not found.
	 */
	getUsername: function(){
		if( this.isLoggedIn() ) {
			return this.account;
		}
		
		return false;
	},
	
	
	/**
	 * @desc Is this account already signed in?
	 * @return <boolean>
	 */
	isLoggedIn: function() {
		if( this.account !== false ) { // Account is signed in.
			return true;
		}
		
		this.dbInit();
		var result = this.db.query('SELECT account_id, account_name FROM cw_accounts');
		
		while( result.isValidRow() ) {
			if( result.fieldByName("account_name") != "undefined" && result.fieldByName("account_name") != "" ) {
				this.account = result.fieldByName("account_name");
				return true;
			}
			
			result.next();
		}
		result.close();
		
		return false;
	},
	
	
	/**
	 * @desc Sign in the current account in now that we have validated their account credentials.
	 * @return <boolean>
	 */
	login: function(accountName) {
		this.dbInit();
		this.db.query('INSERT INTO cw_accounts (account_name, account_login_date) VALUES ("'+ accountName +'", DATETIME("NOW"))');
	},
	
	
	/**
 	* @desc Sign out the current account so they will need to log in the next time the open the app.
 	* @return <boolean>
 	*/
	logout: function() {
		this.dbInit();
		this.db.query('DELETE FROM cw_accounts');
	}
};
