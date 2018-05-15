const mysql = require('mysql');
const connectionTable = {};

const sqlConfig = {
	host: '104.131.40.239',
	port: '3306',
	database: 'dlo',
	user: 'app',
	password: 'password'
};

const schema ={
	schemaLoaded :false,
	customer_account_columns:[]
};

function dbService(req, res, next) {
	console.log('dbService Entry');
	var sessData = req.session;
	console.log('sessData', sessData.id, JSON.stringify(sessData));
	if (!connectionTable[sessData.id]) {
		console.log('Creating dbConnection');
		createConnection(sessData, req, res, next);
		checkExpiredSessions(req);
	} else {
		console.log('dbConnection exists ');
		next();
	}
	console.log('Active Sessions', req.sessionStore.sessions);
}

function createConnection(sessionData, req, res, next) {
	var dbConfig = getSQLConfig(req);
	var con = mysql.createConnection(dbConfig);

	connectionTable[sessionData.id] = con;

	con.connect(function(err) {
		if (err) {
			console.log( JSON.stringify(err));
			switch( err.code ){
				case "ER_ACCESS_DENIED_ERROR":
					res.status(401).send('Not Authorized');
					break;
				default:
					res.status(503).send('Service unavailable');
			}
			sessionData.dbConnection = null;
		} else {
			console.log('Connected! - calling next');
			if( ! schema.schemaLoaded ){
				schema.schemaLoaded = true;
				loadSchema(con).then(() => {
					next();
				}).catch(err => {
					console.log( err.message);
					next();
				});
			}else{
				next();
			}
		}
	});
}

function checkExpiredSessions(req) {
	try {
		var deletedSessions = [];
		for (var key in req.sessionStore.sessions) {
			var value = JSON.parse(req.sessionStore.sessions[key]);
			if (value.hasOwnProperty('cookie')) {
				var cookie = value.cookie;
				var expires = Date.parse(cookie.expires);
				var diff = Math.abs(new Date() - expires);
				if (diff > 180000) {
					// Delete db connections 3 minutes or older
					try {
						connectionTable[key].end();
						deletedSessions.push(key);
					} catch (err) {}
				}
			}
		}
		for (var keydel of deletedSessions) {
			console.log('Deleted Session', keydel);
			delete connectionTable[keydel];
			req.sessionStore.sessions[keydel] = null;
			delete req.sessionStore.sessions[keydel];
		}
	} catch (ex) {
		console.log('checkExpiredSessions ', ex);
	}
}
function getSQLConfig(req){
	if( true){
//	if( req.app.get("env") === "test"){
		console.log( "Test environment"); // TODO Test config should not be static!!!
		sqlConfig.host = '192.168.50.92';
		sqlConfig.database = 'jibu1';
		sqlConfig.user = 'fred';
		sqlConfig.password =  'jibu1';
	}
	console.log("SQL host:", sqlConfig.host, "SQL database:", sqlConfig.database );
	return sqlConfig;
}

const loadSchema = (connection ) => {
	return new Promise((resolve, reject) => {
		connection.query("SHOW COLUMNS FROM customer_account", function (err, rows, sqlResult) {
			if(!err){
				schema.customer_account_columns = rows.map( row =>{return row.Field});
			}
			resolve();
		});
	});
};

const customerAccountHasCreatedDate = () => {
	return schema.customer_account_columns.indexOf('created_date') == -1 ? false : true;
}
module.exports = {
	dbService: dbService,
	connectionTable: connectionTable,
	getSQLConfig: getSQLConfig,
	customerAccountHasCreatedDate
};
