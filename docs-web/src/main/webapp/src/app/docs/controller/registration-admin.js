angular.module('docs').controller('registration-admin', function ($scope, $http) {
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

  });
