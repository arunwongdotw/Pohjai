appControllers.controller('basicInfoCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog, $cordovaNativeAudio) {
  $scope.appLanguage = {};
  $scope.basicInfoInSet = myService.basicInfoInSet;
  $scope.basicQuestionInSet = myService.basicQuestionInSet;
  $scope.basicAnsInQuestion = myService.basicAnsInQuestion;
  $scope.mdSelectValueAge = 1;
  $scope.mdSelectValueSex = 1;
  $scope.mdSelectValueEducation = 1;
  $scope.mdSelectValueSalary = 1;
  $scope.mdSelectValueAns = {};
  $scope.basicInfo = {};
  $scope.basicAnsInput = {};
  $scope.basicAnsSelect = {};
  $cordovaNativeAudio.preloadSimple('thankscut', 'audio/thankscut.mp3');

  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setMdSelectValueAns();
    setMdSelectValueInfo();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
    setMdSelectValueAns();
    setMdSelectValueInfo();
  } else {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setMdSelectValueAns();
    setMdSelectValueInfo();
  }

  if (typeof window.localStorage.sound == 'undefined') {
    $scope.sound = "1";
  } else if ((window.localStorage.sound != "") || (window.localStorage.sound != null)) {
    $scope.sound = window.localStorage.sound;
  } else {
    $scope.sound = "1";
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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน createQuestionSetController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function setMdSelectValueAns() {
    var bqa_id;
    var bq_id;
    for (var i = 0; i < $scope.basicQuestionInSet.length; i++) {
      if ($scope.basicQuestionInSet[i].bq_type == "2") {
        bq_id = $scope.basicQuestionInSet[i].bq_id;
        for (var j = 0; j < $scope.basicAnsInQuestion.length; j++) {
          if ($scope.basicAnsInQuestion[j].bqa_bq_id == bq_id) {
            $scope.mdSelectValueAns[i] = j;
            $scope.basicAnsSelect[i] = $scope.basicAnsInQuestion[j].bqa_ans;
            break;
          }
        }
      }
    }
  }

  function setMdSelectValueInfo() {
    $scope.basicInfo.age = "10-15";
    $scope.basicInfo.sex = "Male";
    $scope.basicInfo.education = "Lower Secondary School";
    $scope.basicInfo.income = "0";
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

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

  $scope.setAge = function(age) {
    $scope.basicInfo.age = age;
  };

  $scope.setSex = function(sex) {
    $scope.basicInfo.sex = sex;
  };

  $scope.setEducation = function(education) {
    $scope.basicInfo.education = education;
  };

  $scope.setIncome = function(income) {
    $scope.basicInfo.income = income;
  };

  $scope.setAns = function(qindex, answer) {
    $scope.basicAnsSelect[qindex] = answer;
  };

  $scope.insertBasicInfo = function() {
    caiLoop = 0;
    iaLoop = 0;
    if ($scope.basicInfoInSet.bi_name == "0") {
      if (Object.keys($scope.basicAnsInput).length !== 0) {
        checkAnsInput(function(status) {});
        if ($scope.checkAnsInputFlag == true) {
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/insertInfo.php',
            method: 'POST',
            data: {
              var_name: "0",
              var_age: $scope.basicInfo.age,
              var_sex: $scope.basicInfo.sex,
              var_education: $scope.basicInfo.education,
              var_income: $scope.basicInfo.income,
              var_questionsetid: myService.questionSetDetail.question_set_id
            }
          }).then(function(response) {
            var infoid = response.data.results;
            insertAns(infoid, function(status) {
              if ($scope.sound == "1") {
                $cordovaNativeAudio.play('thankscut');
              }
              if ($scope.appLanguageID == "1") {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "ตอบแบบสอบถามเบื้องต้นสำเร็จ !",
                      content: "คุณตอบแบบสอบถามเบื้องต้นสำเร็จ ระบบจะนำไปสู่หน้าประเมินความพึงพอใจ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  $state.go('menu2.score');
                });
              } else {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "Answer Successfully !",
                      content: "You answer a basic information successfully. System will direct to satisfaction rating.",
                      ok: "Confirm"
                    }
                  }
                }).then(function(response) {
                  $state.go('menu2.score');
                });
              }
            });
          }, function(error) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เกิดข้อผิดพลาด !",
                  content: "เกิดข้อผิดพลาด insertBasicInfo ใน basicInfoController ระบบจะปิดอัตโนมัติ",
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
                  title: "คำตอบไม่ถูกต้อง !",
                  content: "กรุณากรอกคำตอบให้ครบทุกข้อ",
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
                  title: "Invalid Answer !",
                  content: "Please fill answer all of question.",
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
                title: "คำตอบไม่ถูกต้อง !",
                content: "กรุณากรอกคำตอบให้ครบทุกข้อ",
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
                title: "Invalid Answer !",
                content: "Please fill answer all of question.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    } else {
      if (($scope.basicInfo.name != null) && ($scope.basicInfo.name != "")) {
        if (Object.keys($scope.basicAnsInput).length !== 0) {
          checkAnsInput(function(status) {});
          if ($scope.checkAnsInputFlag == true) {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/insertInfo.php',
              method: 'POST',
              data: {
                var_name: $scope.basicInfo.name,
                var_age: $scope.basicInfo.age,
                var_sex: $scope.basicInfo.sex,
                var_education: $scope.basicInfo.education,
                var_income: $scope.basicInfo.income,
                var_questionsetid: myService.questionSetDetail.question_set_id
              }
            }).then(function(response) {
              var infoid = response.data.results;
              insertAns(infoid, function(status) {
                if ($scope.sound == "1") {
                  $cordovaNativeAudio.play('thankscut');
                }
                if ($scope.appLanguageID == "1") {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "ตอบแบบสอบถามเบื้องต้นสำเร็จ !",
                        content: "คุณตอบแบบสอบถามเบื้องต้นสำเร็จ ระบบจะนำไปสู่หน้าประเมินความพึงพอใจ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    $state.go('menu2.score');
                  });
                } else {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "Answer Successfully !",
                        content: "You answer a basic information successfully. System will direct to satisfaction rating.",
                        ok: "Confirm"
                      }
                    }
                  }).then(function(response) {
                    $state.go('menu2.score');
                  });
                }
              });
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด insertBasicInfo ใน basicInfoController ระบบจะปิดอัตโนมัติ",
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
                    title: "คำตอบไม่ถูกต้อง !",
                    content: "กรุณากรอกคำตอบให้ครบทุกข้อ",
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
                    title: "Invalid Answer !",
                    content: "Please fill answer all of question.",
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
                  title: "คำตอบไม่ถูกต้อง !",
                  content: "กรุณากรอกคำตอบให้ครบทุกข้อ",
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
                  title: "Invalid Answer !",
                  content: "Please fill answer all of question.",
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
                title: "ชื่อผู้ประเมินไม่ถูกต้อง !",
                content: "กรุณากรอกชื่อผู้ประเมิน",
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
                title: "Invalid Name !",
                content: "Please fill name.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    }
  };

  var caiLoop = 0;

  function checkAnsInput(callback) {
    if (caiLoop < $scope.basicQuestionInSet.length) {
      if ($scope.basicQuestionInSet[caiLoop].bq_type == "1") {
        if (($scope.basicAnsInput[caiLoop] != null) && ($scope.basicAnsInput[caiLoop] != "")) {
          $scope.checkAnsInputFlag = true;
          caiLoop = caiLoop + 1;
          checkAnsInput(callback);
        } else {
          $scope.checkAnsInputFlag = false;
          callback();
        }
      } else {
        caiLoop = caiLoop + 1;
        checkAnsInput(callback);
      }
    } else {
      callback();
    }
  }

  var iaLoop = 0;

  function insertAns(infoid, callback) {
    if (iaLoop < $scope.basicQuestionInSet.length) {
      if ($scope.basicQuestionInSet[iaLoop].bq_type == "1") {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/insertAns.php',
          method: 'POST',
          data: {
            var_answer: $scope.basicAnsInput[iaLoop],
            var_bqid: $scope.basicQuestionInSet[iaLoop].bq_id,
            var_infoid: infoid
          }
        }).then(function(response) {
          iaLoop = iaLoop + 1;
          insertAns(infoid, callback);
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด insertAns ใน basicInfoController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      } else {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/insertAns.php',
          method: 'POST',
          data: {
            var_answer: $scope.basicAnsSelect[iaLoop],
            var_bqid: $scope.basicQuestionInSet[iaLoop].bq_id,
            var_infoid: infoid
          }
        }).then(function(response) {
          iaLoop = iaLoop + 1;
          insertAns(infoid, callback);
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด insertAns ใน basicInfoController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      }
    } else {
      callback();
    }
  }
});