appControllers.controller('questionManagementCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
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

  $scope.btnCreateQuestionSet = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countQuestionSet.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID
      }
    }).then(function(response) {
      if (response.data.results = 'countToMakeChartPerQuestion_lessThan10') {
        $state.go('menu2.createquestionset');
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่สามารถสร้างชุดแบบประเมินได้ !",
                content: "คุณได้สร้างชุดแบบประเมินเกิน 10 ชุดตามจำนวนที่กำหนด",
                ok: "ตกลง"
              }
            }
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Cannot Create Question Set !",
                content: "You created question set more than 10 set that defined.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    }, function(error) {
      console.log(error);
    });
  }

  $scope.btnEditQuestionSet = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $state.go('menu2.editquestionset');
  }

  $scope.btnCreateQuestion = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $state.go('menu2.createquestion');
  }

  $scope.btnEditQuestion = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionInSet.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        myService.allQuestionInSet = response.data.results;
        $state.go('menu2.questionlist');
      }, function(error) {
        console.log(error);
      });
  }

  $scope.btnDelQuestionSet = function(questionSet) {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ลบชุดแบบประเมินนี้ ?",
            content: "คุณแน่ใจที่จะลบชุดแบบประเมินนี้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSet.php',
          method: 'POST',
          data: {
            var_questionsetid: questionSet.question_set_id
          }
        }).then(function(response) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ลบชุดประเมินสำเร็จ !",
                  content: "คุณลบชุดประเมินสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function() {
              $state.reload();
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Delete Form Successfully",
                  content: "You deleted form successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function() {
              $state.reload();
            });
          }
        }, function(error) {
          console.log(error);
        });
      });
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "Delete Form ?",
            content: "Are you sure to delete this form ?",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSet.php',
          method: 'POST',
          data: {
            var_questionsetid: questionSet.question_set_id
          }
        }).then(function(response) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ลบชุดประเมินสำเร็จ !",
                  content: "คุณลบชุดประเมินสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function() {
              $state.reload();
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Delete Form Successfully",
                  content: "You deleted form successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function() {
              $state.reload();
            });
          }
        }, function(error) {
          console.log(error);
        });
      });
    }
  }
});
