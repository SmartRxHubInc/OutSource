app.controller('RxDashboardCtrl', ['$scope', '$timeout', '$http', '$cookieStore', '$filter', 'httpCall',
    'APP_ACTION', 'APP_PARAM', 'toaster', 'APP_MESSAGE', '$interval', 'Analytics', '$state',
    function ($scope, $timeout, $http, $cookieStore, $filter, httpCall, APP_ACTION, APP_PARAM,
            toaster, APP_MESSAGE, $interval, Analytics, $state) {
        $scope.store_code = "";
        $scope.facility_code = "";
        $scope.unit_code = "";
        $scope.flag = "";
        $scope.page_order = "";
        $scope.pen_status = "";
        $scope.pending_print_count = "";
        $scope.done_print_count = "";
        $scope.dashbord = {dtotal: ""};
        $scope.pw_chart = "";
        $scope.pw_chart_label = "";
        $scope.pen_health_status = "";
        $scope.doctor_day = "";
        $scope.settingData = "";
        $scope.app.rxDashboardPenInfo = 0,
                $scope.batteryColor = function (val) {
                    var text_color = 'red';
                    if (val >= 50) {
                        text_color = 'rgb(15, 215, 15)';
                    } else if (val < 50 && val >= 20) {
                        text_color = 'orange';
                    }
                    return text_color;
                }
        $scope.days = [
            {'id': 1, 'name': 'Sunday', 'is_doctorday': 0},
            {'id': 2, 'name': 'Monday', 'is_doctorday': 0},
            {'id': 3, 'name': 'Tuesday', 'is_doctorday': 0},
            {'id': 4, 'name': 'Wednesday', 'is_doctorday': 0},
            {'id': 5, 'name': 'Thursday', 'is_doctorday': 0},
            {'id': 6, 'name': 'Friday', 'is_doctorday': 0},
            {'id': 7, 'name': 'Saturday', 'is_doctorday': 0}

        ];
        if ($cookieStore.get('store_code')) {
            $scope.store_code = $cookieStore.get('store_code');
            $cookieStore.remove('store_code');
        }
        if ($cookieStore.get('facility_code')) {
            $scope.facility_code = $cookieStore.get('facility_code');
            $cookieStore.remove('facility_code');
        }
        if ($cookieStore.get('unit_code')) {
            $scope.unit_code = $cookieStore.get('unit_code');
            $cookieStore.remove('unit_code');
        }

        $scope.getUnit = function () {
            $scope.terminalData = "";
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_UNIT_BY_FACILITY_AND_USER, '{"facility_code":"' + $scope.facility_code + '","user_code":"' + $cookieStore.get('userData').user_code + '","role_type":"' + $cookieStore.get('userData').role_type + '","is_show_dashoard":"1"}', function (record) {
                $scope.units = record.responseData.unitData;
                if (record.responseData.terminalData.length > 0) {
                    $scope.terminalData = record.responseData.terminalData;
                }
            }, function (message) {
                $scope.units = "";
            });
        };
        $scope.getFacility = function () {
            httpCall.remoteCall('', $http, APP_ACTION.GET_DRP_FACILITY_BY_STORE, '{"store_code":"' + $scope.store_code + '","user_code":"' + $cookieStore.get('userData').user_code + '"}', function (record) {
                $scope.facilities = record.responseData.companiesData;
            }, function (message) {
                $scope.facilities = "";
            });
        };

        //console.log(Analytics);
        //Analytics.trackPage('/video/detail/XXX', 'Video XXX');
//        var requestJSON, requestDashJSON;
        $scope.getDashbord = function () {
            $scope.doctor_day = "";
            var requestJSON;
            if ($scope.app.loginRoleCode === 'PHADM' || $scope.app.loginRoleCode === 'SCNBT' || $scope.app.loginRoleCode === 'SCTT' ) {
                $scope.flag = 1;//defaul select Store
            } else if ($scope.app.loginRoleType === 'PH') {
                $scope.flag = 2;//defaul select Facility
                $scope.store_code = $scope.app.loginStoreCode;
            } else {
                $scope.flag = 3; //defaul select Unit
                $scope.facility_code = $cookieStore.get('userData').facility_code;
                $scope.store_code = $scope.app.loginStoreCode;
            }
            requestJSON = '{"store_code":"' + $scope.store_code + '","facility_code":"' + $scope.facility_code + '","unit_code":"' + $scope.unit_code + '","user_type":"' + $cookieStore.get('userData').role_type + '","flag":"' + $scope.flag + '","user_code":"' + $cookieStore.get('userData').user_code + '","time_zone":"' + $filter('date')(new Date(), "Z") + '"}';

            httpCall.remoteCall($scope, $http, APP_ACTION.GET_DASHBORD_DATA, requestJSON, function (record) {
                var valueData = record.responseData.dashbordData[0];

                $scope.page_order = record.responseData.recentPageOrderData;
                $scope.pen_status = record.responseData.recentPenData;
                $scope.pen_health_status = record.responseData.penHealthStatusData;

                //var new_page_weekly = record.responseData.chartNewPageData;
                $scope.pending_print_count = (parseFloat(valueData.printing_queue_pending) * 100 / (parseFloat(valueData.printing_done) + parseFloat(valueData.printing_queue_pending))).toFixed(2);
                if (isFinite($scope.pending_print_count) === false || isNaN($scope.pending_print_count) === true) {
                    $scope.pending_print_count = 0;
                }

                $scope.done_print_count = (parseFloat(valueData.printing_done) * 100 / (parseFloat(valueData.printing_done) + parseFloat(valueData.printing_queue_pending))).toFixed(2);
                if (isFinite($scope.done_print_count) === false || isNaN($scope.done_print_count) === true) {
                    $scope.done_print_count = 0;
                }
                $scope.dashbord = valueData;
                $scope.dashbord.dtotal = parseInt(valueData.facility_count) + parseInt(valueData.store_count) + parseInt(valueData.user_count)


                var printPagePIChartData = [
                    {
                        value: parseFloat($scope.done_print_count),
                        color: "#23b7e5"
                    },
                    {
                        value: parseFloat($scope.pending_print_count),
                        color: "#98a6ad"
                    }
                ];
                document.getElementById('printPagePIChart').setAttribute('type', 'Pie');
                $scope.printPagePIChart = {"data": printPagePIChartData, "options": {}};

//                $scope.printNewPageChart = {"data": printNewPageChartData, "options": {}};

                if (record.responseData.storesData.length > 0) {
                    $scope.stores = record.responseData.storesData;
                    if ($scope.store_code != null && $scope.store_code != "") {
                        $scope.getFacility();
                        if ($scope.facility_code != null && $scope.facility_code != "") {
                            $scope.getUnit();
                        }
                    }
                }
                if (record.responseData.companiesData.length > 0) {
                    $scope.facilities = record.responseData.companiesData;
                    if ($scope.facility_code != null && $scope.facility_code != "") {
                        $scope.getUnit();
                    }
                }
                if (record.responseData.nhUnitData.length > 0)
                    $scope.units = record.responseData.nhUnitData;
                if (record.responseData.terminalData.length > 0)
                    $scope.terminalData = record.responseData.terminalData;
                if ($scope.facility_code != '') {
                    var manual_doctor_day_group = valueData.manual_doctor_day;
                    if (manual_doctor_day_group != null) {
                        var manual_doctor_day = manual_doctor_day_group.split(',');
                        for (var j = 0; j < manual_doctor_day.length; j++) {
                            for (var k = 0; k < $scope.days.length; k++) {
                                if (manual_doctor_day[j] == $scope.days[k].id) {
                                    $scope.doctor_day += $scope.days[k].name + ', ';
                                }
                            }
                        }
                        $scope.doctor_day = $scope.doctor_day.substr(0, $scope.doctor_day.length - 2);
                    }

                }
                $scope.getChartData();
            }, function (message) {
            });
        };
        $scope.getChartData = function () {
            var requestJSON;
            requestJSON = '{"store_code":"' + $scope.store_code + '","facility_code":"' + $scope.facility_code + '","unit_code":"' + $scope.unit_code + '","user_type":"' + $cookieStore.get('userData').role_type + '","flag":"' + $scope.flag + '","user_code":"' + $cookieStore.get('userData').user_code + '","time_zone":"' + $filter('date')(new Date(), "Z") + '","is_status":"1"}';
            httpCall.remoteCall('', $http, APP_ACTION.GET_DASHBORD_DATA, requestJSON, function (record) {
                var printPage = record.responseData.printPageData;
                var page_weekly = record.responseData.chartPageData;
                $scope.pw_chart = [page_weekly[0].page, page_weekly[1].page, page_weekly[2].page, page_weekly[3].page, page_weekly[4].page, page_weekly[5].page, page_weekly[6].page];
                $scope.pw_chart_label = [page_weekly[0].bottom_day, page_weekly[1].bottom_day, page_weekly[2].bottom_day, page_weekly[3].bottom_day, page_weekly[4].bottom_day, page_weekly[5].bottom_day, page_weekly[6].bottom_day];
                $scope.pp_chart = [printPage[0].page, printPage[1].page, printPage[2].page, printPage[3].page, printPage[4].page, printPage[5].page, printPage[6].page];
                $scope.pp_chart_label = [printPage[0].bottom_day, printPage[1].bottom_day, printPage[2].bottom_day, printPage[3].bottom_day, printPage[4].bottom_day, printPage[5].bottom_day, printPage[6].bottom_day];
                var printPageChartData = {
                    labels: $scope.pp_chart_label,
                    datasets: [
                        {
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(40, 110, 227, 1)",
                            pointColor: "rgba(40, 110, 227, 1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,2)",
                            data: $scope.pp_chart
                        }
                    ]
                };
                var uploadPageChartData = {
                    labels: $scope.pw_chart_label,
                    datasets: [
                        {
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(120, 110, 227, 1)",
                            pointColor: "rgba(120, 110, 227, 1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,2)",
                            data: $scope.pw_chart
                        }
                    ]
                };
                $scope.printPageChart = {"data": printPageChartData, "options": {}};
                $scope.uploadPageChart = {"data": uploadPageChartData, "options": {}};
            }, function (message) {
            });
        };
        $scope.getDashbord();
        var rxtimeout;
        var rxtick = function () {
            $scope.getDashbord();
            rxtimeout = $timeout(rxtick, 180000); // reset the timer
        };
        rxtimeout = $timeout(rxtick, 180000);
        $scope.$on('$destroy', function () {
            $timeout.cancel(rxtimeout);
        });

        $scope.checkPenHelthStatus = function (cminute) {
            console.log(cminute);
            if (cminute > 0 && cminute <= 5) {
                return 'btn-success';
            } else if (cminute > 5 && cminute <= 10) {
                return 'btn-warning';
            } else {
                return 'btn-danger';
            }

        };
//        $scope.checkPenHelthStatus = function (cdate, healthstatus_dt, index) {
//            var myArr = healthstatus_dt.split(",");
////            var cdate1 = $filter('date')(new Date(cdate), "yyyy-MM-dd HH:mm");
////            var healthstatus_dt1 = $filter('date')(new Date(healthstatus_dt1), "yyyy-MM-dd HH:mm");
//            var dateDifference = (new Date(cdate.replace(/ /g, 'T'))).getTime() - (new Date(myArr[index].replace(/ /g, 'T'))).getTime(),
//                    seconds = Math.abs(dateDifference) / 1000,
//                    minutes = seconds / 60;
//            console.log(minutes);
//            if (minutes > 0 && minutes <= 5) {
//                $scope.batryHealthStatus = 'Connection Ok';
//                return 'btn-success';
//            } else if (minutes > 5 && minutes <= 10) {
//                $scope.batryHealthStatus = 'No Status Over 5min';
//                return 'btn-warning';
//            } else {
//                $scope.batryHealthStatus = 'No Status Over 10min';
//                return 'btn-danger';
//            }
//
//        };
        $scope.splitUnitName = function (uname) {
            var myArr = uname.split(",");
            return myArr;
        };


        $scope.getColor = function (val) {
            if (val > 3) {
                if (val % 3 == 0) {
                    val = 3;
                } else {
                    val = val % 3;
                }
            }
            switch (val) {
                case 1:
                    return 'b-primary';
                    break;
                case 2:
                    return 'b-warning';
                    break;
                case 3:
                    return 'b-success';
                    break;
            }
        };
        $scope.dateDifference = function (startdate, endDate) {

            endDate = endDate.replace(/ /g, 'T');
            startdate = startdate.replace(/ /g, 'T');

            var substitute = function (stringOrFunction, number, strings) {
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                var value = (strings.numbers && strings.numbers[number]) || number;
                return string.replace(/%d/i, value);
            },
                    nowTime = new Date(startdate).getTime(),
                    date = new Date(endDate).getTime(),
                    strings = {
                        prefixAgo: null,
                        prefixFromNow: null,
                        suffixAgo: "ago",
                        suffixFromNow: "from now",
                        seconds: "less than a minute",
                        minute: "about a minute",
                        minutes: "%d minutes",
                        hour: "about an hour",
                        hours: "about %d hours",
                        day: "a day",
                        days: "%d days",
                        month: "about a month",
                        months: "%d months",
                        year: "about a year",
                        years: "%d years"
                    },
                    dateDifference = nowTime - date,
                    words,
                    seconds = Math.abs(dateDifference) / 1000,
                    minutes = seconds / 60,
                    hours = minutes / 60,
                    days = hours / 24,
                    years = days / 365,
                    separator = strings.wordSeparator === undefined ? " " : strings.wordSeparator,
                    prefix = strings.prefixAgo,
                    suffix = strings.suffixAgo;
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
            words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
                    seconds < 90 && substitute(strings.minute, 1, strings) ||
                    minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
                    minutes < 90 && substitute(strings.hour, 1, strings) ||
                    hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
                    hours < 42 && substitute(strings.day, 1, strings) ||
                    days < 30 && substitute(strings.days, Math.round(days), strings) ||
                    days < 45 && substitute(strings.month, 1, strings) ||
                    days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
                    years < 1.5 && substitute(strings.year, 1, strings) ||
                    substitute(strings.years, Math.round(years), strings);
            return $.trim([prefix, words, suffix].join(separator));
        };



        $scope.getStoreRxDashbord = function () {
            if ($scope.store_code == null) {
                $scope.store_code = '';
                $scope.facility_code = '';
                $scope.unit_code = '';
                $scope.facilities = '';
                $scope.units = '';
            } else {
                $scope.facility_code = '';
                $scope.getFacility();
            }
            $scope.getDashbord();
        };
        $scope.getFacilityRxDashbord = function () {
            if ($scope.facility_code == null) {
                $scope.facility_code = '';
                $scope.unit_code = '';
                $scope.units = '';
            } else {
                $scope.unit_code = '';
                $scope.getUnit();
            }
            $scope.getDashbord();
        };

        $scope.getUnitRxDashbord = function () {
            if ($scope.unit_code == null) {
                $scope.unit_code = '';
            }
            $scope.getDashbord();
        };
        $scope.getfilterByVar = function () {
            var data = {store_code: $scope.store_code, facility_code: $scope.facility_code, unit_code: $scope.unit_code};
            $cookieStore.put('filterBy', '');
            $cookieStore.remove('filterBy');
            $cookieStore.put('filterBy', data);
            console.log(data);
        };
        $scope.goPenDashboardInfo = function () {
            $scope.getfilterByVar();
            $scope.app.rxDashboardPenInfo = 1;
        };
        $scope.gotoStore = function () {
            $scope.getfilterByVar();
//            console.log('gotoStore');
            if ($scope.store_code != null || $scope.store_code != "") {
                $cookieStore.put('store_code', $scope.store_code);
            }
            if ($scope.facility_code != null || $scope.facility_code != "") {
                $cookieStore.put('facility_code', $scope.facility_code);
            }
            if ($scope.unit_code != null || $scope.unit_code != "") {
                $cookieStore.put('unit_code', $scope.unit_code);
            }
            $state.go('app.table.store', {id: 1})
        };
        $scope.goFacilityHealthStatus = function () {
            $scope.getfilterByVar();
            $state.go('app.dashboardinfo')
        };
        $scope.goPrintDashboard = function () {
            $scope.getfilterByVar();
            $state.go('app.printdashboard')
        };
        $scope.goPrintService = function () {
            if ($scope.store_code != null || $scope.store_code != "") {
                $cookieStore.put('store_code', $scope.store_code);
            }
             if ($scope.facility_code != null || $scope.facility_code != "") {
                $cookieStore.put('facility_code', $scope.facility_code);
            }
            if ($scope.unit_code != null || $scope.unit_code != "") {
                $cookieStore.put('unit_code', $scope.unit_code);
            }
            $scope.getfilterByVar();
            $state.go('app.table.printservice')
        };

    }]);

app.controller('PenDashbordInfo', ['$scope', '$timeout', '$http', '$window', '$cookieStore', '$filter', 'httpCall', 'APP_ACTION', 'APP_PARAM', 'toaster', 'APP_MESSAGE',
    function ($scope, $timeout, $http, $window, $cookieStore, $filter, httpCall, APP_ACTION, APP_PARAM, toaster, APP_MESSAGE) {

        $scope.store_code = '';
        $scope.facility_code = '';
        $scope.unit_code = '';
        $scope.flag = '';
        $scope.getUnit = function () {
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_UNIT_BY_FACILITY_AND_USER, '{"facility_code":"' + $scope.facility_code + '","user_code":"' + $cookieStore.get('userData').user_code + '","role_type":"' + $cookieStore.get('userData').role_type + '"}', function (record) {
                $scope.units = record.responseData.unitData;
            }, function (message) {
            });
        };
        $scope.getFacility = function () {
            httpCall.remoteCall('', $http, APP_ACTION.GET_DRP_FACILITY_BY_STORE, '{"store_code":"' + $scope.store_code + '","user_code":"' + $cookieStore.get('userData').user_code + '"}', function (record) {
                $scope.facilities = record.responseData.companiesData;
            }, function (message) {

            });
        };
        if ($cookieStore.get('filterBy')) {
            var filterBy = $cookieStore.get('filterBy');
            $scope.store_code = filterBy.store_code;
            if ($scope.store_code)
                $scope.getFacility();
            $scope.facility_code = filterBy.facility_code;
            if ($scope.facility_code)
                $scope.getUnit();
            $scope.unit_code = filterBy.unit_code;
        }
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [20, 50, 100, 200, 500, 1000],
            pageSize: 20,
            currentPage: 1,
            totalServerItems: 0
        };
        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        if ($scope.app.loginRoleCode === 'PHADM' || $scope.app.loginRoleCode === 'SCNBT' || $scope.app.loginRoleCode === 'SCTT' ) {
            var requestJSON = '{"flag":"0"}';
            httpCall.remoteCall('', $http, APP_ACTION.GET_DRP_STORE, requestJSON, function (record) {
                $scope.stores = record.responseData.storesData;

            }, function (message) {
            });
        }




        $scope.getGridData = function () {
            if ($scope.store_code == null) {
                $scope.store_code = '';
            }
            $scope.facility_code = '';
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, 0);
            $scope.getFacility();

        };
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            var requestJSON;
            if ($scope.app.loginRoleCode === 'PHADM' || $scope.app.loginRoleCode === 'SCNBT' || $scope.app.loginRoleCode === 'SCTT' ) {
                $scope.flag = 1; //defaul select Store
            } else if ($scope.app.loginRoleType === 'PH') {
                $scope.store_code = $scope.app.loginStoreCode;
                $scope.flag = 2; //defaul select Facility
            } else {
                $scope.flag = 3; //defaul select Unit
                $scope.facility_code = $cookieStore.get('userData').facility_code;
            }
            requestJSON = '{"store_code":"' + $scope.store_code + '","facility_code":"' + $scope.facility_code + '","unit_code":"' + $scope.unit_code + '","role_type":"' + $cookieStore.get('userData').role_type + '","user_code":"' + $cookieStore.get('userData').user_code + '","flag":"' + $scope.flag + '","time_zone":"' + $filter('date')(new Date(), "Z") + '"}';
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_DASHBORD_PEN_INFO_DATA, requestJSON, function (record) {
                $scope.setPagingData(record.responseData.dashbordInfoData, page, pageSize);
                if (record.responseData.companiesData.length > 0)
                    $scope.facilities = record.responseData.companiesData;
                if (record.responseData.nhUnitData.length > 0)
                    $scope.units = record.responseData.nhUnitData;
            }, function (message) {
            });
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, '', 1);
//        $scope.tickInterval = 20000; //ms
//
//        var tick = function() {
//            $scope.clock = Date.now() // get the current time
//            $timeout(tick, $scope.tickInterval); // reset the timer
//            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, '', 1);
//        };
//        $timeout(tick, $scope.tickInterval);
        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.columnNames = [
            {field: "facility_name", displayName: "Facility"},
            {field: "unit_name", displayName: "Unit"},
            {field: "pen_code", displayName: "Pen Code"},
            {field: "pen_datasync_dt", displayName: "Uploaded Time"},
            {field: "pen_docked_dt", displayName: "Docked Time"},
            {field: "is_low_battery", displayName: "Battry", cellTemplate: '<div ng-class="{batterylow:row.entity.is_low_battery==1,batterycharged:row.entity.is_low_battery==0}"></div>', width: 70},
            {field: "is_active", displayName: "Pen", cellTemplate: '<div ng-class="{penactive:row.entity.is_active==1,pendeactive:row.entity.is_active==0}"></div>', width: 50}
//            {field: 'action', displayName: 'Action', cellTemplate: '<div ><i  class="glyphicon glyphicon-edit text-info-dker celltemplate" ng-click="editPage(row)" ui-sref="app.table.formprinter" ></i>\n\
//                  <i style="padding: 5px;" class="glyphicon glyphicon-trash text-info-dker celltemplate" ng-click="deletePage(row)"></i></div>', width: 80}
        ];
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: 'columnNames',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            multiSelect: false,
//            cellClass: 'cellToolTip',
//            rowHeight: 50,
//            enablePinning: true,
            enableRowSelection: true

        };

//        var tickPenInfoGrid = function() {
//            $timeout(tickPenInfoGrid, 1000); // reset the timer
//            $scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
//                    $scope.gridOptions.$gridScope,
//                    $scope.gridOptions.ngGrid
//                    );
//        };
//        $timeout(tickPenInfoGrid, 1000);

        $scope.getFacilityPrintData = function () {
            if ($scope.facility_code == null) {
                $scope.facility_code = '';
            }
            $scope.unit_code = '';
            $scope.getUnit();
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);

        };

        $scope.getUnitPrintData = function () {
            if ($scope.unit_code == null) {
                $scope.unit_code = '';
            }
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        };
        $scope.back = function () {
            $scope.app.rxDashboardPenInfo = 0;
        };
    }]);