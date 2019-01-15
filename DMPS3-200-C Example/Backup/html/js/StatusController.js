// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



app.controller('StatusController',
            function($scope, DataService, $interval, $linq, Subscriptions) {


                $scope.StatusVisible = false;
                $scope.SwitchSelectVisible = false;
                $scope.dataService = DataService;
                $scope.roomStatusData = [];
                $scope.ChannelTypeChoices = [];
                $scope.currentRoomId = 0;// todo

                $scope.GetDeviceType = function(dtype)
                {
                    var name = "";
                    $scope.ChannelTypeChoices.forEach(
                    function(typ)
                    {

                        if (typ.Value == dtype)
                        {
                            name = typ.Name;

                        }

                    }
                    );
                    return name;

                }
                
                $scope.GetChannelTypeOptions = function()
                {

                    DataService.GetChannelTypeOptions().then(
                function(resultData)
                {

                    $scope.ChannelTypeChoices = resultData;

                }
            );
         
                }
                $scope.GetRoomStatus = function(roomId)
                 {
                    $scope.currentRoomId = roomId;
                    DataService.GetRoomStatus(roomId).then
                        (
                            function(roomStatusData) {
                                console.log("GetRoomStatus returned..");
                                if (roomStatusData == null)
                                    return;
                                if (roomStatusData.result != null)
                                    return;
                                
                                $scope.roomStatusData = roomStatusData;
                                if ($scope.IconChoices == null)
                                    return;
                                roomStatusData[0].Switcher.OutputChannels.forEach(function(item) {
                                    item.Icon = $linq.Enumerable().From($scope.IconChoices).Where(function(x) { return item.IconId == x.IconId; }).FirstOrDefault();
                                });
                                roomStatusData[0].Switcher.InputChannels.forEach(function(item)
                                {
                                    item.Icon = $linq.Enumerable().From($scope.IconChoices).Where(function(x) { return item.IconId == x.IconId; }).FirstOrDefault();
                                });

//                                $scope.IconChoices.forEach
//                                (
//                                    function(icon)
//                                    {
//                                        if (iconId == icon.IconId)
//                                            $scope.OutputsView[channel - 1].Icon = icon.SmallFilesName;
//                                    }
//                                );
                            }
                        );
                  }
        
        $scope.stop= null;
        $scope.StartPolling = function() {
            if ($scope.stop != null)
                return;
            $scope.stop= $interval(
                function() {console.log("Polling");$scope.GetRoomStatus($scope.currentRoomId);}
                , 5000);
            }
        $scope.StopPolling = function() 
            {
                $interval.cancel($scope.stop);
                $scope.stop = null;

            }

        $scope.$on(Subscriptions.ServerOffline, $scope.StopPolling);
        $scope.$on(Subscriptions.ServerOnline, $scope.StartPolling);
         $scope.IconChoices = [];
         $scope.GetDeviceIcons = function()
                    {

                     DataService.GetDeviceIcons().then(
                        function(iconData)
                        {
                            $scope.IconChoices = iconData;
                        }
                    );
                    }
                    
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
                    if ((e.type == "shown") && (e.currentTarget.id == "StatusTab"))
                        $scope.StartPolling();
                    else
                        $scope.StopPolling();
                });
                    
            });