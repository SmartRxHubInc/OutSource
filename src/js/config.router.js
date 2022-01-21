"use strict";

/**
 * Config for the router
 */
angular
        .module("app")
        .run([
            "$rootScope",
            "$state",
            "$stateParams",
            "$cookieStore",
            function ($rootScope, $state, $stateParams, $cookieStore) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            },
        ])
        .config([
            "$stateProvider",
            "$urlRouterProvider",
            function ($stateProvider, $urlRouterProvider) {
                var $cookies, lcdTpl;
                angular.injector(["ngCookies"]).invoke(function (_$cookies_) {
                    $cookies = _$cookies_;
                });
                var DUrl;
                if ($cookies.userData) {
                    console.log($urlRouterProvider);
                    DUrl = "/app/rxdashboard";
                } else {
//                    $cookies.remove('resetpwd');
                    DUrl = "/access/signin";
                }

                $urlRouterProvider.otherwise(DUrl);

                $stateProvider
                        .state("app", {
                            abstract: true,
                            url: "/app",
                            templateUrl: "tpl/app.html",
                        })
                        .state("access.404", {
                            url: "/404",
                            templateUrl: "tpl/page_404.html",
                        })
                        .state("app.rxdashboard", {
                            url: "/rxdashboard",
                            templateUrl: "tpl/app_rxdashboard.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load(["js/controllers/rxdashboard.js"]);
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.to-do-list", {
                            url: "/to-do-list",
                            templateUrl: "tpl/to_do_list/to_do_list.html",
                           
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                       
                                      return $ocLazyLoad.load(["js/controllers/to_do_list.js","js/controllers/bootstrap.js","css/app-to-do.css"])
                                            
                                       
                                    },
                                ],
                            },
                        })
                        .state("app.ui", {
                            url: "/ui",
                            template: '<div ui-view class="fade-in-up"></div>',
                        })
                        //                        .state('app.ui.jvectormap', {
                        //                    url: '/jvectormap',
                        //                    templateUrl: 'tpl/ui_jvectormap.html',
                        //                    resolve: {
                        //                        deps: ['$ocLazyLoad',
                        //                            function($ocLazyLoad) {
                        //                                return $ocLazyLoad.load('js/controllers/vectormap.js');
                        //                            }]
                        //                    }
                        //                })
                        // table
                        .state("app.table", {
                            url: "/table",
                            template: "<div ui-view></div>",
                        });
            
                $stateProvider

                        .state("app.table.grid", {
                            url: "/grid",
                            templateUrl: "tpl/table_grid.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/grid.js");
                                        });
                                    },
                                ],
                            },
                        })
          
                        .state("app.table.order", {
                            url: "/order",
                            templateUrl: "tpl/table_order.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/order.js");
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.table.store", {
                            url: "/store/:id",
                            templateUrl: "tpl/store/table_store.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/store.js");
                                        });
                                    },
                                ],
                            },
                        })

                        .state("app.table.formstore", {
                            url: "/formstore",
                            templateUrl: "tpl/store/form_store.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load("js/controllers/store.js");
                                    },
                                ],
                            },
                        })
              
                        .state("app.table.viewer", {
                            url: "/viewer",
                            templateUrl: "tpl/page/table_pageviewer.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad
                                                .load("ngGrid")
                                                .then(function () {
                                                    return $ocLazyLoad.load("js/controllers/pageviewer.js");
                                                })
                                                .then(function () {
                                                    return $ocLazyLoad.load("ui.select");
                                                });
                                    },
                                ],
                            },
                        })
                        .state("app.table.formpatientorder", {
                            url: "/formpatientorder",
                            templateUrl: "tpl/Order/form_patientorder.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/patientOrder.js");
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.table.formpageorder", {
                            url: "/formpageorder",
                            templateUrl: "tpl/Order/form_pageorder.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/patientOrder.js");
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.table.orderform", {
                            url: "/orderform",
                            templateUrl: "tpl/Order/table_order.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/patientOrder.js");
                                        });
                                    },
                                ],
                            },
                        })

               
                        .state("app.table.printpage", {
                            url: "/printpage",
                            templateUrl: "tpl/print/table_printpage.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngGrid").then(function () {
                                            return $ocLazyLoad.load("js/controllers/printpage.js");
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.page.canvas", {
                            url: "/pageview",
                            templateUrl: "tpl/page/page_canvas.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load(["js/controllers/pageviewer.js"]);
                                    },
                                ],
                            },
                        })
                        .state("access.signin", {
                            url: "/signin",
                            templateUrl: "tpl/page_signin.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load(["js/controllers/signin.js"]);
                                    },
                                ],
                            },
                        })
                  
                        .state("access.forgotpwd", {
                            url: "/forgotpwd",
                            templateUrl: "tpl/page_forgotpwd.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load(["js/controllers/signin.js"]);
                                    },
                                ],
                            },
                        })
                        .state("access.resetpwd", {
                            url: "/resetpwd",
                            templateUrl: "tpl/page_resetpwd.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load(["js/controllers/signin.js"]);
                                    },
                                ],
                            },
                        })

                        .state("app.form.imagecrop", {
                            url: "/imagecrop",
                            templateUrl: "tpl/form_imagecrop.html",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ngImgCrop").then(function () {
                                            return $ocLazyLoad.load("js/controllers/imgcrop.js");
                                        });
                                    },
                                ],
                            },
                        })
                        .state("app.form.select", {
                            url: "/select",
                            templateUrl: "tpl/form_select.html",
                            controller: "SelectCtrl",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("ui.select").then(function () {
                                            return $ocLazyLoad.load("js/controllers/select.js");
                                        });
                                    },
                                ],
                            },
                        })
          
                        .state("app.form.editor", {
                            url: "/editor",
                            templateUrl: "tpl/form_editor.html",
                            controller: "EditorCtrl",
                            resolve: {
                                deps: [
                                    "$ocLazyLoad",
                                    function ($ocLazyLoad) {
                                        return $ocLazyLoad.load("textAngular").then(function () {
                                            return $ocLazyLoad.load("js/controllers/editor.js");
                                        });
                                    },
                                ],
                            },
                        })
                        // pages
                        .state("app.page", {
                            url: "/page",
                            template: '<div ui-view class="fade-in-down"></div>',
                        })
                        .state("app.page.profile", {
                            url: "/profile",
                            templateUrl: "tpl/page_profile.html",
                            resolve: {
                                deps: [
                                    "uiLoad",
                                    function (uiLoad) {
                                        return uiLoad.load("js/controllers/profile.js");
                                    },
                                ],
                            },
                        })
                        .state("access", {
                            url: "/access",
                            template: '<div ui-view class="fade-in-right-big smooth"></div>',
                        })
                
                   
            },
        ]);
