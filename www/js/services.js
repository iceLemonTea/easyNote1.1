angular.module('starter.services', [])

  //通过语义解析引擎，获取输入语句的实体和各分词标签
  .provider('getContextEntityAndTag', function () {
    var data;
    //按照表单提交的方式，发送post请求
    function post(url, params) {
      var temp = document.createElement("form");
      temp.action = url;
      temp.method = "post";
      temp.style.display = "none";
      for (var x in params) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = params[x];
        temp.appendChild(opt);
      }
      document.body.appendChild(temp);
      temp.submit(function () {
        $.post(url, form.serialize(),
          function (result, status) {
            alert("Data Loaded: " + result);
          },
          "jsonp");
        return false;
      });
    }

    var f = function (context) {
      if (context != null && context != undefined) {
        var params = {data: context};
        var myUrl = "http://bosonnlp.com/analysis/ner?category=&sensitivity=3";
        post(myUrl, params);
      }
    };
    this.$get = function () {
      return f;
    };
  })

  .factory('ContextParseService', function ($rootScope, $http) {
    var service = {
      contextParseByBosonnlp: function (context) {
        var myUrl = "http://bosonnlp.com/analysis/ner?category=&sensitivity=3";
        //var myUrl ="http://api.bosonnlp.com/tag/analysis?space_mode=0&oov_level=3&t2s=0&&special_char_conv=0";
        //var myUrl = "http://api.bosonnlp.com/tag/analysis";
        return $.ajax({
          type: "post",
          url: myUrl,
          contentType: "application/json",
          xToken: "tc42tRp4.8702.VB70Kqpxz1IM",
          Accept: "application/json",
          Host: "api.bosonnlp.com",
          data: context,
          success: function (data, status, headers, config) {
            alert(data);
          },
          error: function (data) {
            alert("error = ", data);
          }
        });
        //$.post("http://bosonnlp.com/analysis/ner?category=&sensitivity=3", { data:context},
        //  function(data){
        //    alert("Data Loaded: " + data);
        //  });
        //$.ajax({
        //  type: 'post',
        //  Host: 'bosonnlp.com',
        //  Connection: 'keep-alive',
        //  'Content-Length': '117',
        //  Accept: '*/*',
        //  Origin: 'http://bosonnlp.com',
        //  'X-Requested-With': 'XMLHttpRequest',
        //  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36',
        //  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //  Referer: 'http://bosonnlp.com/demo',
        //  'Accept-Encoding': 'gzip, deflate',
        //  'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
        //  Cookie: 'session=.eJw9kE9rg0AUxL9K2XMO8U_aIuSQoBGF96RhjexehFbj-tZtQROMG_Ldu82htxkYht_MndXnsZ0Uiy7jtV2xum9YdGcvnyxikkuFJgmQdAikN9JpiGHBVHjARYgm80SV9-ifeoyTGSvwhB0Iq8RK3q2R6w3YfS-5IvDLPx8iuRy5nMkJ0mwWBm5FJW5gJQnKvCItXS8qwUsPjTRF3AWSdlbwowIjArBIyA_keGY0J43c8XCxZY8V-5rGc3350e33_wTwUcs4CQV1C9qDktXHgn5ywzTzwKEAyQEoV2iPGqkZIG56uds-665TOz7vYO9v61f2-AV5iWI3.CndKjw.h4vRxjo3FUgkk3jueNqWql8pxz8; Hm_lvt_6629d4aae357d8d3e47238c93f1e1d78=1469428092; Hm_lpvt_6629d4aae357d8d3e47238c93f1e1d78=1469432707',
        //  'Data-Type': 'jsonp',
        //  data:context,
        //  success: function (result) {
        //    alert(result);
        //  }
        //});
        //return $http({
        //  url: myUrl,
        //  method: "POST",
        //  headers: {
        //    'Content-Type': 'application/x-www-form-urlencoded',
        //    //'X-Token': 'tc42tRp4.8702.VB70Kqpxz1IM',
        //    'Accept': '*/*',
        //    'dataType':'jsonp'
        //  },
        //  data: {
        //    'data': '什么傻逼玩意儿！'
        //  }
        //});
      }
    };
    return service;
  })
  .factory('LocalStorageService', function ($rootScope, $http) {
    var service = {
      getScheduleInfo: function (scheduleId) {//获取日程信息数据
        var scheduleInfo = localStorage.getItem(scheduleId);
        if (scheduleInfo == null || scheduleInfo == undefined) {
          scheduleInfo = 0;
        }
        return JSON.parse(scheduleInfo);
      },
      setScheduleInfo: function (scheduleInfo) {//保存日程信息数据
        var scheduleId = parseInt(service.getScheduleLastId());
        scheduleInfo.scheduleId = scheduleId;//把ID作为内容，增加到日程信息中，方便删除或是分享时调用
        localStorage.setItem(scheduleId, JSON.stringify(scheduleInfo));
        //将索引+1
        service.setScheduleId(scheduleId + 1);
      },
      setScheduleDeleteList: function (scheduleId) {//更新删除日程列表
        var scheduleList = localStorage.getItem("scheduleDeleteList");
        var jsonArray = new Array();
        if (scheduleList == null || scheduleList == undefined) {
          jsonArray = [{"id": scheduleId, "isDelete": true}];
        } else {
          var arr = {"id": scheduleId, "isDelete": true};
          jsonArray = JSON.parse(scheduleList);
          //jsonArray = eval('('+JSON.parse(scheduleList)+')');
          jsonArray.push(arr);
        }
        localStorage.setItem("scheduleDeleteList", JSON.stringify(jsonArray));
      },
      getScheduleDeleteList: function () {//获取删除日程信息列表
        var scheduleDeleteList = localStorage.getItem("scheduleDeleteList");
        if (scheduleDeleteList == null || scheduleDeleteList == undefined) {
          return 0;
        }
        return JSON.parse(scheduleDeleteList);
      },
      getScheduleLastId: function () {//获取最后一个日程id
        var scheduleId = localStorage.getItem("scheduleId");
        if (scheduleId == null || isNaN(scheduleId)) {
          scheduleId = 0;
          service.setScheduleId(scheduleId);
        }
        return scheduleId;
      },
      setScheduleId: function (scheduleId) {//设置日程id最新值
        localStorage.setItem("scheduleId", scheduleId);
      },
      getScheduleInfoArray: function () {//获取日程信息列表
        var scheduleInfoArray = new Array();
        var lastId = service.getScheduleLastId();
        for (var i = lastId - 1; i >= 0; i--) {
          var scheduleInfo = service.getScheduleInfo(i);
          if (scheduleInfo != 0) {
            scheduleInfoArray.push(scheduleInfo);
          }
        }
        return scheduleInfoArray;
      },
      deleteInfoById: function (scheduleId) {//删除日程信息列表
        var lastId = service.getScheduleLastId();
        if (scheduleId <= lastId) {
          localStorage.removeItem(scheduleId);//删除
        } else {
          console.log("there is no schedule for id = ", scheduleId);
        }
      }
    }
    return service;
  })
