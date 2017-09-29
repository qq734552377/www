/**
 * Created by pj on 2017/8/16.
 */
var appControllers = angular.module('appControllers', ["allservice"]);

appControllers.controller('appCtr', function ($scope, JIANCE, path, appContext, initSometing, logOut) {
    initSometing.initSometing();//初始化下拉菜单选项
    JIANCE.init();//初始化是否已登录和token值
    appContext.getAll().isSidemenu = path.getResult().isSidemenu;//初始化isSidemenu
    $scope.appContext = appContext.getAll();

    $scope.logOut = function () {
        logOut.logOut();
    }
    $scope.back = function () {
        history.back();
    }

    $scope.$watch('appContext.isAut', function (newValue, oldValue, scope) {
        console.log('用户是否已登录： ' + newValue)
        if (newValue == false) {
            // window.location.replace('#/login');
        }
    });

    $scope.scrollToTop=function () {
        $("html, body").animate({
            scrollTop: $("#bodyHeader").offset().top }, {duration: 500,easing: "swing"});
    };


    $scope.scrollToMap=function () {
        $("html, body").animate({
            scrollTop: $("#adressMap").offset().top }, {duration: 500,easing: "swing"});
    };
    $scope.motaiBox = appContext.getAll().motaiTishiBox;
    $scope.isAllWaitting = appContext.getAll().isAllWaitting;


    $(window).scroll(function(){
        if($(window).scrollTop() >1600){
            $("#movetoTop").fadeIn(1000);//一秒渐入动画
        }else{
            $("#movetoTop").fadeOut(500);//一秒渐隐动画
        }
    });

});

appControllers.controller('loginCtr', function ($scope, $http, allUrl, JIANCE, appContext) {
    $scope.isRemeberMe = true;
    $scope.errorState = false;
    $scope.errorMsg = 'Incorrect account name or password!';

    $scope.loginMsg = {
        url: allUrl.loginUrl,
        email: '',
        password: '',
        loginSucessUrl: '#/search'
    };

    $scope.login = function () {
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

                    appContext.getAll().isAut = true;
                    appContext.getAll().token = data.Info;

                    JIANCE.init();

                    if (appContext.getAll().fromBookingPage.isFromBooking) {
                        window.location.replace('#/booking/' + appContext.getAll().fromBookingPage.id);
                    } else {
                        window.location.replace($scope.loginMsg.loginSucessUrl);
                    }
                } else {
                    $scope.errorState = true;
                    $scope.errorMsg = data.Info;
                }

            }).error(function () {
                $scope.errorState = true;
                $scope.errorMsg = appContext.getAll().errorMsg.netError;
            });
        }

    }
})
    .controller('forgetPasswordCtr', function ($scope, $http, allUrl) {
        $scope.Email = '';
        $scope.errorMsg = {
            emailMsg: '',
            emailSpan: ''
        };
        $scope.$watch('Email', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length < 8) {
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data: {Email: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                if (data.MsgType == 'Success') {
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan = 'success-span';
                    scope.errorMsg.emailMsg = 'Available';
                } else {
                    //没有注册过
                    scope.errorMsg.emailSpan = 'error-span';
                    scope.errorMsg.emailMsg = data.Info;
                }
            });
        });

        $scope.sub = function () {

        }
    })
    .controller('signinCtr', function ($scope, $http, $state, allUrl, appContext) {

        $scope.signin_f = appContext.getAll().signinMsg;

        $scope.errorMsg = {
            emailMsg: '',
            emailSpan: '',
            passwordMsg: '',
            passwordSpan: '',
            passwordAgainMsg: '',
            passwordAgainSpan: '',
            NRICMsg: '',
            NRICSpan: '',
            PhoneMsg: '',
            PhoneSpan: ''
        };

        $scope.$watch('signin_f.Email', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length < 8) {
                scope.errorMsg.emailSpan = '';
                scope.errorMsg.emailMsg = '';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data: {Email: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan = 'error-span';
                    scope.errorMsg.emailMsg = 'Already exists!';
                } else {
                    //没有注册过
                    scope.errorMsg.emailSpan = 'success-span';
                    scope.errorMsg.emailMsg = 'Available';
                }
            });
        });
        $scope.$watch('signin_f.Password', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.passwordSpan = '';
                scope.errorMsg.passwordMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.passwordSpan = 'error-span';
                scope.errorMsg.passwordMsg = 'At least 8';
            } else {
                scope.errorMsg.passwordSpan = 'success-span';
                scope.errorMsg.passwordMsg = 'OK';
            }
        });

        $scope.$watch('signin_f.PasswordAgain', function (newValue, oldValue, scope) {
            if (scope.signin_f.Password.length < 8) {
                return;
            }
            if (newValue == scope.signin_f.Password) {
                if (scope.signin_f.Password != '') {
                    scope.errorMsg.passwordAgainSpan = 'success-span';
                    scope.errorMsg.passwordAgainMsg = 'OK';
                } else {
                    scope.errorMsg.passwordAgainSpan = '';
                    scope.errorMsg.passwordAgainMsg = '';
                }
            } else {
                scope.errorMsg.passwordAgainSpan = 'error-span';
                scope.errorMsg.passwordAgainMsg = 'Mismatch';
            }
        });

        $scope.$watch('signin_f.NRIC', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.NRICSpan = '';
                scope.errorMsg.NRICMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.NRICSpan = 'error-span';
                scope.errorMsg.NRICMsg = 'Not available';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasNRICUrl,
                data: {NRIC: newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    //Nric可用
                    scope.errorMsg.NRICSpan = 'success-span';
                    scope.errorMsg.NRICMsg = 'OK';
                } else {
                    //Nric不可用
                    scope.errorMsg.NRICSpan = 'error-span';
                    scope.errorMsg.NRICMsg = 'Not available';
                }
            });
        });

        $scope.$watch('signin_f.Phone', function (newValue, oldValue, scope) {
            if (newValue == undefined || newValue.length == 0) {
                scope.errorMsg.PhoneSpan = '';
                scope.errorMsg.PhoneMsg = '';
                return;
            }
            if (newValue.length < 8) {
                scope.errorMsg.PhoneSpan = 'error-span';
                scope.errorMsg.PhoneMsg = 'At least 8';
            } else {
                scope.errorMsg.PhoneSpan = 'success-span';
                scope.errorMsg.PhoneMsg = 'OK';
            }
        });
        $scope.signIn = function () {

            if ($scope.signin_f.Email == undefined || $scope.signin_f.Email == '' ||
                $scope.signin_f.Password == undefined || $scope.signin_f.Password == '' ||
                $scope.signin_f.PasswordAgain == undefined || $scope.signin_f.PasswordAgain == '' ||
                $scope.signin_f.Name == undefined || $scope.signin_f.Name == '' ||
                $scope.signin_f.NRIC == undefined || $scope.signin_f.NRIC == '' ||
                $scope.signin_f.Phone == undefined || $scope.signin_f.Phone == ''
            ) {
                return;
            }

            if ($scope.signin_f.Password.length < 8 || $scope.signin_f.Password != $scope.signin_f.PasswordAgain) {
                return;
            }

            if ($scope.errorMsg.emailSpan != 'success-span' || $scope.errorMsg.NRICSpan != 'success-span' || $scope.errorMsg.PhoneSpan != 'success-span') {
                return;
            }
            $scope.signin_f.firstSignUpCompete = true;
            $state.go('signin_second');
        }


    })
    .controller('signin_secondCtr', function ($scope, $http, $state, appContext, allUrl) {
        console.log(appContext.getAll().signinMsg)
        if (!appContext.getAll().signinMsg.firstSignUpCompete) {
            $state.go('signin_first');
            return;
        }
        $('#modalTdvlPhoto').modal('show');

        $scope.msgAboutPic = 'NRIC, Driving License, TDVL',
            $scope.picSrc = 'img/tpdv.jpg';

        $scope.errorState = false;
        $scope.errorMsg = '';

        $scope.signin_s = appContext.getAll().signinMsg;
        $scope.sub = function () {
            if ($scope.signin_s.BlockNo == undefined || $scope.signin_s.BlockNo == '' ||
                $scope.signin_s.Storey == undefined || $scope.signin_s.Storey == '' ||
                $scope.signin_s.UnitNo == undefined || $scope.signin_s.UnitNo == '' ||
                $scope.signin_s.StreetName == undefined || $scope.signin_s.StreetName == '' ||
                $scope.signin_s.PostalCode == undefined || $scope.signin_s.PostalCode == ''
            ) {
                return;
            }
            if ($scope.signin_s.DateOfBirth == undefined || $scope.signin_s.DateOfBirth == '' ||
                $scope.signin_s.LicenseIssueDate == undefined || $scope.signin_s.LicenseIssueDate == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the Date of Birth and Driving License Issue Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }


            if ($scope.signin_s.TVDLIssue == undefined || $scope.signin_s.TVDLIssue == '' ||
                $scope.signin_s.TVDLExpiry == undefined || $scope.signin_s.TVDLExpiry == '') {
                $scope.errorState = true;
                $scope.errorMsg = 'Please fill out the TDVL First Issue Date and TDVL Expiry Date,thanks! ';
                return;
            } else {
                $scope.errorState = false;
            }

            var pic1 = document.getElementById("signInFileFront").files[0];
            var pic2 = document.getElementById("signInFileBack").files[0];
            var pic3 = document.getElementById("signInMugShot").files[0];
            var pic4 = undefined;


            if ($scope.signin_s.LicenseType == 0) {
                pic4 = document.getElementById("PDVLLetter").files[0];
                if (pic4 == undefined) {
                    return;
                }
            }


            if (pic1 == undefined || pic2 == undefined || pic3 == undefined) {
                return;
            }

            appContext.getAll().isAllWaitting = true;
            // 提交图片
            postMultipart(allUrl.signin_sUrl, $scope.signin_s, pic1, pic2, pic3, pic4).success(function (data) {
                console.log(data);

                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    appContext.getAll().fromBookingPage.isFromBooking = true;
                    window.location.replace('#/auditPage');
                } else {
                    $scope.errorState = true;
                    $scope.errorMsg = data.Info;
                }
            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                $scope.errorState = true;
                $scope.errorMsg = appContext.getAll().errorMsg.netError;
            });
        }

        function postMultipart(url, data, pic1, pic2, pic3, pic4) {
            var fd = new FormData();
            angular.forEach(data, function (val, key) {
                fd.append(key, val);
            });
            fd.append('VerifyFront', pic1);
            fd.append('VerifyBack', pic2);
            fd.append('MugShot', pic3);
            fd.append('PDVLLetter', pic4);
            var args = {
                method: 'POST',
                url: url,
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            };
            return $http(args);
        }


    })
    .controller('auditPageCtr', function ($scope, $http, $state, appContext, allUrl) {
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/login');
            return;
        }

        $scope.waitObj = {
            isShowAll: true,
            isShowWaitImg: false,
            isShowlockBtn: true,
            title: 'Congratulations,registered successfully !',
            msg: 'We will review your registration information within 0 to 24 hours. If approved, we will send the email to your email notification.Then you can use the car rental service.'
        };
    });

appControllers.controller('searchCtr', function ($scope, $http, appContext, allCarsMsg, allUrl) {

    $scope.searchMsg = appContext.getAll().searchMsg;

    $scope.isWaitting = true;
    $scope.isNoCar = false;
    $scope.allCarsMsgs = allCarsMsg.all();

    if ($scope.searchMsg.startTime == '' || compareTimeWithCurrentTime($scope.searchMsg.startDate + " " + $scope.searchMsg.startTime)) {
        initsearchTime($scope);
    }

    $scope.$watch('searchMsg.location', function (newValue, oldValue, scope) {

        scope.searchMsg.vehicleNumbers = [];

        if (newValue == 0) {
            scope.searchMsg.vehicleNumber = '0';
            return;
        }

        $http({
            method: "POST",
            url: allUrl.getVehicleNumberBylocationUrl,
            data: {
                BindParking: newValue
            }
        }).success(function (data) {
            console.log(data);
            if (data.MsgType == 'Success') {
                appContext.getAll().searchMsg.vehicleNumbers = data.Data;
                if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, $scope.searchMsg.vehicleNumber)) {
                    scope.searchMsg.vehicleNumber = '0';
                }
            } else {
                scope.searchMsg.vehicleNumber = '0';
            }

        }).error(function () {
            scope.searchMsg.vehicleNumber = '0';
        });

    });

    $scope.search = function () {
        $scope.isWaitting = true;
        $scope.isNoCar = false;
        $scope.allCarsMsgs = allCarsMsg.clear();

        if ($scope.searchMsg.location == 0) {
            $scope.isWaitting = false;
            $scope.isNoCar = true;
            return;
        }


        //请求所有的车辆信息
        $http({
            method: "POST",
            url: $scope.searchMsg.searchUrl,
            data: {
                StartTime: ($scope.searchMsg.startDate + ' ' + $scope.searchMsg.startTime + ':00'),
                Duration: $scope.searchMsg.duration,
                LeaseType: $scope.searchMsg.rentFor,
                VehiceType: $scope.searchMsg.category,
                Address: $scope.searchMsg.location,
                PlateID: $scope.searchMsg.vehicleNumber
            },
            headers: {'Content-Type': 'application/json'}
        }).success(function (data) {
            console.log(data);
            $scope.isWaitting = false;
            if (data.MsgType == 'Success') {
                $scope.isNoCar = false;
                $scope.allCarsMsgs = allCarsMsg.setAllCars(data.Data);
                console.log($scope.allCarsMsgs)
            } else {
                $scope.isNoCar = true;
            }

        }).error(function () {
            $scope.isWaitting = false;
            $scope.isNoCar = true;
        });

    }


    $scope.search();
})
    .controller('mainsearchCtr', function ($scope, $http, appContext, allUrl) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        if ($scope.searchMsg.startTime == '' || compareTimeWithCurrentTime($scope.searchMsg.startDate + " " + $scope.searchMsg.startTime)) {
            initsearchTime($scope);
        }

        $scope.mainsearch = function () {
            if ($scope.searchMsg.location == 0) {
                $scope.motaiBox.title = 'Promotion:';
                $scope.motaiBox.msg = "Pelease select a location,thanks!";
                $('#moTaiTishiBox').modal('show');
                return;
            }
            window.location.replace('#/search');
        }

        $scope.$watch('searchMsg.location', function (newValue, oldValue, scope) {

            scope.searchMsg.vehicleNumbers = [];
            if (newValue == 0) {
                scope.searchMsg.vehicleNumber = '0';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getVehicleNumberBylocationUrl,
                data: {
                    BindParking: newValue
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    appContext.getAll().searchMsg.vehicleNumbers = data.Data;
                    if (data.Data.length == 0 || !hasVehicleNumberInArray(data.Data, $scope.searchMsg.vehicleNumber)) {
                        scope.searchMsg.vehicleNumber = '0';
                    }

                } else {
                    scope.searchMsg.vehicleNumber = '0';
                }
            }).error(function () {
                scope.searchMsg.vehicleNumber = '0';
            });

        });
    });

appControllers.controller('sidemenuCtr', function ($scope, $state, $location) {
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
    .controller('accountCtr', function ($scope, $http, $interval, allUrl, appContext, getWallet) {
        $scope.$emit('curPath', '');

        // $scope.motaiBox=appContext.getAll().motaiTishiBox;

        $scope.tishiBox = {
            isShow: true,
            title: 'Promotion:',
            msg: ' You will not be able to start any trip or make any bookings until you do a top up.'
        };

        $scope.remainingTime = {
            isTimeout: false,
            day: '0',
            hour: '0',
            min: '0',
            second: '0'
        };


        getUserDetailMsg();
        getUserLastBookingMsg();
        getWallet.init();

        $scope.goToReportIssue = function () {
            appContext.getAll().fromBookingPage.isFromBooking = true;
            window.location.replace('#sidemenu/reportIssue/' + appContext.getAll().lastBooking.list.LeaseNumber);
        };
        $scope.goToEndtrip = function () {
            $('#issuerEndTrip').modal('hide');
            $('body').toggleClass('modal-open');
            $('.modal-backdrop.fade.in').remove();
            //todo 判断车是否进停车场范围

            appContext.getAll().fromBookingPage.isFromBooking = true;
            window.location.href = '#/sidemenu/endtrip/' + appContext.getAll().lastBooking.list.LeaseNumber;
        };
        $scope.getCanStartTrip = function () {
            appContext.getAll().isAllWaitting = true;

            $http({
                method: 'POST',
                url: allUrl.getCanStartTripUrl,
                data: {
                    OpenClose: '1',
                    LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    appContext.getAll().fromBookingPage.isFromBooking = true;
                    window.location.replace("#/sidemenu/startTrip/" + appContext.getAll().lastBooking.list.LeaseNumber);
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    appContext.getAll().motaiTishiBox.title = 'Promotion:';
                    appContext.getAll().motaiTishiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show');
                }
            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                appContext.getAll().motaiTishiBox.title = 'Promotion:';
                appContext.getAll().motaiTishiBox.msg = appContext.getAll().errorMsg.netError;
                $('#moTaiTishiBox').modal('show');
            });

        };
        function getUserDetailMsg() {
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getUserDetailUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    appContext.getAll().userMsg = data.Data;

                    if(data.Data.UserStatus != 'Success'){
                        $scope.tishiBox = {
                            isShow: true,
                            title: 'Promotion:',
                            msg: data.Info
                        };
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }

                }

            }).error(function () {
                $scope.tishiBox = {
                    isShow: true,
                    title: 'Promotion:',
                    msg: appContext.getAll().errorMsg.netError
                };
            });
        }

        function getUserLastBookingMsg() {
            $http({
                method: 'POST',
                url: allUrl.getUserLastBookingUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    appContext.getAll().lastBooking = data.Data;
                    if (data.Data.list.LeaseStatus == 1) {
                        $scope.remainingTime.endtime = data.Data.list.LeaseEndTime;
                        $scope.remainingTime.timer = $interval(function () {
                            getRemainTime($scope.remainingTime);
                        }, 1000);
                    }
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    appContext.getAll().lastBooking = undefined;
                }

            }).error(function () {
                appContext.getAll().lastBooking = undefined;
            });
        }


        $scope.$on('$destroy', function () {
            if ($scope.remainingTime.timer) {
                $interval.cancel($scope.remainingTime.timer);
            }
        });
    })
    .controller('editprofileCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Edit Profile');

    })
    .controller('walletCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'E-wallet History');
        $scope.sourceBookings = [];
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

        querryAllWalletMsgs();


        function querryAllWalletMsgs() {
            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllWalletMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }

                }

            }).error(function () {

            });
        }


    })
    .controller('topupCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Top Up');
        $scope.tishiBox = {
            isShow: true,
            color:'alert-info',
            title: 'Promotion:',
            msg: 'Top up $50 and enjoy a 10% off for your next booking. Take advantage now.'
        };
    })
    .controller('mybookingsCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Booking');
        $scope.sourceBookings = [];
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


        $scope.querry = queryAllBookings;

        $scope.querry();

        function queryAllBookings() {

            $scope.sourceBookings.splice(0, $scope.sourceBookings.length);
            initPage($scope);
            $http({
                method: 'POST',
                url: allUrl.getAllMyBookingMsgsUrl,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    $scope.sourceBookings = data.Data.Data;
                    initPage($scope);
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }

                }

            }).error(function () {

            });
        }

    })
    .controller('referCtr', function ($scope) {
        $scope.$emit('curPath', 'Refer a Friend');
    })
    .controller('startTripCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'Start Trip');
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/sidemenu/account');
            return;
        }

        $scope.waitObj = {
            isShowAll: true,
            isShowWaitImg: true,
            isShowlockBtn: false,
            title: 'Unlocking car, please wait',
            msg: 'Kindly inspect the vehicle for exterior damages/defects while we unlock the car for you.'
        };

        $scope.goToAccount = function () {
            if (!appContext.getAll().startTrip.startTripSure1 || !appContext.getAll().startTrip.startTripSure2 || !appContext.getAll().startTrip.startTripSure3 || !appContext.getAll().startTrip.startTripSure4 || !appContext.getAll().startTrip.startTripSure5) {
                return;
            }
            ;


            window.location.replace('#/sidemenu/account');
        };
        $scope.goToReportIssue = function () {
            appContext.getAll().fromBookingPage.isFromBooking = true;
            window.location.replace('#/sidemenu/reportIssue');
        };
        $scope.unlockCar = function () {
            startTrip();
        };

        startTrip();
        function startTrip() {

            $scope.waitObj = {
                isShowAll: true,
                isShowWaitImg: true,
                isShowlockBtn: false,
                title: 'Unlocking car, please wait',
                msg: 'Kindly inspect the vehicle for exterior damages/defects while we unlock the car for you.'
            };
            $http({
                method: 'POST',
                url: allUrl.StartTripUrl,
                data: {
                    OpenClose: '1',
                    LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);

                if (data.MsgType == 'Success') {
                    $scope.waitObj.isShowAll = false;

                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.isShowlockBtn = true;
                    $scope.waitObj.title = 'Unlocking car failed ，please try agian ！'
                    $scope.waitObj.msg = data.Info;
                    ;
                }
            }).error(function () {
                $scope.waitObj.isShowWaitImg = false;
                $scope.waitObj.title = 'Promotion:'
                $scope.waitObj.msg = appContext.getAll().errorMsg.netError;
            });
        }
    })
    .controller('reportIssueCtr', function ($scope, $http, $stateParams, allUrl, appContext) {
        $scope.$emit('curPath', 'Report Issue');

        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/login');
            return;
        }

        $scope.reportIssueObj = {
            LeaseNumber: $stateParams.id,
            IssueTypeId: '1',
            Title: '',
            Remarks: ''
        };

        $scope.reportIssue = function () {

            var pic1 = document.getElementById("IssuePhoto1").files[0];

            if (pic1 == undefined) {
                return;
            }
            appContext.getAll().isAllWaitting = true;
            postMultipart(allUrl.reportIssueUrl, $scope.reportIssueObj, pic1).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                if (data.MsgType == 'Success') {
                    window.location.replace('#/sidemenu/account');
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = 'Report success!If you\'ve found other problems, you can click on Need Help -> Report Issue.';
                    $('#moTaiTishiBox').modal('show');
                } else {
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show');
                }
            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                $scope.motaiBox.title = 'Promotion:';
                $scope.motaiBox.msg = appContext.getAll().errorMsg.netError;
                $('#moTaiTishiBox').modal('show');
            });


        }

        function postMultipart(url, data, pic1) {

            var fd = new FormData();
            angular.forEach(data, function (val, key) {
                fd.append(key, val);
            });
            fd.append('IssuePhoto1', pic1);
            var args = {
                method: 'POST',
                url: url,
                data: fd,
                headers: {
                    'Content-Type': undefined,
                    Authorization: "Basic " + appContext.getAll().token
                },
                transformRequest: angular.identity
            };
            return $http(args);
        }

    })
    .controller('endtripCtr', function ($scope, $http, allUrl, appContext) {
        $scope.$emit('curPath', 'End Trip');
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/sidemenu/account');
            return;
        }
        $scope.waitObj = {
            isShowAll: false,
            isShowWaitImg: true,
            isShowlockBtn: false,
            title: 'Locking car, please wait',
            msg: 'Please wait while we ending your trip. Do not press the BACK button.'
        };

        $scope.lockCar = lockCarById;

        function lockCarById() {
            if (!appContext.getAll().endTrip.endtripSure1 || !appContext.getAll().endTrip.endtripSure2 || !appContext.getAll().endTrip.endtripSure3 || !appContext.getAll().endTrip.endtripSure4 || !appContext.getAll().endTrip.endtripSure5) {
                return;
            }

            $scope.waitObj = {
                isShowAll: true,
                isShowWaitImg: true,
                isShowlockBtn: false,
                title: 'Locking car, please wait',
                msg: 'Please wait while we ending your trip. Do not press the BACK button.'
            };

            $http({
                method: 'POST',
                url: allUrl.endTripUrl,
                data: {
                    OpenClose: '2',
                    DesignatedLocation: appContext.getAll().endTrip.endtripSure1,
                    CarKeyBacked: appContext.getAll().endTrip.endtripSure2,
                    NoThingLeave: appContext.getAll().endTrip.endtripSure3,
                    TakePhotoWithCarCondition: appContext.getAll().endTrip.endtripSure4,
                    SwitchOffMDT: appContext.getAll().endTrip.endtripSure5,
                    LeaseNumber: appContext.getAll().lastBooking.list.LeaseNumber
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);

                if (data.MsgType == 'Success') {
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.title = 'Thank you for using SMRT TAXI SHARE';
                    $scope.waitObj.msg = 'Please ensure that the taxi is locked before you leave, thank you.';
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    $scope.waitObj.isShowWaitImg = false;
                    $scope.waitObj.isShowlockBtn = true;
                    $scope.waitObj.title = 'Locking car failed ，please try agian ！'
                    $scope.waitObj.msg = data.Info;
                    ;
                }
            }).error(function () {
                $scope.waitObj.isShowWaitImg = false;
                $scope.waitObj.title = 'Promotion:';
                $scope.waitObj.msg = appContext.getAll().errorMsg.netError;
            });
        }


    })
    .controller('extendBookingCtr', function ($scope, $http, $stateParams, allUrl, appContext, getWallet) {
        $scope.$emit('curPath', 'Extend Booking');
        $scope.isWaitting = false;
        // $scope.motaiBox=appContext.getAll().motaiTishiBox;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Comfirm 3 booking per week and get 50% off the 4th booking o!'
        };
        $scope.carPriceList = {};
        $scope.extensionTimes = '1';

        getWallet.init();
        $scope.$watch('extensionTimes', function (newValue, oldValue, scope) {
            $http({
                method: 'POST',
                url: allUrl.getExtensionPaiceListUrl,
                data: {
                    Duration: newValue,
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                $scope.carPriceList = data;

                if (data.MsgType == 'Error') {
                    window.location.replace('#/sidemenu/account');
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show');
                }

            }).error(function () {
                $scope.motaiBox.title = 'Promotion:';
                $scope.motaiBox.msg = appContext.getAll().errorMsg.netError;;
                $('#moTaiTishiBox').modal('show');
            });
        });

        $scope.extend = function () {
            $http({
                method: 'POST',
                url: allUrl.ExtendBookingUrl,
                data: {
                    Duration: $scope.extensionTimes,
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data)
                if (data.MsgType == 'Success') {
                    window.location.replace('#/sidemenu/account');
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = 'Booking succesfully extended up to ' + data.Info;
                    $('#moTaiTishiBox').modal('show');
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace('#/login');
                    }
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show');
                }

            }).error(function () {
                $scope.motaiBox.title = 'Promotion:';
                $scope.motaiBox.msg = appContext.getAll().errorMsg.netError;
                $('#moTaiTishiBox').modal('show');
            });
        };

    });

appControllers.controller('bookingCtr', function ($scope, $http, $stateParams, $timeout, appContext, allUrl, allCarsMsg, getWallet) {
    $scope.timeTable = {
        times: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
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
    var id = $stateParams.id;
    $scope.carMsg = allCarsMsg.getCarById(id);
    $scope.searchMsg = appContext.getAll().searchMsg;
    $scope.isGetCarStateWaitting = true;
    $scope.carPriceList = {};

    $scope.isWaitting = true;
    $scope.tishiBox = {
        isShow: true,
        msg: 'Comfirm 3 booking per week and get 50% off the 4th booking!'
    };

    // $scope.motaiBox=appContext.getAll().motaiTishiBox;
    if (!$scope.carMsg || !$scope.carMsg.ID || !$scope.searchMsg.startTime) {
        window.location.replace("#/search");
        return;
    }

    $scope.currentDay = 0;


    var startDateTime = ($scope.searchMsg.startDate+ ' ' + $scope.searchMsg.startTime + ':00');
    $scope.currentDate = $scope.searchMsg.startDate;

    $scope.goToLogin = function () {
        appContext.getAll().fromBookingPage.isFromBooking = true;
        appContext.getAll().fromBookingPage.id = id;
        window.location.replace('#/login');
    }

    $scope.geToTopup = function () {
        appContext.getAll().fromBookingPage.isFromBooking = true;
        appContext.getAll().fromBookingPage.id = id;
        window.location.replace('#/sidemenu/topup');
    }

    $scope.getPriceList = getPriceList;

    $scope.getPriceList();

    function getPriceList() {
        $scope.isWaitting = true;
        $scope.carPriceList = {};
        $http({
            method: 'POST',
            url: allUrl.getPriceListUrl,
            data: {
                ID: $scope.carMsg.ID,
                StartTime: startDateTime,
                Duration: $scope.carMsg.Duration,
                VehiceType: $scope.carMsg.VehicleType,
                LeaseType: $scope.carMsg.LeaseType,
                VehicleModel: $scope.carMsg.VehicleModel
            }
        }).success(function (data) {
            console.log(data)
            $scope.isWaitting = false;
            $scope.carPriceList = data;

        }).error(function () {

        });
        if (appContext.getAll().isAut) {
            getWallet.init();
        }

    }


    $scope.jumpDayCarState = getCarAvailableStateWithDays;

    $scope.jumpDayCarState(0);

    $scope.bookingTheCar = function () {
        if (!appContext.getAll().isAgreeMe) {
            $scope.motaiBox.title = 'Accept Terms and Conditions';
            $scope.motaiBox.msg = 'To proceed booking the vehicle, you need to read and accept the Terms and Conditions.';
            $('#moTaiTishiBox').modal('show');
            return;
        }
        appContext.getAll().isAllWaitting = true;
        $http({
            method: 'POST',
            url: allUrl.bookingTheCarUrl,
            data: {
                ID: $scope.carMsg.ID,
                StartTime: startDateTime,
                Duration: $scope.carMsg.Duration,
                VehiceType: $scope.carMsg.VehicleType,
                LeaseType: $scope.carMsg.LeaseType,
                VehicleModel: $scope.carMsg.VehicleModel
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Basic " + appContext.getAll().token
            }
        }).success(function (data) {
            console.log(data);
            appContext.getAll().isAllWaitting = false;
            if (data.MsgType == 'Success') {
                var bookingId = data.Info;
                appContext.getAll().fromBookingPage.isFromBooking = true;
                window.location.replace('#/bookingcomfirm/' + bookingId);
            } else {
                if (data.MsgType == 'TokenError') {
                    appContext.getAll().isAut = false;
                    return;
                }
                $scope.motaiBox.title = 'Promotion:';
                $scope.motaiBox.msg = data.Info;
                $('#moTaiTishiBox').modal('show');
            }

        }).error(function () {
            appContext.getAll().isAllWaitting = false;
            $scope.motaiBox.title = 'Promotion:';
            $scope.motaiBox.msg = appContext.getAll().errorMsg.netError;
            $('#moTaiTishiBox').modal('show');
        });


    }

    function getCarAvailableStateWithDays(days) {
        if (days < 0 || days > 28) {
            return;
        }

        $scope.currentDay = days;
        $scope.currentDate = addDayWithStringDateReturnFormatStringDate(startDateTime, days).split(' ')[0];

        $scope.isGetCarStateWaitting = true;

        $http({
            method: 'POST',
            url: allUrl.getCarAvailableStateUrl,
            data: {
                ID: $scope.carMsg.ID,
                StartTime: addDayWithStringDateReturnFormatStringDate(startDateTime, days),
                VehiceType: $scope.carMsg.VehicleType,
                LeaseType: $scope.carMsg.LeaseType,
                VehicleModel: $scope.carMsg.VehicleModel,
                Address: $scope.carMsg.Address,
            }
        }).success(function (data) {
            console.log(data)
            $scope.isGetCarStateWaitting = false;
            angular.forEach(data.Data, function (val, key) {
                if(val=='Limited Taxis'){
                    $scope.timeTable.bgcolors[key].bgcClass='may-booking-bgc';
                }else if(val=='Available'){
                    $scope.timeTable.bgcolors[key].bgcClass='can-booking-bgc';
                }else{
                    $scope.timeTable.bgcolors[key].bgcClass='not-booking-bgc';
                }
            });
        }).error(function () {
            $scope.isGetCarStateWaitting = false;
        });
    }

})
    .controller('bookingcomfirmCtr', function ($scope, $http, $stateParams, appContext, allUrl) {
        $scope.timeTable = {
            times: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
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
        $scope.lastBookingMsg = {};
        $scope.isWaitting = true;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Congratulations, your booking has been reserved.You may proceed to unlock the taxi in your account at the pickup time .'
        };
        if (!appContext.getAll().fromBookingPage.isFromBooking) {
            window.location.replace('#/search');
            return;
        }


        getLastBookingMsg();

        function getLastBookingMsg() {
            $scope.isWaitting = true;
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getBookingMsgByIdUrl,
                data: {
                    LeaseNumber: $stateParams.id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;

                if (data.MsgType == 'Success') {
                    $scope.lastBookingMsg = data.Data;
                    $scope.tishiBox.isShow = true;
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = data.Info;
                }

            }).error(function () {
                $scope.isWaitting = false;
                $scope.tishiBox.isShow = true;
                $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
            });
        }

    })
    .controller('bookingdetailsCtr', function ($scope, $http, $stateParams, appContext, allUrl) {
        $scope.bookingMsg = {};
        $scope.isWaitting = true;
        $scope.tishiBox = {
            isShow: true,
            msg: 'Comfirm 3 booking  !'
        };


        $scope.cancleTrip = function () {
            $('#issuerCancleTrip').modal('hide');
            $('body').toggleClass('modal-open');
            $('.modal-backdrop.fade.in').remove();
            //取消订单的api调用
            appContext.getAll().isAllWaitting = true;
            $http({
                method: 'POST',
                url: allUrl.cansleBookingUrl,
                data: {
                    OrderNumber: $stateParams.id,
                    LeaseCancelReason: appContext.getAll().endTrip.LeaseCancelReason,//取消理由
                    Memo: appContext.getAll().endTrip.Memo//备注
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                appContext.getAll().isAllWaitting = false;
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    window.location.replace('#/sidemenu/mybookings');
                    $scope.motaiBox.title = 'Promotion:';
                    $scope.motaiBox.msg = data.Info;
                    $('#moTaiTishiBox').modal('show');
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = data.Info;
                }

            }).error(function () {
                appContext.getAll().isAllWaitting = false;
                $scope.isWaitting = false;
                $scope.tishiBox.isShow = true;
                $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
            });

        };

        querryBookingMsgById();

        function querryBookingMsgById() {

            $scope.isWaitting = true;
            $scope.tishiBox.isShow = false;
            $http({
                method: 'POST',
                url: allUrl.getBookingMsgByIdUrl,
                data: {
                    LeaseNumber: $stateParams.id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Basic " + appContext.getAll().token
                }
            }).success(function (data) {
                console.log(data);
                $scope.isWaitting = false;
                if (data.MsgType == 'Success') {
                    $scope.bookingMsg = data.Data;
                } else {
                    if (data.MsgType == 'TokenError') {
                        appContext.getAll().isAut = false;
                        window.location.replace("#/login");
                        return;
                    }
                    $scope.tishiBox.isShow = true;
                    $scope.tishiBox.msg = data.Info;
                }

            }).error(function () {
                $scope.isWaitting = false;
                $scope.tishiBox.isShow = true;
                $scope.tishiBox.msg = appContext.getAll().errorMsg.netError;
            });
        }
    });

appControllers.controller('faqCtr', function ($scope) {

})
    .controller('ourratesCtr', function ($scope) {

    })
    .controller('privacypolicyCtr', function ($scope) {

    })
    .controller('termsCtr', function ($scope) {

    })
    .controller('mainCtr', function ($scope) {

    });


function initPage(scope) {
    scope.pageCount = Math.ceil(scope.sourceBookings.length / scope.avg);
    if (scope.pageCount > 0) {
        scope.currentIndex = 1;
        scope.allPageBookings = paging(scope.sourceBookings, scope.avg);
        scope.currentPageBookings = scope.allPageBookings[0].pageItems;
    } else {
        scope.currentIndex = 0;
        scope.allPageBookings = [];
        scope.currentPageBookings = [];
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

    var startDate = startDateTime.getFullYear() + '-' + ((startDateTime.getMonth() + 1) > 9 ? (startDateTime.getMonth() + 1) : ('0' + (startDateTime.getMonth() + 1))) + '-' + (startDateTime.getDate() > 9 ? (startDateTime.getDate()) : ('0' + startDateTime.getDate()));
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + (endDateTime.getDate() > 9 ? (endDateTime.getDate()) : ('0' + endDateTime.getDate()));
    var startHour = startDateTime.getHours() > 9 ? (startDateTime.getHours() + ":00") : ("0" + startDateTime.getHours() + ":00");
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");

    $scope.searchMsg.startDate = startDate;
    $scope.searchMsg.startTime = startHour;
    $scope.searchMsg.endDate = endDate;
    $scope.searchMsg.endTime = endHour;
}

function getFormatTime(date) {
    var endDateTime = date;
    var endDate = endDateTime.getFullYear() + '-' + ((endDateTime.getMonth() + 1) > 9 ? (endDateTime.getMonth() + 1) : ('0' + (endDateTime.getMonth() + 1))) + '-' + (endDateTime.getDate() > 9 ? (endDateTime.getDate()) : ('0' + endDateTime.getDate()));
    var endHour = endDateTime.getHours() > 9 ? (endDateTime.getHours() + ":00") : ("0" + endDateTime.getHours() + ":00");
    return {
        Date: endDate,
        Time: endHour
    };
}

function getDateByString(stringDatetime) {
    var d = new Date(Date.parse(stringDatetime.replace(/-/g, "/")));
    return d;
}

function addHours(hours) {
    var a = new Date();
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function addByhours(date, hours) {
    var a = date;
    a = a.valueOf();
    a = a + hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function subtractByhours(date, hours) {
    var a = date;
    a = a.valueOf();
    a = a - hours * 60 * 60 * 1000;
    a = new Date(a);
    return a;
}
function compareTimeWithCurrentTime(datetime) {
    var currentDateTime = addHours(0);
    var storageDateTime = getDateByString(datetime.replace("-", "/"));
    if (currentDateTime > storageDateTime) {
        return true
    } else {
        return false
    }
}

function computeWithHours(startTime, endTime) {
    var startDateTime = getDateByString(startTime.replace("-", "/"));
    var endDateTime = getDateByString(endTime.replace("-", "/"));
    var result = endDateTime.getTime() - startDateTime.getTime()

    return result / 3600 / 1000;
}

function addDayWithStringDateReturnFormatStringDate(stringDate, days) {
    var a = getDateByString(stringDate);
    var b = addByhours(a, 24 * days);
    var c = getFormatTime(b);
    return c.Date + ' ' + c.Time + ":00";
}

function hasVehicleNumberInArray(data, vehicleNumber) {
    var result = false;
    for (var i = 0; i < data.length; i++) {
        if (vehicleNumber == data[i].ID) {
            result = true;
        }
    }
    return result;
}

function getRemainTime(target) {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var endDate = getDateByString(target.endtime);
    var end = endDate.getTime();

    var leftTime = end - now;
    //定义变量 d,h,m,s保存倒计时的时间
    var d, h, m, s;


    if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);
        target.isTimeout = false;
    } else {
        d = Math.floor(-leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(-leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(-leftTime / 1000 / 60 % 60);
        s = Math.floor(-leftTime / 1000 % 60);
        target.isTimeout = true;
    }
    target.day = d;
    target.hour = h;
    target.min = m;
    target.second = s;

}