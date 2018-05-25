// Controller of dashboard.
appControllers.controller('questionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};

  // 2 บรรทัดด้านล่างใช้ทดสอบกับ ionic serve
  // $scope.appLanguageID = "1";
  // getAppLanguage();

  // ถ้าทดสอบกับ ionic serve ให้ปิด if
  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.mdSelectValue = "1";
    $scope.appLanguageID = "1";
    getAppLanguage();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
  } else {
    $scope.mdSelectValue = "1";
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

  $scope.btnCreateQuestionSet = function() {
    $state.go('menu2.createquestionset');
  }

  $scope.btnCreateQuestion = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $state.go('menu2.createquestion');
  }

  $scope.btnNavigateToScore = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionInSet.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        myService.allQuestionInSet = response.data.results;
        $state.go('menu2.score');
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
}); // End of dashboard controller.
