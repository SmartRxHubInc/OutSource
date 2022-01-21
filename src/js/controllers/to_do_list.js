
app.controller('ToDoListCtrl', ['$scope','$modal','$timeout','ToDoSteps','SIGNATURE_TYPE','EPAPER_MENU_CODE','EPAPER_MENU_KEY','$filter', '$http', '$cookieStore', 'httpCall', 'APP_ACTION',
    function ($scope,$modal,$timeout,ToDoSteps,SIGNATURE_TYPE,EPAPER_MENU_CODE,EPAPER_MENU_KEY,$filter,$http,$cookieStore, httpCall, APP_ACTION) {
        const facility_code = $cookieStore.get('userData').facility_code
        $scope.facility_code=facility_code === undefined?"":facility_code//$cookieStore.get('facility_code');
        $scope.user_code=$cookieStore.get('userData').user_code;
        $scope.epaper_menu_code = ToDoSteps.step1
        $scope.prev_id = []
        $scope.next_id = []
        $scope.postKeyBoardData=[];
        $scope.postToDoData=[];
        $scope.count=3;
        $scope.pageNo=1;
        $scope.limit=20;
        $scope.activePanel = ToDoSteps.step1
        $scope.steps = [
            {id:"1",menu_name: ToDoSteps.step1,menu_counter:"0",epaper_menu_code:""},
            {id:"2",menu_name: ToDoSteps.step2,menu_counter:"0",epaper_menu_code:""},
            {id:"3",menu_name: ToDoSteps.step3,menu_counter:"0",epaper_menu_code:""},
            {id:"4",menu_name: ToDoSteps.step4,menu_counter:"0",epaper_menu_code:""},
            {id:"5",menu_name: ToDoSteps.step5,menu_counter:"0",epaper_menu_code:""},
            {id:"6",menu_name: ToDoSteps.step6,menu_counter:"0",epaper_menu_code:""},
            {id:"7",menu_name: ToDoSteps.step7,menu_counter:"0",epaper_menu_code:""}
        ];
        $scope.mainSignatureListArray=[]
        $scope.type_two_signature=[
            {id:1,name:"Prescriber's Sign",menu_name: ToDoSteps.step1,isDoctorSign:true,key:EPAPER_MENU_KEY.SIGNATURE,isCompleted:false,count:0,epaper_menu_code:"",paper_area_name:''},
            {id:2,name:"Nurse 1 Sign",menu_name: ToDoSteps.step2,isDoctorSign:false,key:EPAPER_MENU_KEY.NURSE_1,isCompleted:false,count:0,epaper_menu_code:"",paper_area_name:''},
            {id:3,name:"Nurse 2 Sign",menu_name:ToDoSteps.step3,isDoctorSign:false,key:EPAPER_MENU_KEY.NURSE_2,isCompleted:false,count:0,epaper_menu_code:"",paper_area_name:''}
        ]
        $scope.type_one_signature=[
            {id:1,name:"Care Plan",menu_name: ToDoSteps.step4,isDoctorSign:false,key:EPAPER_MENU_KEY.CARE_PLAN,isCompleted:false,isNotApplicable:false,count:0,epaper_menu_code:"",paper_area_name:''},
            {id:2,name:"Consent",menu_name: ToDoSteps.step5,isDoctorSign:false,key:EPAPER_MENU_KEY.CONSENT,isCompleted:false,isNotApplicable:false,count:0,epaper_menu_code:"",paper_area_name:''},
            {id:3,name:"MAR/TAR",menu_name: ToDoSteps.step6,isDoctorSign:false,key:EPAPER_MENU_KEY.MAR_TAR,isCompleted:false,isNotApplicable:false,count:0,epaper_menu_code:"",paper_area_name:''},
            {id:4,name:"Lab",key:EPAPER_MENU_KEY.LAB,menu_name: ToDoSteps.step7,isDoctorSign:false,isCompleted:false,isNotApplicable:false,count:0,epaper_menu_code:"",paper_area_name:''}
        ]
        $scope.$watch('$viewContentLoaded', function(){
            if(window.innerWidth > 1199){
                resizeCanvas();
            }
            
        });
        $scope.data =[];
        $scope.orderDetailData=[]
        $scope.isList = true;
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        canvas.height = 931;
        context.globalAlpha = 1.0;
        context.beginPath();
        function resizeCanvas(){
            var parentWidth = canvas.parentElement.clientWidth;
            canvas.width=parentWidth;
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
        function draw(data) {
            for (var i = 0; i < data.length; i = i + 2) {
                drawDot(data[i]);
                if (i > 0) {
                    drawLine(data[i], data[i + 1]);
                }
            }
        }
        $scope.trackByIndex = (data)=> {
            return data.index;
        };
        $scope.open = function(type,paper_area_name,key,title,isOtherSignature,parentId,index){
            
            const keyBoardData = $scope.keyBoardData;
            let mainSignatureListArray=$scope.mainSignatureListArray;
            $scope.reason=""
            $scope.createPostResultData = false
            const scope = $scope
            $modal.open({
                    templateUrl: 'tpl/to_do_list/signature-modal.html',
                    keyboard:false,
                    size:'md',
                    controller: function($scope, $modalInstance,$timeout) {
                        $scope.title=title
                        $scope.isOtherSignature=isOtherSignature;
                        $scope.placeholder = "Notes about "+ $scope.title+" (if any)"
                        $scope.moveToList = [];
                        $scope.lineToList = [];
                        
                        function roundToPlaces(num, decimalPlaces = 0) {
                            const p = Math.pow(10, decimalPlaces);
                            return Math.round(num * p) / p;
                        }
                        $scope.cancel = function(type) {
                            $scope.is_status = type
                            $modalInstance.dismiss('cancel');
                         };
                         
                         $scope.ok = function (iscomplete,reason) {
                            let sign_meta=[]
                            const currentKeyBoardMeta = keyBoardData.filter(x=>x.print_queue_id === scope.print_queue_id)
                            currentKeyBoardMeta.map((x)=>{
                                JSON.parse(x.sign_meta).map((y)=>{
                                    sign_meta.push(y)
                                })
                            })
                            sign_meta=[...new Set(sign_meta)]
                            const currentSign = sign_meta.findIndex(x=>x.key === paper_area_name)
                            let ba_meta={};
                            let to_do_meta={};
                             if(type == SIGNATURE_TYPE.TYPE_2 && currentSign >= 0){
                                let signatures=[]
                                const values = sign_meta[currentSign].value
                                const dataIndex = values.findIndex(x=>x.key === key.toLowerCase())
                                if(dataIndex >=0){
                                    scope.createPostResultData = true;
                                    const sign_area_width = Number(values[dataIndex].width);
                                    const sign_area_height = Number(values[dataIndex].height);
                                    const sign_area_x = Number(values[dataIndex].x);
                                    const sign_area_y = Number(values[dataIndex].y) + 15;
                                    const signatureCordinates = { "moveToList": $scope.moveToList, "lineToList": $scope.lineToList };
                                    signatures.push(signatureCordinates);
                                    let cordinates=[]
                                    for (var i = 0; i < signatures[0].moveToList.length; i++) {
                                        const lx=roundToPlaces(((signatures[0].moveToList[i].lx * sign_area_width) / context.canvas.width) + sign_area_x,2)
                                        const ly=roundToPlaces(((signatures[0].moveToList[i].ly * sign_area_height) / context.canvas.height) + sign_area_y,2)
                                        const cx=roundToPlaces(((signatures[0].lineToList[i].cx * sign_area_width) / context.canvas.width) + sign_area_x,2)
                                        const cy=roundToPlaces(((signatures[0].lineToList[i].cy * sign_area_height) / context.canvas.height) + sign_area_y,2)
                                        cordinates.push(lx+" "+ly+","+cx+" "+cy)
                                    }
                                    let dataPoints ={};
                                    dataPoints.value = cordinates.join(',');
                                    scope.drawViewLine(dataPoints);
                                    mainSignatureListArray[parentId].type_two_signature[index].isCompleted = true;
                                    ba_meta={
                                        x:sign_area_x,
                                        y:sign_area_y,
                                        is_type:type.toString(),
                                        label:title,
                                        key:key,
                                        value:dataPoints.value
                                    };
                                    to_do_meta={
                                        is_status:!isOtherSignature?"1":iscomplete,
                                        reason:reason,
                                        key:key 
                                    };
                                }
                             }
                             else if(type == SIGNATURE_TYPE.TYPE_1 && currentSign >= 0){
                                scope.createPostResultData = true;
                                const values = sign_meta[currentSign].value
                                const dataIndex = values.findIndex(x=>x.key === key.toLowerCase())
                                let img = new Image();
                                img.src = "img/right.png";
                                ba_meta={
                                    x:values[dataIndex].x,
                                    y:values[dataIndex].y,
                                    is_type:type.toString(),
                                    label:title,
                                    key:key,
                                    value:iscomplete == 2?0:"1"
                                }
                                to_do_meta={
                                    is_status:!isOtherSignature?"1":iscomplete.toString(),
                                    reason:reason,
                                    key:key 
                                }
                                img.onload = function () {
                                    
                                    if(!isOtherSignature){
                                        context.drawImage(img, values[dataIndex].x, values[dataIndex].y);
                                        mainSignatureListArray[parentId].type_one_signature[index].isCompleted = true;
                                    }
                                    else{
                                        mainSignatureListArray[parentId].type_one_signature[index].isCompleted =  iscomplete == 1?true:false;
                                        mainSignatureListArray[parentId].type_one_signature[index].isNotApplicable = iscomplete == 2?true:false;
                                        if(iscomplete == 1){
                                            context.drawImage(img, values[dataIndex].x, values[dataIndex].y);
                                        }
                                    }
                                };
                             }
                             if(currentSign >= 0 && scope.createPostResultData){
                                const keyBoardMetaIndex = scope.postKeyBoardData.findIndex(x=>x.paper_area_name === paper_area_name)
                                const toDoMetaIndex = scope.postToDoData.findIndex(x=>x.paper_area_name === paper_area_name)
                                if(keyBoardMetaIndex >= 0){
                                    scope.postKeyBoardData[keyBoardMetaIndex].ba_meta.push(ba_meta)
                                 }
                                 else{
                                    const keyboard_meta = JSON.parse(currentKeyBoardMeta[0].keyboard_meta)
                                    var obj={
                                        paper_area_name:paper_area_name,
                                        height:keyboard_meta[parentId]?.height,
                                        width: keyboard_meta[parentId]?.width,
                                        x: keyboard_meta[parentId]?.x,
                                        y: keyboard_meta[parentId]?.y,
                                        is_type: keyboard_meta[parentId]?.is_type,
                                        ba_meta:[ba_meta]
                                    }
                                    scope.postKeyBoardData.push(obj);
                                 }
                                 if(toDoMetaIndex >= 0){
                                    scope.postToDoData[toDoMetaIndex].ba_meta.push(to_do_meta)
                                 }
                                 else{
                                    var obj={
                                        paper_area_name:paper_area_name,
                                        ba_meta:[to_do_meta]
                                    }
                                    scope.postToDoData.push(obj)
                                 }
                             }
                             $modalInstance.close();
                         };
                     }
            });
        }
        $scope.convertStringToDate=function(currentDate){
            const date = $filter("date")(new Date(currentDate), "dd/MM/yyyy")
            const time = $filter("date")(new Date(currentDate), "HH:mm")
            return date +" ,"+time
        }
        $scope.getPagedDataAsync = function(step) {
            var requestJSON = '{"facility_code":"'+$scope.facility_code+'","user_code":"'+$scope.user_code+'","epaper_menu_code":"'+step+'","page":"'+$scope.pageNo+'","limit":"'+$scope.limit+'","search_text":""}';
            httpCall.remoteCall($scope, $http, APP_ACTION.GET_TODO_LIST, requestJSON, function(record) {
                console.log(record.responseData);
                record.responseData.menuCouterData.map((x)=>{
                    const index = $scope.steps.findIndex(a=>a.menu_name === x.menu_name);
                    $scope.steps[index].epaper_menu_code = x.epaper_menu_code
                    $scope.steps[index].id = x.id
                    $scope.steps[index].menu_counter = parseInt(x.menu_counter) <=9?"0"+x.menu_counter:x.menu_counter
                })
                $scope.data = record.responseData.todoData
                const index = $scope.steps.findIndex(a=>a.epaper_menu_code === step);
                $scope.activePanel = $scope.steps[index].menu_name
            }, function() {
            });
        };
        $scope.writeNewAdmissionForm = function (keyboard_meta) {
            keyboard_meta.forEach((meta, index) => {
                if (meta.is_type == SIGNATURE_TYPE.TYPE_0 || meta.is_type == SIGNATURE_TYPE.TYPE_3) {
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
                                if (mediation.is_type == SIGNATURE_TYPE.TYPE_0) {
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
                                } else if (mediation.is_type == SIGNATURE_TYPE.TYPE_4) {
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
                } else if (meta.is_type == SIGNATURE_TYPE.TYPE_1 && meta.value) {
                    let img = new Image();
                    img.src = "img/right.png";
                    img.onload = function () {
                        context.drawImage(img, meta.x, meta.y);
                    };
                    //$scope.setSign(data.is_type,data.key)
                } else if (meta.is_type == SIGNATURE_TYPE.TYPE_2) {
                    //$scope.setSign(data.is_type,data.key)
                    if (meta.value)
                        $scope.drawViewLine(meta);
                }
            });
        };
        $scope.drawViewLine = function (data) {
            data = data.value.split(",");
            for (var i = 0; i < data.length; i = i + 2) {
                if(data[i] && data[i+1]){
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
            }
        };
        $scope.processSignature = function(keyBoardData){
            const count = $scope.count;
            let workFlowData=[];
            keyBoardData.forEach((a)=>{
                if(a.work_flow_data && a.work_flow_data.length > 0){
                    a.work_flow_data.forEach((w)=>{
                        if(workFlowData.length === 0){
                            workFlowData.push(w);
                        }
                        else if(workFlowData.filter(x=>x.todo_id == w.todo_id).length === 0){
                            workFlowData.push(w);
                        }  
                    });
                }
                
            });
            let areaNames=[];
            workFlowData.map((x)=>{
                if(!areaNames.includes(x.paper_area_name))
                areaNames.push(x.paper_area_name)
            })
            areaNames=[...new Set(areaNames)]
            let type_two_signature =[...Array.from($scope.type_two_signature)]
            let type_one_signature = [...Array.from($scope.type_one_signature)]
            let index=0;
            areaNames.map((x)=>{
                let type_two_signature_data = []
                let type_one_signature_data = []
                let signatureData = workFlowData.filter(b=>b.paper_area_name == x)
                if(signatureData.length > 0){
                    const menu_codes = signatureData.map(s=>s.epaper_menu_code);
                    const menu_names = $scope.steps.filter(x=>menu_codes.includes(x.epaper_menu_code)).map(m=>m.menu_name)
                    type_two_signature.map((type_two_data)=>{
                        const currentStatusIndex = signatureData.findIndex(x=>(x.epaper_menu_code.toLowerCase() == type_two_data.key || type_two_data.isDoctorSign === true) && x.is_status == '1')
                        let currentObj={...type_two_data};
                        if(menu_names.includes(currentObj.menu_name) && currentStatusIndex >=0){
                            currentObj.isCompleted = true;
                        }
                        currentObj.paper_area_name = x;
                        currentObj.isDisabled = false;
                        currentObj.type = SIGNATURE_TYPE.TYPE_2
                        type_two_signature_data.push(currentObj);
                    });
                    type_one_signature.map((type_one_data)=>{
                        let currentObj={...type_one_data};
                        let isNotApplicable = false;
                        const currentStatusIndex = signatureData.findIndex(x=>x.epaper_menu_code.toLowerCase() == type_one_data.key )
                        if(menu_names.includes(currentObj.menu_name) && currentStatusIndex >=0){
                            isNotApplicable = signatureData[currentStatusIndex].is_status == '2'?true:false;
                            currentObj.isCompleted = signatureData[currentStatusIndex].is_status == '1' && !isNotApplicable;
                            currentObj.isNotApplicable = isNotApplicable;
                        }
                        currentObj.paper_area_name = x;
                        currentObj.isDisabled = false;
                        currentObj.type = SIGNATURE_TYPE.TYPE_1
                        type_one_signature_data.push(currentObj)
                    }); 
                }
                
                $scope.mainSignatureListArray.push({
                    index:index,
                    'type_two_signature':type_two_signature_data,
                    'type_one_signature':type_one_signature_data  
                });
                index++
            })
            const remainingCount = count - areaNames.length
            if(remainingCount > 0){
                type_two_signature.forEach(a=>a.paper_area_name = "");
                type_two_signature.forEach(a=>a.isDisabled = true);
                type_one_signature.forEach(a=>a.paper_area_name = "");
                type_one_signature.forEach(a=>a.isDisabled = true);
                [...Array(remainingCount)].forEach((s)=>{
                    $scope.mainSignatureListArray.push({
                        index:index++,
                        'type_two_signature':type_two_signature,
                        'type_one_signature':type_one_signature 
                    })
                })
                index++;
            }
        }
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
        $scope.writeOrderData = function () {
            context.font = "12px Verdana";
            $scope.keyBoardData.forEach((row) => {
                let keyboard_meta = JSON.parse(row.keyboard_meta);
                if ($scope.pageInfoData && $scope.pageInfoData.is_page_type == 1) {
                    $scope.writeNewAdmissionForm(keyboard_meta);
                } else {
                    keyboard_meta.forEach((meta, index) => {
                        if (meta.is_type == SIGNATURE_TYPE.TYPE_1 || meta.is_type == SIGNATURE_TYPE.TYPE_2 || meta.is_type == SIGNATURE_TYPE.TYPE_MINUS_1) {
                            let topPlus = 0;
                            if (meta.value && meta.value.length > 0) {
                                meta.value?.forEach((val) => {
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
                            if (meta.is_type == SIGNATURE_TYPE.TYPE_2 || meta.is_type == SIGNATURE_TYPE.TYPE_MINUS_1) {
                                meta.ba_meta.forEach((data) => {
                                    if (data.is_type == 2) {
                                        if (data.value)
                                            $scope.drawViewLine(data);
                                    }
                                });
                            }
                        } else {
                            let topPlus = 0;
                            //console.log(meta);
                            meta.value?.forEach((val) => {
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
                                    if (data.is_type == SIGNATURE_TYPE.TYPE_1 && data.value) {
                                        let img = new Image();
                                        img.src = "img/right.png";
                                        img.onload = function () {
                                            context.drawImage(img, data.x, data.y);
                                        };
                                    } else {
                                        if (data.value){
                                            $scope.drawViewLine(data);
                                        }   
                                    }
                                });
                            }
                        }
                    });
                }
            });
            $scope.processSignature($scope.keyBoardData)
        };
        
        $scope.getOrderDetail=function(page_info_code,print_queue_id){
            $scope.bg_file = "";
            $scope.metadata = [];
            $scope.keyBoardData = [];
            $scope.paperAreaData = [];
            $scope.page_upload_location = "";
            $scope.prev_id = [];
            $scope.next_id = [];
            $scope.mainSignatureListArray=[];
            $scope.postKeyBoardData=[];
            $scope.postToDoData=[];
            const metadata = JSON.parse($scope.data.filter(x=>x.page_info_code == page_info_code && x.print_queue_id == print_queue_id)[0].metadata)
            $scope.editToDo(true);
            $scope.page_info_code = page_info_code;
            $scope.print_queue_id = print_queue_id;
            $scope.patient_name = metadata.patient_code
            const index = $scope.steps.findIndex(a=>a.menu_name === $scope.activePanel);
            const epaper_menu_code=$scope.steps[index].epaper_menu_code
            var requestJSON = '{"facility_code":"'+$scope.facility_code+'","user_code":"'+$scope.user_code+'","page_info_code":"'+page_info_code+'","print_queue_id":"'+print_queue_id+'","epaper_menu_code":"'+epaper_menu_code+'","start_dt":"","end_dt":"","search_text":""}';
            context.clearRect(0, 0, canvas.width, canvas.height);

            httpCall.remoteCall($scope, $http, APP_ACTION.GET_TODO_ORDER_DETAIL, requestJSON, function(record) {
                console.log(record.responseData);
                $scope.bg_file = record.responseData.todoData[0].bg_file;
                $scope.metadata = record.responseData.todoData[0].metadata;
                $scope.keyBoardData = record.responseData.keyBoardData;
                $scope.paperAreaData = record.responseData.paperTypeFieldsData;
                $scope.page_upload_location = record.responseData.paperTypeFieldsData[0].page_upload_location;
                $scope.prev_id = record.responseData.prev_id
                $scope.next_id = record.responseData.next_id
                $scope.mainSignatureListArray=[]
                $scope.postKeyBoardData=[]
                $scope.postToDoData=[]
                if ($scope.metadata != "") {
                    $scope.metadata = JSON.parse($scope.metadata);
                }
                if (record.responseData.nhPaperData && record.responseData.nhPaperData.length > 0) {
                    var valueData = record.responseData.nhPaperData[0].file_data;
                    if (valueData.length && valueData[0] == ",") {
                        valueData = valueData.substring(1);
                    }
                    $scope.dateInfo = record.responseData.nhPaperData[0];

                    if (valueData) {
                        var valueData1 = valueData.replace(/,/g, '},{"amount":5,"x":');
                        var valueData2 = valueData1.replace(/ /g, ',"y":');
                        var valueData3 = valueData2.replace(/^/g, '[{"amount":5,"x":');
                        var valueData4 = valueData3.replace(/$/g, "}]");
                        $scope.orderDetailData = JSON.parse(valueData4);
                        console.log("data", $scope.data);
                    }
                }
                var background = new Image();
                background.src = $scope.bg_file;
                background.onload = function () {
                    context.drawImage(background, 0, 0);
                    draw($scope.orderDetailData);
                    $scope.writeOrderData();
                    context.font = "18px Verdana";
                    if ($scope.paperAreaData.length > 0) {
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
                                        //$scope.dateInfo.facility_name,
                                        $scope.metadata.facility_name,
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
                        }
                    }
                }
            }, function(message) {
            });
        }
        $scope.initialization = function () {
            $scope.getPagedDataAsync(EPAPER_MENU_CODE.DOCTOR_SIG_MISSING)
        }
        $scope.editToDo = function (isList) {
            $scope.isList = !isList;
        }
        $scope.postData=function(){
            if(!$scope.createPostResultData){
                return
            }
            var requestJSON = '{"page_info_code":"'+$scope.page_info_code+'","print_queue_id":"'+$scope.print_queue_id+'","doctor_code":"","user_code":"'+$scope.user_code+'","facility_code": "'+$scope.facility_code+'","keyboard_meta":'+ JSON.stringify($scope.postKeyBoardData)+',"patient_code": "'+$scope.patient_name+'","todo_meta":'+ JSON.stringify($scope.postToDoData)+'}';
            httpCall.remoteCall($scope, $http, APP_ACTION.VERIFY_TO_DO_ORDER, requestJSON, function(record) {
                $scope.editToDo(false);
                $scope.getPagedDataAsync(EPAPER_MENU_CODE.DOCTOR_SIG_MISSING)
                $scope.createPostResultData = false;
              }, function(message) {
                $scope.createPostResultData = false;
            });
        }
        $scope.initialization ()
    }]);