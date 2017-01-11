(function () {
    "use strict";
    console.log("module.js");
    var myModule = angular.module('module', ['ngResource', 'ngRoute']);
    
    /*
    myModule.controller('todoCtrl', function ($scope, $http, $resource) {
        $http.get("http://localhost:3000/Ostoslista").success(function (response) {
            console.log("Got data!");
            $scope.todos = response;
        });
    });
    */

    /*
    myModule.controller('todoCtrl', todo);
                        
    function todo ($scope, $http, $resource) {        $http.get("http://localhost:3000/Ostoslista").success(function(response) {
            console.log("Got data!");
            $scope.todos = response;
        });
    }
    */
}());
