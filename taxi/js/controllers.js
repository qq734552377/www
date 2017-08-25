/**
 * Created by pj on 2017/8/16.
 */
var appControllers = angular.module('appControllers', []);
appControllers.factory('isSide', function () {
    return {
        isSidemenu: false
    }
})
    .factory('path', function ($location) {
        function isSideMenuge() {
            var path = $location.path();
            var isSidemenu = false;

            if (path.indexOf('sidemenu') >= 0) {
                isSidemenu = true;
            } else {
                isSidemenu = false;
            }

            return {
                path: path,
                isSidemenu: isSidemenu
            }
        }

        return {
            getResult: isSideMenuge
        };
    })
    .factory('JIANCE', function ($http, path) {

        function doFirst() {
            var url = 'http://192.168.0.113:12907/api/GetUserInfo';
            var yanzhengUrl = '#/login'
            var isRemeberMe = localStorage.getItem('isRemeberMe');
            var token = '';
            var isAut = false;
            if (isRemeberMe && isRemeberMe == 'true') {
                token = localStorage.getItem('Token');
            } else {
                token = sessionStorage.getItem('Token');
            }
            if (token && token != '') {
                $http({
                    type: "POST",
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + token
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.MsgType == 'Success') {
                        isAut = true;
                    } else {
                        isAut = false;
                        token = '';
                        // window.location.href = yanzhengUrl;
                    }
                }).error(function () {
                    console.log('失败' + path.getResult().path)
                    // window.location.href = yanzhengUrl;
                })
            } else {
                isAut = false;
                // window.location.href = yanzhengUrl;
            }

            return {
                isAut: true,
                token: token
            }
        }

        return {init: doFirst};
    })
    .factory('searchMsg',function () {
        return {
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            location: '',
            category: '1',
            rentFor: '1',
            searchUrl: 'http://192.168.0.103:12907/api/VehicleShareQuery',
            getLocations: 'http://192.168.0.103:12907/Select/QueryParkingSpace',
            locations:[]
        };
    })
    .factory('initLocations',function ($http,searchMsg) {
        function initLocations() {
            $http({
                method: "POST",
                url: searchMsg.getLocations,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    searchMsg.locations = data.Data;
                } else {

                }
            }).error(function () {

            });
        };

        return   {
            initLocations:initLocations
        }
    });


appControllers.directive('myheader', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/nav.html'
    }
})
    .directive('myfooter', function () {
        return {
            restrict: 'E',
            templateUrl: 'html/foot.html'
        }
    });


appControllers.controller('appCtr', function ($scope, JIANCE, path, isSide,initLocations) {
    initLocations.initLocations();

    $scope.isLogin = {
        isAUT: false,
        token: ''
    };
    $scope.isSidemenu = {
        path: '',
        isSidemenu: false
    }
    //绑定数据并检测当前是否为已登录状态
    $scope.isLogin = JIANCE.init();
    //初始化isSide
    isSide.isSidemenu = path.getResult().isSidemenu;
    $scope.isSidemenu = isSide;
});

appControllers.controller('loginCtr', function ($scope, $http, path, isSide) {
    // isSide.isSidemenu=path.getResult().isSidemenu;
    $scope.isRemeberMe = true;
    $scope.errorState = false;
    $scope.errorMsg = 'Incorrect account name or password!';

    $scope.loginMsg = {
        url: "http://192.168.0.113:12907/api/Login",
        email: '',
        password: '',
        loginSucessUrl: '#/search'
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
                    window.location.href = $scope.loginMsg.loginSucessUrl;
                    // path.path = $scope.loginMsg.loginSucessUrl;
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
});

appControllers.controller('searchCtr', function ($scope, $http, searchMsg) {
    console.log(searchMsg);

    $scope.searchMsg = searchMsg;

    $scope.isWaitting = true;
    $scope.isNoCar = false;
    $scope.allCarsMsg = {};


    if ($scope.searchMsg.startTime==''||compareTimeWithCurrentTime($scope.searchMsg.startDate+" "+$scope.searchMsg.startTime)){
        initsearchTime($scope);
    }

    $scope.$watch('searchMsg.startTime',function (newValue, oldValue, scope) {
        var newStartDteTime=scope.searchMsg.startDate+" " +newValue;
        var endDateTime=scope.searchMsg.endDate+" " +scope.searchMsg.endTime;

        if (compareTimeWithCurrentTime(newStartDteTime)){
            initsearchTime(scope);
        }else{
            var re=computeWithHours(newStartDteTime,endDateTime);
            if (re<3){
                var endTime=addByhours(new Date(newStartDteTime.replace("-","/")),3);
                var formatTime=getFormatTime(endTime);
                console.log(formatTime)
                scope.searchMsg.endDate=formatTime.Date;
                scope.searchMsg.endTime=formatTime.Time;
            }
        }
    });


    $scope.search = function () {
        console.log($scope.searchMsg);

        var startDateTime=$scope.searchMsg.startDate+" " +$scope.searchMsg.startTime;
        var endDateTime=$scope.searchMsg.endDate+" " +$scope.searchMsg.endTime;

        if (computeWithHours(startDateTime,endDateTime)<3){
            var endTime=addByhours(new Date(startDateTime.replace("-","/")),3);
            var formatTime=getFormatTime(endTime);
            console.log(formatTime)
            $scope.searchMsg.endDate=formatTime.Date;
            $scope.searchMsg.endTime=formatTime.Time;
            $scope.isWaitting = false;
            $scope.isNoCar = true;
            return
        }


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

})
    .controller('mainsearchCtr', function ($scope, $http,searchMsg) {
        $scope.searchMsg = searchMsg;
        if ($scope.searchMsg.startTime==''||compareTimeWithCurrentTime($scope.searchMsg.startDate+" "+$scope.searchMsg.startTime)){
            initsearchTime($scope);
        }
    });


appControllers.controller('sidemenuCtr', function ($scope, JIANCE, $state, $location, path) {
    // JIANCE.init()
    if ($location.path() == '/sidemenu') {
        $state.go('sidemenu.account');//默认显示第一个tab
        $scope.curpath = ''
    }

    if ($location.path() == '/sidemenu/account') {
        $scope.curpath = ''
    }

    $scope.$on('curPath', function (event, data) {
        $scope.curpath = data
    });

})
    .controller('accountCtr', function ($scope) {
        $scope.$emit('curPath', '');
    }).controller('editprofileCtr', function ($scope) {
    $scope.$emit('curPath', 'Edit Profile');
})
    .controller('walletCtr', function ($scope) {
        $scope.$emit('curPath', 'E-wallet History');
        $scope.sourceBookings = [
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            },
            {
                date: '2017-03-05 18:52:54',
                type: 'top up',
                amount: '$500.00',
                enteredBy: 'credit card'
            }
        ]
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);

        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
        };
    })
    .controller('topupCtr', function ($scope) {
        $scope.$emit('curPath', 'Top Up');
    })
    .controller('bookingdetailCtr', function ($scope) {
        $scope.$emit('curPath', 'Booking');
        $scope.sourceBookings = [
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            },
            {
                ref: '2017082365455',
                car: 'Petrol Hybrid | 5 Seater',
                pickup: '2017-08-21 15:00:00',
                return: '2017-08-21 20:00:00',
                amount: '$35.00',
                status: 'booking',
                actions: []
            }
        ];
        $scope.avg = '10';

        $scope.currentIndex = 1;
        $scope.pageCount = Math.ceil($scope.sourceBookings.length / $scope.avg);
        $scope.allPageBookings = [];
        $scope.currentPageBookings = [];

        initPage($scope);

        $scope.$watch('avg', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                initPage(scope);
            }
        });
        $scope.jumpPage = function (index) {
            if (index < 1) {
                return
            }
            if (index > $scope.pageCount) {
                return
            }
            $scope.currentIndex = index;
            $scope.currentPageBookings = $scope.allPageBookings[index - 1].pageItems;
        };

    })
    .controller('referCtr', function ($scope) {
        $scope.$emit('curPath', 'Refer a Friend');
    });

appControllers.controller('bookingCtr', function ($scope, $http) {
    $scope.timeTable = {
        times: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        bgcolors: [{bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'not-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'may-booking-bgc'},
            {bgcClass: 'can-booking-bgc'},
            {bgcClass: 'can-booking-bgc'}
        ]
    };

});














function initPage(scope) {
    scope.pageCount = Math.ceil(scope.sourceBookings.length / scope.avg);
    if (scope.pageCount>0){
        scope.currentIndex = 1;
        scope.allPageBookings = paging(scope.sourceBookings, scope.avg);
        scope.currentPageBookings = scope.allPageBookings[0].pageItems;
    }else{
        scope.currentIndex=0;
        scope.allPageBookings=[];
        scope.currentPageBookings=[];
    }
}

function paging(allItems, space) {
    var count = Math.ceil(allItems.length / space);
    var pages = new Array();
    for (var i = 0; i < count; i++) {
        pages[i] = {index: i + 1, pageItems: []}
        for (var j = 0; j < space; j++) {
            if ((space * i + j) == allItems.length) {
                break;
            } else {
                pages[i].pageItems.push(allItems[space * i + j])
            }
        }

    }
    return pages;
}

function initsearchTime($scope) {
    var startDateTime = addHours(1);
    var endDateTime = addHours(4);

    var startDate = startDateTime.getFullYear() + '-' + ((startDateTime.getMonth() + 1) > 9 ? (startDateTime.getMonth() + 1) : ('0' + (startDateTime.getMonth() + 1))) + '-' + startDateTime.getDate();
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + endDateTime.getDate();
    var startHour = startDateTime.getHours() > 9 ? (startDateTime.getHours() + ":00") : ("0" + startDateTime.getHours() + ":00");
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");

    $scope.searchMsg.startDate = startDate;
    $scope.searchMsg.startTime = startHour;
    $scope.searchMsg.endDate = endDate;
    $scope.searchMsg.endTime = endHour;
}

function getFormatTime(date){
    var endDateTime = date;
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + endDateTime.getDate();
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");
    return {
        Date:endDate,
        Time:endHour
    };
}

function addHours(hours) {
    var a = new Date();
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function addByhours(date,hours) {
    var a = date;
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function subtractByhours(date,hours) {
    var a = date;
    a = a.valueOf();
    a = a - hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function compareTimeWithCurrentTime(datetime) {
    var currentDateTime = addHours(0);
    var storageDateTime=new Date(datetime.replace("-","/"));
    if (currentDateTime > storageDateTime){
        return true
    }else {
        return false
    }
}

function computeWithHours(startTime,endTime) {
    var startDateTime=new Date(startTime.replace("-","/"));
    var endDateTime=new Date(endTime.replace("-","/"));
    var result=endDateTime.getTime()-startDateTime.getTime()

    return result/3600/1000;
}