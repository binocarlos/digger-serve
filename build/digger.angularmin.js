


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
    
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function($rootScope){
    
    /*
    
      auto template injection
      
    */
    var templates = {};

    var scripts = angular.element(document).find('script');

    scripts.each(function(index){
      var script = scripts.eq(index);
      if(script.attr('type')==='digger/field'){
        var name = script.attr('name');
        var html = script.html();
        if($digger.config.debug){
          console.log('-------------------------------------------');
          console.log('add template: ' + name);
          console.log(html);
        }
        $digger.template.add(name, html);
      }
    })

    /*
    
      DO BLUEPRINT AUTO INJECTION HERE
      
    */
   
  }])

  /*
  
    return the global digger
    
  */
  .factory('$digger', function(){
    return window.$digger;
  })

  /*
  
    the root controller gives access to things like the user and root warehouse
    
  */
  .controller('DiggerRootCtrl', function($scope, $rootScope, $digger){

    /*
    
      expose the connect command - this enables warehouses to be made from directives
      
    */
    $scope.connect = $digger.connect;

    /*
    
      expose the digger user - this is null if not logged in
      
    */
    $scope.user = $digger.user;

    /*
    
      expose the root warehouse - this can be used a the root container for the page
      
    */
    $scope.warehouse = $digger.connect($digger.config.root_warehouse || '/');
    $rootScope.warehouse = $scope.warehouse;

  })




/*

  digger is loaded but lets give the rest of the code a chance to register before we bootstrap
  
*/
setTimeout(function(){
  
  /*

    BOOTSTRAP
    
  */
  if(!window.$digger){
    throw new Error('$digger must be loaded on the same page to use the digger angular module');
  }

  var app = window.$digger.config.application || 'digger';

  /*
  
    this auto adds the Root Controller so the rest of the page has things like user in it's scope
    
  */
  document.documentElement.setAttribute('ng-controller', 'DiggerRootCtrl');
  angular.bootstrap(document, [app]);  
}, 100)
});
require.register("binocarlos-digger-utils-for-angular/index.js", function(exports, require, module){
/*

  tools used across the other files
  
*/

angular
  .module('digger.utils', [
    
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
        
      radio = container.radio();
        
      radio.listen('*', function(channel, packet){

        if($digger.config.debug){
          console.log('-------------------------------------------');
          console.log('radio: ' + channel);
          console.dir(packet);
        }
        var user = packet.headers['x-json-user'];

        if(packet.action=='append'){

          if(!packet.context){
            return;
          }

          var target = packet.context ? container.find('=' + packet.context._digger.diggerid) : container;

          if(target.isEmpty()){
            return;
          }

          var to_append = $digger.create(packet.body);

          $safeApply($scope, function(){
            to_append.each(function(append){
              var check = target.find('=' + append.diggerid());
              if(check.count()<=0){
                target.append(append);

              }
            })
            $scope.$emit('radio:event', {
              action:'append',
              user:user,
              target:target,
              data:to_append
            })
          })
        }
        else if(packet.action=='save'){
          var target_id = packet.body._digger.diggerid;
          var target = container.find('=' + target_id);

          if(target.isEmpty()){
            return;
          }

          $safeApply($scope, function(){
            target.inject_data(packet.body);
            $scope.$emit('radio:event', {
              action:'save',
              user:user,
              target:target
            })
          })
        }
        else if(packet.action=='remove'){
          var parent_id = packet.body._digger.diggerparentid;
          var target_id = packet.body._digger.diggerid;

          var parent = parent_id ? container.find('=' + parent_id) : container;
          var target = container.find('=' + target_id);

          if(parent.isEmpty() || target.isEmpty()){
            return;
          }

          $safeApply($scope, function(){
            parent.get(0)._children = parent.get(0)._children.filter(function(model){
              return model._digger.diggerid!=target.diggerid()
            })

            $scope.$emit('radio:event', {
              action:'remove',
              user:user,
              target:target
            })
          })
        }
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
