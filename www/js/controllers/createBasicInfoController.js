appControllers.controller('createBasicInfoCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog) {
  $scope.appLanguage = {};
  $scope.checkBox = {};
  $scope.basicInfo = {};
  $scope.basicType = {};
  $scope.basicQuestion = {};
  $scope.basicAns = {};
  var arrayOfFlag = [];
  $scope.numberBasicQuestion = myService.memberDetailFromLogin.member_no_basic_question;
  $scope.numberAnswer = myService.memberDetailFromLogin.member_no_ans;
  $scope.questionSetID = myService.questionSetID;

  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setBasicInfoValue();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
    setBasicInfoValue();
  } else {
    $scope.appLanguageID = "1";
    getAppLanguage();
    setBasicInfoValue();
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

  function setBasicInfoValue() {
    $scope.basicInfo.name = 0;
    $scope.basicInfo.age = 0;
    $scope.basicInfo.sex = 0;
    $scope.basicInfo.education = 0;
    $scope.basicInfo.salary = 0;
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

  $scope.setName = function() {
    if ($scope.checkBox.name == true) {
      $scope.basicInfo.name = 0;
    } else {
      $scope.basicInfo.name = 1;
    }
  };

  $scope.setAge = function() {
    if ($scope.checkBox.age == true) {
      $scope.basicInfo.age = 0;
    } else {
      $scope.basicInfo.age = 1;
    }
  };

  $scope.setSex = function() {
    if ($scope.checkBox.sex == true) {
      $scope.basicInfo.sex = 0;
    } else {
      $scope.basicInfo.sex = 1;
    }
  };

  $scope.setEducation = function() {
    if ($scope.checkBox.education == true) {
      $scope.basicInfo.education = 0;
    } else {
      $scope.basicInfo.education = 1;
    }
  };

  $scope.setSalary = function() {
    if ($scope.checkBox.salary == true) {
      $scope.basicInfo.salary = 0;
    } else {
      $scope.basicInfo.salary = 1;
    }
  };

  $scope.setInput = function(index) {
    $scope.checkBox.select[index] = false;
    if ($scope.checkBox.input[index] == true) {
      delete $scope.basicType[index];
    } else {
      $scope.basicType[index] = 1;
    }
  };

  $scope.setSelect = function(index) {
    $scope.checkBox.input[index] = false;
    if ($scope.checkBox.select[index] == true) {
      delete $scope.basicType[index];
    } else {
      $scope.basicType[index] = 2;
    }
  };

  $scope.getNumberBasicQuestion = function(noBasicQuestion) {
    var numberBasicQuestion = [];
    for (var i = 0; i < noBasicQuestion; i++) {
      numberBasicQuestion.push(i);
    }
    return numberBasicQuestion;
  };

  $scope.getNumberAns = function(noAns) {
    var numberAnswer = [];
    for (var i = 0; i < noAns; i++) {
      numberAnswer.push(i);
    }
    return numberAnswer;
  };

  $scope.btnCreateBasicInfo = function() {
    checkChecked();
    if ($scope.checkedFlag == false) {
      if ($scope.appLanguageID == "1") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "แบบสอบถามข้อมูลเบื้องต้นไม่ถูกต้อง !",
              content: "กรุณาเลือกแบบสอบถามข้อมูลเบื้องต้นอย่างน้อย 1 ข้อ จาก 5 ข้อ",
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
              title: "Invalid Basic Information Question !",
              content: "Please select basic information question at least 1 of 5.",
              ok: "Confirm"
            }
          }
        });
      }
    } else {
      if (Object.keys($scope.basicQuestion).length !== 0) {
        i = 0;
        j = 0;
        arrayOfFlag = [];
        insertBasicQuestion(function(status) {});
      } else {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/insertBasicInfo.php',
          method: 'POST',
          data: {
            var_name: $scope.basicInfo.name,
            var_age: $scope.basicInfo.age,
            var_sex: $scope.basicInfo.sex,
            var_education: $scope.basicInfo.education,
            var_salary: $scope.basicInfo.salary,
            var_questionsetid: $scope.questionSetID
          }
        }).then(function(response) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "สร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ !",
                  content: "คุณสร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              $state.go('menu2.questionmanagement');
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Create Successfully !",
                  content: "You created basic information question successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function(response) {
              $state.go('menu2.questionmanagement');
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnCreateBasicInfo ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      }
    }
  };

  function checkChecked() {
    $scope.checkedFlag = false;
    if ($scope.basicInfo.name == 1) {
      $scope.checkedFlag = true;
    } else if ($scope.basicInfo.age == 1) {
      $scope.checkedFlag = true;
    } else if ($scope.basicInfo.sex == 1) {
      $scope.checkedFlag = true;
    } else if ($scope.basicInfo.education == 1) {
      $scope.checkedFlag = true;
    } else if ($scope.basicInfo.salary == 1) {
      $scope.checkedFlag = true;
    }
  }

  var i = 0;
  var j = 0;
  var qFlag = 0;

  function insertBasicQuestion(callback) {
    if (i < $scope.numberBasicQuestion) {
      if (($scope.basicQuestion.question[i] != null) && ($scope.basicQuestion.question[i] != "")) {
        arrayOfFlag.push("1");
        if (typeof $scope.basicType[i] == 'undefined') {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ประเภทคำตอบไม่ถูกต้อง !",
                  content: "กรุณาเลือกประเภทคำตอบในคำถามข้อ " + (i + 1),
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
                  title: "Invalid Answer Type !",
                  content: "Please select one of answer type.",
                  ok: "Confirm"
                }
              }
            });
          }
        } else if ($scope.basicType[i] == 1) {
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/insertBasicQuestion.php',
            method: 'POST',
            data: {
              var_question: $scope.basicQuestion.question[i],
              var_type: $scope.basicType[i],
              var_questionsetid: $scope.questionSetID
            }
          }).then(function(response) {
            i = i + 1;
            insertBasicQuestion(callback);
          }, function(error) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เกิดข้อผิดพลาด !",
                  content: "เกิดข้อผิดพลาด insertBasicQuestion ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              ionic.Platform.exitApp();
            });
          });
        } else if ($scope.basicType[i] == 2) {
          checkNoAnswer(i);
          if ($scope.answerFlag == true) {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/insertBasicQuestion.php',
              method: 'POST',
              data: {
                var_question: $scope.basicQuestion.question[i],
                var_type: $scope.basicType[i],
                var_questionsetid: $scope.questionSetID
              }
            }).then(function(response) {
              var bqid = response.data.results;
              j = 0;
              insertBasicQuestionAns(bqid, i, function(status) {
                i = i + 1;
                insertBasicQuestion(callback);
              });
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด insertBasicQuestion ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
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
                    title: "คำตอบแบบสอบถามข้อมูลเบื้องต้นไม่ถูกต้อง !",
                    content: "กรุณากรอกคำตอบของแบบสอบถามข้อมูลเบื้องต้น",
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
                    content: "Please fill answer of basic information question.",
                    ok: "Confirm"
                  }
                }
              });
            }
          }
        }
      } else {
        arrayOfFlag.push("0");
        i = i + 1;
        insertBasicQuestion(callback);
      }
    } else {
      qFlag = checkNoQuestion();
      if (qFlag === false) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/insertBasicInfo.php',
          method: 'POST',
          data: {
            var_name: $scope.basicInfo.name,
            var_age: $scope.basicInfo.age,
            var_sex: $scope.basicInfo.sex,
            var_education: $scope.basicInfo.education,
            var_salary: $scope.basicInfo.salary,
            var_questionsetid: $scope.questionSetID
          }
        }).then(function(response) {
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "สร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ !",
                  content: "คุณสร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              $state.go('menu2.questionmanagement');
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Create Successfully !",
                  content: "You created basic information question successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function(response) {
              $state.go('menu2.questionmanagement');
            });
          }
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnCreateBasicInfo ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
      }
    }
  }

  function checkNoQuestion() {
    for (var iloop = 0; iloop < arrayOfFlag.length; iloop++) {
      if (arrayOfFlag[iloop] == "1") {
        return true;
      }
    }
    return false;
  }

  function checkNoAnswer(i) {
    if (Object.keys($scope.basicAns).length !== 0) {
      for (var iloop = 0; iloop < $scope.numberAnswer; iloop++) {
        if (($scope.basicAns.ans[i][iloop] != null) && ($scope.basicAns.ans[i][iloop] != "")) {
          $scope.answerFlag = true;
          return;
        } else {
          $scope.answerFlag = false;
        }
      }
    } else {
      $scope.answerFlag = false;
    }
  }

  function insertBasicQuestionAns(bqid, basicQuestionNo, callback) {
    if (j < $scope.numberAnswer) {
      if (Object.keys($scope.basicAns).length !== 0) {
        if (($scope.basicAns.ans[basicQuestionNo][j] != null) && ($scope.basicAns.ans[basicQuestionNo][j] != "")) {
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/insertBasicQuestionAnswer.php',
            method: 'POST',
            data: {
              var_ans: $scope.basicAns.ans[basicQuestionNo][j],
              var_bqid: bqid
            }
          }).then(function(response) {
            j = j + 1;
            insertBasicQuestionAns(bqid, basicQuestionNo, callback);
          }, function(error) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เกิดข้อผิดพลาด !",
                  content: "เกิดข้อผิดพลาด insertBasicQuestionAns ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              ionic.Platform.exitApp();
            });
          });
        } else {
          j = j + 1;
          insertBasicQuestionAns(bqid, basicQuestionNo, callback);
        }
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "คำตอบแบบสอบถามข้อมูลเบื้องต้นไม่ถูกต้อง !",
                content: "กรุณากรอกคำตอบของแบบสอบถามข้อมูลเบื้องต้น",
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
                content: "Please fill answer of basic information question.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    } else {
      insertBasicInfo();
    }
  }

  function insertBasicInfo() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/insertBasicInfo.php',
      method: 'POST',
      data: {
        var_name: $scope.basicInfo.name,
        var_age: $scope.basicInfo.age,
        var_sex: $scope.basicInfo.sex,
        var_education: $scope.basicInfo.education,
        var_salary: $scope.basicInfo.salary,
        var_questionsetid: $scope.questionSetID
      }
    }).then(function(response) {
      if ($scope.appLanguageID == "1") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "สร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ !",
              content: "คุณสร้างแบบสอบถามข้อมูลเบื้องต้นสำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('menu2.questionmanagement');
        });
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "Create Successfully !",
              content: "You created basic information question successfully.",
              ok: "Confirm"
            }
          }
        }).then(function(response) {
          $state.go('menu2.questionmanagement');
        });
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnCreateBasicInfo ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  $scope.btnBack = function() {
    if ($scope.appLanguageID == "1") {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "แน่ใจที่จะย้อนกลับ ?",
            content: "คุณแน่ใจที่จะย้อนกลับ ? ระบบจะลบชุดแบบประเมินนี้อัตโนมัติ",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSetInCaseBack.php',
          method: 'POST',
          data: {
            var_questionsetid: $scope.questionSetID
          }
        }).then(function(response) {
          $state.go('menu2.questionmanagement');
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnBack ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
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
            title: "Back ?",
            content: "Are you sure to back ? System will automatically delete this satisfaction form.",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function(response) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/deleteQuestionSetInCaseBack.php',
          method: 'POST',
          data: {
            var_questionsetid: $scope.questionSetID
          }
        }).then(function(response) {
          $state.go('menu2.questionmanagement');
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnBack ใน createBasicInfoController ระบบจะปิดอัตโนมัติ",
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
});
