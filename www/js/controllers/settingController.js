appControllers.controller('settingCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.appLanguage = {};
  $scope.currState = $state; // get ค่าชื่อ state
  $scope.memberID = myService.memberDetailFromLogin.member_id; // member_id ของ member ที่ Login

  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.mdSelectValueLanguage = "1";
    $scope.appLanguageID = "1";
    getAppLanguage();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.mdSelectValueLanguage = window.localStorage.appLanguageID;
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
  } else {
    $scope.mdSelectValueLanguage = "1";
    $scope.appLanguageID = "1";
    getAppLanguage();
  }

  if (typeof window.localStorage.appColor == 'undefined') {
    $scope.mdSelectValueAppColor = "1";
  } else if ((window.localStorage.appColor != "") || (window.localStorage.appColor != null)) {
    $scope.mdSelectValueAppColor = window.localStorage.appColor;
    setMdSelectValueAppColor();
  } else {
    $scope.mdSelectValueAppColor = "1";
  }

  if (typeof window.localStorage.secondColor == 'undefined') {
    $scope.mdSelectValueSecondColor = "1";
  } else if ((window.localStorage.secondColor != "") || (window.localStorage.secondColor != null)) {
    $scope.mdSelectValueSecondColor = window.localStorage.secondColor;
    setMdSelectValueSecondColor();
  } else {
    $scope.mdSelectValueSecondColor = "1";
  }

  if (typeof window.localStorage.sound == 'undefined') {
    $scope.mdSelectValueSound = "1";
  } else if ((window.localStorage.sound != "") || (window.localStorage.sound != null)) {
    $scope.mdSelectValueSound = window.localStorage.sound;
  } else {
    $scope.mdSelectValueSecondColor = "1";
  }

  if (typeof window.localStorage.password == 'undefined') {
    $scope.mdSelectValuePassword = "1";
  } else if ((window.localStorage.password != "") || (window.localStorage.password != null)) {
    $scope.mdSelectValuePassword = window.localStorage.password;
  } else {
    $scope.mdSelectValuePassword = "1";
  }

  if ($state.current.name == "menu1.setting") {
    $scope.loginFlag = false;
  } else {
    $scope.loginFlag = true;
    getMemberSetting(function(status) {});
  }

  function setMdSelectValueAppColor() {
    switch ($scope.mdSelectValueAppColor) {
      case 'red':
        $scope.mdSelectValueAppColor = 1;
        break;
      case 'pink':
        $scope.mdSelectValueAppColor = 2;
        break;
      case 'purple':
        $scope.mdSelectValueAppColor = 3;
        break;
      case 'deep-purple':
        $scope.mdSelectValueAppColor = 4;
        break;
      case 'indigo':
        $scope.mdSelectValueAppColor = 5;
        break;
      case 'blue':
        $scope.mdSelectValueAppColor = 6;
        break;
      case 'light-blue':
        $scope.mdSelectValueAppColor = 7;
        break;
      case 'cyan':
        $scope.mdSelectValueAppColor = 8;
        break;
      case 'teal':
        $scope.mdSelectValueAppColor = 9;
        break;
      case 'green':
        $scope.mdSelectValueAppColor = 10;
        break;
      case 'light-green':
        $scope.mdSelectValueAppColor = 11;
        break;
      case 'lime':
        $scope.mdSelectValueAppColor = 12;
        break;
      case 'yellow':
        $scope.mdSelectValueAppColor = 13;
        break;
      case 'amber':
        $scope.mdSelectValueAppColor = 14;
        break;
      case 'orange':
        $scope.mdSelectValueAppColor = 15;
        break;
      case 'deep-orange':
        $scope.mdSelectValueAppColor = 16;
        break;
      case 'brown':
        $scope.mdSelectValueAppColor = 17;
        break;
      case 'grey':
        $scope.mdSelectValueAppColor = 18;
        break;
      case 'blue-grey':
        $scope.mdSelectValueAppColor = 19;
        break;
      default:
    }
  }

  function setMdSelectValueSecondColor() {
    switch ($scope.mdSelectValueSecondColor) {
      case '#F44336':
        $scope.mdSelectValueSecondColor = 1;
        break;
      case '#E91E63':
        $scope.mdSelectValueSecondColor = 2;
        break;
      case '#9C27B0':
        $scope.mdSelectValueSecondColor = 3;
        break;
      case '#673AB7':
        $scope.mdSelectValueSecondColor = 4;
        break;
      case '#3F51B5':
        $scope.mdSelectValueSecondColor = 5;
        break;
      case '#2196F3':
        $scope.mdSelectValueSecondColor = 6;
        break;
      case '#03A9F4':
        $scope.mdSelectValueSecondColor = 7;
        break;
      case '#00BCD4':
        $scope.mdSelectValueSecondColor = 8;
        break;
      case '#009688':
        $scope.mdSelectValueSecondColor = 9;
        break;
      case '#4CAF50':
        $scope.mdSelectValueSecondColor = 10;
        break;
      case '#8BC34A':
        $scope.mdSelectValueSecondColor = 11;
        break;
      case '#CDDC39':
        $scope.mdSelectValueSecondColor = 12;
        break;
      case '#FFEB3B':
        $scope.mdSelectValueSecondColor = 13;
        break;
      case '#FFC107':
        $scope.mdSelectValueSecondColor = 14;
        break;
      case '#FF9800':
        $scope.mdSelectValueSecondColor = 15;
        break;
      case '#FF5722':
        $scope.mdSelectValueSecondColor = 16;
        break;
      case '#795548':
        $scope.mdSelectValueSecondColor = 17;
        break;
      case '#9E9E9E':
        $scope.mdSelectValueSecondColor = 18;
        break;
      case '#607D8B':
        $scope.mdSelectValueSecondColor = 19;
        break;
      default:
    }
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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน settingController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getMemberSetting(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberSetting.php?memberID=' + $scope.memberID)
      .then(function(response) {
        if (response.data.results != null) {
          $scope.mdSelectValueTemplate = response.data.results[0].member_setting_template;
          $scope.mdSelectValueOrder = response.data.results[0].member_setting_order;
          $scope.mdSelectValueColor = response.data.results[0].member_setting_color;
          $scope.mdSelectValueNoBtn = response.data.results[0].member_setting_number_btn;
          callback();
        } else {
          $scope.mdSelectValueTemplate = "1";
          $scope.mdSelectValueOrder = "1";
          $scope.mdSelectValueColor = "1";
          $scope.mdSelectValueNoBtn = "1";
          callback();
        }
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getMemberSetting ใน settingController ระบบจะปิดอัตโนมัติ",
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

  $scope.setAppColor = function(colorName) {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เปลี่ยนสีแอปพลิเคชันสำเร็จ !",
            content: "คุณเปลี่ยนสีแอปพลิเคชันสำเร็จ กรุณาเปิดแอปพลิเคชันใหม่",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        window.localStorage.appColor = colorName;
        ionic.Platform.exitApp();
      });
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "Changed Color Successfully",
            content: "You chaged color successfully, please restart application.",
            ok: "Confirm"
          }
        }
      }).then(function(response) {
        window.localStorage.appColor = colorName;
        ionic.Platform.exitApp();
      });
    }
  };

  $scope.setSecondColor = function(colorCode) {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เปลี่ยนสีรองแอปพลิเคชันสำเร็จ !",
            content: "คุณเปลี่ยนสีรองแอปพลิเคชันสำเร็จ กรุณาเปิดแอปพลิเคชันใหม่",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        window.localStorage.secondColor = colorCode;
        ionic.Platform.exitApp();
      });
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "Changed Second Color Successfully",
            content: "You chaged second color successfully, please restart application.",
            ok: "Confirm"
          }
        }
      }).then(function(response) {
        window.localStorage.secondColor = colorCode;
        ionic.Platform.exitApp();
      });
    }
  };

  $scope.setSound = function(soundID) {
    window.localStorage.sound = soundID;
    $state.go('menu2.question', {}, {
      reload: 'menu2.question'
    });
  };

  $scope.setPassword = function(passwordID) {
    window.localStorage.password = passwordID;
    $state.go('menu2.question', {}, {
      reload: 'menu2.question'
    });
  };

  $scope.setLanguage = function(appLanguageID) {
    window.localStorage.appLanguageID = appLanguageID;
    if ($state.current.name == "menu1.setting") {
      $state.go('menu1.home', {}, {
        reload: 'menu1.home'
      });
    } else {
      $state.go('menu2.question', {}, {
        reload: 'menu2.question'
      });
    }
  };

  $scope.setTemplate = function(templateID) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/updateTemplate.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID,
        var_templateid: templateID
      }
    }).then(function(response) {
      $state.go('menu2.question', {}, {
        reload: 'menu2.question'
      });
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด setTemplate ใน settingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.setOrder = function(orderID) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/updateOrder.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID,
        var_orderid: orderID
      }
    }).then(function(response) {
      $state.go('menu2.question', {}, {
        reload: 'menu2.question'
      });
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด setOrder ใน settingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.setColor = function(colorID) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/updateColor.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID,
        var_colorid: colorID
      }
    }).then(function(response) {
      $state.go('menu2.question', {}, {
        reload: 'menu2.question'
      });
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด setColor ใน settingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };
});
