appControllers.controller('questionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
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

  function getStaffList(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getStaffList.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        if (response.data.results == null) {
          myService.staffList = "0";
          callback();
        } else {
          myService.staffList = response.data.results;
          callback();
        }
      }, function(error) {
        console.log(error);
      });
  }

  $scope.btnNavigateToScore = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionInSet.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        if (response.data.results == 'getQuestionInSet_is0') {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ยังไม่มีหัวข้อ !",
                  content: "ชุดแบบประเมินยังไม่มีหัวข้อ กรุณาเพิ่มหัวข้อ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              $state.go('menu2.createquestion');
            }, function(error) {
              console.log(error);
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Not Have Topic !",
                  content: "Form not have topic, please add topic.",
                  ok: "Confirm"
                }
              }
            }).then(function(response) {
              $state.go('menu2.createquestion');
            }, function(error) {
              console.log(error);
            });
          }
        } else {
          getStaffList(function(status) {
            if (myService.staffList == "0") {
              myService.staffDetail = {};
              myService.allQuestionInSet = response.data.results;
              $state.go('menu2.score');
            } else {
              myService.allQuestionInSet = response.data.results;
              $state.go('menu2.stafflist');
            }
          });
        }
      }, function(error) {
        console.log(error);
      });
  }

  $scope.btnReportSelection = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $scope.navigateTo('menu2.reportselection');
  }
});
