
angular.module('common', []).service('addition', function () {//自定义模块1,
    this.add = function (a, b) {
        return a + b;
    }
});

angular.module('tab', []).run(function ($rootScope) {//自定义选项卡模块
    $rootScope.data = {
        current: "1" // 1代表张三，2代表李四，3代表王五
    };
    $rootScope.actions =
        {
            setCurrent: function (param) {
                $rootScope.data.current = param;
            }
        }
});


var routerApp = angular.module('routerApp', ['ui.router','common','tab']);//全局模块

routerApp.controller('mouseenter',function ($log,$scope) {
    $scope.mouse = function (index) {
        $log.log(index)
    };
});
routerApp.controller('myCtrl', function ($scope,addition) {//注入模块一
        $scope.ass = addition.add(5,6);
    });
routerApp.controller("sss",function ($scope,$http,$log) {//绑定表单并提交
    $http({
        method: 'GET',
        url: 'json/sq.json'
    }).then(function successCallback(response) {
        $scope.objects = response.data.compilerOptions.module;
        $log.log($scope.objects = response.data.compilerOptions.module);
        $scope.anniu =function () {
            $scope.object = {};
            $scope.object =$scope.objects;
            console.log($scope.object)
        }
    }, function errorCallback(response) {
        // 请求失败执行代码
    });
});

routerApp.config(function($stateProvider,$urlRouterProvider) {//全局路由
    $urlRouterProvider.otherwise('/404');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'html/list-1.html'
        })
        .state('home.list', {
            url: '/list',
            templateUrl: 'html/list-context.html'
        })
        .state('home.list2', {
            url: '/list2',
            templateUrl: 'html/list-context2.html'
        })
        .state('home.list3', {
            url: '/list3',
            templateUrl: 'html/list-context3.html'
            /*templateUrl: 'html/partial-home-list.html',
             controller: function($scope) {
             $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
             }*/
        })
        .state('home.list4', {
            url: '/list4',
            templateUrl: 'html/list-context4.html'
        })
        .state('home.list5', {
            url: '/list5',
            templateUrl: 'html/list-context5.html'
        })
        .state('about', {
            url: 'html/about',
            views: {
             '': { templateUrl: 'partial-about.html' },
             'columnOne@about': { template: 'Look I am a column!' },
             'columnTwo@about': {
                 templateUrl: 'table-data.html',
                 controller: 'scotchController' }
             }

        })
        .state('404', {
            url: '/404',
            templateUrl: 'html/404.html'
        })
});

