// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('homeCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.appLanguage = {};
  $scope.home = {};

  // 2 บรรทัดด้านล่างใช้ทดสอบกับ ionic serve
  // $scope.appLanguageID = "1";
  // getAppLanguage();

  // ถ้าทดสอบกับ ionic serve ให้ปิด if
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
  // stateNames = target state to go
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
  }; // End navigateTo.

  //closeSideNav is for close side navigation
  //It will use with event on-swipe-left="closeSideNav()" on-drag-left="closeSideNav()"
  //When user swipe or drag md-sidenav to left side
  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };
  //End closeSideNav

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
              }, function(error){
                console.log(error);
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
              }, function(error){
                console.log(error);
              });
            }
            // window.localStorage.username = $scope.login.username;
            // // myService.passDataObject = response.data.results[0];
            // $state.go('app2.home');
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
}); // End of menu toggle controller.
