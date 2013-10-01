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
var path = require('path');

var socketjs_client = '//cdn.sockjs.org/sockjs-0.3.min.js';

module.exports = function(options){
  options = options || {};
  var appconfig = options.appconfig || {};
  return function(req, res, next){

    var host = req.headers.host;
    var baseurl = req.originalUrl.replace(/\/digger\.js/, '');

    var full_baseurl = '//' + host + baseurl;

  	var driver = 'sockets';

  	res.setHeader('content-type', 'application/javascript');

    var client_path = path.normalize(__dirname + '/../build/digger' + (options.minified ? '.min' : '') + '.js');

    var auth = req.session.auth || {};
    var user = null;

    if(auth.loggedIn){
      user = {};

      for(var prop in auth.user){
        if(prop.charAt(0)!=='_'){
          user[prop] = auth.user[prop];
        }
      }
    }

    fs.readFile(client_path, 'utf8', function(error, code){
      if(error){
        res.statusCode = 500;
        res.send(error);
      }
      else{

        /*
        
          this object is used to construct the window $digger object
          configured to point back to here
          
        */
        var digger_config = {
          host:host,
          baseurl:baseurl,
          user:user
        }

        for(var prop in appconfig){
          if(prop!='hq_endpoints'){
            digger_config[prop] = appconfig[prop];  
          }
        }

        code += [
          "\n\n// ^^ end of Digger - config now\n\n",
          "var useconfig = " + JSON.stringify(digger_config, null, 4) + ";",
          "if($diggerconfig){",
          "  for(var prop in window.$diggerconfig){",
          "    useconfig[prop] = window.$diggerconfig[prop];",
          "  }",
          "}",
          "window.$digger = require('digger-" + driver + "')(useconfig);"
        ].join("\n");

        var code_wrapper = [

          code

        ]
        res.send(code);
      }
    })
  }
}