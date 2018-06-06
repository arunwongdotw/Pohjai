appControllers.controller('reportCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
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

  if (typeof window.localStorage.secondColor == 'undefined') {
    $scope.color = "#F44336";
  } else if ((window.localStorage.secondColor != "") || (window.localStorage.secondColor != null)) {
    $scope.color = window.localStorage.secondColor;
  } else {
    $scope.color = "#F44336";
  }

  function getAppLanguage() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAppLanguage.php?appLanguageID=' + $scope.appLanguageID)
      .then(function(response) {
        $scope.appLanguage = response.data.results[0];
      }, function(error) {
        console.log(error);
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.memberID = response.data.results[0].member_id;
      getQuestionSet();
      getQuestion();
    }, function(error) {
      console.log(error);
    });

  function getQuestionSet() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionSet.php?memberID=' + $scope.memberID)
      .then(function(response) {
        $scope.questionSetArrayList = response.data.results;
      }, function(error) {
        console.log(error);
      });
  }

  function getQuestion() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestion.php?memberID=' + $scope.memberID)
      .then(function(response) {
        $scope.questionArrayList = response.data.results;
      }, function(error) {
        console.log(error);
      });
  }

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
  };

  $scope.btnReportSelection = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $scope.navigateTo('menu2.reportselection');
  }
});
