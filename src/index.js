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
var vhost = require('express-vhost');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
//var ErrorHandler = require('./errorhandler');
//var sockets = require('socket.io');
var sockjs = require('sockjs');
var Injector = require('./injector');

var RedisStore = require('connect-redis')(express);
var EventEmitter = require('events').EventEmitter;

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

DiggerServe.prototype.http_connector = function(){

	var self = this;

	return function(req, res){

		var auth = req.session.auth || {};
    var user = auth.user;

    var headers = req.headers;

		var headers = {};
		for(var prop in (req.headers || {})){
			var value = req.headers[prop];

			if(prop.indexOf('x-json')==0 && typeof(value)=='string'){
				value = JSON.parse(value);
			}
			headers[prop] = value;
		}

    if(user){
    	headers['x-json-user'] = user;
    }

    self.connector({
      method:req.method.toLowerCase(),
      url:req.url.split('?')[0],
      query:req.query,
      headers:headers,
      body:req.body
    }, function(error, result){
      if(error){
        var statusCode = 500;
        error = error.replace(/^(\d+):/, function(match, code){
          statusCode = code;
          return '';
        })
        res.statusCode = statusCode;
        res.send(error);
      }
      else{
        res.json(result || []);
      }

      req = null;
      res = null;
    })
  
	}

}


/*

	a client has connected their socket to the web app

	we proxy digger requests back to the reception socket handler
*/
DiggerServe.prototype.socket_connector = function(){

	var self = this;
	return function(socket){

		// the local functions we have registered with the radio
		var listeners = {};

		socket.on('data', function(payload) {
      
      /*
      
      	this has to be a strict mapping of fields
      	because things like internal give the request upgraded permissions
      	
      */
      payload = JSON.parse(payload);

      if(payload.type==='request'){

      	var req = payload.data;

      	self.connector({
	      	id:req.id,
	        method:req.method,
	        url:req.url,
	        query:req.query,
	        headers:req.headers,
	        body:req.body
	      }, function(error, results){

	      	if(!socket){
	      		return;
	      	}
	      	
	        socket.write(JSON.stringify({
	        	type:'response',
	        	data:{
	        		id:req.id,
		          error:error,
		          results:results	
	        	}
	        }))

	        req = null;
	        payload = null;
     		})

      }
      else if(payload.type=='radio'){

      	var req = payload.data;

      	if(req.action=='talk'){
      		self.radio('talk', req.channel, req.payload);
      	}
      	else if(req.action=='listen'){
      		if(listeners[req.channel]){
      			return;
      		}

      		console.log('-------------------------------------------');
      		console.log('-------------------------------------------');
      		console.log('-------------------------------------------');
      		console.log('-------------------------------------------');
      		console.log('LISTEN');
      		console.dir(req.channel);


      		var listener = listeners[req.channel] = function(channel, data){

      			console.log('-------------------------------------------');
      			console.log('socket callback: ' + channel);
      			socket.write(JSON.stringify({
		        	type:'radio',
		        	data:{
		        		channel:channel,
		        		payload:data
		        	}
		        }))
      		}

      		self.radio('listen', req.channel, listener);
      	}
      	else if(req.action=='cancel'){
      		var listener = listeners[req.channel];
      		self.radio('cancel', req.channel, listener);
      		delete(listeners[req.channel]);
      	}

      }
      else{
      	socket.write(JSON.stringify({
        	type:'error',
        	data:'unknown payload type: ' + payload.type
        }))
      }

    })

    socket.on('close', function(){
    	socket = null;
    	for(var key in listeners){
    		var listener = listeners[key];
      	self.radio('cancel', key, listener);
    	}
    	listeners = null;
    })

  }
      
}

DiggerServe.prototype.listen = function(port, done){
	this.server.listen(port, done);
}

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
DiggerServe.prototype.digger_application = function(domains){

	var self = this;

	if(!domains || domains.length<=0){
		console.error('error: you must specify some domains for the application');
		process.exit(1);
	}

	var diggerapp = express();

	this.ensure_redis_store();

	var cookieParser = express.cookieParser(this.options.cookie_secret || 'rodneybatman');
	diggerapp.configure(function(){
	
		diggerapp.use(express.query());
		diggerapp.use(express.bodyParser());
		diggerapp.use(cookieParser);
		diggerapp.use(express.session({store: self.redisStore}));
	
	})

	if(typeof(domains)==='string'){
    domains = [domains];
  }
	domains.forEach(function(domain){
		console.log('   domain: ' + domain);
		vhost.register(domain, diggerapp);
	})

	return diggerapp;
}

// generate a middleware connector for the JavaScript api
DiggerServe.prototype.digger_express = function(config){
	var self = this;
	this.ensure_sockets();

	var diggerapp = express();
  diggerapp.get('/digger.js', Injector({
    appconfig:config
  }));
  diggerapp.get('/digger.min.js', Injector({
    minified:true,
    appconfig:config
  }));

  diggerapp.use(this.http_connector());

  return diggerapp;
}

// 
module.exports = function(options){

	return new DiggerServe(options);

}




/*
		var socketid = socket.id;
    var session = socket.handshake.session || {};
    var auth = session.auth || {};
    var user = auth.user;

    var request_handler = function(req){

      var id = req.id;
      var method = req.method;

      var headers = req.headers || {};
      headers['x-json-user'] = user;
      
     	connector({
      	id:id,
        method:method,
        url:req.url,
        query:req.query,
        headers:headers,
        body:req.body
      }, function(error, results){

        socket.emit('response', {
          id:id,
          error:error,
          results:results
        })

        req = null;

      })

    }

    socket.on('request', request_handler);

    socket.on('disconnect', function(){
      session = null;
      auth = null;
      user = null;
  		socket = null;
  		request_handler = null;
		})
*/

// old socket.io stuff - we replaced this with socksjs

/*

	the socket connects and we extract the session data so we get
	access to the user from a socket request

var _cookie = 'connect.sid';

function authFunction(cookieParser, redisStore){
	return function(data, accept){
	  if (data && data.headers && data.headers.cookie) {
	    cookieParser(data, {}, function(err){
	      if(err){
	        return accept('COOKIE_PARSE_ERROR');
	      }
	      var sessionId = data.signedCookies[_cookie];
	      redisStore.get(sessionId, function(err, session){
	        if(err || !session || !session.auth || !session.auth.loggedIn){
	          //accept('NOT_LOGGED_IN', false);

	          // not logged in but we still want a socket
	          accept(null, true);
	        }
	        else{
	          data.session = session;
	          accept(null, true);
	        }
	      });
	    });
	  } else {
	    return accept('MISSING_COOKIE', false);
	  }
	}
}
*/

/*

	var io = sockets.listen(server);
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', process.env.NODE_ENV==='development' ? 1 : 1);                    // reduce logging

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
*/




  /*
		  
  	the socket connector - this is for all applications running
	
  
	io.set('authorization', authFunction(cookieParser, redisStore));
  io.sockets.on('connection', socket_connector(connector));
  */	