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

var Injector = require('./injector');

var EventEmitter = require('events').EventEmitter;

// generate a middleware connector for the JavaScript api
module.exports = function(config){
	var self = this;
	self.ensure_sockets();

	var diggerapp = express();
	var injector = Injector(config);

  diggerapp.get('/digger.js', function(req, res, next){
  	req.injector_options = {};
  	injector(req, res, next);
  });
  diggerapp.get('/digger.min.js', function(req, res, next){
  	req.injector_options = {
  		minified:true
  	};
  	injector(req, res, next);
  });

  diggerapp.get(/\.js$/, function(req, res, next){
  	var parts = req.url.split('.');
  	var warehouse_url = parts[0];

  	var adaptor = null;
  	var adaptors = {
  		angular:false,
  		angularplus:false,
  		angularmin:false,
  		angularminplus:false
  	}

  	var features = {
  		min:false
  	};

  	parts.forEach(function(part){
  		if(features[part]!=undefined){
  			features[part] = true;
  		}

  		if(adaptors[part]!=undefined){
  			adaptor = part;
  		}
  	})

  	req.injector_options = {
  		minified:features.min ? true : false,
  		adaptor:adaptor,
  		auto_connect:warehouse_url
  	};
  	injector(req, res, next);
  })

  diggerapp.use(self.http_connector());

  return diggerapp;
}