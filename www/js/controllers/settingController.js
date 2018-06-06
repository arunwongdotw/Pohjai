appControllers.controller('settingCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.appLanguage = {};
  $scope.currState = $state; // get ค่าชื่อ state
  $scope.memberID = myService.memberDetailFromLogin.member_id; // member_id ของ member ที่ Login
  $scope.mdSelectValueAppColor = "1";

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

  // if (typeof window.localStorage.appColor == 'undefined') {
  //   $scope.mdSelectValueAppColor = "1";
  // } else if ((window.localStorage.appColor != "") || (window.localStorage.appColor != null)) {
  //   $scope.mdSelectValueAppColor = window.localStorage.appColor;
  // } else {
  //   $scope.mdSelectValueAppColor = "1";
  // }

  if ($state.current.name == "menu1.setting") {
    $scope.loginFlag = false;
  } else {
    $scope.loginFlag = true;
    getMemberSetting(function(status) {});
  }

  function getAppLanguage() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAppLanguage.php?appLanguageID=' + $scope.appLanguageID)
      .then(function(response) {
        $scope.appLanguage = response.data.results[0];
      }, function(error) {
        console.log(error);
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
        console.log(error);
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
      }).then(function() {
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
      }).then(function() {
        window.localStorage.appColor = colorName;
        ionic.Platform.exitApp();
      });
    }
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    });
  };
});
