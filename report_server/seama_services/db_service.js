var mysql = require('mysql');
var connectionTable = {};

const sqlConfig = {
    host: "104.131.40.239",
    port: "3306",
    database: "dlo",
    user: "app",
    password: "password"
}

function dbService(req, res, next) {
    console.log("dbService Entry");
    var sessData = req.session;
    console.log("sessData", sessData.id, JSON.stringify(sessData));
    if( !connectionTable[sessData.id]){
        console.log("Creating dbConnection");
        createConnection( sessData, req, res, next);
        checkExpiredSessions(req);
    }else{
        console.log("dbConnection exists ");
        next();
    }
    console.log("Active Sessions", req.sessionStore.sessions);
}

function createConnection( sessionData, req, res, next ){
    var con = mysql.createConnection(sqlConfig);

    connectionTable[sessionData.id] = con;

    con.connect(function (err) {
        if (err) {
            res.status(500).send('Not Authorized');
            sessionData.dbConnection = null;
        } else {
            console.log("Connected! - calling next");
            next();
        }
    });
}

function checkExpiredSessions(req){
    try {
        var deletedSessions = [];
        for (var key in req.sessionStore.sessions) {
            var value = JSON.parse(req.sessionStore.sessions[key]);
            if (value.hasOwnProperty("cookie")) {
                var cookie = value.cookie;
                var expires = Date.parse(cookie.expires);
                var diff = Math.abs(new Date() - expires);
                if(diff > 180000 ){    // Delete db connections 3 minutes or older
                    try{
                        connectionTable[key].end();
                        deletedSessions.push( key );
                    }catch( err ){

                    }

                }
            }
        }
        for( var keydel of deletedSessions){
            console.log("Deleted Session", keydel);
            delete connectionTable[keydel];
            req.sessionStore.sessions[keydel] = null;
            delete req.sessionStore.sessions[keydel];
        }
    }catch( ex ){
        console.log("checkExpiredSessions ", ex);

    }
}

module.exports = {
    dbService:dbService,
    connectionTable:connectionTable,
    sqlConfig:sqlConfig
};