appControllers.controller('staffListQRCodeCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.staffList = myService.staffList;

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
    $scope.color = "#3F51B5";
  } else if ((window.localStorage.secondColor != "") || (window.localStorage.secondColor != null)) {
    $scope.color = window.localStorage.secondColor;
  } else {
    $scope.color = "#3F51B5";
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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน staffListScoreController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
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

  $scope.btnQRCode = function(staff) {
    myService.staffDetail = staff;
    generateQRCode(function(status) {
      $state.go('menu2.qrcode');
    });
  };

  function generateQRCode(callback) {
    if (myService.questionSetDetail.question_set_info == "1") {
      var qrCodeData = "http://1did.net/pohjai9/php/pohjai-qrcode-staff.php?questionSetID=" + myService.questionSetDetail.question_set_id + "_" + $scope.appLanguageID + "_" + myService.staffDetail.staff_id;
      $http.get('http://1did.net/pohjai9/php_qrcode/index.php?data=' + qrCodeData + '&level=high&size=10')
        .then(function(response) {
          myService.qrCodeName = response.data;
          callback();
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด generateQRCode ใน staffListQRCodeController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    } else {
      var qrCodeData = "http://1did.net/pohjai9/php/pohjai-qrcode-info-staff.php?questionSetID=" + myService.questionSetDetail.question_set_id + "_" + $scope.appLanguageID + "_" + myService.staffDetail.staff_id;
      $http.get('http://1did.net/pohjai9/php_qrcode/index.php?data=' + qrCodeData + '&level=high&size=10')
        .then(function(response) {
          myService.qrCodeName = response.data;
          callback();
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด generateQRCode ใน staffListQRCodeController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    }
  }
});
