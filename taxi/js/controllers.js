/**
 * Created by pj on 2017/8/16.
 */
var appControllers = angular.module('appControllers', ["allservice"]);

appControllers.controller('appCtr', function ($scope, JIANCE, path, appContext,initSometing) {
    initSometing.initSometing();

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
    appContext.getAll().isSidemenu = path.getResult().isSidemenu;
    $scope.isSidemenu = appContext.getAll();
});

appControllers.controller('loginCtr', function ($scope, $http, allUrl) {
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
        console.log($scope.loginMsg.email + '------' + $scope.loginMsg.password);

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
})
    .controller('forgetPasswordCtr',function ($scope,$http,allUrl) {
        $scope.Email='';
        $scope.errorMsg= {
            emailMsg: '',
            emailSpan: ''
        };
        $scope.$watch('Email',function (newValue, oldValue, scope) {
            if(newValue ==undefined || newValue.length < 8){
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data:{Email:newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                if(data.MsgType == 'Success'){
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan='success-span';
                    scope.errorMsg.emailMsg='Available';
                }else {
                    //没有注册过
                    scope.errorMsg.emailSpan='error-span';
                    scope.errorMsg.emailMsg=data.Info;
                }
            });
        }) ;
        
        $scope.sub=function () {
            
        }
    })
    .controller('signinCtr',function ($scope,$http,$state,allUrl,appContext) {

        if (appContext.signinMsg !=undefined){
            $scope.signin_f=appContext.signinMsg;
        }else{
            $scope.signin_f={
                Email:'',
                Password:'',
                PasswordAgain:'',
                Name:'',
                NRIC:'',
                Phone:''
            };
        }
        $scope.errorMsg={
            emailMsg:'',
            emailSpan:'',
            passwordMsg:'',
            passwordSpan:'',
            passwordAgainMsg:'',
            passwordAgainSpan:'',
            NRICMsg:'',
            NRICSpan:'',
            PhoneMsg:'',
            PhoneSpan:''
        };

        $scope.$watch('signin_f.Email',function (newValue, oldValue, scope) {
            if(newValue ==undefined || newValue.length < 8){
                scope.errorMsg.emailSpan='';
                scope.errorMsg.emailMsg='';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasEmailUrl,
                data:{Email:newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if(data.MsgType == 'Success'){
                    //邮箱已注册过了
                    scope.errorMsg.emailSpan='error-span';
                    scope.errorMsg.emailMsg='Already exists!';
                }else {
                    //没有注册过
                    scope.errorMsg.emailSpan='success-span';
                    scope.errorMsg.emailMsg='Available';
                }
            });
        }) ;
        $scope.$watch('signin_f.Password',function (newValue, oldValue, scope) {
            if(newValue == undefined || newValue.length == 0){
                scope.errorMsg.passwordSpan='';
                scope.errorMsg.passwordMsg='';
                return;
            }
            if(newValue.length < 8){
                scope.errorMsg.passwordSpan='error-span';
                scope.errorMsg.passwordMsg='At least 8';
            }else{
                scope.errorMsg.passwordSpan='success-span';
                scope.errorMsg.passwordMsg='OK';
            }
        });
        
        $scope.$watch('signin_f.PasswordAgain',function (newValue, oldValue, scope) {
            if (scope.signin_f.Password.length < 8){
                return;
            }
            if (newValue==scope.signin_f.Password){
                if(scope.signin_f.Password!=''){
                    scope.errorMsg.passwordAgainSpan='success-span';
                    scope.errorMsg.passwordAgainMsg='OK';
                }else{
                    scope.errorMsg.passwordAgainSpan='';
                    scope.errorMsg.passwordAgainMsg='';
                }
            }else{
                scope.errorMsg.passwordAgainSpan='error-span';
                scope.errorMsg.passwordAgainMsg='Mismatch';
            }
        });

        $scope.$watch('signin_f.NRIC',function (newValue, oldValue, scope) {
            if(newValue ==undefined || newValue.length == 0){
                scope.errorMsg.NRICSpan='';
                scope.errorMsg.NRICMsg='';
                return;
            }
            if ( newValue.length < 8){
                scope.errorMsg.NRICSpan='error-span';
                scope.errorMsg.NRICMsg='Not available';
                return;
            }
            $http({
                method: "POST",
                url: allUrl.getHasNRICUrl,
                data:{NRIC:newValue},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data)
                if(data.MsgType == 'Success'){
                    //Nric可用
                    scope.errorMsg.NRICSpan='success-span';
                    scope.errorMsg.NRICMsg='OK';
                }else {
                    //Nric不可用
                    scope.errorMsg.NRICSpan='error-span';
                    scope.errorMsg.NRICMsg='Not available';
                }
            });
        }) ;

        $scope.$watch('signin_f.Phone',function (newValue, oldValue, scope) {
            if(newValue == undefined || newValue.length == 0){
                scope.errorMsg.PhoneSpan='';
                scope.errorMsg.PhoneMsg='';
                return;
            }
            if(newValue.length < 8){
                scope.errorMsg.PhoneSpan='error-span';
                scope.errorMsg.PhoneMsg='At least 8';
            }else{
                scope.errorMsg.PhoneSpan='success-span';
                scope.errorMsg.PhoneMsg='OK';
            }
        });
        $scope.signIn=function () {

            if ($scope.signin_f.Email==undefined||$scope.signin_f.Email==''||
                $scope.signin_f.Password==undefined||$scope.signin_f.Password==''||
                $scope.signin_f.PasswordAgain==undefined||$scope.signin_f.PasswordAgain==''||
                $scope.signin_f.Name==undefined||$scope.signin_f.Name==''||
                $scope.signin_f.NRIC==undefined||$scope.signin_f.NRIC==''||
                $scope.signin_f.Phone==undefined||$scope.signin_f.Phone==''
            ){
                return;
            }

            if ($scope.signin_f.Password.length < 8||$scope.signin_f.Password!=$scope.signin_f.PasswordAgain){
                return;
            }

            if($scope.errorMsg.emailSpan != 'success-span' || $scope.errorMsg.NRICSpan != 'success-span'||$scope.errorMsg.PhoneSpan != 'success-span'){
                return;
            }

            appContext.signinMsg={
                Email:$scope.signin_f.Email,
                Password:$scope.signin_f.Password,
                PasswordAgain:$scope.signin_f.PasswordAgain,
                Name:$scope.signin_f.Name,
                NRIC:$scope.signin_f.NRIC,
                Phone:$scope.signin_f.Phone
            };

            $state.go('signin_second');
        }


    })
    .controller('signin_secondCtr',function ($scope,$http,$state,appContext,allUrl) {
        console.log(appContext.signinMsg)
        if(appContext.signinMsg==undefined){
            // $state.go('signin_first');
            return;
        }

        $scope.LicenseTypes=appContext.LicenseTypes;
        $scope.Nationalities=appContext.Nationalities;
        $scope.Races=appContext.Races;
        $scope.EducationLevel=appContext.EducationLevel;

        $scope.msgAboutPic='',
        $scope.picSrc='img/tpdvl.jpg';

        $scope.errorState=false;
        $scope.errorMsg='';

        $scope.signin_s={
            Email:appContext.signinMsg.Email,
            Password:appContext.signinMsg.Password,
            Name:appContext.signinMsg.Name,
            NRIC:appContext.signinMsg.NRIC,
            Phone:appContext.signinMsg.Phone,

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
        };

        $scope.$watch('signin_s.LicenseType',function (newValue, oldValue, scope) {
            console.log(newValue)
            if(newValue=='2'){
                scope.msgAboutPic='NRIC, Driving License, TDVL';
                $scope.picSrc='img/tdvl.jpg';
            }else if(newValue=='1'){
                scope.msgAboutPic='NRIC, Driving License, PDVL';
                $scope.picSrc='img/pdvl.jpg';
            }else{
                scope.msgAboutPic='NRIC, Driving License, TDVL, PDVL';
                $scope.picSrc='img/tpdvl.jpg';
            }
        });
        $scope.sub=function () {
            if ( $scope.signin_s.BlockNo==undefined||$scope.signin_s.BlockNo==''||
                $scope.signin_s.Storey==undefined||$scope.signin_s.Storey==''||
                $scope.signin_s.UnitNo==undefined||$scope.signin_s.UnitNo==''||
                $scope.signin_s.StreetName==undefined||$scope.signin_s.StreetName==''||
                $scope.signin_s.PostalCode==undefined||$scope.signin_s.PostalCode==''
            ){
                return;
            }
            if($scope.signin_s.DateOfBirth==undefined||$scope.signin_s.DateOfBirth==''||
                $scope.signin_s.LicenseIssueDate==undefined||$scope.signin_s.LicenseIssueDate==''){
                $scope.errorState=true;
                $scope.errorMsg='Please fill out the Date of Birth and Driving License Issue Date,thanks! ';
                return;
            }

            if($scope.signin_s.LicenseType=='2'){
                if ( $scope.signin_s.TVDLIssue==undefined||$scope.signin_s.TVDLIssue==''||
                    $scope.signin_s.TVDLExpiry==undefined||$scope.signin_s.TVDLExpiry==''){
                    $scope.errorState=true;
                    $scope.errorMsg='Please fill out the TDVL First Issue Date and TDVL Expiry Date,thanks! ';
                    return;
                }
            }else if($scope.signin_s.LicenseType=='1'){
                if ( $scope.signin_s.PVDLIssue==undefined||$scope.signin_s.PVDLIssue==''||
                    $scope.signin_s.PVDLExpiry==undefined||$scope.signin_s.PVDLExpiry==''){
                    $scope.errorState=true;
                    $scope.errorMsg='Please fill out the PVDL First Issue Date and PVDL Expiry Date,thanks! ';
                    return;
                }
            }else{
                if ( $scope.signin_s.PVDLIssue==undefined||$scope.signin_s.PVDLIssue==''||
                     $scope.signin_s.PVDLExpiry==undefined||$scope.signin_s.PVDLExpiry==''||
                     $scope.signin_s.TVDLIssue==undefined||$scope.signin_s.TVDLIssue==''||
                     $scope.signin_s.TVDLExpiry==undefined||$scope.signin_s.TVDLExpiry==''
                ){
                    $scope.errorState=true;
                    $scope.errorMsg='Please fill out the TVDL First Issue Date, TVDL Expiry Date, PVDL First Issue Date and PVDL Expiry Date, thanks! ';
                    return;
                }
            }
            var pic1=document.getElementById("signInFileFront").files[0]
            var pic2=document.getElementById("signInFileBack").files[0]
            var pic3=document.getElementById("signInMugShot").files[0]
            if(pic1==undefined || pic2==undefined || pic3==undefined){
                return;
            }
           // 提交图片
            postMultipart(allUrl.signin_sUrl, $scope.signin_s,pic1,pic2,pic3).success(function (data) {
                    console.log(data);
                    //todo 注册提交后的操作

                }).error(function () {

            });
        }

        function postMultipart(url, data,pic1,pic2,pic3) {
            var fd = new FormData();
            angular.forEach(data, function(val, key) {
                fd.append(key, val);
            });
            fd.append('VerifyFront',pic1);
            fd.append('VerifyBack',pic2);
            fd.append('MugShot',pic3);
            var args = {
                method: 'POST',
                url: url,
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            };
            return $http(args);
        }


    });

appControllers.controller('searchCtr', function ($scope, $http, appContext,allCarsMsg) {
    console.log(appContext.getAll().searchMsg);

    $scope.searchMsg = appContext.getAll().searchMsg;

    $scope.isWaitting = true;
    $scope.isNoCar = false;
    $scope.allCarsMsg = allCarsMsg.all();


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
        $scope.isWaitting = true;
        $scope.isNoCar = false;

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
        //请求所有的车辆信息
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
                allCarsMsg.setAllCars(data.Data);
            } else {
                $scope.isNoCar = true;
            }

        }).error(function () {
            $scope.isWaitting = false;
            $scope.isNoCar = true;
        });

    }

})
    .controller('mainsearchCtr', function ($scope, $http,appContext) {
        $scope.searchMsg = appContext.getAll().searchMsg;
        if ($scope.searchMsg.startTime==''||compareTimeWithCurrentTime($scope.searchMsg.startDate+" "+$scope.searchMsg.startTime)){
            initsearchTime($scope);
        }
    });

appControllers.controller('sidemenuCtr', function ($scope, JIANCE, $state, $location) {
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
    })
    .controller('editprofileCtr', function ($scope) {
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
    .controller('mybookingsCtr', function ($scope) {
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
    })
    .controller('bookingdetailsCtr', function ($scope) {
        $scope.$emit('curPath', 'BookingdetailsCtr');
    });

appControllers.controller('bookingCtr', function ($scope, $http,$stateParams) {
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

    console.log($stateParams.id)

})
    .controller('bookingcomfirmCtr', function ($scope, $http,$stateParams) {
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