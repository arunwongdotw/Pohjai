// Controller of dashboard.
appControllers.controller('scoreCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog, $ionicSlideBoxDelegate) {
  $scope.appLanguage = {};
  $scope.memberSetting = {};
  $scope.comment = {};
  $scope.score = {};
  $scope.allQuestionInSet = myService.allQuestionInSet;
  // 2 บรรทัดด้านล่างใช้ทดสอบกับ ionic serve
  // $scope.appLanguageID = "1";
  // getAppLanguage();

  // ถ้าทดสอบกับ ionic serve ให้ปิด if
  if (typeof window.localStorage.appLanguageID == 'undefined') {
    $scope.mdSelectValue = "1";
    $scope.appLanguageID = "1";
    getAppLanguage();
  } else if ((window.localStorage.appLanguageID != "") || (window.localStorage.appLanguageID != null)) {
    $scope.appLanguageID = window.localStorage.appLanguageID;
    getAppLanguage();
  } else {
    $scope.mdSelectValue = "1";
    $scope.appLanguageID = "1";
    getAppLanguage();
  }

  $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberDetail.php?memberUsername=' + window.localStorage.memberUsername)
    .then(function(response) {
      $scope.memberID = response.data.results[0].member_id;
      getMemberSetting();
    }, function(error) {
      console.log(error);
    });

  function getAppLanguage() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getAppLanguage.php?appLanguageID=' + $scope.appLanguageID)
      .then(function(response) {
        $scope.appLanguage = response.data.results[0];
      }, function(error) {
        console.log(error);
      });
  }

  function getMemberSetting() {
    // console.log($scope.memberID);
    // console.log(myService.questionSetDetail.question_set_id);
    $http.get(myService.configAPI.webserviceURL + 'webservices/getMemberSettingCaseScore.php?memberID=' + $scope.memberID + '&questionSetID=' + myService.questionSetDetail.question_set_id)
      .then(function(response) {
        if (response.data.results != null) {
          $scope.memberSetting = response.data.results[0];
        } else {
          $scope.memberSetting.member_setting_template = "1";
          $scope.memberSetting.member_setting_order = "1";
          $scope.memberSetting.member_setting_color = "1";
          $scope.memberSetting.question_set_number_btn = "1";
          $scope.memberSetting.question_set_form = "1";
          $scope.memberSetting.question_set_comment = "1";
        }
      }, function(error) {
        console.log(error);
      });
  }

  // navigateTo is for navigate to other page
  // by using targetPage to be the destination state.
  // Parameter :
  // stateNames = target state to go.
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
  }; // End of navigateTo.

  $scope.btnBack = function() {
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
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            navigator.app.backHistory();
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
            title: "Back ?",
            content: "Do you want to back ?",
            inputplaceholder: "Fill password for confirm",
            ok: "Confirm",
            cancel: "Cancel"
          }
        }
      }).then(function() {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/confirmPassword.php',
          method: 'POST',
          data: {
            var_memberid: myService.memberDetailFromLogin.member_id,
            var_password: myService.inputDialog.password
          }
        }).then(function(response) {
          if (response.data.results == 'confirmPassword_success') {
            navigator.app.backHistory();
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

  $scope.giveScore = function(questionID, score, index) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/giveScore.php',
      method: 'POST',
      data: {
        var_questionid: questionID,
        var_score: score,
        var_type: 1
      }
    }).then(function(response) {
      if ((index + 1) < $scope.allQuestionInSet.length) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ให้คะแนนหัวข้อสำเร็จ !",
                content: "คุณได้ให้คะแนนหัวข้อแบบประเมินสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function() {
            $ionicSlideBoxDelegate.next();
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Rating Successfully !",
                content: "You rated topic successfully.",
                ok: "Confirm"
              }
            }
          }).then(function() {
            $ionicSlideBoxDelegate.next();
          });
        }
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ให้คะแนนหัวข้อสำเร็จ !",
                content: "คุณได้ให้คะแนนหัวข้อแบบประเมินสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function() {
            if ($scope.memberSetting.question_set_comment == 1) {
              $ionicSlideBoxDelegate.next();
            } else {
              $state.go('menu2.scorecomplete');
            }
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Rating Successfully !",
                content: "You rated topic successfully.",
                ok: "Confirm"
              }
            }
          }).then(function() {
            if ($scope.memberSetting.question_set_comment == 1) {
              $ionicSlideBoxDelegate.next();
            } else {
              $state.go('menu2.scorecomplete');
            }
          });
        }
      }
    }, function(error) {
      console.log(error);
    });
  };

  $scope.btnComment = function() {
    if (($scope.comment.commentDetail != null) && ($scope.comment.commentDetail != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/giveComment.php',
        method: 'POST',
        data: {
          var_questionsetid: myService.questionSetDetail.question_set_id,
          var_commentdetail: $scope.comment.commentDetail
        }
      }).then(function(response) {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ให้ข้อเสนอแนะเพิ่มเติมสำเร็จ !",
                content: "คุณได้ให้ข้อเสนอแนะเพิ่มเติมสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function() {
            $state.go('menu2.scorecomplete');
          });
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "Comment Successfully !",
                content: "You given your comment successfully.",
                ok: "Confirm"
              }
            }
          }).then(function() {
            $state.go('menu2.scorecomplete');
          });
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
              title: "รายละเอียดข้อเสนอแนะไม่ถูกต้อง !",
              content: "กรุณากรอกรายละเอียดข้อเสนอแนะตามรูปแบบที่กำหนด",
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
              title: "Invalid Comment Detail !",
              content: "Please fill comment detail in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };

  $scope.btnGiveScoreByForm = function() {
    checkCheckBoxSelected(function(status) {
      if ($scope.checkBoxFlagArray.length == $scope.allQuestionInSet.length) {
        if ($scope.memberSetting.question_set_comment == 1) {
          if (($scope.comment.commentDetail != null) && ($scope.comment.commentDetail != "")) {
            getRating(function(status) {});
            addScoreToDB(function(status) {});
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/giveComment.php',
              method: 'POST',
              data: {
                var_questionsetid: myService.questionSetDetail.question_set_id,
                var_commentdetail: $scope.comment.commentDetail
              }
            }).then(function(response) {
              if ($scope.appLanguageID == "1") {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "ทำแบบประเมินสำเร็จ !",
                      content: "คุณได้ทำแบบประเมินสำเร็จ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function() {
                  $state.go('menu2.scorecomplete');
                });
              } else {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "Rating Form Successfully !",
                      content: "You rated form successfully.",
                      ok: "Confirm"
                    }
                  }
                }).then(function() {
                  $state.go('menu2.scorecomplete');
                });
              }
            });
          } else {
            if ($scope.appLanguageID == "1") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รายละเอียดข้อเสนอแนะไม่ถูกต้อง !",
                    content: "กรุณากรอกรายละเอียดข้อเสนอแนะตามรูปแบบที่กำหนด",
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
                    title: "Invalid Comment Detail !",
                    content: "Please fill comment detail in the form provided.",
                    ok: "Confirm"
                  }
                }
              });
            }
          }
        } else {
          getRating(function(status) {});
          addScoreToDB(function(status) {});
          if ($scope.appLanguageID == "1") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ทำแบบประเมินสำเร็จ !",
                  content: "คุณได้ทำแบบประเมินสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function() {
              $state.go('menu2.scorecomplete');
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "Rating Form Successfully !",
                  content: "You rated form successfully.",
                  ok: "Confirm"
                }
              }
            }).then(function() {
              $state.go('menu2.scorecomplete');
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
                title: "การประเมินผิดพลาด !",
                content: "กรุณาประเมินแบบประเมินให้ครบทุกหัวข้อ",
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
                title: "Invalid Rate !",
                content: "Please rate all topic in satisfaction form.",
                ok: "Confirm"
              }
            }
          });
        }
      }
    });
  }

  function checkCheckBoxSelected(callback) {
    $scope.checkBoxFlagArray = [];
    for (var i = 0; i < $scope.allQuestionInSet.length; i++) {
      if ($scope.memberSetting.question_set_number_btn == 1) {
        for (var j = 2; j <= 5; j++) {
          var chkbID = "chkb" + $scope.allQuestionInSet[i].question_id + j;
          var checkBoxBoolean = document.getElementById(chkbID).checked;
          if (checkBoxBoolean == true) {
            $scope.checkBoxFlagArray.push(true);
          }
        }
      } else {
        for (var j = 1; j <= 5; j++) {
          var chkbID = "chkb" + $scope.allQuestionInSet[i].question_id + j;
          var checkBoxBoolean = document.getElementById(chkbID).checked;
          if (checkBoxBoolean == true) {
            $scope.checkBoxFlagArray.push(true);
          }
        }
      }
    }
    callback($scope.checkBoxFlagArray);
  }

  function addScoreToDB(callback) {
    for (var i = 0; i < $scope.allQuestionInSet.length; i++) {
      for (var j = 0; j < $scope.scoreArray.length; j++) {
        if ($scope.allQuestionInSet[i].question_id == $scope.scoreArray[j].question_id) {
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/giveScoreInForm.php',
            method: 'POST',
            data: {
              var_score: $scope.scoreArray[j].rating,
              var_type: 2,
              var_questionsetid: $scope.allQuestionInSet[i].question_id,
            }
          });
        }
      }
    }
    callback();
  }

  function getRating(callback) {
    $scope.scoreArray = [];
    for (var i = 0; i < $scope.allQuestionInSet.length; i++) {
      if ($scope.memberSetting.question_set_number_btn == 1) {
        for (var j = 2; j <= 5; j++) {
          var chkbID = "chkb" + $scope.allQuestionInSet[i].question_id + j;
          var checkBoxBoolean = document.getElementById(chkbID).checked;
          if (checkBoxBoolean == true) {
            var score = document.getElementById(chkbID).value;
            var obj = {
              question_id: $scope.allQuestionInSet[i].question_id,
              rating: score
            };
            $scope.scoreArray.push(obj);
          }
        }
      } else {
        for (var j = 1; j <= 5; j++) {
          var chkbID = "chkb" + $scope.allQuestionInSet[i].question_id + j;
          var checkBoxBoolean = document.getElementById(chkbID).checked;
          if (checkBoxBoolean == true) {
            var score = document.getElementById(chkbID).value;
            var obj = {
              question_id: $scope.allQuestionInSet[i].question_id,
              rating: score
            };
            $scope.scoreArray.push(obj);
          }
        }
      }
      callback($scope.scoreArray);
    }
  }

  $scope.disCheckOtherBox = function(questionid, index, score) {
    if ($scope.memberSetting.question_set_number_btn == 1) {
      if (index == 2) {
        var chkbID1 = "chkb" + questionid + (index + 1);
        var chkbID2 = "chkb" + questionid + (index + 2);
        var chkbID3 = "chkb" + questionid + (index + 3);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
      } else if (index == 3) {
        var chkbID1 = "chkb" + questionid + (index - 1);
        var chkbID2 = "chkb" + questionid + (index + 1);
        var chkbID3 = "chkb" + questionid + (index + 2);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
      } else if (index == 4) {
        var chkbID1 = "chkb" + questionid + (index - 2);
        var chkbID2 = "chkb" + questionid + (index - 1);
        var chkbID3 = "chkb" + questionid + (index + 1);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
      } else if (index == 5) {
        var chkbID1 = "chkb" + questionid + (index - 3);
        var chkbID2 = "chkb" + questionid + (index - 2);
        var chkbID3 = "chkb" + questionid + (index - 1);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
      }
    } else {
      if (index == 1) {
        var chkbID1 = "chkb" + questionid + (index + 1);
        var chkbID2 = "chkb" + questionid + (index + 2);
        var chkbID3 = "chkb" + questionid + (index + 3);
        var chkbID4 = "chkb" + questionid + (index + 4);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
        var checkbox4 = document.getElementById(chkbID4).checked = false;
      } else if (index == 2) {
        var chkbID1 = "chkb" + questionid + (index - 1);
        var chkbID2 = "chkb" + questionid + (index + 1);
        var chkbID3 = "chkb" + questionid + (index + 2);
        var chkbID4 = "chkb" + questionid + (index + 3);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
        var checkbox4 = document.getElementById(chkbID4).checked = false;
      } else if (index == 3) {
        var chkbID1 = "chkb" + questionid + (index - 2);
        var chkbID2 = "chkb" + questionid + (index - 1);
        var chkbID3 = "chkb" + questionid + (index + 1);
        var chkbID4 = "chkb" + questionid + (index + 2);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
        var checkbox4 = document.getElementById(chkbID4).checked = false;
      } else if (index == 4) {
        var chkbID1 = "chkb" + questionid + (index - 3);
        var chkbID2 = "chkb" + questionid + (index - 2);
        var chkbID3 = "chkb" + questionid + (index - 1);
        var chkbID4 = "chkb" + questionid + (index + 1);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
        var checkbox4 = document.getElementById(chkbID4).checked = false;
      } else if (index == 5) {
        var chkbID1 = "chkb" + questionid + (index - 4);
        var chkbID2 = "chkb" + questionid + (index - 3);
        var chkbID3 = "chkb" + questionid + (index - 2);
        var chkbID4 = "chkb" + questionid + (index - 1);
        var checkbox1 = document.getElementById(chkbID1).checked = false;
        var checkbox2 = document.getElementById(chkbID2).checked = false;
        var checkbox3 = document.getElementById(chkbID3).checked = false;
        var checkbox4 = document.getElementById(chkbID4).checked = false;
      }
    }
  }
}); // End of dashboard controller.
