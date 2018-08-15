appControllers.controller('questionManagementCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog, $cordovaInAppBrowser) {
  $scope.appLanguage = {};

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน questionManagementController ระบบจะปิดอัตโนมัติ",
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
      $scope.memberID = response.data.results[0].member_id;
      getQuestionSet();
      getQuestion();
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getMemberDetail.php ใน questionManagementController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  function getQuestionSet() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionSet.php?memberID=' + $scope.memberID)
      .then(function(response) {
        $scope.questionSetArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQuestionSet ใน questionManagementController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function getQuestion() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestion.php?memberID=' + $scope.memberID)
      .then(function(response) {
        $scope.questionArrayList = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getQuestion ใน questionManagementController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnCreateQuestionSet = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countQuestionSet.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID
      }
    }).then(function(response) {
      if (response.data.results == 'countQuestionSet_lessThan') {
        $state.go('menu2.createquestionset');
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่สามารถสร้างชุดแบบประเมินได้ !",
                content: "คุณได้สร้างชุดแบบประเมินเกินจำนวนที่กำหนด",
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
                title: "Cannot Create Question Set !",
                content: "You created question set more than limit that defined.",
                ok: "Confirm"
              }
            }
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
            content: "เกิดข้อผิดพลาด btnCreateQuestionSet ใน questionManagementController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnEditQuestionSet = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $state.go('menu2.editquestionset');
  };

  $scope.btnCreateQuestion = function(questionSet) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countQuestion.php',
      method: 'POST',
      data: {
        var_memberid: $scope.memberID,
        var_questionsetid: questionSet.question_set_id
      }
    }).then(function(response) {
      if (response.data.results == 'countQuestion_lessThan') {
        myService.questionSetDetail = questionSet;
        $state.go('menu2.createquestion');
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่สามารถสร้างหัวข้อแบบประเมินได้ !",
                content: "คุณได้สร้างหัวข้อแบบประเมินเกินจำนวนที่กำหนด",
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
                title: "Cannot Create Question !",
                content: "You created question more than limit that defined.",
                ok: "Confirm"
              }
            }
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
            content: "เกิดข้อผิดพลาด btnCreateQuestion ใน questionManagementController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnEditQuestion = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $http.get(myService.configAPI.webserviceURL + 'webservices/getQuestionInSet.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        myService.allQuestionInSet = response.data.results;
        $state.go('menu2.questionlist');
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnEditQuestion ใน questionManagementController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.btnEditStaff = function(questionSet) {
    myService.questionSetDetail = questionSet;
    $http.get(myService.configAPI.webserviceURL + 'webservices/getStaffInSet.php?questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        if (response.data.results == "getStaffInSet_is0") {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ไม่สามารถแก้ไขข้อมูลพนักงานได้ !",
                  content: "คุณไม่สามารถแก้ไขข้อมูลพนักงาน เพราะชุดแบบประเมินนี้ไม่มีข้อมูลพนักงาน",
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
                  title: "Cannot Edit Staff !",
                  content: "You cannot edit staff detail because this set not have staff.",
                  ok: "Confirm"
                }
              }
            });
          }
        } else {
          myService.allStaffInSet = response.data.results;
          $state.go('menu2.stafflist');
        }
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnEditStaff ใน questionManagementController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.btnDelQuestionSet = function(questionSet) {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ลบชุดแบบประเมินนี้ ?",
            content: "คุณแน่ใจที่จะลบชุดแบบประเมินนี้ ทุกอย่างที่เกี่ยวข้องกับแบบประเมินนี้จะถูกลบไปด้วย",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSet.php',
          method: 'POST',
          data: {
            var_questionsetid: questionSet.question_set_id
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ลบชุดประเมินสำเร็จ !",
                content: "คุณลบชุดประเมินสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            $state.reload();
          });
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnDelQuestionSet ใน questionManagementController ระบบจะปิดอัตโนมัติ",
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
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "Delete Form ?",
            content: "Are you sure to delete this form ? All about this form will deleted.",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSet.php',
          method: 'POST',
          data: {
            var_questionsetid: questionSet.question_set_id
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Delete Form Successfully",
                content: "You deleted form successfully.",
                ok: "Confirm"
              }
            }
          }).then(function(response) {
            $state.reload();
          });
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnDelQuestionSet ใน questionManagementController ระบบจะปิดอัตโนมัติ",
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

  $scope.openLink = function(ads) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
    if ((ads.advertise_url != "") && (ads.advertise_url != null)) {
      var click = parseInt(ads.advertise_click);
      click = click + 1;
      $http.get(myService.configAPI.webserviceURL + 'webservices/addAdClick.php?adID=' + ads.advertise_id + '&click=' + click);
      $cordovaInAppBrowser.open('http://' + ads.advertise_url, '_system', options);
    }
  };

  $scope.closeCard = function() {
    var myEl = angular.element(document.querySelector('#advertise-card'));
    myEl.remove();
  };

  $scope.adsArray = [];
  var arrayOfRandomNumber = [];
  var randomNumber;
  var allAdsLength;
  var checkDup;

  $scope.$on('$ionicView.enter', function() {
    getAllAds(function(status) {
      createAdsArray(function(status) {});
      addAdFrequency(function(status) {});
    });
  });

  function getAllAds(callback) {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAllAds.php')
      .then(function(response) {
        $scope.allAds = response.data.results;
        callback();
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getAllAds ใน questionManagementController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function createAdsArray(callback) {
    for (var i = 0; i < 1; i++) {
      getRandomNumber(function(status) {
        pushAdsArray(randomNumber, function(status) {
          callback();
        });
      });
    }
  }

  function getRandomNumber(callback) {
    allAdsLength = $scope.allAds.length;
    randomNumber = Math.floor(Math.random() * allAdsLength);
    if (arrayOfRandomNumber.length == 0) {
      arrayOfRandomNumber.push(randomNumber);
      callback(randomNumber);
    } else {
      checkDup = checkDupInArrayOfRandomNumber(randomNumber);
      if (checkDup == true) {
        getRandomNumber(callback);
      } else {
        arrayOfRandomNumber.push(randomNumber);
        callback(randomNumber);
      }
    }
  }

  function pushAdsArray(randomNumber, callback) {
    $scope.adsArray.push($scope.allAds[randomNumber]);
    callback();
  }

  function checkDupInArrayOfRandomNumber(randomNumber) {
    for (var j = 0; j < arrayOfRandomNumber.length; j++) {
      if (arrayOfRandomNumber[j] == randomNumber) {
        return true;
      }
    }
    return false;
  }

  function addAdFrequency(callback) {
    for (var i = 0; i < $scope.adsArray.length; i++) {
      var frequency = parseInt($scope.adsArray[i].advertise_frequency);
      frequency = frequency + 1;
      $http.get(myService.configAPI.webserviceURL + 'webservices/addAdFrequency.php?adID=' + $scope.adsArray[i].advertise_id + '&frequency=' + frequency);
    }
    callback();
  }
});
