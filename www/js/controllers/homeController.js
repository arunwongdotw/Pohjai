appControllers.controller('homeCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.appLanguage = {};
  $scope.home = {};

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
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getAppLanguage ใน homeController ระบบจะปิดอัตโนมัติ",
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
      $mdSidenav('left').close();
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAndroid == false ? 300 : 0));
  };

  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };

  $scope.btnSignIn = function() {
    if (($scope.home.username != null) && ($scope.home.username != "")) {
      if (($scope.home.password != null) && ($scope.home.password != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/loginMember.php',
          method: 'POST',
          data: {
            var_username: $scope.home.username,
            var_password: $scope.home.password
          }
        }).then(function(response) {
          if (response.data.results == 'notfound_username') {
            if ($scope.appLanguageID == "1") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "ชื่อผู้ใช้ (Username) ไม่ถูกต้อง !",
                    content: "ไม่พบชื่อผู้ใช้ (Username) นี้อยู่ในระบบ",
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
                    title: "Invalid Username !",
                    content: "No username found in system.",
                    ok: "Confirm"
                  }
                }
              });
            }
          } else if (response.data.results == 'wrong_password') {
            if ($scope.appLanguageID == "1") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รหัสผ่าน (Password) ไม่ถูกต้อง",
                    content: "ไม่พบชื่อผู้ใช้นี้อยู่ในระบบ",
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
                    title: "Invalid Password !",
                    content: "Password is incorrect, please refill password.",
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
                    title: "เข้าสู่ระบบสำเร็จ !",
                    content: "คุณเข้าสู่ระบบสำเร็จ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                window.localStorage.memberUsername = $scope.home.username;
                $state.go('menu2.question');
              });
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "Login successfully !",
                    content: "You logged in successfully.",
                    ok: "Confirm"
                  }
                }
              }).then(function() {
                window.localStorage.memberUsername = $scope.home.username;
                $state.go('menu2.question');
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
                content: "เกิดข้อผิดพลาด btnSignIn ใน homeController ระบบจะปิดอัตโนมัติ",
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
                title: "รหัสผ่าน (Password) ไม่ถูกต้อง !",
                content: "กรุณากรอกรหัสผ่าน (Password)",
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
                title: "Invalid Password !",
                content: "Please fill password.",
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
              title: "ชื่อผู้ใช้ (Username) ไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อผู้ใช้ (Username)",
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
              title: "Invalid Username !",
              content: "Please fill username.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };
});
