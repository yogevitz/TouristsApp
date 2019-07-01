let app = angular.module('myApp', ["ngRoute"]);


app.service('sharedProperties', function () {
    this.share = function () {
        let currentPointID = 3;
        return {
            getCurrentPointID: function() {
                return currentPointID;
            },
            setCurrentPointID: function(id) {
                currentPointID = id;
            }
        };
    };
});

// config routes
app.config(function($routeProvider) {
    $routeProvider
    // homepage
        .when('/', {
            // this is a template
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        // poi
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl'
        })
        .when('/httpRequest', {
            templateUrl: 'pages/http/request.html',
            controller : 'httpController as httpCtrl'
        })
        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl'
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/home', {
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .when('/restorePassword', {
            templateUrl: 'pages/restorePassword/restorePassword.html',
            controller : 'restorePasswordController as restorePasswordCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});
