'use strict';

angular.module('integrationApp')
  .controller('AnimationsCtrl', function ($scope, famous) {
    var Transitionable = famous['famous/transitions/Transitionable'];
    var GenericSync = famous['famous/inputs/GenericSync'];
    var EventHandler = famous['famous/core/EventHandler']

    var sizes = $scope.sizes = {
      margins: {
        top: 134,
        right: 10,
        bottom: 134,
        left: 10
      },
      width: window.innerWidth, //320
      height: window.innerHeight, //568
      triangle: 75
    };

    $scope.positions = {
      topTriangle: [sizes.margins.left + sizes.triangle, sizes.margins.top, 0],
      rightTriangle: [sizes.margins.left + 3 * sizes.triangle, sizes.margins.top + sizes.triangle, 0],
      bottomTriangle: [sizes.margins.left + sizes.triangle, sizes.margins.top + 3 * sizes.triangle, 0],
      leftTriangle: [sizes.margins.left, sizes.margins.top + sizes.triangle, 0]
    };


    var t = new Transitionable(0);
    // t.set(1, {
    //     duration: 2000,
    //     curve: "linear"
    // });


    $scope.sync = new GenericSync(function(){
      return t.get();
    }, {direction: GenericSync.DIRECTION_Y});

    $scope.sync.on('update', function(data){
      var newVal = Math.max(0, Math.min(1, data.p / 1000 + t.get()));
      t.set(newVal);
    });

    $scope.eventHandler = new EventHandler();
    $scope.eventHandler.pipe($scope.sync);
    
    $scope.functionThatReturnsATimelineValueBetween0And1 = function(){
      return t.get();
    }
  });
