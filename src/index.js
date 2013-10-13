/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var http = require('http');
var express = require('express');

var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var ErrorHandler = require('./errorhandler');
//var sockets = require('socket.io');
var sockjs = require('sockjs');
var RedisStore = require('connect-redis')(express);
var vhost = require('express-vhost');

/*

  the constructor creates connectors which emit events for digger requests

  whatever orchestration that gets the server going can decide how to proxy the reqs
  
*/
function DiggerServe(options){
	var self = this;

	this.options = options || {};
	this.express = express;
	this.app = express();
	this.server = http.createServer(this.app);

	// our proxy the hell out of here
	this.connector = function(req, res){
		self.emit('digger:request', req, res);
	}

	this.radio = function(action, channel, body){
		self.emit('digger:radio', action, channel, body);
	}

	this.sockets = null;
	this.redisStore = null;

	this.app.use(vhost.vhost());

	this.app.get('/__digger/assets/digger.png', function(req, res, next){
		res.sendfile(path.normalize(__dirname + '/../assets/digger.png'));
	})
	this.app.use(function(req, res){
		res.statusCode = 404;
		res.send([
			'<table width=100% height=100%><tr><td align=center valign=middle>',
			'<span style="font-family:Arial;">',
			'<img src="/__digger/assets/digger.png" />',
			'<h2>Page / Website not found</h2>',
			'</span>',
			'</td></tr></table>'
		].join(''))
	})
}

util.inherits(DiggerServe, EventEmitter);

DiggerServe.prototype.ensure_redis_store = function(){
	if(this.redisStore){
		return this.redisStore;
	}
	this.redisStore = new RedisStore({
		host:this.options.redis_host || process.env.DIGGER_REDIS_HOST || '127.0.0.1',
		port:this.options.redis_port || process.env.DIGGER_REDIS_PORT || 6379,
		pass:this.options.redis_pass || process.env.DIGGER_REDIS_PASSWORD || null
	})
	return this.redisStore;
}

DiggerServe.prototype.ensure_sockets = function(){
	if(this.sockets){
		return this.sockets;
	}
	this.sockets = sockjs.createServer();
	this.sockets.on('connection', this.socket_connector());
	this.sockets.installHandlers(this.server, {prefix:'/digger/sockets'});
	return this.sockets;
}


/*

	direct proxy through to the reception server
*/

DiggerServe.prototype.http_connector = require('./http_connector');


/*

	a client has connected their socket to the web app

	we proxy digger requests back to the reception socket handler
*/
DiggerServe.prototype.socket_connector = require('./socket_connector');


/*

	generate a single app that is configured as per the digger.yaml

	the middleware is already built - our job is to create an express
	application with a static file store + sessions ready for the middleware

	middleware is an array: 

	[{
		route:"/mypath",
		handler:fn
	}]

*/
DiggerServe.prototype.digger_application = require('./digger_application');


// generate a middleware connector for the JavaScript api
DiggerServe.prototype.digger_express = require('./digger_express');

// 

DiggerServe.prototype.listen = function(port, done){
	this.server.listen(port, done);
}

module.exports = function(options){

	return new DiggerServe(options);

}