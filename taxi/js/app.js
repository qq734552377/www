/**
 * Created by pj on 2017/8/16.
 */
var myApp = angular.module("app", ["ui.router","appControllers"]);
//这里叫做App模块，这将告诉HTML页面这是一个AngularJS作用的页面，并把ui-router注入AngularJS主模块，它的内容由AngularJS引擎来解释。
myApp.config(function ($stateProvider, $urlRouterProvider) {
    //这一行声明了把 $stateProvider 和 $urlRouteProvider 路由引擎作为函数参数传入，这样我们就可以为这个应用程序配置路由了.
  
    //如果没有路由引擎能匹配当前的导航状态，默认将路径路由至 PageTab.html, 那它就像switch case语句中的default选项.就是一个默认的视图选项
    $stateProvider
    //这一行定义了会在main.html页面第一个显示出来的状态（就是进入页面先加载的html），作为页面被加载好以后第一个被使用的路由.
        .state("login", {
            url: "/login",//#+标识符，这里就是url地址栏上面的标识符，通过标识符，进入不同的html页面
            templateUrl: "html/login.html",//这里是html的路径，这是跟标识符相对应的html页面
            controller:'loginCtr'
        })
        .state("signin_first",{
            url:'/signup_f',
            templateUrl:'html/signin_first.html',
            controller:'signinCtr'
        }).state("search",{
        url:'/search',
        templateUrl:'html/search.html',
        controller:'searchCtr'
        }).state('sidemenu',{
        url:'/sidemenu',
        templateUrl:'html/sidemenu.html',
        controller:'sidemenuCtr',
        //注入'isSide'服务
        resolve: { myIsSide:'appContext' },
        // myIsSide 是解决依赖项注入控制器
        onEnter: function(myIsSide){
            myIsSide.getAll().isSidemenu=true;
        },
        // myIsSide 是解决依赖项注入控制器
        onExit: function(myIsSide){
            myIsSide.getAll().isSidemenu=false;
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
            controller:'topupCtr'
        })
        .state("sidemenu.bookingdetail",{
            url:"/bookingdetail",
            templateUrl:"html/sidemenu/bookingdetail.html",
            controller:'bookingdetailCtr'
        })
        .state("sidemenu.refer",{
            url:"/refer",
            templateUrl:"html/sidemenu/refer.html",
            controller:'referCtr'
        })
    .state('signin_second',{
        url:'/signup_s',
        templateUrl:'html/signin_second.html',
        controller:'signin_secondCtr'
    }).state('booking',{
        url:'/booking/:id',
        templateUrl:'html/booking.html',
        controller:'bookingCtr'
    }).state('lunbo',{
        url:'/lunbo',
        templateUrl:'html/lunbo.html',
        controller:'lunboCtr'
    }).state('mainsearch',{
        url:'/mainsearch',
        templateUrl:'html/mainsearch.html',
        controller:'mainsearchCtr'
    })
    $urlRouterProvider.otherwise('/login');
});
