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
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var vhost = require('express-vhost');
var cors = require('cors');

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
module.exports = function(domains, configurefn){

	var self = this;

	if(!domains || domains.length<=0){
		console.error('error: you must specify some domains for the application');
		process.exit(1);
	}

	var diggerapp = express();

	self.ensure_redis_store();

	var cookieParser = express.cookieParser(self.options.cookie_secret || 'rodneybatman');
	
	diggerapp.use(express.query());
  	diggerapp.use(express.responseTime());
	diggerapp.use(express.bodyParser());
	diggerapp.use(cookieParser);
	diggerapp.use(express.session({store: self.redisStore}));
	diggerapp.use(cors());

	diggerapp.post_setup = function(){
		
	}

	if(configurefn){
		configurefn(diggerapp);
	}
	
	if(typeof(domains)==='string'){
    domains = [domains];
  }
	domains.forEach(function(domain){
		vhost.register(domain, diggerapp);
	})

	return diggerapp;
}
