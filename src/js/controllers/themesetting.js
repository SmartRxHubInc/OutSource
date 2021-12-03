'use strict';

// signup controller
//app.controller('ThemeSettingCtrl', ['$scope', '$http', '$state', '$filter', 'toaster', '$cookieStore', 'httpCall', 'APP_ACTION', 'APP_MESSAGE',
//    function($scope, $http, $state, $filter, toaster, $cookieStore, httpCall, APP_ACTION, APP_MESSAGE) {
//        $scope.addThemeSetting = function(navbar_header_color, navbar_collapse_color, aside_color) {
//            var dt_added = $filter('date')(new Date(), "yyyy-MM-dd HH:mm");
//            var requestJSON = '{"user_code":"' + $cookieStore.get('userData').user_code + '","navbar_header_color":"' + navbar_header_color + '","navbar_collapse_color":"' + navbar_collapse_color + '", "aside_color":"' + aside_color + '","dt_added":"' + dt_added + '"}';
//            httpCall.remoteCall($http, APP_ACTION.ADD_THEME_SETTING, requestJSON, function(record) {
//                console.log(record);
//                toaster.pop(APP_MESSAGE.SUCCESS, APP_MESSAGE.MESSAGE, record.message);
//            }, function(message) {
//                $scope.authError = message;
//            });
//        };
//    }]);