angular.module('app.service', [])

// var API_URL = 'http://noah.dost.gov.ph/api/websafe/';

// .factory('getJSON', function($http){
//   return{
//     getHash: function(hash){
//       return $http.get(API_URL + hash)
//       .then(function(response){
//         return response;
//       }), function(err) {
//           console.error('ERR', JSON.stringify(err));
//           return ;
//       })
//     }
//   } 
// })

.factory('getJSONService', function($http){
  console.log("****** getJSONService Initialize ******");
  var allData = [];
  var uniqueLocations = [];
  var locations = [];
  return {
    getAllData: function(){
      return $http.get('lib/websafe.json').then(function(response) {
          allData = response.data;
          console.log("ALL DATA", allData);
  	  	return allData;
      }, function(err) {
          console.error('ERR', JSON.stringify(err));
          return ;
      })
    }
  }
});