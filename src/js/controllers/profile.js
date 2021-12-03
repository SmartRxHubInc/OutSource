app.controller('ProfileCtrl', ['$scope', 'toaster', '$http', '$state', '$filter', '$cookieStore', 'httpCall', 'APP_ACTION', 'APP_MESSAGE', 'FILESPURL',
    function($scope, toaster, $http, $state, $filter, $cookieStore, httpCall, APP_ACTION, APP_MESSAGE, FILESPURL) {
        var requestJSON = '{"user_code":"' + $cookieStore.get('userData').user_code + '","role_type":"' + $cookieStore.get('userData').role_type + '"}';
        httpCall.remoteCall($scope, $http, APP_ACTION.GET_LOGIN_USER_DATA, requestJSON, function(record) {
            $scope.profiles = record.responseData.profileData[0];
        }, function(message) {
//                $scope.authError = message;
        });
        $scope.updateLogo = function() {
            var requestJson = '';
            requestJson = '{"company_code":"' + $cookieStore.get('userData').company_code + '"}';
            httpCall.remoteSPCall($scope, $http, APP_ACTION.UPDATE_PROFILE_LOGO, requestJson, function(record) {
//                $scope.app.logo = record.responseData.companiesData[0].company_logo;
                console.log(record.responseData.companiesData[0].company_logo);
                $scope.app.logo = FILESPURL + record.responseData.companiesData[0].company_logo + "?v=1&cache=" + (new Date()).getTime();
                $scope.app.companyLogo = record.responseData.companiesData[0].company_logo;
//                $cookieStore.put('userData').company_logo = record.responseData.companiesData[0].company_logo;
                $cookieStore.remove('company_logo');
                $cookieStore.put('company_logo', record.responseData.companiesData[0].company_logo);
                $scope.facilityLogo();
                toaster.pop(APP_MESSAGE.MESSAGE, APP_MESSAGE.MESSAGE, record.message);
            }, function(message) {
                console.log(message);
                toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.MESSAGE, message);
            }, $scope.company_logo);
        };
        $scope.saveProfile = function(data, user_code) {
            var requestJson = '';
//            console.log($scope);
            requestJson = '{"data":' + JSON.stringify(data) + ',"user_code":"' + user_code + '"}';
            console.log(requestJson);
            httpCall.remoteCall($scope, $http, APP_ACTION.UPDATE_PROFILE, requestJson, function(record) {
                $scope.profiles = record.responseData.profileData[0];
            }, function(message) {
//                toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.MESSAGE, message);
            });

        };

    }]);


