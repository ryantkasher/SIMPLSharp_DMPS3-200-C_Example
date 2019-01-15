// Copyright (C) 2017 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.


jQuery.fn.scrollTo = function(elem) {
    $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
    return this;
};


app.controller('ActivityLogController',
    function($scope, DataService, $interval, JavaScriptConstants, LogPollingInterval) {


        $scope.lastLogId = -1;
        $scope.dataService = DataService;
        $scope.CurrentLog = [];
        $scope.FollowScroll = true;
        $scope.FilterExpression = "";
        $scope.FilterType = "";
        $scope.ActivityForm = {};


        $scope.SetScrollButton = function() {
            if ($scope.FollowScroll)
                $("#ScrollButton").html(JavaScriptConstants.StopScrolling);
            else
                $("#ScrollButton").html(JavaScriptConstants.Scrolling);
        }

        $scope.ToggleScroll = function() {
            $scope.FollowScroll = !$scope.FollowScroll;
            $scope.SetScrollButton();
        }

//        $scope.SearchTerm = "";
//        $scope.Searching = false;
//        $scope.SearchResults = [];


//        $scope.CheckSearchToggle = function() {
//            if ($scope.SearchTerm == "") {
//                $scope.Searching = false;
//            }
//        }

//        $scope.Search = function() {
//            if ($scope.SearchTerm == "")
//                return;

//            var tmp = [];
//            var re = new RegExp($scope.SearchTerm, "i");
//            $scope.CurrentLog.forEach(function(item) {
//                if (item.Entry.match(re))
//                    tmp.push(item);

//            });
//            $scope.SearchResults = tmp;
//            $scope.Searching = true;

//        }


//        $scope.Clear = function() {
//            $scope.CurrentLog = [];
//        }

        $scope.intervalPromise = null;
        $scope.ScrollNextTime = false;
        $scope.GetActivityLog = function() {
            DataService.GetActivityLog($scope.lastLogId, $scope.FilterType, $scope.FilterExpression).then
            (
                function(logData) {
                    if (angular.isArray(logData)) {
                        logData.forEach(function(item) {
                            $scope.lastLogId = item.Id;
                            $scope.CurrentLog.push(item);

                        });
                        console.log("logData.length==" + logData.length);
                    }
                    if (($scope.FollowScroll) && (!$scope.ScrollingPaused) && ($scope.ScrollNextTime) && (!$scope.Searching)) {
                        $("#Log").scrollTo('#' + ($scope.CurrentLog[$scope.CurrentLog.length - 2].Id));
                    }
                        //window.location.hash = '#' + ($scope.CurrentLog[$scope.CurrentLog.length - 2].Id);
                    if (angular.isArray(logData))
                    {
                        $scope.ScrollNextTime = true;
                    } else {
                        $scope.ScrollNextTime = false;
                    }

                    if ($scope.intervalPromise == null)
                        $scope.intervalPromise= $interval($scope.GetActivityLog, LogPollingInterval);
                }
            );
        }

        $scope.Download = function() {
            var res = "";
            $scope.CurrentLog.forEach(function(item) {
                res += item.Entry + "\r\n";

            });;

            download(res, "log.txt", "text/plain");
        }
        $scope.ScrollingPaused = false;
        $scope.PauseScrolling = function()
        {
            $scope.ScrollingPaused = true;
        }
        $scope.ResumeScrolling= function() {
            $scope.ScrollingPaused = false;
            
        }
        $scope.Test = function()
        {
            window.location.hash = '#' + ($scope.CurrentLog[$scope.CurrentLog.length - 1].Id);
        }               
});