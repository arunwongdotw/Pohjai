appControllers.controller('questionListCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.allQuestionInSet = myService.allQuestionInSet;

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
    navigator.app.backHistory();
  };

  $scope.btnEditQuestion = function(question) {
    myService.questionDetail = question;
    $state.go('menu2.editquestion');
  };

  $scope.btnDelQuestion = function(question) {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ลบหัวข้อนี้ ?",
            content: "คุณแน่ใจที่จะลบหัวข้อนี้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestion.php',
          method: 'POST',
          data: {
            var_questionid: question.question_id
          }
        }).then(function(response) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ลบหัวข้อสำเร็จ",
                  content: "คุณลบหัวข้อสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function() {
              $state.go('menu2.questionmanagement');
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Delete Topic Successfully",
                  content: "You deleted topic successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function() {
              $state.go('menu2.questionmanagement');
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
            title: "Delete Topic ?",
            content: "Are you sure to delete this topic ?",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestion.php',
          method: 'POST',
          data: {
            var_questionid: question.question_id
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
  };
}); // End of dashboard controller.
