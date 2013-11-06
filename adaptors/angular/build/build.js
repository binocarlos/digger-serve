
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
        if(!packet.headers){
          packet.headers = {};
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
require.register("binocarlos-digger-form-for-angular/index.js", function(exports, require, module){
var templates = {
  form:require('./form'),
  field:require('./field'),
  list:require('./list'),
  fieldrender:require('./fieldrender')
}

angular
  .module('digger.form', [
    'digger',
    'digger.bootstrap'
  ])

  .filter('fieldtitle', function(){
    return function(title){
      return (title || '').replace(/_/g, ' ');
    }
  })

  .directive('diggerForm', function(){


    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        fields:'=',
        container:'=',
        fieldclass:'@',
        readonly:'@',
        showedit:'='
      },
      transclude:true,
      replace:true,
      template:templates.form,
      controller:function($scope){

      },
      link:function($scope, elem, $attrs){
        
      }
    }
  })

  .directive('diggerClassField', function($compile, $safeApply){
    return {
      restrict:'A',
      link:function($scope){

        function getstring(){

          return (($scope.model ? $scope.model[$scope.fieldname] : []) || []).join(', ');
        }

        function setstring(st){
          if(!$scope.model){
            return;
          }
          var parts = (st.split(/\W+/) || []).map(function(s){
            return s.replace(/^\s+/, '').replace(/\s+$/, '');
          })

          $scope.model[$scope.fieldname] = parts;
          //$safeApply($scope, function(){});
        }

        $scope.classval = getstring();
        $scope.$watch('classval', setstring);
        $scope.$watch('model', function(){
          $scope.classval = getstring();
        });

        
      }
    }
  })

  .factory('$digger_fields', function($safeApply){

    return [{
      name:'_digger.tag',
      title:'<tag>'
    },{
      name:'_digger.class',
      type:'diggerclass',
      title:'.class'
    },{
      name:'_digger.id',
      title:'#id'
    },{
      name:'_digger.icon',
      type:'diggericon',
      title:'icon'
    }]

  })



  .factory('$diggerFieldTypes', function(){

    /*
    
      the field types that we have in our core template

      the user can also use templates and components
      
    */
    var fieldtypes = {
      text:true,
      url:true,
      number:true,
      money:'number',
      email:true,
      textarea:true,
      diggerclass:true,
      diggericon:true,
      template:true,
      checkbox:true,
      radio:true,
      select:true,
      diggerurl:'binocarlos/digger-url-component',
      file:'binocarlos/file-uploader'
    }

    return {
      types:fieldtypes
    }
  })

  /*
  
    extracts the JS object that contains the target field - this becomes the model for the form field

    e.g. field = 'city.address'

    container.get(0).city

    -> 

    model = {
      address:'hello'
    }


    
  */
  .factory('$propertyModel', function(){
    return function(container, fieldname){
      if(!container || !fieldname){
        return {};
      }
      if(fieldname.indexOf('.')>0){
        var parts = fieldname.split('.');
        var fieldname = parts.pop();
        var basename = parts.join('.');

        return {
          fieldname:fieldname,
          model:container.attr(basename)
        }
      }
      else{
        return {
          fieldname:fieldname,
          model:container.get(0)
        }
      }
    }
  })

  /*
  
    the directive that triggers us loading the component remotely and injecting / compiling it when done
    
  */
  .directive('diggerComponent', function(DiggerComponentLoader, $compile){
    return {
      restrict:'EA',
      scope:{
        name:'=',
        field:'=',
        container:'=', 
        model:'=',
        fieldname:'=',
        readonly:'='
      },
      replace:true,
      template:'<div></div>',
      controller:function($scope){

        // we load the component from the server
        // once it has done - require the component (it has registered via the script load)
        $scope.$watch('name', function(name){

          if(!name){
            return;
          }


          if($digger.config.debug){
            console.log('-------------------------------------------');
            console.log('compiling component: ' + name);
          }
          DiggerComponentLoader.load(name).then(function(html){
            if($digger.config.debug){
              console.log('-------------------------------------------');
              console.log(name + ' LOADED');
              console.dir(html);
            }

            $scope.component_html = html;
            
          }, function(error){
            if($digger.config.debug){
              console.log('-------------------------------------------');
              console.log('component error!');
              console.dir(error);
            }
          })
        })

        

      },
      link:function($scope, elem, $attrs){

        // this is changed once we have loaded the remote component
        $scope.$watch('component_html', function(html){
          var widget = $compile(html)($scope);
          elem.html('');
          elem.append(widget);
        })
      }
    }
  })

  .directive('diggerFieldRender', function($compile, $diggerFieldTypes){

    return {
      restrict:'EA',
      scope:{
        field:'=',
        container:'=', 
        model:'=',
        fieldname:'=',
        readonly:'='
      },
      replace:true,
      template:templates.fieldrender,
      controller:function($scope){

        $scope.$watch('container', function(){
          $scope.setup_render_type();
        })

        $scope.$watch('field', function(){
          $scope.setup_render_type();
        })

        /*
        
          sort out the values for the field to render

          we check if we are rendering a template or component
          
        */
        $scope.setup_render_type = function(){

          if(!$scope.container){
            return;
          }
          if(!$scope.field){
            return;
          }



          /*
          
            a manual regexp given by the blueprint
            
          */
          var pattern = $scope.field.pattern || '';

          if(pattern.length<=0){
            $scope.pattern = /./;
          }
          else{
            $scope.pattern = new RegExp(pattern);
          }

          /*
          
            options
            
          */
          // the options are supplied as an array extracted from the field's option children (inside the blueprint XML / container)
          if($scope.field.options){
            $scope.options = $scope.field.options;
          }

          // the options are supplied as csv
          if($scope.field.options_csv){

            $scope.options = ($scope.field.options_csv.split(/,/) || []).map(function(option){
              return option.replace(/^\s+/, '').replace(/\s+$/, '');
            })

          }
          // read the options list from digger
          else if($scope.field.options_warehouse){
            var warehouse = $digger.connect($scope.field.options_warehouse);

            warehouse($scope.field.options_selector).ship(function(results){
              $safeApply($scope, function(){
                $scope.options = results.map(function(result){
                  return result.title();
                })
              })
            })
          }

          
          var fieldtype = 'text';

          if($diggerFieldTypes.types[$scope.field.type]){
            var info = $diggerFieldTypes.types[$scope.field.type];

            if(typeof(info)==='string'){
              fieldtype = info;
            }
            else{
              fieldtype = $scope.field.type;
            }
          }
          else if($scope.field.type){
            fieldtype = $scope.field.type;
          }

          /*
          
            if they have registered a custom template then use that!
            
          */
          var template = $digger.template.get(fieldtype);

          if(template){
            $scope.fieldtype = 'template';
            $scope.rendertemplate = template;
          }
          /*
          
            COMPONENT

            any field type with '/' means it is a component living on github
            
          */
          else if((fieldtype || '').match(/\//)){
            $scope.fieldtype = 'component';
            $scope.rendercomponent = fieldtype;
          }
          /*
          
            DIGGER FIELD

            standard digger fields
            
          */
          else{
            $scope.fieldtype = fieldtype;//fieldtypes[$scope.field.type] ? $scope.field.type : 'text';
          }

          var titlename = $scope.field ? $scope.field.name : '';

          if(!titlename){
            titlename = '';
          }

          $scope.field.usetitle = $scope.field.title ? $scope.field.title : (titlename.split('.').pop());
        }
      },
      link:function($scope, elem, $attrs){

        $scope.$watch('rendertemplate', function(html){

          if(!html){
            return;
          }

          elem.append($compile(html)($scope));
        })
          
      }
    }
  })

  .directive('diggerListRender', function($safeApply){
    function littleid(chars){

      chars = chars || 6;

      var pattern = '';

      for(var i=0; i<chars; i++){
        pattern += 'x';
      }
      
      return pattern.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }

    return {
      restrict:'EA',
      scope:{
        field:'=',
        container:'=', 
        model:'=',
        fieldname:'=',
        readonly:'='
      },
      replace:true,
      template:templates.list,
      controller:function($scope){

        $scope.$watch('model', function(model){
          if(!model){
            return;
          }

          if(!$scope.model[$scope.fieldname]){
            $scope.model[$scope.fieldname] = [];
          }
          $scope.list = $scope.model[$scope.fieldname].map(function(item){
            return {
              value:item
            }
          })
          $scope.usefieldname = 'value';
        })

        $scope.$watch('list', function(list){
          $scope.model[$scope.fieldname] = list.map(function(item){
            return item.value;
          })
        }, true);

        $scope.addrow = function(){
          $scope.list.push({
            value:null
          })
        }

        $scope.deleterow = function(index){
          $scope.list.splice(index,1);
        }

        $scope.moverow = function(old_index, dir){

          var new_index = old_index + dir;
          if (new_index >= $scope.list.length) {
              var k = new_index - $scope.list.length;
              while ((k--) + 1) {
                  $scope.list.push(undefined);
              }
          }
          $scope.list.splice(new_index, 0, $scope.list.splice(old_index, 1)[0]);



        }

      }
    }
  })

  .directive('diggerField', function($compile, $safeApply, $propertyModel, $diggerFieldTypes){

    //field.required && showvalidate && containerForm[field.name].$invalid


    return {
      restrict:'EA',
      scope:{
        field:'=',
        container:'=', 
        listindex:'=',
        fieldclass:'=',
        globalreadonly:'=readonly'
      },
      replace:true,
      template:templates.field,
      controller:function($scope){

        function setupreadonly(){
          var globalval = $scope.globalreadonly;
          if(typeof(globalval)=='string'){
            globalval = globalval=='true' ? true : false;
          }
          $scope.readonly = globalval || ($scope.field.type==='readonly' || $scope.field.readonly || ($scope.container ? $scope.container.data('readonly') : false));
        }
        
        $scope.$watch('globalreadonly', function(globalreadonly){
          
          setupreadonly();

          //$scope.parentreadonly = globalreadonly;
          //setupreadonly();
        })

        $scope.fieldname = '';
        $scope.rendertype = 'text';

        if(typeof($scope.field.required)=='string'){
          $scope.field.required = eval($scope.field.required);
        }

        $scope.setup = function(){
          $scope.setup_field_and_model();
          setupreadonly();
        }

        /*
        
          get the containing model for the field - this might be nested in the container
          
        */
        $scope.setup_field_and_model = function(){

          if(!$scope.container){
            return;
          }
          if(!$scope.field){
            return;
          }

          var parsedmodel = $propertyModel($scope.container, $scope.field.name);

          $scope.fieldname = parsedmodel.fieldname;
          $scope.model = parsedmodel.model;

          if($scope.field.list && !$scope.model[$scope.field.name]){
            $scope.model[$scope.field.name] = [];
          }
        }


      },
      link:function($scope, elem, $attrs){

        $scope.$watch('container', function(){
          $scope.setup();
        })

        $scope.$watch('field', function(){
          $scope.setup();
        })

          
      }

    }
  })
});
require.register("binocarlos-digger-form-for-angular/form.js", function(exports, require, module){
module.exports = ' \n<div ng-form="diggerForm" class="form-horizontal">\n  <div class="form-group" ng-repeat="field in fields" ng-class="{\'has-error\': container.data(\'error.\' + field.name)}">\n    <label ng-if="field.label!=false" for="{{ field.name }}" class="control-label col-lg-4">{{ field.usetitle | fieldtitle | ucfirst }}</label>\n    <div ng-class="{\'col-lg-7\':field.label!=false,\'col-lg-11\':field.label==false}">\n      <digger-field readonly="readonly" field="field" container="container" fieldclass="fieldclass" />\n    </div>\n    \n    <div class="col-sm-1" ng-show="showedit">\n      <a href="#" class="btn btn-sm btn-warning" ng-click="$emit(\'deletefield\', field)">\n          <i class="fa fa-trash-o"></i>\n      </a>\n    </div>\n    \n  </div>\n  <div ng-transclude></div>\n</div>';
});
require.register("binocarlos-digger-form-for-angular/field.js", function(exports, require, module){
module.exports = '<div>\n	<div ng-if="!field.list">\n		<digger-field-render readonly="readonly" field="field" container="container" model="model" fieldname="fieldname" />\n	</div>\n	<div ng-if="field.list">\n		<digger-list-render readonly="readonly" field="field" container="container" model="model" fieldname="fieldname" />\n	</div>\n</div>';
});
require.register("binocarlos-digger-form-for-angular/list.js", function(exports, require, module){
module.exports = '<div class="well">\n\n	<div ng-repeat="item in list track by $id(item)" style="margin-top:5px;">\n		<div class="row">\n			<div class="col-sm-10">\n				<digger-field-render readonly="readonly" field="field" container="container" model="item" fieldname="usefieldname" />\n			</div>\n			<div class="col-sm-2">\n\n				<button class="btn btn-xs" ng-class="{\'digger-form-invis\':$first}" ng-click="moverow($index, -1)">\n				 	<i title="Up" class="icon-sort-up icon-white"></i>\n				</button>\n\n				<button class="btn btn-xs" ng-click="deleterow($index);">\n				 	<i title="Delete" class="icon-trash icon-white"></i>\n				</button>\n\n				<button class="btn btn-xs" ng-class="{\'digger-form-invis\':$last}" ng-click="moverow($index, 1)">\n				 	<i title="Down" class="icon-sort-down icon-white"></i>\n				</button>\n\n			</div>\n		</div>\n	</div>\n\n	<button class="btn btn-info btn-sm" ng-click="addrow()" style="margin-top:10px;">\n	 	add\n	</button>\n\n</div>';
});
require.register("binocarlos-digger-form-for-angular/fieldrender.js", function(exports, require, module){
module.exports = '<div ng-switch="fieldtype">\n	<div ng-switch-when="textarea">\n		<textarea style="min-height:200px;width:100%;" name="{{ field.name }}" class="form-control" ng-readonly="{{ readonly }}" ng-model="model[fieldname]"></textarea>\n	</div>\n	<div ng-switch-when="template">\n		\n	</div>\n	<div ng-switch-when="component">\n		<digger-component name="rendercomponent" fieldname="fieldname" field="field" model="model" container="container" readonly="readonly" />\n	</div>\n\n	<div ng-switch-when="diggerclass">\n		<input name="{{ field.name }}" digger-class-field class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="classval" ng-readonly="{{ readonly }}" />\n	</div>\n\n	<div ng-switch-when="diggericon">\n\n		<div class="row">\n			<div class="col-sm-6">\n				<input name="{{ field.name }}" placeholder="fa-folder" class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="model[fieldname]"  ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="{{ readonly }}" ng-pattern="pattern" />\n			</div>\n			<div class="col-sm-6">\n				<a href="http://fortawesome.github.io/Font-Awesome/icons/" target="_blank" class="btn btn-info">icon list</a>\n			</div>\n		</div>\n		\n	</div>\n\n	<div ng-switch-when="radio">\n		<span ng-repeat="option in options">\n			<input type="radio"\n				ng-readonly="{{ readonly }}" \n	       ng-model="model[fieldname]"\n	       value="{{option}}" /> <small>{{ option }}</small> &nbsp;\n	  </span>\n\n	</div>\n	<div ng-switch-when="select">\n\n		<select \n			class="form-control" \n			ng-disabled="{{ readonly }}"\n			ng-model="model[fieldname]" \n			ng-options="o for o in options"></select>\n\n	  \n	</div>\n	<div ng-switch-when="checkbox">\n\n		<input ng-readonly="{{ readonly }}" type="checkbox" ng-model="model[fieldname]" />\n		\n	</div>\n	<div ng-switch-when="text">\n		<!--<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="model[fieldname]"  ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" ng-pattern="pattern" />-->\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="model[fieldname]" ng-readonly="{{ readonly }}"  />\n	</div>\n	<div ng-switch-when="email">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="email" ng-model="model[fieldname]" ng-readonly="{{ readonly }}"  />\n	</div>\n	<div ng-switch-when="url">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="url" ng-model="model[fieldname]" ng-readonly="{{ readonly }}"  />\n	</div>	\n	<div ng-switch-when="number">\n		<input id="{{ field.name }}" name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="number" ng-model="model[fieldname]" ng-readonly="{{ readonly }}" />\n	</div>\n</div>';
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
require.register("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", function(exports, require, module){
var module;
var template = require('./abn_tree_template.js')
module = angular.module('angularBootstrapNavTree', []);

module.directive('abnTree', function($timeout) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      treeData: '=',
      onSelect: '&'      
    },
    link: function(scope, element, attrs) {
      var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch;
      if (attrs.iconExpand == null) {
        attrs.iconExpand = 'fa-plus';
      }
      if (attrs.iconCollapse == null) {
        attrs.iconCollapse = 'fa-minus';
      }
      if (attrs.iconLeaf == null) {
        attrs.iconLeaf = 'fa-chevron-right';
      }
      if (attrs.expandLevel == null) {
        attrs.expandLevel = '3';
      }
      expand_level = parseInt(attrs.expandLevel, 10);
      scope.header = attrs.header;
      if (!scope.treeData) {
        alert('no treeData defined for the tree!');
      }
      if (scope.treeData.length == null) {
        if (treeData._digger != null) {
          scope.treeData = [treeData];
        } else {
          alert('treeData should be an array of root branches');
        }
      }
      for_each_branch = function(f) {
        var do_f, root_branch, _i, _len, _ref, _results;
        do_f = function(branch, level) {
          var child, _i, _len, _ref, _results;
          f(branch, level);
          if (branch._children != null) {
            _ref = branch._children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(do_f(child, level + 1));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(do_f(root_branch, 1));
        }
        return _results;
      };
      for_each_branch(function(b, level) {
        b.level = level;
        return b._data.expanded = b.level < expand_level;
      });


      scope.selectedid = null;

      

      select_branch = function(branch) {
        scope.selectedid = branch._digger.diggerid;
        
        if (branch.onSelect != null) {
          return $timeout(function() {
            return branch.onSelect(branch);
          });
        } else {
          if (scope.onSelect != null) {
            return $timeout(function() {
              return scope.onSelect({
                branch: branch
              });
            });
          }
        }
      };
      scope.$on('tree:reset', function(ev){
        scope.selectedid = null;
      })
      scope.$on('tree:setselected', function(ev, selected){
        scope.selectedid = selected._digger.diggerid;
      })
      scope.user_clicks_branch = function(branch) {
        if (branch !== selected_branch){
          return select_branch(branch);
        }
      };
      scope.togglebranch = function(branch, value){
        branch._data.expanded = arguments.length>1 ? value : !branch._data.expanded; 
        scope.$emit('tree:toggle', branch);
      }
      scope.tree_rows = [];
      on_treeData_change = function() {
        var add_branch_to_list, root_branch, _i, _len, _ref, _results;
        scope.tree_rows = [];
        for_each_branch(function(branch) {
          if (branch._children) {
            if (branch._children.length > 0) {
              return branch._children = branch._children.map(function(e) {
                if (typeof e === 'string') {
                  return {
                    name: e,
                    children: []
                  };
                } else {
                  return e;
                }
              })
            }
          } else {
            return branch._children = [];
          }
        });
        add_branch_to_list = function(level, branch, visible) {
          var child, child_visible, tree_icon, expand_icon, _i, _len, _ref, _results;
          if(!branch._data){
            branch._data = {};
          }

          if(branch._data.tree_filter!==undefined){
            if(!branch._data.tree_filter){
              return;
            }
          }

          var filtered_children = (branch._children || []).filter(function(c){
            var data = c._data || {};
            if(data.tree_filter!==undefined){
              if(!data.tree_filter){
                return false;
              }
            }
            return true;
          })

          var has_children = filtered_children.length>0;

          if (branch._data.expanded == null) {
            branch._data.expanded = false;
          }

          /*
          if (!branch._children || branch._children.length === 0) {
            tree_icon = attrs.iconLeaf;
          } else {
            
          }
          */

          tree_icon = 'fa-folder';
          if(has_children){

            if (branch._data.expanded) {
              expand_icon = attrs.iconCollapse;
            } else {
              expand_icon = attrs.iconExpand;
            }  
          }

          if(branch._data.tree_icon){
            tree_icon = branch._data.tree_icon;
          }
          
          var digger = branch._digger || {};
          
          if(!branch._id && digger.diggerid){
            branch._id = digger.diggerid;
          }
          scope.tree_rows.push({
            level: level,
            branch: branch,
            _label: branch.name || branch.title || digger.tag || 'model',
            tree_icon: tree_icon,
            expand_icon: expand_icon,
            visible: visible
          });
          if (branch._children != null) {
            _ref = [].concat(branch._children);
            _ref.sort(function(a, b) {
              var textA = (a.name || a._digger.tag).toUpperCase();
              var textB = (b.name || b._digger.tag).toUpperCase();
              var folderA = (a._digger.tag=='folder');
              var folderB = (b._digger.tag=='folder');

              if(folderA && !folderB){
                return -1;
              }
              else if(folderB && !folderA){
                return 1;
              }
              
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }); 
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              child_visible = visible && branch._data.expanded;
              _results.push(add_branch_to_list(level + 1, child, child_visible));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(add_branch_to_list(1, root_branch, true));
        }
        if(!scope.selectedid && scope.treeData[0] && scope.treeData[0]._digger){
          scope.selectedid = scope.treeData[0]._digger.diggerid;
        }
        return _results;
      };
      
      return scope.$watch('treeData', on_treeData_change, true);
    }
  };
});

});
require.register("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_template.js", function(exports, require, module){
module.exports = '<ul class="nav nav-list abn-tree">\n  <li \n  	ng-repeat="row in tree_rows | filter:{visible:true} track by row.branch._id" \n  	ng-animate="\'abn-tree-animate\'" \n  	ng-class="\'level-\' + {{ row.level }} + (row.branch._id == selectedid ? \' active\':\'\')" \n  	class="abn-tree-row">\n  		<a ng-click="user_clicks_branch(row.branch)">\n        \n          <table border=0 cellpadding=0 cellspacing=0 style="float:left;">\n            <tr><td width=50%>\n        			<i \n        				ng-class="row.expand_icon" \n                ng-show="row.expand_icon" \n        				ng-click="togglebranch(row.branch)" \n        				class="indented fa tree-icon"> </i>\n            </td><td width=50%>\n          \n        			<i ng-class="row.tree_icon" \n        				 ng-click="togglebranch(row.branch)" \n        				 class="indented fa tree-icon"></i>\n            </td>\n          </tr></table>\n        \n  			<span class="indented tree-label" style="padding-left:5px;">{{ row._label }}</span>\n  	  </a>\n  </li>\n</ul>';
});
require.register("binocarlos-digger-tree-for-angular/index.js", function(exports, require, module){
/*

  we are in private scope (component.io)
  
*/
require('digger-utils-for-angular');
require('bootstrap-tree-for-angular');

var template = require('./template');

angular
  .module('digger.tree', [
    'digger.utils',
    'angularBootstrapNavTree'
  ])


  .directive('diggerTree', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'=',
        selectedid:'=',
        iconfn:'=',
        filter:'@',
        depth:'='
      },
      replace:true,
      transclude:true,
      template:template,
      controller:function($scope){

        $scope.depth = $scope.depth || 4;
        $scope.treedata = [];

        var to_expand = null;
        var to_contract = null;
        var to_select = null;

        $scope.$on('tree:expand', function($e, container){
          if(!$scope.container){
            to_expand = container;
            return;
          }
          $scope.container.find('=' + container.diggerid()).data('expanded', true);
        })

        $scope.$on('tree:contract', function($e, container){
          if(!$scope.container){
            to_contract = container;
            return;
          }
          $scope.container.find('=' + container.diggerid()).data('expanded', false);
        })

        $scope.$on('tree:setselected', function(ev, selected){
          if(!selected){
            return;
          }

          

          var current = $scope.container.find('=' + selected._digger.diggerid);

          var ancestors = [current];

          current.data('expanded', true);
          while(current.diggerparentid()){
            current = $scope.container.find('=' + current.diggerparentid())
            current.data('expanded', true);
            ancestors.unshift(current);
          }

          // this code is starting to get horrible and I hate myself
          $scope.$emit('tree:ancestors', ancestors);
        })

        $scope.$on('tree:select', function($e, container){
          if(!$scope.container){
            to_select = container;
            return;
          }
          $scope.$broadcast('tree:setselected', container.get(0));
        })
        
        $scope.$watch('container.models', function(models){
          if(!models){
            return;
          }

          var container = $digger.create(models);

          var warehouse = container.diggerwarehouse();

          container.data('expanded', true);
          container.recurse(function(c){
            //c.data('label', c.title());
            if(!c.diggerwarehouse()){
              c.diggerwarehouse(warehouse);
            }
            if($scope.filter){
              c.data('tree_filter', c.tag()=='_supplychain' || c.match($scope.filter));
            }
            if($scope.iconfn){
              c.data('tree_icon', $scope.iconfn(c));
            }            
          })

          if(!($scope.title || '').match(/\w/)){
            $scope.title = container.title();
          }

          $scope.treedata = container.models;

          if(to_expand){
            $scope.$emit('tree:expand', to_expand);
            to_expand = null;
          }

          if(to_contract){
            $scope.$emit('tree:contract', to_contract);
            to_contract = null;
          }

          if(to_select){
            $scope.$emit('tree:select', to_select);
            to_select = null;
          }

        }, true)

        $scope.container_select = function(model){
          $scope.$emit('tree:selected', $scope.container.spawn(model));
        }
      }
    }
  })
});
require.register("binocarlos-digger-tree-for-angular/template.js", function(exports, require, module){
module.exports = '<div>\n<div ng-transclude></div>\n <abn-tree tree-data="treedata" on-select="container_select(branch)" expand-level="depth"></abn-tree>\n</div>';
});
require.register("mafintosh-json-markup/index.js", function(exports, require, module){
var INDENT = '    ';

var type = function(doc) {
	if (doc === null) return 'null';
	if (Array.isArray(doc)) return 'array';
	if (typeof doc === 'string' && /https?:/.test(doc)) return 'link';

	return typeof doc;
};

var escape = function(str) {
	return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

module.exports = function(doc) {
	var indent = '';

	var forEach = function(list, start, end, fn) {
		if (!list.length) return start+' '+end;

		var out = start+'\n';

		indent += INDENT;
		list.forEach(function(key, i) {
			out += indent+fn(key)+(i < list.length-1 ? ',' : '')+'\n';
		});
		indent = indent.slice(0, -INDENT.length);

		return out + indent+end;
	};

	var visit = function(obj) {
		if (obj === undefined) return '';

		switch (type(obj)) {
			case 'boolean':
			return '<span class="json-markup-bool">'+obj+'</span>';

			case 'number':
			return '<span class="json-markup-number">'+obj+'</span>';

			case 'null':
			return '<span class="json-markup-null">null</span>\n';

			case 'string':
			return '<span class="json-markup-string">"'+escape(obj)+'"</span>';

			case 'link':
			return '<span class="json-markup-string">"<a href="'+escape(obj)+'">'+escape(obj)+'</a>"</span>';

			case 'array':
			return forEach(obj, '[', ']', visit);

			case 'object':
			var keys = Object.keys(obj).filter(function(key) {
				return obj[key] !== undefined;
			});

			return forEach(keys, '{', '}', function(key) {
				return '<span class="json-markup-key">'+key + ':</span> '+visit(obj[key]);
			});
		}

		return '';
	};

	return '<div class="json-markup">'+visit(doc)+'</div>';
};

});
require.register("binocarlos-digger-viewer-for-angular/index.js", function(exports, require, module){
/*

  we are in private scope (component.io)
  
*/
var template = require('./template');
var jsontemplate = require('./jsonviewer');
var jsonMarkup = require('json-markup');


angular
  .module('digger.viewer', [
    
  ])

  .directive('diggerJson', function(){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'='        
      },
      replace:true,
      template:jsontemplate,
      controller:function($scope){
        $scope.$watch('container', function(container){
          if(!container){
            return null;
          }

          $scope.model = container.get(0);
        })

      },

      link:function($scope, elem, $attrs){

        $scope.$watch('model', function(model){
          if(!model){
            return;
          }

          var clone = JSON.parse(JSON.stringify(model));
          delete(clone._children);
          delete(clone._data);
          
          var jsonhtml = jsonMarkup(clone);
          elem.html(jsonhtml);

        }, true)
      }

    }
  })


  .directive('diggerViewer', function($safeApply, $digger_fields){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'=',
        iconfn:'=',
        extra_fields:'=',
        settings:'='
      },
      replace:true,
      template:template,
      link:function($scope, elem){

        $scope.selectbranchurl = function(){
          var branchtext = elem.find('#branchurl');
          var branchelem = branchtext.get(0);

          branchelem.focus();
          branchelem.select();
        }

        $scope.selectcontainerurl = function(){
          var branchtext = elem.find('#containerurl');  
          var branchelem = branchtext.get(0);

          branchelem.focus();
          branchelem.select();
        }
      },
      controller:function($scope){

      	$scope.tabmode = 'children';
        $scope.showtab = {};
        $scope.diggeractive = true;

        if($scope.settings.diggeractive!==undefined){
          $scope.diggeractive = $scope.settings.diggeractive;
        }

        $scope.hidedelete = function(){
          if(!$scope.settings){
            return false;
          }

          var mode = $scope.settings.nodelete;

          if(typeof(mode)==='function'){
            return mode();
          }
          else{
            return mode;
          }
        }

        $scope.settings_button_clicked = function(button){
          $scope.$emit('viewer:button', button);
        }

        $scope.buttonclass = function(){
          return $scope.settings.buttonclass || '';
        }

        $scope.toggledigger = function(){
          $scope.diggeractive = !$scope.diggeractive;
        }

        $scope.geticon = function(container){
          return $scope.iconfn ? $scope.iconfn(container) : 'fa-file';
        }

        $scope.setmode = function(mode){
          $scope.tabmode = mode;
          $scope.deletemode = false;
          if($scope.settings.tabchange){
            $scope.settings.tabchange(mode);
          }
        }

        $scope.haserror = function(){
          var errorfound = false;
          Object.keys($scope.container.data('error') || {}).forEach(function(key){
            if($scope.container.data('error.' + key)){
              errorfound = true;
            }
          })
          return errorfound;
        }

        $scope.$on('viewer:mode', function(ev, mode){
          $scope.setmode(mode);
        })

        

        $scope.$watch('settings.blueprints', function(blueprints){
          if(!blueprints){
            return;
          }
          $scope.addchildren = $digger.blueprint.filter_children(blueprints, $scope.blueprint);
        })

        $scope.render_children = function(){
          var container = $scope.container;

          $scope.children = container.children().containers();

          if($scope.settings.filterchildren){
            $scope.children = $scope.children.filter($scope.settings.filterchildren);
          }

          $scope.deletemode = false;

          var icon = container.digger('icon');

          if(!icon && $scope.iconfn){
            container.digger('icon', $scope.iconfn(container));
          }

          //if(!$scope.settings.blueprints){
            var addchildren = $digger.blueprint.all_containers(true);
            $scope.addchildren = $digger.blueprint.filter_children(addchildren, $scope.blueprint);
          //}
          
          var digger_leaf = container.digger('leaf');

          if(!digger_leaf){
            var has_children = $digger.blueprint.has_children($scope.blueprint);

            digger_leaf = !has_children;
          }
          $scope.showchildren = !digger_leaf;
          $scope.issaved = true;
          if(container.data('new')){
            $scope.showchildren = false;
            $scope.issaved = false;
          }
          if($scope.settings.showchildren===false){
            $scope.showchildren = false;
          }
          //$scope.showdetails = true;//$scope.blueprint ? true:false;//(($scope.blueprint.fields || []).length>0) : false;
          $scope.showdetails = container.tag()!='_supplychain';
          $scope.issupplychain = container.tag()=='_supplychain';
          $scope.edit_container = container;

          if(!$scope.showchildren || $scope.settings.blueprintmode){
            $scope.tabmode = 'details';
          }

          $scope.container_url = $digger.config.diggerurl + container.diggerurl();
          $scope.container_branch = container.diggerurl();

          $scope.digger_fields = $digger_fields;
        }

        $scope.$watch('container', function(container){
          if(!container){
            return;
          }
          $scope.render_children();
        })

        $scope.$on('viewer:render', function(){
          $scope.render_children();
        })

        $scope.selectparent = function(){
          $scope.$emit('viewer:up');
        }

        $scope.add_from_blueprint = function(blueprint){
          $scope.$emit('viewer:add', blueprint);
          $scope.addmode = true;
        }

        $scope.deletemode = false;

        $scope.click_container = function(container, force){
          $scope.$emit('viewer:selected', container, force);
        }

        $scope.cancelcontainer = function(){
          if(!$scope.addmode){
            $scope.$emit('viewer:cancel');
          }
          else{
            $scope.$emit('viewer:canceladd');  
            $scope.addmode = false;  
          }
          
        }

        $scope.canceldelete = function(){
          $scope.deletemode = false;
        }

        $scope.$on('viewer:delete:press', function(){
          $scope.deletecontainer();
        })

        $scope.$on('viewer:set:tab:' + $scope.settings.id, function(ev, tab){
          $scope.tabmode = tab;
          if($scope.settings.tabchange){
            $scope.settings.tabchange(tab);
          }
        })

        $scope.deletecontainer = function(confirm){
          if(!confirm){
            $scope.deletemode = true;
          }
          else{
            $scope.$emit('viewer:remove');
            $scope.deletemode = false;
          }
        }

        $scope.savecontainer = function(){
          $scope.$emit('viewer:save');
          $scope.addmode = false;
        }
      }
    }
  })
});
require.register("binocarlos-digger-viewer-for-angular/template.js", function(exports, require, module){
module.exports = '<div>\n  <div class="row" ng-show="deletemode" style="padding:20px;">\n    Are you sure?<br /><br />\n\n    <button class="btn btn-info" ng-click="canceldelete()">No Cancel</button>\n    <button class="btn btn-danger" ng-click="deletecontainer(true)">Yes! Delete</button>\n  </div>\n\n  <div ng-hide="deletemode">\n    <ul class="nav nav-tabs" id="viewerTab">\n      \n      <li ng-show="showchildren" ng-class="{active:tabmode==\'children\'}"><a style="cursor:pointer;" ng-click="setmode(\'children\')">Children</a></li>\n      <li ng-show="showdetails" ng-class="{active:tabmode==\'details\'}"><a style="cursor:pointer;" ng-click="setmode(\'details\')">Data</a></li>\n      <li ng-repeat="tab in blueprint.tabs" ng-class="{active:tabmode==tab.name}"><a style="cursor:pointer;" ng-click="setmode(tab.name)">{{ tab.name | ucfirst }}</a></li>\n      \n      <li ng-show="settings.showdigger && !issupplychain" ng-class="{active:tabmode==\'digger\'}"><a style="cursor:pointer;" ng-click="setmode(\'digger\')">Digger</a></li>\n      <li ng-show="settings.showjson" ng-class="{active:tabmode==\'json\'}"><a style="cursor:pointer;" ng-click="setmode(\'json\')">JSON</a></li>\n    </ul>\n\n    <!--\n      nav pills\n     -->\n    <div class="row" style="border-bottom:1px dotted #e5e5e5;margin-bottom:10px;" ng-if="!settings.readonly && (tabmode!=\'children\')">\n      <ul class="nav nav-pills">\n        <li ng-show="edit_container.tag()!=\'_supplychain\' && settings.showup && !addmode">\n          <a href="" ng-click="selectparent()">up</a>\n        </li>\n        <li ng-show="addmode || settings.cancelbutton">\n          <a href="" ng-click="cancelcontainer()">cancel</a>\n        </li>\n        <li ng-hide="hidedelete()">\n          <a href="" ng-click="deletecontainer()">delete</a>\n        </li>\n        <li ng-hide="edit_container.tag()==\'_supplychain\' || haserror()">\n          <a href="" ng-click="savecontainer()">save</a>\n        </li>\n      </ul>\n    </div>\n\n    <div id="myTabContent" class="tab-content">\n      <!--\n        children\n       -->\n      <div ng-show="showchildren" ng-class="{active:tabmode==\'children\', in:tabmode==\'children\', fade:tabmode!=\'children\'}" class="tab-pane" id="children">\n\n        <div class="row" ng-hide="settings.readonly" style="border-bottom:1px dotted #e5e5e5;margin-bottom:10px;">\n          <div class="col-sm-12">\n\n            <!--\n              <div ng-repeat="blueprint in addchildren" style="margin-bottom:5px;">\n                <button style="width:100%;" class="btn btn-sm btn-info" ng-click="add_from_blueprint(blueprint)">new {{ blueprint.title() }}</button>\n              </div>\n              <div ng-repeat="button in settings.buttons" style="margin-bottom:5px;">\n                <button style="width:100%;" ng-hide="settings.hidebuttonfn(button)" ng-class="\'btn btn-sm \' + button.class" ng-click="settings_button_clicked(button)">{{ button.title }}</button>\n              </div>\n            -->\n\n            <ul class="nav nav-pills">\n\n              <li class="dropdown">\n                <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n                  new <span class="caret"></span>\n                </a>\n                <ul class="dropdown-menu" role="menu">\n                  <li ng-repeat="blueprint in addchildren"><a href="" ng-click="add_from_blueprint(blueprint)">{{ blueprint.title() }}</a></li>\n                </ul>\n              </li>\n              <li ng-repeat="button in settings.buttons" ng-hide="settings.hidebuttonfn(button)" >\n                <a href="" ng-click="settings_button_clicked(button)">{{ button.title }}</a>\n              </li>\n              <li ng-show="edit_container.tag()!=\'_supplychain\' && settings.showup && !addmode">\n                <a href="" ng-click="selectparent()">up</a>\n              </li>\n              \n            </ul>\n\n          </div>\n        </div>\n\n        <div class="row">\n          <div class="col-sm-12">\n\n            <!--\n              CHILDREN LOOP\n             -->\n            <div class="digger-viewer-container" ng-class="{selected:$digger.data(\'selected\')}" ng-repeat="$digger in children | viewersort" ng-click="click_container($digger)" ng-dblclick="click_container($digger, true)">\n\n              <div style="margin-bottom:5px;">\n                <i class="fa icon" ng-class="geticon($digger)"></i>\n              </div>\n              <div>\n                {{ $digger.title() }}\n              </div>\n\n            </div>\n\n          </div>\n        </div>\n      </div>\n\n\n      <!--\n        details\n       -->\n      <div ng-show="showdetails" ng-class="{active:tabmode==\'details\', in:tabmode==\'details\', fade:tabmode!=\'details\'}" class="tab-pane" id="details" style="margin-top:20px;">\n         <form class="form form-horizontal" name="containerForm" onSubmit="return false;" ng-hide="deletemode">\n\n            <fieldset>\n              \n                <form novalidate>\n                  <digger-form showedit="settings.showedit" readonly="{{ settings.readonly }}" fieldclass="{{ settings.fieldclass }}" fields="blueprint.fields" container="edit_container" />\n                </form>\n              \n            </fieldset>\n\n          </form>\n\n\n        \n\n\n        \n\n      </div>\n\n\n      <!--\n        Digger\n       -->\n      <div ng-show="settings.showdigger && !issupplychain" ng-class="{active:tabmode==\'digger\', in:tabmode==\'digger\', fade:tabmode!=\'digger\'}" class="tab-pane" id="digger" style="margin-top:20px;">\n\n\n\n        <form novalidate>\n          <digger-form readonly="{{ settings.readonly }}" fieldclass="{{ settings.fieldclass }}" fields="digger_fields" container="edit_container" />\n        </form>\n\n        <hr ng-show="(settings.container_url || settings.container_branch)" />\n        \n        <div class="row" ng-show="(issaved && settings.container_url)">\n          <form class="form form-horizontal">\n          <div class="form-group">\n            <label for="warehouselink" class="col-sm-2 control-label ng-binding">REST URL:</label>\n            <div class="col-sm-6" style="overflow:none;">\n              <input type="text" readonly class="form-control" id="containerurl" ng-model="container_url" />\n            </div>\n            <div class="col-sm-3">\n              <!--<a ng-href="{{ container_url }}" target="_blank" class="btn btn-info">open</a>-->\n              <button ng-click="selectcontainerurl()" href="" class="btn btn-info">select</a>\n            </div>\n          </div>\n          </form>\n        </div>\n\n        <div class="row" ng-show="(issaved && settings.container_branch)">\n          <form class="form form-horizontal">\n          <div class="form-group">\n            <label for="warehouselink" class="col-sm-2 control-label ng-binding">Branch URL:</label>\n            <div class="col-sm-6" style="overflow:none;">\n              <input id="branchurl" type="text" readonly class="form-control" ng-model="container_branch" />\n            </div>\n            <div class="col-sm-3">\n              <button ng-click="selectbranchurl()" href="" class="btn btn-info">select</a>\n            </div>\n          </div>\n          </form>\n        </div>\n\n      </div>\n\n      <!--\n        JSON\n       -->\n      <div ng-show="settings.showjson" ng-class="{active:tabmode==\'json\', in:tabmode==\'json\', fade:tabmode!=\'json\'}" class="tab-pane" id="json" style="margin-top:20px;">\n\n        <digger-json container="container" />\n\n      </div>\n\n\n\n      <!--\n        tabs\n       -->\n      <div ng-repeat="tab in blueprint.tabs" ng-show="tabmode==tab.name" ng-class="{active:tabmode==tab.name, in:tabmode==tab.name, fade:tabmode!=tab.name}" class="tab-pane" id="{{ tab.name }}" style="margin-top:20px;">\n\n        <div ng-if="!tab.type">\n          <form novalidate>\n            <digger-form readonly="{{ settings.readonly }}" fields="tab.fields" container="edit_container" />\n          </form>\n        </div>\n        <div ng-if="tab.type">\n          <digger-field readonly="settings.readonly" field="tab" container="edit_container" />\n        </div>\n        \n\n      </div>\n\n    </div>\n\n  </div>\n</div>';
});
require.register("binocarlos-digger-viewer-for-angular/jsonviewer.js", function(exports, require, module){
module.exports = '<div id="htmlholder" style="width:100%;" ng-bind-html="jsonhtml">\n</div>';
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
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function($rootScope, xmlDecoder){
    
    /*
    
      auto template injection
      
      this is for when the templates are embedded into the page manually
    */
    var templates = {};

    var scripts = angular.element(document).find('script');

    for(var i=0; i<scripts.length; i++){
      var script = angular.element(scripts[i]);
      var html = script.html();
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
      else if(script.attr('type')==='digger/blueprint'){
        var blueprint_container = xmlDecoder(html);
        if(blueprint_container){
          $digger.blueprint.add(blueprint_container);
        }
      }
    }

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

if(!window.$digger){
  throw new Error('$digger must be loaded on the same page to use the digger angular module');
}
else{
  //window.$digger.on('connect', function(){
  // choose what application to boot - either a user defined one or the default digger one

  /*
  
    rely on the socket buffer to hold requests before $digger is connected

    this means we can boot into angular right away on not have markup hanging around on the page
    for a split second
    
  */
  var app = window.$digger.config.application || 'digger';
  document.documentElement.setAttribute('ng-controller', 'DiggerRootCtrl');
  angular.element(document).ready(function() {
    angular.bootstrap(document, [app]);
  });
}
});
require.register("binocarlos-digger-folders/index.js", function(exports, require, module){
var template = require('./template');

function growl(message){
  $.bootstrapGrowl(message, {
    ele: 'body',
    type: 'info',
    offset: {from: 'top', amount: 20},
    align: 'right',
    width: 250,
    delay: 4000,
    allow_dismiss: true,
    stackup_spacing: 10
  });
}

angular
	.module('digger.folders', [
		'digger.tree',
    'digger.viewer',
    'digger.utils'
	])

  .directive('diggerFolders', function($http, $location, $safeApply){
    return {
      restrict:'EA',
      scope:{
        // the root container with the things at the top
        root:'=',
        // what selector to use for loading children
        selector:'=',
        // the array of blueprints that apply
        blueprints:'=',
        // the title at the top of the tree
        treetitle:'@',
        // the filter for what appears in the tree
        treefilter:'@',
        // the function used for a container icon - defaults to ask blueprint
        iconfn:'=',
        // the settings for the viewer
        settings:'='
      },
      template: template,
      replace: true,
      controller:function($scope){

        /*
        
          a container has been choosen from the tree

          tell the viewer to open it
          
        */
        $scope.$on('tree:selected', function(ev, container){
          
          /*
          $scope.add_parent_container = null;
          $scope.viewer_container = $scope.tree_root.find('=' + container.diggerid());
          $scope.viewer_blueprint = $digger.blueprint.get(container.tag());

          if(container.match($scope.filter)){
            $scope.$broadcast('viewer:mode', 'children');
          }
          */

        })

        /*
        
          open a container
          
        */
        $scope.$on('viewer:selected', function(ev, container){

          /*
          $scope.add_parent_container = null;
          $scope.viewer_container = container;
          $scope.viewer_blueprint = $digger.blueprint.get(container.tag());

          if(container.match($scope.filter)){
            $scope.$broadcast('viewer:mode', 'children');
          }

          $scope.$broadcast('tree:setselected', container.get(0));
          */
        })

        /*
        
          restore from cancelling an add
          
        */
        $scope.$on('viewer:canceladd', function(ev){
          /*
          $scope.viewer_container = $scope.add_parent_container;
          $scope.viewer_blueprint = $scope.add_parent_blueprint;
          $scope.$broadcast('viewer:mode', 'children');
          */
        })

        /*
        
          added from viewer
          
        */
        $scope.$on('viewer:add', function(ev, blueprint){

          /*
          $scope.add_parent_container = $scope.viewer_container;
          $scope.add_parent_blueprint = $scope.viewer_blueprint;

          blueprint.fields = blueprint.find('field').models
          $scope.viewer_container = $digger.create(blueprint.attr('name'));
          $scope.viewer_container.data('new', true);
          $scope.viewer_blueprint = blueprint;
          */

        })

        /*
        
          removal from viewer - they have clicked OK
          
        */
        $scope.$on('viewer:remove', function(ev){

          /*
          $scope.viewer_container.remove().ship(function(){
            growl($scope.viewer_container.title() + ' removed');
            var parent = $scope.tree_root.find('=' + $scope.viewer_container.diggerparentid());

            if(!parent || parent.count()<=0){
              parent = $scope.tree_root;
            }


            $safeApply($scope, function(){
              $scope.something_removed = true;
              check_folders_step();
              $scope.viewer_container = parent;
              $scope.viewer_blueprint = $digger.blueprint.get(parent.tag());
              $scope.$broadcast('viewer:mode', 'children');
              $scope.add_parent_container = null;
              $scope.$broadcast('tree:setselected', parent.get(0));
            })
            
          })
          */
        })


        $scope.$watch('viewer_container', function(container){
          /*
          if(!container){
            return;
          }

          if(container.diggerid()==$scope.tree_root.diggerid()){
            
            $scope.viewersettings.container_url = $scope.warehouse_url;
          }
          else{
            $scope.viewersettings.container_url = $scope.warehouse_url + '/' + container.diggerid();
          }
          */
        })

        /*
        
          when the core models change update the HTML view
          
        */
        $scope.$watch('tree_root.models', function(models){

          /*
          if(!models){
            return;
          }

          $scope.htmlmodel = models[0];
          */

        }, true)

        $scope.$on('viewer:save', function(ev){

          // this means new container
          
          /*
          $scope.viewer_container.data('tree_filter', $scope.viewer_container.match('folder'));
          if($scope.add_parent_container){
            $scope.add_parent_container.append($scope.viewer_container).ship(function(){
              $safeApply($scope, function(){
                $scope.something_added = true;
                check_folders_step();
                $scope.viewer_container.data('new', false);
                $scope.add_parent_container.data('expanded', true);
                growl($scope.viewer_container.title() + ' added');
                $scope.viewer_container = $scope.add_parent_container;
                $scope.viewer_blueprint = $scope.add_parent_blueprint;
                $scope.$broadcast('viewer:mode', 'children');
                $scope.add_parent_container = null;
              })
            })
          }
          else{
            $scope.viewer_container.save().ship(function(){
              growl($scope.viewer_container.title() + ' saved');
              $safeApply($scope, function(){
                $scope.something_saved = true;
                check_folders_step();
                if($scope.viewer_container.tag()=='folder'){
                  $scope.$broadcast('viewer:mode', 'children');
                }
              })
              
            })
          }
          */
        })
      },
      link: function($scope, iElm, iAttrs, controller) {
        
      }
    };
  })
});
require.register("binocarlos-digger-folders/template.js", function(exports, require, module){
module.exports = '<div class="row" digger-radio for="root">\n    <!--\n        the - it might work better without a tree test\n     -->\n     \n    <div class="col-sm-4" style="border-right:1px solid #ccc;">\n        <digger-tree title="{{ title }}" filter="folder" iconfn="iconfn" container="root" depth="10"></digger-tree>\n    </div>\n    \n    <div class="col-sm-8">\n        <digger-viewer iconfn="iconfn" container="open_container" blueprint="open_blueprint" settings="settings" />\n    </div>\n</div>';
});
require.register("binocarlos-digger-for-angular/index.js", function(exports, require, module){
require('digger-bootstrap-for-angular');
require('digger-utils-for-angular');
require('digger-supplychain-for-angular');
require('digger-form-for-angular');
require('digger-tree-for-angular');
require('digger-radio-for-angular');
require('digger-filters-for-angular');
require('digger-repeat-for-angular');
require('digger-viewer-for-angular');
require('digger-folders');


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
    'digger.folders',
    'digger.supplychain',
    'digger.form',
    'digger.tree',
    'digger.viewer',
    'digger.radio',
    'digger.filters',
    'digger.repeat'
  ])
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
});
require.register("diggerserve-angular/index.js", function(exports, require, module){
require('digger-for-angular');
});










require.alias("binocarlos-digger-for-angular/index.js", "diggerserve-angular/deps/digger-for-angular/index.js");
require.alias("binocarlos-digger-for-angular/index.js", "diggerserve-angular/deps/digger-for-angular/index.js");
require.alias("binocarlos-digger-for-angular/index.js", "digger-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-supplychain-for-angular/index.js", "binocarlos-digger-supplychain-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-radio-for-angular/index.js", "binocarlos-digger-radio-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-filters-for-angular/index.js", "binocarlos-digger-filters-for-angular/index.js");
require.alias("binocarlos-digger-form-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/index.js");
require.alias("binocarlos-digger-form-for-angular/form.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/form.js");
require.alias("binocarlos-digger-form-for-angular/field.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/field.js");
require.alias("binocarlos-digger-form-for-angular/list.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/list.js");
require.alias("binocarlos-digger-form-for-angular/fieldrender.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/fieldrender.js");
require.alias("binocarlos-digger-form-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-form-for-angular/index.js");
require.alias("binocarlos-digger-form-for-angular/index.js", "binocarlos-digger-form-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-repeat-for-angular/index.js", "binocarlos-digger-repeat-for-angular/index.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-tree-for-angular/template.js", "binocarlos-digger-for-angular/deps/digger-tree-for-angular/template.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-tree-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-tree-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/dist/abn_tree_directive.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_template.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/dist/abn_tree_template.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/index.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-bootstrap-tree-for-angular/index.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-viewer-for-angular/template.js", "binocarlos-digger-for-angular/deps/digger-viewer-for-angular/template.js");
require.alias("binocarlos-digger-viewer-for-angular/jsonviewer.js", "binocarlos-digger-for-angular/deps/digger-viewer-for-angular/jsonviewer.js");
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-viewer-for-angular/index.js");
require.alias("mafintosh-json-markup/index.js", "binocarlos-digger-viewer-for-angular/deps/json-markup/index.js");

require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-bootstrap-for-angular/index.js", "binocarlos-digger-bootstrap-for-angular/index.js");
require.alias("binocarlos-digger-folders/index.js", "binocarlos-digger-for-angular/deps/digger-folders/index.js");
require.alias("binocarlos-digger-folders/template.js", "binocarlos-digger-for-angular/deps/digger-folders/template.js");
require.alias("binocarlos-digger-folders/index.js", "binocarlos-digger-for-angular/deps/digger-folders/index.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-folders/deps/digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-tree-for-angular/template.js", "binocarlos-digger-folders/deps/digger-tree-for-angular/template.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-folders/deps/digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-tree-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-tree-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/dist/abn_tree_directive.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_template.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/dist/abn_tree_template.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-digger-tree-for-angular/deps/bootstrap-tree-for-angular/index.js");
require.alias("binocarlos-bootstrap-tree-for-angular/dist/abn_tree_directive.js", "binocarlos-bootstrap-tree-for-angular/index.js");
require.alias("binocarlos-digger-tree-for-angular/index.js", "binocarlos-digger-tree-for-angular/index.js");
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-folders/deps/digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-viewer-for-angular/template.js", "binocarlos-digger-folders/deps/digger-viewer-for-angular/template.js");
require.alias("binocarlos-digger-viewer-for-angular/jsonviewer.js", "binocarlos-digger-folders/deps/digger-viewer-for-angular/jsonviewer.js");
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-folders/deps/digger-viewer-for-angular/index.js");
require.alias("mafintosh-json-markup/index.js", "binocarlos-digger-viewer-for-angular/deps/json-markup/index.js");

require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-folders/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-folders/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-folders/index.js", "binocarlos-digger-folders/index.js");
require.alias("binocarlos-digger-for-angular/index.js", "binocarlos-digger-for-angular/index.js");
require.alias("diggerserve-angular/index.js", "diggerserve-angular/index.js");