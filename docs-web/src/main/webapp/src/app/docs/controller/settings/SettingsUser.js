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
});