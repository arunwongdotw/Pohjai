appControllers.controller('loginMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  $scope.appLanguage = {};
  $scope.menu2 = {}; // $scope.menu2 คือ object ของ member

  $scope.$on('$ionicView.enter', function() {
    $scope.currState = $state;
    if ($state.current.name == "menu2.question") {
      if ((typeof window.localStorage.appLanguageID != 'undefined') && ($scope.appLanguageID != window.localStorage.appLanguageID)) {
        $scope.appLanguageID = window.localStorage.appLanguageID;
        getAppLanguage();
      }
    }
  });

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน loginMenuController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.menu2 = response.data.results[0];
      myService.memberDetailFromLogin = response.data.results[0];
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getMemberDetail.php ใน loginMenuController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID).toggle();
    }, 0);
    return debounceFn;
  };

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

  $scope.btnLogout = function() {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'inputDialogController',
        templateUrl: 'input-dialog.html',
        locals: {
          displayOption: {
            title: "ออกจากระบบ ?",
            content: "คุณต้องการที่จะออกจากระบบ ?",
            inputplaceholder: "กรุณากรอกรหัสผ่านเพื่อยืนยัน",
            ok: "ยืนยัน",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            window.localStorage.memberUsername = "";
            $state.go('menu1.home');
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ยืนยันรหัสผ่านไม่ถูกต้อง !",
                  content: "คุณกรอกยืนยันรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่",
                  ok: "ตกลง"
                }
              }
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnLogout ใน loginMenuController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    } else {
      $mdDialog.show({
        controller: 'inputDialogController',
        templateUrl: 'input-dialog.html',
        locals: {
          displayOption: {
            title: "Logout ?",
            content: "Do you want to logout ?",
            inputplaceholder: "Fill password for confirm",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            window.localStorage.memberUsername = "";
            $state.go('menu1.home');
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Invalid Confirm Password !",
                  content: "You fill invalid confirm password, please try again.",
                  ok: "Confirm"
                }
              }
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnLogout ใน loginMenuController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    }
  };

  function back() {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'inputDialogController',
        templateUrl: 'input-dialog.html',
        locals: {
          displayOption: {
            title: "ย้อนกลับ ?",
            content: "คุณต้องการที่จะย้อนกลับ ?",
            inputplaceholder: "กรุณากรอกรหัสผ่านเพื่อยืนยัน",
            ok: "ยืนยัน",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            $ionicHistory.goBack();
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ยืนยันรหัสผ่านไม่ถูกต้อง !",
                  content: "คุณกรอกยืนยันรหัสผ่านไม่ถูกต้อง กรุณากรอกใหม่",
                  ok: "ตกลง"
                }
              }
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด back ใน loginMenuController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    } else {
      $mdDialog.show({
        controller: 'inputDialogController',
        templateUrl: 'input-dialog.html',
        locals: {
          displayOption: {
            title: "Back ?",
            content: "Do you want to back ?",
            inputplaceholder: "Fill password for confirm",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            $ionicHistory.goBack();
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Invalid Confirm Password !",
                  content: "You fill invalid confirm password, please try again.",
                  ok: "Confirm"
                }
              }
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด back ใน loginMenuController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      });
    }
  };

  //  $ionicPlatform.registerBackButtonAction(callback, priority, [actionId])
  //
  //     Register a hardware back button action. Only one action will execute
  //  when the back button is clicked, so this method decides which of
  //  the registered back button actions has the highest priority.
  //
  //     For example, if an actionsheet is showing, the back button should
  //  close the actionsheet, but it should not also go back a page view
  //  or close a modal which may be open.
  //
  //  The priorities for the existing back button hooks are as follows:
  //  Return to previous view = 100
  //  Close side menu         = 150
  //  Dismiss modal           = 200
  //  Close action sheet      = 300
  //  Dismiss popup           = 400
  //  Dismiss loading overlay = 500
  //
  //  Your back button action will override each of the above actions
  //  whose priority is less than the priority you provide. For example,
  //  an action assigned a priority of 101 will override the ‘return to
  //  previous view’ action, but not any of the other actions.
  //
  //  Learn more at : http://ionicframework.com/docs/api/service/$ionicPlatform/#registerBackButtonAction

  $ionicPlatform.registerBackButtonAction(function() {

    if ($mdSidenav("left").isOpen()) {
      //If side navigation is open it will close and then return
      $mdSidenav('left').close();
    } else if (jQuery('md-bottom-sheet').length > 0) {
      //If bottom sheet is open it will close and then return
      $mdBottomSheet.cancel();
    } else if (jQuery('[id^=dialog]').length > 0) {
      //If popup dialog is open it will close and then return
      $mdDialog.cancel();
    } else if (jQuery('md-menu-content').length > 0) {
      //If md-menu is open it will close and then return
      $mdMenu.hide();
    } else if (jQuery('md-select-menu').length > 0) {
      //If md-select is open it will close and then return
      $mdSelect.hide();
    } else {

      // If control :
      // side navigation,
      // bottom sheet,
      // popup dialog,
      // md-menu,
      // md-select
      // is not opening, It will show $mdDialog to ask for
      // Confirmation to close the application or go to the view of lasted state.

      // Check for the current state that not have previous state.
      // It will show $mdDialog to ask for Confirmation to close the application.

      // if ($ionicHistory.backView() == null) {
      //
      //   //Check is popup dialog is not open.
      //   if (jQuery('[id^=dialog]').length == 0) {
      //
      //     // mdDialog for show $mdDialog to ask for
      //     // Confirmation to close the application.
      //
      //     $mdDialog.show({
      //       controller: 'DialogController',
      //       templateUrl: 'confirm-dialog.html',
      //       targetEvent: null,
      //       locals: {
      //         displayOption: {
      //           title: "Confirmation",
      //           content: "Do you want to close the application?",
      //           ok: "Confirm",
      //           cancel: "Cancel"
      //         }
      //       }
      //     }).then(function() {
      //       //If user tap Confirm at the popup dialog.
      //       //Application will close.
      //       ionic.Platform.exitApp();
      //     }, function() {
      //       // For cancel button actions.
      //     }); //End mdDialog
      //   }
      // } else {
      //   //Go to the view of lasted state.
      //   $ionicHistory.goBack();
      // }
      if ($state.current.name == 'menu2.question') {
        if (jQuery('[id^=dialog]').length == 0) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              targetEvent: null,
              locals: {
                displayOption: {
                  title: "การยืนยัน",
                  content: "คุณแน่ใจที่จะออกจากแอปพลิเคชัน ?",
                  ok: "ยืนยัน",
                  cancel: "ยกเลิก"
                }
              }
            }).then(function(response) {
              //If user tap Confirm at the popup dialog.
              //Application will close.
              ionic.Platform.exitApp();
            }); //End mdDialog
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              targetEvent: null,
              locals: {
                displayOption: {
                  title: "Confirmation",
                  content: "Do you want to close the application?",
                  ok: "Confirm",
                  cancel: "Cancel"
                }
              }
            }).then(function(response) {
              //If user tap Confirm at the popup dialog.
              //Application will close.
              ionic.Platform.exitApp();
            }); //End mdDialog
          }
        }
      } else {
        if ($state.current.name == 'menu2.score') {
          back();
        } else if ($state.current.name == 'menu2.reportselection') {
          $state.go('menu2.question');
        } else {
          $ionicHistory.goBack();
        }
      }
    }
  }, 100);
  //End of $ionicPlatform.registerBackButtonAction
});
