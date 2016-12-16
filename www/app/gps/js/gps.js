angular.module('app.gpscontrollers', [])

.controller('GPSCtrl', function($scope, $state, $ionicModal, $ionicTabsDelegate) {

  var mapLayer;

  $scope.tabs = {
    landing: 'summary' //default landing is population tab
  }

  $scope.showData = {} //summary for population exposure
  var total_needsArr = []; //needed for total_needs because key has spaces

	var map = L.map('mapid'); 
  map.setView(new L.LatLng(14.5818, 120.9771), 12);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'mapbox.streets'
  }).addTo(map);  

  $scope.$on("criticalSchools", function(event, data){
    layer = L.tileLayer.wms("http://geoserver.noah.dost.gov.ph/geoserver/wms", {
      layers: 'Critical_Facility:CriticalFacility_School',
      format: 'image/png',
      transparent: true,
      version: '1.3'
    }).setOpacity(0.75).addTo(map);
  });

  $scope.$on("criticalHealthFacilities", function(event, data){
    layer = L.tileLayer.wms("http://geoserver.noah.dost.gov.ph/geoserver/wms", {
      layers: 'Critical_Facility:CriticalFacilitity_HealthFacility',
      format: 'image/png',
      transparent: true,
      version: '1.3'
    }).setOpacity(0.75).addTo(map);
  });

  $scope.$on("criticalPoliceStations", function(event, data){
    layer = L.tileLayer.wms("http://geoserver.noah.dost.gov.ph/geoserver/wms", {
      layers: 'Critical_Facility:CriticalFacilitity_PoliceStation',
      format: 'image/png',
      transparent: true,
      version: '1.3'
    }).setOpacity(0.75).addTo(map);
  });

  $scope.$on("criticalFireStations", function(event, data){
    layer = L.tileLayer.wms("http://geoserver.noah.dost.gov.ph/geoserver/wms", {
      layers: 'Critical_Facility:CriticalFacilitity_FireStation',
      format: 'image/png',
      transparent: true,
      version: '1.3'
    }).setOpacity(0.75).addTo(map);
  });

  $scope.$on("selectedExposure", function(event, data){
    if(data == 'popn') $ionicTabsDelegate.select(0);
    else $ionicTabsDelegate.select(1);
  });

  $scope.$on("myData", function(event, data){
    console.log("Received emitted data!", data);
    var lat = data[0].data.center[1];
    var lng = data[0].data.center[0];
    map.setView(new L.LatLng(lat, lng), 12);
    if(mapLayer != null) map.removeLayer(mapLayer); //clear previous mapLayers
    mapLayer = L.tileLayer.wms("http://geoserver.noah.dost.gov.ph/geoserver/wms", {
      layers: [data[0].geoserver_layer, data[0].exposure_layer.replace('-', ':')],
      format: 'image/png',
      transparent: true,
      version: '1.3'
    }).setOpacity(0.75).addTo(map);
    //summary for population exposure
    $scope.showData.popHigh = data[0].data.summary.high;
    $scope.showData.popMedium = data[0].data.summary.medium;
    $scope.showData.popLow = data[0].data.summary.low;
    $scope.showData.popTotal = data[0].data.summary.total_impact;
    //needs (for loop necessary because key has spaces)
    for(var key in data[0].data.summary.total_needs){
      var obj = data[0].data.summary.total_needs[key];
      total_needsArr.push(obj);
    }
    $scope.showData.rice = total_needsArr[1];
    $scope.showData.cleanWater = total_needsArr[2];
    $scope.showData.drinkingWater = total_needsArr[4];
    $scope.showData.kits = total_needsArr[3];
    $scope.showData.toilets = total_needsArr[0];

    //summary for building exposure
    $scope.showData.bldHigh = data[0].data.summary.high;
    $scope.showData.bldMedium = data[0].data.summary.medium;
    $scope.showData.bldLow = data[0].data.summary.low;
    $scope.showData.bldTotal = data[0].data.summary.total_impact;
    //building types
    $scope.showData.school = data[0].data.summary.buildings_list.School;
    $scope.showData.residential = data[0].data.summary.buildings_list.Residential;
    $scope.showData.government = data[0].data.summary.affected_government;
    $scope.showData.hospital = data[0].data.summary.buildings_list.Hospital;
    $scope.showData.church = data[0].data.summary.buildings_list.Church;
    $scope.showData.others = data[0].data.summary.buildings_list.Other;

  });
  
  $ionicModal.fromTemplateUrl('app/modal/gps-modal.html', {
    scope: $scope
    // animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal= modal;
  });

  // $ionicModal.fromTemplateUrl('templates/modal.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

});
