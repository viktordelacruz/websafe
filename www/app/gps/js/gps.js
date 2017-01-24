angular.module('app.gpscontrollers', [])

.controller('GPSCtrl', function($scope, $state, $ionicModal, $ionicTabsDelegate, $ionicPopup) {  
  var mapLayer;

  $scope.tabs = {
    landing: 'summary', //default landing is population tab
    hasData: false    
  }

  $scope.params = {}
  $scope.schoolsAffected = [];
  $scope.governmentAffected = [];
  $scope.hospitalsAffected = [];
  $scope.residentialsAffected = [];
  $scope.churchesAffected = [];

  $scope.showData = {} //summary for population exposure
  var total_needsArr = []; //needed for total_needs because key has spaces

	var map = L.map('mapid'); 
  map.setView(new L.LatLng(14.5818, 120.9771), 12);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'mapbox.streets'
  }).addTo(map);

  $scope.currentLocation = function(){
    map.locate({setView : true});
  }

  $scope.updateChart1 = function() {
    console.log("Chart1: I got here");    
    $scope.chartConfig1.series = [{
      type: 'pie',
      name: 'Affected Areas',
      innerSize: '50%',
      data: [{
          name: 'High',
          y: $scope.showData.popHigh,
          color: '#ce5037',          
        }, {
          name: 'Medium',
          y: $scope.showData.popMedium,
          color: '#f49835'
        }, {
          name: 'Low',
          y: $scope.showData.popLow,
          color: '#fff659',          
        }]
    }];
    console.log("Chart1: Wahoo");
  }

  $scope.updateChart2 = function() {
    console.log("Chart2: I got here");    
    $scope.chartConfig2.series = [{
      type: 'pie',
      name: 'Affected Areas',
      innerSize: '50%',
      data: [{
          name: 'High',
          y: $scope.showData.bldHigh,
          color: '#ce5037',          
        }, {
          name: 'Medium',
          y: $scope.showData.bldMedium,
          color: '#f49835'
        }, {
          name: 'Low',
          y: $scope.showData.bldLow,
          color: '#fff659',          
        }]
    }];
    console.log("Chart2: Wahoo");
  }

  $scope.share = function(){
    console.log("clicked share!");
    navigator.screenshot.save(function(error,res){
      if(error){
        console.error(error);
      }else{
        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        var options = {
          message: '', // not supported on some apps (Facebook, Instagram)
          subject: '', // fi. for email
          files: ['file://'+res.filePath], // an array of filenames either locally or remotely
          url: '',
          chooserTitle: '' // Android only, you can override the default share sheet title
        }

        var onSuccess = function(result) {
          console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        }

        var onError = function(msg) {
          console.log("Sharing failed with message: " + msg);
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

        /*console.log('screenshot taken!!!',res.filePath);
        window.plugins.socialsharing.share(null, null, res.filePath, null);*/
      }
    });
  }

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

  $scope.$on("selectedHazard", function(event, data){
    var hString = "";    
    if(data.indexOf("25") > -1) hString = "25-Year Flood";
    else if(data.indexOf("5") > -1) hString = "5-Year Flood";
    else if(data.indexOf("100") > -1) hString = "100-Year Flood";
    $scope.params.hazard = hString;
    console.log($scope.params.hazard)
  });  

  $scope.$on("selectedExposure", function(event, data){
    $scope.tabs.hasData = true;    
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

    $scope.params.location = data[0].data.location;
    console.log($scope.params.location)

    //list of buildings affected
    $scope.schoolsAffected = data[0].data.summary.affected_schools;
    $scope.governmentAffected = data[0].data.summary.affected_government;
    $scope.hospitalsAffected = data[0].data.summary.affected_hospitals;
    $scope.residentialsAffected = data[0].data.summary.affected_residential;
    $scope.churchesAffected = data[0].data.summary.affected_churches;

    //summary for population exposure    
    $scope.showData.popHigh = data[0].data.summary.high;
    $scope.showData.popMedium = data[0].data.summary.medium;
    $scope.showData.popLow = data[0].data.summary.low;
    $scope.showData.popTotal = data[0].data.summary.total_impact;    

    //null data should be defined as 0
    $scope.updateChart1();

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

    //null data should be defined as 0    
    $scope.updateChart2();

    //building types
    $scope.showData.school = data[0].data.summary.buildings_list.School;
    $scope.showData.residential = data[0].data.summary.buildings_list.Residential;
    $scope.showData.government = data[0].data.summary.affected_government.length;
    $scope.showData.hospital = data[0].data.summary.buildings_list.Hospital;
    $scope.showData.church = data[0].data.summary.buildings_list.Church;
    $scope.showData.others = data[0].data.summary.buildings_list.Other;        
  });
  
  $ionicModal.fromTemplateUrl('app/partials/modal-gps.html', {
    scope: $scope
    // animation: 'slide-in-up'
  }).then(function(modal) {    
    $scope.modal= modal;    
  });

  $scope.openModal = function() {
    if($scope.tabs.hasData == false) {      
      var alertPopup = $ionicPopup.alert({
        title: 'Data not available!',
        template: 'Try another selection'
      });    
    }
    else $scope.modal.show();    
  };

  $scope.chartConfig1 = {
    options: {
      chart: {
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        backgroundColor: 'transparent'
      },
      title: {
        floating: true,
        text: 'Affected <br> Population',
        align: 'center',
        verticalAlign: 'middle',
        y: 20
      },
      tooltip: {
        formatter: function() {
             return '<b>' + this.point.name + ' Hazard Area <br></b> <b>' + this.y + '</b> (' + Highcharts.numberFormat(this.percentage, 2) + '%)';
        },
        style: {
          fontSize: '1.3em'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -30,                                        
            style: {
              fontWeight: 'bold',
              fontSize: '1.5em',
              color: 'white',
              textOutline: '2px #7c7c79',              
            },
            formatter: function() {
              return this.y;
            }
          },
          showInLegend: true
        }
      },
      legend: {        
        itemStyle: {
          fontSize: '1.2em'          
        },
        symbolRadius: 0,
        symbolHeight: 15,
        symbolWidth: 20,        
        verticalAlign: 'top'
      }
    },
    series: [{
        type: 'pie',
        name: 'Affected Areas',
        innerSize: '50%',
        data: [{
          name: 'High',
          y: 69,
          color: '#ce5037',          
        }, {
          name: 'Medium',
          y: 69,
          color: '#f49835'
        }, {
          name: 'Low',
          y: 69,
          color: '#fff659',          
        }]
    }],
  }

  $scope.chartConfig2 = {
    options: {
      chart: {
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        backgroundColor: 'transparent'
      },
      title: {
        floating: true,
        text: 'Affected <br> Areas',
        align: 'center',
        verticalAlign: 'middle',
        y: 20
      },
      tooltip: {
        formatter: function() {
             return '<b>' + this.point.name + ' Hazard Area <br></b> <b>' + this.y + '</b> (' + Highcharts.numberFormat(this.percentage, 2) + '%)';
        },
        style: {
          fontSize: '1.3em'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -30,                                        
            style: {
              fontWeight: 'bold',
              fontSize: '1.5em',
              color: 'white',
              textOutline: '2px #7c7c79',            
            },
            formatter: function() {
              return this.y;
            }
          },
          showInLegend: true
        }
      },
      legend: {        
        itemStyle: {
          fontSize: '1.2em'          
        },
        symbolRadius: 0,
        symbolHeight: 15,
        symbolWidth: 20,        
        verticalAlign: 'top'
      }
    },
    series: [{
        type: 'pie',
        name: 'Affected Areas',
        innerSize: '50%',
        data: [{
          name: 'High',
          y: 69,
          color: '#ce5037',          
        }, {
          name: 'Medium',
          y: 69,
          color: '#f49835'
        }, {
          name: 'Low',
          y: 69,
          color: '#fff659',          
        }]
    }],
  }

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

});
