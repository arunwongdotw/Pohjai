appControllers.controller('scoreCompleteCtrl', function($scope, $timeout, $state, $stateParams, $ionicHistory, $ionicPlatform, $http, myService, $mdDialog, $cordovaInAppBrowser) {
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
              content: "เกิดข้อผิดพลาด getAppLanguage ใน scoreCompleteController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnBack = function() {
    $scope.navigateTo('menu2.score');
  };

  $scope.openLink = function(ads) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
    if ((ads.advertise_url != "") && (ads.advertise_url != null)) {
      $cordovaInAppBrowser.open('http://' + ads.advertise_url, '_system', options);
    }
  }

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
    $timeout(function() {
      $scope.navigateTo('menu2.score');
    }, 30000);
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
              content: "เกิดข้อผิดพลาด getAllAds ใน scoreCompleteController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function createAdsArray(callback) {
    for (var i = 0; i < 2; i++) {
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
