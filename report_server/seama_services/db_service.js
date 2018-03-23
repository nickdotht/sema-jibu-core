var mysql = require('mysql');
var connectionTable = {};
function dbService(req, res, next) {
    console.log("dbService Entry");
    var sessData = req.session;
    console.log("sessData", JSON.stringify(sessData));
    if( !connectionTable[sessData.id]){
        console.log("Creating dbConnection");
        createConnection( sessData, req, next);
    }else{
        console.log("dbConnection exists ");
        next();

    }
}

function createConnection( sessionData, req, next ){
    var con = mysql.createConnection({
        host: "104.131.40.239",
        port: "3306",
        database: "dlo",
        user: "app",
        password: "password"
    });

    connectionTable[sessionData.id] = con;

    con.connect(function (err) {
        if (err) {
            res.status(401).send('Not Authorized')
            sessionData.dbConnection = null;
        } else {
            console.log("Connected! - calling next");
            next();
        }
    });
}

module.exports = {
    dbService:dbService,
    connectionTable:connectionTable
};