app.controller('StoreCtrl', ['$scope', '$timeout', 'toaster', '$window', '$state', '$http', '$cookieStore', 'httpCall', 'APP_ACTION', 'APP_MESSAGE', 'ngDialog', '$filter',
    function($scope, $timeout, toaster, $window, $state, $http, $cookieStore, httpCall, APP_ACTION, APP_MESSAGE, ngDialog, $filter) {
    $scope.role_code=$cookieStore.get('userData').role_code;
        $scope.user = {};
        if ($state.params.id) {
            $scope.backButton = $state.params.id;
        } else {
            $scope.backButton = 0;
        }
        $cookieStore.put('editStore', '');
        $scope.authError = null;
        $scope.filterOptions = {
            filterText: "",
            searchText: '',
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [20, 50, 100, 200, 500, 1000],
            pageSize: 20,
            currentPage: 1,
            totalServerItems: 0
        };
        $scope.setPagingData = function(data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;

            if ($state.params.id) {
                if ($cookieStore.get('filterBy').store_code) {
                    $scope.entries = $cookieStore.get('filterBy').store_code;
                    $scope.myData = $filter('filter')($scope.myData, $scope.entries);
                    if (!$scope.$$phase)
                        $scope.$digest();
                }
            }

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getPagedDataAsync = function(pageSize, page, searchText) {
            var requestJSON = '{"search_text":""}';
            if (searchText) {
                requestJSON = '{"search_text":"' + searchText + '"}';
            }
//            $scope.promise = $http.get('http://httpbin.org/delay/3');
//            $scope.promise = $http;
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_STORE, requestJSON, function(record) {

                console.log(APP_ACTION.GET_STORE)
                console.log(record.responseData.storesData);
                $scope.setPagingData(record.responseData.storesData, page, pageSize);
            }, function(message) {
                $scope.setPagingData('', page, pageSize);

            });
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        $scope.$watch('pagingOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.pageSize !== oldVal.pageSize) {
                    $scope.pagingOptions.currentPage = 1;
                }
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.pagingOptions.currentPage = 1;
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.columnNames = [
            {field: "store_name", displayName: "Store Name"},
            {field: "store_phone", displayName: "Store Phone", width: 110},
            {field: "store_add1", displayName: "Address", cellTemplate: '<div class="ngCellText" tooltip="{{row.entity.store_add1}} {{row.entity.store_add2}}" tooltip-append-to-body="true" tooltip-trigger:"focus">{{row.entity[col.field]}}</div>'},
            {field: "store_email", displayName: "Store Email", cellTemplate: '<div class="ngCellText" tooltip="{{row.entity.store_email}}" tooltip-append-to-body="true" tooltip-trigger:"focus">{{row.entity[col.field]}}</div>'},
//            {field: "ref_store_code", displayName: "Kroll Ref", width: 60},
            {field: "facility_count", displayName: "Total Home", width: 50},
            {field: "print_queue_count", displayName: "Pending Queue", width: 70},
            {field: "machine_count", displayName: "Print Service", width: 60},
            {field: "fax_config_type", displayName: "Fax Type", cellTemplate: '<div class="ngCellText"><center><i tooltip="{{row.entity.fax_config_type}}" tooltip-append-to-body="true"  class="">{{row.entity.fax_config_type}}</i></center></div>', width: 80},
            {field: "fax_status", displayName: "Fax Status", cellTemplate: '<div class="ngCellText"><center><i ng-if="row.entity.fax_status == \'2\'" tooltip="Fax Not Configured" tooltip-append-to-body="true"  class="fa fa-fax text-dafault celltemplate"></i><i ng-if="row.entity.fax_status == \'0\'" tooltip="Fax Not Configured" tooltip-append-to-body="true" class="fa fa-fax text-danger celltemplate"></i><i ng-if="row.entity.fax_status == \'1\'" tooltip="Fax Configured" tooltip-append-to-body="true"  class="fa fa-fax text-success celltemplate"></i></center></div>', width: 60},
//            {field: 'action', displayName: 'Action', cellTemplate: '<div class="ngCellText"><i class="glyphicon glyphicon-edit text-info-dker celltemplate" ng-click="editPage(row)" ui-sref="app.table.formstore" tooltip="Edit" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></div>', width: 80}
//                  <i class="glyphicon glyphicon-trash text-info-dker celltemplate" ng-click="deletePage(row)" tooltip="Delete" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></div>', width: 80}
        ];
        if($scope.role_code !='SCNBT' && $scope.role_code !='SCTT' ){
            $scope.columnNames.push({field: 'action', displayName: 'Action', cellTemplate: '<div class="ngCellText"><i class="glyphicon glyphicon-edit text-info-dker celltemplate" ng-click="editPage(row)" ui-sref="app.table.formstore" tooltip="Edit" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></div>', width: 80});
        }
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: 'columnNames',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            multiSelect: false,
            headerRowHeight: 50,
            enableRowSelection: true
        };
        $scope.storeConfig = function(row) {
            console.log(row);
            $scope.store = row.entity;
            ngDialog.open({
                template: 'storeDialogId',
                controller: 'UnitConfigCtrl',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose: true
            });


        };
        $scope.editPage = function(row) {
            $cookieStore.put('editStore', row.entity);
        };
        $scope.deletePage = function(row) {
            if ($window.confirm(APP_MESSAGE.DELETE_MESSAGE) === true) {
                var me = this;
                var requestJSON = '{"store_code":"' + row.entity.store_code + '","search_text":"' + $scope.filterOptions.filterText + '"}';
                httpCall.remoteCall($scope, $http, APP_ACTION.DELETE_STORE, requestJSON, function(record) {
                    $scope.setPagingData(record.responseData.storesData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    toaster.pop(APP_MESSAGE.SUCCESS, APP_MESSAGE.MESSAGE, record.message);
                }, function(message) {
                    toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);

                });
            }
        };

    }]);
app.controller('FormStoreCtrl', ['$scope', 'toaster', '$http', '$state', '$filter', '$cookieStore', 'httpCall', 'APP_ACTION', 'APP_MESSAGE',
    function($scope, toaster, $http, $state, $filter, $cookieStore, httpCall, APP_ACTION, APP_MESSAGE) {
        $scope.user = {
            store_fax: '',
            store_des: '',
            store_add1: '',
            store_add2: '',
            store_postal: '',
            store_county: '',
            store_province: '',
            store_city: '',
            ref_store_code: '',
            qas_mode: 0,
            qos_warn_notification: 0,
            is_backup_service: 0,
            time_zone_code: ''
        };

        $scope.getTimeZone = function() {
            var requestJSON = '';
            httpCall.remoteCall('', $http, APP_ACTION.GET_DRP_TIME_ZONE, requestJSON, function(record) {
                $scope.timeZone = record.responseData.timeZoneData;
            }, function(message) {
            });
        };
        $scope.getTimeZone();
        $scope.phoneNumbr = /^[ +0-9]*$/;
        if ($cookieStore.get('editStore')) {
            $scope.user = $cookieStore.get('editStore');
            $scope.user.qas_mode = parseInt($scope.user.qas_mode);
           
            $scope.user.is_backup_service = parseInt($scope.user.is_backup_service);
            $scope.user.qos_warn_notification = parseInt($scope.user.qos_warn_notification);
            console.log($cookieStore.get('editStore').store_ip);
            if ($cookieStore.get('editStore').store_ip == 'undefined' || $cookieStore.get('editStore').store_ip == undefined || $cookieStore.get('editStore').store_ip == null)
                $scope.user.store_ip = '';
            $scope.formname = 'Edit Store';

        } else {

            $scope.formname = 'Add Store';
            $scope.insertStore = function() {
                getTimeZoneData($scope.user.time_zone_code, function(time_zone, time_zone_name) {
                    var dt_added = $filter('date')(new Date(), "yyyy-MM-dd HH:mm");
                    if ($scope.user.store_ip == 'undefined' || $scope.user.store_ip == undefined || $scope.user.store_ip == null)
                        $scope.user.store_ip = '';
                    var requestJSON = '{"store_name":"' + $scope.user.store_name + '","store_add1":"' + $scope.user.store_add1 + '","store_add2":"' + $scope.user.store_add2 + '","store_phone":"' + $scope.user.store_phone + '","store_email":"' + $scope.user.store_email + '","store_fax":"' + $scope.user.store_fax + '","store_county":"' + $scope.user.store_county + '","store_province":"' + $scope.user.store_province + '","store_city":"' + $scope.user.store_city + '","store_postal":"' + $scope.user.store_postal + '","store_des":"' + $scope.user.store_des + '","user_code":"' + $cookieStore.get('userData').user_code + '","company_code":"","store_ip":"' + $scope.user.store_ip + '","store_img":"","dt_added":"' + dt_added + '","time_zone":"' + time_zone + '","time_zone_code":"' + $scope.user.time_zone_code + '","ref_store_code":"' + $scope.user.ref_store_code + '","qas_mode":"' + $scope.user.qas_mode + '","time_zone_name":"' + time_zone_name + '","qos_warn_notification":"' + $scope.user.qos_warn_notification +'","is_backup_service":"' + $scope.user.is_backup_service +'"}';
                    httpCall.remoteCall($scope, $http, APP_ACTION.ADD_STORE, requestJSON, function(record) {
                        $scope.user = {};
                        $state.go("app.table.store");
                        toaster.pop(APP_MESSAGE.SUCCESS, APP_MESSAGE.MESSAGE, record.message);
                    }, function(message) {
                        toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);

                    });
                });

            };
        }
        function getTimeZoneData(item, callback) {
            var time_zone = '';
            var time_zone_name = '';
            var data = $scope.timeZone
            for (var j = 0; j < data.length; j++) {
                if (data[j].time_zone_code == item) {
                    time_zone = data[j].time_zone,
                            time_zone_name = data[j].default_time_zone
                }
            }
            callback(time_zone, time_zone_name);
        }
        ;


    }]);
