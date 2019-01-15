// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

app.directive('configureButtons', function(DialogService) {
    
    
    return {
        templateUrl: 'configureButtons.html',
        restrict: 'E',
        scope: {
        rows: '=rows', columns: '=columns', configuration: '=configuration', actions: '=actions', changed: '&changed', closed: '&closed'
               
        },
        link: function(scope ) {
            scope.range = function(n) {
                    return new Array(n);
                };

            scope.SetAction = function(row, col, act) {
                scope.configuration[row][col] = act;
                scope.changed();
            }
            scope.$on('ShowConfigureButtons', function(newValue , args) {
                if (args)
                    DialogService.Show('ConfigButtonDialog', scope.closed);
                else
                    DialogService.Close('ConfigButtonDialog');
            });
            scope.Close = function() {
                DialogService.Close('ConfigButtonDialog');
            }
            
        }
    };
});