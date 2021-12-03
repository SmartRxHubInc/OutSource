angular.module('ip-utility', [])
        .service('IP', ['$window', 'URL', '$state', '$http',
            function($window, URL, $state, $http) {
                this.getLocalIp = function(callback) {
                    var isOpera = !!$window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
                    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
                    var isSafari = Object.prototype.toString.call($window.HTMLElement).indexOf('Constructor') > 0;
                    // At least Safari 3+: "[object HTMLElementConstructor]"
                    var isChrome = !!$window.chrome && !isOpera;
                    var isIE = /*@cc_on!@*/false || !!document.documentMode;

                    if (isChrome === true || isFirefox === true || isSafari === true || isOpera === true) {
                        var ip_dups = {};
                        var RTCPeerConnection = $window.RTCPeerConnection || $window.mozRTCPeerConnection ||
                                $window.webkitRTCPeerConnection || $window.msRTCPeerConnection;
                        var mediaConstraints = {
                            optional: [{RtpDataChannels: true}]
                        };
                        var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
                        var pc = new RTCPeerConnection(servers, mediaConstraints);

                        function handleCandidate(candidate) {
                            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                            var ip_addr = ip_regex.exec(candidate)[1];
                            if (ip_dups[ip_addr] === undefined)
                                callback(ip_addr, 1);
                            ip_dups[ip_addr] = true;
                        }
                        pc.onicecandidate = function(ice) {
                            if (ice.candidate)
                                handleCandidate(ice.candidate.candidate);
                        };
                        pc.createDataChannel("");
                        pc.createOffer(function(result) {
                            pc.setLocalDescription(result, function() {
                            }, function() {
                            });
                        }, function() {
                        });
                    } else if(isIE === true){
                        $http.get("https://api.ipify.org/")
                                .success(function(response) {
                                    callback(response, 0);
                                });
                    }else{
                        callback('192.168.1.100',0);
                    }
//                    var isIE = /*@cc_on!@*/false || !!document.documentMode;
//                    if (isIE === true) {
//
//                    } else {
//
//                    }
                };
            }]);
