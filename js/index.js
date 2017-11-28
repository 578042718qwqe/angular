angular.module('common', []).service('addition', function ($rootScope) {//自定义模块1,
    $rootScope.qq ="88";
    this.add = function (a, b) {
        return a + b;
    }
});

angular.module('tabs', []).run(function ($rootScope) {//自定义选项卡模块
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

//编辑表格 模块
angular.module('addressFormatter', []).filter('address', function () {
    return function (input) {
        return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
    };
});


var routerApp = angular.module('routerApp', ['ui.router',"tabs", 'ui.grid', 'ui.grid.edit', 'addressFormatter','ui.grid.pagination']);//全局模块

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
/*routerApp.controller('myCtrl', function ($scope,addition) {//注入模块一
    $scope.ass = addition.add(5,6);
});*/
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
        .state('home.prompt', {//提示
            url: '/prompt',
            templateUrl: 'templates/prompt.html'
        })
        .state('home.table', {//表格
            url: '/table',
            templateUrl: 'templates/table.html'
        })
        .state('home.list2', {
            url: '/list2',
            templateUrl: 'templates/list-context2.html'
        })
        .state('home.list3', {
            url: '/list3',
            templateUrl: 'templates/list-context5.html'
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

//*--------------------------------公用表格模块------------------------------------------//
routerApp.controller('MainCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.gridOptions = {

    };

    $scope.storeFile = function( gridRow, gridCol, files ) {
        // ignore all but the first file, it can only select one anyway
        // set the filename into this column
        gridRow.entity.filename = files[0].name;

        // read the file and set it into a hidden column, which we may do stuff with later
        var setFile = function(fileContent){
            gridRow.entity.file = fileContent.currentTarget.result;
            // put it on scope so we can display it - you'd probably do something else with it
            $scope.lastFile = fileContent.currentTarget.result;
            $scope.$apply();
        };
        var reader = new FileReader();
        reader.onload = setFile;
        reader.readAsText( files[0] );
    };
    $scope.gridOptions.paginationPageSizes = [50, 100, 500];
    $scope.gridOptions.paginationPageSize = 30;
    $scope.gridOptions.columnDefs = [
        { name: 'id', enableCellEdit: false, width: '10%' },
        { name: 'name', displayName: 'Name (editable)', width: '20%' },
        { name: 'age', displayName: 'Age' , type: 'number', width: '10%' },
        { name: 'gender', displayName: 'Gender', editableCellTemplate: 'ui-grid/dropdownEditor', width: '20%',
            cellFilter: 'mapGender', editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
            { id: 1, gender: 'male' },
            { id: 2, gender: 'female' }
        ] },
        { name: 'registered', displayName: 'Registered' , type: 'date', cellFilter: 'date:"yyyy-MM-dd"', width: '20%' },
        { name: 'address', displayName: 'Address', type: 'object', cellFilter: 'address', width: '30%' },
        { name: 'address.city', displayName: 'Address (even rows editable)', width: '20%',
            cellEditableCondition: function($scope){
                return $scope.rowRenderIndex%2
            }
        },
        { name: 'isActive', displayName: 'Active', type: 'boolean', width: '10%' },
        { name: 'pet', displayName: 'Pet', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownRowEntityOptionsArrayPath: 'foo.bar[0].options', editDropdownIdLabel: 'value'
        },
        { name: 'status', displayName: 'Status', width: '20%', editableCellTemplate: 'ui-grid/dropdownEditor',
            cellFilter: 'mapStatus',
            editDropdownOptionsFunction: function(rowEntity, colDef) {
                var single;
                var married = {id: 3, value: 'Married'};
                if (rowEntity.gender === 1) {
                    single = {id: 1, value: 'Bachelor'};
                    return [single, married];
                } else {
                    single = {id: 2, value: 'Nubile'};
                    return $timeout(function() {
                        return [single, married];
                    }, 100);
                }
            }
        },
        { name: 'filename', displayName: 'File', width: '20%', editableCellTemplate: 'ui-grid/fileChooserEditor',
            editFileChooserCallback: $scope.storeFile }
    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function(gridApi){
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue ;
            $scope.$apply();
        });
    };

    $http.get('text/data/table.json')
        .success(function(data) {
            for(i = 0; i < data.length; i++){
                data[i].registered = new Date(data[i].registered);
                data[i].gender = data[i].gender==='male' ? 1 : 2;
                if (i % 2) {
                    data[i].pet = 'fish'
                    data[i].foo = {bar: [{baz: 2, options: [{value: 'fish'}, {value: 'hamster'}]}]}
                }
                else {
                    data[i].pet = 'dog'
                    data[i].foo = {bar: [{baz: 2, options: [{value: 'dog'}, {value: 'cat'}]}]}
                }
            }
            $scope.gridOptions.data = data;
        });
}])

    .filter('mapGender', function() {
        var genderHash = {
            1: 'male',
            2: 'female'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    })

    .filter('mapStatus', function() {
        var genderHash = {
            1: 'Bachelor',
            2: 'Nubile',
            3: 'Married'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    });
//*--------------------------------公用表格模块end------------------------------------------//