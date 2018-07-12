appControllers.controller('reportSelectionCtrl', function($scope, $timeout, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $http, myService, $ionicNavBarDelegate, ionicDatePicker, ionicTimePicker) {
  $scope.appLanguage = {};
  $scope.currState = $state; // get ค่าชื่อ state
  $scope.mdSelectValueChart = 1;
  $scope.mdSelectValueData = 1;
  $scope.reportSelection = {};
  $scope.questionSetDetail = myService.questionSetDetail;
  $scope.reportSelection.starttime = "00:00";
  $scope.reportSelection.endtime = "00:00";

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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

  var ipObj1 = {
    callback: function(val) { //Mandatory
      // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.reportSelection.startdate = new Date(val + 25200000).toISOString().slice(0, 10).replace('T', ' ');
      $scope.reportSelection.startdatetime = $scope.reportSelection.startdate + ' ' + $scope.reportSelection.starttime;
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
      $scope.reportSelection.enddatetime = $scope.reportSelection.enddate + ' ' + $scope.reportSelection.endtime;
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
        $scope.reportSelection.enddatetime = $scope.reportSelection.enddate + ' ' + $scope.reportSelection.endtime;
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
        $scope.reportSelection.startdatetime = $scope.reportSelection.startdate + ' ' + $scope.reportSelection.starttime;
      },
      from: new Date(2018, 00, 01), //Optional
      to: new Date(year, month, day), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: true, //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };
  }

  var ipObj3 = {
    callback: function(val) { //Mandatory
      var selectedTime = new Date(val * 1000);
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.reportSelection.starttime = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.reportSelection.starttime = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.reportSelection.starttime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.reportSelection.starttime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
      $scope.reportSelection.startdatetime = $scope.reportSelection.startdate + ' ' + $scope.reportSelection.starttime;
    },
    inputTime: 0, //Optional
    format: 24, //Optional
    step: 15, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerStart = function() {
    ionicTimePicker.openTimePicker(ipObj3);
  };

  var ipObj4 = {
    callback: function(val) { //Mandatory
      var selectedTime = new Date(val * 1000);
      if (selectedTime.getUTCHours() < 10) {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.reportSelection.endtime = '0' + selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.reportSelection.endtime = '0' + selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      } else {
        if (selectedTime.getUTCMinutes() < 10) {
          $scope.reportSelection.endtime = selectedTime.getUTCHours() + ':0' + selectedTime.getUTCMinutes();
        } else {
          $scope.reportSelection.endtime = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
        }
      }
      $scope.reportSelection.enddatetime = $scope.reportSelection.enddate + ' ' + $scope.reportSelection.endtime;
    },
    inputTime: 0, //Optional
    format: 24, //Optional
    step: 15, //Optional
    setLabel: 'Set' //Optional
  };

  $scope.openTimePickerEnd = function() {
    ionicTimePicker.openTimePicker(ipObj4);
  };

  $scope.setChart = function(chartID) {
    $scope.mdSelectValueChart = chartID;
  };

  $scope.setData = function(dataID) {
    $scope.mdSelectValueData = dataID;
  };

  $scope.btnChart = function() {
    myService.chartDate.startdatetime = $scope.reportSelection.startdatetime;
    myService.chartDate.enddatetime = $scope.reportSelection.enddatetime;
    if (typeof $scope.reportSelection.startdate != 'undefined') {
      if (typeof $scope.reportSelection.enddate != 'undefined') {
        if ($scope.mdSelectValueData == 1) {
          myService.chartType = $scope.mdSelectValueChart;
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/countToMakeChartPerQuestion.php',
            method: 'POST',
            data: {
              var_questionsetid: myService.questionSetDetail.question_set_id,
              var_startdate: $scope.reportSelection.startdatetime,
              var_enddate: $scope.reportSelection.enddatetime
            }
          }).then(function(response) {
            if (response.data.results != null) {
              myService.countScorePerQuestion = response.data.results;
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/countToMakeChartPerSet.php',
                method: 'POST',
                data: {
                  var_questionsetid: myService.questionSetDetail.question_set_id,
                  var_startdate: $scope.reportSelection.startdatetime,
                  var_enddate: $scope.reportSelection.enddatetime
                }
              }).then(function(response) {
                myService.countScorePerSet = response.data.results;
                $state.go('menu2.chart');
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btnChart ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
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
                      title: "ไม่พบข้อมูล !",
                      content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                      title: "Not Found Data !",
                      content: "Not found data at time that your search, Please try again.",
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
                  content: "เกิดข้อผิดพลาด btnChart ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              ionic.Platform.exitApp();
            });
          });
        } else {
          myService.chartType = $scope.mdSelectValueChart;
          getSetBasicInfo(function(status) {
            if (myService.allBasicFlag.bi_name == "1") {
              getAllName(function(status) {
                if (myService.allBasicFlag.bi_age == "1") {
                  getCountAge(function(status) {
                    if (myService.allBasicFlag.bi_sex == "1") {
                      getCountSex(function(status) {
                        if (myService.allBasicFlag.bi_education == "1") {
                          getCountEducation(function(status) {
                            if (myService.allBasicFlag.bi_salary == "1") {
                              getCountIncome(function(status) {
                                getCountAnsSelect(function(status) {
                                  getAllAnsTypeInput(function(status) {
                                    $state.go('menu2.basicchart');
                                  });
                                });
                              });
                            } else {
                              getCountAnsSelect(function(status) {
                                getAllAnsTypeInput(function(status) {
                                  $state.go('menu2.basicchart');
                                });
                              });
                            }
                          });
                        } else {
                          if (myService.allBasicFlag.bi_salary == "1") {
                            getCountIncome(function(status) {
                              getCountAnsSelect(function(status) {
                                getAllAnsTypeInput(function(status) {
                                  $state.go('menu2.basicchart');
                                });
                              });
                            });
                          } else {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          }
                        }
                      });
                    } else {
                      if (myService.allBasicFlag.bi_education == "1") {
                        getCountEducation(function(status) {
                          if (myService.allBasicFlag.bi_salary == "1") {
                            getCountIncome(function(status) {
                              getCountAnsSelect(function(status) {
                                getAllAnsTypeInput(function(status) {
                                  $state.go('menu2.basicchart');
                                });
                              });
                            });
                          } else {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          }
                        });
                      } else {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      }
                    }
                  });
                } else {
                  if (myService.allBasicFlag.bi_sex == "1") {
                    getCountSex(function(status) {
                      if (myService.allBasicFlag.bi_education == "1") {
                        getCountEducation(function(status) {
                          if (myService.allBasicFlag.bi_salary == "1") {
                            getCountIncome(function(status) {
                              getCountAnsSelect(function(status) {
                                getAllAnsTypeInput(function(status) {
                                  $state.go('menu2.basicchart');
                                });
                              });
                            });
                          } else {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          }
                        });
                      } else {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      }
                    });
                  } else {
                    if (myService.allBasicFlag.bi_education == "1") {
                      getCountEducation(function(status) {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      });
                    } else {
                      if (myService.allBasicFlag.bi_salary == "1") {
                        getCountIncome(function(status) {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        });
                      } else {
                        getCountAnsSelect(function(status) {
                          getAllAnsTypeInput(function(status) {
                            $state.go('menu2.basicchart');
                          });
                        });
                      }
                    }
                  }
                }
              });
            } else {
              if (myService.allBasicFlag.bi_age == "1") {
                getCountAge(function(status) {
                  if (myService.allBasicFlag.bi_sex == "1") {
                    getCountSex(function(status) {
                      if (myService.allBasicFlag.bi_education == "1") {
                        getCountEducation(function(status) {
                          if (myService.allBasicFlag.bi_salary == "1") {
                            getCountIncome(function(status) {
                              getCountAnsSelect(function(status) {
                                getAllAnsTypeInput(function(status) {
                                  $state.go('menu2.basicchart');
                                });
                              });
                            });
                          } else {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          }
                        });
                      } else {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      }
                    });
                  } else {
                    if (myService.allBasicFlag.bi_education == "1") {
                      getCountEducation(function(status) {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      });
                    } else {
                      if (myService.allBasicFlag.bi_salary == "1") {
                        getCountIncome(function(status) {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        });
                      } else {
                        getCountAnsSelect(function(status) {
                          getAllAnsTypeInput(function(status) {
                            $state.go('menu2.basicchart');
                          });
                        });
                      }
                    }
                  }
                });
              } else {
                if (myService.allBasicFlag.bi_sex == "1") {
                  getCountSex(function(status) {
                    if (myService.allBasicFlag.bi_education == "1") {
                      getCountEducation(function(status) {
                        if (myService.allBasicFlag.bi_salary == "1") {
                          getCountIncome(function(status) {
                            getCountAnsSelect(function(status) {
                              getAllAnsTypeInput(function(status) {
                                $state.go('menu2.basicchart');
                              });
                            });
                          });
                        } else {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        }
                      });
                    } else {
                      if (myService.allBasicFlag.bi_salary == "1") {
                        getCountIncome(function(status) {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        });
                      } else {
                        getCountAnsSelect(function(status) {
                          getAllAnsTypeInput(function(status) {
                            $state.go('menu2.basicchart');
                          });
                        });
                      }
                    }
                  });
                } else {
                  if (myService.allBasicFlag.bi_education == "1") {
                    getCountEducation(function(status) {
                      if (myService.allBasicFlag.bi_salary == "1") {
                        getCountIncome(function(status) {
                          getCountAnsSelect(function(status) {
                            getAllAnsTypeInput(function(status) {
                              $state.go('menu2.basicchart');
                            });
                          });
                        });
                      } else {
                        getCountAnsSelect(function(status) {
                          getAllAnsTypeInput(function(status) {
                            $state.go('menu2.basicchart');
                          });
                        });
                      }
                    });
                  } else {
                    if (myService.allBasicFlag.bi_salary == "1") {
                      getCountIncome(function(status) {
                        getCountAnsSelect(function(status) {
                          getAllAnsTypeInput(function(status) {
                            $state.go('menu2.basicchart');
                          });
                        });
                      });
                    } else {
                      getCountAnsSelect(function(status) {
                        getAllAnsTypeInput(function(status) {
                          $state.go('menu2.basicchart');
                        });
                      });
                    }
                  }
                }
              }
            }
          });
        }
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
  };

  function getSetBasicInfo(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getSetBasicFlag.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.allBasicFlag = response.data.results[0];
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getSetBasicInfo ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountAnsSelect(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getCountAnsSelect.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countAnswerTypeSelect = response.data.results; // ถ้าไม่มี type select จะ return null
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountAnsSelect ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountAge(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countAgePerSet.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countAgePerSet = response.data.results;
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountAge ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountSex(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countSexPerSet.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countSexPerSet = response.data.results;
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountSex ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountEducation(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countEducationPerSet.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countEducationPerSet = response.data.results;
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountEducation ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountIncome(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countIncomePerSet.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countIncomePerSet = response.data.results;
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountIncome ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCountIncome(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countIncomePerSet.php',
      method: 'POST',
      data: {
        var_questionsetid: myService.questionSetDetail.question_set_id,
        var_startdate: $scope.reportSelection.startdatetime,
        var_enddate: $scope.reportSelection.enddatetime
      }
    }).then(function(response) {
      if (response.data.results != null) {
        myService.countIncomePerSet = response.data.results;
        callback();
      } else {
        if ($scope.appLanguageID == "1") {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ไม่พบข้อมูล !",
                content: "ไม่พบข้อมูลในช่วงวันเวลาที่คุณค้นหา กรุณาลองใหม่",
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
                title: "Not Found Data !",
                content: "Not found data at time that your search, Please try again.",
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
            content: "เกิดข้อผิดพลาด getCountIncome ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getAllName(callback) {
    // $http({
    //   url: myService.configAPI.webserviceURL + 'webservices/getAllName.php',
    //   method: 'POST',
    //   data: {
    //     var_questionsetid: myService.questionSetDetail.question_set_id,
    //     var_startdate: $scope.reportSelection.startdate,
    //     var_enddate: $scope.reportSelection.enddate
    //   }
    // }).then(function(response) {
    //   myService.allName = response.data.results;
    callback();
    // }, function(error) {
    //   $mdDialog.show({
    //     controller: 'DialogController',
    //     templateUrl: 'confirm-dialog.html',
    //     locals: {
    //       displayOption: {
    //         title: "เกิดข้อผิดพลาด !",
    //         content: "เกิดข้อผิดพลาด getAllName ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
    //         ok: "ตกลง"
    //       }
    //     }
    //   }).then(function(response) {
    //     ionic.Platform.exitApp();
    //   });
    // });
  }

  function getAllAnsTypeInput(callback) {
    // $http({
    //   url: myService.configAPI.webserviceURL + 'webservices/getAllAnsTypeInput.php',
    //   method: 'POST',
    //   data: {
    //     var_questionsetid: myService.questionSetDetail.question_set_id,
    //     var_startdate: $scope.reportSelection.startdate,
    //     var_enddate: $scope.reportSelection.enddate
    //   }
    // }).then(function(response) {
    //   myService.allAnswerTypeInput = response.data.results; // null
    callback();
    // }, function(error) {
    //   $mdDialog.show({
    //     controller: 'DialogController',
    //     templateUrl: 'confirm-dialog.html',
    //     locals: {
    //       displayOption: {
    //         title: "เกิดข้อผิดพลาด !",
    //         content: "เกิดข้อผิดพลาด getAllName ใน reportSelectionController ระบบจะปิดอัตโนมัติ",
    //         ok: "ตกลง"
    //       }
    //     }
    //   }).then(function(response) {
    //     ionic.Platform.exitApp();
    //   });
    // });
  }
});
