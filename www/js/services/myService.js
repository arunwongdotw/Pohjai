angular.module('starter')
  .service('myService', function() {
    this.configAPI = {
      version: '@testapp v0.0.1',
      webserviceURL: 'http://1did.net/pohjai9/'
    };

    this.appLanguage = {}; // object เก็บภาษา
    this.memberDetailFromLogin = {}; // object เก็บข้อมูล member หลัง Login
    this.questionSetDetail = {}; // object เก็บข้อมูล question set เอาไว้สร้าง question
    this.allQuestionInSet = {}; // object เก็บข้อมูล question ทั้งหมดใน set นั้น ใช้ในหน้า score
    this.inputDialog = {}; // object เก็บข้อมูล input จาก input dialog
    this.countScorePerQuestion = {}; // object เก็บ score ทั้งหมดต่อ Question
    this.countScorePerSet = {}; // object เก็บ score ทั้งหมดต่อ Set
    this.chartType = {}; // object เก็บประเภทของกราฟ
    this.questionDetail = {}; // object เก็บข้อมูล question
    this.staffList = {};
  });
