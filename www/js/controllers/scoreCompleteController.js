appControllers.controller('scoreCompleteCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};

  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.appLanguageID = "1";
    getAppLanguage();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
  } else {
    $scope.appLanguageID = "1";
    getAppLanguage();
  }

  function getAppLanguage() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAppLanguage.php?appLanguageID=' + $scope.appLanguageID)
      .then(function(response) {
        $scope.appLanguage = response.data.results[0];
      }, function(error) {
        console.log(error);
      });
  }

  // navigateTo is for navigate to other page
  // by using targetPage to be the destination state.
  // Parameter :
  // stateNames = target state to go.
  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAnimated ? 300 : 0));
  }; // End of navigateTo.

  $scope.btnBack = function() {
    $scope.navigateTo('menu2.score');
  };

  $scope.$on('$ionicView.enter', function() {
    $timeout(function() {
      $scope.navigateTo('menu2.score');
    }, 5000);
  });
}); // End of dashboard controller.