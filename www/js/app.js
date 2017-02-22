// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


angular.module('starter', 
  ['ionic', 
  'app.gpscontrollers',
  'app.sidemenucontrollers', 
  'app.service',
  'ion-floating-menu',
  'highcharts-ng'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    ionic.Platform.fullScreen();
    if(window.StatusBar) {
      StatusBar.styleDefault();
      return StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

  .state('sidemenu', {
    url: '/sidemenu',
    abstract: true,
    templateUrl: 'app/sidemenu/sidemenu.html',
    controller: 'SideMenuCtrl'
  })

  .state('sidemenu.gps', {
    url: '/gps',
    views: {
        'menuContent' :{
            templateUrl: 'app/gps/gps.html',
            controller: 'GPSCtrl'
        }
      }
  })  

  $ionicConfigProvider.tabs.position('bottom');
  $urlRouterProvider.otherwise('/sidemenu/gps');
})
