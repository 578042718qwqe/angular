angular.module('common', []).service('addition', function ($rootScope) {//自定义模块1,
    $rootScope.qq ="88";
    this.add = function (a, b) {
        return a + b;
    }
});

angular.module('tab', []).run(function ($rootScope) {//自定义选项卡模块
    $rootScope.data = {
        current: "1" // 1代表张三，2代表李四，3代表王五
    };
    $rootScope.yy ="666";
    $rootScope.actions =
        {
            setCurrent: function (param) {
                $rootScope.data.current = param;
            }
        }
});
//自定义指令
angular.module('myApp',[])
    .directive('myHello',function(){
        return {
            restrict : 'A',
            replace : true,
            template : '<div>hello angular</div>'
        };
    });

var routerApp = angular.module('routerApp', ['ui.router','common','tab']);//全局模块

routerApp.controller('dh_tab',function ($scope,$http,$rootScope) {
    //$rootScope.names= "zz5";
    //设置导航
    $scope.arr = [];

    console.log("123");

    $scope.dh_show = function (name, url) {
        var find = false;
        for(var i = 0; i < $scope.arr.length;i++) {
            if($scope.arr[i].name == name) {
                console.log($scope.arr[i]);
                find = true;
                break;
            }
        }
        if(!find) {
            var arts_s ={
                name:name,
                url:url
            };
            $scope.arr.push(arts_s);
        }
        console.log($scope.arr);
    };
    // var arr_indexof =[];
    // $scope.dh_show = function (name,url) {
    //     angular.forEach(arr,function (data) {
    //         arr_indexof.push(data.name);
    //     });
    //     if(arr_indexof.indexOf(name) == "-1"){//考虑双向数据绑定 //
    //         var arr_s ={
    //             name:name,
    //             url:url
    //         };
    //         arr.push(arr_s);
    //     }
    //     console.log(arr);
    // };
    $rootScope.names = $scope.arr;
    //读取导航
    $http({
        method: 'GET',
        url: 'text/data/menuData.json'
    }).then(function successCallback(response) {
        // 成功代码
        $scope.shezhi= response.data;
        //$scope.objects2.a = response.data.name.module;
        //$scope.objects2.f = response.data.name.xxk;
        //$scope.objects2.h = response.data.name.sourceMap;
        //$scope.objects2.g = response.data.name.sex;
    });
});
routerApp.controller("dh_name",function ($scope,$rootScope,$state) {//导航选项
    $scope.dh_close = function (event,element) {
        var key = $(event.target).attr('data');
        $rootScope.names.splice(key,1);
        /*$(event.target).parents("li").addClass("active").siblings().removeClass("active");*/
        var url_go = $(event.target).parents("li").prev().attr("ui-sref");
        if(url_go){
            $state.go(url_go);
        }
        if(url_go == undefined){
            //如果不存在向右边取值
            $state.go("home.list");
            console.log("不存在")
        }
    };
});
routerApp.controller('mouseenter',function ($log,$scope) {
    $scope.mouse = function (index) {
        $log.log(index)
    };
});
routerApp.controller('myCtrl', function ($scope,addition) {//注入模块一
    $scope.ass = addition.add(5,6);
});
routerApp.controller("form",function ($scope,$http) {//绑定表单并提交
    $scope.objects2 = {};
    $http({
        method: 'GET',
        url: 'text/data/sq.json'
    }).then(function successCallback(response) {
        // 成功代码
        $scope.objects2.a = response.data.name.module;
        $scope.objects2.f = response.data.name.xxk;
        $scope.objects2.h = response.data.name.sourceMap;
        $scope.objects2.g = response.data.name.sex;
    });
    $scope.anniu = function () {//回传数据
        $scope.objects = $scope.objects2;
        console.log($scope.objects);
        $http({
            method: 'GET',
            url: 'text/data/sq.json'
        }).then(function successCallback(response) {
            // 成功代码
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    };
});

routerApp.config(function($stateProvider,$urlRouterProvider) {//全局路由
    $urlRouterProvider.otherwise('/404');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/list-1.html'
        })
        .state('home.list', {
            url: '/list',
            templateUrl: 'templates/list-context.html'
        })
        .state('home.list2', {
            url: '/list2',
            templateUrl: 'templates/list-context2.html'
        })
        .state('home.list3', {
            url: '/list3',
            templateUrl: 'templates/list-context3.html'
            /*templateUrl: 'templates/partial-home-list.html',
             controller: function($scope) {
             $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
             }*/
        })
        .state('home.list4', {
            url: '/list4',
            templateUrl: 'templates/list-context4.html'
        })
        .state('home.list5', {
            url: '/list5',
            templateUrl: 'templates/list-context5.html'
        })
        .state('about', {
            url: 'templates/about',
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
            templateUrl: 'templates/404.html'
        })
});