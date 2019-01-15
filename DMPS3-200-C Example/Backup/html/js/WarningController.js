// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



app.controller('WarningController',
            function($scope, Const, $rootScope, MessageService, JavaScriptConstants, Alert, DataService, $interval, MessageType) {

                $scope.message = {};
                $scope.ShowNotificationWarning = false;
                $scope.StartUp = function() {

                    $scope.SubScribeToNotifications();
                    $scope.GetIsWarningAvailable();
                    $scope.StartCheckingForNextWarning();


                }

                $scope.SubScribeToNotifications = function() {
                    $rootScope.$on(Const.StatusMessageName, $scope.ShowNotification);
                }

                $scope.ShowNotification = function(args, data) {
                    $scope.message = data;
                    $scope.ShowNotificationWarning = true;
                }

                $scope.DisplayStatusMessage = function() {
                    var styles = [{ id: "MessageDialog", property: "width", value: "75%" }];
                    if ($scope.message.MessageType == MessageType.Driver)
                        MessageService.ShowMessage(JavaScriptConstants.SystemNotification, $scope.message.Message, Alert.Info, null, styles);
                    else
                        MessageService.ShowMessage(JavaScriptConstants.SystemNotification, $scope.message.Message, Alert.Info);
                    
                        $scope.ShowNotificationWarning = false;
                        $scope.GetIsWarningAvailable();

                    }

                $scope.GetIsWarningAvailable = function() {

                    DataService.IsWarningAvailable().then
                            (
                                function(result) {


                                    $scope.ShowNotificationWarning = result.val;
                                    if (result.val)
                                        $scope.StopCheckingForNextWarning();

                                }
                            );
                }

                $scope.GetNextWarning = function() {

                    DataService.GetNextWarning().then
                            (
                                function(result) {
                                    $scope.message = result;
                                    $scope.DisplayStatusMessage();
                                    $scope.StartCheckingForNextWarning();

                                }
                            );
                }


                $scope.intervalPromise = null;
                $scope.StartCheckingForNextWarning = function() {
                    $scope.ShowNotificationWarning = false;
                    if ($scope.intervalPromise == null)
                        $scope.intervalPromise = $interval($scope.GetIsWarningAvailable, Const.WarningMessagePollInterval);

                }
                $scope.StopCheckingForNextWarning = function() {
                if ($scope.intervalPromise != null)
                    $interval.cancel($scope.intervalPromise);
                    $scope.intervalPromise = null;
                }


            }); // end controller