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
var ErrorHandler = require('./errorhandler');

var RedisStore = require('connect-redis')(express);
var sockets = require('socket.io');
var Injector = require('./injector');
var EventEmitter = require('events').EventEmitter;

module.exports = function(options){

	options = options || {};

	var redisStore = new RedisStore({
		host:options.redis_host || process.env.DIGGER_REDIS_HOST || '127.0.0.1',
		port:options.redis_port || process.env.DIGGER_REDIS_PORT || 6379,
		pass:options.redis_pass || process.env.DIGGER_REDIS_PASSWORD || null
	})

	var app = express();
	var server = http.createServer(app);
	
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

	var cookieParser = express.cookieParser(options.cookie_secret || 'rodneybatman');
	app.configure(function(){
	
		app.use(express.query());
		app.use(express.bodyParser());
		app.use(cookieParser);
		app.use(express.session({store: redisStore}));
	
	});

	var _cookie = 'connect.sid';

	/*
	
		the socket connects and we extract the session data so we get
		access to the user from a socket request
		*/
	
	function authFunction(data, accept){
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

  /*
  
  	functional connector to the reception server

  	all of the requests travel via here

 	*/
  
	function connector(req, reply){

		app.emit('digger:request', {
			id:req.id,
			url:req.url,
			method:req.method,
			headers:req.headers,
			body:req.body
		}, reply)

	} 

	/*
	
		a client has connected their socket to the web app

		we proxy digger requests back to the reception socket handler
		
	*/
	
	function socket_connector(){

		return function(socket){

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
	        headers:headers,
	        body:req.body
	      }, function(error, results){

	        socket.emit('response', {
	          id:id,
	          error:error,
	          results:results
	        })

	      })

	    }

	    socket.on('request', request_handler);

	    socket.on('disconnect', function(){
	    	console.log('-------------------------------------------');
	    	console.log('socket disconnecting');
	      delete session;
	      delete auth;
	      delete user;
    		delete socket; 
    		delete io.sockets.sockets[socketid];
			})

	  }
	      
  }


  /*
  
  	direct proxy through to the reception server

	 */
  
  function http_connector(){

  	var supplychain = connector;

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

      supplychain({
        method:req.method.toLowerCase(),
        url:req.url,
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
	    })
    
  	}

  }

  /*
		  
  	the socket connector - this is for all applications running
	*/  	
  
	io.set('authorization', authFunction);
  io.sockets.on('connection', socket_connector());

  /*
  
  	this is when we mount an app without any domains
  	
  */
  app.use(vhost.vhost());
  //app.use('/__digger/assets', express.static(path.normalize(__dirname + '/../assets')));
  //app.use(ErrorHandler());

	return {
		app:app,
		express:express,
		server:server,
		io:io,

		/*
		
			add a website to the vhost
			
		*/
		add_website:function(domains, application){
			domains.forEach(function(domain){
				vhost.register(domain, application);
			})
		},

		/*
		
			generate a digger application that is all ready to go

			it is just an express app and so can be mounted onto webservers
		*/
		digger_application:function(config){

			var diggerapp = express();

		  diggerapp.get('/digger.js', Injector({
        appconfig:config
      }));
		  diggerapp.get('/digger.min.js', Injector({
		    minified:true,
        appconfig:config
		  }));
		  diggerapp.get('/:driver/digger.js', Injector({
		    pathdriver:true,
        appconfig:config
		  }));
		  diggerapp.get('/:driver/digger.min.js', Injector({
		    pathdriver:true,
		    minified:true,
        appconfig:config
		  }));


		  diggerapp.use(http_connector());

		  return diggerapp;
		}
	}
}