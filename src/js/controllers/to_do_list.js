
app.controller('ToDoListCtrl', ['$scope','$modal','ToDoSteps',
    function ($scope,$modal,ToDoSteps) {
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
        $scope.activePanel = ToDoSteps.step1
        $scope.steps = [
            {name: ToDoSteps.step1,count:"03"},
            {name: ToDoSteps.step2,count:"02"},
            {name: ToDoSteps.step3,count:"03"},
            {name: ToDoSteps.step4,count:"04"},
            {name: ToDoSteps.step5,count:"01"},
            {name: ToDoSteps.step6,count:"06"},
            {name: ToDoSteps.step7,count:"02"}
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
        $scope.getList = function (step) {
            if(step === ToDoSteps.step1)
            {
                //call api for step1
            }
            else if(step === ToDoSteps.step2)
            {
                //call api for step2
            }
            else if(step === ToDoSteps.step3)
            {
                //call api for step3
            }
            else if(step === ToDoSteps.step4)
            {
                //call api for step4
            }
            else if(step === ToDoSteps.step5)
            {
                //call api for step5
            }
            else if(step === ToDoSteps.step6)
            {
                //call api for step6
            }
            else if(step === ToDoSteps.step7)
            {
                //call api for step7
            }
            $scope.getTempData(step)
        }

        $scope.getTempData = function (step) {
            debugger
            $scope.data =[];
            $scope.activePanel = step
            var stepData = $scope.steps.filter(x=>{return x.name === step})[0];
            $scope.count = parseInt(stepData.count)
            for (let index = 0; index < parseInt(stepData.count); index++) {
                const element = {residentName : "Resident Name " + index.toString(),unit:"Ward " + index.toString(),pageNo:"Page No " + index.toString() ,dateTime:"31/12/2021, 04:40"};
                $scope.data.push(element);
            }
        }
        

        $scope.initialization = function () {
            $scope.getTempData(ToDoSteps.step1)
        }
        $scope.editResident = function (isList) {
            $scope.isList = isList;
        }
        $scope.initialization ()
    }]);