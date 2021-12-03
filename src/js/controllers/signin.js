"use strict";

/*SignIn Controllers */
app.controller("SigninFormController", [
    "$scope",
    "$location",
    "$http",
    "$state",
    "$cookieStore",
    "$filter",
    "httpCall",
    "APP_ACTION",
    "IP",
    "APP_PARAM",
    function (
            $scope,
            $location,
            $http,
            $state,
            $cookieStore,
            $filter,
            httpCall,
            APP_ACTION,
            IP,
            APP_PARAM
            ) {
//        window.onbeforeunload = function ()
//        {
//            console.log("test");
//            return "";
//        };
        $cookieStore.remove('resetpwd');
        $scope.user = {};
        $scope.ip_address = [];
        $scope.authError = null;
        if ($scope.app.sessionExpire == 2) {
            $scope.authError = $scope.app.sessionExpireMessage;
        }
        //$scope.is_pharmacy = 1;
        $scope.login_init = 0;
        //$scope.is_home = 0;
        if ($cookieStore.get("user_type") === 1) {
            $scope.user.user_type = $cookieStore.get("user_type");
            if ($scope.user.user_type === 1) {
                //$scope.is_pharmacy = 1;
                $scope.login_init = 1;
                //$scope.is_home = 0;
            } else {
                //$scope.is_pharmacy = 0;
                $scope.login_init = 0;
                //$scope.is_home = 1;
            }
        } else {
            $scope.user.user_type = 1;
        }
        // console.log($scope.login_init)
        $scope.remeberType = function (val) {
            $cookieStore.put("user_type", val);
        };
        $scope.login = function () {
            //            IP.getLocalIp(function(ip, is_browser) {
            //                if (ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
            //                    $scope.ip_address.push(ip);
            //                    $scope.is_browser = is_browser;
            //                }
            var dt_added = $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
            var requestJSON =
                    '{"username":"' +
                    $scope.user.username +
                    '","password":"' +
                    $scope.user.password +
                    '","user_type":"' +
                    $scope.user.user_type +
                    '","dt_added":"' +
                    dt_added +
                    '","ip_address":"' +
                    $scope.ip_address[0] +
                    '","is_browser":"' +
                    $scope.is_browser +
                    '"}';
            //      console.log(requestJSON)
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.LOGIN,
                    requestJSON,
                    function (record) {
                        record.responseData.profileData[0].user_type = $scope.user.user_type;
                        $cookieStore.put("user_type", $scope.user.user_type);
                        $cookieStore.put("userData", record.responseData.profileData[0]);
                        $cookieStore.put(
                                "planAccess",
                                record.responseData.planAccessCapacity
                                );
                        $cookieStore.put("packageData", record.responseData.package_data);
                        if ($cookieStore.get("goUrl")) {
                            $location.path($cookieStore.get("goUrl"));
                        } else {
                            $state.go("app.rxdashboard");
                        }
                        $cookieStore.put("UAGENT", record.responseData.uagent);
                        APP_PARAM.PKEY = record.responseData.pkey;
                        $scope.app.branch_name = $cookieStore.get("userData").branch_name;
                        $scope.app.loginName = $cookieStore.get("userData").username;
                        $scope.app.loginUserCode = $cookieStore.get("userData").user_code;
                        $scope.app.loginStoreCode = $cookieStore.get("userData").store_code;
                        $scope.app.loginRoleCode = $cookieStore.get("userData").role_code;
                        $scope.app.loginUserType = $cookieStore.get("userData").user_type;
                        $scope.app.loginRoleType = $cookieStore.get("userData").role_type;
                        $scope.app.loginPlan = $cookieStore.get("userData").plan_code;
                        $scope.app.branchName = $cookieStore.get("userData").branch_name;
                        $scope.app.settings.navbarCollapseColor =
                                $cookieStore.get("userData").plan_code;

                        $cookieStore.put(
                                "company_logo",
                                $cookieStore.get("userData").company_logo
                                );
                        $scope.app.companyLogo = $cookieStore.get("userData").company_logo;
                        $cookieStore.remove("goUrl");
                        $scope.facilityLogo();
                    },
                    function (message) {
                        $scope.authError = message;
                    }
            );
            //            });
        };
        $scope.signup = function () {
            $state.go("access.signup");
        };
        $scope.logout = function () {
            console.log("lalabhai");
            $cookieStore.remove("userData");
            $cookieStore.remove("UAGENT");
        };

        $scope.setLoginValue = function () {
            $scope.user.username = "admin";
            $scope.user.password = "admin";
        };
    },
]);
app.controller("ForgotPassController", [
    "$scope",
    "$http",
    "$state",
    "$cookieStore",
    "$filter",
    "httpCall",
    "APP_ACTION",
    function (
            $scope,
            $http,
            $state,
            $cookieStore,
            $filter,
            httpCall,
            APP_ACTION
            ) {
        $scope.user_type = 1;
        $scope.is_otp = false;
        $scope.authError = null;
        $scope.is_active = 0;
        $scope.msg = "";
        $scope.submit = function () {
            var requestJSON =
                    '{"email":"' +
                    $scope.email +
                    '","user_type":"' +
                    $scope.user_type +
                    '"}';
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.FORGOT_PASSWORD_BY_OTP,
                    requestJSON,
                    function (record) {
                        $scope.msg = record.message;
                        $scope.authError = null;
                        $scope.is_active = 1;
                        $scope.is_otp = true;
                    },
                    function (message) {
                        $scope.is_active = 2;
                        $scope.msg = message;
                    }
            );
        };
        $scope.gotoResetPassword = function () {
            var requestJSON =
                    '{"email":"' +
                    $scope.email +
                    '","user_type":"' +
                    $scope.user_type +
                    '","otp":"' +
                    $scope.otp +
                    '"}';
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.CHECK_OTP,
                    requestJSON,
                    function (record) {
                        $scope.msg = record.message;
                        $scope.is_active = 1;
                        $scope.is_otp = true;
                        $scope.user = {user_type: $scope.user_type,
                            email: $scope.email, otp: $scope.otp};
                        $cookieStore.put("resetpwd", $scope.user);
                        $state.go("access.resetpwd");
                    },
                    function (message) {
                        $scope.is_active = 2;
                        $scope.msg = message;
                    }
            );
        };
//    $scope.submit = function () {
//      var requestJSON =
//        '{"email":"' +
//        $scope.email +
//        '","user_type":"' +
//        $scope.user_type +
//        '"}';
//      httpCall.remoteCall(
//        $scope,
//        $http,
//        APP_ACTION.FORGOT_PASSWORD,
//        requestJSON,
//        function (record) {
//          $scope.authError = null;
//          $scope.is_active = 1;
//        },
//        function (message) {
//          $scope.is_active = 0;
//          $scope.authError = message;
//        }
//      );
//    };
    },
]);
app.controller("ResetPassController", [
    "$scope",
    "$http",
    "$state",
    "$cookieStore",
    "$filter",
    "httpCall",
    "APP_ACTION",
    function (
            $scope,
            $http,
            $state,
            $cookieStore,
            $filter,
            httpCall,
            APP_ACTION
            ) {
        $scope.otp = "";
        if ($cookieStore.get('resetpwd')) {
            $scope.user_type = parseInt($cookieStore.get('resetpwd').user_type);
            $scope.email = $cookieStore.get('resetpwd').email;
            $scope.otp = $cookieStore.get('resetpwd').otp;
            if ($scope.email == "" || $scope.email === null || $scope.email === undefined || $scope.user_type == "" || $scope.user_type === undefined) {
                $state.go("access.signin");
            }
        } else {
            $state.go("access.signin");
        }

        $scope.user_type = 1;
        $scope.password = "";
        $scope.con_password = "";
        $scope.authError = null;
        $scope.is_active = 0;
        $scope.msg = "";
        $scope.checkPwd = function () {
            if ($scope.password != $scope.con_password) {
                $scope.is_active = 2;
                $scope.msg = "Password not matched!";
                return "";
            } else {
//                if($scope.password == "" || $scope.con_password == ""){
//                    
//                }
                $scope.is_active = 0;
                $scope.msg = "";
                return "";
            }
        }
        $scope.submit = function () {
            if ($scope.password != $scope.con_password) {
                $scope.is_active = 2;
                $scope.msg = "Password not matched!";
                return "";
            }

            var requestJSON =
                    '{"email":"' +
                    $scope.email +
                    '","user_type":"' +
                    $scope.user_type +
                    '","password":"' +
                    $scope.password +
                    '","otp":"' +
                    $scope.otp +
                    '"}';
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.RESET_USER_PASSWORD,
                    requestJSON,
                    function (record) {
                        $scope.msg = record.message;
                        $scope.authError = null;
                        $scope.is_active = 1;
                        $scope.is_otp = true;
                        $cookieStore.remove('resetpwd');
                        $state.go("access.signin");
                    },
                    function (message) {
                        $scope.is_active = 2;
                        $scope.msg = message;
                    }
            );
        };
        function leaveBeforUnloadResetPwd(e) {
            e.preventDefault()
            var confirmationMessage =
                    "If you leave or refresh before reset password, you have to re-submit forgot pasword.";
//
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage;

        }
        window.addEventListener("beforeunload", leaveBeforUnloadResetPwd, true);
        $scope.$on("$destroy", function (event) {
            window.removeEventListener("beforeunload", leaveBeforUnloadResetPwd, true);
        });
    },
]);