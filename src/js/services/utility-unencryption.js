angular.module('utility', [])
        .service('httpCall', ['$location', 'URL', 'SPURL', '$cookieStore', '$state', 'APP_MESSAGE',
            function ($location, URL, SPURL, $cookieStore, $state, APP_MESSAGE) {
                this.remoteCall = function ($scope, $http, action, requestJSON, successCb, failureCb, file, file1) {
                    var SALT = 'ZfTfbip&Gs0Z4yz34jFrG)Ha0gahptzLN7ROi%gy';
                    var fd = new FormData(), response;
//                    fd.append('action', CryptoJS.AES.encrypt(JSON.stringify(action), SALT, {format: CryptoJSAesJson}).toString());
//                    fd.append('requestJSON', CryptoJS.AES.encrypt(JSON.stringify(requestJSON), SALT, {format: CryptoJSAesJson}).toString());
                    fd.append('action', action);
                    fd.append('requestJSON', requestJSON);
                    fd.append('myfile', file);
                    fd.append('file', file1);
                    $scope.promise = $http.post(URL, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data, status, headers, config) {
                        var data = JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(data), SALT, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
                        response = angular.fromJson(data);
                        if (response.success === 'yes') {
                            return successCb(response);
                        } else {
                            return failureCb(response.message);
                        }
                    }).error(function (data, status, headers, config) {                        
                        return failureCb(APP_MESSAGE.SERVER_RESPONSE_FAIL_MESSAGE);
                    });
                };
                this.remoteSPCall = function ($scope, $http, action, requestJSON, successCb, failureCb, file) {
                    var SALT = 'ZfTfbip&Gs0Z4yz34jFrG)Ha0gahptzLN7ROi%gy';
                    var fd = new FormData(), response;
//                    fd.append('action', CryptoJS.AES.encrypt(JSON.stringify(action), SALT, {format: CryptoJSAesJson}).toString());
//                    fd.append('requestJSON', CryptoJS.AES.encrypt(JSON.stringify(requestJSON), SALT, {format: CryptoJSAesJson}).toString());
                    fd.append('action', action);
                    fd.append('requestJSON', requestJSON);
                    fd.append('myfile', file);
                    $scope.promise = $http.post(SPURL, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data, status, headers, config) {
                        response = angular.fromJson(data);
                        if (response.success === 'yes') {
                            return successCb(response);
                        } else {
                            return failureCb(response.message);
                        }
                    }).error(function (data, status, headers, config) {
                        return failureCb(APP_MESSAGE.SERVER_RESPONSE_FAIL_MESSAGE);
                    });
                };
                this.checkLogin = function () {
                    if (!$cookieStore.get('userData')) {
                        $cookieStore.remove('planAccess');
                        $cookieStore.remove('packageData');
                        $state.go('access.signin');
                    }
                };
                this.checkFileExist = function (url, callback) {
                    var request = new XMLHttpRequest();
                    request.open('HEAD', url, false);
                    request.send();
                    if (request.status === 200) {
                        callback('yes');
                    } else {
                        callback('no');
                    }
                };
            }])
        .directive('ipaddress', function () {
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$validators.ipaddress = function (modelValue, viewValue) {
                        console.log(modelValue);
                        console.log(viewValue);
                        /**
                         * IP validation with comma(,) and dash(-)
                         * START
                         */
                        if (viewValue.length <= 0) {
                            return true;
                        }
                        var arr = viewValue.split(/(?:,|-)+/);
                        viewValue = arr[arr.length - 1];
                        /*END*/
                        if (ctrl.$isEmpty(modelValue)) {
                            return false;
                        }
                        var matcher;
                        if ((matcher = viewValue.match(/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/)) != null) {
                            var i;
                            var previous = "255";
                            for (i = 1; i < 5; i++) {
                                var octet = parseInt(matcher[i]);
                                if (octet > 255) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
        })
        ;


app.directive('allowPattern', [allowPatternDirective]);
                                   
function allowPatternDirective() {
    return {
        restrict: "A",
        compile: function(tElement, tAttrs) {
            return function(scope, element, attrs) {
        // I handle key events
                element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                    var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.
          
          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                    if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
            event.preventDefault();
                        return false;
                    }
          
                });
            };
        }
    };
}