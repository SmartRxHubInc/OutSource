app.directive('fileUpload', function() {
    return {
        scope: true, //create a new scope
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel) {
            el.bind('change', function(event) {
                scope.$apply(function() {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
                var files = event.target.files;
                var file = files[0];
                var binaryString;
                if (files && file) {
                    var reader = new FileReader();
                    reader.onload = function(readerEvt) {
                        console.log(readerEvt);
                        binaryString = readerEvt.target.result;
                        scope.$emit("fileSelected", {file: binaryString, files: files});
                    };
                    reader.readAsDataURL(file);
//                    reader.readAsBinaryString(file);
                }
            });
        }
    };
});
app.directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {

                    scope.$apply(function() {
                        ngModel.$setViewValue(element.val());
                        ngModel.$render();
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
app.directive('lcdModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?'
            },
            link: function(scope, element, attrs, ngModel) {
                var model = $parse(attrs.lcdModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    var image = new Image(); // or document.createElement('img')
                    var URL = window.URL || window.webkitURL;
                    var srcTmp = URL.createObjectURL(element[0].files[0]);
                    image.src = srcTmp;
                    var width, height;
                    image.onload = function() {
                        width = image.width;
                        height = image.height;
                        if ((width <= scope.resizeMaxWidth) && (height <= scope.resizeMaxHeight)) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(element.val());
                                ngModel.$render();
                                modelSetter(scope, element[0].files[0]);
                                scope.$emit("fileSizeSuccess");
                            });
                        } else {
                            scope.$apply(function() {
                                ngModel.$setViewValue('');
                                ngModel.$render();
                                modelSetter(scope, element[0].files[0]);
                                scope.$emit("fileSizeError");
                            });
                        }
                    };



                });
            }
        };
    }]);