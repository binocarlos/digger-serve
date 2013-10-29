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
var fs = require('fs');
var async = require('async');
var path = require('path');
var wrench = require('wrench');
var mkdirp = require('mkdirp');

module.exports = function(config){

	var filestore_path = '/tmp/diggerfilestore';

	var digger_data_folder = process.env['DIGGER_ROOT_DATA_FOLDER'];

	if(fs.existsSync(digger_data_folder)){
		filestore_path = digger_data_folder + '/files';
	}

	if(!fs.existsSync(filestore_path)){
		wrench.mkdirSyncRecursive(filestore_path, 0777);
	}

	function ensure_folder(path, done){
		mkdirp(path, 0777, done);
	}

  return function(req, res){
  	var method = req.method.toLowerCase();

  	if(method=='get'){
  		fs.stat(filestore_path + req.url, function(error, stat){
  			if(error || !stat){
  				res.statusCode = 404;
  				res.send(req.url + ' not found');
  			}
  			else if(stat.isDirectory()){
  				res.send('');
  			}
  			else{
  				res.sendfile(filestore_path + req.url);		
  			}
  			
  		})
  		
  	}
  	else{
  		if(req.url.match(/\.\w+$/)){
  			var parts = req.url.split('/');
  			var filename = parts.pop();
  			var folder = parts.join('/');
  			var fullpath = folder + '/' + filename;
  			ensure_folder(folder, function(error){
  				if(error){
  					res.statusCode = 500;
  					res.send(error);
  				}
  				else{
  					var stream = fs.createWriteStream(fullpath);
  					req.on('end', function(){
  						res.send('ok');
  					})
  					req.pipe(stream);
  				}
  			})
  		}
  		else{
  			res.statusCode = 500;
  			res.send('cannot post to a directory');
  		}
  		
  	}
  }
}