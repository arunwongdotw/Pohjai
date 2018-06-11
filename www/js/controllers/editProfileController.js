appControllers.controller('editProfileCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog, $cordovaFileTransfer, $cordovaCamera) {
  $scope.editProfile = myService.memberDetailFromLogin;
  $scope.randomNumber = Math.random();
  $scope.editProfile.profile = 'http://1did.net/pohjai9/img/img_profile/' + myService.memberDetailFromLogin.member_username + '.jpg?random=' + $scope.randomNumber;

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
              content: "เกิดข้อผิดพลาด btnEditProfilePickPicture ใน editProfileController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnEditProfilePickPicture = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options)
      .then(function(imageURI) {
        var image = document.getElementById('edit-profile-picture');
        image.src = imageURI;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnEditProfilePickPicture ใน editProfileController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.btnEditProfile = function() {
    var checkEnglishNumberRegEx = /^[0-9a-zA-Z]+$/;
    var checkNumberRegEx = /^[0-9]+$/;
    if (($scope.editProfile.member_company != null) && ($scope.editProfile.member_company != "")) {
      if (($scope.editProfile.member_contact != null) && ($scope.editProfile.member_contact != "")) {
        if (($scope.editProfile.member_phone_number != null) && ($scope.editProfile.member_phone_number != "")) {
          if (checkNumberRegEx.test($scope.editProfile.member_phone_number)) {
            if (($scope.editProfile.member_email != null) && ($scope.editProfile.member_email != "")) {
              var img = document.getElementById('edit-profile-picture');
              var imageURI = img.src;
              var server = myService.configAPI.webserviceURL + 'webservices/uploadMemberPic.php?username=' + $scope.editProfile.member_username;
              var trustHosts = true;
              var options2 = {
                fileKey: "myCameraImg",
                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                chunkedMode: false
              };
              $cordovaFileTransfer.upload(server, imageURI, options2);
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/updateMember.php',
                method: 'POST',
                data: {
                  var_memberid: $scope.editProfile.member_id,
                  var_company: $scope.editProfile.member_company,
                  var_address: $scope.editProfile.member_address,
                  var_contact: $scope.editProfile.member_contact,
                  var_phonenumber: $scope.editProfile.member_phone_number,
                  var_email: $scope.editProfile.member_email,
                  var_line: $scope.editProfile.member_line
                }
              }).then(function(response) {
                myService.memberDetailFromLogin = response.data.results[0];
                if ($scope.appLanguageID == "1") {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "แก้ไขข้อมูลส่วนตัวสำเร็จ !",
                        content: "คุณแก้ไขข้อมูลส่วนตัวสำเร็จ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    $state.go('menu2.question');
                  });
                } else {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "Edit Profile Successfully",
                        content: "You edited profile successfully.",
                        ok: "Confirm"
                      }
                    }
                  }).then(function(response) {
                    $state.go('menu2.question');
                  });
                }
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btnEditProfile ใน editProfileController ระบบจะปิดอัตโนมัติ",
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
                      title: "อีเมลไม่ถูกต้อง !",
                      content: "กรุณากรอกอีเมลให้ถูกต้องตามรูปแบบที่กำหนด",
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
                      title: "Invalid Email !",
                      content: "Please fill email in the form provided.",
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
                    title: "หมายเลขโทรศัพท์ไม่ถูกต้อง !",
                    content: "หมายเลขโทรศัพท์ต้องเป็นตัวเลขเท่านั้น",
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
                    title: "Invalid Phone Number !",
                    content: "Phone number shoule be number.",
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
                  title: "หมายเลขโทรศัพท์ไม่ถูกต้อง !",
                  content: "กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้องตามรูปแบบที่กำหนด",
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
                  title: "Invalid Phone Number !",
                  content: "Please fill phone number in the form provided.",
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
                title: "ชื่อผู้ติดต่อไม่ถูกต้อง !",
                content: "กรุณากรอกชื่อผู้ติดต่อให้ถูกต้องตามรูปแบบที่กำหนด",
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
                title: "Invalid Contact !",
                content: "Please fill contact in the form provided.",
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
              title: "ชื่อบริษัทไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อบริษัทให้ถูกต้องตามรูปแบบที่กำหนด",
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
              title: "Invalid Company Name !",
              content: "Please fill company name in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };

  $scope.btnSignUp = function() {
    var checkEnglishNumberRegEx = /^[0-9a-zA-Z]+$/;
    if (($scope.signup.username != null) && ($scope.signup.username != "")) {
      if (checkEnglishNumberRegEx.test($scope.signup.username)) {
        if (($scope.signup.password != null) && ($scope.signup.password != "")) {
          if (checkEnglishNumberRegEx.test($scope.signup.password)) {
            if ($scope.signup.password == $scope.signup.confirmpassword) {
              if (($scope.signup.company != null) && ($scope.signup.company != "")) {
                var img = document.getElementById('sign-up-picture');
                var imageURI = img.src;
                var server = myService.configAPI.webserviceURL + 'webservices/uploadMemberPic.php?username=' + $scope.signup.username;
                var trustHosts = true;
                var options2 = {
                  fileKey: "myCameraImg",
                  fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                  mimeType: "image/jpeg",
                  chunkedMode: false
                };
                $cordovaFileTransfer.upload(server, imageURI, options2);
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/signUpMember.php',
                  method: 'POST',
                  data: {
                    var_username: $scope.signup.username,
                    var_password: $scope.signup.password,
                    var_company: $scope.signup.company,
                    var_template: "1",
                    var_color: "1",
                    var_numberBtn: "5",
                    var_numberStaff: "5"
                  }
                }).then(function(response) {
                  if (response.data.results == 'duplicate_username') {
                    if ($scope.appLanguageID == "1") {
                      $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        locals: {
                          displayOption: {
                            title: "ชื่อผู้ใช้ (Username) ไม่ถูกต้อง !",
                            content: "พบชื่อผู้ใช้ (Username) มีอยู่ในระบบแล้ว กรุณาเปลี่ยนชื่อผู้ใช้",
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
                            title: "Invalid Username !",
                            content: "Found username in the system, please change username.",
                            ok: "Confirm"
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
                            title: "สมัครสมาชิกสำเร็จ !",
                            content: "คุณสมัครสมาชิกสำเร็จ",
                            ok: "ตกลง"
                          }
                        }
                      }).then(function(response) {
                        window.localStorage.memberUsername = $scope.signup.username;
                        $state.go('menu2.question');
                      });
                    } else {
                      $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        locals: {
                          displayOption: {
                            title: "Register Successfully",
                            content: "You registered successfully.",
                            ok: "Confirm"
                          }
                        }
                      }).then(function(response) {
                        window.localStorage.memberUsername = $scope.signup.username;
                        $state.go('menu2.question');
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
                        content: "เกิดข้อผิดพลาด btnSignUp ใน signUpController ระบบจะปิดอัตโนมัติ",
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
                        title: "ชื่อบริษัทไม่ถูกต้อง !",
                        content: "กรุณากรอกชื่อบริษัทให้ถูกต้องตามรูปแบบที่กำหนด",
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
                        title: "Invalid Company Name !",
                        content: "Please fill company name in the form provided.",
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
                      title: "ยืนยันรหัสผ่านไม่ถูกต้อง !",
                      content: "กรุณากรอกยืนยันรหัสผ่านให้ตรงกับรหัสผ่าน (Password)",
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
                      title: "Invalid Confirm Password !",
                      content: "Please fill confirm password same as password.",
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
                    title: "รหัสผ่าน (Password) ไม่ถูกต้อง !",
                    content: "รหัสผ่าน (Password) ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
                    title: "Invalid Password !",
                    content: "Password must be in English and numeric.",
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
                  title: "รหัสผ่าน (Password) ไม่ถูกต้อง !",
                  content: "กรุณากรอกรหัสผ่าน (Password) ตามรูปแบบที่กำหนด",
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
                  title: "Invalid Password !",
                  content: "Please fill password in the form provided.",
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
                title: "ชื่อผู้ใช้ (Username) ไม่ถูกต้อง !",
                content: "ชื่อผู้ใช้ (Username) ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
                title: "Invalid Username !",
                content: "Username must be in English and numeric.",
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
              title: "ชื่อผู้ใช้ (Username) ไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อผู้ใช้ (Username) ตามรูปแบบที่กำหนด",
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
              title: "Invalid Username !",
              content: "Please fill username in the form provided.",
              ok: "Confirm"
            }
          }
        });
      }
    }
  };
});
