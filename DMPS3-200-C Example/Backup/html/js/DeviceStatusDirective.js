// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

app.directive('deviceStatus', function(DefaultRoomId, DialogService, DataService, $interval, DeviceInstallStatus, $rootScope, Subscriptions, Enums, UnloadService, JavaScriptConstants, DeviceStatusService, Subscriptions, Const) {

    return {
        templateUrl: 'DeviceStatus.html',
        restrict: 'E',
        scope: { deviceid: "=deviceid", roomid: "=roomid", editing: "=editing", devicetitle: "=devicetitle", mode:"=mode" },
        link: function(scope) {
            scope.closed = true;
            scope.installLog = [];
            scope.key=null;
            scope.DeviceStatusMode = Const.DeviceStatusMode;
            
            
            
            
            
            scope.$on(Subscriptions.ShowDeviceStatusDialog, function(event , newValue) {
            if (newValue) 
            {

                    DialogService.Show(Const.Dialogs.DeviceStatusDialog , scope.cancel);
                    switch(scope.mode ) {
                        case Const.DeviceStatusMode.Install:
                            scope.SetModeToInstall();
                            break;
                        case Const.DeviceStatusMode.Test:
                            scope.SetModeToTest();
                            break;
                    }
                    
             } 
             else 
             {
              scope.close();
             }
            });
            
            
            scope.SetModeToInstall = function() {
                    if (scope.editing) {
                        scope.StartPollingStatus();
                        scope.devicetitle = JavaScriptConstants.UpdateDialogTitle.replace('{0}', scope.devicetitle);
                    } else {
                        scope.GetLastCreatedDeviceId();
                        scope.devicetitle = JavaScriptConstants.InstallDialogTitle.replace('{0}', scope.devicetitle);      
                    }
                    scope.closed = false;
                    scope.key = UnloadService.RegisterForUnload(function() {
                    if (scope.deviceid == null)
                        scope.deviceid = "";
                    if (!scope.editing)
                        DataService.DeleteDevice(DefaultRoomId);
                     return false;
                        });
                    
            }
            
            scope.SetModeToTest = function() {
                    scope.GetTestableDisplayCommands();
                    scope.StartPollingStatus();
                    scope.devicetitle = JavaScriptConstants.DeviceTestDialogTitle.replace('{0}', scope.devicetitle);
                    scope.closed = false;
                    scope.editing = false;
            }
                    
        

            scope.test = function() {
                scope.mode = scope.DeviceStatusMode.Test;
                scope.editing = false;
                scope.SetModeToTest();
            }

            scope.done = function() {
                scope.closed = true;
                if (scope.editing)
                    $rootScope.$broadcast(Subscriptions.EditDeviceMessage, Enums.InstallAction.Done);
                    else
                    $rootScope.$broadcast(Subscriptions.NewDeviceMessage, Enums.InstallAction.Done);
                scope.close();
            }
            scope.back = function() {
                scope.closed = true;
                if (scope.editing)
                    $rootScope.$broadcast(Subscriptions.EditDeviceMessage, Enums.InstallAction.Back, scope.deviceid);
                    else
                    $rootScope.$broadcast(Subscriptions.NewDeviceMessage, Enums.InstallAction.Back, scope.deviceid);
               
                scope.close();
            }
            scope.cancel = function() {
                if (scope.closed)
                    return;
                scope.closed = true;
                switch(scope.mode ) {
                    case Const.DeviceStatusMode.Install:
                        if (!scope.editing)
                            $rootScope.$broadcast(Subscriptions.NewDeviceMessage, Enums.InstallAction.Cancel, scope.deviceid);
                        break;
                 }
                
                scope.close();
            }
            
            scope.close= function() {
                scope.StopPollingStatus();
                UnloadService.UnRegisterForUnload(scope.key);
                DialogService.Close(Const.Dialogs.DeviceStatusDialog);
                $rootScope.$broadcast(Subscriptions.EditDeviceMessage, Enums.InstallAction.Done);
                $rootScope.$broadcast(Subscriptions.OnGetDevicesCompleted);
                
            }
            scope.GetDeviceStatusTimer = null;
            scope.StartPollingStatus = function() {
            
                DeviceStatusService.UnRegisterForAllDeviceUpdates();
                DeviceStatusService.SetDetailed( true ) ;
                DeviceStatusService.RegisterForDeviceUpdates(DefaultRoomId, [scope.deviceid]);   
                scope.installLog = [];
            }

            scope.StopPollingStatus = function() {
                DeviceStatusService.SetDetailed( false ) ;
                DeviceStatusService.UnRegisterForDeviceUpdates(DefaultRoomId, [scope.deviceid]);   
            }
   
            scope.GetLastCreatedDeviceId= function()
            {
                DataService.GetLastCreatedDeviceId().then(function(res) {
                    if (res) {
                        scope.deviceid= res.result;
                        scope.StartPollingStatus();
                    }
                });
            }
            
            scope.TestableDisplayCommands = [];
            scope.GetTestableDisplayCommands = function() {
                        DataService.GetTestableDisplayCommands().then(
                        function(resultData) {
                            scope.TestableDisplayCommands = resultData;
                        }
                    );
            }

            scope.SendDeviceCommand = function(command) {
                DataService.SendDeviceCommand(DefaultRoomId, scope.deviceid,command ).then(
                    function(result) {
                        // hmm what to do here
                    }
                );
            }
            

            scope.$on(Subscriptions.DeviceStatus, function(event, result) {
                var device = result.find(function(x) { return x.DeviceId == scope.deviceid; });
                if (device) {
                    scope.installLog = device.StatusMesssages;
                    switch (device.InstallStatus) {
                    case DeviceInstallStatus.Success:
                        scope.StartPollingStatus();
                        break;
                    case DeviceInstallStatus.Failed:
                        scope.StartPollingStatus();
                        break;

                    }
                }
            });
        }
    };
});