// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('loginMenuCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  $scope.appLanguage = {};
  $scope.menu2 = {}; // $scope.menu2 คือ object ของ member

  // 2 บรรทัดด้านล่างใช้ทดสอบกับ ionic serve
  // $scope.appLanguageID = "1";
  // getAppLanguage();

  // ถ้าทดสอบกับ ionic serve ให้ปิด $scope.on และ if
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
        console.log(error);
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.menu2 = response.data.results[0];
      myService.memberDetailFromLogin = response.data.results[0];
    }, function(error) {
      console.log(error);
    });

  // buildToggler is for create menu toggle.
  // Parameter :
  // navID = id of navigation bar.
  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID).toggle();
    }, 0);
    return debounceFn;
  }; // End buildToggler.

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
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmLogout.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmLogout_success') {
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
          console.log(error);
        });
      }, function() {
        console.log('cancel');
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
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmLogout.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmLogout_success') {
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
          console.log(error);
        });
      }, function() {
        console.log('cancel');
      });
    }
  };
}); // End of menu toggle controller.
