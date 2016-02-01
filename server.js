'use strict';

var express = require('express');
var app = express();
var path = require("path");
var sugar = require("sugar");
var favicon = require("serve-favicon");
var uaParser = require("ua-parser-js");
var useragent = require("useragent");

app.use(express.static('public'));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function (req, res) {
	
  res.sendFile('public/index.html', {root: __dirname });
  
  
});

var obj = {
	"ip-address": "",
	"language": "",
	"OS": ""
};

app.get('/info', function(req, res){
	var agent = useragent.parse(req.headers['user-agent']);
	
	obj['ip-address'] = uaParser(req.headers)['ua']["x-forwarded-for"];
	obj['language'] = uaParser(req.headers)['ua']['accept-language'];
	obj['OS'] = agent.os.toString();
	
	res.send(JSON.stringify(obj));
});

app.get('/:date', function(req, res){
	var obj = {
		"unix": 0,
		"natural": ""
	};
	
	if(isNaN(Number(req.params.date))){
		//res.send(Date.create(req.params.date).format('{Month} {dd}, {yyyy}'));
	
		if(Date.create(req.params.date).isValid()){
			
			obj.unix = Date.parse(Date.create(req.params.date))/1000;
			obj.natural = Date.create(req.params.date).format('{Month} {dd}, {yyyy}');
			res.send(JSON.stringify(obj));
		}
		else{
			obj.unix = null;
			obj.natural = null;
			res.send(JSON.stringify(obj));
		}
	}
	else if(Date.create(Number(req.params.date)).isValid()){
		obj.unix = Number(req.params.date);
		obj.natural = Date.create(Number(req.params.date)*1000).format('{Month} {dd}, {yyyy}');
		res.send(JSON.stringify(obj));
	}
});


var port = process.env.PORT || 5000;
app.listen(port,  function () {
	console.log('Node.js pissing on port ' + port + '...');
});