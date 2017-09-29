/**
 * Created by pj on 2017/8/16.
 */
var myApp = angular.module("app", ["ui.router","allservice","appControllers"]);
//这里叫做App模块，这将告诉HTML页面这是一个AngularJS作用的页面，并把ui-router注入AngularJS主模块，它的内容由AngularJS引擎来解释。
myApp.config(function ($stateProvider, $urlRouterProvider) {
    //这一行声明了把 $stateProvider 和 $urlRouteProvider 路由引擎作为函数参数传入，这样我们就可以为这个应用程序配置路由了.

    //如果没有路由引擎能匹配当前的导航状态，默认将路径路由至 PageTab.html, 那它就像switch case语句中的default选项.就是一个默认的视图选项
    $stateProvider
    //这一行定义了会在main.html页面第一个显示出来的状态（就是进入页面先加载的html），作为页面被加载好以后第一个被使用的路由.
        .state("login", {
            url: "/login",//#+标识符，这里就是url地址栏上面的标识符，通过标识符，进入不同的html页面
            templateUrl: "html/login.html",//这里是html的路径，这是跟标识符相对应的html页面
            controller:'loginCtr',
            //注入'isSide'服务
            resolve: { app:'appContext' },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app){
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("forgetPassword",{
            url:'/forgetPassword',
            templateUrl:'html/forgetPassword.html',
            controller:'forgetPasswordCtr'
        })
        .state("main",{
            url:'/main',
            templateUrl:'html/main.html',
            controller:'mainCtr'
        })
        .state("signin_first",{
            url:'/signup_f',
            templateUrl:'html/signin_first.html',
            controller:'signinCtr'
        })
        .state('signin_second',{
            url:'/signup_s',
            templateUrl:'html/signin_second.html',
            controller:'signin_secondCtr',
            //注入'isSide'服务
            resolve: { app:'initSignupSelectOptions' },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app){
                app.init();
            }
        })
        .state('auditPage',{
            url:'/auditPage',
            templateUrl:'html/auditPage.html',
            controller:'auditPageCtr',
            //注入'isSide'服务
            resolve: { app:'appContext' },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app){
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("search",{
        url:'/search',
        templateUrl:'html/search.html',
        controller:'searchCtr'
        }).state('sidemenu',{
        url:'/sidemenu',
        templateUrl:'html/sidemenu.html',
        controller:'sidemenuCtr',
        //注入'isSide'服务
        resolve: {
            app:'appContext' ,
            isAutGo:'noAutGoLoginPage'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(app,isAutGo){
            isAutGo.init();
            app.getAll().isSidemenu=true;
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(app){
            app.getAll().isSidemenu=false;
        }
    }).state("sidemenu.account",{
            url:"/account",
            templateUrl:"html/sidemenu/account.html",
            controller:'accountCtr'
        })
        .state("sidemenu.editprofile",{
        url:"/editprofile",
        templateUrl:"html/sidemenu/editprofile.html",
        controller:'editprofileCtr'
        })
        .state("sidemenu.wallet",{
        url:"/wallet",
        templateUrl:"html/sidemenu/wallet.html",
        controller:'walletCtr'
        })
        .state("sidemenu.topup",{
            url:"/topup",
            templateUrl:"html/sidemenu/topup.html",
            controller:'topupCtr',
            //注入'isSide'服务
            resolve: { app:'appContext' },
            // myIsSide 是解决依赖项注入控制器
            onEnter: function(app){
            },
            // myIsSide 是解决依赖项注入控制器
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("sidemenu.mybookings",{
            url:"/mybookings",
            templateUrl:"html/sidemenu/mybookings.html",
            controller:'mybookingsCtr'
        })
        .state("sidemenu.refer",{
            url:"/refer",
            templateUrl:"html/sidemenu/refer.html",
            controller:'referCtr'
        })
        .state("sidemenu.reportIssue",{
            url:"/reportIssue/:id",
            templateUrl:"html/sidemenu/reportIssue.html",
            controller:'reportIssueCtr',
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext',
                reportIssueReasons:'initReportIssueReasons'
            },
            onEnter:function (reportIssueReasons) {
                reportIssueReasons.init();
            },
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
            }
        })
        .state("sidemenu.startTrip",{
            url:"/startTrip/:id",
            templateUrl:"html/sidemenu/startTrip.html",
            controller:'startTripCtr',
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext'
            },
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
                app.getAll().startTrip.startTripSure1=false;
                app.getAll().startTrip.startTripSure2=false;
                app.getAll().startTrip.startTripSure3=false;
                app.getAll().startTrip.startTripSure4=false;
                app.getAll().startTrip.startTripSure5=false;
            }

        })
        .state("sidemenu.endtrip",{
            url:"/endtrip/:id",
            templateUrl:"html/sidemenu/endtrip.html",
            controller:'endtripCtr',
            resolve: {
                isAutGo:'noAutGoLoginPage',
                app:'appContext'
            },
            onExit: function(app){
                app.getAll().fromBookingPage.isFromBooking=false;
                app.getAll().endTrip.endtripSure1=false;
                app.getAll().endTrip.endtripSure2=false;
                app.getAll().endTrip.endtripSure3=false;
                app.getAll().endTrip.endtripSure4=false;
                app.getAll().endTrip.endtripSure5=false;
                app.getAll().endTrip.endtripSure6=false;
            }
        })
        .state("sidemenu.extendBooking",{
            url:"/extendBooking/:id",
            templateUrl:"html/sidemenu/extendBooking.html",
            controller:'extendBookingCtr'
        })

    .state('booking',{
        url:'/booking/:id',
        templateUrl:'html/booking.html',
        controller:'bookingCtr'
    })
    .state('bookingcomfirm',{
        url:'/bookingcomfirm/:id',
        templateUrl:'html/bookingcomfirm.html',
        controller:'bookingcomfirmCtr',
        resolve: {
            isAutGo:'noAutGoLoginPage',
            app:'appContext'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(isAutGo){
            isAutGo.init();
        },
        onExit: function(app){
            app.getAll().fromBookingPage.isFromBooking=false;
        }
    })
    .state("bookingdetails",{
        url:"/bookingdetails/:id",
        templateUrl:"html/bookingdetails.html",
        controller:'bookingdetailsCtr',
        resolve: {
            isAutGo:'noAutGoLoginPage',
            initCancleReason:'initCancleReason'
        },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(isAutGo,initCancleReason){
            isAutGo.init();
            initCancleReason.init();
        }
    }).state('lunbo',{
        url:'/lunbo',
        templateUrl:'html/lunbo.html',
        controller:'lunboCtr'
    }).state('mainsearch',{
        url:'/mainsearch',
        templateUrl:'html/mainsearch.html',
        controller:'mainsearchCtr'
    }).state('faq',{
        url:'/faq',
        templateUrl:'html/faq.html',
        controller:'faqCtr'
    }).state('ourrates',{
        url:'/ourrates',
        templateUrl:'html/ourrates.html',
        controller:'ourratesCtr'
    }).state('privacypolicy',{
        url:'/privacypolicy',
        templateUrl:'html/privacypolicy.html',
        controller:'privacypolicyCtr'
    }).state('terms',{
        url:'/terms',
        templateUrl:'html/terms.html',
        controller:'termsCtr'
    });




    $urlRouterProvider.otherwise('/mainsearch');
});
