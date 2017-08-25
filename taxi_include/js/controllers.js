/**
 * Created by pj on 2017/8/16.
 */
angular.module('appControllers', [])
    .factory('path', function () {
        return {
            path: 'html/login.html'
        };
    })
    .factory('JIANCE', function ($http,path) {

        function doFirst() {
            var url = 'http://192.168.0.113:12907/api/GetUserInfo';
            var yanzhengUrl = 'http://192.168.0.132/bootstrap_study/login.html';
            var isRemeberMe = localStorage.getItem('isRemeberMe');
            var token = '';
            var isAut=false;
            if (isRemeberMe && isRemeberMe == 'true') {
                token = localStorage.getItem('Token');
            } else {
                token = sessionStorage.getItem('Token');
            }
            if (token && token != '') {
                $http({
                    type: "POST",
                    url: url,
                    headers: {'Content-Type': 'application/json',
                        Authorization: "Basic " + token
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        isAut=true;
                    } else {
                        isAut=false;
                        path.path='html/login.html'
                    }
                }).error(function () {
                    console.log('失败'+ path.path)

                })
            } else {
                isAut=false;
                path.path='html/login.html'
            }

            return {
                isAut:isAut,
                token:token
            }
        }

        return {init:doFirst};
        }
    )
    .controller('appCtr', function ($scope, path,JIANCE) {
        $scope.path = path;
    })
    .controller('loginCtr', function ($scope, $http, path) {

        $scope.isRemeberMe = true;
        $scope.errorState = false;
        $scope.errorMsg = 'Incorrect account name or password!';

        $scope.loginMsg = {
            url: "http://192.168.0.113:12907/api/Login",
            email: '',
            password: '',
            loginSucessUrl: 'html/search.html'
        };

        $scope.login = function () {
            console.log($scope.loginMsg.email + '------' + $scope.loginMsg.password);
            console.log($scope.loginMsg.email);
            if (angular.isDefined($scope.loginMsg.email) && $scope.loginMsg.email != '' && angular.isDefined($scope.loginMsg.password) && $scope.loginMsg.password != '') {
                $http({
                    method: "POST",
                    url: $scope.loginMsg.url,
                    data: {Email: $scope.loginMsg.email, Password: $scope.loginMsg.password},
                    headers: {'Content-Type': 'application/json'}
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        $scope.errorState = false;
                        $scope.errorMsg = 'Incorrect account name or password!';
                        localStorage.setItem('isRemeberMe', $scope.isRemeberMe);
                        if ($scope.isRemeberMe) {
                            localStorage.setItem('Token', data.Info);
                            sessionStorage.removeItem('Token');
                        } else {
                            sessionStorage.setItem('Token', data.Info);
                            localStorage.removeItem('Token');
                        }
                        // window.location.href = $scope.loginMsg.loginSucessUrl;
                        path.path = $scope.loginMsg.loginSucessUrl;
                    } else {
                        $scope.errorState = true;
                        $scope.errorMsg = data.Info;
                    }

                }).error(function () {
                    $scope.errorState = true;
                    $scope.errorMsg = "The network may have problems";
                });
            }

        }
    })
    .controller('searchCtr', function ($scope, $http,JIANCE) {
        $scope.aaa=JIANCE.init()
        $scope.searchMsg = {
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            location: '',
            category: '',
            rentFor: '',
            searchUrl: 'http://192.168.0.103:12907/api/VehicleShareQuery',
            getLocations: 'http://192.168.0.103:12907/Select/QueryParkingSpace'
        };


        $scope.locations = [{ID: 1, Address: '劉安'},
            {ID: 2, Address: '合肥'}
        ];
        $scope.isWaitting = true;
        $scope.isNoCar = false;
        $scope.allCarsMsg = {};


        function init() {
            $http({
                method: "POST",
                url: $scope.searchMsg.getLocations,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    $scope.locations = data.Data;
                } else {

                }

            }).error(function () {

            });
        };
        init();

        $scope.search = function () {
            console.log($scope.searchMsg);
            $scope.isWaitting = true;
            $scope.isNoCar = false;
            $http({
                method: "POST",
                url: $scope.searchMsg.searchUrl,
                data: {
                    StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                    EndTime: ($scope.searchMsg.endDate + ' ' + $scope.searchMsg.endTime + ':00'),
                    LeaseType: $scope.searchMsg.rentFor,
                    VehiceType: $scope.searchMsg.category,
                    Address: $scope.searchMsg.location
                },
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.isNoCar = false;

                } else {
                    $scope.isNoCar = true;
                }

            }).error(function () {
                $scope.isWaitting = false;
                $scope.isNoCar = true;
            });

        }


        var startDateTime = addHours(1);
        var endDateTime = addHours(4);

        var startDate = startDateTime.getFullYear() + '-' + ((startDateTime.getMonth() + 1) > 10 ? (startDateTime.getMonth() + 1) : ('0' + (startDateTime.getMonth() + 1))) + '-' + startDateTime.getDate();
        var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 10 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + endDateTime.getDate();
        var startHour = startDateTime.getHours() > 10 ? (startDateTime.getHours() + ":00") : ("0" + startDateTime.getHours() + ":00");
        var endHour = endDateTime.getHours() > 10 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");

        $scope.searchMsg.startDate = startDate;
        $scope.searchMsg.startTime = startHour;
        $scope.searchMsg.endDate = endDate;
        $scope.searchMsg.endTime = endHour;


        function addHours(hours) {
            var a = new Date();
            a = a.valueOf();
            a = a + hours * 60 * 60 * 1000;
            a = new Date(a);
            return a;
        }
    });
