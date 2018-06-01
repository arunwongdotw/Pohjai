// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('reportSelectionCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate, ionicDatePicker) {
  $scope.appLanguage = {};
  $scope.currState = $state; // get ค่าชื่อ state
  $scope.mdSelectValueChart = 1;
  $scope.reportSelection = {};

  // 3 บรรทัดด้านล่างใช้ทดสอบกับ ionic serve
  // $scope.appLanguageID = "1";
  // $scope.mdSelectValue = $scope.appLanguageID = "1";
  // getAppLanguage();

  // ถ้าทดสอบกับ ionic serve ให้ปิด if
  // if อันนี้เอาไว้ get ภาษา
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

  var ipObj1 = {
    callback: function(val) { //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.reportSelection.startdate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      var str = $scope.reportSelection.startdate;
      var strArray = str.split('-');
      var year = strArray[0];
      var month = strArray[1] - 1;
      var day = strArray[2];
      setFromValueIpObj2(year, month, day);
    },
    from: new Date(2018, 00, 01), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePickerStart = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  var ipObj2 = {
    callback: function(val) { //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.reportSelection.enddate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      var str = $scope.reportSelection.enddate;
      var strArray = str.split('-');
      var year = strArray[0];
      var month = strArray[1] - 1;
      var day = strArray[2];
      setFromValueIpObj1(year, month, day);
    },
    from: new Date(2018, 00, 01), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePickerEnd = function() {
    ionicDatePicker.openDatePicker(ipObj2);
  };

  function setFromValueIpObj2(year, month, day) {
    ipObj2 = {
      callback: function(val) { //Mandatory
        // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.reportSelection.enddate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      },
      from: new Date(year, month, day), //Optional
      to: new Date(2020, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
  }

  function setFromValueIpObj1(year, month, day) {
    ipObj1 = {
      callback: function(val) { //Mandatory
        // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.reportSelection.startdate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      },
      from: new Date(2018, 00, 01), //Optional
      to: new Date(year, month, day), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
  }

  $scope.setChart = function(chartID) {
    $scope.mdSelectValueChart = chartID;
  }

  $scope.btnChart = function() {
    if (typeof $scope.reportSelection.startdate != 'undefined') {
      if (typeof $scope.reportSelection.enddate != 'undefined') {
        myService.chartType = $scope.mdSelectValueChart;
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/countToMakeChartPerQuestion.php',
          method: 'POST',
          data: {
            var_questionsetid: myService.questionSetDetail.question_set_id,
            var_startdate: $scope.reportSelection.startdate,
            var_enddate: $scope.reportSelection.enddate
          }
        }).then(function(response) {
          myService.countScorePerQuestion = response.data.results;
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/countToMakeChartPerSet.php',
            method: 'POST',
            data: {
              var_questionsetid: myService.questionSetDetail.question_set_id,
              var_startdate: $scope.reportSelection.startdate,
              var_enddate: $scope.reportSelection.enddate
            }
          }).then(function(response) {
            myService.countScorePerSet = response.data.results;
            $state.go('menu2.chart');
          });
        });
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "วันสิ้นสุดไม่ถูกต้อง !",
                content: "กรุณาเลือกวันสิ้นสุด",
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
                title: "Invalid End Date !",
                content: "Please select end date.",
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
              title: "วันเริ่มต้นไม่ถูกต้อง !",
              content: "กรุณาเลือกวันเริ่มต้น",
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
              title: "Invalid Start Date !",
              content: "Please select start date.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  }
}); // End of menu toggle controller.
