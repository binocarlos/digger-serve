


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
require.register("binocarlos-digger-form-for-angular/index.js", function(exports, require, module){
var templates = {
  form:require('./form'),
  field:require('./field')
}

angular
  .module('digger.form', [
    
  ])

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
          var parts = (st.split(',') || []).map(function(s){
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

  .factory('$diggerFieldTypes', function(){
    return {
      list:[
        'text',
        'textarea',
        'number',
        'email',
        'radio',
        'checkbox',
        'select'
      ],
      properties:{
        text:{},
        number:{},
        email:{},
        textarea:{},
        checkbox:{},
        file:{},
        radio:{
          options:true
        },
        select:{
          options:true
        }
      }
    }
  })

  /*
  
    extracts the JS object that contains the target field - this becomes the model for the form field
    
  */
  .factory('$propertyModel', function(){
    return function(container, fieldname){
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

  .directive('diggerField', function($compile, $safeApply, $propertyModel){

    //field.required && showvalidate && containerForm[field.name].$invalid

    /*
    
      these are types that should be converted into the input type="..."
      
    */
    var fieldtypes = {
      text:true,
      number:true,
      email:true,
      textarea:true,
      diggerclass:true,
      template:true,
      checkbox:true,
      radio:true,
      select:true
    }

    var textrendertypes = {
      number:true,
      email:true
    }

    return {
      restrict:'EA',
      scope:{
        field:'=',
        container:'=',
        fieldclass:'=',
        globalreadonly:'=readonly'
      },
      replace:true,
      template:templates.field,
      controller:function($scope){

        $scope.parentreadonly = ($scope.globalreadonly || '').indexOf('y')==0;
        $scope.fieldname = '';
        $scope.rendertype = 'text';

        if(typeof($scope.field.required)=='string'){
          $scope.field.required = eval($scope.field.required);
        }

        $scope.setup = function(){
          $scope.setup_field_and_model();
          $scope.setup_render_type();
        }

        $scope.setup_field_and_model = function(){

          if(!$scope.container){
            return;
          }

          var parsedmodel = $propertyModel($scope.container, $scope.field.name);

          $scope.fieldname = parsedmodel.fieldname;
          $scope.model = parsedmodel.model;
          
        }

        $scope.setup_render_type = function(){

          if(!$scope.container){
            return;
          }
          
          var pattern = $scope.field.pattern || '';

          if(pattern.length<=0){
            $scope.pattern = /./;
          }
          else{
            $scope.pattern = new RegExp(pattern);
          }

          if($scope.field.options_csv){
            $scope.options = ($scope.field.options_csv.split(/,/) || []).map(function(option){
              return option.replace(/^\s+/, '').replace(/\s+$/, '');
            })
          }
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

          /*
          
            if they have registered a custom template then use that!
            
          */
          var template = $digger.template.get($scope.field.type);

          $scope.readonly = $scope.parentreadonly || ($scope.field.type==='readonly' || $scope.field.readonly || $scope.container.data('readonly'));
          
          if(template){
            $scope.fieldtype = 'template';
            $scope.rendertemplate = template;
          }
          else{
            $scope.fieldtype = fieldtypes[$scope.field.type] ? $scope.field.type : 'text';
          }

          $scope.field.usetitle = $scope.field.title ? $scope.field.title : ($scope.field.name.split('.').pop());
        }

 


      },
      link:function($scope, elem, $attrs){

        $scope.$watch('rendertemplate', function(html){

          if(!html){
            return;
          }

          elem.append($compile(html)($scope));
        })

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
module.exports = ' \n  \n<div ng-form="diggerForm" class="form-horizontal">\n  <div class="form-group" ng-class="{error: haserror, \'has-error\':container.errors[field.name]}" ng-repeat="field in fields">\n    <label for="{{ field.name }}" class="col-sm-3 control-label">{{ field.usetitle | ucfirst }}</label>\n    <div class="col-sm-7">\n      <digger-field readonly="readonly" field="field" container="container" fieldclass="fieldclass" />\n    </div>\n    <div class="col-sm-2" ng-show="showedit">\n      <a href="#" class="btn btn-mini" ng-click="$emit(\'deletefield\', field)">\n          <i class="icon-trash"></i>\n      </a>\n      <a href="#" class="btn btn-mini" ng-click="$emit(\'editfield\', field)">\n          <i class="icon-edit"></i>\n      </a>\n    </div>\n  </div>\n  <div ng-transclude></div>\n</div>';
});
require.register("binocarlos-digger-form-for-angular/field.js", function(exports, require, module){
module.exports = '<div ng-switch="fieldtype">\n	<div ng-switch-when="textarea">\n		<textarea style="min-height:200px;" name="{{ field.name }}" class="form-control" ng-readonly="readonly" ng-model="model[fieldname]"></textarea>\n	</div>\n	<div ng-switch-when="template">\n		\n	</div>\n	<div ng-switch-when="diggerclass">\n		<input name="{{ field.name }}" digger-class-field class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="classval" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" ng-pattern="pattern" />\n	</div>\n	<div ng-switch-when="radio">\n		<span ng-repeat="option in options">\n			<input type="radio"\n				ng-readonly="readonly" \n	       ng-model="model[fieldname]"\n	       value="{{option}}" /> <small>{{ option }}</small> &nbsp;\n	  </span>\n\n	</div>\n	<div ng-switch-when="select">\n\n		<select \n\n			ng-disabled="readonly"\n			ng-model="model[fieldname]" \n			ng-options="o for o in options"></select>\n\n	  \n	</div>\n	<div ng-switch-when="checkbox">\n\n		<input ng-readonly="readonly" type="checkbox" ng-model="model[fieldname]" />\n		\n	</div>\n	<div ng-switch-when="text">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" ng-pattern="pattern" />\n	</div>\n	<div ng-switch-when="email">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="email" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" />\n	</div>\n	<div ng-switch-when="number">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="number" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" />\n	</div>\n</div>';
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
        attrs.iconExpand = 'icon-plus';
      }
      if (attrs.iconCollapse == null) {
        attrs.iconCollapse = 'icon-minus';
      }
      if (attrs.iconLeaf == null) {
        attrs.iconLeaf = 'icon-chevron-right';
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
              });
            }
          } else {
            return branch._children = [];
          }
        });
        add_branch_to_list = function(level, branch, visible) {
          var child, child_visible, tree_icon, _i, _len, _ref, _results;
          if(!branch._data){
            branch._data = {};
          }
          if (branch._data.expanded == null) {
            branch._data.expanded = false;
          }
          if (!branch._children || branch._children.length === 0) {
            tree_icon = attrs.iconLeaf;
          } else {
            if (branch._data.expanded) {
              tree_icon = attrs.iconCollapse;
            } else {
              tree_icon = attrs.iconExpand;
            }
          }
          var digger = branch._digger || {};
          scope.tree_rows.push({
            level: level,
            branch: branch,
            _label: branch.name || branch.title || digger.tag || 'model',
            tree_icon: tree_icon,
            visible: visible
          });
          if (branch._children != null) {
            _ref = branch._children;
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
module.exports = '<ul class="nav nav-list abn-tree">\n  <li ng-repeat="row in tree_rows | filter:{visible:true} track by row.branch._id" ng-animate="\'abn-tree-animate\'" ng-class="\'level-\' + {{ row.level }} + (row.branch._id == selectedid ? \' active\':\'\')" class="abn-tree-row"><a ng-click="user_clicks_branch(row.branch)"><i ng-class="row.tree_icon" ng-click="togglebranch(row.branch)" class="indented tree-icon"> </i><span class="indented tree-label">{{ row._label }}</span></a></li>\n</ul>';
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
        title:'=',
        depth:'='
      },
      replace:true,
      transclude:true,
      template:template,
      controller:function($scope){

        $scope.depth = $scope.depth || 4;
        $scope.treedata = [];
        
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }

          var warehouse = container.diggerwarehouse();

          container.recurse(function(c){
            c.attr('label', c.title());
            if(!c.diggerwarehouse()){
              c.diggerwarehouse(warehouse);
            }
          })

          if(!($scope.title || '').match(/\w/)){
            $scope.title = container.title();
          }

          $scope.treedata = container.models;
        })

        $scope.container_select = function(model){
          $scope.$emit('tree:selected', $scope.container.spawn(model));
        }
      }
    }
  })
});
require.register("binocarlos-digger-tree-for-angular/template.js", function(exports, require, module){
module.exports = '<div>\n<div ng-transclude></div>\n <abn-tree tree-data="treedata" icon-leaf="icon-file" on-select="container_select(branch)" expand-level="depth"></abn-tree>\n</div>';
});
require.register("binocarlos-digger-viewer-for-angular/index.js", function(exports, require, module){
/*

  we are in private scope (component.io)
  
*/
var template = require('./template');

angular
  .module('digger.viewer', [
    
  ])


  .directive('diggerViewer', function($safeApply){

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
      controller:function($scope){

      	$scope.tabmode = 'children';
        $scope.diggeractive = false;

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

        $scope.toggledigger = function(){
          $scope.diggeractive = !$scope.diggeractive;
        }

        $scope.geticon = function(container){
          return $scope.iconfn ? $scope.iconfn(container) : 'icon-file';
        }

        $scope.setmode = function(mode){
          $scope.tabmode = mode;
          $scope.deletemode = false;
        }

        $scope.$on('viewer:mode', function(ev, mode){
          $scope.setmode(mode);
        })
        
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }

          $scope.children = container.children().containers();

          $scope.deletemode = false;

          var addchildren = $digger.blueprint.get_children($scope.blueprint);
          $scope.addchildren = addchildren ? addchildren.containers() : [];
          $scope.showchildren = $digger.blueprint.has_children($scope.blueprint);
          if(container.data('new')){
            $scope.showchildren = false;
          }
          $scope.showdetails = $digger.blueprint ? true : false;
          $scope.edit_container = container;

          if(!$scope.showchildren){
            $scope.tabmode = 'details';
          }

          $scope.digger_fields = [{
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
            name:'_digger.diggerid',
            title:'=diggerid'
          },{
            name:'_digger.diggerwarehouse',
            title:'/warehouse'
          }]
        })

        $scope.add_from_blueprint = function(blueprint){
          $scope.$emit('viewer:add', blueprint);
          $scope.addmode = true;
        }

        $scope.deletemode = false;

        $scope.click_container = function(container){
          $scope.$emit('viewer:selected', container);
        }

        $scope.cancelcontainer = function(){
          $scope.$emit('viewer:canceladd');
          $scope.addmode = false;
        }

        $scope.canceldelete = function(){
          $scope.deletemode = false;
        }

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
        }
      }
    }
  })
});
require.register("binocarlos-digger-viewer-for-angular/template.js", function(exports, require, module){
module.exports = '<div>\n  <div class="row" ng-show="deletemode">\n    Are you sure?<br /><br />\n\n    <button class="btn btn-info" ng-click="canceldelete()">No Cancel</button>\n    <button class="btn btn-danger" ng-click="deletecontainer(true)">Yes! Delete</button>\n  </div>\n\n  <div ng-hide="deletemode">\n    <ul class="nav nav-tabs" id="viewerTab">\n      <li ng-show="showchildren" ng-class="{active:tabmode==\'children\'}"><a style="cursor:pointer;" ng-click="setmode(\'children\')">Children</a></li>\n      <li ng-show="showdetails" ng-class="{active:tabmode==\'details\'}"><a style="cursor:pointer;" ng-click="setmode(\'details\')">Details</a></li>\n      \n    </ul>\n    <div id="myTabContent" class="tab-content">\n      <div ng-show="showdetails" ng-class="{active:tabmode==\'details\', in:tabmode==\'details\', fade:tabmode!=\'details\'}" class="tab-pane" id="details" style="margin-top:20px;">\n         <form class="form form-horizontal" name="containerForm" onSubmit="return false;" ng-hide="deletemode">\n\n            <fieldset>\n              \n                <form novalidate>\n                  <digger-form fields="blueprint.fields" container="edit_container" />\n                </form>\n\n                <div class="pull-right">\n                  <a href="" ng-click="toggledigger()">\n                  <span ng-show="diggeractive">-</span>\n                  <span ng-hide="diggeractive">+</span>\n                   digger\n                  </a>\n                </div>\n\n                <div ng-show="diggeractive">\n                  <hr />\n                  <form novalidate>\n                    <digger-form fields="digger_fields" container="edit_container" />\n                  </form>\n\n                  \n                </div>\n\n                <div class="form-group text-center" style="margin-top:10px;">\n                    <button ng-show="addmode" class="btn btn-warning" ng-click="cancelcontainer()">Cancel</button>\n                    <button ng-hide="hidedelete()" class="btn btn-info" ng-click="deletecontainer()">Delete</button>\n                    <button class="btn btn-success" ng-click="savecontainer()">Save</button>\n                    \n                </div>\n              \n            </fieldset>\n\n          </form>\n\n\n        \n\n      </div>\n      <div ng-show="showchildren" ng-class="{active:tabmode==\'children\', in:tabmode==\'children\', fade:tabmode!=\'children\'}" class="tab-pane" id="children" style="margin-top:20px;">\n\n        <div>\n\n        	<div class="digger-viewer-container" ng-repeat="$digger in children" ng-click="click_container($digger)">\n\n            <div style="margin-bottom:5px;">\n              <i class="icon" ng-class="geticon($digger)"></i>\n            </div>\n            <div>\n        		  {{ $digger.title() }}\n            </div>\n\n          </div>\n\n        </div>\n        <hr style="clear: left;" />\n        <div>\n          <button style="margin:10px;" class="btn btn-sm btn-info" ng-click="add_from_blueprint(blueprint)" ng-repeat="blueprint in addchildren">new {{ blueprint.title() }}</button>\n        </div>\n\n      </div>\n    </div>\n  </div>';
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
require.register("binocarlos-digger-for-angular/index.js", function(exports, require, module){
require('digger-utils-for-angular');
require('digger-supplychain-for-angular');
require('digger-form-for-angular');
require('digger-tree-for-angular');
require('digger-radio-for-angular');
require('digger-filters-for-angular');
require('digger-repeat-for-angular');
require('digger-viewer-for-angular');


/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    'digger.utils',
    'digger.supplychain',
    'digger.form',
    'digger.tree',
    'digger.viewer',
    'digger.radio',
    'digger.filters',
    'digger.repeat'
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
   
  }])

  /*
  
    return a promise that resolves when the window $digger object is ready
    
  */
  .factory('$digger', function($q){
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
    $scope.warehouse = $digger.connect('/');
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
  $('html').attr('ng-controller', 'DiggerRootCtrl');

  angular.bootstrap(document, [app]);  
}, 100)
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
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-viewer-for-angular/index.js", "binocarlos-digger-viewer-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-for-angular/deps/digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-utils-for-angular/index.js", "binocarlos-digger-utils-for-angular/index.js");
require.alias("binocarlos-digger-for-angular/index.js", "binocarlos-digger-for-angular/index.js");
require.alias("diggerserve-angular/index.js", "diggerserve-angular/index.js");
require('diggerserve-angular');

})()
