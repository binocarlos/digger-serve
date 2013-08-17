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
var vhostproto = require('./vhost');
var RedisStore = require('connect-redis')(express);
var sockets = require('socket.io');
var sockets_express = require('socket.io-express');

module.exports = function(options){

	options = options || {};

	var redisStore = new RedisStore({
		host:options.redis_host || '127.0.0.1',
		port:options.redis_port || 6379
	})

	var app = express();
	var server = http.createServer(app);
	var io = sockets.listen(server);

	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging

	// enable all transports (optional if you want flashsocket support, please note that some hosting
	// providers do not allow you to create servers that listen on a port different than 80 or their
	// default port)
	io.set('transports', [
	    'websocket'
	  , 'flashsocket'
	  , 'htmlfile'
	  , 'xhr-polling'
	  , 'jsonp-polling'
	]);

	var cookieParser = express.cookieParser(options.cookie_secret || 'rodneybatman');
	app.configure(function(){
	
		app.use(express.query());
		app.use(express.bodyParser());
		app.use(cookieParser);
		app.use(express.session({store: redisStore}));
	
	});

	var authFunction = sockets_express.createAuthFunction(cookieParser, redisStore);
	io.set('authorization', authFunction);

	var vhostobj = new vhostproto();
	
	app.use(vhostobj.vhost())

	return {
		app:app,
		register:function(url, app){
			vhostobj.register(url, app);
		},
		express:express,
		server:server,
		io:io
	}
}

