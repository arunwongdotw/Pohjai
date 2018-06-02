appControllers.controller('createQuestionCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.createQuestion = {};
  $scope.questionSetID = myService.questionSetDetail.question_set_id;

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

  $scope.btnCreateQuestion = function() {
    if (($scope.createQuestion.name != null) && ($scope.createQuestion.name != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/createQuestion.php',
        method: 'POST',
        data: {
          var_name: $scope.createQuestion.name,
          var_questionsetid: $scope.questionSetID
        }
      }).then(function(response) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เพิ่มหัวข้อแบบประเมินสำเร็จ !",
                content: "คุณเพิ่มหัวข้อแบบประเมินสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function() {
            $state.go('menu2.question');
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Add Successfully !",
                content: "You added topic successfully.",
                ok: "Confirm"
              }
            }
          }).then(function() {
            $state.go('menu2.question');
          });
        }
      }, function(error) {
        console.log(error);
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
