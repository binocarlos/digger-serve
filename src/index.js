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
//var sockjs = require('sockjs');

/*
var express = require('express');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


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
	var website = Website(options);
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

/*
DiggerServe.prototype.ensure_sockets = function(done){
	var self = this;
	if(this.sockets){
		done && done(null, this.sockets);
		return this.sockets;
	}
	this.sockets = sockjs.createServer();
	this.sockets.on('connection', function(socket){
		self.emit('socket_connection', socket);
	});
	this.sockets.installHandlers(this.http, {prefix:this.options.socketpath || '/digger/sockets'});
	done && done(null, this.sockets);
	return this.sockets;
}
*/

DiggerServe.prototype.build = function(done){	
	var self = this;
	if(this._built){
		done && done();
		return;
	}
	this._built = true;

	async.series([

		function mount_sockets(next){
			if(!self.options.sockets){
				next();
				return;
			}

			self.ensure_sockets(next);
		},

		function mount_websites(next){
			async.forEach(self.websites, function(website, nextwebsite){
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
							self.app.use(website);
						}
						else{
							domains.forEach(function(domain){
								self._usevhost = true;
								vhost.register(domain, website);
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
				next();
			})
		},

		function error_handler(next){
			if(!self.options.errorhandler){
				next();
				return;
			}

			self.app.get('/__digger/assets/digger.png', function(req, res, next){
				res.sendfile(path.normalize(__dirname + '/../assets/digger.png'));
			})
			self.app.use(function(req, res){
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
	], done)
}
