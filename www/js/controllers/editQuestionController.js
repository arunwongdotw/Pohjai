appControllers.controller('editQuestionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.editQuestion = {};

  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setEditValue();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
    setEditValue();
  } else {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setEditValue();
  }

  function getAppLanguage() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAppLanguage.php?appLanguageID=' + $scope.appLanguageID)
      .then(function(response) {
        $scope.appLanguage = response.data.results[0];
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getAppLanguage ใน editQuestionController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function setEditValue() {
    $scope.editQuestion.name = myService.questionDetail.question_name;
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

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

  $scope.btnEditQuestion = function() {
    if (($scope.editQuestion.name != null) && ($scope.editQuestion.name != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/updateQuestion.php',
        method: 'POST',
        data: {
          var_questionid: myService.questionDetail.question_id,
          var_name: $scope.editQuestion.name,
        }
      }).then(function(response) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "แก้ไขหัวข้อแบบประเมินสำเร็จ !",
                content: "คุณแก้ไขหัวข้อแบบประเมินสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(reponse) {
            $state.go('menu2.questionmanagement');
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Edit Successfully !",
                content: "You edited topic successfully.",
                ok: "Confirm"
              }
            }
          }).then(function(response) {
            $state.go('menu2.questionmanagement');
          });
        }
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnEditQuestion ใน editQuestionController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    } else {
      if ($scope.appLanguageID == "1") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ชื่อหัวข้อแบบประเมินไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อหัวข้อแบบประเมินตามรูปแบบที่กำหนด",
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
              title: "Invalid Topic Name !",
              content: "Please fill topic name in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  }
});
