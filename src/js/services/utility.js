angular
  .module("utility", [])
  .service("httpCall", [
    "$location",
    "URL",
    "SPURL",
    "$cookieStore",
    "$state",
    "APP_MESSAGE",
    "ENCRYPT_DECRYPT_STATUS",
    "Analytics",
    "APP_NAME",
    "APP_PARAM",
    function (
      $location,
      URL,
      SPURL,
      $cookieStore,
      $state,
      APP_MESSAGE,
      ENCRYPT_DECRYPT_STATUS,
      Analytics,
      APP_NAME,
      APP_PARAM
    ) {
      this.remoteCall = function (
        $scope,
        $http,
        action,
        requestJSON,
        successCb,
        failureCb,
        file,
        file1
      ) {
        var login_from = "";
        if ($cookieStore.get("userData")) {
          if (($cookieStore.get("userData").role_type = "ph")) {
            if ($cookieStore.get("userData").role_code == "PHADM") {
              login_from = $cookieStore.get("userData").username;
            } else {
              login_from = $cookieStore.get("userData").branch_name;
            }
          } else if (($cookieStore.get("userData").role_type = "nh")) {
            login_from = $cookieStore.get("userData").branch_name;
          }
        }

        Analytics.trackEvent(APP_NAME + "-" + login_from, action, "");
        var SALT = "ZfTfbip&Gs0Z4yz34jFrG)Ha0gahptzLN7ROi%gy";
        var fd = new FormData(),
          response;
        if (
          requestJSON == null ||
          requestJSON == "" ||
          requestJSON == undefined
        )
          requestJSON = "{}";
        if (ENCRYPT_DECRYPT_STATUS == 0) {
          fd.append("action", action);
          fd.append("requestJSON", requestJSON);
        } else {
          fd.append(
            "action",
            CryptoJS.AES.encrypt(JSON.stringify(action), SALT, {
              format: CryptoJSAesJson,
            }).toString()
          );
          fd.append(
            "requestJSON",
            CryptoJS.AES.encrypt(JSON.stringify(requestJSON), SALT, {
              format: CryptoJSAesJson,
            }).toString()
          );
        }
        fd.append("myfile", file);
        fd.append("file", file1);
        //                    fd.append('uagent',$cookieStore.get('UAGENT'));
        $scope.promise = $http
          .post(URL, fd, {
            transformRequest: angular.identity,
            headers: {
              "Content-Type": undefined,
              uagent: $cookieStore.get("UAGENT"),
            },
            //                        headers: {'Content-Type': undefined}
          })
          .success(function (data, status, headers, config) {
            if (ENCRYPT_DECRYPT_STATUS == 0) {
              var data = data;
            } else {
              var data = JSON.parse(
                CryptoJS.AES.decrypt(JSON.stringify(data), SALT, {
                  format: CryptoJSAesJson,
                }).toString(CryptoJS.enc.Utf8)
              );
            }
            response = angular.fromJson(data);
            if (response.success === "yes") {
              return successCb(response);
            } else {
              if (response.responseData === "server_session_expire") {
                $cookieStore.remove("userData");
                $cookieStore.remove("goUrl");
                $cookieStore.remove("UAGENT");
                $scope.app.sessionExpireMessage = response.message;
                $scope.app.sessionExpire = 2;
              } else {
                return failureCb(response.message);
              }
            }
          })
          .error(function (data, status, headers, config) {
            return failureCb(APP_MESSAGE.SERVER_RESPONSE_FAIL_MESSAGE);
          });
      };
      this.remoteSPCall = function (
        $scope,
        $http,
        action,
        requestJSON,
        successCb,
        failureCb,
        file
      ) {
        var SALT = "ZfTfbip&Gs0Z4yz34jFrG)Ha0gahptzLN7ROi%gy";
        var fd = new FormData(),
          response;
        if (ENCRYPT_DECRYPT_STATUS == 0) {
          fd.append("action", action);
          fd.append("requestJSON", requestJSON);
        } else {
          fd.append(
            "action",
            CryptoJS.AES.encrypt(JSON.stringify(action), SALT, {
              format: CryptoJSAesJson,
            }).toString()
          );
          fd.append(
            "requestJSON",
            CryptoJS.AES.encrypt(JSON.stringify(requestJSON), SALT, {
              format: CryptoJSAesJson,
            }).toString()
          );
        }

        fd.append("myfile", file);
        $scope.promise = $http
          .post(SPURL, fd, {
            transformRequest: angular.identity,
            headers: { "Content-Type": undefined },
          })
          .success(function (data, status, headers, config) {
            response = angular.fromJson(data);
            if (response.success === "yes") {
              return successCb(response);
            } else {
              return failureCb(response.message);
            }
          })
          .error(function (data, status, headers, config) {
            return failureCb(APP_MESSAGE.SERVER_RESPONSE_FAIL_MESSAGE);
          });
      };
      this.checkLogin = function () {
        if (!$cookieStore.get("userData")) {
          $cookieStore.remove("planAccess");
          $cookieStore.remove("packageData");
          $cookieStore.remove("UAGENT");
          $state.go("access.signin");
        }
      };
      this.checkFileExist = function (url, callback) {
        var request = new XMLHttpRequest();
        request.open("HEAD", url, false);
        request.send();
        if (request.status === 200) {
          callback("yes");
        } else {
          callback("no");
        }
      };
      //                this.ngGridFlexibleHeightPlugin = function(opts) {
      //                    var self = this;
      //                    self.grid = null;
      //                    self.scope = null;
      //                    self.init = function(scope, grid, services) {
      //                        self.domUtilityService = services.DomUtilityService;
      //                        self.grid = grid;
      //                        self.scope = scope;
      //                        var recalcHeightForData = function() {
      //                            setTimeout(innerRecalcForData, 1);
      //                        };
      //                        var innerRecalcForData = function() {
      //                            var gridId = self.grid.gridId;
      //                            var footerPanelSel = '.' + gridId + ' .ngFooterPanel';
      //                            var extraHeight = self.grid.$topPanel.height() + $(footerPanelSel).height();
      //                            var naturalHeight = self.grid.$canvas.height() + 1;
      //                            if (opts != null) {
      //                                if (opts.minHeight != null && (naturalHeight + extraHeight) < opts.minHeight) {
      //                                    naturalHeight = opts.minHeight - extraHeight - 2;
      //                                }
      //                                if (opts.maxHeight != null && (naturalHeight + extraHeight) > opts.maxHeight) {
      //                                    naturalHeight = opts.maxHeight;
      //                                }
      //                            }
      //
      //                            var newViewportHeight = naturalHeight + 3;
      //                            if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
      //                                self.grid.$viewport.css('height', newViewportHeight + 'px');
      //                                self.grid.$root.css('height', (newViewportHeight + extraHeight) + 'px');
      //                                self.scope.baseViewportHeight = newViewportHeight;
      //                                self.domUtilityService.RebuildGrid(self.scope, self.grid);
      //                            }
      //                        };
      //                        self.scope.catHashKeys = function() {
      //                            var hash = '',
      //                                    idx;
      //                            for (idx in self.scope.renderedRows) {
      //                                hash += self.scope.renderedRows[idx].$$hashKey;
      //                            }
      //
      //                            return hash;
      //                        };
      //                        self.scope.$watch('catHashKeys()', innerRecalcForData);
      //                        self.scope.$watch(self.grid.config.data, recalcHeightForData);
      //                    }
      //                };
    },
  ])
  .directive("ipaddress", function () {
    return {
      require: "ngModel",
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$validators.ipaddress = function (modelValue, viewValue) {
          /**
           * IP validation with comma(,) and dash(-)
           * START
           */
          if (!viewValue) {
            return true;
          }
          var arr = viewValue.split(/(?:,|-)+/);
          viewValue = arr[arr.length - 1];
          /*END*/
          if (ctrl.$isEmpty(modelValue)) {
            return false;
          }
          var matcher;
          if (
            (matcher = viewValue.match(
              /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/
            )) != null
          ) {
            var i;
            var previous = "255";
            for (i = 1; i < 5; i++) {
              var octet = parseInt(matcher[i]);
              if (octet > 255) {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        };
      },
    };
  });

app.directive("allowPattern", [allowPatternDirective]);

function allowPatternDirective() {
  return {
    restrict: "A",
    compile: function (tElement, tAttrs) {
      return function (scope, element, attrs) {
        // I handle key events
        element.bind("keypress", function (event) {
          var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
          var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

          // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
          if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
            event.preventDefault();
            return false;
          }
        });
      };
    },
  };
}
