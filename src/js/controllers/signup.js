'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', '$filter', '$cookieStore', 'httpCall', 'APP_ACTION',
    function($scope, $http, $state, $filter, $cookieStore, httpCall, APP_ACTION) {
        $scope.phoneNumbr = /^[ +0-9]*$/;
        $scope.pharmacy = {
            company_fax: '',
            company_des: '',
            company_postal: '',
            company_add1: '',
            company_add2: '',
            company_county: '',
            company_province: '',
            company_city: ''
        };
        $scope.authError = null;
        $scope.pharmacy.on_account = 0;
        $scope.submitPlan = function(planType) {
            var requestJSON = '{"company_code":"' + $cookieStore.get('company_code') + '","plan_code":"' + planType + '"}';
            httpCall.remoteSPCall($http, APP_ACTION.UPDATE_COMPANY_PLAN, requestJSON, function(record) {
                console.log(record);
                console.log($scope);
                $state.go('access.signup');
            }, function(message) {
                $scope.authError = message;
            });
        };
//       
        $scope.signup = function() {
            var dt_added = $filter('date')(new Date(), "yyyy-MM-dd HH:mm");
            var requestJSON = '{"company_name":"' + $scope.pharmacy.company_name + '","company_type_code":"PH","company_phone":"' + $scope.pharmacy.company_phone + '","company_email":"' + $scope.pharmacy.company_email + '","company_fax":"' + $scope.pharmacy.company_fax + '","company_add1":"' + $scope.pharmacy.company_add1 + '","company_add2":"' + $scope.pharmacy.company_add2 + '","company_city":"' + $scope.pharmacy.company_city + '","company_province":"' + $scope.pharmacy.company_province + '","company_county":"' + $scope.pharmacy.company_county + '","company_postal":"' + $scope.pharmacy.company_postal + '","company_des":"' + $scope.pharmacy.company_des + '","dt_added":"' + dt_added + '","on_account":"' + $scope.pharmacy.on_account + '"}';
            httpCall.remoteSPCall($scope, $http, APP_ACTION.REGISTER_COMPANY, requestJSON, function(record) {
                console.log(record);
                $scope.authError = record.message;
                $cookieStore.put('company_code', record.responseData.company_code);
                $state.go('access.signin');
//                $state.go('access.plan');
//                $scope.pharmacy = {};
            }, function(message) {
                $scope.authError = message;
            }, $scope.company_logo);
        };
    }])
        ;