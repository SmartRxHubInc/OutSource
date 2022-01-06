
app.controller('ToDoListCtrl', ['$scope','$modal','ToDoSteps', '$http', '$cookieStore', 'httpCall', 'APP_ACTION',
    function ($scope,$modal,ToDoSteps, $http,$cookieStore, httpCall, APP_ACTION) {
        debugger
        const facility_code = $cookieStore.get('userData').facility_code
        $scope.facility_code=facility_code === undefined?"":facility_code//$cookieStore.get('facility_code');
        $scope.user_code=$cookieStore.get('userData').user_code;
        $scope.epaper_menu_code = ToDoSteps.step1
        $scope.open = function(title,isOtherSignature){
            debugger
            $modal.open({
                    templateUrl: 'tpl/to_do_list/signature-modal.html',
                    keyboard:false,
                    windowTopClass: "center-modal",
                    controller: function($scope, $modalInstance) {
                        $scope.title=title
                        $scope.isOtherSignature=isOtherSignature
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                         };
                         $scope.ok = function () {
                            $modalInstance.close();
                         };
                     }
                    
            });
        }
        $scope.count=0;
        $scope.pageNo=1;
        $scope.limit=20;
        $scope.activePanel = ToDoSteps.step1
        $scope.convertStringToDate=function(currentDate){
            const date = moment(new Date(currentDate)).format('DD/MM/YYYY')
            const time = moment(new Date(currentDate)).format('HH:mm')
            return date +" ,"+time
        }
        $scope.steps = [
            {id:"1",menu_name: ToDoSteps.step1,menu_counter:"0",epaper_menu_code:""},
            {id:"2",menu_name: ToDoSteps.step2,menu_counter:"0",epaper_menu_code:""},
            {id:"3",menu_name: ToDoSteps.step3,menu_counter:"0",epaper_menu_code:""},
            {id:"4",menu_name: ToDoSteps.step4,menu_counter:"0",epaper_menu_code:""},
            {id:"5",menu_name: ToDoSteps.step5,menu_counter:"0",epaper_menu_code:""},
            {id:"6",menu_name: ToDoSteps.step6,menu_counter:"0",epaper_menu_code:""},
            {id:"7",menu_name: ToDoSteps.step7,menu_counter:"0",epaper_menu_code:""}
        ];
        $scope.signatureList=[
            {id:1,name:"Prescriber's Sign",isCompleted:true},
            {id:2,name:"Nurse 1 Sign",isCompleted:false},
            {id:3,name:"Nurse 2 Sign",isCompleted:false}
        ]
        $scope.otherSignatureList=[
            {id:1,name:"Care Plan",isCompleted:true,isNotApplicable:false},
            {id:2,name:"Consent",isCompleted:false,isNotApplicable:false},
            {id:3,name:"MAR/TAR",isCompleted:true,isNotApplicable:false},
            {id:4,name:"Lab",isCompleted:false,isNotApplicable:true}
        ]
        $scope.data =[];
        $scope.isList = true;
        $scope.getPagedDataAsync = function(step) {
            
            var requestJSON = '{"facility_code":"'+$scope.facility_code+'","user_code":"'+$scope.user_code+'","epaper_menu_code":"'+step+'","page":"'+$scope.pageNo+'","limit":"'+$scope.limit+'","search_text":""}';
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_TODO_LIST, requestJSON, function(record) {
                console.log(record.responseData);
                record.responseData.menuCouterData.map((x)=>{
                    const index = $scope.steps.findIndex(a=>a.menu_name === x.menu_name);
                    $scope.steps[index].menu_code = x.epaper_menu_code
                    $scope.steps[index].id = x.id
                    $scope.steps[index].menu_counter = parseInt(x.menu_counter) <=9?"0"+x.menu_counter:x.menu_counter
                })
                $scope.data = record.responseData.todoData
                const index = $scope.steps.findIndex(a=>a.menu_code === step);
                $scope.activePanel = $scope.steps[index].menu_name
            }, function(message) {
            });
        };
        $scope.getOrderDetail=function(page_info_code,print_queue_id){
            debugger
            const index = $scope.steps.findIndex(a=>a.menu_name === $scope.activePanel);
            const epaper_menu_code=$scope.steps[index].menu_code
            //var requestJSON = '{"facility_code":"'+$scope.facility_code+'","user_code":"'+$scope.user_code+'","page_info_code":"'+page_info_code+'","print_queue_id":"'+print_queue_id+'","epaper_menu_code":"'+epaper_menu_code+'","start_dt":"","end_dt":"","search_text":""}';
            var requestJSON='{"facility_code":"NH20170220094948344954","page_info_code":"PGI2021120904420494434","print_queue_id":"22810","epaper_menu_code":"NURSE_2","user_code":"PHUCOM20151219120733156780","start_dt":"","end_dt":"","search_text":""}'
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_TODO_ORDER_DETAIL, requestJSON, function(record) {
                debugger
                console.log(record.responseData);
                $scope.isList = false
                // record.responseData.menuCouterData.map((x)=>{
                //     const index = $scope.steps.findIndex(a=>a.menu_name === x.menu_name);
                //     $scope.steps[index].menu_code = x.epaper_menu_code
                //     $scope.steps[index].id = x.id
                //     $scope.steps[index].menu_counter = parseInt(x.menu_counter) <=9?"0"+x.menu_counter:x.menu_counter
                // })
                // $scope.data = record.responseData.todoData
                // const index = $scope.steps.findIndex(a=>a.menu_code === step);
                // $scope.activePanel = $scope.steps[index].menu_name
            }, function(message) {
            });
        }
        $scope.initialization = function () {
            $scope.getPagedDataAsync("DOCTOR_SIG_MISSING")
        }
        $scope.editResident = function (isList) {
            $scope.isList = isList;
        }
        $scope.initialization ()
    }]);