//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.

if ((window.localStorage.memberUsername == "") || (window.localStorage.memberUsername == null)) {
  url = "/menu1/home";
  state = "menu1.home";
} else {
  url = "/menu2/question";
  state = "menu2.question";
}

var db = null; //Use for SQLite database.
window.globalVariable = {
    //custom color style variable
    color: {
        appPrimaryColor: "",
        dropboxColor: "#017EE6",
        facebookColor: "#3C5C99",
        foursquareColor: "#F94777",
        googlePlusColor: "#D73D32",
        instagramColor: "#517FA4",
        wordpressColor: "#0087BE"
    },// End custom color style variable
    startPage: {
        url: url,//Url of start page.
        state: state//State name of start page.
    },
    message: {
        errorMessage: "Technical error please try again later." //Default error message.
    },
    oAuth: {
      dropbox: "your_api_key",//Use for Dropbox API clientID.
      facebook: "your_api_key",//Use for Facebook API appID.
      foursquare: "your_api_key", //Use for Foursquare API clientID.
      instagram: "your_api_key",//Use for Instagram API clientID.
      googlePlus: "your_api_key",//Use for Google API clientID.
    },
    adMob: "your_api_key" //Use for AdMob API clientID.
};// End Global variable


angular.module('starter', ['ionic','ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngMaterial', 'ngMessages', 'ngCordova', 'chart.js', 'ionic-datepicker'])
    .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, $ionicPopup) {
        $ionicPlatform.ready(function() {
          if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
              if (typeof window.localStorage.appLanguageID == 'undefined') {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "ไม่มีการเชื่อมต่ออินเทอร์เน็ต !",
                      content: "โทรศัพท์ของคุณยังไม่ได้เชื่อมต่ออินเทอร์เน็ต กรุณาเชื่อมต่ออินเทอร์เน็ตก่อนใช้งาน",
                      ok: "ตกลง"
                    }
                  }
                }).then(function() {
                  ionic.Platform.exitApp();
                });
              } else if (window.localStorage.appLanguageID == 1) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "ไม่มีการเชื่อมต่ออินเทอร์เน็ต !",
                      content: "โทรศัพท์ของคุณยังไม่ได้เชื่อมต่ออินเทอร์เน็ต กรุณาเชื่อมต่ออินเทอร์เน็ตก่อนใช้งาน",
                      ok: "ตกลง"
                    }
                  }
                }).then(function() {
                  ionic.Platform.exitApp();
                });
              } else {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "No Internet Connection !",
                      content: "Your device is not connected internet, please connect internet before.",
                      ok: "ตกลง",
                      cancel: "ยกเลิก"
                    }
                  }
                }).then(function() {
                  ionic.Platform.exitApp();
                });
              }
            }
          }
        });

        //Create database table of contracts by using sqlite database.
        //Table schema :
        //Column	   Type	     Primary key
        //  id	        Integer	    Yes
        //  firstName	Text	    No
        //  lastName	Text	    No
        //  telephone	Text	    No
        //  email	    Text	    No
        //  note	    Text	    No
        //  createDate	DateTime	No
        //  age	        Integer	    No
        //  isEnable	Boolean	    No

        function initialSQLite() {
            db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " +
                "( id           integer primary key   , " +
                "  firstName    text                  , " +
                "  lastName     text                  , " +
                "  telephone    text                  , " +
                "  email        text                  , " +
                "  note         text                  , " +
                "  createDate   dateTime              , " +
                "  age          integer               , " +
                "  isEnable     Boolean)                ");
        };
        // End creating SQLite database table.

        // Create custom defaultStyle.
        function getDefaultStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important; " +
                "   border-style            : none;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom defaultStyle

        // Create custom style for product view.
        function getProductStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : " + appPrimaryColor + " !important;" +
                "   border-style            : none;" +
                "   background-image        : url('img/background_cover_pixels.png') !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        }// End create custom style for product view.

        // Create custom style for contract us view.
        function getContractUsStyle() {
            return "" +
                ".material-background-nav-bar { " +
                "   background-color        : transparent !important;" +
                "   border-style            : none;" +
                "   background-image        : none !important;" +
                "   background-position-y   : 4px !important;" +
                "   background-size         : initial !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                     : " + appPrimaryColor + " !important;" +
                "}";
        } // End create custom style for contract us view.

        // Create custom style for Social Network view.
        function getSocialNetworkStyle(socialColor) {
            return "" +
                ".material-background-nav-bar {" +
                "   background              : " + socialColor + " !important;" +
                "   border-style            : none;" +
                "} " +
                "md-ink-bar {" +
                "   color                   : " + socialColor + " !important;" +
                "   background              : " + socialColor + " !important;" +
                "}" +
                "md-tab-item {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
                "   border-left-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "    border-top-color       : " + socialColor + " !important;" +
                "}" +
                " md-progress-circular.md-warn .md-inner .md-gap {" +
                "   border-top-color        : " + socialColor + " !important;" +
                "   border-bottom-color     : " + socialColor + " !important;" +
                "}" +
                "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
                "  border-right-color       : " + socialColor + " !important;" +
                " }" +
                ".spinner-android {" +
                "   stroke                  : " + socialColor + " !important;" +
                "}" +
                ".md-primary-color {" +
                "   color                   : " + socialColor + " !important;" +
                "}" +
                "a.md-button.md-primary, .md-button.md-primary {" +
                "   color                   : " + socialColor + " !important;" +
                "}";
        }// End create custom style for Social Network view.


        function initialRootScope() {
            $rootScope.appPrimaryColor = appPrimaryColor;// Add value of appPrimaryColor to rootScope for use it to base color.
            $rootScope.isAndroid = ionic.Platform.isAndroid();// Check platform of running device is android or not.
            $rootScope.isIOS = ionic.Platform.isIOS();// Check platform of running device is ios or not.
        };

        function hideActionControl() {
            //For android if user tap hardware back button, Action and Dialog should be hide.
            $mdBottomSheet.cancel();
            $mdDialog.cancel();
        };


        // createCustomStyle will change a style of view while view changing.
        // Parameter :
        // stateName = name of state that going to change for add style of that page.
        function createCustomStyle(stateName) {
            var customStyle =
                ".material-background {" +
                "   background-color          : " + appPrimaryColor + " !important;" +
                "   border-style              : none;" +
                "}" +
                ".spinner-android {" +
                "   stroke                    : " + appPrimaryColor + " !important;" +
                "}";

            switch (stateName) {
                case "app.productList" :
                case "app.productDetail":
                case "app.productCheckout":
                case "app.clothShop" :
                case "app.catalog" :
                    customStyle += getProductStyle();
                    break;
                case "app.dropboxLogin" :
                case "app.dropboxProfile":
                case "app.dropboxFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
                    break;
                case "app.facebookLogin" :
                case "app.facebookProfile":
                case "app.facebookFeed" :
                case "app.facebookFriendList":
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
                    break;
                case "app.foursquareLogin" :
                case "app.foursquareProfile":
                case "app.foursquareFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
                    break;
                case "app.googlePlusLogin" :
                case "app.googlePlusProfile":
                case "app.googlePlusFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
                    break;
                case "app.instagramLogin" :
                case "app.instagramProfile":
                case "app.instagramFeed" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
                    break;
                case "app.wordpressLogin" :
                case "app.wordpressFeed":
                case "app.wordpressPost" :
                    customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
                    break;
                case "app.contractUs":
                    customStyle += getContractUsStyle();
                    break;
                default:
                    customStyle += getDefaultStyle();
                    break;
            }
            return customStyle;
        }// End createCustomStyle

        // Add custom style while initial application.
        $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

        $ionicPlatform.ready(function () {
            ionic.Platform.isFullScreen = true;
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            initialSQLite();
            initialRootScope();

            //Checking if view is changing it will go to this function.
            $rootScope.$on('$ionicView.beforeEnter', function () {
                //hide Action Control for android back button.
                hideActionControl();
                // Add custom style ti view.
                $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
            });
        });

    })

    .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider, $mdColorPalette, $mdIconProvider, ionicDatePickerProvider) {
      var datePickerObj = {
          inputDate: new Date(),
          titleLabel: 'Select a Date',
          setLabel: 'Set',
          todayLabel: 'Today',
          closeLabel: 'Close',
          mondayFirst: false,
          weeksList: ["S", "M", "T", "W", "T", "F", "S"],
          monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
          templateType: 'popup',
          from: new Date(2012, 8, 1),
          to: new Date(2018, 8, 1),
          showTodayButton: true,
          dateFormat: 'dd MMMM yyyy',
          closeOnSelect: false,
          disableWeekdays: []
      };
      ionicDatePickerProvider.configDatePicker(datePickerObj);

        // Use for change ionic spinner to android pattern.
        $ionicConfigProvider.spinner.icon("android");
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // mdIconProvider is function of Angular Material.
        // It use for reference .SVG file and improve performance loading.
        $mdIconProvider
            .icon('facebook', 'img/icons/facebook.svg')
            .icon('twitter', 'img/icons/twitter.svg')
            .icon('mail', 'img/icons/mail.svg')
            .icon('message', 'img/icons/message.svg')
            .icon('share-arrow', 'img/icons/share-arrow.svg')
            .icon('more', 'img/icons/more_vert.svg');

        //mdThemingProvider use for change theme color of Ionic Material Design Application.
        /* You can select color from Material Color List configuration :
         * red
         * pink
         * purple
         * purple
         * deep-purple
         * indigo
         * blue
         * light-blue
         * cyan
         * teal
         * green
         * light-green
         * lime
         * yellow
         * amber
         * orange
         * deep-orange
         * brown
         * grey
         * blue-grey
         */
        //Learn more about material color patten: https://www.materialpalette.com/
        //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction

        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo')
            .accentPalette('red');

        // if (typeof window.localStorage.appColor == 'undefined') {
        //   $mdThemingProvider
        //       .theme('default')
        //       .primaryPalette('indigo')
        //       .accentPalette('red');
        // } else if ((window.localStorage.appColor == "") || (window.localStorage.appColor == null)) {
        //   $mdThemingProvider
        //       .theme('default')
        //       .primaryPalette('indigo')
        //       .accentPalette('red');
        // } else {
        //   $mdThemingProvider
        //       .theme('default')
        //       .primaryPalette(window.localStorage.appColor)
        //       .accentPalette('red');
        // }

        appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

        //$stateProvider is using for add or edit HTML view to navigation bar.
        //
        //Schema :
        //state_name(String)      : Name of state to use in application.
        //page_name(String)       : Name of page to present at localhost url.
        //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
        //html_file_path(String)  : Path of html file.
        //controller_name(String) : Name of Controller.
        //
        //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
        //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
        $stateProvider
            .state('menu1', {
                url: "/menu1",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/not-login-menu.html",
                controller: 'notLoginMenuCtrl'
            })
            .state('menu2', {
                url: "/menu2",
                cache: false,
                reload: true,
                abstract: true,
                templateUrl: "templates/login-menu.html",
                controller: 'loginMenuCtrl'
            })
            .state('menu1.home', {
                url: "/home",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'homeCtrl'
                    }
                }
            })
            .state('menu1.setting', {
              url: "/setting",
              cache: false,
              reload: true,
              views: {
                'menuContent': {
                  templateUrl: "templates/setting.html",
                  controller: 'settingCtrl'
                }
              }
            })
            .state('menu2.setting', {
              url: "/setting",
              cache: false,
              reload: true,
              views: {
                'menuContent': {
                  templateUrl: "templates/setting.html",
                  controller: 'settingCtrl'
                }
              }
            })
            .state('menu1.signup', {
                url: "/signup",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/sign-up.html",
                        controller: 'signUpCtrl'
                    }
                }
            })
            .state('menu2.score', {
                url: "/score",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/score.html",
                        controller: 'scoreCtrl'
                    }
                }
            })
            .state('menu2.question', {
                url: "/question",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/question.html",
                        controller: 'questionCtrl'
                    }
                }
            })
            .state('menu2.createquestionset', {
                url: "/createquestionset",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/create-question-set.html",
                        controller: 'createQuestionSetCtrl'
                    }
                }
            })
            .state('menu2.createquestion', {
                url: "/createquestion",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/create-question.html",
                        controller: 'createQuestionCtrl'
                    }
                }
            })
            .state('menu2.report', {
                url: "/report",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/report.html",
                        controller: 'reportCtrl'
                    }
                }
            })
            .state('menu2.chart', {
                url: "/chart",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/chart.html",
                        controller: 'chartCtrl'
                    }
                }
            })
            .state('menu2.reportselection', {
                url: "/reportselection",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/report-selection.html",
                        controller: 'reportSelectionCtrl'
                    }
                }
            })
            .state('menu2.scorecomplete', {
                url: "/scorecomplete",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/score-complete.html",
                        controller: 'scoreCompleteCtrl'
                    }
                }
            })
            .state('menu2.questionmanagement', {
                url: "/questionmanagement",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/question-management.html",
                        controller: 'questionManagementCtrl'
                    }
                }
            })
            .state('menu2.editquestionset', {
                url: "/editquestionset",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-question-set.html",
                        controller: 'editQuestionSetCtrl'
                    }
                }
            })
            .state('menu2.questionlist', {
                url: "/questionlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/question-list.html",
                        controller: 'questionListCtrl'
                    }
                }
            })
            .state('menu2.editquestion', {
                url: "/editquestion",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-question.html",
                        controller: 'editQuestionCtrl'
                    }
                }
            })
            .state('menu2.stafflistscore', {
                url: "/stafflistscore",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/staff-list-score.html",
                        controller: 'staffListScoreCtrl'
                    }
                }
            })
            .state('menu2.stafflistcomment', {
                url: "/stafflistcomment",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/staff-list-comment.html",
                        controller: 'staffListCommentCtrl'
                    }
                }
            })
            .state('menu2.commentlist', {
                url: "/commentlist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/comment-list.html",
                        controller: 'commentListCtrl'
                    }
                }
            })
            .state('menu2.contactus', {
                url: "/contactus",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/contact-us.html",
                        controller: 'contactUsCtrl'
                    }
                }
            })
            .state('menu2.editprofile', {
                url: "/editprofile",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-profile.html",
                        controller: 'editProfileCtrl'
                    }
                }
            })
            .state('menu2.qrcode', {
                url: "/qrcode",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/qrcode.html",
                        controller: 'qrCodeCtrl'
                    }
                }
            })
            .state('menu2.stafflistqrcode', {
                url: "/stafflistqrcode",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/staff-list-qrcode.html",
                        controller: 'staffListQRCodeCtrl'
                    }
                }
            })
            .state('menu2.stafflist', {
                url: "/stafflist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/staff-list.html",
                        controller: 'staffListCtrl'
                    }
                }
            })
            .state('menu2.editstaff', {
                url: "/editstaff",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit-staff.html",
                        controller: 'editStaffCtrl'
                    }
                }
            })
            .state('menu2.createbasicinfo', {
                url: "/createbasicinfo",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/create-basic-info.html",
                        controller: 'createBasicInfoCtrl'
                    }
                }
            })
            .state('menu2.basicinfo', {
                url: "/basicinfo",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/basic-info.html",
                        controller: 'basicInfoCtrl'
                    }
                }
            })
            .state('menu2.basicchart', {
                url: "/basicchart",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/basic-chart.html",
                        controller: 'basicChartCtrl'
                    }
                }
            })
            .state('menu2.seealllist', {
                url: "/seealllist",
                cache: false,
                reload: true,
                views: {
                    'menuContent': {
                        templateUrl: "templates/see-all-list.html",
                        controller: 'seeAllListCtrl'
                    }
                }
            });// End $stateProvider

        //Use $urlRouterProvider.otherwise(Url);
        $urlRouterProvider.otherwise(window.globalVariable.startPage.url);
    });
