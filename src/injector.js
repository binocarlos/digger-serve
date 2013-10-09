/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/**
 * Module dependencies.
 */
var url = require('url');
var fs = require('fs');
var async = require('async');
var path = require('path');

var socketjs_client = '//cdn.sockjs.org/sockjs-0.3.min.js';

module.exports = function(appconfig){
  return function(req, res, next){
    var options = req.injector_options || {};

    var host = req.headers.host;
    var baseurl = req.originalUrl.replace(/\/digger\.js/, '');

    var full_baseurl = '//' + host + baseurl;

  	var driver = 'sockets';

  	res.setHeader('content-type', 'application/javascript');

    var client_path = path.normalize(__dirname + '/../build/digger' + (options.minified ? '.min' : '') + '.js');
    var adaptor_path = null;

     var files = {
      client:function(next){
        fs.readFile(client_path, 'utf8', next);
      }
    };

    if(options.adaptor){
      var adaptor = __dirname + '/../build/digger' + (options.adaptor ? '.' + options.adaptor : '') + (options.minified ? '.min' : '') + '.js';
      adaptor_path = path.normalize(adaptor);
      files.adaptor = function(next){
        fs.readFile(adaptor_path, 'utf8', next); 
      }
    }

    
    var auth = req.session.auth || {};
    var user = null;

    if(auth.loggedIn){
      var authuser = auth.user;
      var activeproviders = auth.active;

      user = {
        id:authuser._digger.diggerid,
        sessionid:req.session.id,
        warehouse:authuser._digger.diggerwarehouse,
        username:authuser.username,
        active:[],
        providers:{

        }
      };

      var username = null;
      var active = [];
      for(var provider in activeproviders){
        var providerdata = authuser[provider + '_user'];

        user.providers[provider] = providerdata;
        user.active.push(provider);
      }
    }

    async.parallel(files, function(error, filedata){
      if(error){
        res.statusCode = 500;
        res.send(error);
        return;
      }

      var code = filedata.client;
      var adaptor = filedata.adaptor;

      /*
        
        this object is used to construct the window $digger object
        configured to point back to here
        
      */
      var digger_config = {
        host:host,
        baseurl:baseurl,
        user:user
      }

      if(options.auto_connect){
        digger_config.root_warehouse = options.auto_connect;
      }

      for(var prop in appconfig){
        if(prop!='hq_endpoints'){
          digger_config[prop] = appconfig[prop];  
        }
      }

      code += [
        "\n\n// ^^ end of Digger - config now\n\n",
        "var useconfig = " + JSON.stringify(digger_config, null, 4) + ";",
        "if(window.$diggerconfig){",
        "  for(var prop in window.$diggerconfig){",
        "    useconfig[prop] = window.$diggerconfig[prop];",
        "  }",
        "}",
        "window.$digger = require('digger-" + driver + "')(useconfig);"
      ].join("\n");

      if(adaptor){
        code += "\n\n\n" + adaptor;
      }

      res.send(code);
    })
  }
}