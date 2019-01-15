// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";
 app.service("DeviceStatusService",
            function(DataService, Subscriptions , $rootScope, $interval ) {

                me = this;
                me.roomDeviceIds ={};
                me.getDeviceStatusTimer = null;
                detailed = false;
                return({
                    RegisterForDeviceUpdates: RegisterForDeviceUpdates,
                    UnRegisterForDeviceUpdates: UnRegisterForDeviceUpdates,
                    UnRegisterForAllDeviceUpdates: UnRegisterForAllDeviceUpdates,
                    SetDetailed: SetDetailed

               });

                var me;
                var detailed;

                function SetDetailed(newVal) {
                    detailed = newVal;
                }
                function startPolling()
                {
                    if (me.GetDeviceStatusTimer != null)
                        return;
                    
                    me.GetDeviceStatusTimer =  $interval(GetDevicesStatus, 2000);
                }
                function stopPolling()
                {
                    if (me.GetDeviceStatusTimer == null)
                        return;
                    $interval.cancel(me.GetDeviceStatusTimer);
                    me.GetDeviceStatusTimer = null;
                }
                
                function RegisterForDeviceUpdates(roomId , deviceIds, detail) {

                    if (!me.roomDeviceIds.hasOwnProperty(roomId))
                        me.roomDeviceIds[roomId] = [];

                    deviceIds.forEach(function(deviceId) {
                        if (!me.roomDeviceIds[roomId].find(function(item) { return deviceId == item; } ) )
                            me.roomDeviceIds[roomId].push(deviceId);
                    });

                    if (Object.keys(me.roomDeviceIds).length > 0)
                        startPolling();

                }

                function UnRegisterForAllDeviceUpdates() {
                    me.roomDeviceIds = {};
                    stopPolling();
                }

                function UnRegisterForDeviceUpdates(roomId , deviceIds) {
                    if (!me.roomDeviceIds.hasOwnProperty(roomId)) {
                        if (Object.keys(me.roomDeviceIds).length == 0)
                            stopPolling();
                        return;
                    }
                        deviceIds.forEach(function(deviceId) {
                        var index = me.roomDeviceIds[roomId].findIndex(function(x) { return x == deviceId; })
                        if (index >=0) {
                            me.roomDeviceIds[roomId].splice(index, 1);
                        }
                      
                    });

                    if (me.roomDeviceIds[roomId].length == 0)
                        delete me.roomDeviceIds[roomId];
                        
                    
                    if (Object.keys(me.roomDeviceIds).length == 0)
                        stopPolling();
                }
             
             
             function GetDevicesStatus() {
                 console.log("GetDevicesStatus " + new Date().getTime());
                    for (var roomid in me.roomDeviceIds) {
                      if (me.roomDeviceIds.hasOwnProperty(roomid)) {
                          DataService.GetDevicesStatus(roomid, me.roomDeviceIds[roomid], detailed).then(function(result) {
                            if (result) {
                                $rootScope.$broadcast(Subscriptions.DeviceStatus, result);
                            }
                        });
                      }
                    }
                

                }


});
