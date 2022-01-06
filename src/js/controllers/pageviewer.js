app.filter("propsFilter", function () {
    console.log("lalabhai");
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.controller("PageViewerCtrl", [
    "$scope",
    "$window",
    "$timeout",
    "toaster",
    "$filter",
    "$state",
    "$http",
    "$cookieStore",
    "httpCall",
    "APP_ACTION",
    "APP_MESSAGE",
    function (
            $scope,
            $window,
            $timeout,
            toaster,
            $filter,
            $state,
            $http,
            $cookieStore,
            httpCall,
            APP_ACTION,
            APP_MESSAGE
            ) {
        $scope.store_code = "";
        $scope.facility_code = "";
        $scope.unit_code = "";
        $scope.paper_type_code = "";
        $scope.is_unit = 0;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.units = [];
        $scope.app.canvas = 0;
        $scope.authError = null;
        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true,
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [20, 50, 100, 200, 500, 1000],
            pageSize: 20,
            currentPage: 1,
            totalServerItems: 0,
        };
        $scope.setPagingData = function (data, page, pageSize) {
            //            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = data;
            $scope.app.abc = JSON.stringify(data);
            //            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getStore = function () {
            httpCall.remoteCall(
                    "",
                    $http,
                    APP_ACTION.GET_DRP_STORE,
                    "",
                    function (record) {
                        $scope.stores = record.responseData.storesData;
                    },
                    function (message) {}
            );
        };
        if (
                $scope.app.loginRoleCode === "PHADM" ||
                $scope.app.loginRoleCode == "SCNBT" ||
                $scope.app.loginRoleCode == "SCTT"
                ) {
            $scope.store_code = "";
            $scope.is_unit = 1;
            $scope.getStore();
        } else if ($cookieStore.get("userData").role_type === "PH") {
            $scope.store_code = $cookieStore.get("userData").store_code;
            $scope.is_unit = 1;
        } else {
            $scope.facility_code = $cookieStore.get("userData").facility_code;
            $scope.is_unit = 2;
        }
        httpCall.remoteCall(
                $scope,
                $http,
                APP_ACTION.GET_PAPER_TYPE,
                '{"facility_code":"' +
                $scope.facility_code +
                '","user_code":"' +
                $cookieStore.get("userData").user_code +
                '","role_type":"' +
                $cookieStore.get("userData").role_type +
                '"}',
                function (record) {
                    $scope.papers = record.responseData.paperTypeData;
                },
                function (message) {}
        );
        $scope.getUnit = function () {
            httpCall.remoteCall(
                    $scope,
                    $http,
                    APP_ACTION.GET_UNIT_BY_FACILITY_AND_USER,
                    '{"facility_code":"' +
                    $scope.facility_code +
                    '","user_code":"' +
                    $cookieStore.get("userData").user_code +
                    '","role_type":"' +
                    $cookieStore.get("userData").role_type +
                    '"}',
                    function (record) {
                        $scope.units = record.responseData.unitData;
                    },
                    function (message) {}
            );
        };
        $scope.getViewerPageCount = function (
                scope,
                start_date,
                end_date,
                store_code,
                facility_code,
                unit_code,
                search,
                is_unit,
                paper_type_code,
                pageSize,
                page
                ) {
            if (start_date) {
                start_date = $filter("date")(start_date, "yyyy-MM-dd");
            } else {
                start_date = "";
            }
            if (end_date) {
                end_date = $filter("date")(end_date, "yyyy-MM-dd");
            } else {
                end_date = "";
            }

            var requestJSON =
                    '{"is_counter_flg":"1","start_date": "' +
                    start_date +
                    '", "end_date": "' +
                    end_date +
                    '","store_code":"' +
                    store_code +
                    '","facility_code":"' +
                    facility_code +
                    '","unit_code":"' +
                    unit_code +
                    '","search_text":"' +
                    search +
                    '","role_type":"' +
                    $cookieStore.get("userData").role_type +
                    '","user_code":"' +
                    $cookieStore.get("userData").user_code +
                    '","is_unit":"' +
                    is_unit +
                    '","paper_type_code":"' +
                    paper_type_code +
                    '","time_zone":"' +
                    $filter("date")(new Date(), "Z") +
                    '","limit":"' +
                    pageSize +
                    '","page":"' +
                    page +
                    '"}';
            httpCall.remoteCall(
                    "",
                    $http,
                    APP_ACTION.GET_ALL_PAGE_INFO,
                    requestJSON,
                    function (record) {
                        $scope.totalServerItems = record.responseData.countViewer;
                        if ($scope.totalServerItems == 0) {
                            $scope.totalServerItems = 0;
                        } else {
                            $scope.totalServerPages = Math.ceil(
                                    record.responseData.countViewer / pageSize
                                    );
                        }
                    },
                    function (message) {
                        $scope.totalServerItems = 0;
                    }
            );
        };
        $scope.viewerData = {};
        $scope.getPagedDataAsync = function (pageSize, page, searchText, r) {
            var search = "",
                    scope;
            //            var store_code = '';
            if (searchText)
                search = searchText;
            else
                search = "";
            if (r == "R")
                scope = "";
            else
                scope = $scope;

            if ($scope.startDate) {
                $scope.startDate = $filter("date")($scope.startDate, "yyyy-MM-dd");
            } else {
                $scope.startDate = "";
            }
            if ($scope.endDate) {
                $scope.endDate = $filter("date")($scope.endDate, "yyyy-MM-dd");
            } else {
                $scope.endDate = "";
            }
            var requestJSON =
                    '{"start_date": "' +
                    $scope.startDate +
                    '", "end_date": "' +
                    $scope.endDate +
                    '","store_code":"' +
                    $scope.store_code +
                    '","facility_code":"' +
                    $scope.facility_code +
                    '","unit_code":"' +
                    $scope.unit_code +
                    '","search_text":"' +
                    search +
                    '","role_type":"' +
                    $cookieStore.get("userData").role_type +
                    '","user_code":"' +
                    $cookieStore.get("userData").user_code +
                    '","is_unit":"' +
                    $scope.is_unit +
                    '","paper_type_code":"' +
                    $scope.paper_type_code +
                    '","search_text":"' +
                    search +
                    '","time_zone":"' +
                    $filter("date")(new Date(), "Z") +
                    '","limit":"' +
                    pageSize +
                    '","page":"' +
                    page +
                    '"}';
            httpCall.remoteCall(
                    scope,
                    $http,
                    APP_ACTION.GET_ALL_PAGE_INFO,
                    requestJSON,
                    function (record) {
                        if (record.responseData.nhUnitData.length > 0)
                            $scope.units = record.responseData.nhUnitData;
                        if (record.responseData.phCompanyData.length > 0)
                            $scope.facilities = record.responseData.phCompanyData;
                        if (record.responseData.storesData.length > 0)
                            $scope.stores = record.responseData.storesData;
                        //                $scope.setPagingData(record.responseData.nhpageinfoData, page, pageSize);
                        $scope.setResidentName(
                                record.responseData.nhpageinfoData,
                                function (cb_data) {
                                    console.log(cb_data);
                                    $scope.setPagingData(cb_data, page, pageSize);
                                }
                        );
                        $scope.getViewerPageCount(
                                scope,
                                $scope.startDate,
                                $scope.endDate,
                                $scope.store_code,
                                $scope.facility_code,
                                $scope.unit_code,
                                search,
                                $scope.is_unit,
                                $scope.paper_type_code,
                                pageSize,
                                page
                                );

                        var searchButtonClass = document.getElementById("searchButton");
                        if (searchButtonClass.classList.contains("btn-success") === false) {
                            searchButtonClass.classList.add("btn-success");
                            searchButtonClass.disabled = false;
                        }
                    },
                    function (message) {
                        var searchButtonClass = document.getElementById("searchButton");
                        if (searchButtonClass.classList.contains("btn-success") === false) {
                            searchButtonClass.classList.add("btn-success");
                            searchButtonClass.disabled = false;
                        }
                        $scope.totalServerItems = 0;
                        $scope.authError = message;
                        $scope.setPagingData("", page, pageSize);
                    }
            );
        };
        $scope.$watch(
                "pagingOptions",
                function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (newVal.pageSize !== oldVal.pageSize) {
                            $scope.pagingOptions.currentPage = 1;
                        }
                        $scope.getPagedDataAsync(
                                $scope.pagingOptions.pageSize,
                                $scope.pagingOptions.currentPage,
                                $scope.filterOptions.filterText
                                );
                    }
                },
                true
                );
        //        $scope.$watch('filterOptions', function (newVal, oldVal) {
        //            if (newVal !== oldVal) {
        //                $scope.pagingOptions.currentPage = 1;
        //                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        //            }
        //        }, true);
        $scope.searchViewer = function () {
            var searchButtonClass = document.getElementById("searchButton");
            searchButtonClass.classList.remove("btn-success");
            searchButtonClass.disabled = true;
            $scope.getPagedDataAsync(
                    $scope.pagingOptions.pageSize,
                    $scope.pagingOptions.currentPage,
                    $scope.filterOptions.filterText
                    );
            $scope.pagingOptions.currentPage = 1;
        };
        $scope.viewerSearchClear = function () {
            $scope.filterOptions.filterText = "";
            $scope.getPagedDataAsync(
                    $scope.pagingOptions.pageSize,
                    $scope.pagingOptions.currentPage,
                    $scope.filterOptions.filterText
                    );
        };
        //        if ($scope.app.canvas === 0) {
        $scope.getPagedDataAsync(
                $scope.pagingOptions.pageSize,
                $scope.pagingOptions.currentPage
                );
        $timeout.cancel();
        //        $scope.tickInterval = 60000; //ms
        //        var viewerTimeout;
        //        var tick = function() {
        //            viewerTimeout = $timeout(tick, $scope.tickInterval); // reset the timer
        //            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, 'R');
        //        };
        //        viewerTimeout = $timeout(tick, $scope.tickInterval);

        //        }
        var cellTemp;
        $scope.columnNames = [
            {
                field: "{{row.rowIndex}}",
                displayName: "Sr.#",
                cellTemplate:
                        '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text="">{{row.rowIndex + 1}}</span></div>',
                width: 50,
            },
        ];
        if (
                $scope.app.loginRoleCode === "PHADM" ||
                $scope.app.loginRoleCode == "SCNBT" ||
                $scope.app.loginRoleCode == "SCTT"
                ) {
            $scope.columnNames.push({field: "facility_name", displayName: "Home"});
            cellTemp =
                    '<div class="text-center bg-light lter"><center><i class="glyphicon glyphicon-eye-open text-info-dker celltemplate" ng-click="view(row)" tooltip="View Data" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></center></div>';
        } else if ($scope.app.loginRoleCode === "STRADM") {
            $scope.columnNames.push({field: "facility_name", displayName: "Home"});
            cellTemp =
                    '<div class="bg-light lter"><center><i class="glyphicon glyphicon-eye-open text-info-dker celltemplate" ng-click="view(row)" tooltip="View Data" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></center></div>';
        } else {
            cellTemp =
                    '<div class="bg-light lter"><center><i class="glyphicon glyphicon-eye-open text-info-dker celltemplate" ng-click="view(row)" tooltip="View Data" tooltip-append-to-body="true" tooltip-trigger:"focus"></i></center></div>';
        }
        //        <i ng-show="row.entity.is_reprint==0" class="fa fa-print text-info-dker celltemplate" ng-click="reprintPage(row)" tooltip="Reprint" tooltip-append-to-body="true" tooltip-trigger:"focus"></i>
        $scope.columnNames.push(
                {field: "unit_name", displayName: "UnitName"},
                //               {field: "metadata",displayName: "Resident Name", cellTemplate: '<div class="ngCellText">{{getMetadata(row)}}</div>'},
                        {field: "resident_name", displayName: "Resident Name"},
                        {field: "dt_last_used", displayName: "Order Date/Time"},
                        //        {field: "page_info_code", displayName: "Order Page #"},
                                {field: "page_address", displayName: "Order Page #"},
                                {field: "paper_type", displayName: "Form Type"},
                                {
                                    field: "print_redy",
                                    displayName: "Status",
                                    cellTemplate:
                                            '<div><center>\n\
<i ng-if="row.entity.print_redy == -1 && row.entity.dt_print == null" tooltip="Draft" tooltip-append-to-body="true" ><img src="img/draftxxxhdpi.png" style="width:14px;"/></i>\n\
<i ng-if="row.entity.print_redy == 1 && row.entity.dt_print == null" class="fa fa-list text-default" tooltip="{{row.entity.dt_print}}" tooltip-append-to-body="true" ></i>\n\
<i ng-if="row.entity.print_redy == 1  && row.entity.dt_print != null" class="fa fa-print text-success" tooltip="{{row.entity.dt_print}}" tooltip-append-to-body="true" ></i>\n\
<i ng-if="row.entity.print_redy == 11" class="fa fa-fax text-success" tooltip="{{row.entity.dt_print}}" tooltip-append-to-body="true" ></i>\n\
<i ng-if="row.entity.print_redy == 0" class="fa fa-list text-warning" tooltip="{{row.entity.dt_print}}" tooltip-append-to-body="true" ></i>\n\
</center></div>',
                                    width: 60,
                                },
                                {
                                    field: "action",
                                    displayName: "Action",
                                    cellTemplate: cellTemp,
                                    width: 60,
                                }
                        );

                        var leftSideOfFooter =
                                '<div class="ngTotalSelectContainer"><div class="ngFooterTotalItems ngNoMultiSelect" ng-class="{\'ngNoMultiSelect\': !multiSelect}">' +
                                '<span class="ngLabel ng-binding" ng-if="(pagingOptions.pageSize*pagingOptions.currentPage)<=totalServerItems">Total Items: {{pagingOptions.pageSize*pagingOptions.currentPage-(pagingOptions.pageSize-1)}} - {{pagingOptions.pageSize*pagingOptions.currentPage}}/{{totalServerItems}}</span><span class="ngLabel ng-binding" ng-if="(pagingOptions.pageSize*pagingOptions.currentPage)>totalServerItems">Total Items: {{pagingOptions.pageSize*pagingOptions.currentPage-(pagingOptions.pageSize-1)}}-{{totalServerItems}}/{{totalServerItems}}</span>' +
                                "</div>" +
                                '<div class="ngFooterSelectedItems ng-hide" ng-show="multiSelect">' +
                                '<span class="ngLabel ng-binding">Selected Items: 0</span>' +
                                "</div>" +
                                "</div>";

                        var pagination =
                                '<div class="ngPagerContainer ngNoMultiSelect" style="float: right; margin-top: 10px;" ng-show="enablePaging" ng-class="{\'ngNoMultiSelect\': !multiSelect}"><div style="float:left; margin-right: 10px;" class="ngRowCountPicker">' +
                                '<span style="float: left; margin-top: 3px;" class="ngLabel ng-binding"><center>\n\
<i style="padding-right: 10px;" class="fa fa-list text-default" tooltip="Data received only with resident information" tooltip-append-to-body="true" ></i>\n\
<i style="padding-right: 10px;" class="fa fa-print text-success" tooltip="Print Done" tooltip-append-to-body="true" ></i>\n\
<i style="padding-right: 10px;" class="fa fa-fax text-success" tooltip="Fax Done" tooltip-append-to-body="true" ></i>\n\
<i style="padding-right: 10px;" class="fa fa-list text-warning" tooltip="Print in Queue" tooltip-append-to-body="true" ></i>\n\
<i style="padding-right: 10px;" tooltip="Order in draft" tooltip-append-to-body="true" ><img src="img/draftxxxhdpi.png" style="width:14px;"/></i>\n\
</center></span>' +
                                '<span style="float: left; margin-top: 3px;" class="ngLabel ng-binding">Page Size:</span>' +
                                '<select style="float: left;height: 27px; width: 100px"  class="ng-pristine ng-untouched ng-valid" ng-model="pagingOptions.pageSize" ng-options="values for values in pagingOptions.pageSizes" ></select>' +
                                "</div>" +
                                '<div style="float:left; margin-right: 10px; line-height:25px;" class="ngPagerControl">' +
                                '   <button type="button" class="ngPagerButton" ng-click="pageToFirst()" ng-disabled="cantPageBackward()" title="First Page" disabled="disabled"><div class="ngPagerFirstTriangle"><div class="ngPagerFirstBar"></div></div></button>' +
                                '  <button type="button" class="ngPagerButton" ng-click="pageBackward()" ng-disabled="cantPageBackward()" title="Previous Page" disabled="disabled"><div class="ngPagerFirstTriangle ngPagerPrevTriangle"></div></button>' +
                                ' <input class="ngPagerCurrent ng-pristine ng-untouched ng-valid ng-valid-min" min="1" max="8" type="number" style="width:50px; height: 24px; margin-top: 1px; padding: 0 4px;" ng-model="pagingOptions.currentPage">' +
                                '<span class="ngGridMaxPagesNumber ng-binding" ng-show="maxPages() > 0">/{{totalServerPages}}</span>' +
                                '<button type="button" class="ngPagerButton" ng-click="pageForward()" ng-disabled="cantPageForward()" title="Next Page"><div class="ngPagerLastTriangle ngPagerNextTriangle"></div></button>' +
                                '<button type="button" class="ngPagerButton" ng-click="pageToLast()" ng-disabled="cantPageToLast()" title="Last Page"><div class="ngPagerLastTriangle"><div class="ngPagerLastBar"></div></div></button>' +
                                "</div>" +
                                "</div>";
                        $scope.getMetadata = function (row) {
                            if (row.entity.metadata) {
                                return (
                                        JSON.parse(row.entity.metadata).patient_fname +
                                        " " +
                                        JSON.parse(row.entity.metadata).patient_lname
                                        );
                            }
                        };

                        $scope.setResidentName = function (data, callback) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].metadata && JSON.parse(data[i].metadata)) {
                                    let patient_name = "";
                                    let metadata = JSON.parse(data[i].metadata);
                                    if (metadata.patient_fname) {
                                        patient_name += metadata.patient_fname + " ";
                                    }
                                    if (metadata.patient_lname) {
                                        patient_name += metadata.patient_lname;
                                    }
                                    if (patient_name == "" && metadata.patient_name) {
                                        patient_name += metadata.patient_name;
                                    }
                                    data[i].resident_name = patient_name;
                                    // JSON.parse(data[i].metadata).patient_fname +
                                    // " " +
                                    // JSON.parse(data[i].metadata).patient_lname;
                                }
                            }
                            callback(data);
                        };
                        $scope.gridOptions = {
                            data: "myData",
                            columnDefs: "columnNames",
                            enablePaging: true,
                            showFooter: true,
                            //scroll: true,
                            totalServerItems: "totalServerItems",
                            pagingOptions: $scope.pagingOptions,
                            filterOptions: $scope.filterOptions,
                            multiSelect: false,
                            enableRowSelection: true,
                            //plugins: [new httpCall.ngGridFlexibleHeightPlugin()],
                            footerTemplate: leftSideOfFooter + pagination,
                        };
                        var viewerGridTimeout;
                        var tickGrid = function () {
                            viewerGridTimeout = $timeout(tickGrid, 1000); // reset the timer
                            $scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
                                    $scope.gridOptions.$gridScope,
                                    $scope.gridOptions.ngGrid
                                    );
                        };
                        viewerGridTimeout = $timeout(tickGrid, 1000);
                        $scope.$on("$destroy", function () {
                            $timeout.cancel(viewerGridTimeout);
                        });

                        $scope.searchClear = function () {
                            $scope.startDate = "";
                            $scope.endDate = "";
                            $scope.unit_code = "";
                            $scope.paper_type_code = "";
                            $scope.pagingOptions.currentPage = 1;
                            if ($cookieStore.get("userData").role_type == "PH") {
                                $scope.facility_code = "";
                                $scope.store_code = "";
                                $scope.units = "";
                            }
                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage
                                    );
                        };
                        $scope.search = function () {
                            $scope.pagingOptions.currentPage = 1;
                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage
                                    );
                        };

                        $scope.view = function (row) {
                            var startDate = "";
                            var endDate = "";
                            if ($scope.startDate) {
                                startDate = $filter("date")($scope.startDate, "yyyy-MM-dd");
                            }
                            if ($scope.endDate) {
                                endDate = $filter("date")($scope.endDate, "yyyy-MM-dd");
                            }
                            $scope.is_reprint = row.entity.is_reprint;
                            var pageCanvasQueryData = {
                                start_date: startDate,
                                end_date: endDate,
                                page_info_code: row.entity.page_info_code,
                                is_reprint: row.entity.is_reprint,
                                nh_paper_data_id: row.entity.nh_paper_data_id,
                                time_zone: row.entity.time_zone,
                                paper_type_version_code: row.entity.paper_type_version_code,
                                nh_paper_printque_id: row.entity.nh_paper_printque_id,
                            };
                            $cookieStore.put("pageCanvasQueryData", pageCanvasQueryData);
                            $scope.app.canvas = 1;
                            $scope.app.selectedIndex = row.rowIndex;
                            //            $state.go('app.page.canvas');
                        };
                        $scope.editPage = function (row) {
                            $cookieStore.put("editPaperData", row.entity);
                        };

                        $scope.getStorePageData = function () {
                            $scope.is_unit = 1;
                            if ($scope.store_code == null) {
                                $scope.store_code = "";
                                //                $scope.is_unit = 0;
                            }
                            $scope.facility_code = "";
                            $scope.unit_code = "";
                            $scope.facilities = "";
                            $scope.units = "";

                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage,
                                    $scope.filterOptions.filterText
                                    );
                        };
                        $scope.getFacilityPageData = function () {
                            $scope.is_unit = 2;
                            if ($scope.facility_code == null) {
                                $scope.facility_code = "";
                                $scope.is_unit = 1;
                            }
                            //            else {
                            //                console.log($scope.facilities);
                            //                console.log($scope.viewerData);
                            //                if ($scope.viewerData.length > 0) {
                            //                    $scope.store_code = $scope.viewerData.store_code;
                            //                }
                            //            }
                            $scope.unit_code = "";
                            $scope.units = "";
                            $scope.pagingOptions.currentPage = 1;

                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage,
                                    $scope.filterOptions.filterText
                                    );
                        };
                        $scope.getUnitPageData = function () {
                            if ($scope.unit_code == null) {
                                $scope.unit_code = "";
                            }
                            $scope.pagingOptions.currentPage = 1;
                            $scope.is_unit = 3;
                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage,
                                    $scope.filterOptions.filterText
                                    );
                        };
                        $scope.getPaperPageData = function () {
                            if ($scope.paper_type_code == null) {
                                $scope.paper_type_code = "";
                            }
                            $scope.pagingOptions.currentPage = 1;
                            $scope.getPagedDataAsync(
                                    $scope.pagingOptions.pageSize,
                                    $scope.pagingOptions.currentPage,
                                    $scope.filterOptions.filterText
                                    );
                        };

                        $scope.deletePage = function (row) {
                            if ($window.confirm(APP_MESSAGE.DELETE_MESSAGE) === true) {
                                var search = "";
                                var store_code = "";
                                if ($scope.filterOptions.filterText)
                                    search = $scope.filterOptions.filterText;
                                else
                                    search = "";
                                if ($cookieStore.get("userData").role_type === "PH") {
                                    store_code = $cookieStore.get("userData").store_code;
                                } else {
                                    $scope.facility_code = $cookieStore.get("userData").facility_code;
                                    $scope.is_unit = 1;
                                    $scope.getUnit();
                                    store_code = "";
                                }
                                if ($scope.startDate) {
                                    $scope.startDate = $filter("date")($scope.startDate, "yyyy-MM-dd");
                                }
                                if ($scope.endDate) {
                                    $scope.endDate = $filter("date")($scope.endDate, "yyyy-MM-dd");
                                }

                                var requestJSON =
                                        '{"page_info_code":"' +
                                        row.entity.page_info_code +
                                        '","start_date": "' +
                                        $scope.startDate +
                                        '", "end_date": "' +
                                        $scope.endDate +
                                        '","store_code":"' +
                                        store_code +
                                        '","facility_code":"' +
                                        $scope.facility_code +
                                        '","unit_code":"' +
                                        $scope.unit_code +
                                        '","search_text":"' +
                                        search +
                                        '","role_type":"' +
                                        $cookieStore.get("userData").role_type +
                                        '","user_code":"' +
                                        $cookieStore.get("userData").user_code +
                                        '","is_unit":"' +
                                        $scope.is_unit +
                                        '","paper_type_code":"' +
                                        $scope.paper_type_code +
                                        '","search_text":"' +
                                        search +
                                        '","time_zone":"' +
                                        $filter("date")(new Date(), "Z") +
                                        '"}';
                                //                console.log(requestJSON);
                                httpCall.remoteCall(
                                        $scope,
                                        $http,
                                        APP_ACTION.DELETE_PAGE_INFO,
                                        requestJSON,
                                        function (record) {
                                            $scope.setPagingData(
                                                    record.responseData.nhpageinfoData,
                                                    $scope.pagingOptions.currentPage,
                                                    $scope.pagingOptions.pageSize
                                                    );

                                            toaster.pop(
                                                    APP_MESSAGE.SUCCESS,
                                                    APP_MESSAGE.MESSAGE,
                                                    record.message
                                                    );
                                        },
                                        function (message) {
                                            toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);
                                        }
                                );
                            }
                        };

                        /*$scope.startDateOpen = function($event) {
                         console.log('startDate');
                         //            $event.preventDefault();
                         //            $event.stopPropagation();
                         
                         $scope.startDateOpened = true;
                         };
                         $scope.endDateOpen = function($event) {
                         //            $event.preventDefault();
                         //            $event.stopPropagation();
                         
                         $scope.endDateOpened = true;
                         };
                         
                         
                         // Disable weekend selection
                         $scope.disabled = function(date, mode) {
                         return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
                         };
                         
                         $scope.dateOptions = {
                         showWeeks: false,
                         startingDay: 1
                         };
                         
                         $scope.timeOptions = {
                         readonlyInput: false,
                         showMeridian: false
                         };
                         
                         $scope.dateModeOptions = {
                         minMode: 'year',
                         maxMode: 'year'
                         };*/

                        $scope.clear = function () {
                            $scope.startDate = "";
                        };

                        // Disable weekend selection
                        $scope.disabled = function (date, mode) {
                            return mode === "day" && (date.getDay() === 0 || date.getDay() === 6);
                        };

                        $scope.toggleMin = function () {
                            $scope.minDate = $scope.minDate ? null : new Date();
                            $scope.startDate = "";
                            $scope.endDate = "";
                        };
                        $scope.toggleMin();

                        $scope.startDateOpen = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            $scope.startDateOpened = true;
                        };
                        $scope.endDateOpen = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            $scope.endDateOpened = true;
                        };

                        $scope.dateOptions = {
                            showWeeks: false,
                            startingDay: 1,
                        };
                        $scope.timeOptions = {
                            readonlyInput: false,
                            showMeridian: false,
                        };
                        $scope.dateModeOptions = {
                            minMode: "year",
                            maxMode: "year",
                        };
                        $scope.dtmax = new Date();
                        $scope.initDate = new Date("2016-15-20");
                        $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
                        $scope.format = $scope.formats[0];

                        //        $scope.reprintData = function() {
                        //            $scope.row = {entity: {}}
                        //            $scope.row.entity.page_info_code = $cookieStore.get('pageCanvasQueryData').page_info_code;
                        //            $scope.reprintPage($scope.row);
                        //        };

                        //$scope.reprintPage = function(row) {
                        //            if ($window.confirm(APP_MESSAGE.PRINT_QUEUE_MESSAGE) === true) {
                        //                $scope.app.canvas = 1;
                        //                var search = '';
                        //                var store_code = '';
                        //                if ($scope.filterOptions.filterText)
                        //                    search = $scope.filterOptions.filterText;
                        //                else
                        //                    search = '';
                        //                if ($cookieStore.get('userData').role_type === 'PH') {
                        //                    store_code = $cookieStore.get('userData').store_code;
                        //                } else {
                        //                    $scope.facility_code = $cookieStore.get('userData').facility_code;
                        //                    $scope.is_unit = 1;
                        //                    $scope.getUnit();
                        //                    store_code = '';
                        //                }
                        //                if ($scope.startDate) {
                        //                    $scope.startDate = $filter('date')($scope.startDate, "yyyy-MM-dd");
                        //                }
                        //                if ($scope.endDate) {
                        //                    $scope.startDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
                        //                }
                        //                var requestJSON = '{"page_info_code":"' + row.entity.page_info_code + '","start_date": "' + $scope.startDate + '", "end_date": "' + $scope.endDate + '","store_code":"' + store_code + '","facility_code":"' + $scope.facility_code + '","unit_code":"' + $scope.unit_code + '","search_text":"' + search + '","role_type":"' + $cookieStore.get('userData').role_type + '","user_code":"' + $cookieStore.get('userData').user_code + '","is_unit":"' + $scope.is_unit + '","paper_type_code":"' + $scope.paper_type_code + '","search_text":"' + search + '","time_zone":"' + $filter('date')(new Date(), "Z") + '"}';
                        //                console.log(requestJSON)
                        //                httpCall.remoteCall($scope, $http, APP_ACTION.ADD_PRINT_QUEUE, requestJSON, function(record) {
                        //                    console.log(record);
                        //                    $scope.setPagingData(record.responseData.nhpageinfoData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        //                    toaster.pop(APP_MESSAGE.SUCCESS, APP_MESSAGE.MESSAGE, record.message);
                        //                }, function(message) {
                        //                    toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);
                        //
                        //                });
                        //            }
                        //        };
                    },
        ]);

        var counter = 0;
        app.controller("CanvasCtrl", [
            "$scope",
            "$controller",
            "$window",
            "toaster",
            "$filter",
            "$state",
            "$http",
            "$cookieStore",
            "httpCall",
            "APP_ACTION",
            "APP_MESSAGE",
            "FILEURL",
            "ngDialog",
            function (
                    $scope,
                    $controller,
                    $window,
                    toaster,
                    $filter,
                    $state,
                    $http,
                    $cookieStore,
                    httpCall,
                    APP_ACTION,
                    APP_MESSAGE,
                    FILEURL,
                    ngDialog
                    ) {
                $scope.person = {};
                var canvas = document.getElementById("canvas");
                var context = canvas.getContext("2d");
                $scope.data = "";
                $scope.bg_file = "";
                $scope.dateInfo = "";
                $scope.page_info_code = "";
                $scope.metadata = {
                    patient_fname: "",
                    patient_lname: "",
                    patient_room: "",
                };
                $scope.keyBoardData = [];
                var pageCanvasQueryData = $cookieStore.get("pageCanvasQueryData");
                console.log(pageCanvasQueryData);
                $scope.page_info_code = pageCanvasQueryData.page_info_code;
                $scope.nh_paper_data_id = pageCanvasQueryData.nh_paper_data_id;
                $scope.is_reprint = pageCanvasQueryData.is_reprint;
                $scope.paper_type_version_code =
                        pageCanvasQueryData.paper_type_version_code;
                $scope.nh_paper_printque_id = pageCanvasQueryData.nh_paper_printque_id;
                $scope.pageInfoData = null;

                //        function todo(ctx, text, fontSize, fontColor) {
                //            var max_width = 250;
                //            var fontSize = 12;
                //            var lines = new Array();
                //            var width = 0, i, j;
                //            var result;
                //            var color = fontColor || "white";
                //            ctx.font = fontSize + "px Arial";
                //            // Start calculation
                //            while (text.length) {
                //                for (i = text.length; ctx.measureText(text.substr(0, i)).width > max_width; i--)
                //                    ;
                //
                //                result = text.substr(0, i);
                //
                //                if (i !== text.length)
                //                    for (j = 0; result.indexOf(" ", j) !== - 1; j = result.indexOf(" ", j) + 1)
                //                        ;
                //
                //                lines.push(result.substr(0, j || result.length));
                //                width = Math.max(width, ctx.measureText(lines[ lines.length - 1 ]).width);
                //                text = text.substr(lines[ lines.length - 1 ].length, text.length);
                //            }
                //            // Calculate canvas size, add margin
                //            for (i = 0, j = lines.length; i < j; ++i) {
                //                ctx.fillText(lines[i], 100, 5 + fontSize + (fontSize + 5) * i);
                //            }
                //        }

                $scope.getPagedDataAsync = function () {
                    var requestJSON =
                            '{"timelinemode":"1","start_date":"' +
                            pageCanvasQueryData.start_date +
                            '","end_date":"' +
                            pageCanvasQueryData.end_date +
                            '","page_info_code":"' +
                            $scope.page_info_code +
                            '","nh_paper_data_id":"' +
                            $scope.nh_paper_data_id +
                            '","time_zone":"' +
                            $filter("date")(new Date(), "Z") +
                            '","role_type":"' +
                            $cookieStore.get("userData").role_type +
                            '","paper_type_version_code":"' +
                            $scope.paper_type_version_code +
                            '","user_code":"' +
                            $cookieStore.get("userData").user_code +
                            '","nh_paper_printque_id":"' +
                            $scope.nh_paper_printque_id +
                            '"}';
                    console.log(requestJSON);
                    httpCall.remoteCall(
                            $scope,
                            $http,
                            APP_ACTION.GET_ALL_NH_PAPER_DATA_VIEWER,
                            requestJSON,
                            function (record) {
                                console.log(record);
                                $scope.bg_file =
                                        FILEURL + record.responseData.pageInfoData[0].bg_file;
                                $scope.page_upload_location =
                                        record.responseData.pageInfoData[0].page_upload_location;
                                $scope.pageInfoData = record.responseData.pageInfoData[0];
                                $scope.paperAreaData = record.responseData.paperAreaData;
                                $scope.metadata = record.responseData.nhPaperData[0].metadata;
                                $scope.keyBoardData = record.responseData.keyboardData;
                                if ($scope.metadata != "") {
                                    $scope.metadata = JSON.parse($scope.metadata);
                                }
                                if (record.responseData.nhPaperData.length > 0) {
                                    var valueData = record.responseData.nhPaperData[0].file_data;
                                    if (valueData.length && valueData[0] == ",") {
                                        valueData = valueData.substring(1);
                                    }
                                    $scope.dateInfo = record.responseData.nhPaperData[0];

                                    if (valueData) {
                                        /*
                                         *                         $scope.page_upload_location=0 for smartpaper
                                         *                         $scope.page_upload_location=1 for Neo
                                         *                         $scope.page_upload_location=2 for eRx
                                         */
                                        //                        if ($scope.page_upload_location == 0) {
                                        var valueData1 = valueData.replace(/,/g, '},{"amount":5,"x":');
                                        var valueData2 = valueData1.replace(/ /g, ',"y":');
                                        var valueData3 = valueData2.replace(/^/g, '[{"amount":5,"x":');
                                        var valueData4 = valueData3.replace(/$/g, "}]");
                                        //                        }
                                        //                        else {
                                        //                            //var f = '[[{ "x":285.38177, "y":285.38177, "z":true }, { "x":373.93448, "y":373.93448, "z":false }, { "x":412.57318, "y":412.57318, "z":false }, { "x":429.72192, "y":429.72192, "z":false }, { "x":462.98572, "y":462.98572, "z":false }, { "x":462.98572, "y":462.98572, "z":false }], [{ "x":618.96924, "y":618.96924, "z":true }, { "x":588.60236, "y":588.60236, "z":false }, { "x":520.2479, "y":520.2479, "z":false }, { "x":518.1793, "y":518.1793, "z":false }, { "x":501.05002, "y":501.05002, "z":false }, { "x":496.5589, "y":496.5589, "z":false }, { "x":472.91653, "y":472.91653, "z":false }, { "x":435.02863, "y":435.02863, "z":false }, { "x":427.85696, "y":427.85696, "z":false }, { "x":423.36584, "y":423.36584, "z":false }, { "x":423.36584, "y":423.36584, "z":false }]]';
                                        //                            var valueData1 = valueData.replace(/[\[\]']+/g, '');
                                        //                            var valueData3 = valueData1.replace(/^/g, '[');
                                        //                            var valueData4 = valueData3.replace(/$/g, ']');
                                        ////                    var f1 = f.substr(1, f.length - 2);
                                        ////                    var valueData4 = f1.trim();
                                        //                        }
                                        //                         console.log(valueData4);
                                        $scope.data = JSON.parse(valueData4);
                                        console.log("data", $scope.data);
                                    }
                                }

                                var background = new Image();
                                background.src = $scope.bg_file;
                                // Make sure the image is loaded first otherwise nothing will draw.
                                //                $scope.loading = 'Loading...';
                                background.onload = function () {
                                    context.drawImage(background, 0, 0);
                                    draw($scope.data);
                                    $scope.writeOrderData();
                                    context.font = "18px Verdana";
                                    if ($scope.paperAreaData.length > 0) {
                                        console.log(
                                                "==$scope.metadata==",
                                                $scope.metadata,
                                                $scope.paperAreaData
                                                );
                                        for (var i = 0; i < $scope.paperAreaData.length; i++) {
                                            if ($scope.paperAreaData[i].font_size) {
                                                context.font =
                                                        $scope.paperAreaData[i].font_size +
                                                        "px " +
                                                        $scope.paperAreaData[i].font_name;
                                            }
                                            if (
                                                    $scope.paperAreaData[i].paper_field_name === "facility_name"
                                                    ) {
                                                context.fillText(
                                                        $scope.dateInfo.facility_name,
                                                        $scope.paperAreaData[i].paper_field_left,
                                                        $scope.paperAreaData[i].paper_field_top
                                                        );
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "unit_name"
                                                    ) {
                                                if ($scope.metadata != "null" || $scope.metadata != "") {
                                                    context.fillText(
                                                            $scope.metadata.unit_name,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                } else {
                                                    context.fillText(
                                                            $scope.dateInfo.unit_name,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "patient_name"
                                                    ) {
                                                let patient_name = "";
                                                if ($scope.metadata.patient_fname) {
                                                    patient_name += $scope.metadata.patient_fname + " ";
                                                }
                                                if ($scope.metadata.patient_lname) {
                                                    patient_name += $scope.metadata.patient_lname;
                                                }
                                                if ($scope.metadata.patient_name && (!$scope.metadata.patient_fname || $scope.metadata.patient_fname == "") && (!$scope.metadata.patient_lname || $scope.metadata.patient_lname == "")) {
                                                    patient_name += $scope.metadata.patient_name;
                                                }
                                                context.fillText(
                                                        patient_name,
                                                        $scope.paperAreaData[i].paper_field_left,
                                                        $scope.paperAreaData[i].paper_field_top
                                                        );
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "room_no"
                                                    ) {
                                                context.fillText(
                                                        $scope.metadata.room_no,
                                                        $scope.paperAreaData[i].paper_field_left,
                                                        $scope.paperAreaData[i].paper_field_top
                                                        );
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "patient_odb"
                                                    ) {
                                                context.fillText(
                                                        $scope.metadata.patient_odb,
                                                        $scope.paperAreaData[i].paper_field_left,
                                                        $scope.paperAreaData[i].paper_field_top
                                                        );
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "patient_birth_dt"
                                                    ) {
                                                context.fillText(
                                                        $scope.metadata.patient_birth_dt,
                                                        $scope.paperAreaData[i].paper_field_left,
                                                        $scope.paperAreaData[i].paper_field_top
                                                        );
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "patient_allergy"
                                                    ) {
                                                if ($scope.metadata.patient_allergy) {
                                                    context.fillText(
                                                            $scope.metadata.patient_allergy,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "patient_allergy1"
                                                    ) {
                                                if ($scope.metadata.patient_allergy1) {
                                                    context.fillText(
                                                            $scope.metadata.patient_allergy1,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "patient_allergy2"
                                                    ) {
                                                if ($scope.metadata.patient_allergy2) {
                                                    context.fillText(
                                                            $scope.metadata.patient_allergy2,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "order_id"
                                                    ) {
                                                if ($scope.metadata.order_id) {
                                                    context.fillText(
                                                            $scope.metadata.order_id,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "order_dt"
                                                    ) {
                                                if ($scope.metadata.order_dt) {
                                                    context.fillText(
                                                            $scope.metadata.order_dt,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "additional_allergy"
                                                    ) {
                                                if ($scope.metadata.additional_allergy) {
                                                    context.fillText(
                                                            $scope.metadata.additional_allergy,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "additional_allergy1"
                                                    ) {
                                                if ($scope.metadata.additional_allergy1) {
                                                    context.fillText(
                                                            $scope.metadata.additional_allergy1,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "additional_allergy2"
                                                    ) {
                                                if ($scope.metadata.additional_allergy2) {
                                                    context.fillText(
                                                            $scope.metadata.additional_allergy2,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name ===
                                                    "additional_allergy3"
                                                    ) {
                                                if ($scope.metadata.additional_allergy3) {
                                                    context.fillText(
                                                            $scope.metadata.additional_allergy3,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "print_comment"
                                                    ) {
                                                if ($scope.metadata.print_comment) {
                                                    context.fillText(
                                                            $scope.metadata.print_comment,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "crcl"
                                                    ) {
                                                if ($scope.metadata.crcl) {
                                                    context.fillText(
                                                            $scope.metadata.crcl,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "pat_chart_date"
                                                    ) {
                                                if ($scope.metadata.pat_chart_date) {
                                                    context.fillText(
                                                            $scope.metadata.pat_chart_date,
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "male"
                                                    ) {
                                                if ($scope.metadata.gender == "Male") {
                                                    let x = $scope.paperAreaData[i].paper_field_left;
                                                    let y = $scope.paperAreaData[i].paper_field_top;
                                                    let img = new Image();
                                                    img.src = "img/right.png";
                                                    img.onload = function () {
                                                        context.drawImage(img, x, y);
                                                    };
                                                }
                                                continue;
                                            } else if (
                                                    $scope.paperAreaData[i].paper_field_name === "female"
                                                    ) {
                                                if ($scope.metadata.gender == "Female") {
                                                    let x = $scope.paperAreaData[i].paper_field_left;
                                                    let y = $scope.paperAreaData[i].paper_field_top;
                                                    let img = new Image();
                                                    img.src = "img/right.png";
                                                    img.onload = function () {
                                                        context.drawImage(img, x, y);
                                                    };
                                                }
                                                continue;
                                            } else {
                                                if (
                                                        $scope.metadata[$scope.paperAreaData[i].paper_field_name]
                                                        ) {
                                                    context.fillText(
                                                            $scope.metadata[$scope.paperAreaData[i].paper_field_name],
                                                            $scope.paperAreaData[i].paper_field_left,
                                                            $scope.paperAreaData[i].paper_field_top
                                                            );
                                                }
                                            }
                                            //                        else if ($scope.paperAreaData[i].paper_field_name === 'page_cnt') {
                                            //                            context.fillText($scope.dateInfo.page_cnt, $scope.paperAreaData[i].paper_field_left, $scope.paperAreaData[i].paper_field_top);
                                            //                            continue;
                                            //                        }
                                        }
                                    }
                                };
                                //                background.onerror = function() {
                                //                    draw($scope.data);
                                //                    $scope.loading = '';
                                //                };
                            },
                            function (message) {
                                $scope.authError = message;
                            }
                    );
                };
                $scope.getPagedDataAsync();
                $scope.printCanvas = function () {
                    var dataUrl = document.getElementById("canvas").toDataURL("image/png");
                    var printWin = window.open();
                    var is_chrome = Boolean(printWin.chrome);
                    printWin.document.open();
                    printWin.document.write('<img src="' + dataUrl + '">');
                    if (is_chrome) {
                        setTimeout(function () {
                            printWin.document.close();
                            printWin.focus();
                            printWin.print();
                            printWin.close();
                        }, 1000);
                    } else {
                        printWin.document.close();
                        printWin.focus();
                        printWin.print();
                        printWin.close();
                    }
                };

                $scope.printMail = function () {
                    var requestJSON;
                    httpCall.remoteCall(
                            $scope,
                            $http,
                            APP_ACTION.GET_STORE,
                            requestJSON,
                            function (record) {
                                $scope.people = record.responseData.storesData;
                                ngDialog.open({
                                    template: "storeEFax",
                                    controller: "StoreEFaxCtrl",
                                    scope: $scope,
                                    closeByDocument: false,
                                    closeByEscape: false,
                                    showClose: true,
                                });
                            },
                            function (message) {
                                toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);
                            }
                    );
                };
                $scope.addData = function () {
                    var id = 0;
                    if ($scope.data.length > 0) {
                        id = $scope.data[$scope.data.length - 1].id + 1;
                    }
                    var p = {id: id, x: $scope.x, y: $scope.y, amount: $scope.amount};
                    $scope.data.push(p);
                    $scope.x = "";
                    $scope.y = "";
                    $scope.amount = "";
                    draw($scope.data);
                };

                $scope.removePoint = function (point) {
                    //            console.log(point);
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ($scope.data[i].id === point.id) {
                            //                    console.log("removing item at position: " + i);
                            $scope.data.splice(i, 1);
                        }
                    }
                    context.clearRect(0, 0, 600, 400);
                    draw($scope.data);
                };

                function draw(data) {
                    for (var i = 0; i < data.length; i = i + 2) {
                        drawDot(data[i]);
                        if (i > 0) {
                            drawLine(data[i], data[i + 1]); //data[i - 1]
                        }
                    }
                }

                function drawDot(data) {
                    context.beginPath();
                    context.arc(data.x, data.y, 1, 0, 0 * Math.PI, false);
                    context.fillStyle = "#0000FF";
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = "#0000FF";
                    context.stroke();
                }

                function drawLine(data1, data2) {
                    context.beginPath();
                    difX = data1.x - data2.x;
                    difY = data1.y - data2.y;
                    if (
                            $scope.page_upload_location == 0 ||
                            $scope.page_upload_location == 2 ||
                            $scope.page_upload_location == 3 ||
                            $scope.page_upload_location == 5
                            ) {
                        context.moveTo(data1.x, data1.y);
                        context.lineTo(data2.x, data2.y);
                    } else if ($scope.page_upload_location == 1) {
                        if (data1.z) {
                            context.moveTo(data1.x, data1.y);
                        } else {
                            context.moveTo(data1.x, data1.y);
                            context.lineTo(data2.x, data2.y);
                        }
                    }
                    context.strokeStyle = "#0000FF";
                    context.stroke();
                }
                canvas.width = 720;
                canvas.height = 931;
                context.globalAlpha = 1.0;
                context.beginPath();

                $scope.reprintData = function () {
                    if ($window.confirm(APP_MESSAGE.PRINT_QUEUE_MESSAGE) === true) {
                        var dt_added = $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
                        var page_info_code = $scope.page_info_code;
                        var nh_paper_data_id = $scope.nh_paper_data_id;
                        var time_zone = "";
                        var requestJSON =
                                '{"page_info_code":"' +
                                page_info_code +
                                '","dt_added":"' +
                                dt_added +
                                '","nh_paper_data_id":"' +
                                nh_paper_data_id +
                                '","time_zone":"' +
                                time_zone +
                                '"}';
                        httpCall.remoteCall(
                                $scope,
                                $http,
                                APP_ACTION.ADD_PRINT_QUEUE,
                                requestJSON,
                                function (record) {
                                    toaster.pop(
                                            APP_MESSAGE.SUCCESS,
                                            APP_MESSAGE.MESSAGE,
                                            record.message
                                            );
                                },
                                function (message) {
                                    toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);
                                }
                        );
                    }
                };
                $scope.backViewer = function () {
                    $scope.app.canvas = 0;

                    $scope.pagingOptions = {
                        pageSizes: [20, 50, 100, 200, 500, 1000],
                        pageSize: 20,
                        currentPage: 1,
                        totalServerItems: 0,
                    };
                    $scope.getPagedDataAsync(
                            $scope.pagingOptions.pageSize,
                            $scope.pagingOptions.currentPage
                            );
                };
                $scope.next = function () {
                    $scope.myData = JSON.parse($scope.app.abc);
                    if ($scope.app.selectedIndex > 0) {
                        $scope.app.selectedIndex = $scope.app.selectedIndex - 1;
                        $scope.page_info_code =
                                $scope.myData[$scope.app.selectedIndex].page_info_code;
                        $scope.nh_paper_data_id =
                                $scope.myData[$scope.app.selectedIndex].nh_paper_data_id;
                        $scope.paper_type_version_code =
                                $scope.myData[$scope.app.selectedIndex].paper_type_version_code;
                        $scope.nh_paper_printque_id =
                                $scope.myData[$scope.app.selectedIndex].nh_paper_printque_id;
                        $scope.getPagedDataAsync();
                        document.getElementById("canvaNext").style.disabled = false;
                        document.getElementById("canvaNext").style.color = "#1797be";
                        document.getElementById("canvaPrevious").style.disabled = false;
                        document.getElementById("canvaPrevious").style.color = "#1797be";
                        //                if ($scope.app.selectedIndex === 0) {
                        //                    document.getElementById('canvaPrevious').style.disabled = false;
                        //                    document.getElementById('canvaPrevious').style.color = "#1797be";
                        //                    document.getElementById('canvaNext').style.disabled = true;
                        //                    document.getElementById('canvaNext').style.color = "lightgray";
                        //                }
                    } else {
                        document.getElementById("canvaPrevious").style.disabled = false;
                        document.getElementById("canvaPrevious").style.color = "#1797be";
                        document.getElementById("canvaNext").style.disabled = true;
                        document.getElementById("canvaNext").style.color = "lightgray";
                    }
                };

                $scope.previous = function () {
                    $scope.myData = JSON.parse($scope.app.abc);
                    //            console.log($scope.app.selectedIndex);
                    if ($scope.myData.length === $scope.app.selectedIndex + 1) {
                        document.getElementById("canvaPrevious").style.disabled = true;
                        document.getElementById("canvaPrevious").style.color = "lightgray";
                        document.getElementById("canvaNext").style.disabled = false;
                        document.getElementById("canvaNext").style.color = "#1797be";
                    } else {
                        $scope.app.selectedIndex = $scope.app.selectedIndex + 1;
                        $scope.page_info_code =
                                $scope.myData[$scope.app.selectedIndex].page_info_code;
                        $scope.nh_paper_data_id =
                                $scope.myData[$scope.app.selectedIndex].nh_paper_data_id;
                        $scope.paper_type_version_code =
                                $scope.myData[$scope.app.selectedIndex].paper_type_version_code;
                        $scope.nh_paper_printque_id =
                                $scope.myData[$scope.app.selectedIndex].nh_paper_printque_id;
                        $scope.getPagedDataAsync();
                        document.getElementById("canvaPrevious").style.disabled = false;
                        document.getElementById("canvaPrevious").style.color = "#1797be";
                        document.getElementById("canvaNext").style.disabled = false;
                        document.getElementById("canvaNext").style.color = "#1797be";
                        //                if ($scope.myData.length === $scope.app.selectedIndex + 1) {
                        //                    document.getElementById('canvaNext').style.disabled = true;
                        //                    document.getElementById('canvaNext').style.color = "lightgray";
                        //                    document.getElementById('canvaPrevious').style.disabled = false;
                        //                    document.getElementById('canvaPrevious').style.color = "#1797be";
                        //                }
                    }
                };
                $scope.writeOrderData = function () {
                    context.font = "12px Verdana";
                    $scope.keyBoardData.forEach((row) => {
                        let keyboard_meta = JSON.parse(row.keyboard_meta);
                        if ($scope.pageInfoData && $scope.pageInfoData.is_page_type == 1) {
                            $scope.writeNewAdmissionForm(keyboard_meta);
                        } else {
                            console.log(keyboard_meta);
                            keyboard_meta.forEach((meta, index) => {
                                console.log("meta is type", keyboard_meta);
                                console.log("meta is type", meta.is_type, meta);
                                if (meta.is_type == 1 || meta.is_type == 2 || meta.is_type == -1) {
                                    let topPlus = 0;
                                    if (meta.value && meta.value.length > 0) {
                                        meta.value.forEach((val) => {
                                            if (val.key == "new_line") {
                                                topPlus = topPlus + 20;
                                            } else if (val.value) {
                                                let array = $scope.wrapText(
                                                        val.label + " : " + val.value,
                                                        parseFloat(meta.width)
                                                        );
                                                $scope.wrapeAndWriteText(meta.x, meta.y, array, topPlus);
                                                topPlus = topPlus + array.length * 20;
                                            }
                                        });
                                    }
                                    if (meta.is_type == 2 || meta.is_type == -1) {
                                        meta.ba_meta.forEach((data) => {
                                            if (data.is_type == 2) {
                                                if (data.value)
                                                    $scope.drawViewLine(data);
                                            }
                                        });
                                    }
                                } else {
                                    let topPlus = 0;
                                    console.log(meta);
                                    meta.value.forEach((val) => {
                                        if (val.key == "new_line") {
                                            topPlus = topPlus + 20;
                                        } else if (val.value) {
                                            let array = $scope.wrapText(
                                                    val.label + " : " + val.value,
                                                    parseFloat(meta.width)
                                                    );
                                            $scope.wrapeAndWriteText(meta.x, meta.y, array, topPlus);
                                            topPlus = topPlus + array.length * 20;
                                        }
                                    });
                                    if (meta && meta.ba_meta && meta.ba_meta.length > 0) {
                                        meta.ba_meta.forEach((data) => {
                                            if (data.is_type == 1) {
                                                let img = new Image();
                                                img.src = "img/right.png";
                                                img.onload = function () {
                                                    context.drawImage(img, data.x, data.y);
                                                };
                                            } else {
                                                if (data.value)
                                                    $scope.drawViewLine(data);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        // else {
                        //   $scope.writeNewAdmissionForm(keyboard_meta);
                        // }
                    });
                };
                $scope.writeNewAdmissionForm = function (keyboard_meta) {
                    keyboard_meta.forEach((meta, index) => {
                        if (meta.is_type == 0 || meta.is_type == 3) {
                            if (meta.is_wrap == 1) {
                                let array = $scope.wrapText(meta.value, meta.width);
                                $scope.wrapeAndWriteText(meta.x, meta.y, array, 0, 20);
                            } else {
                                context.fillText(
                                        meta.value,
                                        parseFloat(meta.x),
                                        parseFloat(meta.y)
                                        );
                            }
                            if (meta.content_data && meta.content_data.length > 0) {
                                meta.content_data.forEach((mediation) => {
                                    if (mediation.value) {
                                        if (mediation.is_type == 0) {
                                            // if (mediation.key == "hoa") {
                                            //   let arrayTop = 0;
                                            //   mediation.value.forEach((arrayData) => {
                                            //     context.fillText(
                                            //       arrayData,
                                            //       parseFloat(mediation.x),
                                            //       parseFloat(mediation.y) + arrayTop
                                            //     );
                                            //     arrayTop = arrayTop + 14;
                                            //   });
                                            // } else {
                                            if (mediation.is_wrap == 1) {
                                                let array = $scope.wrapText(
                                                        mediation.value,
                                                        mediation.width
                                                        );
                                                $scope.wrapeAndWriteText(
                                                        mediation.x,
                                                        mediation.y,
                                                        array,
                                                        0,
                                                        20
                                                        );
                                            } else {
                                                context.fillText(
                                                        mediation.value,
                                                        parseFloat(mediation.x),
                                                        parseFloat(mediation.y)
                                                        );
                                            }
                                            // }
                                        } else if (mediation.is_type == 4) {
                                            let arrayTop = 0;
                                            mediation.value.forEach((arrayData) => {
                                                context.fillText(
                                                        arrayData,
                                                        parseFloat(mediation.x),
                                                        parseFloat(mediation.y) + arrayTop
                                                        );
                                                arrayTop = arrayTop + 14;
                                            });
                                        } else {
                                            let img = new Image();
                                            img.src = "img/right.png";
                                            img.onload = function () {
                                                context.drawImage(img, mediation.x, mediation.y);
                                            };
                                        }
                                    }
                                });
                            }
                        } else if (meta.is_type == 1) {
                            let img = new Image();
                            img.src = "img/right.png";
                            img.onload = function () {
                                context.drawImage(img, meta.x, meta.y);
                            };
                        } else if (meta.is_type == 2) {
                            if (meta.value)
                                $scope.drawViewLine(meta);
                        }
                    });
                };
                $scope.drawViewLine = function (data) {
                    console.log("split", data.value);
                    data = data.value.split(",");
                    for (var i = 0; i < data.length; i = i + 2) {
                        context.beginPath();
                        let data1 = data[i].split(" ");
                        let data2 = data[i + 1].split(" ");

                        let x = parseFloat(data1[0]);
                        let y = parseFloat(data1[1]);
                        let x1 = parseFloat(data2[0]);
                        let y1 = parseFloat(data2[1]);
                        if (data[i - 1] && data[i - 1] == data[i]) {
                            context.moveTo(x, y);
                            context.lineTo(x1, y1);
                        } else {
                            context.moveTo(x, y);
                        }
                        context.strokeStyle = "#0000FF";
                        context.stroke();
                    }
                };
                $scope.wrapeAndWriteText = function (left, top, array, space, breakTop) {
                    if (!breakTop) {
                        breakTop = 20;
                    }
                    let topPlus = space;
                    for (let i = 0; i < array.length; i++) {
                        context.fillText(array[i], parseFloat(left), parseFloat(top) + topPlus);
                        topPlus = topPlus + breakTop;
                    }
                };
                $scope.wrapText = function (text, maxWidth) {
                    maxWidth = maxWidth - 55;
                    const words = text.split(" ");
                    var el = document.createElement("div");
                    document.body.appendChild(el);
                    el.style.position = "absolute";
                    let rows = [];
                    let row = [];
                    let usedIndex = 0;
                    for (let i = 0; i < words.length; i++) {
                        const word = words[i];
                        el.innerHTML += word;
                        if (el.clientWidth > maxWidth) {
                            rows.push(el.innerHTML);
                            usedIndex = i;
                            el.innerHTML = "";
                        } else {
                            el.innerHTML += " ";
                        }
                    }
                    words.splice(0, usedIndex);
                    rows = rows.concat(words.join(" "));
                    document.body.removeChild(el);
                    return rows;
                };
            },
        ]);

        app.controller("StoreEFaxCtrl", [
            "$scope",
            "toaster",
            "$filter",
            "$http",
            "httpCall",
            "APP_ACTION",
            "APP_MESSAGE",
            "ngDialog",
            function (
                    $scope,
                    toaster,
                    $filter,
                    $http,
                    httpCall,
                    APP_ACTION,
                    APP_MESSAGE,
                    ngDialog
                    ) {
                $scope.efax = {
                    store_email: "",
                };
                $scope.disabled = undefined;
                $scope.searchEnabled = undefined;

                $scope.enable = function () {
                    $scope.disabled = false;
                };

                $scope.disable = function () {
                    $scope.disabled = true;
                };

                $scope.enableSearch = function () {
                    $scope.searchEnabled = true;
                };

                $scope.disableSearch = function () {
                    $scope.searchEnabled = false;
                };

                $scope.clear = function () {
                    $scope.person.selected = undefined;
                    $scope.address.selected = undefined;
                    $scope.country.selected = undefined;
                };

                $scope.counter = 0;
                $scope.someFunction = function (item, model) {
                    $scope.counter++;
                    $scope.eventResult = {item: item, model: model};
                };

                $scope.removed = function (item, model) {
                    $scope.lastRemoved = {
                        item: item,
                        model: model,
                    };
                };
                $scope.submitEfax = function () {
                    console.log($scope);
                    groupByEmail($scope.efax.store_email, function (data) {
                        var dt_added = $filter("date")(new Date(), "yyyy-MM-dd HH:mm");
                        var dataUrl = document.getElementById("canvas").toDataURL("image/png");
                        $scope.efax.fax_number = "";
                        var requestJSON =
                                '{"emailPrint":"' +
                                dataUrl +
                                '","fax_number":"' +
                                $scope.efax.fax_number +
                                '","dt_added":"' +
                                dt_added +
                                '","store_email":"' +
                                data +
                                '"}';
                        httpCall.remoteCall(
                                $scope,
                                $http,
                                APP_ACTION.SEND_PRINT_MAIL,
                                requestJSON,
                                function (record) {
                                    ngDialog.closeAll();
                                    toaster.pop(
                                            APP_MESSAGE.SUCCESS,
                                            APP_MESSAGE.MESSAGE,
                                            record.message
                                            );
                                },
                                function (message) {
                                    toaster.pop(APP_MESSAGE.ERROR, APP_MESSAGE.ERROR_MESSAGE, message);
                                }
                        );
                    });
                };

                function groupByEmail(item, callback) {
                    var row = "";
                    for (var i = 0; i < item.length; i++) {
                        row += item[i].store_email + ",";
                        if (i === item.length - 1) {
                            callback(row);
                        }
                    }
                }
            },
        ]);
