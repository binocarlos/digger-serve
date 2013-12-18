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
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var RedisStore = require('connect-redis')(express);
var cors = require('cors');

module.exports = function(options){
	options = options || {};
	var app = express();

	if(options.parser){
		app.use(express.query());
		app.use(express.bodyParser());
	}	
	if(options.debug){
		app.use(express.responseTime());
	}
	if(options.session){
		var cookieParser = express.cookieParser(options.cookie_secret || 'rodneybatman');
		var redisStore = new RedisStore({
			host:options.redis_host || process.env.DIGGER_REDIS_HOST || '127.0.0.1',
			port:options.redis_port || process.env.DIGGER_REDIS_PORT || 6379,
			pass:options.redis_pass || process.env.DIGGER_REDIS_PASSWORD || null
		})
		app.use(cookieParser);
		app.use(express.session({store: redisStore}));
	}
	if(options.cors){
		app.use(cors());
	}

	app.build = function(done){
		app.use(app.router);
		app.use(express.favicon(options.document_root + '/favicon.ico'));
		app.use(express.static(options.document_root));

		done && done();
		return this;
	}

	app.domains = function(arr){
		return arr ? options.domains = arr : (options.domains || []);
	}

	return app;

}