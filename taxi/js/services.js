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
        searchUrl: 'http://58.246.122.118:12305/api/VehicleShareQuery',
        getLocationsUrl: 'http://58.246.122.118:12305/Select/QueryParkingSpace',
        getCategorysUrl: 'http://58.246.122.118:12305/Select/QueryVehicleType',
        getRentForUrl: 'http://58.246.122.118:12305/Select/QueryLeaseType',
        loginUrl:"http://58.246.122.118:12305/api/Login",
        isAutUserUrl:'http://58.246.122.118:12305/api/GetUserInfo',
        signin_fUrl:'',
        getHasEmailUrl:'http://58.246.122.118:12305/api/EmailCheck',
        getHasNRICUrl:'http://58.246.122.118:12305/api/CheckNRIC',
        signin_sUrl:'http://58.246.122.118:12305/api/Register',
        getLicenseTypesUrl:'http://58.246.122.118:12305/Select/QueryLeaseType',
        getNationalitiesUrl:'http://58.246.122.118:12305/Select/GetNationality',
        getRacesUrl:'http://58.246.122.118:12305/Select/GetRace',
        getEducationLevelUrl:'http://58.246.122.118:12305/Select/GetEducationLevel',
        getPriceListUrl:'http://58.246.122.118:12305/api/VehicleLeasePrice',
        getUserWalletUrl:'http://58.246.122.118:12305/api/GetBookingsWallet',
        bookingTheCarUrl:'http://58.246.122.118:12305/api/LeaseVehicle ',
        getCarAvailableStateUrl:'http://58.246.122.118:12305/api/VehicleShareIdleDay',
        getBookingMsgByIdUrl:'http://58.246.122.118:12305/api/UserDetailByRef',
        getAllMyBookingMsgsUrl:'http://58.246.122.118:12305/Bookings/QueryUsersBookings',
        getAllWalletMsgsUrl:'http://58.246.122.118:12305/LogWallet/MobileGetList',
        getUserDetailUrl:'http://58.246.122.118:12305/api/GetUserDetail',
        getUserLastBookingUrl:'http://58.246.122.118:12305/Bookings/QueryUsersBookingsDetail',

    }
})
    .factory('appContext',function (allUrl) {
        var appMsg= {
            allCarsMsg: [],
            bookingDetailMsgs: [],
            userMsg: {},
            isAut:false,
            token:'',
            username:'P J',
            isEnoughBalance:false,
            userAccountMoney:0,
            isAgreeMe:false,
            bookingState:['Apply','Start','Renew','Cancel','Finish'],
            walletStates:['','Consume ','Recharge','CancelOrder','SpecialOffer'],
            isSidemenu: false,
            searchMsg:{
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                location: '0',
                category: '0',
                rentFor: '0',
                searchUrl: allUrl.searchUrl,
                getLocationsUrl: allUrl.getLocationsUrl,
                locations:[],
                categorys:[],
                rentFors:[]
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
                Phone:'',
                firstSignUpCompete:false,

                LicenseType:'0',
                Salutation:'1',
                Gender:'1',
                Nationality:'1',
                Race:'1',
                MaritalStatus:'1',
                EducationLevel:'1',
                BlockNo:'',
                Storey:'',
                UnitNo:'',
                StreetName:'',
                PostalCode:'',
                DateOfBirth:'',
                LicenseIssueDate:'',
                TVDLIssue:'',
                TVDLExpiry:'',
                PVDLIssue:'',
                PVDLExpiry:''
            },
            allCurrentSearchCarMsgs:{

            },
            currentSearchCarMsg:{},
            fromBookingPage:{
                id:'',
                isFromBooking:false
            },
            smartEmail:'taxishare-enquiry@smrt.com.sg',
            hostName:'http://192.168.0.132/taxi',
            errorMsg:{
                netError:''
            },
            motaiTishiBox:{
                title:'',
                msg:''
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
    .factory('JIANCE', function ($http, path,allUrl,appContext) {

        function doFirst() {
            var url = allUrl.isAutUserUrl;
            var isRemeberMe = localStorage.getItem('isRemeberMe');
            var token = '';
            if (isRemeberMe && isRemeberMe == 'true') {
                token = localStorage.getItem('Token');
            } else {
                token = sessionStorage.getItem('Token');
            }
            if (token && token != '') {
                appContext.getAll().isAut = true;
                appContext.getAll().token=token;
                appContext.getAll().username =  localStorage.getItem('Username');
                $http({
                    method: "POST",
                    url: url,
                    data:{},
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Basic " + token
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.MsgType == 'Success') {
                        appContext.getAll().isAut=true;
                        appContext.getAll().token=token;
                        appContext.getAll().username=data.Info;
                        localStorage.setItem('Username',data.Info);
                    } else {
                        appContext.getAll().isAut = false;
                        appContext.getAll().token = '';
                        appContext.getAll().username='P J';
                    }
                }).error(function () {
                    appContext.getAll().isAut = false;
                    appContext.getAll().token = '';
                    appContext.getAll().username='P J';
                })
            } else {
                //本地没有token
                appContext.getAll().isAut = false;
                appContext.getAll().token = '';
                appContext.getAll().username='P J';
            }



        }

        return {init: doFirst};
    })

    .factory('initSometing',function ($http,appContext,allUrl) {
        function initLocations() {
            //所有位置
            $http({
                method: "POST",
                url: allUrl.getLocationsUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.locations = data.Data;
                } else {

                }
            }).error(function () {

            });
        };

        //所有车型
        $http({
            method: "POST",
            url: allUrl.getCategorysUrl,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                appContext.getAll().searchMsg.categorys = data.Data;
            } else {

            }
        }).error(function () {

        });



        //所有租赁类型
        $http({
            method: "POST",
            url: allUrl.getRentForUrl,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                appContext.getAll().searchMsg.rentFors = data.Data;
            } else {

            }
        }).error(function () {

        });

        return   {
            initSometing:initLocations
        }
    })
    .factory('initSignupSelectOptions',function ($http,appContext,allUrl) {
        function initOptions() {
            //注册缘由
            $http({
                method: "POST",
                url: allUrl.getLicenseTypesUrl,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().LicenseTypes = data.Data;
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
                    appContext.getAll().Nationalities = data.Data;
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
                    appContext.getAll().Races = data.Data;
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
                    appContext.getAll().EducationLevel = data.Data;
                } else {

                }
            }).error(function () {

            });
        }
        return   {
            init:initOptions
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
                    if (allCars[i].ID == id) {
                        return allCars[i];
                    }
                }
                return null;
            },
            setAllCars:function (data) {
                allCars=[];
                allCars=data;
                return allCars;
            },
            clear:function () {
                allCars=[];
                return allCars;
            }
        };
    })
    .factory('walletMsgs',function ($http) {

    })
    .factory('bookingDetailMsgs',function ($http) {

    })
    .factory('logOut',function (JIANCE,appContext) {
       return {
           logOut:function () {
               localStorage.removeItem('isRemeberMe');
               localStorage.removeItem('Username');
               localStorage.removeItem('Token');
               sessionStorage.removeItem('Token');
               appContext.getAll().isAut=false;
               appContext.getAll().token='';
               JIANCE.init();
               window.location.replace("#/login")
           }
       }
    })
    .factory('noAutGoLoginPage',function (appContext) {
        return {
            init:function (isFromBooking,id,goToUrl) {
                isFromBooking=isFromBooking || false;
                id =id || '';
                appContext.getAll().fromBookingPage.isFromBooking=isFromBooking;
                appContext.getAll().fromBookingPage.id=id;
                var isAut=appContext.getAll().isAut;
                if(!isAut){
                    window.location.replace('#/login');
                }else{
                    if(goToUrl){
                        window.location.replace(goToUrl);
                    }
                }
            }
        }
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
