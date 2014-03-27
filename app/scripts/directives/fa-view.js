'use strict';

angular.module('integrationApp')
  .directive('faView', ["famous", "$controller", function (famous, $controller) {
    return {
      template: '<div></div>',
      transclude: true,
      restrict: 'EA',
      priority: 100,
      compile: function(tElement, tAttrs, transclude){
        console.log('compiling app');
        return {
          pre: function(scope, element, attrs){
            var View = famous['famous/core/view'];
            //TODO:  add custom classes from attrs (or just pass through all attrs?) to
            //       the container element.

            function FaView(){
              View.apply(this, arguments);
            }

            FaView.prototype = Object.create(View.prototype);
            FaView.prototype.constructor = FaView;

            FaView.name = scope["faName"];

            scope.children = [];

            var getOrValue = function(x) {
              return x.get ? x.get() : x;
            };

            var getTransform = function(data) {
              var Transform = famous['famous/core/transform']
              var transforms = [];
              var mod = data.mod();
              if (mod.translate && mod.translate.length) {
                var values = mod.translate.map(getOrValue)
                transforms.push(Transform.translate.apply(this, values));
              }
              if (mod["faRotateZ"])
                transforms.push(Transform.rotateZ(mod["faRotateZ"]));
              if (mod["faSkew"])
                transforms.push(Transform.skew(0, 0, mod["faSkew"]));
              return Transform.multiply.apply(this, transforms);
            };

            FaView.prototype.render = function() {
              if(!scope.readyToRender)
                return [];
              return scope.children.map(function(data){
                return {
                  origin: data.mod().origin,
                  transform: getTransform(data),
                  target: data.view.render()
                }
              });
            };

            scope.view = new FaView({
              name: scope["faName"],
              size: scope["faSize"] || [undefined, undefined]
            });

            var Transform = famous['famous/core/transform']

            scope.$on('registerChild', function(evt, data){
              if(evt.targetScope.$id != scope.$id){
                console.log('view registered', data);
                scope.view._add(data.view);
                scope.children.push(data);
                evt.stopPropagation();
              }
            })

            scope._modifier = {};
            scope.modifier = function(){
              return scope._modifier;
            };

            scope.$on('registerModifier', function(evt, data){
              console.log('caught registerModifier', data);
              scope._modifier = data;
            });
          },
          post: function(scope, element, attrs){
            if(scope.faController)
              $controller(scope.faController, {'$scope': scope})

            // var modifiers = {
            //    faOrigin: scope["faOrigin"],
            //    translate: scope["faTranslate"]
            // };
            // scope.modifier = modifiers;
            
            transclude(scope, function(clone) {
              element.find('div').append(clone);
            });
            scope.$emit('registerChild', {view: scope.view, mod: scope.modifier});
            scope.readyToRender = true;
          }
        }
      },
      scope: {
        "faTranslate": '=',
        "faRotateZ": '=',
        "faSize": '=',
        "faController": '@',
        "faName": '='
      }
    };
  }]);
