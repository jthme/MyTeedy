'use strict';

/**
 * Settings user page controller.
 */
angular.module('docs').controller('SettingsUser', function($scope, $state, Restangular) {
  /**
   * Load users from server.
   */
  $scope.loadUsers = function() {
    Restangular.one('user/list').get({
      sort_column: 1,
      asc: true
    }).then(function(data) {
      $scope.users = data.users;
    });
  };
  
  $scope.loadUsers();
  
  /**
   * Edit a user.
   */
  $scope.editUser = function(user) {
    $state.go('settings.user.edit', { username: user.username });
  };

  $scope.registrationRequests = [];

  Restangular.one('registration').one('admin').getList('list').then(function (list) {
    $scope.registrationRequests = list;
    });

  $scope.approve = function (id) {
    Restangular.one('registration').one('admin').post('accept/' + id)
      .then(function () {
        $scope.registrationRequests = $scope.registrationRequests.filter(function (r) {
          return r.id !== id;
        });
      });
  };

  $scope.reject = function (id) {
    Restangular.one('registration').one('admin').post('reject/' + id)
      .then(function () {
        $scope.registrationRequests = $scope.registrationRequests.filter(function (r) {
          return r.id !== id;
        });
      });
  };

   $scope.ganttLoading = true;
    $scope.ganttError = null;
    $scope.ganttUserId = '';  
    $scope.ganttStart = null;     
    $scope.ganttEnd = null;

    $scope.loadGantt = function () {
      $scope.ganttLoading = true;
      $scope.ganttError = null;

      const params = {};
      if ($scope.ganttUserId) params.userId = $scope.ganttUserId;
      if ($scope.ganttStart) params.start = formatDate($scope.ganttStart);
      if ($scope.ganttEnd) params.end = formatDate($scope.ganttEnd);

      // 使用 Restangular 请求接口
      Restangular.one('admin-dashboard').getList('user-activities-gantt', params)
        .then(function (data) {
          $scope.ganttLoading = false;
           const taskMap = {};

      data.forEach(function (log) {
        const day = new Date(log.timestamp).toISOString().slice(0, 10);

        if (!taskMap[log.taskId]) {
          taskMap[log.taskId] = {
             id: log.taskId,
            name: (log.taskName || log.taskId) + '（' + log.username + '）', // 👈 显示用户名
            start: day,
            end: day,
            progress: 0
          };
        } else {
          // 更新起止时间
          if (day < taskMap[log.taskId].start) taskMap[log.taskId].start = day;
          if (day > taskMap[log.taskId].end) taskMap[log.taskId].end = day;
        }
        });

        const tasks = Object.values(taskMap);

        // 防止图表宽度塌陷
        document.querySelector("#gantt").innerHTML = "";

        // 必须先有宽高的容器才能画
        new Gantt("#gantt", tasks, {
          view_mode: "Day",
          on_click: function (task) {
            alert("点击任务: " + task.name);
          },
        });
        }, function () {
          $scope.ganttLoading = false;
          $scope.ganttError = '加载失败，请检查权限或网络';
        });
    };

    // 日期格式化为 yyyy-MM-dd
    function formatDate(dateObj) {
      const d = new Date(dateObj);
      return d.toISOString().slice(0, 10);
    }

    function renderGantt(data) {
      const taskMap = {};

      data.forEach(function (log) {
        const day = new Date(log.timestamp).toISOString().slice(0, 10);

        if (!taskMap[log.taskId]) {
          taskMap[log.taskId] = {
            id: log.taskId,
            name: log.taskName || log.taskId,
            start: day,
            end: day,
            progress: 0,
          };
        } else {
          // 更新起止时间
          if (day < taskMap[log.taskId].start) taskMap[log.taskId].start = day;
          if (day > taskMap[log.taskId].end) taskMap[log.taskId].end = day;
        }
      });

      const tasks = Object.values(taskMap);

      // 防止图表宽度塌陷
      document.querySelector("#gantt").innerHTML = "";

      // 必须先有宽高的容器才能画
      new Gantt("#gantt", tasks, {
        view_mode: "Day",
        on_click: function (task) {
          alert("点击任务: " + task.name);
        },
      });
    }



});