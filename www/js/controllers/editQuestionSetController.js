appControllers.controller('editQuestionSetCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.editQuestionSet = {};

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน editQuestionSetController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function setEditValue() {
    $scope.editQuestionSet.name = myService.questionSetDetail.question_set_name;
    $scope.mdSelectValueNoBtn = myService.questionSetDetail.question_set_number_btn;
    $scope.mdSelectValueForm = myService.questionSetDetail.question_set_form;
    $scope.mdSelectValueComment = myService.questionSetDetail.question_set_comment;
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

  $scope.setNoBtn = function(noBtnID) {
    $scope.mdSelectValueNoBtn = noBtnID;
  };

  $scope.setForm = function(formID) {
    $scope.mdSelectValueForm = formID;
  };

  $scope.setComment = function(commentID) {
    $scope.mdSelectValueComment = commentID;
  };

  $scope.btnEditQuestionSet = function() {
    if (($scope.editQuestionSet.name != null) && ($scope.editQuestionSet.name != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/updateQuestionSet.php',
        method: 'POST',
        data: {
          var_questionsetid: myService.questionSetDetail.question_set_id,
          var_name: $scope.editQuestionSet.name,
          var_numberbtn: $scope.mdSelectValueNoBtn,
          var_form: $scope.mdSelectValueForm,
          var_comment: $scope.mdSelectValueComment
        }
      }).then(function(response) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "แก้ไขชุดแบบประเมินสำเร็จ !",
                content: "คุณแก้ไขชุดแบบประเมินความพึงพอใจสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            $state.go('menu2.questionmanagement');
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Edit Successfully !",
                content: "You edited set of satisfaction form successfully.",
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
              content: "เกิดข้อผิดพลาด btnEditQuestionSet ใน editQuestionSetController ระบบจะปิดอัตโนมัติ",
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
              title: "ชื่อชุดแบบประเมินไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อชุดแบบประเมินตามรูปแบบที่กำหนด",
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
              title: "Invalid Set of Form Name !",
              content: "Please fill set of form name in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };
});
