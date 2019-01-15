// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



app.controller('DeviceStatusController',
    function($scope, DeviceStatusService, Subscriptions, DefaultRoomId) {



        $scope.$on(Subscriptions.OnGetDevicesCompleted, function() {
            var deviceIds = $scope.Devices.map(function(val) {
                return val.DeviceId;
            });
            DeviceStatusService.RegisterForDeviceUpdates(DefaultRoomId, deviceIds);
        });

    });// end controller