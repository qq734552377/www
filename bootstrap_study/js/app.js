/**
 * Created by pj on 2017/8/16.
 */
angular.module('app', [])
    .controller('loginCtr', function ($scope, $http) {
        $scope.isRemeberMe = true;
        $scope.errorState = false;
        $scope.errorMsg = 'Incorrect account name or password!';

        $scope.loginMsg = {
            url: "http://192.168.0.113:12907/api/Login",
            email: '',
            password: '',
            loginSucessUrl: 'http://192.168.0.132/bootstrap_study/search.html'
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