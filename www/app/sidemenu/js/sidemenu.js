angular.module('app.sidemenucontrollers', [])

.controller('SideMenuCtrl', function($scope, $state, getJSONService, $ionicPopup) {
	$scope.locations = {}
  var locations = [];
  var uniqueLocs = [];
  var copyOfAllData = [];
  $scope.foundItem = [];

	$scope.loadData = function(){  
    console.log("***** Function to load locations *****")
    getJSONService.getAllData().then(function(allData){
      copyOfAllData = allData;
      for (var key in allData) { //for each object in allData
         if (allData.hasOwnProperty(key)) { //check if it has a key
            var obj = allData[key]; //if so, get what it has
            locations.push(obj.data.location); //get all locations
         }
      }
      $.each(locations, function(i, el){
        if($.inArray(el, uniqueLocs) === -1) uniqueLocs.push(el); //get unique locations
      });
      uniqueLocs.sort(function(a, b){ //sort alphabetically
          if(a < b) return -1;
          if(a > b) return 1;
          return 0;
      });
      console.log("unique locations array", uniqueLocs)
      $scope.locations = uniqueLocs;
    });
  }

  $scope.calculate = function(){
    console.log("CALCULATE CLICKED!")
    this.foundItem.length = 0;
    var locName = $scope.locations.selected;
    var hazard = $scope.locations.hazard;
    var exposure = $scope.locations.exposure;
    for (var key in copyOfAllData) { //for each object in allData
         if (copyOfAllData.hasOwnProperty(key)) { //check if it has a key
            var obj = copyOfAllData[key]; //if so, get what it has
            if(obj.data.location == locName){
              console.log("location selected:", obj.data.location);
              if(obj.geoserver_layer.indexOf(hazard) > -1){
                console.log("geoserver_layer selected:", obj.geoserver_layer);
                if(obj.exposure_layer.indexOf(exposure) > -1){
                  console.log("exposure_layer selected:", obj.exposure_layer);
                  this.foundItem.push(obj);
                }
              }
            }
         }
    }
    if(this.foundItem.length == 0){
      var alertPopup = $ionicPopup.alert({
        title: 'Data not available!',
        template: 'Try another selection'
      });
    }
    console.log("Found item!", this.foundItem);
    $scope.$broadcast("myData", this.foundItem);
    $scope.$broadcast("selectedExposure", exposure);
  }

})

//locations search plugin
.directive('ionSearchSelect', ['$ionicModal', '$ionicGesture', function ($ionicModal, $ionicGesture) {
    return {
        restrict: 'E',
        scope: {
            options: "=",
            optionSelected: "="
        },
        controller: function ($scope, $element, $attrs) {
            $scope.searchSelect = {
                title: $attrs.title || "Search Locations",
                keyProperty: $attrs.keyProperty,
                valueProperty: $attrs.valueProperty,
                templateUrl: $attrs.templateUrl || 'templates/searchSelect.html',
                animation: $attrs.animation || 'slide-in-up',
                option: null,
                searchvalue: "",
                enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
            };

            $ionicGesture.on('tap', function (e) {
              
                if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
                  if ($scope.optionSelected) {
                    $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
                  }
                }
                else{
                  $scope.searchSelect.option = $scope.optionSelected;
                }
                $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
            }, $element);

            $scope.saveOption = function () {
              if(!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty){
                for (var i = 0; i < $scope.options.length; i++) {
                    var currentOption = $scope.options[i];
                    if(currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option){
                      $scope.optionSelected = currentOption;
                      break;
                    }
                }
              }
              else{
                $scope.optionSelected = $scope.searchSelect.option;
              }
                $scope.searchSelect.searchvalue = "";
                $scope.modal.remove();
            };
          
            $scope.clearSearch = function () {
                $scope.searchSelect.searchvalue = "";
            };

            $scope.closeModal = function () {
                $scope.modal.remove();
            };

            $scope.$on('$destroy', function () {
                if ($scope.modal) {
                    $scope.modal.remove();
                }
            });
          
            $scope.OpenModalFromTemplate = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: $scope.searchSelect.animation
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };
        }
    };
} ]);
