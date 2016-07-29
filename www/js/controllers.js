angular.module('starter.controllers', [])

  .controller('ListCtrl', function ($scope, ContextParseService, getContextEntityAndTag, $state, LocalStorageService, $ionicPopup, $ionicTabsDelegate) {

    //TODO:从本地缓存中读取日程数据
    function getScheduleInfoArray() {
      var scheduleInfoArray = LocalStorageService.getScheduleInfoArray();
      if (scheduleInfoArray != null && scheduleInfoArray != undefined && scheduleInfoArray.length > 0) {
        //处理日程数据
        console.log("处理日程数据");
        $scope.scheduleInfos = scheduleInfoArray;
      } else {
        //没有本地数据，提示用户创建日程
        $scope.scheduleInfos = null;
        console.log("没有本地数据，提示用户创建日程");
        showConfirm();
      }
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
          $ionicTabsDelegate.select(1);
        } else {
          console.log('You are not sure');
        }
      });
    };
    getScheduleInfoArray();
    $scope.getScheduleListByOption =function (v) {
      console.log(v);
      for (var i = 1;i<=5;i++) {
        var tab = "#tab"+i;
        if(i != v) {
          $(tab).css("box-shadow","")
        }else {
          $(tab).css("box-shadow","0 0 15px #f3d42e");
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
    $scope.removeItem = function (info) {
      console.log(info);
      //从本地缓存中删除该日程信息
      LocalStorageService.deleteInfoById(info.scheduleId);
      //并更新删除列表，与note同步时触发该事件
      LocalStorageService.setScheduleDeleteList(info.scheduleId);
      //刷新列表
      getScheduleInfoArray();
    }
    $scope.synchroToNote = function () {
      console.log("和蓝牙同步");
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

  .controller('CreateCtrl', function ($scope, $ionicActionSheet, LocalStorageService, $ionicTabsDelegate) {
    $scope.item = {
      id: 1,
      avter: 'http://www.runoob.com/try/demo_source/spengler.jpg'
    }
    $scope.scheduleInfo = {
      scheduleType: "---请选择事项类型---",
      scheduleTime: (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds(),
      scheduleDate: new Date(),
      scheduleDes: "please input your msg",
      scheduleState: "待办",
      isSynchro: "未同步",
      scheduleId: 0
    }

    $scope.saveInfo = function () {
      console.log("保存日程信息");
      //保存日程信息
      LocalStorageService.setScheduleInfo($scope.scheduleInfo);
      //跳转到列表页面
      $ionicTabsDelegate.select(0);
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
            console.log("事项类型 - 聚会");
            $scope.scheduleInfo.scheduleType = "事项类型 ：聚会";
          } else if (index == 1) {
            console.log("事项类型 - 商谈");
            $scope.scheduleInfo.scheduleType = "事项类型 ：商谈";
          } else if (index == 2) {
            console.log("事项类型 - 出行");
            $scope.scheduleInfo.scheduleType = "事项类型 ：出行";
          }
          return true;
        }
      });
      //可以设置上拉菜单自动消失，未开启
      //$timeout(function () {
      //    hideSheet();
      //}, 2000);
    }

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
        $scope.scheduleInfo.scheduleTime = epochParser(val);
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
    var weekDaysList = ["S", "M", "T", "W", "T", "F", "S"];//中文：["日", "一", "二", "三", "四", "五", "六"];
    var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //中文：["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    // 日期选择后的回调函数
    var datePickerCallbacke = function (val) {
      if (typeof (val) === 'undefined') {
      } else {
        console.log('Selected date is : ', val);
        $scope.scheduleInfo.scheduleDate = val;//更新日期。
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

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
