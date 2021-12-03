(function(angular) {
    'use strict';
    function printDirective() {
        console.log('lalabhai111');
        var printSection = document.getElementById('canvas');
        console.log(printSection)
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            
            element.on('click', function() {
                console.log('lalabhai');
                console.log(attrs);
                var elemToPrint = document.getElementById(attrs.printElementId);
                console.log(elemToPrint);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
            window.onafterprint = function() {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            }
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
            window.print();
        }
        return {
            link: link,
            restrict: 'A'
        };
    }
    angular.module('app').directive('ngPrint', [printDirective]);
}(window.angular));