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
    this.staffList = {}; // object เก็บรายการของ staff ในแต่ละ question set
    this.staffDetail = {}; // object เก็บข้อมูลของ staff
    this.qrCodeName = {}; // object เก็บชื่อรูป QRCode
    this.allStaffInSet = {}; // object เก็บรายการพนักงานไปใช้ edit พนักงาน
    this.questionSetID = {}; // object เก็บ question_set_id เพื่อเอาไว้สร้าง create basic information
    this.basicInfoInSet = {}; // object เก็บ information flag ทั้งหมดเอาไว้ใช้ใน state basic-info
    this.basicQuestionInSet = {}; // object เก็บ basic question ทั้งหมดเอาไว้ใช้ใน state basic-info
    this.basicAnsInQuestion = {}; // object เก็บ basic answer ทั้งหมดเอาไว้ใช้ใน state basic-info
    this.lastInfoID = {}; // object เก็บ info id ไว้ใช้บันทึกลงใน database ในหน้า score
    this.countAgePerSet = {}; // object เก็บ count age ไว้สร้าง chart
    this.countSexPerSet = {}; // object เก็บ count sex ไว้สร้าง chart
    this.countEducationPerSet = {}; // object เก็บ count education ไว้สร้าง chart
    this.countIncomePerSet = {}; // object เก็บ count income ไว้สร้าง chart
    this.allBasicFlag = {}; // object เก็บ flag ของ basic info ไว้เช็ค
    // this.allName = {}; // object เก็บ list ของ name ไว้แสดงในหน้า chart
    // this.allAnswerTypeInput = {}; // object เก็บ list ของ answer ที่เป็นประเภท input ไว้แสดงในหน้า chart
    this.countAnswerTypeSelect = {}; // object เก็บ count ของ answer ที่เป็นประเภท select ไว้สร้าง chart
    this.chartDate = {}; // object เก็บ start date และ end date ในตอนเรียกดู chart
    this.allAns = {};
    this.allName = {};
  });
