


//^^^ Angular - Digger

(function(){



/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("binocarlos-digger-bootstrap-for-angular/index.js", function(exports, require, module){
/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger.bootstrap', [
    'digger.utils'
  ])

  /*
  
    setup the dynamic module loader
    
  */
  .config(function($compileProvider){
  
    $digger.directive = function(){
      $compileProvider.directive.apply(null,arguments);
    }
    
  })


  .service('AsyncScriptLoader',function($q,$rootScope){
    
    var scripts = {};
    
    var loadScriptAsync = function(src){
      if(!scripts[src]){
        var deferred = $q.defer();
        
        var script = document.createElement('script'), run = false;
        script.type = 'text/javascript';
        script.src = src;
        
        script.onload = script.onreadystatechange = function() {
          if( !run && (!this.readyState || this.readyState === 'complete') ){
            run = true;
            deferred.resolve('Script ready: ' + src);
            $rootScope.$digest();
          }
        };
        document.body.appendChild(script);
        
        scripts[src] = deferred.promise;
      }
      
      return scripts[src];
    }
    
    return {
      load:loadScriptAsync
    };
    
  })


  /*
  
    the loader itself

    this is a client side angular proxy for components living on github

    we connect to the core api on /reception/component which the HTTP intercepts

    it downloads and builds the component on the server

    the module.exports must be the string we compile into the field

    it can register directives on window.$diggercomponents.directive('name', function(){})
    
  */
  .service('DiggerComponentLoader',function(AsyncScriptLoader,$q,$rootScope,$http){
    
    var baseurl = $digger.config.diggerurl + '/reception/component';
    
    var components = {};
    
    var loadComponent = function(name){
      if(!components[name]){

        // hit the top for the javascript - this will 302 to the actual code once built
        var javascript_src = baseurl + '/' + name;
        var parts = name.split('/');
        var repo = parts.pop();
        var modulename = name.replace(/\//g, '-');

        // once it has built - we know the css is this path (thank you component : )
        var css_src = javascript_src + '/build/build' + ($digger.config.debug ? '' : '.min') + '.css';

        javascript_src += ($digger.config.debug ? '?debug=y' : '')

        var deferred = $q.defer();

        AsyncScriptLoader.load(javascript_src).then(function(){
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', css_src);
            document.getElementsByTagName('head')[0].appendChild(link);

            // the module will return the HTML
            // it has registered directives with window.$diggercomponents already
            var module = window.require(repo);
            var html = '';

            // the module is angular markup
            if(typeof(module)==='string'){
              html = module;
            }
            // the module has blueprints and markup
            else{
              html = module.html;
            }

            deferred.resolve(html);
        })

        components[name] = deferred.promise;
      }

      return components[name];
    }
    
    return {
      load:loadComponent
    };
    
  })

  /*
  
    XML Processor
    
  */
  .config(['$provide', function ($provide) {
    
    $provide.factory('xmlHttpInterceptor', ['xmlFilter', function (xmlFilter) {
      return function (promise) {
        return promise.then(function (response) {
          response.xml = xmlFilter(response.data);
          return response;
        });
      };
    }]);
    
  }])

  .factory('xmlEncoder', function(){

    function string_factory(data, depth){

      var meta = data._digger || {};
      var children = data._children || [];
      var attr = data;
      depth = depth || 0;

      function get_indent_string(){
        var st = "\t";
        var ret = '';
        for(var i=0; i<depth; i++){
          ret += st;
        }
        return ret;
      }

      var pairs = {};

      if(meta.id && meta.id.length>0){
        pairs.id = meta.id;
      }

      if(meta.class && angular.isArray(meta.class) && meta.class.length>0){
        pairs.class = meta.class.join(' ');
      }

      var pair_strings = [];

      Object.keys(attr || {}).forEach(function(key){
        var val = attr[key];
        if(key.indexOf('_')===0){
          return;
        }
        if(key=='$$hashKey'){
          return;
        }
        pairs[key] = val;
      })
      
      Object.keys(pairs || {}).forEach(function(field){
        var value = pairs[field];
      
        if(value!=null && value!=''){
          pair_strings.push(field + '="' + value + '"');  
        }
      })

      if(children && children.length>0){
        var ret = get_indent_string() + '<' + meta.tag + ' ' + pair_strings.join(' ') + '>' + "\n";

        children.forEach(function(child){      
          ret += string_factory(child, depth+1);
        })

        ret += get_indent_string() + '</' + meta.tag + '>' + "\n";

        return ret;    
      }
      else{
        return get_indent_string() + '<' + meta.tag + ' ' + pair_strings.join(' ') + ' />' + "\n";
      }
    }

    return string_factory;

  })

  .factory('xmlDecoder', function(xmlParser){
    return function(xml){
      xml = xml.replace(/^[^<]*/, '').replace(/[^>]*$/, '');

      var domElement = xmlParser.parse(xml);
      var documentElement = domElement.documentElement;

      function process_elem(xml_elem){
        var attr = {};
        
        for(var i=0; i<xml_elem.attributes.length; i++){
          var node_attr = xml_elem.attributes[i];
          attr[node_attr.nodeName] = node_attr.nodeValue;
        }

        var classnames = (attr.class || '').split(/[\s,]+/);
        delete(attr.class);
        var id = attr.id;
        delete(attr.id);

        var container = $digger.container(xml_elem.tagName);  

        classnames.forEach(function(classname){
          container.addClass(classname);
        })

        if(id){
          container.id(id);
        }

        Object.keys(attr || {}).forEach(function(prop){
          var val = attr[prop];
          if(('' + val).toLowerCase()==="true"){
            val = true;
          }
          else if(('' + val).toLowerCase()==="false"){
            val = false;
          }
          else if(('' + val).match(/^-?\d+(\.\d+)?$/)){
            var num = parseFloat(val);
            if(!isNaN(num)){
              val = num;
            }
          }
          container.attr(prop, val);
        })

        var child_models = [];

        for(var j=0; j<xml_elem.childNodes.length; j++){
          var child_node = xml_elem.childNodes[j];
          if(child_node.nodeType==1){
            var child = process_elem(child_node);
            child_models.push(child.get(0));
          }          
        }

        container.get(0)._children = child_models;

        return container;
      }

      // invalid XML
      
      if(documentElement.nodeName=='html'){
        return null;
      }
      else{
        return process_elem(documentElement);
      }
    }
  })

  .factory('xmlParser', ['$window', function ($window) {

    function MicrosoftXMLDOMParser() {
      this.parser = new $window.ActiveXObject('Microsoft.XMLDOM');
    }

    MicrosoftXMLDOMParser.prototype.parse = function (input) {
      this.parser.async = false;
      return this.parser.loadXml(input);
    };

    function XMLDOMParser() {
      this.parser = new $window.DOMParser();
    }

    XMLDOMParser.prototype.parse = function (input) {
      return this.parser.parseFromString(input, 'text/xml');
    };

    if ($window.DOMParser) {
      return new XMLDOMParser();
    } else if ($window.ActiveXObject) {
      return new MicrosoftXMLDOMParser();
    } else {
      throw new Error('Cannot parser XML in this environment.');
    }

  }])

  .filter('xml', ['xmlParser', function (xmlParser) {
    return function (input) {
      var xmlDoc = xmlParser.parse(input);
      return angular.element(xmlDoc);
    };
  }])

  /*
  
    return the global digger
    
  */
  .factory('$digger', function(){
    return window.$digger;
  })
});
require.register("binocarlos-digger-utils-for-angular/index.js", function(exports, require, module){
/*

  tools used across the other files
  
*/

angular
  .module('digger.utils', [
    'digger.radio'
  ])

  .factory('$safeApply', [function($rootScope) {
    return function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } else {
        if (fn) {
          $scope.$apply(fn);
        } else {
          $scope.$apply();
        }
      }
    }
  }])


  /*
  
    load the folders from the resources tree once (but setup a radio)
    
  */
  .service('$containerTreeData', function($q, $rootScope, $safeApply){
    var containers = {};

    function load($scope, selector){
      if(!containers[selector]){
        var deferred = $q.defer();

        $rootScope.warehouse(selector + ':tree(folder)').ship(function(root){
          $safeApply($scope, function(){
            deferred.resolve(root);
          })
          
        })  
        
        

        containers[selector] = deferred.promise;
      }

      return containers[selector];
    }
    
    return {
      load:load
    }
  })

  /*
  
    given a tree root and a container id - return an array of containers
    that are the ancestors for the id up to the tree root
    (if the id is found)
    
  */
  .factory('$getAncestors', function(){
    return function(root, container){
      var match = root.find('=' + container.diggerid());

      if(match.isEmpty()){
        return [];
      }

      var ancestors = [];
      var current = match;

      while(current){
        var parent = root.find('=' + current.diggerparentid());

        if(parent.isEmpty()){
          current = null;
        }
        else{
          ancestors.unshift(parent);
          current = parent;
        }
      }

      return ancestors;
    }
  })
});
require.register("binocarlos-digger-supplychain-for-angular/index.js", function(exports, require, module){
/*

  we are in private scope (component.io)
  
*/
require('digger-utils-for-angular');

angular
  .module('digger.supplychain', [
    'digger.utils'
  ])

  /*
  
    connects to the current warehouse or a custom one and runs the selector against it

    it populates the $digger scope property with the results

    <div digger warehouse="/my/warehouse" selector="thing.red">
      there are {{ $digger.count() }} results
    </div>
    
  */

  .factory('$warehouseLoader', function($rootScope, $safeApply){

    /*
    
      return a loader bound onto the current scope

      it will populate the $digger property
      
    */
    return function($scope){

      return function(selector, warehousepath){
          
        if(!selector){
          return;
        }

        var warehouse = $rootScope.warehouse;

        warehousepath = warehousepath || $scope.warehousepath;

        if(warehousepath){
          warehouse = $digger.connect(warehousepath);
        }

        /*
        
          run the selector and populate results
          
        */
        warehouse(selector)
          .ship(function(results){

            $safeApply($scope, function(){

              $scope.$digger = results;
              $scope.containers = results.containers();

            })

          })
          .fail(function(error){
            $scope.error = error;
          })
      }

    }
  })

    /*
  
    a generic trigger for the warehouse loader above
    
  */
  .directive('warehouse', function($warehouseLoader, $safeApply){
    return {
      restrict:'A',
      // we want this going before even the repeat
      // this lets us put the repeat and digger on the same tag
      // <div digger warehouse="/" selector="*" digger-repeat="children()" />
      priority: 1001,
      scope:true,
      link:function($scope, elem, $attrs){

        $attrs.$observe('warehouse', function(warehousepath){
          if(!warehousepath.match(/^\//)){
            warehousepath = '/' + warehousepath;
          }
          $scope.warehousepath = warehousepath;
          $scope.warehouse = $digger.connect(warehousepath);
        })
      }
    }
  })

  /*
  
    a generic trigger for the warehouse loader above
    
  */
  .directive('digger', function($warehouseLoader, $safeApply){
    return {
      restrict:'EA',
      // we want this going before even the repeat
      // this lets us put the repeat and digger on the same tag
      // <div digger warehouse="/" selector="*" digger-repeat="children()" />
      priority: 1000,
      scope:true,
      link:function($scope, elem, $attrs){
        var loader = $warehouseLoader($scope);

        $scope.$on('digger:reload', function(){
          loader($attrs.selector, $attrs.warehouse);
        })

        $attrs.$observe('selector', function(selector){
          loader(selector, $attrs.warehouse);
        })
      }
    }
  })

});
require.register("binocarlos-digger-radio-for-angular/index.js", function(exports, require, module){


angular
  .module('digger.radio', [
    
  ])

  .factory('$containerRadio', function($safeApply){

    return function($scope, container){
      var radio = null;

      function cleanup(){
        if(radio){
          radio.cancel('*');  
          radio = null;
        }
      }

      $scope.$on('$destroy', cleanup);
      
      console.dir(container.toJSON());
      radio = container.radio();
      radio.bind();

      radio.on('radio:event', function(packet){
        $safeApply($scope, function(){
          $scope.$emit('radio:event', packet);
        })
      })
        
    }

  })

  .directive('diggerRadio', function($containerRadio){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      link:function($scope, elem, $attrs){
        
        $scope.$watch($attrs.for, function(container){
          if(!container){
            return;
          }

          $containerRadio($scope, container);


        })

      }
    }
  })

});
require.register("binocarlos-digger-filters-for-angular/index.js", function(exports, require, module){
angular
  .module('digger.filters', [
    
  ])

  .filter('ucfirst', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^\w/, function(st){
        return st.toUpperCase();
      })
    }
  })

  .filter('cutoff', function(){
    return function (text, length) {
      text = text || '';
      if(text.length>length){
        text = text.substr(0, length) + '...';
      }
      return text;
    }
  })

  .filter('idcolon', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^\w+:/, '');
    }
  })

  .filter('lastfieldpart', function(){
    return function(st){
      var parts = st.split('.');
      return parts.pop();
    }
  })

  .filter('money', function(){
    return function(st){
      if(!st){
        return '';
      }
      return ('' + st).replace(/^\./, '0.');
    }
  })

  .filter('icontitle', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^icon-/, '');
    }
  })

  .filter('datetime', function () {
    return function (timestamp) {
      var dt = new Date(timestamp);

      return dt.toString();
    }
  })

  .filter('matchContainer', function() {
    return function(items, selector) {
      if(!search){
        return items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        return item.match(selector);
      })
      return filtered;
    }
  })

  .filter('rejectContainer', function() {
    return function(items, selector) {
      if(!search){
        return items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        return !item.match(selector);
      })
      return filtered;
    }
  })

  .filter('parentContainer', function() {

    return function(items, parentid, noresults) {
      if(!items){
        return null;
      }
      parentid = parentid || '';
      if(!parentid.match(/\w/)){
        return noresults ? [] : items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        if(item.digger('diggerparentid')==parentid){
          filtered.push(item);
        }
      })
      return filtered;
    };
  })

  .filter('searchContainers', function() {

    return function(items, search, noresults) {
      if(!items){
        return null;
      }
      search = search || '';
      if(!search.match(/\w/)){
        return noresults ? [] : items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        var attr = item.get(0);
        var added = false;
        for(var prop in attr){
          var value = attr[prop];
          if(!added && value && typeof(value)==='string'){
            if(prop.indexOf('_')!=0 && value.toLowerCase().indexOf(search.toLowerCase())>=0){
              added = true;
              filtered.push(item);
            }  
          }
        }
      })
      return filtered;
    };
  })

  .filter('viewersort', function() {

    return function(items) {
      var ret = [].concat(items);
      ret.sort(function(a, b) {
        var textA = (a.attr('name') || a.tag()).toUpperCase();
        var textB = (b.attr('name') || b.tag()).toUpperCase();
        var folderA = (a.tag()=='folder');
        var folderB = (b.tag()=='folder');

        if(folderA && !folderB){
          return -1;
        }
        else if(folderB && !folderA){
          return 1;
        }
        
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });  
      return ret;
    };
  })
  
});
require.register("binocarlos-digger-repeat-for-angular/index.js", function(exports, require, module){
/*

  we are in private scope (component.io)
  
*/

angular
  .module('digger.repeat', [
    
  ])

  .directive('diggerRepeat',function($filter){
    return {
      transclude : 'element',
      scope:true,
      // we want this going first so other directives on the 
      // tag get access to $digger in the scope
      priority: 100,
      compile : function(element, attr, linker){
        return function($scope, $element, $attr){

          var self = this;
          var repeat_what = $attr.diggerRepeat || 'containers()';

          var fn_string = repeat_what;
          var parent = $element.parent();
          var elems = [];

          // build a new child scope and link to the transclude
          function build_template(container){
            var $child_scope = $scope.$new();
            $child_scope.$digger = container;
            linker($child_scope, function(clone_of_template){
              elems.push(clone_of_template);
              parent.append(clone_of_template);
            })
          }

          function reset_template(){
            elems.forEach(function(elem){
              elem.remove();
            })
          }

          function run_compile(){
            var $digger = $scope.$digger;
            if(!$digger){
              return;
            }
            reset_template();

            var st = '$digger.' + fn_string;

            try{
              var arr = eval(st);

              /*
              
                if we have a container back then turn it into an array for the loop
                
              */
              if(typeof(arr.containers)==='function'){
                arr = arr.containers();
              }

              arr.forEach(build_template);
            } catch (e){
              console.log('-------------------------------------------');
              console.dir(e);
              console.log(e.stack);
            }
          }
        
          $scope.$watch('$digger', run_compile);
        }
      }
    }
  })
});
require.register("binocarlos-digger-min-for-angular/index.js", function(exports, require, module){
require('digger-bootstrap-for-angular');
require('digger-utils-for-angular');
require('digger-supplychain-for-angular');
require('digger-radio-for-angular');
require('digger-filters-for-angular');
require('digger-repeat-for-angular');


/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    'digger.bootstrap',
    'digger.utils',
    'digger.supplychain',
    'digger.radio',
    'digger.filters',
    'digger.repeat'
  ])
});
require.register("diggerserve-angularmin/index.js", function(exports, require, module){
require('digger-min-for-angular');
});






require.alias("binocarlos-digger-min-for-angular/index.js", "diggerserve-angularmin/deps/digger-min-for-angular/index.js");
require.alias("binocarlos-digger-min-for-angular/index.js", "diggerserve-angularmin/deps/digger-min-for-angular/index.js");
require.alias("binocarlos-digger-min-for-angular/index.js", "digger-min-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-min-for-angular/deps/digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-min-for-angular/index.js", "binocarlos-digger-min-for-angular/index.js");
require.alias("diggerserve-angularmin/index.js", "diggerserve-angularmin/index.js");
require('diggerserve-angularmin');

})()
