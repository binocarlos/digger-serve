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
var Components = require('./components');
var FileStore = require('./filestore');

var EventEmitter = require('events').EventEmitter;

// generate a middleware connector for the JavaScript api
module.exports = function(config){
	var self = this;

	self.ensure_sockets();

	var diggerapp = express();
	var injector = Injector(config);
  var component_builder = Components(config);
  var filestore = FileStore(config);

  /*
  
    checks whether the current request is able to 'get' | 'post' to the warehouse
    represented by the filepath (/reception/files as been stripped)

    the URL format is /reception/files/warehouseurl/containerid/fieldname.extension
    
  */
  function check_file_access(req, done){
    var fileurl = req.url;

    // we run a request back to the warehouseurl + /ping to check we are allowed through
    var req = {
      method:req.method.toLowerCase(),
      url:req.url + '/ping'
    }

    self.connector(req, function(error, answer){
      if(error){
        done(error);
        return;
        
      }
      
      done(null, answer && answer.length>0);
    })
  }

  /*
  
    the component builder
    
  */
  diggerapp.use('/reception/component', function(req, res, next){
    component_builder(req, res, next);
  })

  /*
  
    the filestore

    the URL format is /reception/files/warehouseurl/containerid/fieldname.extension
    
  */
  diggerapp.use('/reception/files', function(req, res, next){

    check_file_access(req, function(error, status){
      if(error){
        res.statusCode = 500;
        res.send(error);
        return;
      }

      if(!status){
        res.statusCode = 404;
        res.send(req.url + ' not found');
      }
      else{
        filestore(req, res);

      }
    })
    

    
  })

  /*
  
    non-adaptor diggers
    
  */
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

  /*
  
    adaptor diggers
    
  */
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

  /*
  
    REST API
    
  */
  diggerapp.use(self.http_connector());

  return diggerapp;
}