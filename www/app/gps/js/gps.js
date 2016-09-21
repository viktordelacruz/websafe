angular.module('app.gpscontrollers', [])

.controller('GPSCtrl', function($scope, $state) {

  // MAP CODE START

	var map = L.map('mapid'); 
  map.setView(new L.LatLng(14.5818, 120.9771), 12);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'mapbox.streets'
  }).addTo(map);  

  function onLocationFound(e) {
    
  }
  map.on('locationfound', onLocationFound);

  function onLocationError(e) {
      alert(e.message);
  }
  map.on('locationerror', onLocationError);
  // MAP CODE END

  /*//CODE FOR START TRACKING
  $scope.onStart = function() {
    map.locate({setView: true, maxZoom: 18, watch: true, enableHighAccuracy: true}); 
    setTimeout(function(){ 
      L.marker(currentCoordinates).addTo(map).bindPopup("You started here", {closeButton: false}).openPopup();
    }, 3000);    
    firstRun = false;
    started = true;
  }

  //CODE FOR STOP TRACKING
  $scope.onStop = function() {
    map.stopLocate();
    L.marker(currentCoordinates).addTo(map).bindPopup("You stopped here", {closeButton: false}).openPopup();
    firstRun = true;
    started = false;
    coordinates.length = 0;
  }*/


});
