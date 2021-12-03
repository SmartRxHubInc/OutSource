"use strict";

/* Controllers */

angular.module("app").controller("AppCtrl", [
    "$scope",
    "$state",
    "$location",
    "$timeout",
    "$translate",
    "$filter",
    "$localStorage",
    "$window",
    "httpCall",
    "$cookieStore",
    "$http",
    "APP_ACTION",
    "FILESPURL",
    "ngDialog",
    "$rootScope",
    "APP_PARAM",
    function (
            $scope,
            $state,
            $location,
            $timeout,
            $translate,
            $filter,
            $localStorage,
            $window,
            httpCall,
            $cookieStore,
            $http,
            APP_ACTION,
            FILESPURL,
            ngDialog,
            $rootScope,
            APP_PARAM
            ) {
        httpCall.checkLogin();
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass("ie");
        isSmartDevice($window) &&
                angular.element($window.document.body).addClass("smart");
        // config
        $scope.app = {
            name: "SmartLTC (1.3.7)",
            version: "1.3.7",
            loginName: "",
            canvas: 0,
            SALT: "ZfTfbip&Gs0Z4yz34jFrG)Ha0gahptzLN7ROi%gy",
            sessionExpire: 0,
            // for chart colors
            //            color: {
            //                primary: '#7266ba',
            //                info: '#23b7e5',
            //                success: '#27c24c',
            //                warning: '#fad733',
            //                danger: '#f05050',
            //                light: '#e8eff0',
            //                dark: '#3a3f51',
            //                black: '#1c2b36'
            //            },
            settings: {
                themeID: 2,
                navbarHeaderColor: "bg-black",
                navbarCollapseColor: "bg-black",
                asideColor: "bg-black",
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false,
            },
        };
        $timeout.cancel($scope.mainTick);
        //seconds
        $scope.idleSecondsTimer = null;
        $scope.idleSecondsCounter = 0;

        document.onclick = function () {
            $scope.app.idleSecondsCounter = 0;
        };
        document.onmousemove = function () {
            $scope.idleSecondsCounter = 0;
        };
        document.onkeypress = function () {
            $scope.idleSecondsCounter = 0;
        };
        document.onscroll = function () {
            $scope.idleSecondsCounter = 0;
        };
        $scope.CheckIdleTime = function () {
            $scope.idleSecondsCounter++;
            if ($scope.idleSecondsCounter >= $scope.idleTimeOut) {
                $cookieStore.remove("userData");
                $cookieStore.remove("planAccess");
                $cookieStore.remove("packageData");
                $cookieStore.remove("goUrl");
                $cookieStore.remove("UAGENT");
            }
        };
        $scope.clock = "loading clock..."; // initialise the time variable
        $scope.tickInte = 1000; //ms
        var tick = function () {
            $scope.clock = Date.now();
            //                    console.log('lalabhai');
            $scope.mainTick = $timeout(tick, $scope.tickInte);
            $scope.CheckIdleTime();
            if (!$cookieStore.get("userData")) {
                if (!$cookieStore.get("goUrl")) {
                    if ($location.path() !== "/access/signin" && $location.path() !== "/access/forgotpwd" && $location.path() !== "/access/resetpwd")
                        $cookieStore.put("goUrl", $location.path());
                }
                ngDialog.closeAll();
                $state.go("access.signin");
                $timeout.cancel($scope.mainTick);
            }
            //                    if ($location.path() !== '/access/signin') {
            //                        if ($cookieStore.get('UAGENT') == undefined) {
            ////                        toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, "Missing Token");
            //                            $cookieStore.remove('userData');
            //                            $cookieStore.remove('goUrl');
            //                            $cookieStore.remove('UAGENT');
            //                            $scope.app.sessionExpireMessage = "Missing Token";
            //                            $scope.app.sessionExpire = 2;
            //                        }
            //                    }
        };
        $scope.mainTick = $timeout(tick, $scope.tickInte);
        $scope.message = "Please Wait...";
        $scope.app.logo = "img/a0.jpg?v=1&cache=" + new Date().getTime();
        if ($cookieStore.get("userData")) {
            $scope.app.branch_name = $cookieStore.get("userData").branch_name;
            $scope.app.loginName = $cookieStore.get("userData").username;
            $scope.app.loginUserCode = $cookieStore.get("userData").user_code;
            $scope.app.loginStoreCode = $cookieStore.get("userData").store_code;
            $scope.app.loginRoleCode = $cookieStore.get("userData").role_code;
            $scope.app.loginUserType = $cookieStore.get("userData").user_type;
            $scope.app.loginRoleType = $cookieStore.get("userData").role_type;
            $scope.app.companyLogo = $cookieStore.get("company_logo");
            $scope.app.loginPlan = $cookieStore.get("userData").plan_code;
            //                    $scope.app.settings.navbarCollapseColor = $cookieStore.get('userData').plan_code;
            //   $scope.app.settings.navbarCollapseColor = "bg-blue";
            $scope.app.branchName = $cookieStore.get("userData").branch_name;
        } else {
            $cookieStore.remove("UAGENT");
        }
        $scope.facilityLogo = function () {
            if ($scope.app.loginRoleType === "NH") {
                var requestJSON =
                        '{"facility_code":"' +
                        $cookieStore.get("userData").facility_code +
                        '"}';
                httpCall.remoteCall(
                        $scope,
                        $http,
                        APP_ACTION.GET_FACILITY_BY_ID,
                        requestJSON,
                        function (record) {
                            if (record.responseData.facilityData[0].facility_logo) {
                                $scope.app.logo =
                                        record.responseData.facilityData[0].facility_logo;
                            } else {
                                //                                $scope.app.logo = "img/a0.jpg?v=1&cache=" + (new Date()).getTime();
                                $scope.app.logo =
                                        FILESPURL +
                                        $scope.app.companyLogo +
                                        "?v=1&cache=" +
                                        new Date().getTime();
                            }
                        },
                        function (message) {
                            //                            $scope.app.logo = "img/a0.jpg?v=1&cache=" + (new Date()).getTime();
                            $scope.app.logo =
                                    FILESPURL +
                                    $scope.app.companyLogo +
                                    "?v=1&cache=" +
                                    new Date().getTime();
                        }
                );
            } else if ($scope.app.loginRoleType === "PH") {
                $scope.idleTimeOut = 3600;
                if ($scope.app.companyLogo) {
                    $scope.app.logo =
                            FILESPURL +
                            $scope.app.companyLogo +
                            "?v=1&cache=" +
                            new Date().getTime();
                }
            } else {
                $scope.idleTimeOut = 1800;
            }
        };
        $scope.facilityLogo();
        // save settings to local storage
        if (angular.isDefined($localStorage.settings)) {
            //            $scope.app.settings = $localStorage.settings;
            $scope.app.settings = $localStorage.settings;
        } else {
            $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch(
                "app.settings",
                function () {
                    if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                        // aside dock and fixed must set the header fixed.
                        $scope.app.settings.headerFixed = true;
                    }
                    // save to local storage
                    $localStorage.settings = $scope.app.settings;
                    $scope.app.settings.asideFolded = $localStorage.settings.asideFolded;
                },
                true
                );

        function isSmartDevice($window) {
            var ua =
                    $window["navigator"]["userAgent"] ||
                    $window["navigator"]["vendor"] ||
                    $window["opera"];
            return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(
                    ua
                    );
        }
        $scope.logout = function () {
            var dt_added = $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
            var requestJSON =
                    '{"user_code":"' +
                    $cookieStore.get("userData").user_code +
                    '","role_code":"' +
                    $cookieStore.get("userData").role_code +
                    '","dt_added":"' +
                    dt_added +
                    '"}';
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.LOGOUT_USER,
                    requestJSON,
                    function (record) {
                        localStorage.clear();
                        $cookieStore.remove("userData");
                        $cookieStore.remove("planAccess");
                        $cookieStore.remove("packageData");
                        $cookieStore.remove("goUrl");
                        $cookieStore.remove("UAGENT");
                    },
                    function (message) {
                        localStorage.clear();
                        $cookieStore.remove("userData");
                        $cookieStore.remove("planAccess");
                        $cookieStore.remove("packageData");
                        $cookieStore.remove("goUrl");
                        $cookieStore.remove("UAGENT");
                    }
            );
        };
        $scope.showHideMenu = function () {
            $scope.app.settings.asideFolded = !$scope.app.settings.asideFolded;
            window.dispatchEvent(new Event("appMenuShowHide"));
        };
    },
]);
