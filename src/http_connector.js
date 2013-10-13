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

/*

	direct proxy through to the reception server
*/

module.exports = function(){

	var self = this;

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

    self.connector({
      method:req.method.toLowerCase(),
      url:req.url.split('?')[0],
      query:req.query,
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

      req = null;
      res = null;
    })
  
	}

}