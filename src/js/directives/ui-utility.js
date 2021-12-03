angular.module('ui.utility', [])
        .directive('myDatePicker', function () {
            function link(scope, element, attrs) {
            }
            function controller($scope) {
                $scope.init = function () {
                    $scope.dt = $scope.myDatePickerModel;
//                    $scope.MyPlaceholder = $scope.myDatePickerModel;
                };
                $scope.init();

                $scope.clear = function () {
                    $scope.dt = null;
                };

                // Disable weekend selection
                $scope.disabled = function (date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
                };

                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];

                $scope.$watch('dt', function (newVal, oldVal) {
                    $scope.myDatePickerModel = newVal;
                });

            }
            return {
                restrict: 'A',
                templateUrl: 'js/directives/mydatepicker.html',
                link: link,
                controller: controller,
                scope: {
                    myDatePickerModel: '=',
                    MyPlaceholder: '='
                }
            };
        })
        .directive('ipaddress', function () {            
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$validators.ipaddress = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            console.log("1");
                            return false;
                        }
                        var matcher;
                        if ((matcher = viewValue.match(/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/)) != null) {
                            var i;
                            var previous = "255";
                            for (i = 1; i < 5; i++) {
                                var octet = parseInt(matcher[i]);
                                if (octet > 255){                                    
                                    console.log("2");
                                    return false;
                                }
                            }
                            console.log("3");
                            return true;
                        }
                        else {
                            console.log("4");
                            return false;
                        }
                    }
                }
            }
        })
//        .directive('signIn', function () {
//            function link(scope, element, attrs) {
//            }
//            function controller($scope, $http, $state) {
//                $scope.user = {};
//                $scope.authError = null;
//                $scope.login = function () {
//                    $scope.authError = null;
//                    // Try to login
//                    $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
//                            .then(function (response) {
//                                if (!response.data.user) {
//                                    $scope.authError = 'Email or Password not right';
//                                } else {
//                                    $state.go('app.dashboard-v1');
//                                }
//                            }, function (x) {
//                                $scope.authError = 'Server Error';
//                            });
//                };
//            }
//            return {
//                restrict: 'A',
//                templateUrl: 'js/directives/mydatepicker.html',
//                template: '<h1>Ashish</h1>',
//                link: link,
//                controller: controller,
//                scope: {
//                    signInModel: '='
//                }
//            };
//        })
;