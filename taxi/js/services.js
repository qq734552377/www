/**
 * Created by pj on 2017/8/16.
 */
var serviceModule=angular.module('allservice',[]);

serviceModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile();
            });
        }
    };
}]);

serviceModule.factory('fileReader', ["$q", "$log", function($q, $log){
    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);

serviceModule.factory('allUrl',function () {
    return {
        searchUrl: 'http://192.168.0.103:12907/api/VehicleShareQuery',
        getLocationsUrl: 'http://192.168.0.103:12907/Select/QueryParkingSpace',
        loginUrl:"http://192.168.0.113:12907/api/Login",
        isAutUserUrl:'http://192.168.0.113:12907/api/GetUserInfo',
        signin_fUrl:'',
        getHasEmailUrl:'http://192.168.0.103:12907/api/EmailCheck',
        getHasNRICUrl:'http://192.168.0.103:12907/api/CheckNRIC',
        signin_sUrl:'http://192.168.0.103:12907/api/Register',
        getLicenseTypesUrl:'http://192.168.0.103:12907/Select/QueryLeaseType',
        getNationalitiesUrl:'http://192.168.0.103:12907/Select/GetNationality',
        getRacesUrl:'http://192.168.0.103:12907/Select/GetRace',
        getEducationLevelUrl:'http://192.168.0.103:12907/Select/GetEducationLevel',
    }
})
    .factory('appContext',function (allUrl) {
        var appMsg= {
            allCarsMsg: [],
            bookingDetailMsgs: [],
            userMsg: {},
            isSidemenu: false,
            searchMsg:{
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                location: '',
                category: '1',
                rentFor: '1',
                searchUrl: allUrl.searchUrl,
                getLocationsUrl: allUrl.getLocationsUrl,
                locations:[]
            },
            LicenseTypes:[],
            Nationalities:[],
            Races:[],
            EducationLevel:[],
            signinMsg:{
                Email:'',
                Password:'',
                PasswordAgain:'',
                Name:'',
                NRIC:'',
                Phone:''
            }
        };


        return {
            getAll:function () {
                return appMsg;
            }
        };
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
                path:  $location.path(),
                isSidemenu: isSidemenu
            }
        }

        return {
            getResult: isSideMenuge
        };
    })
    .factory('JIANCE', function ($http, path,allUrl) {

        function doFirst() {
            var url = allUrl.isAutUserUrl;
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

    .factory('initSometing',function ($http,appContext,allUrl) {
        function initLocations() {
            //所有位置
            $http({
                method: "POST",
                url: appContext.getAll().searchMsg.getLocationsUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.locations = data.Data;
                } else {

                }
            }).error(function () {

            });
            //注册缘由
            $http({
                method: "POST",
                url: allUrl.getLicenseTypesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.LicenseTypes = data.Data;
                } else {

                }
            }).error(function () {

            });
            //国籍
            $http({
                method: "POST",
                url: allUrl.getNationalitiesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.Nationalities = data.Data;
                } else {

                }
            }).error(function () {

            });
            //Race
            $http({
                method: "POST",
                url: allUrl.getRacesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.Races = data.Data;
                } else {

                }
            }).error(function () {

            });


            //学历等级
            $http({
                method: "POST",
                url: allUrl.getEducationLevelUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.EducationLevel = data.Data;
                } else {

                }
            }).error(function () {

            });




        };

        return   {
            initSometing:initLocations
        }
    })
    .factory('allCarsMsg',function () {
        var allCars=[];

        return {
            all:function () {
                return allCars;
            },
            getCarById:function (id) {
                for (var i = 0; i < allCars.length; i++) {
                    if (allCars[i].id == id) {
                        return allCars[i];
                    }
                }
                return null;
            },
            setAllCars:function (data) {
                allCars=[];
                allCars=data;
            }
        };
    })
    .factory('walletMsgs',function ($http) {

    })
    .factory('bookingDetailMsgs',function ($http) {

    });


serviceModule.directive('myheader', function () {
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
