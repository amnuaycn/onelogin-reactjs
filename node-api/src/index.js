"use strict";
var cluster = require('cluster');
var express = require('express');
var path = require('path');
var fs = require('fs');
var util = require("util");
var body_parser_1 = require('body-parser');
var cookieParser = require('cookie-parser');
var os_1 = require('os');
var config_1 = require('./config');
var jwt_decode =  require("jwt-decode");

var moment = require('moment');
var now_log = moment().local().format('YYYY-MM-DD HH:mm:ss');
const  jwt  =  require('jsonwebtoken');
var numCPUs = os_1.cpus().length;
if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker) {
        console.log(now_log + " | worker " + worker.process.pid + " died");
        // cluster.fork();
    });
}
else {
    var app = express();
	var cors = require('cors');
	app.use(cors());

    var routes = fs.readdirSync(path.join(__dirname, 'routes'));
    app.use(body_parser_1.json({
	  limit: '10mb'
	}));

	app.use(body_parser_1.urlencoded({ extended: true }));
	//app.use(cookieParser());
    app.enable('trust proxy');
    app.use((req, res, next) => {
         let headers = req.headers;
         let authorization = headers['authorization'];
         let token;
		 var now_log = moment().local().format('YYYY-MM-DD HH:mm:ss');
         // Keep client information
         console.log(`${now_log} | ${req.ip} > ${req.method} ${req.originalUrl}`);
         console.log(`${now_log} | userAgent > ${headers['user-agent']}`);
         
         
         if (!!authorization && authorization.split(' ')[0] === 'Bearer') {
             token = authorization.split(' ')[1];
         } else if (req.query && req.query.token) {
             token = req.query.token;
         }
      

        var jwksClient = require('jwks-rsa');
        var client = jwksClient({
        jwksUri: config_1.domain_sso+'/certs'
        });
        function getKey(header, callback){
        client.getSigningKey(header.kid, function(err, key) {
            var signingKey = key.publicKey || key.rsaPublicKey;
            console.log(signingKey)
            callback(null, signingKey);
        });
        }

        jwt.verify(token, getKey, function(error, decoded) {
            if (!!error) {
                console.log(`${now_log} | ERROR: verify ${error.message}`);
                return res.status(401).send({
                    status: false,
                    message: 'Unauthorized',
                    description : error.message
                });
            }
            if (!!decoded) {
                console.log(`${now_log} | decoded ${JSON.stringify(decoded)} |${req.method} ${req.originalUrl} | ${headers['user-agent']} `);
                res.locals.accessinfo = decoded;
                next();
            }
        });

     });
 
    app.get('/', function (req, res, next) {
        console.log(now_log + " | ");
        res.json({
            version: '1'
        });
    });
	app.post('/', function (req, res, next) {
        console.log(now_log + " | ");
        res.json({
            version: '1'
        });
    });
    // dynamic setup router
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var dirname = routes_1[_i];
        // check if index.ts file exists in routes/path
        try {
            fs.accessSync(dirname, fs.R_OK);
        }
        catch (error) {
            continue;
        }
        finally {
            console.log(now_log + " | setup routes -> " + dirname);
            app.use('/' + dirname, require(path.join(__dirname, 'routes', dirname)));
        }
    }
    app.listen(config_1.port, function () {
        console.log(now_log + " | Start server on port:" + config_1.port);
    });
}
