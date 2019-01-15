// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

//var app = angular.module('AVF', []);
var app = angular.module('AVF', ['ngMessages', 'angular-linq', 'ngTable', 'moment-picker'], function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
    * The workhorse; converts an object to x-www-form-urlencoded serialization.
    * @param {Object} obj
    * @return {String}
    */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [
        function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }
    ];
//})
}).config(['momentPickerProvider', function(momentPickerProvider) {
    momentPickerProvider.options(
            {

                locale: 'en',
                format: 'L LT',
                minView: 'decade',
                maxView: 'minute',
                startView: 'year',
                autoclose: true,
                today: false,
                keyboard: false,


                leftArrow: '&larr;',
                rightArrow: '&rarr;',
                yearsFormat: 'YYYY',
                monthsFormat: 'MMM',
                daysFormat: 'D',
                hoursFormat: 'HH:[00]',
                minutesFormat: 'HH:mm',
                secondsFormat: 'ss',
                minutesStep: 1,
                secondsStep: 1
            }
        );
} ]);


