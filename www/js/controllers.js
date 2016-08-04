angular.module('starter.controllers', [])


  .controller('CardListCtrl', function ($scope, $state, LocalStorageService, $ionicPopup, $ionicTabsDelegate, typeOfListService, scheduleStatisticService) {

    //初始化变量
    $scope.totalNum = 0;
    $scope.meetingNum = 0;
    $scope.businessNum = 0;
    $scope.travelNum = 0;
    $scope.otherNum = 0;
    //从本地缓存中读取日程数据
    function getScheduleInfoArray() {
      var scheduleInfoArray = LocalStorageService.getScheduleInfoArray();
      if (scheduleInfoArray != null && scheduleInfoArray != undefined && scheduleInfoArray.length > 0) {
        //处理日程数据
        console.log("处理日程数据");
        $scope.scheduleInfos = scheduleInfoArray;
        getScheduleNumFromInfos(scheduleInfoArray);
      } else {
        //没有本地数据，提示用户创建日程
        $scope.scheduleInfos = null;
        console.log("没有本地数据，提示用户创建日程");
        showConfirm();
      }
    }

    //从数据中获取相应类型的数量
    function getScheduleNumFromInfos(scheduleInfoArray) {
      $scope.totalNum = scheduleInfoArray.length;
      var doneNum = 0;
      for (var i = 0; i < scheduleInfoArray.length; i++) {
        switch (scheduleInfoArray[i].scheduleType) {
          case "聚会":
            $scope.meetingNum = $scope.meetingNum + 1;
            break;
          case "商谈":
            $scope.businessNum = $scope.businessNum + 1;
            break;
          case "出行":
            $scope.travelNum = $scope.travelNum + 1;
            break;
          default:
            $scope.otherNum = $scope.otherNum + 1;
            break;
        }
        switch (scheduleInfoArray[i].scheduleState) {
          case "done":
            doneNum = doneNum + 1;
            break;
          default:
            break;
        }
      }
      //设置日程信息的统计结果
      scheduleStatisticService($scope.totalNum, doneNum);
      $scope.$emit("Ctr1NameChange", "halo");
    }

    //通过类型，进入详细的列表查看页面
    $scope.getListByScheduleType = function (index) {
      switch (index) {
        case 1:
          console.log("1div index = ", index);
          break;
        case 2:
          console.log("1div index = ", index);
          break;
        case 3:
          console.log("1div index = ", index);
          break;
        case 4:
          console.log("1div index = ", index);
          break;
        default:
          console.log("1div index = ", index);
          break;
      }
      //设置日程类型的全局变量，从而供list页面读取使用
      typeOfListService(index);
      $ionicTabsDelegate.select(1);
    }
    //  confirm 对话框
    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '温馨提示',
        template: '没有本地日程，是否创建新日程?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          //$ionicTabsDelegate.select(1);
          $state.go('tab.create', {}, {});
        } else {
          console.log('You are not sure');
        }
      });
    };
    getScheduleInfoArray();
    //synchro all item to note by bluetooth
    $scope.synchroToNote = function () {
      console.log("和蓝牙同步");
    }
  })

  .controller('ListCtrl', function ($scope, ContextParseService, getContextEntityAndTag, $state, LocalStorageService, $ionicPopup, $ionicTabsDelegate, typeOfListService) {
    //init some param
    $scope.title = "ALL"
    $scope.isShowDoneButton = true;
    $scope.shouldShowDelete = false;
    //从本地缓存中读取日程数据
    function getScheduleInfoArray() {
      var scheduleInfoArray = LocalStorageService.getScheduleInfoArray();
      if (scheduleInfoArray != null && scheduleInfoArray != undefined && scheduleInfoArray.length > 0) {
        //处理日程数据
        console.log("处理日程数据");
        //根据type，处理数据，提取需要展示的内容
        var typeIndex = typeOfListService(0);
        switch (parseInt(typeIndex.type)) {
          case 1:
            $scope.title = "ALL";
            $scope.scheduleInfos = scheduleInfoArray;
            break;
          case 2:
            $scope.title = "聚会";
            var option = "聚会"
            var newInfos = getScheduleInfosByType(option, scheduleInfoArray);
            if (newInfos != null && newInfos != undefined && newInfos.length > 0) {
              $scope.scheduleInfos = newInfos;
            } else {
              $scope.scheduleInfos = null;
            }
            break;
          case 3:
            $scope.title = "商谈";
            var option = "商谈"
            var newInfos = getScheduleInfosByType(option, scheduleInfoArray);
            if (newInfos != null && newInfos != undefined && newInfos.length > 0) {
              $scope.scheduleInfos = newInfos;
            } else {
              $scope.scheduleInfos = null;
            }
            break;
          case 4:
            $scope.title = "出行";
            var option = "出行"
            var newInfos = getScheduleInfosByType(option, scheduleInfoArray);
            if (newInfos != null && newInfos != undefined && newInfos.length > 0) {
              $scope.scheduleInfos = newInfos;
            } else {
              $scope.scheduleInfos = null;
            }
            break;
          case 5:
            $scope.title = "其他";
            var option = "ALL"
            var newInfos = getScheduleInfosByType(option, scheduleInfoArray);
            if (newInfos != null && newInfos != undefined && newInfos.length > 0) {
              $scope.scheduleInfos = newInfos;
            } else {
              $scope.scheduleInfos = null;
            }
            break;
          default:
            $scope.title = "ALL";
            $scope.scheduleInfos = scheduleInfoArray;
            break;
        }
      } else {
        //没有本地数据，提示用户创建日程
        $scope.scheduleInfos = null;
        console.log("没有本地数据，提示用户创建日程");
        showConfirm();
      }
    }

//根据类型不同，筛选出相应的日程信息
    function getScheduleInfosByType(typeOption, scheduleInfoArray) {
      var newScheduleInfos = new Array();
      for (var i = 0; i < scheduleInfoArray.length; i++) {
        if (scheduleInfoArray[i].scheduleType == typeOption) {
          newScheduleInfos.push(scheduleInfoArray[i]);
        }
      }
      return newScheduleInfos;
    }

//  confirm 对话框
    function showConfirm() {
      var confirmPopup = $ionicPopup.confirm({
        title: '温馨提示',
        template: '没有本地日程，是否创建新日程?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          $state.go('tab.create', {}, {});
        } else {
          console.log('You are not sure');
        }
      });
    };
    getScheduleInfoArray();
    $scope.getScheduleListByOption = function (v) {
      console.log(v);
      for (var i = 1; i <= 5; i++) {
        var tab = "#tab" + i;
        if (i != v) {
          $(tab).css("box-shadow", "")
        } else {
          $(tab).css("box-shadow", "0 0 15px #f3d42e");
        }
      }
    }
//跳转到日程详情页面
    $scope.listClick = function (v) {
      console.log(v);
      //$state.go('#/tab/list/detail', {}, {});
    }
//item - share to note by bluetooth
    $scope.share = function (info) {
      console.log(info);
      //调用蓝牙接口，实现数据同步
      //同步删除列表
      LocalStorageService.getScheduleDeleteList();
    }
    //item - has finished this schedule
    $scope.infoDone = function (info) {
      console.log("infoDone = ", info);
      //修改样式
      var tag = "#p" + info.scheduleId;
      $(tag).css("text-decoration", "line-through");
      //同步状态
      info.scheduleState = "done";
      LocalStorageService.updateScheduleInfo(info);
      //$scope.isShowDoneButton = false;
    }
    $scope.removeItem = function (info) {
      console.log(info);
      //从本地缓存中删除该日程信息
      LocalStorageService.deleteInfoById(info.scheduleId);
      //并更新删除列表，与note同步时触发该事件
      LocalStorageService.setScheduleDeleteList(info.scheduleId);
      //刷新列表
      getScheduleInfoArray();
    }
    $scope.addSchedule = function () {
      console.log("新增日程");
      //$ionicTabsDelegate.select(2);
      $state.go('tab.create', {}, {});
    }
  })

  .controller('DetailCtrl', function ($scope, $ionicActionSheet) {
    $scope.item = {
      id: 1,
      avter: 'http://www.runoob.com/try/demo_source/spengler.jpg',
      title: '今天去姥姥家',
      info: '今天去姥姥家1111111111111111111',
      state: 'ok'
    }
    $scope.show = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<b>完成</b>'},
          {text: '<b>进行中</b>'}
        ],
        titleText: '<b>选择日程状态</b>',
        cancelText: '取消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            console.log("完成");
            $scope.item.state = "完成";
          } else if (index == 1) {
            console.log("进行中");
            $scope.item.state = "进行中";
          }
          return true;
        }
      });
      //可以设置上拉菜单自动消失，未开启
      //$timeout(function () {
      //    hideSheet();
      //}, 2000);
    }
    $scope.saveInfo = function () {
      console.log("保存日程信息");
      //保存日程信息
    }

    $scope.mywords = "halohalo";
    $scope.selectedTime = "111";
    $scope.vipTimePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 24,  //Optional
      titleLabel: '24-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val);
      }
    };
    function timePickerCallback(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        $scope.vipTimePickerObject.inputEpochTime = val;
        $scope.selectedTime = epochParser(val);
        console.log('选择的时间：' + epochParser(val));
      }
    }

    function prependZero(param) {
      if (String(param).length < 2) {
        return "0" + String(param);
      }
      return param;
    }

    function epochParser(val) {
      if (val === null) {
        return "00:00";
      } else {
        var hours = parseInt(val / 3600);
        var minutes = (val / 60) % 60;
        return (prependZero(hours) + ":" + prependZero(minutes));
      }
    }


    var disabledDates = [
      new Date(1437719836326),
      new Date(),
      new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2015"), //Short format
      new Date(1439676000000) //UNIX format
    ];
//方便的年月日设置方式，正和我意，可以随便改了。
    var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
    //默认值：["S", "M", "T", "W", "T", "F", "S"];
    var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    //默认值：["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//日期选择后的回调函数
    var datePickerCallbacke = function (val) {
      if (typeof (val) === 'undefined') {
      } else {
        console.log('Selected date is : ', val);
        $scope.datepickerObjectEnd.inputDate = val;  //这行官网没有，不设置 的话，选中日期不能回填到页面。
      }
    };
//主体对象
    $scope.datepickerObjectEnd = {
      titleLabel: '选择日期',  //可选
      todayLabel: '今天',  //可选
      closeLabel: '关闭',  //可选
      setLabel: '设置',  //可选
      setButtonType: 'button-assertive',  //可选
      todayButtonType: 'button-assertive',  //可选
      closeButtonType: 'button-assertive',  //可选
      inputDate: new Date(),  //可选，输入值
      mondayFirst: true,  //可选,星期一开头
      disabledDates: disabledDates, //可选
      weekDaysList: weekDaysList, //可选
      monthList: monthList, //可选
      templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
      showTodayButton: 'true', //可选
      modalHeaderColor: 'bar-positive', //可选
      modalFooterColor: 'bar-positive', //可选
      from: new Date(2008, 8, 2), //可选
      to: new Date(2030, 8, 25),  //可选
      callback: function (val) {  //Mandatory
        datePickerCallbacke(val);
      },
      dateFormat: 'yyyy-MM-dd', //可选
      closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
    };

  })

  .controller('CreateCtrl', function ($scope, $ionicActionSheet, LocalStorageService, $ionicTabsDelegate, $ionicPopup, $ionicHistory) {
    $scope.item = {
      id: 1,
      avter: 'http://www.runoob.com/try/demo_source/spengler.jpg'
    }
    $scope.scheduleInfo = {
      scheduleType: "ALL",
      scheduleDate: new Date(),
      scheduleDes: "please input your msg",
      scheduleState: "待办",
      isSynchro: "未同步",
      scheduleId: 0
    }
    $scope.datetimeValue = new Date();

    $scope.saveInfo = function () {
      console.log("保存日程信息");
      //保存日程信息
      LocalStorageService.setScheduleInfo($scope.scheduleInfo);
      //当前页面返回到上一级
      $ionicHistory.goBack();
      //跳转到列表页面
      //$ionicTabsDelegate.select(0);
    }
    $scope.goBackToList = function () {
      console.log("goBackToList");
      //当前页面返回到上一级
      $ionicHistory.goBack();
      //跳转到列表页面
      //$ionicTabsDelegate.select(0);
    }

    $scope.showScheduleType = function () {
      console.log("选择事项类型");
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<b>聚会</b>'},
          {text: '<b>商谈</b>'},
          {text: '<b>出行</b>'}
        ],
        titleText: '<b>选择日程状态</b>',
        cancelText: '取消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            console.log("聚会");
            $scope.scheduleInfo.scheduleType = "聚会";
          } else if (index == 1) {
            console.log("商谈");
            $scope.scheduleInfo.scheduleType = "商谈";
          } else if (index == 2) {
            console.log("出行");
            $scope.scheduleInfo.scheduleType = "出行";
          }
          return true;
        }
      });
      //可以设置上拉菜单自动消失，未开启
      //$timeout(function () {
      //    hideSheet();
      //}, 2000);
    }
    //增加提醒时间设置
    $scope.addRemindTime = function () {
      console.log("增加提醒时间设置");
      $("#timeValue").css("color", "#44A5C7");
    }
    $scope.infoChanged = function () {
      console.log("infoChanged");
      if ($scope.scheduleInfo.scheduleDes.indexOf("please input your msg") >= 0) {
        $scope.scheduleInfo.scheduleDes = "";
      }
    }
    $scope.inputClick = function () {
      console.log("inputClick");
      if ($scope.scheduleInfo.scheduleDes.indexOf("please input your msg") >= 0) {
        $scope.scheduleInfo.scheduleDes = "";
      }
    }
    function infoChanged() {
      console.log("infoChanged");
    }
  })

  .controller('AccountCtrl', function ($scope, scheduleStatisticService) {
    console.log("into Account Ctrl");
    $scope.allNum = 0;
    $scope.doneNum = 0;
    $scope.getScheduleStatistics = function () {
      //通过services获取任务统计结果
      var scheduleStatistics = scheduleStatisticService(0, 0);
      if (scheduleStatistics != null && scheduleStatistics != null && scheduleStatistics.allNum != 0) {
        $scope.allNum = scheduleStatistics.allNum;
        $scope.doneNum = scheduleStatistics.doneNum;
      }
    }
    $scope.likeIt = function () {
      console.log("likeIt");
      $scope.getScheduleStatistics();
    }
    $scope.$on("Ctr1NameChange",
      function (event, msg) {
        console.log("parent msg", msg);
        $scope.getScheduleStatistics();
      });
  });
