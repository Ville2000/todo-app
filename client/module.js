(function () {
    "use strict";
    var myApp = angular.module('myApp', ['ngResource', 'ngRoute']);
    var collection = null;
    var sort = 1;
    var sortCollections;
    
    myApp.config(function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl : "viewCollections.html"
        })
        .when("/addCollection", {
            templateUrl : "addCollection.html",
            controller : "addCollection"
        })
        .when("/viewDocuments", {
            templateUrl : "viewDocuments.html"
        })
        .when("/addDocument", {
            templateUrl : "addDocument.html"
        });
    });
    
    myApp.controller('getDocuments', function ($scope, $http, $resource) {
        $http.get("http://localhost:3000/" + collection).success(function (response) {
            $scope.documents = response;
        });
        
        $scope.changeStatus = function (documentId) {
            console.log("changeStatus");
            $http.put("http://localhost:3000/" + collection + "/" + documentId).success(function (response) {
                console.log("status");
            });
        }
        
        $scope.deleteDocument = function (documentId) {
            console.log("deleteDocument");            
            $http.delete("http://localhost:3000/" + collection + "/" + documentId).success(function (response) {
                console.log("deleted a document");
            });
        }
        
        $scope.sortByName = function () {
            console.log("sortByName");
            if (sort == 1) {
                $http.get("http://localhost:3000/" + collection + "/name/" + sort).success(function (response) {
                    console.log("sort1");
                    $scope.documents = response;
                });
                sort = -1;
            } else {
                $http.get("http://localhost:3000/" + collection + "/name/" + sort).success(function (response) {
                    console.log("sort-1");
                    $scope.documents = response;
                });
                sort = 1;
            } 
        }
        
        $scope.sortByPriority = function () {
            console.log("sortByName");
            if (sort == 1) {
                $http.get("http://localhost:3000/" + collection + "/priority/" + sort).success(function (response) {
                    console.log("sort1");
                    $scope.documents = response;
                });
                sort = -1;
            } else {
                $http.get("http://localhost:3000/" + collection + "/priority/" + sort).success(function (response) {
                    console.log("sort-1");
                    $scope.documents = response;
                });
                sort = 1;
            } 
        }
        
        $scope.sortByStatus = function () {
            console.log("sortByName");
            if (sort == 1) {
                $http.get("http://localhost:3000/" + collection + "/status/" + sort).success(function (response) {
                    console.log("sort1");
                    $scope.documents = response;
                });
                sort = -1;
            } else {
                $http.get("http://localhost:3000/" + collection + "/status/" + sort).success(function (response) {
                    console.log("sort-1");
                    $scope.documents = response;
                });
                sort = 1;
            } 
        }
    });
    
    myApp.controller('getCollections', function ($scope, $http, $resource) {
        $http.get("http://localhost:3000/").success(function (response) {
            $scope.collections = response;
        });
        
        $scope.toDocuments = function (collectionName) {
            collection = collectionName;
        };
        
        $scope.dropCollection = function (collectionName) {
            $http.delete("http://localhost:3000/" + collectionName).success(function (response) {
                console.log("dropped a collection");
                $scope.collections = response;
            });
        };
        
        $scope.sortByName = function () {
            $http.get("http://localhost:3000/").success(function (response) {
                console.log("sorting collections");
                if (sortCollections == 1) {
                    $scope.collections = response.sort();
                    sortCollections = -1;
                } else {
                    $scope.collections = response.reverse();
                    sortCollections = 1;
                }
            });
        };
    });
    
    myApp.controller('addCollection', function ($scope, $http, $resource) {
        $scope.addCollection = function () {
            $http.post("http://localhost:3000/" + $scope.newCollection.name).success(function (response) {
            });
        };
    });
    
    myApp.controller('addDocument', function ($scope, $http, $resource) {
        $scope.addDocument = function () {
            $http.post("http://localhost:3000/" + collection + "/" + $scope.newDoc.name + "/" + $scope.newDoc.priority).success(function (response) {
            });
        };
    });
}());

