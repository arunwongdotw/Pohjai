appControllers.controller('chartCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.chartType = myService.chartType;
  $scope.data = [];

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

  $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionInChart.php?questionSetID=' + myService.questionSetDetail.question_set_id)
    .then(function(response) {
      $scope.questionArrayList = response.data.results;
      makeLabelsForChart();
    }, function(error) {
      console.log(error);
    });

  // $scope.options = { legend: { display: true } };
  
  function makeLabelsForChart() {
    if (myService.questionSetDetail.question_set_number_btn == 1) {
      if ($scope.appLanguageID == "1") {
        $scope.labels = ['แย่', 'พอใช้', 'ดี', 'ดีมาก'];
        makeQuestionDataForChart();
        makeSetDataForChart();
      } else {
        $scope.labels = ['Bad', 'OK', 'Good', 'Very Good'];
        makeQuestionDataForChart();
        makeSetDataForChart();
      }
    } else {
      if ($scope.appLanguageID == "1") {
        $scope.labels = ['แย่มาก', 'แย่', 'พอใช้', 'ดี', 'ดีมาก'];
        makeQuestionDataForChart();
        makeSetDataForChart();
      } else {
        $scope.labels = ['Very Bad', 'Bad', 'OK', 'Good', 'Very Good'];
        makeQuestionDataForChart();
        makeSetDataForChart();
      }
    }
  }

  function makeQuestionDataForChart() {
    if (myService.questionSetDetail.question_set_number_btn == 1) {
      for (var i = 0; i < $scope.questionArrayList.length; i++) {
        $scope.data[i] = [0, 0, 0, 0];
        for (var j = 0; j < myService.countScorePerQuestion.length; j++) {
          if ($scope.questionArrayList[i].question_id == myService.countScorePerQuestion[j].score_question_id) {
            if (myService.countScorePerQuestion[j].score_value == 2) {
              $scope.data[i][0] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else if (myService.countScorePerQuestion[j].score_value == 3) {
              $scope.data[i][1] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else if (myService.countScorePerQuestion[j].score_value == 4) {
              $scope.data[i][2] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else {
              $scope.data[i][3] = parseInt(myService.countScorePerQuestion[j].countscore);
            }
          }
        }
      }
    } else {
      for (var i = 0; i < $scope.questionArrayList.length; i++) {
        $scope.data[i] = [0, 0, 0, 0, 0];
        for (var j = 0; j < myService.countScorePerQuestion.length; j++) {
          if ($scope.questionArrayList[i].question_id == myService.countScorePerQuestion[j].score_question_id) {
            if (myService.countScorePerQuestion[j].score_value == 1) {
              $scope.data[i][0] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else if (myService.countScorePerQuestion[j].score_value == 2) {
              $scope.data[i][1] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else if (myService.countScorePerQuestion[j].score_value == 3) {
              $scope.data[i][2] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else if (myService.countScorePerQuestion[j].score_value == 4) {
              $scope.data[i][3] = parseInt(myService.countScorePerQuestion[j].countscore);
            } else {
              $scope.data[i][4] = parseInt(myService.countScorePerQuestion[j].countscore);
            }
          }
        }
      }
    }
  }

  function makeSetDataForChart() {
    if (myService.questionSetDetail.question_set_number_btn == 1) {
      $scope.setData = [0, 0, 0, 0];
      for (var i = 0; i < myService.countScorePerSet.length; i++) {
        if (myService.countScorePerSet[i].score_value == 2) {
          $scope.setData[0] = parseInt(myService.countScorePerSet[i].countscore);
        } else if (myService.countScorePerSet[i].score_value == 3) {
          $scope.setData[1] = parseInt(myService.countScorePerSet[i].countscore);
        } else if (myService.countScorePerSet[i].score_value == 4) {
          $scope.setData[2] = parseInt(myService.countScorePerSet[i].countscore);
        } else {
          $scope.setData[3] = parseInt(myService.countScorePerSet[i].countscore);
        }
      }
    } else {
      $scope.setData = [0, 0, 0, 0, 0];
      for (var i = 0; i < myService.countScorePerSet.length; i++) {
        if (myService.countScorePerSet[i].score_value == 1) {
          $scope.setData[0] = parseInt(myService.countScorePerSet[i].countscore);
        } else if (myService.countScorePerSet[i].score_value == 2) {
          $scope.setData[1] = parseInt(myService.countScorePerSet[i].countscore);
        } else if (myService.countScorePerSet[i].score_value == 3) {
          $scope.setData[2] = parseInt(myService.countScorePerSet[i].countscore);
        } else if (myService.countScorePerSet[i].score_value == 4) {
          $scope.setData[3] = parseInt(myService.countScorePerSet[i].countscore);
        } else {
          $scope.setData[4] = parseInt(myService.countScorePerSet[i].countscore);
        }
      }
    }
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
});
