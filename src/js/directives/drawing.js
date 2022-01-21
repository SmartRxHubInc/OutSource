'use strict';


    app.directive('drawing',['$timeout', function($timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            var drawing = false;
            var lastX;
            var lastY;
            var currentX;
            var currentY;
            var ctx = element[0].getContext('2d');
            ctx.width = ctx.clientWidth;
            ctx.height = ctx.clientHeight;
            element.on('mousedown', function (event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else {
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }
                ctx.beginPath();
                drawing = true;
            });
            element.on('mousemove', function (event) {
                if (drawing) {

                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.on('mouseup', function (event) {
                drawing = false;
            });
            $timeout(function () {
                resizeCanvas();
            },0)

            function draw(lX, lY, cX, cY) {

                ctx.moveTo(lX, lY);

                ctx.lineTo(cX, cY);

                ctx.strokeStyle = "#4bf";

                ctx.stroke();

                var objMoveTo;
                var objLineTo;

                objMoveTo = { "lx": lX, "ly": lY };
                objLineTo = { "cx": cX, "cy": cY };

                scope.moveToList.push(objMoveTo);
                scope.lineToList.push(objLineTo);
            }
            function resizeCanvas(){
                var parentWidth = element[0].parentElement.clientWidth - 50;
                element[0].width=parentWidth;
                var parentHeight = 270;
                element[0].height= parentHeight;
            }
            if(window.attachEvent) {
                window.attachEvent('onresize', function() {
                    resizeCanvas();
                });
            }
            else if(window.addEventListener) {
                window.addEventListener('resize', function() {
                    resizeCanvas();
                }, true);
            }
            
            
        }
    };
}]);