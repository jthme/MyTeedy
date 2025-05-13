'use strict';

angular.module('docs').controller('register', function ($scope, Restangular) {
  $scope.form = {};

  $scope.register = function () {
    Restangular.all('registration').post($scope.form).then(function () {
        $scope.status = "注册请求已提交，等待管理员审核";
        $scope.form = {};
      }, function () {
        $scope.status = "提交失败，请稍后重试";
      });
  };
});
