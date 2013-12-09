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

var express = require('express');
var http = require('http');
var vhost = require('express-vhost');
var Website = require('./website');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var async = require('async');

/*
var express = require('express');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var sockjs = require('sockjs');
var RedisStore = require('connect-redis')(express);
var ErrorHandler = require('./errorhandler');
*/

function DiggerServe(options){
	EventEmitter.call(this);
	this.options = options || {};
	this.websites = [];
	this.app = express();
	this.http = http.createServer(this.app);
}

util.inherits(DiggerServe, EventEmitter);

module.exports = DiggerServe;

DiggerServe.prototype.website = function(options){
	var website = new Website(options);
	this.websites.push(website);
	return website;
}

DiggerServe.prototype.listen = function(port, done){
	var self = this;
	if(arguments.length<=1){
		done = port;
		port = 80;
	}

	this.build(function(server){
		self.http.listen(port, function(error){
			done(error, port);
		});
	})
}

DiggerServe.prototype.build = function(done){	
	
	var self = this;
	async.forEach(this.websites, function(website, nextwebsite){
		website.build(function(error){
			if(error){
				nextwebsite(error);
				return;
			}

			var domains = website.domains();

			if(!domains){
				throw new Error('no domains for website');
			}
			else{
				if(typeof(domains)==='string'){
					domains = [domains];
				}
				var catchall = domains.filter(function(domain){
					return domain==='*';
				}).length>0;

				if(catchall){
					self.app.use(website.app);
				}
				else{
					domains.forEach(function(domain){
						self._usevhost = true;
						vhost.register(domain, website.app);
					})
				}
			}

			nextwebsite();
		});
	}, function(error){
		if(error){
			throw new Error(error);
		}
		if(self._usevhost){
			self.app.use(vhost.vhost());
		}
		done();
	})
}

/*

  the constructor creates connectors which emit events for digger requests

  whatever orchestration that gets the server going can decide how to proxy the reqs
  

function DiggerServe(options){
	var self = this;

	this.options = options || {};
	this.express = express;
	this.app = express();
	this.server = http.createServer(this.app);

	// our proxy the hell out of here
	this.connector = function(req, res){
		if(!req.headers){
			req.headers = {};
		}
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


DiggerServe.prototype.http_connector = require('./http_connector');
DiggerServe.prototype.socket_connector = require('./socket_connector');
DiggerServe.prototype.app_server = require('./app_server');
DiggerServe.prototype.digger_middleware = require('./digger_middleware');

DiggerServe.prototype.listen = function(port, done){
	this.server.listen(port, done);
}

module.exports = function(options){

	return new DiggerServe(options);

}*/