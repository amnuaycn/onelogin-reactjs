var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var util = require("util");
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());


router.post('/info', function(req, res) {
	const  info  =  res.locals.accessinfo;
	
	res.status(200).send(info);
    
});


module.exports = router;