appControllers.controller('basicChartCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.chartType = myService.chartType;
  $scope.labelSelect = {};
  $scope.dataSelect = {};
  $scope.questionSetDetail = myService.questionSetDetail;

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน ChartController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getBasicQuestionChart.php?questionSetID=' + myService.questionSetDetail.question_set_id)
    .then(function(response) {
      $scope.allQuestion = response.data.results;
      makeSelectChart();
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getBasicQuestionChart.php ใน basicChartController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnBack = function() {
    $scope.navigateTo('menu2.question');
  };

  if (myService.countAgePerSet != null) {
    $scope.labelAge = ['10-15', '16-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61+'];
    makeAgeChart();
  }

  if (myService.countSexPerSet != null) {
    if ($scope.appLanguageID == "1") {
      $scope.labelSex = ['ผู้ชาย', 'ผู้หญิง'];
      makeSexChart();
    } else {
      $scope.labelSex = ['Male', 'Female'];
      makeSexChart();
    }
  }

  if (myService.countEducationPerSet != null) {
    if ($scope.appLanguageID == "1") {
      $scope.labelEducation = ['ต่ำกว่ามัธยม', 'มัธยมศึกษาหรือเทียบเท่า', 'อนุปริญญาหรือเทียบเท่า', 'ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];
      makeEducationChart();
    } else {
      $scope.labelEducation = ['Lower Secondary School', 'Secondary School', 'Diploma', 'Bachelor Degree', 'Master Degree', 'Doctor Degree'];
      makeEducationChart();
    }
  }

  if (myService.countIncomePerSet != null) {
    if ($scope.appLanguageID == "1") {
      $scope.labelIncome = ['ไม่มีรายได้', 'ต่ำกว่า 5,000', '5,001-10,000', '10,001-15,000', '15,001-20,000', '20,001 - 30,000', '30,001 - 40,000', 'มากกว่า 40,001'];
      makeIncomeChart();
    } else {
      $scope.labelIncome = ['No Income', 'Less Than 5,000', '5,001-10,000', '10,001-15,000', '15,001-20,000', '20,001 - 30,000', '30,001 - 40,000', 'More than 40,001'];
      makeIncomeChart();
    }
  }

  function makeAgeChart() {
    $scope.dataAge = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < myService.countAgePerSet.length; i++) {
      if (myService.countAgePerSet[i].info_age == "10-15") {
        $scope.dataAge[0] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "16-20") {
        $scope.dataAge[1] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "21-25") {
        $scope.dataAge[2] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "26-30") {
        $scope.dataAge[3] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "31-35") {
        $scope.dataAge[4] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "36-40") {
        $scope.dataAge[5] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "41-45") {
        $scope.dataAge[6] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "46-50") {
        $scope.dataAge[7] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "51-55") {
        $scope.dataAge[8] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "56-60") {
        $scope.dataAge[9] = parseInt(myService.countAgePerSet[i].countage);
      } else if (myService.countAgePerSet[i].info_age == "61+") {
        $scope.dataAge[10] = parseInt(myService.countAgePerSet[i].countage);
      }
    }
  }

  function makeSexChart() {
    $scope.dataSex = [0, 0];
    for (var i = 0; i < myService.countSexPerSet.length; i++) {
      if (myService.countSexPerSet[i].info_sex == "Male") {
        $scope.dataSex[0] = parseInt(myService.countSexPerSet[i].countsex);
      } else if (myService.countSexPerSet[i].info_sex == "Female") {
        $scope.dataSex[1] = parseInt(myService.countSexPerSet[i].countsex);
      }
    }
  }

  function makeEducationChart() {
    $scope.dataEducation = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < myService.countEducationPerSet.length; i++) {
      if (myService.countEducationPerSet[i].info_education == "Lower Secondary School") {
        $scope.dataEducation[0] = parseInt(myService.countEducationPerSet[i].counteducation);
      } else if (myService.countEducationPerSet[i].info_education == "Secondary School") {
        $scope.dataEducation[1] = parseInt(myService.countEducationPerSet[i].counteducation);
      } else if (myService.countEducationPerSet[i].info_education == "Diploma") {
        $scope.dataEducation[2] = parseInt(myService.countEducationPerSet[i].counteducation);
      } else if (myService.countEducationPerSet[i].info_education == "Bachelor Degree") {
        $scope.dataEducation[3] = parseInt(myService.countEducationPerSet[i].counteducation);
      } else if (myService.countEducationPerSet[i].info_education == "Master Degree") {
        $scope.dataEducation[4] = parseInt(myService.countEducationPerSet[i].counteducation);
      } else if (myService.countEducationPerSet[i].info_education == "Doctor Degree") {
        $scope.dataEducation[5] = parseInt(myService.countEducationPerSet[i].counteducation);
      }
    }
  }

  function makeIncomeChart() {
    $scope.dataIncome = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < myService.countIncomePerSet.length; i++) {
      if (myService.countIncomePerSet[i].info_income == "0") {
        $scope.dataIncome[0] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "Less than 5,000") {
        $scope.dataIncome[1] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "5,001 - 10,000") {
        $scope.dataIncome[2] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "10,001 - 15,000") {
        $scope.dataIncome[3] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "15,001 - 20,000") {
        $scope.dataIncome[4] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "20,001 - 30,000") {
        $scope.dataIncome[5] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "30,001 - 40,000") {
        $scope.dataIncome[6] = parseInt(myService.countIncomePerSet[i].countincome);
      } else if (myService.countIncomePerSet[i].info_income == "More than 40,001") {
        $scope.dataIncome[7] = parseInt(myService.countIncomePerSet[i].countincome);
      }
    }
  }

  function makeSelectChart() {
    if (myService.countAnswerTypeSelect != null) {
      getBasicAnswer(function(status) {
        makeAnsTypeSelectLabel(function(status) {
          makeAnsTypeSelectData(function(status) {});
        });
      });
    }
  }

  function getBasicAnswer(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getBasicAnsChart.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        $scope.allBasicAns = response.data.results;
        callback();
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getBasicAnswer ใน basicChartController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  var iloop = 0;
  var jloop = 0;

  function makeAnsTypeSelectLabel(callback) {
    if (iloop < $scope.allQuestion.length) {
      if ($scope.allQuestion[iloop].bq_type == "2") {
        if (jloop < $scope.allBasicAns.length) {
          if ($scope.allQuestion[iloop].bq_id == $scope.allBasicAns[jloop].bq_id) {
            $scope.labelSelect[$scope.allQuestion[iloop].bq_id].push($scope.allBasicAns[jloop].bqa_ans);
            jloop = jloop + 1;
            makeAnsTypeSelectLabel(callback);
          } else {
            jloop = jloop + 1;
            makeAnsTypeSelectLabel(callback);
          }
        } else {
          jloop = 0;
          iloop = iloop + 1;
          makeAnsTypeSelectLabel(callback);
        }
      } else {
        iloop = iloop + 1;
        makeAnsTypeSelectLabel(callback);
      }
    } else {
      callback();
    }
  }

  var kloop = 0;
  var lloop = 0;

  function makeAnsTypeSelectData(callback) {
    if (kloop < $scope.allBasicAns.length) {
      if (lloop < myService.countAnswerTypeSelect.length) {
        if ($scope.allBasicAns[kloop].bqa_id == myService.countAnswerTypeSelect[lloop].ans_bqa_id) {
          $scope.dataSelect[$scope.allBasicAns[kloop].bq_id].push(myService.countAnswerTypeSelect[lloop].countans);
          lloop = 0;
          kloop = kloop + 1;
          makeAnsTypeSelectData(callback);
        } else {
          lloop = lloop + 1;
          makeAnsTypeSelectData(callback);
        }
      } else {
        $scope.dataSelect[$scope.allBasicAns[kloop].bq_id].push("0");
        lloop = 0;
        kloop = kloop + 1;
        makeAnsTypeSelectData(callback);
      }
    } else {
      callback();
    }
  }

  $scope.seeAllName = function(questionSetID) {
    myService.allAns = {};
    myService.allName = {};
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getAllNameByQID.php',
      method: 'POST',
      data: {
        var_questionsetid: questionSetID,
        var_startdate: myService.chartDate.startdatetime,
        var_enddate: myService.chartDate.enddatetime
      }
    }).then(function(response) {
      myService.allName = response.data.results;
      $state.go('menu2.seealllist');
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด seeAllName ใน basicChartController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.seeAllAns = function(bq_id) {
    myService.allAns = {};
    myService.allName = {};
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getAllAnsByBQID.php',
      method: 'POST',
      data: {
        var_bqid: bq_id,
        var_startdate: myService.chartDate.startdatetime,
        var_enddate: myService.chartDate.enddatetime
      }
    }).then(function(response) {
      myService.allAns = response.data.results;
      $state.go('menu2.seealllist');
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด seeAllAns ใน basicChartController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };
});
