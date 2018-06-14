appControllers.controller('contactUsCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.contactUs = {};

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน contactUsController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getReportList.php?memberID=' + myService.memberDetailFromLogin.member_id)
    .then(function(response) {
      $scope.reportArrayList = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getReportList.php ใน contactUsController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

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

  $scope.btnReport = function() {
    if (($scope.contactUs.topic != null) && ($scope.contactUs.topic != "")) {
      if (($scope.contactUs.detail != null) && ($scope.contactUs.detail != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/addReport.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_topic: $scope.contactUs.topic,
            var_detail: $scope.contactUs.detail
          }
        }).then(function(response) {
          if (response.data.results == "addReport_full") {
            if ($scope.appLanguageID == "1") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รายงานปัญหาเกินจำนวนที่กำหนด !",
                    content: "คุณรายงานปัญหาเกิดนจำนวนที่กำหนด กรุณารายงานใหม่ภายหลัง",
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
                    title: "Report Over The Limit !",
                    content: "Your report over the limit, please try again later.",
                    ok: "Confirm"
                  }
                }
              });
            }
          } else {
            if ($scope.appLanguageID == "1") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รายงานปัญหาสำเร็จ !",
                    content: "คุณรายงานปัญหาสำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                $state.reload();
              });
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "Report Over The Limit !",
                    content: "Your report over the limit, please try again later.",
                    ok: "Confirm"
                  }
                }
              }).then(function(response) {
                $state.reload();
              });
            }
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnReport ใน contactUsController ระบบจะปิดอัตโนมัติ",
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
                title: "รายละเอียดไม่ถูกต้อง !",
                content: "กรุณารายละเอียดตามรูปแบบที่กำหนด",
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
                title: "Invalid Detail !",
                content: "Please fill detail in the form provided.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    } else {
      if ($scope.appLanguageID == "1") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "หัวข้อไม่ถูกต้อง !",
              content: "กรุณากรอกหัวข้อตามรูปแบบที่กำหนด",
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
              title: "Invalid Topic !",
              content: "Please fill topic in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };
});
