appControllers.controller('createQuestionSetCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.createQuestionSet = {};
  $scope.mdSelectValueNoBtn = 1;
  $scope.mdSelectValueForm = 1;
  $scope.mdSelectValueComment = 1;
  $scope.memberID = myService.memberDetailFromLogin.member_id;

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

  $scope.setNoBtn = function(noBtnID) {
    $scope.mdSelectValueNoBtn = noBtnID;
  }

  $scope.setForm = function(formID) {
    $scope.mdSelectValueForm = formID;
  }

  $scope.setComment = function(commentID) {
    $scope.mdSelectValueComment = commentID;
  }

  $scope.btnCreateQuestionSet = function() {
    if (($scope.createQuestionSet.name != null) && ($scope.createQuestionSet.name != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/createQuestionSet.php',
        method: 'POST',
        data: {
          var_name: $scope.createQuestionSet.name,
          var_numberbtn: $scope.mdSelectValueNoBtn,
          var_form: $scope.mdSelectValueForm,
          var_comment: $scope.mdSelectValueComment,
          var_memberid: $scope.memberID
        }
      }).then(function(response) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "สร้างชุดแบบประเมินสำเร็จ !",
                content: "คุณสร้างชุดแบบประเมินความพึงพอใจสำเร็จ",
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
                title: "Create Successfully !",
                content: "You created set of satisfaction form successfully.",
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
  }
});
