// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



app.controller('ConfigController',
    function($scope, DataService, MessageService, $timeout,
        DeviceTransport, DeviceType, PortType, DefaultRoomId, JavaScriptConstants, $window, MaxConfigUploadSize, MaxDriverUploadSize, MaxCertUploadSize, ConfigExtension, Alert, $linq, SwitchChannelState, OnlineOfflineService, $interval, Const, SystemState, SchedulingType, NgTableParams, SwitcherOutputRouteType,
        SwitcherOutputAudioRouteType, $rootScope, ChannelType, Subscriptions, Enums, RelayBehavior, DeviceStatusService) {

        $scope.CurrentPage;
        $scope.ShowIcon = false;
        $scope.DeviceTransport = DeviceTransport;
        
        $scope.SelectImage = function($event, channel, iconId, inOut) {
            $scope.ConfigInputsOutputs.$setDirty();

            if (inOut == 'output') {

                $scope.OutputsView[channel - 1].IconId = iconId;

                $scope.IconChoices.forEach
                (
                    function(icon) {
                        if (iconId == icon.IconId)
                            $scope.OutputsView[channel - 1].Icon = icon.SmallFilesName;
                    }
                );
            } else {

                $scope.InputsView[channel - 1].IconId = iconId;

                $scope.IconChoices.forEach
                (
                    function(icon) {
                        if (iconId == icon.IconId)
                            $scope.InputsView[channel - 1].Icon = icon.SmallFilesName;
                    }
                );
            }


        }


        $scope.InputsView = [];
        $scope.InputRanks = [];

        $scope.TransportTypeOptions = [];

        $scope.IconChoices = [];
        $scope.OutputsView = [];


        $scope.InputEndpointsView = [];
        $scope.OuputEndpointsView = [];

        $scope.SupportedDevices = [];
        $scope.DeviceTypeChoices = [];

        $scope.BaudRateChoices = [];
        $scope.SwitchChannelStateChoices = [];
        $scope.SchedulingTypeChoices = [];
        $scope.StandbyModeChoices = {};

        $scope.Devices = [];
        $scope.NewDevice = {};
        $scope.NewDevice.OccupancySensorDetails = {};
        $scope.NewDevice.CustomSerial = {};
        $scope.CallOptions = {};
        $scope.FusionConfig = {};
        $scope.FusionConfigOldIpId = {};
        $scope.OldFusionConfig = {};
        $scope.RelayConfig = {};
        $scope.SchedulingSettings = {};
        $scope.FilteredDevices = [];
        $scope.ScalerOutputResolutionTypeChoices = [];
        $scope.ScalerOutputResolution4KTypeChoices = [];
        $scope.ScalerOutputDisplayModeTypeChoices = [];

        $scope.FilteredDevicePorts = [];
        $scope.ipRegEx = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
        //$scope.UrlRegEx= /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        $scope.ipIdRegEx = /^([3-9,a-f,A-F]|[1-9,a-e,A-E][0-9,a-f,A-F]|[f,F][0-9,a-e,A-E]|0[3-9,a-f,A-F])$/;
        $scope.portRegEx = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
        $scope.channelRegEx = /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/;
        $scope.delayRegEx = /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/;
        //$scope.phoneRegEx = /^\d{1,12}$/ ;
        $scope.phoneRegEx = /^\+?[0-9,\,]{1,15}$/;
        $scope.blueToothNameRegEx = /^([0-9]|[a-z]|[A-Z]|[_]|[-])*$/;
        $scope.UrlRegEx = /^(([a-z]+\:\/+)([^\/\s]*)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ \#]*)#?([^ \#]*))$/;
        $scope.usernameRegEx = /^([a-zA-Z0-9_\-\\.]{1,30})$/;

        $scope.alphaNumericRegEx = /^([a-zA-Z0-9_\-\\.\s])*$/;
        //$scope.searchRegEx = /^([3-9,a-f,A-F]|[1-9,a-e,A-E][0-9,a-f,A-F]|[f,F][0-9,a-e,A-E]|0[3-9,a-f,A-F])$/;


        $scope.roomNameRegEx = /^([0-9]|[a-z]|[A-Z]|[_]|[-]|[ ]|[\/]|[\)]|[\(])*$/;


        $scope.ShowDeviceIpEntry = false;
        $scope.ShowDeviceIpPortEntry = false;
        $scope.ShowDevicePortEntry = false;
        $scope.ShowDeviceDmEntry = false;
        $scope.ShowDeviceChannelEntry = false;

        $scope.ShowDeviceIpIdEntry = false;
        $scope.ShowCrestnetEntry = false;
        $scope.ShowDisplayDefaultInput = false;

        $scope.SaveNewDeviceDisabled = true;
        $scope.ShowKeyPadUsbEntry = false;
        $scope.ShowControlSelectorEntry = false;
        $scope.ShowDeviceSerialBaudEntry = false;
        $scope.ShowCustomSerial = false;
        $scope.ShowPrimarySecondaryInputChannelNumber = false;


        $scope.ScheduleEnableText = JavaScriptConstants.Enable;

        $scope.FusionEnableText = JavaScriptConstants.Enable;
        $scope.RelayEnableText = JavaScriptConstants.Enable;
        $scope.DialerEnableText = JavaScriptConstants.Enable;
        $scope.LightingEnableText = JavaScriptConstants.Enable;
        $scope.FusionCloudUrlEnableText = JavaScriptConstants.Enable;

        $scope.Refresh = function() {
            DeviceStatusService.UnRegisterForAllDeviceUpdates();
            $scope.GetDevices(DefaultRoomId);
            $scope.GetPorts(DefaultRoomId);
            $scope.GetUsedIpIds(DefaultRoomId);
            $scope.GetAssociatedChannelChoices(DefaultRoomId);
            $scope.GetInputsView(DefaultRoomId);
            $scope.ResetChoices('Unique_');
        }


        $scope.GetSaveNewDeviceDisabled = function() {
            var transportType = $scope.GetTransportType($scope.NewDevice.DeviceModel);

            if (!$scope.Config.ConfigDeviceForm.$valid)
                return true;
            if (
                ($scope.NewDevice.DeviceType == null) ||
                ($scope.NewDevice.DisplayName == null) ||
                ($scope.NewDevice.DeviceModel == null) ||
                (transportType == null)
            ) {

                return true;
            }

            if (
                (($scope.NewDevice.DeviceType == DeviceType.AvDisplay) || ($scope.NewDevice.DeviceType == DeviceType.Projector))
                    &&
                    ($scope.NewDevice.RADInputName == null) &&
                    (transportType != DeviceTransport.None)
            ) {
                return true;
            }

            //console.log("transportType==" + transportType);
            switch (transportType) {

                case DeviceTransport.SerialBaudCustom:
                    if (($scope.NewDevice.CustomSerial.PowerOnCommand == null)
                        || ($scope.NewDevice.CustomSerial.PowerOnDelaySeconds == null)
                        || ($scope.NewDevice.CustomSerial.PowerOffCommand == null)
                        || ($scope.NewDevice.CustomSerial.SourceSelectCommand == null)
                        || ($scope.NewDevice.DevicePort == null)
                        || ($scope.NewDevice.BaudRate == null)
                )
                        return true;

                    break;
                case DeviceTransport.CrestronCrestnet:

                    if (($scope.NewDevice.CrestnetId == null))
                        return true;
                    if ($scope.CrestnetIdIsNotValid($scope.NewDevice.CrestnetId))
                        return true;


                    if ($scope.NewDevice.DeviceType == DeviceType.Occupancy) {
                        if (!$scope.NewDevice.OccupancySensorDetails.UseSensorTimeout) {
                            if ($scope.Config.ConfigDeviceForm.NewDevice_OccupancySensorDetails_SensorTimeOutMinutes != null)
                                if ($scope.Config.ConfigDeviceForm.NewDevice_OccupancySensorDetails_SensorTimeOutMinutes.$invalid)
                                return true;
                        }

                    }

                    break;
                case DeviceTransport.CrestronIpId:


                    if (($scope.NewDevice.IpId == null) && (($scope.NewDevice.IsDm == null) || ($scope.NewDevice.IsDm == false)))
                        return true;
                    if ($scope.NewDevice.DeviceType == DeviceType.EndpointRxScaler) {

                        if ($scope.NewDevice.Resolution == null)
                            return true;
                        if (($scope.NewDevice.DisplayMode == null))
                            return true;
                    }
                    if ($scope.IsIpIdIAlreadyInUse($scope.NewDevice.IpId))
                        return true;


                    if ($scope.NewDevice.DeviceType == DeviceType.Occupancy) {
                        if (!$scope.NewDevice.OccupancySensorDetails.UseSensorTimeout) {
                            if ($scope.Config.ConfigDeviceForm.NewDevice_OccupancySensorDetails_SensorTimeOutMinutes != null)
                                if ($scope.Config.ConfigDeviceForm.NewDevice_OccupancySensorDetails_SensorTimeOutMinutes.$invalid)
                                return true;
                        }

                    }

                    break;
                case DeviceTransport.CrestronIp:
                    if ($scope.NewDevice.Ip == null)
                        return true;

                    break;


                case DeviceTransport.CrestronIpPort:
                    if (($scope.NewDevice.Ip == null) || ($scope.NewDevice.Port == null))
                        return true;
                    break;
                case DeviceTransport.IpPort:
                    if (($scope.NewDevice.Ip == null) || ($scope.NewDevice.Port == null))
                        return true;
                    break;
                case DeviceTransport.Ip:
                    if ($scope.NewDevice.Ip == null)
                        return true;
                    break;
                case DeviceTransport.IpPortChannel:
                    if (($scope.NewDevice.Ip == null) || ($scope.NewDevice.Port == null) || ($scope.NewDevice.Channel == null))
                        return true;

                    break;
                case DeviceTransport.IpChannel:

                    if (($scope.NewDevice.Ip == null) || ($scope.NewDevice.Channel == null))
                        return true;
                    break;


                case DeviceTransport.SerialBaud:
                    if (($scope.NewDevice.DevicePort == null) || ($scope.NewDevice.BaudRate == null))
                        return true;
                    break;

                case DeviceTransport.SerialChannel:

                    if (($scope.NewDevice.DevicePort == null) || ($scope.NewDevice.Channel == null) || ($scope.NewDevice.Channel == "") || ($scope.NewDevice.DevicePort == ""))
                        return true;
                    break;

                case DeviceTransport.SerialBaudChannel:
                    //console.log("$scope.NewDevice.DevicePort== " + $scope.NewDevice.DevicePort);
                    if (($scope.NewDevice.DevicePort == "") || ($scope.NewDevice.Channel == null) || ($scope.NewDevice.BaudRate == null) || ($scope.NewDevice.DevicePort == null))
                        return true;
                    break;

                case DeviceTransport.Cec:
                case DeviceTransport.Serial:
                case DeviceTransport.CrestronUsb:
                case DeviceTransport.Ir:
                    if (($scope.NewDevice.DevicePort == null) || ($scope.NewDevice.DevicePort == ""))
                        return true;
                    break;

                case DeviceTransport.None:
                    return false;
                default:
                    return true;


            }

            //                console.log('false');
            return false;
        }

        $scope.CallGetSaveNewDeviceDisabled = function() {
            $scope.GetSaveNewDeviceDisabled();

        }

        $scope.CallGetEditSaveDisabled = function() {

            $scope.GetEditSaveDisabled();
        }
        $scope.GetEditSaveDisabled = function() {

            if ($scope.Config.EditDeviceForm == null)
                return true;

            if ($scope.EditDevice == null)
                return true;

            //        console.log("EditDeviceForm=" + $scope.Config.EditDeviceForm);
            //        console.log("$scope.EditDeviceForm.$dirty=" + $scope.Config.EditDeviceForm.$dirty);
            //        console.log("EditDevice=" + $scope.EditDevice);


            if ((!$scope.Config.EditDeviceForm.$dirty) || ($scope.Config.EditDeviceForm.$invalid))
                return true;

            var transportType = $scope.EditDevice.TransportEnum;


            //console.log('transportType =' + transportType);
            if ($scope.EditDevice.DisplayName == null) {

                return true;
            }
            switch (transportType) {

                case DeviceTransport.CrestronCrestnet:
                    if ($scope.EditDevice.UsbPort == null)
                        return true;
                    if ($scope.CrestnetIdIsNotValid($scope.EditDevice.CrestnetId, $scope.OldDeviceSettings.CrestnetId))
                        return true;

                    if ($scope.EditDevice.DeviceTypeEnum == DeviceType.Occupancy) {
                        if (!$scope.EditDevice.OccupancySensor.UseSensorTimeout) {

                            if ($scope.Config.EditDeviceForm.EditDevice_OccupancySensor_SensorTimeOutMinutes != null)
                                if ($scope.Config.EditDeviceForm.EditDevice_OccupancySensor_SensorTimeOutMinutes.$invalid)
                                return true;
                        }

                    }
                    break;
                case DeviceTransport.CrestronIpId:

                    //                    console.log('$scope.EditDevice.IsDm =' + $scope.EditDevice.IsDm);

                    if (($scope.EditDevice.IpId == null) && (($scope.EditDevice.IsDm == null) || ($scope.EditDevice.IsDm == false)))
                        return true;
                    if ($scope.EditDevice.DeviceType == DeviceType.EndpointRxScaler) {

                        if (($scope.EditDevice.Resolution == null) || ($scope.EditDevice.Resolution == ""))
                            return true;
                        if (($scope.EditDevice.DisplayMode == null))
                            return true;
                    }

                    //console.log("$scope.EditDevice.IpId = " + $scope.EditDevice.IpId + " " + "$scope.OldDeviceSettings.IpId=" + $scope.OldDeviceSettings.IpId);
                    if ($scope.IsIpIdIAlreadyInUse($scope.EditDevice.IpId, $scope.OldDeviceSettings.IpId))
                        return true;

                    if ($scope.EditDevice.DeviceTypeEnum == DeviceType.Occupancy) {
                        if (!$scope.EditDevice.OccupancySensor.UseSensorTimeout) {

                            if ($scope.Config.EditDeviceForm.EditDevice_OccupancySensor_SensorTimeOutMinutes != null)
                                if ($scope.Config.EditDeviceForm.EditDevice_OccupancySensor_SensorTimeOutMinutes.$invalid)
                                return true;
                        }

                    }


                    break;
                case DeviceTransport.CrestronIp:
                    if ($scope.EditDevice.Ip == null)
                        return true;

                    break;


                case DeviceTransport.CrestronIpPort:
                    if (($scope.EditDevice.Ip == null) || ($scope.EditDevice.Port == null) || ($scope.EditDevice.Ip == ""))
                        return true;
                    break;
                case DeviceTransport.IpPort:
                    if (($scope.EditDevice.Ip == null) || ($scope.EditDevice.Port == null) || ($scope.EditDevice.Ip == ""))
                        return true;
                    break;
                case DeviceTransport.Ip:
                    if (($scope.EditDevice.Ip == null) || ($scope.EditDevice.Ip == ""))
                        return true;
                    break;
                case DeviceTransport.IpPortChannel:
                    if (($scope.EditDevice.Ip == null) || ($scope.EditDevice.Port == null) || ($scope.EditDevice.Channel == null) || ($scope.EditDevice.Ip == ""))
                        return true;

                    break;
                case DeviceTransport.IpChannel:

                    if (($scope.EditDevice.Ip == null) || ($scope.EditDevice.Channel == null) || ($scope.EditDevice.Ip == ""))
                        return true;
                    break;

                //            Serial: 'Serial',    
                //            SerialBaud: 'SerialBaud',    
                //            SerialBaudChannel: 'SerialBaudChannel',    
                //            SerialBaudCustom: 'SerialBaudCustom',  

                case DeviceTransport.Serial:
                    if (($scope.EditDevice.CommunicationsPortId == null) || ($scope.EditDevice.CommunicationsPortId == ""))
                        return true;
                    break;
                case DeviceTransport.SerialChannel:
                    if (($scope.EditDevice.CommunicationsPortId == null) || ($scope.EditDevice.CommunicationsPortId == "") || ($scope.EditDevice.Channel == null))
                        return true;
                    break;
                case DeviceTransport.SerialBaud:
                    if (($scope.EditDevice.CommunicationsPortId == null) || ($scope.EditDevice.CommunicationsPortId == "") || ($scope.EditDevice.BaudRate == null) || ($scope.EditDevice.BaudRate == 0))
                        return true;
                    break;
                case DeviceTransport.SerialBaudChannel:
                case DeviceTransport.SerialBaudCustom:

                    if (($scope.EditDevice.CommunicationsPortId == null) || ($scope.EditDevice.CommunicationsPortId == "") || ($scope.EditDevice.BaudRate == null) || ($scope.EditDevice.BaudRate == 0))
                        return true;

                    switch (transportType) {
                        case DeviceTransport.SerialBaudChannel:

                            if (($scope.EditDevice.DevicePortId == null) || ($scope.EditDevice.Channel == null))
                                return true;
                            break;
                        case DeviceTransport.SerialBaudCustom:
                            if (
                        ($scope.EditDevice.CustomSerial.SourceSelectCommand == null) || ($scope.EditDevice.CustomSerial.SourceSelectCommand == "") ||
                        ($scope.EditDevice.CustomSerial.PowerOffCommand == null) || ($scope.EditDevice.CustomSerial.PowerOffCommand == "") ||
                        ($scope.EditDevice.CustomSerial.PowerOnDelaySeconds == null) ||
                        ($scope.EditDevice.CustomSerial.PowerOnCommand == null) || ($scope.EditDevice.CustomSerial.PowerOnCommand == "")
                    )
                                return true;
                            break;
                    }
                    break;

                case DeviceTransport.CrestronUsb:
                case DeviceTransport.Ir:
                    if (($scope.EditDevice.CommunicationsPortId == null) || ($scope.EditDevice.CommunicationsPortId == ""))
                        return true;
                    break;

                case DeviceTransport.None:
                    return false;

                case DeviceTransport.Unknown:
                    return true;


            }

            //                console.log('false');
            return false;
        }


        $scope.ResetEntries = function() {

            $scope.NewDevice.Username = null;
            $scope.NewDevice.UnionId = null;
            $scope.NewDevice.OccupancySensorDetails.UseSensorTimeout = false;
            $scope.NewDevice.OccupancySensorDetails.TurnSystemOn = false;
            $scope.NewDevice.OccupancySensorDetails.TurnSystemOff = false;
            $scope.NewDevice.OccupancySensorDetails.RouteDefaultVideo = false;
            if (($scope.Config.ConfigDeviceForm != null) && ($scope.Config.ConfigDeviceForm.NewDevice_DisplayName != null))
                $scope.Config.ConfigDeviceForm.NewDevice_DisplayName.$setPristine();


            if ($scope.NewDevice.ControlType != null)
                $scope.NewDevice.ControlType = null;
            $scope.NewDevice.DevicePort = "";

            $scope.Rows = 0;
            $scope.Columns = 0;
            $scope.ShowAdvancedButtonConfigButton = false;
            $scope.ShowUsername = false;
            $scope.ShowUnionId= false;
            $scope.Installable = false;
            $scope.AvailableActions = null;
            $scope.ButtonConfiguration = [];
            $scope.NewDevice.IsDm = false;


            $scope.ShowDeviceIpEntry = false;
            $scope.ShowDeviceIpPortEntry = false;

            $scope.ShowDeviceIpIdEntry = false;
            $scope.ShowCrestnetEntry = false;
            $scope.ShowDeviceDmEntry = false;
            $scope.SaveNewDeviceDisabled = true;
            $scope.ShowKeyPadUsbEntry = false;
            $scope.ShowDeviceChannelEntry = false;
            $scope.ShowControlSelectorEntry = false;
            $scope.ShowDevicePortEntry = false;
            $scope.ShowCustomSerial = false;
            $scope.ShowDeviceSerialBaudEntry = false;
            $scope.ShowPrimarySecondaryInputChannelNumber = false;
            $scope.ShowDisplayDefaultInput = false;
            $scope.ShowWarmupEntry = false;
            $scope.ShowCoolDownEntry = false;

            //$scope.NewDevice.DeviceType = null;

        }

        $scope.ResetControlEntries = function() {
            $scope.ShowDeviceIpPortEntry = false;
            $scope.ShowDeviceIpEntry = false;
            $scope.ShowDevicePortEntry = false;
            $scope.ShowDeviceChannelEntry = false;
            $scope.ShowDeviceSerialBaudEntry = false;
            $scope.ShowUsername = false;
            $scope.ShowUnionId = false;

        }


        $scope.GetTransportType = function(model) {
            var transportType;
            var device = $scope.GetDevice(model);
            //console.log('device=' + device);
            if (device == null)
                return null;
            //console.log('device.GroupDeviceDetails=' + device.GroupDeviceDetails);
            if (device.GroupDeviceDetails.length == 1)
                return device.GroupDeviceDetails[0].TransportEnum;


            device.GroupDeviceDetails.forEach(function(item) {

                if ($scope.NewDevice.ControlType == item.TransportEnum)
                    transportType = item.TransportEnum;

            });
            return transportType;
        }


        $scope.GetDevice = function(deviceModel) {
            var res;
            $scope.SupportedDevices.forEach(function(item) {

                if (item.Model == deviceModel) {
                    res = item;
                }
            });
            return res;
        }

        $scope.GetDeviceDetail = function(deviceModel, transport) {
            var res;
            $scope.SupportedDevices.forEach(function(item) {
                    if (item.Model == deviceModel)
                        res = item.GroupDeviceDetails.find(function(detail) { return detail.TransportEnum == transport; });
                }
            );
            return res;
        }

        $scope.DownloadConfiguration = function() {
            $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
            DataService.DownloadConfiguration().then(
                function(data) {
                    if (data.result == null) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                        MessageService.HideBusy();
                        return;
                    }
                    window.location.assign(data.result);
                    MessageService.HideBusy();


                }
            );
        }


        $scope.ControlSelectorChoices = [];

        $scope.ShowChooseTransport = function(device) {
            if (device.GroupDeviceDetails[0].TransportEnum == DeviceTransport.None)
                return;
            $scope.ControlSelectorChoices = device.GroupDeviceDetails;
            $scope.ShowControlSelectorEntry = true;
        }

        $scope.LocaleChoices = [];
        $scope.GetLocaleChoices = function() {
            DataService.GetLocaleChoices().then(
                function(result) {
                    $scope.LocaleChoices = result;
                }
            );
        }

        $scope.BackgroundUrlLabels = [];
        $scope.GetBackgroundUrlLabels = function() {
            DataService.GetBackgroundUrlLabels().then(
                function(result) {
                    $scope.BackgroundUrlLabels = result;
                }
            );
        }


        $scope.TimeZoneChoices = [];
        $scope.GetTimeZoneChoices = function(roomId) {
            DataService.GetTimeZoneChoices(roomId).then(
                function(result) {
                    $scope.TimeZoneChoices = result;
                }
            );
        }


        $scope.Locale = {};

        $scope.GetLocale = function() {
            DataService.GetLocale().then(
                function(result) {


                    $scope.Locale = result;

                }
            );
        }

        $scope.IsCurrentDevice4K = false;
        $scope.Rows = 0;
        $scope.Columns = 0;

        $scope.ShowAdvancedButtonConfigButton = false;
        $scope.AvailableActions = null;
        $scope.ButtonConfiguration = [];





        $scope.UpdateModelConfig = function(deviceModel) {

            if (deviceModel == null)
                return;
            $scope.ResetEntries();
            var device = $scope.GetDevice(deviceModel);

            //$scope.FilterPorts(device.DeviceTypeEnum, true);
            //$scope.SetCommunicationsPort();
            $scope.IsCurrentDevice4K = device.Is4K;
            $scope.AvailableActions = null;
            $scope.Installable = false;
            $scope.ShowAdvancedButtonConfigButton = false;

            

            if (device.Installable)
                $scope.Installable = true;



            if (device.IsConfigureableButtonPanel) {

                $scope.AvailableActions = device.ButtonConfig.AvailableActions;
                $scope.Rows = device.ButtonConfig.Rows;
                $scope.Columns = device.ButtonConfig.Cols;
                $scope.ButtonConfiguration = new Array();

                for (var i = 0; i < $scope.Rows; i++) {
                    $scope.ButtonConfiguration[i] = new Array();
                    for (var j = 0; j < $scope.Columns; j++) {
                        var act = { name: device.ButtonConfig.AvailableActions[0].Name, value: device.ButtonConfig.AvailableActions[0].Value };
                        if (device.ButtonConfig.Buttons != null)
                            act = $linq.Enumerable().From($scope.AvailableActions).Where(function(item) { return item.Value == device.ButtonConfig.Buttons[i][j]; }).FirstOrDefault();
                        $scope.ButtonConfiguration[i][j] = act;
                    }
                }


                $scope.ShowAdvancedButtonConfigButton = true;
            }
            $scope.ShowChooseTransport(device);
            if (device.GroupDeviceDetails.length == 1)
                $scope.UpdateTransportConfig(device.GroupDeviceDetails[0], device.IsCableCaddy, device.IsDmOnly);

        }

        $scope.InputConnections = [];
        $scope.ShowConfigTransportDetails = function(controlType, model) {

            $scope.ResetControlEntries();
            var device = $scope.GetDevice(model);
            $scope.UnionId = false;
            
            var deviceDetails = $linq.Enumerable().From(device.GroupDeviceDetails).Where(function(x) { return x.TransportEnum == controlType; }).FirstOrDefault();
            if (deviceDetails == null) {
                console.log('ShowConfigTransportDetails ->deviceDetails==null, controlType == ' + controlType + ', model ==' + model);
                return;
            }
            $scope.InputConnections = deviceDetails.InputConnections;

            

//            if (device.GroupDeviceDetails.length == 1) {

//                if (device.GroupDeviceDetails[0].PasswordRequired)
//                    $scope.ShowUnionId = true;
//                if (device.GroupDeviceDetails[0].UsernameRequired) {
//                    $scope.ShowUsername = true;
//                    $scope.NewDevice.Username = device.GroupDeviceDetails[0].Username;
//                }
//            } else {
//                
//            }
//            
//            device.GroupDeviceDetails.forEach(function(item) {
//                if (item.TransportEnum == controlType) {
//                    itemDetails = item;
//                    $scope.InputConnections = item.InputConnections;
//                    if (item.PasswordRequired)
//                        $scope.ShowUnionId = true;
//                    if (item.UsernameRequired) {
//                        $scope.ShowUsername = true;
//                        $scope.NewDevice.Username = device.GroupDeviceDetails[0].Username;
//                    }
//                }


            //});


            $scope.UpdateTransportConfig(deviceDetails, device.IsCableCaddy, device.IsDmOnly);
        }

        $scope.UpdateTransportConfig = function(device, isCableCaddy, isDmOnly) {
            console.log('isDmOnly==' + isDmOnly);
            //$scope.NewDevice.Port = device.DefaultPort;
            $scope.NewDevice.ControlType = device.TransportEnum;
            var transportType = device.TransportEnum;
            var isEndPoint = false;
            if (device.UnionIdRequired)
                $scope.ShowUnionId = true;
            if (device.UsernameRequired) {
                $scope.ShowUsername = true;
                $scope.NewDevice.Username = device.Username;
            }

            $scope.InputConnections = device.InputConnections;              
            
            switch (device.DeviceTypeEnum) {
                case DeviceType.EndpointTx:
                case DeviceType.EndpointRx:
                case DeviceType.EndpointRxScaler:
                    isEndPoint = true;
                    $scope.NewDevice.IsDm = true;
                    break;
                case DeviceType.AvDisplay:
                case DeviceType.Projector:
                    if (transportType != DeviceTransport.None)
                        $scope.ShowDisplayDefaultInput = true;
                    break;
            }

            if (isCableCaddy)
                $scope.ShowPrimarySecondaryInputChannelNumber = true;


            $scope.ShowDeviceDmEntry = isEndPoint;

            if (isDmOnly)
                $scope.ShowDeviceDmEntry = false;

            $scope.ShowKeyPadUsbEntry = (device.Name == DeviceType.Keypad);

            if (device.AllowWarmUpTimeEdit) {
                $scope.MinimumWarmUpTime = device.MinimumWarmUpTime;
                $scope.MaximumWarmUpTime = device.MaximumWarmUpTime;
                $scope.ShowWarmupEntry = true;
                $scope.NewDevice.WarmUpTime = device.MinimumWarmUpTime;
                $scope.WarmUpTimeValidationMessage = JavaScriptConstants.WarmUpTimeValidationMessage.replace("{0}", device.MinimumWarmUpTime).replace("{1}", device.MaximumWarmUpTime);


            }
            if (device.AllowCoolDownTimeEdit) {
                $scope.MinimumCoolDownTime = device.MinimumCoolDownTime;
                $scope.MaximumCoolDownTime = device.MaximumCoolDownTime;
                $scope.NewDevice.CoolDownTime = device.MinimumCoolDownTime;
                $scope.ShowCoolDownEntry = true;
                $scope.CoolDownTimeValidationMessage = JavaScriptConstants.CoolDownTimeValidationMessage.replace("{0}", device.MinimumCoolDownTime).replace("{1}", device.MaximumCoolDownTime);

            }


            switch (transportType) {

                case DeviceTransport.CrestronCrestnet:
                    $scope.ShowCrestnetEntry = true;
                    break;
                case DeviceTransport.CrestronIpId:
                    $scope.ShowDeviceIpIdEntry = true;
                    break;
                case DeviceTransport.CrestronIp:
                    $scope.ShowDeviceIpEntry = true;
                    break;
                case DeviceTransport.CrestronIpPort:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceIpPortEntry = true;
                    $scope.NewDevice.Port = device.DefaultPort;
                    break;
                case DeviceTransport.IpPort:

                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceIpPortEntry = true;
                    $scope.NewDevice.Port = device.DefaultPort;
                    break;
                case DeviceTransport.Ip:
                    $scope.ShowDeviceIpEntry = true;

                    break;
                case DeviceTransport.IpPortChannel:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceIpPortEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    $scope.NewDevice.Port = device.DefaultPort;

                    break;
                case DeviceTransport.IpChannel:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    break;

                case DeviceTransport.SerialBaudChannel:
                    $scope.ShowDeviceChannelEntry = true;
                    $scope.FilterPorts(transportType, false);
                    $scope.ShowDevicePortEntry = true;
                    $scope.ShowDeviceSerialBaudEntry = true;
                    $scope.NewDevice.BaudRate = device.DefaultBaudRate;
                    break;

                case DeviceTransport.SerialChannel:
                    $scope.ShowDeviceChannelEntry = true;
                    $scope.FilterPorts(transportType, false);
                    $scope.ShowDevicePortEntry = true;
                    break;

                case DeviceTransport.SerialBaudCustom:
                    $scope.ShowDeviceSerialBaudEntry = true;
                    $scope.ShowCustomSerial = true;
                    $scope.FilterPorts(transportType, false);
                    $scope.ShowDevicePortEntry = true;
                    $scope.NewDevice.BaudRate = device.DefaultBaudRate;
                    break;

                case DeviceTransport.SerialBaud:
                    $scope.ShowDeviceSerialBaudEntry = true;
                    $scope.FilterPorts(transportType, false);
                    $scope.ShowDevicePortEntry = true;
                    $scope.NewDevice.BaudRate = device.DefaultBaudRate;
                    break;

                case DeviceTransport.CrestronUsb:
                case DeviceTransport.Serial:
                case DeviceTransport.Ir:
                case DeviceTransport.Cec:
                    $scope.FilterPorts(transportType, false);
                    $scope.ShowDevicePortEntry = true;
                    break;


            }

            $scope.SaveNewDeviceDisabled = false;
        }


        $scope.FilterPorts = function(transportType, editing) {
            var tmp = [];
            var tmpUsedPorts = angular.copy($scope.UsedPorts);
            if ((editing) && ($scope.EditDevice != null) && ($scope.EditDevice.CommunicationsPortId != null))
                tmpUsedPorts = $linq.Enumerable().From(tmpUsedPorts).Where(function(x) { return x != $scope.EditDevice.CommunicationsPortId; }).ToArray();

            $scope.Ports.forEach(function(item) {

                if (!$linq.Enumerable().From(tmpUsedPorts).Where(function(x) { return x == item.PortId; }).Any()) {
                    switch (transportType) {


                        case DeviceTransport.SerialBaudChannel:
                        case DeviceTransport.SerialBaudCustom:
                        case DeviceTransport.Serial:
                        case DeviceTransport.SerialChannel:
                        case DeviceTransport.SerialBaud:
                            if (item.Type == PortType.Serial)
                                tmp.push(item);
                            break;
                        case DeviceTransport.Ir:
                            if (item.Type == PortType.Ir)
                                tmp.push(item);
                            break;
                        case DeviceTransport.Cec:
                            if (item.Type == PortType.Cec)
                                tmp.push(item);
                            break;
                        case DeviceTransport.CrestronUsb:
                            if (item.Type == PortType.Usb)
                                tmp.push(item);
                            break;
                    }
                }

            });
            $scope.FilteredDevicePorts = tmp;

        }
        $scope.GetDeviceModelsFromType = function(deviceType) {

            $scope.FilteredDevices = [];
            $scope.ResetEntries();
            var tmp = [];
            var max = 0;
            $scope.DeviceTypeChoices.forEach(function(typeItem) {
                if (typeItem.DeviceTypeEnum.indexOf(deviceType) >= 0) {
                    max = typeItem.MaxAllowed;
                }

            });


            //                console.log('deviceType=' + deviceType);
            $scope.SupportedDevices.forEach(function(item) {

                if (item.DeviceTypeEnum == deviceType) {
                    var deviceCount = 0;
                    $scope.Devices.forEach(function(itemToCheck) {
                        if (itemToCheck.DeviceTypeEnum == deviceType)
                            deviceCount++;
                    });

                    if (deviceCount >= max) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.MaxDeviceWarning.replace('{0}', max), Alert.Error);
                        $scope.NewDevice.DeviceType = '';
                        $scope.ResetEntries();
                        return;
                    } else {
                        tmp.push(item);
                    }
                }
            });


            $scope.FilteredDevices = tmp;
        }


        $scope.GetDeviceIcons = function() {

            DataService.GetDeviceIcons().then(
                function(iconData) {
                    $scope.IconChoices = iconData;
                }
            );
        }


        $scope.GetSupportedDevices = function() {

            DataService.GetSupportedDevices().then(
                function(resultData) {

                    $scope.SupportedDevices = resultData;
                    $scope.$emit(Subscriptions.OnGetSupportedDevicesCompleted);

                });
        }


        $scope.DeviceTransportDetails = [];
        $scope.InputDevices = [];
        $scope.OutputDevices = [];
        $scope.InputEndpointDevices = [];
        $scope.OutEndpointDevices = [];
        $scope.UsedIpIds = [];
        $scope.UsedCrestnetIds = [];
        $scope.UsedPorts = [];

        $scope.GetDevices = function(roomId) {
            DataService.GetDevices(roomId).then(
                function(resultData) {

                    $scope.OutEndpointDevices = [];
                    $scope.InputEndpointDevices = [];
                    $scope.InputDevices = [];
                    $scope.OutputDevices = [];
                    $scope.Devices = resultData;
                    $scope.UsedCrestnetIds = [];
                    $scope.UsedPorts = [];
                    $scope.Devices.forEach(function(item) {

                        if (item.IsEndpoint && item.IsDm) {
                            if (item.IsInputSwitchDevice)
                                $scope.InputEndpointDevices.push(item);
                            else if (item.IsOutputSwitchDevice)
                                $scope.OutEndpointDevices.push(item);
                        } else {
                            if (!item.IsEndpoint) {

                                if (!item.IsCableCaddy) {

                                    if (item.IsInputSwitchDevice)
                                        $scope.InputDevices.push(item);
                                    else if (item.IsOutputSwitchDevice)
                                        $scope.OutputDevices.push(item);
                                }
                            }
                        }
                        if (item.TransportEnum == DeviceTransport.CrestronCrestnet)
                            $scope.UsedCrestnetIds.push(parseInt(item.CrestnetId, 16));

                        if (item.DevicePort != null) {
                            $scope.UsedPorts.push(item.DevicePort.PortId);
                        }

                    });
                    
                    
                    if ($scope.CurrentPage == "CS3") {
                        $timeout($scope.UpdateAssignedDevicedDropDowns, 0);
                    }
                    $rootScope.$broadcast(Subscriptions.OnGetDevicesCompleted);

                }
            );
        }

        $scope.UpdateAssignedDevicedDropDowns = function() {
            if ($scope.OutputDevices.length > 0)
                $scope.AsyncUpdateChoices('outputView_AssocatedDeviceId');
            if ($scope.InputDevices.length > 0)
                $scope.AsyncUpdateChoices('inputView_AssocatedDeviceId');
        }

        $scope.GetDeviceTypeChoices = function() {
            DataService.GetDeviceTypeChoices().then(
                function(resultData) {
                    $scope.DeviceTypeChoices = resultData;
                }
            );
        }


        $scope.GetDefaultInputChoices = function() {
            DataService.GetDefaultInputChoices().then(
                function(resultData) {
                    $scope.DefaultInputChoices = resultData;
                }
            );
        }


        $scope.GetStandbyModeChoices = function() {
            DataService.GetStandbyModeChoices().then(
                function(resultData) {
                    $scope.StandbyModeChoices = resultData;
                }
            );
        }


        $scope.GetSwitcherOutputAudioRouteTypeChoices = function() {
            DataService.GetSwitcherOutputAudioRouteTypeChoices().then(
                function(resultData) {
                    $scope.SwitcherOutputAudioRouteTypeChoices = resultData;
                }
            );
        }

        $scope.GetSwitcherOutputRouteTypeChoices = function() {
            DataService.GetSwitcherOutputRouteTypeChoices().then(
                function(resultData) {
                    $scope.SwitcherOutputRouteTypeChoices = resultData;
                }
            );
        }


        $scope.GetSchedulingSettings = function(roomId) {
            DataService.GetSchedulingSettings(roomId).then(
                function(resultData) {
                    $scope.SchedulingSettings = resultData;
                    if ($scope.Config.ScheduleConfigForm != null)
                        $scope.Config.ScheduleConfigForm.SchedulingSettings_OutlookPassword.$modelValue = $scope.SchedulingSettings.OutlookPassword;
                }
            );
        }

        $scope.UxGeneralCustomization = {};
        $scope.GetUxGeneralCustomization = function(roomId) {
            DataService.GetUxGeneralCustomization(roomId).then(
                function(resultData) {
                    $scope.UxGeneralCustomization = resultData;
                }
            );
        }

        $scope.RoomScheduleScreenCustomization = {};
        $scope.LoadImagesTimer = null;
        $scope.GetRoomScheduleScreenCustomization = function(roomId) {
            DataService.GetRoomScheduleScreenCustomization(roomId).then(
                function(resultData) {
                    $scope.RoomScheduleScreenCustomization = resultData;
                    $scope.LoadImagesTimer = $interval($scope.LoadBackgroundUrls, 1000);
                    $scope.SyncCarouselVis();
                    $scope.loadLogoPreview();
                }
            );
        }


        $scope.ImagesLoadedCount = 0;
        $scope.LoadBackgroundUrls = function() {
            $scope.ImagesLoadedCount = 0;
            $interval.cancel($scope.LoadImagesTimer);
            if (($scope.RoomScheduleScreenCustomization != null) && ($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls != null)) {

                for (var x = 0; x < $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length; x++) {

                    (function() {
                        var i = x;
                        var url = $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[i].Url;
                        //var label = $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[i].Label;
                        //$scope.TestImage(url, function(h, w) { $scope.AddImageToCarousel(url,label , h, w); }, function() { $scope.AddImageToCarousel(url,label); }, 5000);
                        $scope.TestImage(url,
                            function(img) { $scope.AcruPreloadedImages(i, img); },
                            function() { $scope.AcruPreloadedImages(i); },
                            15000);


                    })();


                }
                //$scope.AddImageToCarousel($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[x]);
            }
        }

        $scope.AcruPreloadedImages = function(index, img) {
            $scope.PreloadImages[index] = img;
            $scope.ImagesLoadedCount++;
            if ($scope.ImagesLoadedCount == $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length) {
                for (var y = 0; y < $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length; y++)
                    $scope.AddImageToCarousel($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[y].Url, $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[y].Label, $scope.PreloadImages[y]);
                $('#myCarousel').carousel(0);
            }


        }

        $scope.PreloadImages = [];

        $scope.PresentationScreenCustomization = {};
        $scope.GetPresentationScreenCustomization = function(roomId) {
            DataService.GetPresentationScreenCustomization(roomId).then(
                function(resultData) {
                    $scope.PresentationScreenCustomization = resultData;
                }
            );
        }


        $scope.GetScalerOutputResolutionFriendlyName = function(internalName) {
            var res = "";
            $scope.ScalerOutputResolution4KTypeChoices.forEach(function(item) {

                if (item.Value == internalName)
                    res = item.Name;
            });
            return res;
        }


        $scope.GetScalerOutputResolutionTypeChoices = function() {
            DataService.GetScalerOutputResolutionTypeChoices().then(
                function(resultData) {
                    $scope.ScalerOutputResolutionTypeChoices = resultData;
                }
            );
        }



        $scope.GetScalerOutputResolution4KTypeChoices = function() {
            DataService.GetScalerOutputResolution4KTypeChoices().then(
                function(resultData) {
                    $scope.ScalerOutputResolution4KTypeChoices = resultData;
                }
            );
        }


        $scope.GetScalerOutputDisplayModeFriendlyName = function(internalName) {
            var res = "";
            $scope.ScalerOutputDisplayModeTypeChoices.forEach(function(item) {

                if (item.Value == internalName)
                    res = item.Name;
            });


            return res;
        }

        $scope.GetScalerOutputDisplayModeTypeChoices = function() {
            DataService.GetScalerOutputDisplayModeTypeChoices().then(
                function(resultData) {
                    $scope.ScalerOutputDisplayModeTypeChoices = resultData;
                }
            );
        }


        $scope.GetRelayConfig = function(roomId) {
            DataService.GetRelayConfig(roomId).then(
                 function(resultData) {
                     $scope.RelayConfig = resultData;
                 }
            );
        }

        $scope.GetInputsView = function(roomId) {
            DataService.GetInputsView(roomId).then(
                function(inputData) {

                    $scope.InputsView = inputData;
                    $scope.InputRanks = new Array(inputData.length);
//                    var tmp = [];
                    for (var x = 0; x < inputData.length; x++) {
                        $scope.InputRanks[x] = x + 1;

                        $scope.InputsView[x].Device = $scope.GetChannelAssocaitedWithAlternateDevice($scope.InputsView[x].Channel);
//                        if ($scope.InputsView[x].Device != null) {
//                            tmp.push($scope.InputsView[x].Device);

//                        }

                    }

                    // save me good ie of cross compare
                    //                    var newInputDevices = $linq.Enumerable().From($scope.InputDevices).Where(function(x)
                    //                    {
                    //                        var a = $linq.Enumerable().From(tmp).Where(function(y) {
                    //                        return y.DeviceId == x.DeviceId;
                    //                        }).Any();
                    //                        return !a;
                    //                    }).ToArray();
                    //                    $scope.InputDevices = newInputDevices;

                    if (($scope.CurrentPage == "CS3") && ($scope.InputEndpointDevices.length > 0))
                        $timeout($scope.UpdateInputState, 0);

                }
            );
        }


        $scope.GetChannelDeviceType = function(dtype) {
            var name = "";
            $scope.ChannelTypeChoices.forEach(
                function(typ) {
                    if (typ.Value == dtype)
                        name = typ.Name;
                }
            );
            return name.replace(/ /g, '\u00a0');
        }


        $scope.GetSwitchChannelStateChoiceFriendlyName = function(value) {
            var typ = $linq.Enumerable().From($scope.SwitchChannelStateChoices).Where(function(x) { return x.Value == value; }).FirstOrDefault();
            if (typ == null)
                return "";
            return typ.Name;
        }
        $scope.GetDeviceTypeFriendlyName = function(dtype) {

            //console.log("GetDeviceTypeFriendlyName " + dtype);
            var typ = $linq.Enumerable().From($scope.DeviceTypeChoices).Where(function(x) { return x.DeviceTypeEnum == dtype; }).FirstOrDefault();
            if (typ == null)
                return "";
            return typ.Name;
        }


        $scope.GetEnumName = function(choices, val) {

            //console.log("GetDeviceTypeFriendlyName " + dtype);
            var item = $linq.Enumerable().From($scope.choices).Where(function(x) { return x.Value == val; }).FirstOrDefault();
            if (item == null)
                return "";
            return item.Name;
        }

        $scope.GetBaudFriendlyName = function(val) {

            //console.log("GetDeviceTypeFriendlyName " + dtype);
            var item = $linq.Enumerable().From($scope.BaudRateChoices).Where(function(x) { return x.Value == val; }).FirstOrDefault();
            if (item == null)
                return "";
            return item.Name;
        }


        $scope.GetChannelTypeOptions = function() {

            DataService.GetChannelTypeOptions().then(
                function(resultData) {

                    $scope.ChannelTypeChoices = resultData;

                }
            );
        }

        $scope.GetOutputsView = function(roomId) {
            DataService.GetOutputsView(roomId).then(
                function(outputData) {

            $scope.OutputsView = outputData;



            if (($scope.CurrentPage == "CS3")&&($scope.OutEndpointDevices.length > 0 ))
                        $timeout($scope.UpdateOutputState, 0);

                }
            );
        }


        $scope.SaveInputOutputsView = function() {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {
                    DataService.SaveInputOutputsView($scope.OutputsView, $scope.InputsView).then
                    (
                        function(result) {
                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {

                                $scope.RefreshSwitchSettings();
                                $scope.ConfigInputsOutputs.$setPristine();
                                $scope.removeUnloadEvent();
                            }

                        }
                    );
                }, 10);
            });
        }


        $scope.UpdateOutputState = function() {
        
			$timeout(function() { $scope.AsyncUpdateChoices("outputView_EndPoint"); }, 0);
			$timeout(function() { $scope.AsyncUpdateChoices("outputView_AssocatedDeviceId"); }, 0);
        }


        $scope.UpdateInputState = function() {
            $timeout(function() { $scope.AsyncUpdateChoices("inputView_EndPoint"); }, 0);
            $timeout(function() { $scope.AsyncUpdateChoices("inputView_AssocatedDeviceId"); }, 0);
        }

        $scope.ContainsItem = function(arry, value) {
            var found = false;
            arry.forEach(function(item) {
                if (item === value) {
                    found = true;
                }
            }
            );
            return found;
        }

        $scope.IsChannelDisabled = function(state) {

            return SwitchChannelState.Disabled == state;
        }

        $scope.UpdateDefaults = function(channel) {


            var item = $linq.Enumerable().From($scope.InputsView).Where(function(x) { return x.Channel == channel; }).FirstOrDefault();
            if (item.State != SwitchChannelState.EnabledDefault)
                return;

            var tmp = $linq.Enumerable().From($scope.InputsView).Where(function(x) { return x.State == SwitchChannelState.EnabledDefault && x.Channel != channel; }).FirstOrDefault();
            if (tmp == null)
                return;
            tmp.State = SwitchChannelState.Enabled;

        }

        $scope.ResetChoices = function(idStartsWith) {
            $("select[id^='" + idStartsWith + "'] option").each(function() {


                var $thisOption = $(this);
                $thisOption.show();
                $thisOption.prop('disabled', false);
            }
            );
        }
        $scope.UpdateChoices = function(idStartsWith) {

            //console.log("oldEndpoint=" + oldEndpoint + " newEndpoint =" + newEndpoint);
            var used = [];

            $("select[id^='" + idStartsWith + "']").each(
                function() {
                    var val = $(this).find("option:selected").val(); ;
                    //console.log(val);
                    if ((val != null) && (val != "")) {
                        used.push(val);
                    }
                }
            );
            //console.log("used " + used.length);
            $("select[id^='" + idStartsWith + "'] option").each(function() {


                var $thisOption = $(this);
                $thisOption.show();
                $thisOption.prop('disabled', false);
                //console.log("val=" + val + " $thisOption.val() =" + $thisOption.val());
                if ($scope.ContainsItem(used, $thisOption.val())) {
                    //                                    console.log("Disable " + $thisOption.val());
                    $thisOption.hide();
                    $thisOption.prop('disabled', true);
                }

            }
            );
            return;

        }


        $scope.IsDm = function(val) {
            if ((val == null) || (val == ""))
                return false;
            return val.substring(0, 2) == "Dm";
        }

        $scope.ShowAddDevice = function(reset) {
            $scope.Editing = false;
            $scope.CurrentDeviceId = null;
            if (reset) {
                $scope.NewDevice = {};
                $scope.NewDevice.OccupancySensorDetails = {};

                $scope.FilteredDevices = [];

                $scope.ResetEntries();
            }

            $scope.ShowCenteredModal('AddDeviceDialog');

        }

        $scope.ConfigureButtonsClosed = function() {
            if ($scope.Editing)
                $scope.ShowCenteredModal('EditDeviceDialog');
            else
                $scope.ShowCenteredModal('AddDeviceDialog');
        }
        $scope.ShowConfigButtonDialog = function() {

            $scope.$broadcast('ShowConfigureButtons', true);
            $scope.CloseModal('AddDeviceDialog');
            $scope.CloseModal('EditDeviceDialog');
        }

        $scope.CloseConfigButtonDialog = function() {
            $scope.CloseModal('ConfigButtonDialog');
        }

        $scope.ShowCallOptions = function() {
            $scope.ShowCenteredModal('CallOptionsDialog');
        }

        $scope.ShowFusionOptions = function() {
            $scope.ShowCenteredModal('FusionSettingsDialog');
        }


        $scope.ShowCenteredModal = function(id, marginTop) {


            var mTop = marginTop;
            if (marginTop === undefined)
                mTop = -100;
            $("#" + id).modal('show').css({
                'margin-top': function() { //vertical

                    return mTop;
                    //return ($(this).height() / 10);
                },
                'margin-left': function() { //Horizontal centering

                    return (($(window).width() - $(this).width()) / 2);
                }
            });
            $("#" + id).modal({ keyboard: true });
        }

        $scope.Editing = false;
        $scope.ShowEditDevice = function(deviceId) {
            $scope.Editing = true;
            $scope.LoadEditDevice(deviceId);
            $scope.ShowCenteredModal('EditDeviceDialog');
        }

        $scope.Config = {};

        $scope.ResetEditUI = function() {

            $scope.ShowDeviceIpEntry = false;
            $scope.ShowDeviceIpPortEntry = false;
            $scope.ShowDevicePortEntry = false;
            $scope.ShowDeviceSerialBaudEntry = false;
            $scope.ShowCustomSerial = false;
            $scope.ShowDeviceChannelEntry = false;
            $scope.ShowDeviceIpIdEntry = false;
            $scope.ShowDeviceDmEntry = false;
            $scope.ShowCrestnetEntry = false;
            $scope.ShowAdvancedButtonConfigButton = false;
            $scope.ShowPrimarySecondaryInputChannelNumber = false;
            $scope.ShowUnionId = false;
            $scope.ShowUsername = false;
            $scope.Testable = false;
            $scope.Installable= false;

        }

        $scope.FormatHexId = function(val) {
            if (val.length == 1)
                return "0" + val;
            return val;

        }

        $scope.EditingDeviceId;
        $scope.LoadEditDevice = function(deviceId) {


            $scope.ResetEditUI();
            $scope.CurrentDeviceId = deviceId;


            $scope.OldDeviceSettings = $linq.Enumerable().From($scope.Devices).Where(function(x) { return x.DeviceId == deviceId; }).FirstOrDefault();
            if ($scope.OldDeviceSettings == null)
                return; /// should never happen

            $scope.Rows = 0;
            $scope.Columns = 0;
            $scope.ShowAdvancedButtonConfigButton = false;
            $scope.AvailableActions = null;
            $scope.ButtonConfiguration = [];

            $scope.ShowDisplayDefaultInput = false;
            $scope.EditDevice = angular.copy($scope.OldDeviceSettings); // prevent dup binding
            $scope.IsCurrentDevice4K = $scope.EditDevice.Is4K;
            $scope.Config.EditDeviceForm.$setPristine();
            $scope.removeUnloadEvent();
            //$scope.ShowDeviceDmEntry = $scope.EditDevice.IsEndpoint;
            $scope.ShowWarmupEntry = false;
            $scope.ShowCoolDownEntry = false;
            if ($scope.EditDevice.AllowWarmUpTimeEdit) {
                $scope.ShowWarmupEntry = true;
                $scope.MinimumWarmUpTime = $scope.EditDevice.MinimumWarmUpTime;
                $scope.MaximumWarmUpTime = $scope.EditDevice.MaximumWarmUpTime;
                $scope.NewDevice.WarmUpTime = $scope.EditDevice.MinimumWarmUpTime;
                $scope.WarmUpTimeValidationMessage = JavaScriptConstants.WarmUpTimeValidationMessage.replace("{0}", $scope.EditDevice.MinimumWarmUpTime).replace("{1}", $scope.EditDevice.MaximumWarmUpTime);
            }

            if ($scope.EditDevice.AllowCoolDownTimeEdit) {
                $scope.MinimumCoolDownTime = $scope.EditDevice.MinimumCoolDownTime;
                $scope.MaximumCoolDownTime = $scope.EditDevice.MaximumCoolDownTime;
                $scope.NewDevice.CoolDownTime = $scope.EditDevice.MinimumCoolDownTime;
                $scope.ShowCoolDownEntry = true;
                $scope.CoolDownTimeValidationMessage = JavaScriptConstants.CoolDownTimeValidationMessage.replace("{0}", $scope.EditDevice.MinimumCoolDownTime).replace("{1}", $scope.EditDevice.MaximumCoolDownTime);
            }


            $scope.EditDevice.ScalerResolution = $scope.EditDevice.ScalerResolution;
            $scope.FilterPorts($scope.EditDevice.TransportEnum, true);


            if ($scope.EditDevice.IsCableCaddy)
                $scope.ShowPrimarySecondaryInputChannelNumber = true;

            console.log("$scope.EditDevice.TransportEnum == " + $scope.EditDevice.TransportEnum);


            if (($scope.EditDevice.DeviceTypeEnum == DeviceType.AvDisplay)
                || ($scope.EditDevice.DeviceTypeEnum == DeviceType.Projector))
                if ($scope.EditDevice.TransportEnum != DeviceTransport.None) {
                $scope.ShowDisplayDefaultInput = true;

                if ($scope.EditDevice.DriverId != null) {
                    var tmpArray = [];
                    $scope.SupportedDevices.forEach(function(item) {
                        tmpArray = tmpArray.concat(item.GroupDeviceDetails);
                    });
                    var supportDevice = $linq.Enumerable().From(tmpArray).Where(function(x) { return x.DriverId && x.DriverId.toUpperCase() === $scope.EditDevice.DriverId.toUpperCase(); }).FirstOrDefault();
                    if (supportDevice != null)
                        $scope.InputConnections = supportDevice.InputConnections;
                }
            }

            switch ($scope.EditDevice.TransportEnum) {

                case DeviceTransport.CrestronCrestnet:
                    $scope.ShowCrestnetEntry = true;
                    break;

                case DeviceTransport.CrestronIpId:
                    if (!(($scope.EditDevice.DeviceTypeEnum == DeviceType.Switcher) && ($scope.EditDevice.IsRequired)))
                        if ($scope.EditDevice.IpId.length == 1)
                        $scope.EditDevice.IpId = "0" + $scope.EditDevice.IpId;
                    $scope.ShowDeviceIpIdEntry = true;
                    break;

                case DeviceTransport.Ip:
                case DeviceTransport.CrestronIp:
                    $scope.ShowDeviceIpEntry = true;
                    break;

                case DeviceTransport.IpPort:
                case DeviceTransport.CrestronIpPort:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceIpPortEntry = true;
                    break;

                case DeviceTransport.IpPortChannel:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    $scope.ShowDeviceIpPortEntry = true;
                    break;

                case DeviceTransport.IpChannel:
                    $scope.ShowDeviceIpEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    break;


                case DeviceTransport.SerialBaud:
                    $scope.ShowDevicePortEntry = true;
                    $scope.ShowDeviceSerialBaudEntry = true;
                    break;
                case DeviceTransport.SerialBaudChannel:
                    $scope.ShowDevicePortEntry = true;
                    $scope.ShowDeviceSerialBaudEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    break;
                case DeviceTransport.SerialBaudCustom:
                    $scope.ShowDevicePortEntry = true;
                    $scope.ShowDeviceSerialBaudEntry = true;
                    $scope.ShowCustomSerial = true;
                    break;
                case DeviceTransport.SerialChannel:
                    $scope.ShowDevicePortEntry = true;
                    $scope.ShowDeviceChannelEntry = true;
                    break;

                case DeviceTransport.CrestronUsb:
                case DeviceTransport.Cec:
                case DeviceTransport.Ir:
                case DeviceTransport.Serial:
                    $scope.ShowDevicePortEntry = true;
                    break;


            }

            var supportedDevice = $scope.GetDevice($scope.EditDevice.Model);
            var supportedDeviceDetail = $scope.GetDeviceDetail($scope.EditDevice.Model, $scope.EditDevice.TransportEnum);

            if (supportedDeviceDetail != null) {
                if (supportedDeviceDetail.UnionIdRequired) {
                    $scope.EditDevice.UnionId = "******";
                    $scope.ShowUnionId = true;
                }

                if (supportedDeviceDetail.UsernameRequired)
                    $scope.ShowUsername = true;                
            }

            
            if (supportedDevice != null) {
                
                if ($scope.EditDevice.DeviceTypeEnum == DeviceType.ButtonPanel) {

                    $scope.AvailableActions = supportedDevice.ButtonConfig.AvailableActions;
                    $scope.Rows = supportedDevice.ButtonConfig.Rows;
                    $scope.Columns = supportedDevice.ButtonConfig.Cols;
                    $scope.ButtonConfiguration = new Array();
                    for (var i = 0; i < $scope.Rows; i++) {
                        $scope.ButtonConfiguration[i] = new Array();
                        for (var j = 0; j < $scope.Columns; j++) {
                            var act = { Name: supportedDevice.ButtonConfig.AvailableActions[0].Name, Value: supportedDevice.ButtonConfig.AvailableActions[0].Value };
                            if ($scope.EditDevice.ButtonConfig != null)
                                act = $linq.Enumerable().From(supportedDevice.ButtonConfig.AvailableActions).Where(function(item) { return item.Value == $scope.EditDevice.ButtonConfig.Buttons[i][j]; }).FirstOrDefault() || act;
                            $scope.ButtonConfiguration[i][j] = act;
                        }
                    }
                    $scope.ShowAdvancedButtonConfigButton = true;
                }
                if (supportedDevice.Installable)
                    $scope.Installable = true;

            }


        }

        $scope.GetDevicePortConflict = function(deviceId) {


            var device = $linq.Enumerable().From($scope.Devices).Where(function(x) { return x.DeviceId == deviceId; }).FirstOrDefault();
            if (device == null)
                return [];
            if (!device.IsEndpoint)
                return [];

            var effectedPorts = $linq.Enumerable().From($scope.Ports).Where(function(x) { return (x.DeviceId == deviceId); }).ToArray();
            var effectedDevices = [];
            effectedPorts.forEach(function(item) {
                var tmp = $linq.Enumerable().From($scope.Devices).Where(function(x) { return (x.CecPortId == item.PortId) || (x.IrPortId == item.PortId) || (x.ComPortId == item.PortId); }).FirstOrDefault();
                if (tmp != null)
                    effectedDevices.push(tmp);
            });
            return effectedDevices;

        }

        $scope.CloseModal = function(id) {
            $('#' + id).modal('hide');
        }


        $scope.CloseAddDevice = function() {
            $scope.CloseModal('AddDeviceDialog');
        }


        $scope.CloseEditDevice = function() {
            $scope.CloseModal('EditDeviceDialog');
        }

        $scope.GetTransportTypeOptions = function() {
            DataService.GetTransportTypeOptions().then(
                function(resultData) {

                    $scope.TransportTypeOptions = resultData;

                }
            );
        }


        $scope.SystemDirty = function() {


            return $scope.Config.SystemSettingsForm.AvfConfig_Locale.$dirty ||
                $scope.Config.SystemSettingsForm.AvfConfig_Use24HrClock.$dirty ||
                $scope.Config.SystemSettingsForm.AvfConfig_DateFormatEnum.$dirty;
        }


        $scope.RoomDirty = function() {

            if ((($scope.Config.SystemSettingsForm.RoomDetails_RoomName != null)) && ($scope.Config.SystemSettingsForm.RoomDetails_RoomName.$dirty))
                return true;
            if ((($scope.Config.SystemSettingsForm.RoomDetails_EnableDspVolume != null)) && ($scope.Config.SystemSettingsForm.RoomDetails_EnableDspVolume.$dirty))
                return true;
            if ((($scope.Config.SystemSettingsForm.RoomDetails_EnableMics != null)) && ($scope.Config.SystemSettingsForm.RoomDetails_EnableMics.$dirty))
                return true;
            if ($scope.Config.SystemSettingsForm.RoomDetails_StandbyMode != null) {
                if ($scope.Config.SystemSettingsForm.RoomDetails_StandbyMode.$dirty)
                    return true;
            }
            return false;

        }


        $scope.RefreshSystemPage = function() {

            $window.location.reload();
        }

        $scope.SaveQ = [];
        $scope.SaveIndex = 0;

        $scope.SaveAvfConfig = function() {

            var requiresReboot = false;
            $scope.SaveIndex = 0;
            $scope.SaveQ = [];
            if ($scope.SystemDirty()) {
                requiresReboot = true;
                $scope.SaveQ.push($scope.SaveSystemConfig);
            }


            if ($scope.RoomDirty()) {
                requiresReboot = true;
                $scope.SaveQ.push($scope.SaveRoomConfig);
            }


            if (($scope.Config.SystemSettingsForm.DeviceDateTime != null) && ($scope.Config.SystemSettingsForm.DeviceDateTime.$dirty))
                $scope.SaveQ.push($scope.SetDeviceDateTime);

            if (($scope.Config.SystemSettingsForm.DeviceTimeZone != null) && ($scope.Config.SystemSettingsForm.DeviceTimeZone.$dirty))
                $scope.SaveQ.push($scope.SetDeviceTimeZone);

            if (
                (($scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Enabled != null) && ($scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Enabled.$dirty))
                    ||
                    (($scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Address != null) && ($scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Address.$dirty))
            )
                $scope.SaveQ.push($scope.SetSntpSettings);


            if (requiresReboot) {
                $scope.AskSystemConfiguredIfNeeded(function() {
                    $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                    $timeout(function() { $scope.SaveQ[$scope.SaveIndex](); }, 10);
                });
            } else {
                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() { $scope.SaveQ[$scope.SaveIndex](); }, 10);


            }


        }
        $scope.SaveSystemConfig = function() {

            DataService.SaveSystemConfig($scope.AvfConfig).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.SaveIndex++;
                        if ($scope.SaveIndex == $scope.SaveQ.length) {

                            var resfresh = $scope.Config.SystemSettingsForm.AvfConfig_Locale.$dirty || $scope.Config.SystemSettingsForm.AvfConfig_Use24HrClock.$dirty;
                            $scope.Config.SystemSettingsForm.$setPristine();
                            MessageService.HideBusy();
                            if (resfresh) {
                                $scope.removeUnloadEvent();
                                $scope.RefreshSystemPage();

                            }

                        } else {
                            $scope.SaveQ[$scope.SaveIndex]();
                        }


                    }
                }
            );
        }


        $scope.SaveRoomConfig = function() {
            DataService.SaveRoomConfig($scope.RoomDetails).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        $scope.SaveIndex++;
                        if ($scope.SaveIndex == $scope.SaveQ.length) {
                            $scope.Config.SystemSettingsForm.$setPristine();
                            $scope.removeUnloadEvent();
                            MessageService.HideBusy();
                        } else {
                            $scope.SaveQ[$scope.SaveIndex]();
                        }

                    }
                }
            );

        }


        $scope.SaveEditDevice = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {

                if ($scope.EditDevice.CableCaddy != null) {
                    if ($scope.EditDevice.CableCaddy.SecondaryInputChannelNumber == null)
                        $scope.EditDevice.CableCaddy.SecondaryInputChannelNumber = 0;
                    if ($scope.EditDevice.CableCaddy.PrimaryInputChannelNumber == null)
                        $scope.EditDevice.CableCaddy.PrimaryInputChannelNumber = 0;
                }
                $scope.CloseEditDevice();
                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                if ($scope.EditDevice.DeviceTypeEnum == DeviceType.ButtonPanel) {
                    $scope.EditDevice.ButtonConfig.Buttons = $scope.ButtonConfiguration.map(function(item) { return item.map(function(element) { return element.Value; }); });
                }

                if (($scope.Config.EditDeviceForm != null) && ($scope.Config.EditDeviceForm.EditDevice_UnionId != null))
                    if (!$scope.Config.EditDeviceForm.EditDevice_UnionId.$dirty)
                    $scope.EditDevice.UnionId = "";
                else
                    $scope.EditDevice.UnionId = btoa($scope.EditDevice.UnionId); ;

                $scope.devicetitle = $scope.EditDevice.DisplayName;


                $timeout(function() {

                    DataService.SaveEditDevice($scope.EditDevice, roomId).then
                    (
                        function(result) {
                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {

                                if ($scope.Installable)
                                    $scope.ShowDeviceInstall();
                                else
                                    $scope.CompleteEditDeviceWorkflow(roomId);


                            }
                        }
                    );
                }, 10);

            });


        }


        $scope.CompleteEditDeviceWorkflow = function(roomId) {
            if ($scope.InputsView.length > 0)
                $scope.GetAssociatedChannelDevices(roomId);
            $scope.Refresh();

            $scope.Config.EditDeviceForm.$setPristine();
            $scope.removeUnloadEvent();
        }
        $scope.ShowDeviceInstall = function() {
            $scope.statusmode = Const.DeviceStatusMode.Install;
            $timeout(function() {
                $scope.$broadcast(Subscriptions.ShowDeviceStatusDialog, true);
                $scope.CloseModal(Const.Dialogs.AddDeviceDialog);
                $scope.CloseModal(Const.Dialogs.EditDeviceDialog);
            }, 0);
        }


        $scope.ShowTestDevice = function(deviceid, devicetitle) {
            $scope.statusmode = Const.DeviceStatusMode.Test;
            $scope.devicetitle = devicetitle;
            $scope.CurrentDeviceId = deviceid;

            $timeout(function() {
                $scope.$broadcast(Subscriptions.ShowDeviceStatusDialog, true);
                $scope.CloseModal(Const.Dialogs.AddDeviceDialog);
                $scope.CloseModal(Const.Dialogs.EditDeviceDialog);
            }, 0);

        }

        $scope.devicetitle = "";
        $scope.SaveNewDevice = function(roomId) {
            $scope.AskSystemConfiguredIfNeeded(
                function() {
                    $scope.CloseAddDevice();
                    $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                    if ($scope.NewDevice.DeviceType == DeviceType.ButtonPanel)
                        $scope.NewDevice.ButtonConfiguration = $scope.ButtonConfiguration.map(function(item) { return item.map(function(element) { return element.Value; }); });
                    if ($scope.NewDevice.UnionId != null)
                        $scope.NewDevice.UnionId = btoa($scope.NewDevice.UnionId);
                    $scope.devicetitle = $scope.NewDevice.DisplayName;

                    $timeout(function() {

                        DataService.SaveNewDevice($scope.NewDevice, roomId).then
                        (
                            function(result) {
                                MessageService.HideBusy();
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                } else {

                                    if ($scope.Installable)
                                        $scope.ShowDeviceInstall();
                                    else
                                        $scope.CompleteNewDeviceWorkflow();
                                }
                            }
                        );

                    }, 10);
                }
            );


        }

        $scope.CompleteNewDeviceWorkflow = function() {
            $scope.FilteredDevices = [];
            $scope.Refresh();

            $scope.Config.ConfigDeviceForm.$setPristine();
            if (($scope.NewDevice.DeviceType == DeviceType.Projector) || ($scope.NewDevice.DeviceType == DeviceType.AvDisplay)) {
                if ($scope.NewDevice.ControlType == DeviceTransport.CrestronIpId)
                    $scope.ShowCrestronConnectedMessage();
                if ($scope.NewDevice.ControlType == DeviceTransport.Cec)
                    $scope.ShowCECMessage();
            }
        }
        $scope.AskConfirmDelete = function(roomId, deviceId) {

            $scope.AskSystemConfiguredIfNeeded(
                function() {
                    MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.DeleteDeviceWarning, Alert.Warning,
                        function() {
                            var devices = $scope.GetDevicePortConflict(deviceId);
                            if (devices.length == 0) {
                                $scope.DeleteDevice(roomId, deviceId);
                            } else {
                                var deviceMessages = "";
                                var first = true;
                                devices.forEach(function(item) {
                                    if (first) {
                                        first = false;
                                        deviceMessages += item.DisplayName;
                                    } else {
                                        deviceMessages += "\n" + item.DisplayName;
                                    }

                                });
                                $timeout(function() { MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.DeleteDevicePortWarning.replace("{0}", deviceMessages), Alert.Warning, function() { $scope.DeleteDevice(roomId, deviceId); }); }, 500);

                            }
                        }
                    );

                });
        }


        $scope.DeleteDevice = function(roomId, deviceId) {
            $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
            DataService.DeleteDevice(roomId, deviceId).then
            (
                function(result) {
                    MessageService.HideBusy();
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.Refresh();
                    }
                }
            );

        }


        $scope.verify = function(view) {
            if (view.Model == "") {
                MessageService.ShowMessage(JavaScriptConstants.Notice, JavaScriptConstants.SpecifyDeviceWarning, Alert.Info);
                return false;
            }

            if ((view.Model == "UnControlled") || (view.Model == "Disabled")) {
                MessageService.ShowMessage(JavaScriptConstants.Notice, JavaScriptConstants.UnControlledNotConfigurable, Alert.Info);
                return false;
            }
            return true;
        }

        $scope.ShowConfigureDialog = function() {
            $("#ConfigDetailsDialog").modal('show').css({
                'margin-top': function() { //vertical centering

                    return ($(this).height() / 3);
                },
                'margin-left': function() { //Horizontal centering


                    return ($(this).width());
                }
            });
            $('#ConfigDetailsDialog').modal();
        }


        $scope.CloseConfig = function() {
            $('#ConfigDetailsDialog').modal('hide');
        }

        $scope.FilteredControlTypes = [];
        $scope.ShowFilteredControlTypes = false;
        $scope.ShowConfigIr = false;


        $scope.ShowDeviceIrPortEntry = false;
        $scope.Ports = [];

        $scope.GetTransportName = function(transport) {

            var res = '';

            $scope.TransportTypeOptions.forEach(function(item) {
                if (item.Value == transport)
                    res = item.Name;

            });
            return res;
        }

        $scope.GetPorts = function(roomId) {
            DataService.GetPorts(roomId).then(function(result) {
                $scope.Ports = result;
                var tmp = [];
                result.forEach(function(item) {
                    if (item.Type == PortType.Relay) { tmp.push(item); }
                });
                $scope.RelayPorts = tmp;
                if  ( ($scope.RelayPorts.length > 0) && ($scope.CurrentPage == "CS1") )
                    $timeout(function() { $scope.AsyncUpdateChoices('relayConfig.RelayPortId'); }, 0);
                    

            });
        }

        $scope.GetValLength = function(idStartsWith) {
            var used = [];

            $("select[id^='" + idStartsWith + "']").each(
                function() {
                    var val = $(this).find("option:selected").val(); ;
                    if ((val != null) && (val != "")) {
                        used.push(val);
                    }
                }
            );
            return used.length;
        }


        $scope.AsyncUpdateChoices = function(idStartsWidth) {
            console.log("Calling " + idStartsWidth);
            $scope.ActualAsyncUpdateChoices(idStartsWidth);
        }
        $scope.ActualAsyncUpdateChoices = function(idStartsWidth) {

            var len = $scope.GetValLength(idStartsWidth);
            console.log("AsyncUpdateChoices " + idStartsWidth + " len== " + len);
            if (len > 0) {
                $scope.UpdateChoices(idStartsWidth);
                return;
            }
            var x = 0;
            var timer = setInterval(function() {
                len = $scope.GetValLength(idStartsWidth); ;
                console.log("AsyncUpdateChoices " + idStartsWidth + " tried=" + x + " len=" + len);
                if (len > 0) {
                    $scope.UpdateChoices(idStartsWidth);
                    clearTimeout(timer);
                }
                x++;
                if (x > 10) {
                    $scope.UpdateChoices(idStartsWidth);
                    clearTimeout(timer);
                }

            }, 500);
        }
		
      
        $scope.GetSwitchChannelStateChoices = function() {

            DataService.GetSwitchChannelStateChoices().then(function(result) {

                $scope.SwitchChannelStateChoices = result;

            });
        }

        $scope.GetSchedulingTypeChoices = function() {

            DataService.GetSchedulingTypeChoices().then(function(result) {


                $scope.SchedulingTypeChoices = result;

            });
        }

        $scope.GetBaudRateChoices = function() {

            DataService.GetBaudRateChoices().then(function(result) {

                $scope.BaudRateChoices = result;

            });
        }

        $scope.DateFormatChoices = [];
        $scope.GetDateFormatChoices = function() {
            DataService.GetDateFormatChoices().then(function(result) {
                $scope.DateFormatChoices = result;
            });
        }


        $scope.AvfConfig = {};
        $scope.GetAvfConfig = function(roomId) {

            DataService.GetAvfConfig(roomId).then(function(result) {
                $scope.AvfConfig = result;
                $scope.AvfConfig.Rooms.forEach(function(item) {
                    if (item.RoomId == roomId) {
                        $scope.RoomDetails = item;
                        $scope.FusionConfig = item.Fusion;
                        $scope.FusionConfigOldIpId = $scope.FusionConfig.IpId;
                        $scope.OldFusionConfig = angular.copy($scope.FusionConfig);
                        $scope.DialerConfig = item.Dialer;
                        $scope.LightingConfig = item.Lighting;

                        if (item.Dialer.Enable)
                            $scope.DialerEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.DialerEnableText = JavaScriptConstants.Enable;


                        if (item.Fusion.Enable) {
                            $scope.FusionEnableText = JavaScriptConstants.Disable;

                        } else {
                            $scope.FusionEnableText = JavaScriptConstants.Enable;

                        }


                        if (item.SchedulingSettings.Enable)
                            $scope.ScheduleEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.ScheduleEnableText = JavaScriptConstants.Enable;


                        if (item.Fusion.EnableCloud)
                            $scope.FusionCloudUrlEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.FusionCloudUrlEnableText = JavaScriptConstants.Enable;


                        if (item.Relay.Enable)
                            $scope.RelayEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.RelayEnableText = JavaScriptConstants.Enable;

                        if (item.Lighting.Enable)
                            $scope.LightingEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.LightingEnableText = JavaScriptConstants.Enable;

                    }

                });
            });
        }

        // unused now maybe remove                
        $scope.RoomDetails = {};
        $scope.GetRoomDetails = function(roomId) {

            DataService.GetRoomDetails(roomId).then(function(result) {

                $scope.RoomDetails = result[0];

            });
        }


        $scope.AssociatedChannelDevices = {};
        $scope.GetAssociatedChannelDevices = function(roomId) {

            DataService.GetAssociatedChannelDevices(roomId).then(function(result) {

                $scope.AssociatedChannelDevices = result;

            });
        }


        $scope.MoveToAsk = function(title, question, url, frm) {
            if (frm.$dirty)
                MessageService.ShowConfirm(title, question, function() { location.href = url; });
            else
                location.href = url;

        }


        $scope.addUnloadEvent = function() {

            console.log("addUnloadEvent");

            if (window.addEventListener) {
                window.addEventListener("beforeunload", handleUnloadEvent);
            } else {
                window.attachEvent("onbeforeunload", handleUnloadEvent);
            }
        }

        $scope.GetUsedIpIds = function(roomId) {

            DataService.GetUsedIpIds(roomId).then(
                function(result) {
                    $scope.UsedIpIds = result;
                }
            );
        }

        //        $scope.CallIsIpIdIAlreadyInUse  = function(ipId, currentIpId) {
        //            
        //            $scope.IsIpIdIAlreadyInUse(ipId, currentIpId);
        //        }
        //        
        $scope.IsIpIdIAlreadyInUse = function(ipId, currentIpId) {

            //console.log("IpId = " + ipId + " " + "old=" + currentIpId);
            var parsedipId = parseInt("" + ipId, 16);
            if (isNaN(parsedipId))
                return false;
            var tmp = $scope.UsedIpIds;
            if (currentIpId != null) {

                if (typeof (currentIpId) == "string") {
                    var parsedcurrentIpId = parseInt(currentIpId + "", 16);
                    tmp = $linq.Enumerable().From($scope.UsedIpIds).Where(function(x) { return x != parsedcurrentIpId; }).ToArray();
                } else {
                    tmp = $linq.Enumerable().From($scope.UsedIpIds).Where(function(x) { return x != currentIpId; }).ToArray();
                }

            }
            return $linq.Enumerable().From(tmp).Where(function(x) { return x == parsedipId; }).Any();
        }

        $scope.CrestnetIdIsNotValid = function(crestnetId, currentCrestnetId) {
            //console.log("$scope.CrestnetIdIsNotValid  " + crestnetId + " " + currentCrestnetId);
            var parsedCrestnetId = parseInt("" + crestnetId, 16);
            var tmp = $scope.UsedCrestnetIds;
            if (currentCrestnetId != null) {
                var parsedCurrentCrestnetId = parseInt(currentCrestnetId + "", 16);
                tmp = $linq.Enumerable().From($scope.UsedCrestnetIds).Where(function(x) { return x != parsedCurrentCrestnetId; }).ToArray();
            }

            return $linq.Enumerable().From(tmp).Where(function(x) { return x == parsedCrestnetId; }).Any();
        }




        $scope.$on(Subscriptions.StartCheckingForServerOnline, function() {
            $scope.StartCheckingForServerOnline();
        });

        $scope.ServerOnlineListener = null;
        $scope.StartCheckingForServerOnline = function() {
            $scope.ServerOnlineListener = $scope.$on(Subscriptions.ServerOnline, function() {
                console.log("ConfigController ServerOnline");
                OnlineOfflineService.StopCheckingForServerOnline();
                $timeout(function() {
                    MessageService.HideBusy();

                    $window.location.reload(true);
                }, Const.ForwardToLoginAfterResetDelay);


            });
            OnlineOfflineService.StartCheckingForServerOnline();
        }

        $scope.StopCheckingForServerOnline = function() {
            if ($scope.ServerOnlineListener != null)
                $scope.ServerOnlineListener();

            OnlineOfflineService.StopCheckingForServerOnline();
        }

        $scope.$watch("ConfigDeviceForm.IpId.$dirty", function(newValue) {

            if ($scope.ContainsItem($scope.UsedIpIds, newValue)) {
                //console.log("newValue=" + newValue);
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.AlreadyInUse.replace('{0}', newValue), Alert.Error);

            }
        });

        $scope.$watch("ConfigDeviceForm.$dirty", function(newValue) {


            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        $scope.$watch("Config.RelaySettingsForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        $scope.$watch("Config.DialerSettingsForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });

        $scope.$watch("Config.EditDeviceForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });
        $scope.$watch("Config.PresentationScreenCustomizationForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });
        $scope.$watch("Config.RoomScheduleScreenCustomizationForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });
        $scope.$watch("Config.SchedulingSettingsForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });
        $scope.$watch("Config.UxGeneralCustomizationForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        $scope.$watch("Config.ScheduleConfigForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });

        $scope.$watch("Config.FusionConfigForm.$dirty", function(newValue) {

            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });

        $scope.$watch("Config.SystemSettingsForm.$dirty", function(newValue) {
            //console.log("Config.SystemSettingsForm.$dirty " + newValue);
            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        $scope.$watch("Config.ConfigInputsOutputs.$dirty", function(newValue) {


            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        $scope.$watch("Config.LightingSettingsForm.$dirty", function(newValue) {


            if (newValue)
                $scope.addUnloadEvent();
            else
                $scope.removeUnloadEvent();

        });


        function handleUnloadEvent(event) {

            //nope
            console.log("handleUnloadEvent");

            var dirty = false;

            if ($scope.Config.ScheduleConfigForm != null)
                dirty = dirty || $scope.Config.ScheduleConfigForm.$dirty;


            if ($scope.Config.ConfigDeviceForm != null)
                dirty = dirty || $scope.Config.ConfigDeviceForm.$dirty;

            if ($scope.ConfigInputsOutputs != null)
                dirty = dirty || $scope.ConfigInputsOutputs.$dirty;

            if ($scope.Config.SystemSettingsForm != null)
                dirty = dirty || $scope.Config.SystemSettingsForm.$dirty;


            if ($scope.Config.FusionConfigForm != null)
                dirty = dirty || $scope.Config.FusionConfigForm.$dirty;

            if ($scope.Config.RelaySettingsForm != null)
                dirty = dirty || $scope.Config.RelaySettingsForm.$dirty;

            if ($scope.Config.DialerSettingsForm != null)
                dirty = dirty || $scope.Config.DialerSettingsForm.$dirty;

            if ($scope.Config.RoomScheduleScreenCustomizationForm != null)
                dirty = dirty || $scope.Config.RoomScheduleScreenCustomizationForm.$dirty;

            if ($scope.Config.LightingSettingsForm != null)
                dirty = dirty || $scope.Config.LightingSettingsForm.$dirty;


            if ($scope.Config.EditDeviceForm != null)
                dirty = dirty || $scope.Config.EditDeviceForm.$dirty;

            if ($scope.Config.PresentationScreenCustomizationForm != null)
                dirty = dirty || $scope.Config.PresentationScreenCustomizationForm.$dirty;

            if ($scope.Config.SchedulingSettingsForm != null)
                dirty = dirty || $scope.Config.SchedulingSettingsForm.$dirty;

            if ($scope.Config.UxGeneralCustomizationForm != null)
                dirty = dirty || $scope.Config.UxGeneralCustomizationForm.$dirty;


            if (dirty) {
                event.returnValue = JavaScriptConstants.UnSavedChangesWarning;
            } else {
                $scope.removeUnloadEvent();
                event.preventDefault();

                return false;
            }

        };


        $scope.removeUnloadEvent = function() {
            console.log("removeUnloadEvent");
            if (window.removeEventListener) {
                window.removeEventListener("beforeunload", handleUnloadEvent);
            } else {
                window.detachEvent("onbeforeunload", handleUnloadEvent);
            }
        }

        $scope.GetFileToUpload = function() {
            $('#fileToUpload').click();
        }

        $scope.ConfigUpload = {};

        $scope.AskSendConfigFile = function() {
            var file = document.getElementById('fileToUpload').files[0];
            var ext = file.name.split('.').pop().toUpperCase();
            if (file.size > MaxConfigUploadSize) {
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.FileLargeError, Alert.Error);
                return;
            }

            if (ext != ConfigExtension) {
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.IncorrectFileExtensionError, Alert.Error);
                return;
            }

            var warning = JavaScriptConstants.UploadConfigWarning.replace('{0}', file.name);
            MessageService.ShowConfirm(JavaScriptConstants.Warning, warning, Alert.Warning, function() { $scope.SendConfigFile(); });
        }

        $scope.SendConfigFile = function() {

            MessageService.ShowBusy(JavaScriptConstants.UploadBusyMessage);
            $('#UploadConfigForm').submit();
        }

        $scope.SendFileDriver = function() {


            var file = document.getElementById('fileToUpload').files[0];

            var ext = file.name.split('.').pop().toUpperCase();

            if (file.size > MaxDriverUploadSize) {
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.FileLargeError, Alert.Error);
                return;
            }
            $('#UploadConfigForm').submit();
        }

        $scope.SendFileCert = function() {


            var file = document.getElementById('fileToUpload').files[0];

            var ext = file.name.split('.').pop().toUpperCase();

            if (file.size > MaxCertUploadSize) {
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.FileLargeError, Alert.Error);
                return;
            }


            //            if (ext != ConfigExtension) {
            //                MessageService.ShowNotificationWarning(JavaScriptConstants.Error, JavaScriptConstants.IncorrectFileExtensionError, Alert.Error);
            //                return;
            //            }
            $('#UploadConfigForm').submit();

        }


        $scope.ShowDriverUpdatedComplete = function() {
            $timeout(function() {
                MessageService.ShowMessage(JavaScriptConstants.Success, JavaScriptConstants.DriverUploadComplete, Alert.Sucess, "");

            }, Const.ShowCompleteDelay);
        }


        // ShowResult
        $scope.Forward = function() {

            $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
            setTimeout(function() {
                MessageService.ShowMessage(JavaScriptConstants.DriverUploadCompleteHeader, JavaScriptConstants.DriverUploadComplete, Alert.Sucess);
            }, Const.BusyFlashTime);
            var url = document.location.toString();
            if (url.match('#!#')) {
                var tab = url.split('#!#')[1].replace('/', '');
                setTimeout(function() {
                    document.location.href = 'ConfigStep1.html#!#' + tab;
                }, Const.DisplayDriverMessageTime);

            }
        }

        $scope.ForwardWithError = function() {

            $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
            setTimeout(function() {
                MessageService.ShowMessage(JavaScriptConstants.DriverSaveProblemWarningHeader, JavaScriptConstants.DriverSaveProblemWarning, Alert.Error);
            }, Const.BusyFlashTime);


            var url = document.location.toString();
            if (url.match('#!#')) {
                var tab = url.split('#!#')[1].replace('/', '');
                setTimeout(function() {
                    document.location.href = 'ConfigStep1.html#!#' + tab;
                }, Const.DisplayDriverMessageTime);

            }
        }


        $scope.ShowComplete = function() {
            $timeout($scope.ActualShowComplete, Const.ShowCompleteDelay);
        }


        $scope.countDown = Const.CountUpdateDownSeconds;
        $scope.countDownInterval = null;
        $scope.ActualShowComplete = function(msg) {
            if (msg == null)
                MessageService.ShowMessage(JavaScriptConstants.Success, JavaScriptConstants.CofigurationUpdated, Alert.Sucess, "");
            else
                MessageService.ShowMessage(JavaScriptConstants.Success, msg, Alert.Sucess, "");

            $scope.countDownInterval = $interval(function() {

                MessageService.UpdateMessage(null, null, JavaScriptConstants.UpdatePendingCountdown.replace("{0}", $scope.countDown));
                $scope.countDown--;
                if ($scope.countDown < 0) {
                    $interval.cancel($scope.countDownInterval);
                    $timeout(function() {
                        MessageService.HideMessage();
                        MessageService.ShowBusy(JavaScriptConstants.ServerUpdateMessage);
                        DataService.Apply().then(function(result) {

                            $scope.StartCheckingForServerOnline();

                        });
                    }, Const.StartCheckingServerStatusDelay);

                }


            }, Const.StartCheckingServerStatusDelay);


        }

        $scope.SwapRanks = function(channel, oldRank, newRank) {
            $scope.InputsView.forEach(
                function(item) {

                    if ((newRank == item.Rank) && (channel != item.Channel)) {
                        item.Rank = oldRank;
                    }
                }
            );
        }

        $scope.RefreshSwitchSettings = function() {
            $scope.GetDevices(DefaultRoomId);
            $scope.GetOutputsView(DefaultRoomId);
            $scope.GetAssociatedChannelChoices(DefaultRoomId);
            $scope.GetInputsView(DefaultRoomId);

        }


        $scope.GetEndpointDisplayName = function(id, devices) {
            var name = "";
            devices.forEach(function(item) {

                if (item.DeviceId == id)
                    name = item.DisplayName;
            });
            return name;
        }

        $scope.GetDeviceDisplayName = function(id, devices) {
            var name = "";
            devices.forEach(function(item) {

                if (item.DeviceId == id)
                    name = item.DisplayName;
            });
            return name;
        }

        $scope.IdMessage = function(ipId) {

            return JavaScriptConstants.AlreadyInUse.replace('{0}', ipId);
        }
        //GetChannelTypeOptions(); GetDevices(DefaultRoomId); GetTransportTypeOptions(); GetSupportedDevices(); GetDeviceIcons(); GetOutputsView(DefaultRoomId); GetInputsView(DefaultRoomId); GetChannelTypeOptions();

        $scope.ConfigCallOptionsForm = {};
        $scope.GetSaveDialerSettingsDisabled = function() {


            if (!$scope.Config.DialerSettingsForm.$dirty)
                return true;

            var form = $scope.Config.DialerSettingsForm;
            var num = $scope.DialerConfig.Presets.length;
            for (var xx = 0; xx < num; xx++) {
                var name = form["preset_Name_" + xx];
                var number = form["preset_Number_" + xx];
                var enabled = form["preset_Enabled_" + xx].$modelValue;

                if ((enabled && ((name.$invalid) || (number.$invalid))))
                    return true;
                if ((name.$modelValue == "") && (number.$modelValue != ""))
                    return true;
                if ((number.$modelValue == "") && (name.$modelValue != ""))
                    return true;
            }
            return false;
        }


        $scope.ValidateLightingSettings = function() {
            var form = $scope.Config.LightingSettingsForm;
            var num = $scope.LightingConfig.Presets.length;
            for (var xx = 0; xx < num; xx++) {
                var name = form["preset_Name_" + xx];
                var enabled = form["preset_Enabled_" + xx].$modelValue;
                //console.log("enabled" + enabled + " name.$invalid" + name.$invalid);
                if (enabled && name.$invalid)
                    return true;
            }
            return false;
        }


        $scope.SaveLightingSettings = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {
                DataService.SaveLightingSettings($scope.LightingConfig, roomId).then
                (
                    function(result) {
                        if (!result.result) {
                            MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                        } else {
                            $scope.Config.LightingSettingsForm.$setPristine();
                            $scope.removeUnloadEvent();

                        }
                    }
                );
            });

        }


        $scope.SaveDialerSettings = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {

                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {
                    DataService.SaveDialerSettings($scope.DialerConfig, roomId).then
                    (
                        function(result) {
                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {
                                $scope.Config.DialerSettingsForm.$setPristine();
                                $scope.removeUnloadEvent();
                            }

                        }
                    );

                }, 10);
            });
        }


        $scope.SavePresentationScreenCustomization = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {
                DataService.SavePresentationScreenCustomization($scope.PresentationScreenCustomization, roomId).then
                (
                    function(result) {
                        if (!result.result) {
                            MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                        } else {
                            $scope.Config.PresentationScreenCustomizationForm.$setPristine();
                            $scope.removeUnloadEvent();

                        }
                    }
                );

            });


        }


        $scope.SaveRoomScheduleScreenCustomization = function(roomId) {

            if (!$scope.RoomScheduleScreenCustomization.EnableCustomLogoGraphic)
                $scope.RoomScheduleScreenCustomization.CustomLogoGraphicUrl = "";

            $scope.AskSystemConfiguredIfNeeded(function() {

                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {
                    DataService.SaveRoomScheduleScreenCustomization($scope.RoomScheduleScreenCustomization, roomId).then
                    (
                        function(result) {
                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {

                                $scope.Config.RoomScheduleScreenCustomizationForm.$setPristine();
                                $scope.removeUnloadEvent();

                            }
                        }
                    );
                }, 10);
            });
        }

        $scope.ActualSaveUxGeneralCustomization = function(roomId) {
            DataService.SaveUxGeneralCustomization($scope.UxGeneralCustomization, roomId).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        if ($scope.Config.UxGeneralCustomizationForm != null)
                            $scope.Config.UxGeneralCustomizationForm.$setPristine();
                        $scope.removeUnloadEvent();

                    }
                }
            );
        }

        $scope.SaveUxGeneralCustomization = function(roomId) {
            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.ActualSaveUxGeneralCustomization(roomId);
            });
        }

        $scope.ActualSaveSchedulingSettings = function(roomId) {
            DataService.SaveSchedulingSettings($scope.SchedulingSettings, roomId).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        if ($scope.Config.ScheduleConfigForm != null) {
                            if ((!$scope.Config.ScheduleConfigForm.SchedulingSettings_OutlookPassword.$invalid) && $scope.Config.ScheduleConfigForm.SchedulingSettings_OutlookPassword.$dirty)
                                $scope.SetOutlookPassword(roomId, $scope.SchedulingSettings.OutlookPassword);

                            $scope.Config.ScheduleConfigForm.$setPristine();
                        }

                        $scope.removeUnloadEvent();
                        if ($scope.SaveCert == true) {
                            $scope.SendFileCert();
                            $scope.SaveCert = false;
                        }
                    }
                }
            );

        }

        $scope.SaveSchedulingSettings = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {

                $scope.ActualSaveSchedulingSettings(roomId);

            });


        }

        $scope.CallGetSaveFusionConfigDisabled = function() {
            $scope.GetSaveFusionConfigDisabled();
        }

        $scope.GetSaveFusionConfigDisabled = function() {

            var schedulingSettingsDirty = false;
            if ($scope.Config.FusionConfigForm.SchedulingSettings_Enable != null)
                schedulingSettingsDirty = $scope.Config.FusionConfigForm.SchedulingSettings_Enable.$dirty;
            if (
                ($scope.Config.FusionConfigForm.UxGeneralCustomization_NonEmergencyBroadcastTimeout != null)
                    &&
                    ($scope.Config.FusionConfigForm.UxGeneralCustomization_NonEmergencyBroadcastTimeout.$invalid)
            )
                return true;

            if (
                ($scope.Config.FusionConfigForm.UxGeneralCustomization_EmergencyBroadcastTimeout != null)
                    &&
                    ($scope.Config.FusionConfigForm.UxGeneralCustomization_EmergencyBroadcastTimeout.$invalid)
            )
                return true;

            if (
                ($scope.Config.FusionConfigForm.FusionConfig_RoomName.$invalid)
                    ||
                    (!($scope.Config.FusionConfigForm.$dirty || schedulingSettingsDirty))
                    ||
                    ($scope.Config.FusionConfigForm.FusionConfig_FusionIpId.$invalid) ||
                    ($scope.IsIpIdIAlreadyInUse($scope.FusionConfig.FusionIpId, $scope.OldFusionConfig.FusionIpId)) ||
                    ($scope.Config.FusionConfigForm.FusionConfig_FusionCloudUrl != null && $scope.Config.FusionConfigForm.FusionConfig_FusionCloudUrl.$invalid)
            )
                return true;
            return false;
        }


        $scope.SaveRelayConfig = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {

                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {

                    DataService.SaveRelayConfig($scope.RelayConfig, roomId).then
                    (
                        function(result) {
                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {

                                $scope.Config.RelaySettingsForm.$setPristine();
                                $scope.removeUnloadEvent();
                            }
                        }
                    );
                }, 10);
            });
        }

        $scope.GetFusionConfig = function(roomId) {

            DataService.GetFusionConfig($scope.FusionConfig, roomId).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.FusionConfig = result;
                        $scope.FusionConfigOldIpId = $scope.FusionConfig.IpId;
                        $scope.Config.FusionConfigForm.$setPristine();
                        $scope.removeUnloadEvent();
                    }
                }
            );
        }


        $scope.ActualSaveFusionConfig = function(roomId) {
            DataService.SaveFusionConfig($scope.FusionConfig, roomId).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        $scope.Config.FusionConfigForm.$setPristine();
                        $scope.removeUnloadEvent();
                        $timeout(function() {

                            DataService.GetFusionConfig(roomId).then(function(resultConfig) {
                                $scope.FusionConfig = resultConfig;
                                $scope.FusionConfigOldIpId = $scope.FusionConfig.IpId;
                                $scope.OldFusionConfig = angular.copy($scope.FusionConfig);
                            });
                            //                                
                        }, 1000);
                        MessageService.HideBusy();


                    }
                }
            );

        }

        $scope.SaveFusionConfig = function(roomId) {

            $scope.FusionConfig.IpId = parseInt($scope.FusionConfig.IpId, "16");


            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.ActualSaveFusionConfig(roomId);


            });

        }

        $scope.ToggleRelayEnabled = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetRelayEnabled(roomId, !$scope.RelayConfig.Enable);
            });


        }


        $scope.ToggleFusionEnabled = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetFusionEnabled(roomId, !$scope.FusionConfig.Enable);
            });
        }

        $scope.ToggleScheduleEnabled = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetScheduleEnabled(roomId, !$scope.SchedulingSettings.Enable);
            });
        }


        $scope.SetLightingEnabled = function(roomId, enabled) {

            DataService.SetLightingEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.LightingConfig.Enable = !$scope.LightingConfig.Enable;
                        if (enabled)
                            $scope.LightingEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.LightingEnableText = JavaScriptConstants.Enable;

                    }
                }
            );
        }

        $scope.SetRelayEnabled = function(roomId, enabled) {

            DataService.SetRelayEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.RelayConfig.Enable = !$scope.RelayConfig.Enable;
                        if (enabled)
                            $scope.RelayEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.RelayEnableText = JavaScriptConstants.Enable;

                    }
                }
            );
        }

        $scope.FusionConfigInvalid = function FusionConfigInvalid() {
            return ($scope.FusionConfig == null ||
            ($scope.FusionConfig.Connection == null) ||
            ($scope.FusionConfig.Connection == "") ||
            ($scope.FusionConfig.RoomName == null) ||
            ($scope.FusionConfig.RoomName == "") ||
            ($scope.FusionConfig.IpId == null) ||
            ($scope.FusionConfig.IpId < 3));
        }
        $scope.SetFusionEnabled = function(roomId, enabled) {

            DataService.SetFusionEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        DataService.GetFusionConfig(roomId).then(
                            function(resultConfig) {
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                } else {

                                    $scope.FusionConfig.Enable = resultConfig.Enable;
                                    if ($scope.FusionConfig.Enable) {
                                        $scope.FusionEnableText = JavaScriptConstants.Disable;
                                        if ($scope.SchedulingSettings != null)
                                            $scope.SchedulingSettings.Enable = true;


                                    } else {
                                        $scope.FusionEnableText = JavaScriptConstants.Enable;
                                        if ($scope.SchedulingSettings != null)
                                            $scope.SchedulingSettings.Enable = false;
                                        if ($scope.UxGeneralCustomization != null)
                                            $scope.UxGeneralCustomization.ShowBroadcastOnPanel = false;
                                    }


                                }

                            }
                        );
                    }
                }
            );
        }


        $scope.SetSchedulingType = function(roomId) {

            DataService.SetSchedulingType(roomId, $scope.SchedulingSettings.SchedulingType).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.Config.ScheduleConfigForm.$setPristine();
                    }
                }
            );
        }


        $scope.SetOutlookPassword = function(roomId, password) {

            DataService.SetOutlookPassword(roomId, password).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    }
                }
            );
        }


        $scope.SetScheduleEnabled = function(roomId, enabled) {

            DataService.SetScheduleEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        DataService.GetSchedulingSettings(roomId).then(
                            function(resultConfig) {
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                } else {

                                    $scope.SchedulingSettings = resultConfig;
                                    //$scope.OldFusionConfig = angular.copy($scope.FusionConfig);
                                    if ($scope.SchedulingSettings.Enable)
                                        $scope.ScheduleEnableText = JavaScriptConstants.Disable;
                                    else
                                        $scope.ScheduleEnableText = JavaScriptConstants.Enable;
                                }

                            }
                        );
                    }
                }
            );
        }


        $scope.ToggleDialerEnabled = function(roomId) {
            //$scope.AskSystemConfiguredIfNeeded(function() { });
            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetDialerEnabled(roomId, !$scope.DialerConfig.Enable);
            });


        }
        $scope.ToggleLightingEnabled = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetLightingEnabled(roomId, !$scope.LightingConfig.Enable);
            });
        }

        $scope.SetDialerEnabled = function(roomId, enabled) {

            DataService.SetDialerEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        $scope.DialerConfig.Enable = !$scope.DialerConfig.Enable;
                        if (enabled)
                            $scope.DialerEnableText = JavaScriptConstants.Disable;
                        else
                            $scope.DialerEnableText = JavaScriptConstants.Enable;

                    }
                }
            );

        }

        $scope.GetWarnPhoneNumberEntry = function() {
            var form = $scope.Config.DialerSettingsForm;
            if ($scope.DialerConfig == null)
                return true;
            var num = $scope.DialerConfig.Presets.length;
            for (var xx = 0; xx < num; xx++) {
                var item = form["preset_Number[" + xx + "]"];
                if (item.$dirty && item.$invalid)
                    return true;
            }
            return false;
        }


        $scope.GetWarnEnabledDialerEntry = function() {
            var form = $scope.Config.DialerSettingsForm;
            if ($scope.DialerConfig == null)
                return true;
            var num = $scope.DialerConfig.Presets.length;
            for (var xx = 0; xx < num; xx++) {
                var name = form["preset_Name[" + xx + "]"];
                var number = form["preset_Number[" + xx + "]"];
                var enabled = form["preset_Enabled[" + xx + "]"].$modelValue;

                if ((enabled && ((name.$invalid) || (number.$invalid))))
                    return true;
            }
            return false;
        }


        $scope.IpIdLess255 = function(ipId) {
            var val = parseInt(ipId, "16");
            return val <= 255;
        }


        $scope.SyncDeviceSelection = function(channel, isInput) {
            var view = {};
            if (isInput)
                view = $linq.Enumerable().From($scope.InputsView).Where(function(x) { return x.Channel == channel; }).FirstOrDefault();
            else
                view = $linq.Enumerable().From($scope.OutputsView).Where(function(x) { return x.Channel == channel; }).FirstOrDefault();
            if (view == null)
                return;

            if (view.State == SwitchChannelState.Disabled) {
                view.AssocatedDeviceId = "";
                view.EndPoint = "";
                if (isInput) {
                    $('#inputView_AssocatedDeviceId' + channel + " option:selected").prop("selected", false);
                    $('#inputView_EndPoint' + channel + " option:selected").prop("selected", false);
                    $scope.UpdateInputState();

                } else {
                    $('#outputView_AssocatedDeviceId' + channel + " option:selected").prop("selected", false);
                    $('#outputView_EndPoint' + channel + " option:selected").prop("selected", false);
                    $scope.UpdateOutputState();
                }


            }
        }

        $scope.IsSystemConfigured = function() {
            return (
                $window.currentSystemState == SystemState.Configured
            );
        }
        $scope.AskSystemConfiguredIfNeeded = function(onProceed, onCancelled) {
            if ($scope.IsSystemConfigured()) {

                if (onCancelled != null) {
                    MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.SystemWideSaveWarning, Alert.Warning, function() { $timeout(onProceed, 500); }, function() { $timeout(onCancelled, 500); });
                } else {

                    MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.SystemWideSaveWarning, Alert.Warning, function() {
                        $timeout(
                            function() {
                                onProceed();
                            }, 500);
                    });
                }

            } else {
                onProceed();
            }

        }


        $scope.AssociatedChannelChoices = [];
        $scope.GetAssociatedChannelChoices = function(roomId) {
            DataService.GetAssociatedChannelChoices(roomId).then(
                function(resultData) {
                    $scope.AssociatedChannelChoices = resultData;
                    //  resultData.forEach(function(item) { console.log(item); });

                });
        }
        $scope.GetAssociatedChannelChoicesFriendlyName = function(id) {

            //console.log("GetDeviceTypeFriendlyName " + dtype);
            var typ = $linq.Enumerable().From($scope.AssociatedChannelChoices).Where(function(x) { return x.Id == id; }).FirstOrDefault();
            if (typ == null)
                return "";
            return typ.Option;
        }

        $scope.GetMyGetAssociatedChannelChoices = function(deviceid) {
            var options = $linq.Enumerable().From($scope.AssociatedChannelChoices).Where(function(x) {
                return (
                    (x.AssociatedDeviceId == "")
                        || (deviceid != "" && x.AssociatedDeviceId == deviceid)
                );
            }).ToArray();

            // options.forEach(function(item) { console.log(item); });
            return options;

        }

        $scope.GetFilteredOptions = function(theOptions, deviceid) {
            var options = $linq.Enumerable().From(theOptions).Where(function(x) {
                return (
                    (x.AssociatedDeviceId == "")
                        || (deviceid != "" && x.AssociatedDeviceId == deviceid)
                );
            }).ToArray();
            return options;
        }

        $scope.GetChannelAssocaitedWithAlternateDevice = function(channelNumer) {
            return $linq.Enumerable().From($scope.AssociatedChannelDevices).Where(function(x) {
                return ((x.CableCaddy.PrimaryInputChannelNumber == channelNumer)
                        || (x.CableCaddy.SecondaryInputChannelNumber == channelNumer)
                );
            }).FirstOrDefault();

        }

        // Mercury Specific

        $scope.LoadDisplayDevice = function() {

            console.log("$scope.LoadDisplayDevice");
            var display = $linq.Enumerable().From($scope.Devices).Where(function(x) {
                return (x.DeviceTypeEnum == DeviceType.AvDisplay) || (x.DeviceTypeEnum == DeviceType.Projector);
            }).FirstOrDefault();


            $scope.LoadEditDevice(display.DeviceId);


        }


        $scope.SuscribeLoadEvents = function() {

            $scope.$on(Subscriptions.OnGetDevicesCompleted, $scope.LoadDisplayDevice);
            $scope.$on(Subscriptions.OnGetSupportedDevicesCompleted, function() {
                $scope.GetDeviceModelsFromType(DeviceType.AvDisplay);


                var device = $scope.GetDevice($scope.EditDevice.Model);
                if (device == null)
                    return null;

                $scope.UpdateModelConfig($scope.EditDevice.Model);


                var groupDeviceDetail = $linq.Enumerable().From(device.GroupDeviceDetails).Where(function(x) { return $scope.EditDevice.TransportEnum == x.TransportEnum; }).FirstOrDefault();

                $scope.UpdateTransportConfig(groupDeviceDetail, device.IsCableCaddy, device.IsDmOnly);


            });

        }

        $scope.SetCommunicationsPort = function() {
            if ($scope.FilteredDevicePorts == null)
                return;
            if ($scope.FilteredDevicePorts.Length == 0)
                return;
            var port = $linq.Enumerable().From($scope.FilteredDevicePorts).FirstOrDefault();
            if (port == null)
                return;

            $scope.EditDevice.CommunicationsPortId = port.PortId;
        }

        $scope.ResetTransport = function(model) {
            var device = $scope.GetDevice(model);
            $scope.EditDevice.TransportEnum = DeviceTransport.Unknown;
            if (device.GroupDeviceDetails.length == 1)
                $scope.EditDevice.TransportEnum = device.GroupDeviceDetails[0].TransportEnum;

        }
        $scope.NewEditDevice = {};
        $scope.ClearUnusedFields = function() {

            $scope.NewEditDevice.TransportEnum = $scope.EditDevice.TransportEnum;
            $scope.NewEditDevice.DeviceTypeEnum = $scope.EditDevice.DeviceTypeEnum;
            $scope.NewEditDevice.DeviceId = $scope.EditDevice.DeviceId;
            $scope.NewEditDevice.DisplayName = $scope.EditDevice.DisplayName;
            $scope.NewEditDevice.Model = $scope.EditDevice.Model;

            $scope.NewEditDevice.DeviceClassName = $scope.EditDevice.DeviceClassName;
            $scope.NewEditDevice.Id = $scope.EditDevice.Id;
            $scope.NewEditDevice.DefaultInput = $scope.EditDevice.DefaultInput;


            switch ($scope.EditDevice.TransportEnum) {
                case DeviceTransport.None:
                    break;
                case DeviceTransport.CrestronIpId:
                    $scope.NewEditDevice.IpId = $scope.EditDevice.IpId;
                    break;
                case DeviceTransport.CrestronInternal:
                    break;
                case DeviceTransport.Ip:
                case DeviceTransport.CrestronIp:
                    $scope.NewEditDevice.Ip = $scope.EditDevice.Ip;
                    break;
                case DeviceTransport.IpPort:
                case DeviceTransport.CrestronIpPort:
                    $scope.NewEditDevice.Ip = $scope.EditDevice.Ip;
                    $scope.NewEditDevice.Port = $scope.EditDevice.Port;
                    break;
                case DeviceTransport.IpPortChannel:
                    $scope.NewEditDevice.Ip = $scope.EditDevice.Ip;
                    $scope.NewEditDevice.Port = $scope.EditDevice.Port;
                    $scope.NewEditDevice.Channel = $scope.EditDevice.Channel;
                    break;
                case DeviceTransport.IpChannel:
                    $scope.NewEditDevice.Ip = $scope.EditDevice.Ip;
                    $scope.NewEditDevice.Channel = $scope.EditDevice.Channel;
                    break;
                case DeviceTransport.Serial:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    break;
                case DeviceTransport.SerialChannel:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    $scope.NewEditDevice.Channel = $scope.EditDevice.Channel;
                    break;
                case DeviceTransport.SerialBaud:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    $scope.NewEditDevice.BaudRate = $scope.EditDevice.BaudRate;
                    break;
                case DeviceTransport.SerialBaudChannel:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    $scope.NewEditDevice.BaudRate = $scope.EditDevice.BaudRate;
                    $scope.NewEditDevice.Channel = $scope.EditDevice.Channel;
                    break;
                case DeviceTransport.SerialBaudCustom:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    $scope.NewEditDevice.BaudRate = $scope.EditDevice.BaudRate;
                    $scope.NewEditDevice.CustomSerial = angular.copy($scope.EditDevice.CustomSerial);

                    break;
                case DeviceTransport.Ir:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    break;
                case DeviceTransport.Cec:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    break;
                case DeviceTransport.CrestronUsb:
                    $scope.NewEditDevice.CommunicationsPortId = $scope.EditDevice.CommunicationsPortId;
                    break;
                case DeviceTransport.CrestronCrestnet:
                    $scope.NewEditDevice.CrestnetId = $scope.EditDevice.CrestnetId;

                    break;
            }

            angular.copy($scope.NewEditDevice, $scope.EditDevice);
        }


        $scope.AddUrl = function(element) {
            console.log("$scope.AddUrl click");
            var regex = new RegExp($scope.UrlRegEx);
            var url = $("#NewUrl").val();
            if (url == null)
                return;
            if (!url.match(regex)) {
                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.InvalidUrl, Alert.Error);
                return;
            }
            $scope.TestImage(url,
                function(img) {
                    $scope.AddBackgroundUrl(url, img);
                },
                function() {
                    MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.ImageCouldNotBeLoaded, Alert.Warning, function() { $scope.AddBackgroundUrl(url); });
                },
                15000, element);
        }

        $scope.AddBackgroundUrl = function(url, img) {


            if ($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls == null)
                $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls = new Array();
            $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.push({ Url: url, Label: $scope.BackgroundUrlLabels[$scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length] });
            $scope.AddImageToCarousel(url, "", img);
            $scope.Config.RoomScheduleScreenCustomizationForm.$setDirty();
            $scope.$apply();
            $scope.SyncCarouselVis();
            $("#NewUrl").val("");


        }

        $scope.GeneratetCarouselImageStyle = function(img) {
            var fillStyle = 'width:480px;height: 270px;';
            if (img != null && !isNaN(img.height) && !isNaN(img.width)) {
                var h = img.height;
                var w = img.width;
                var ratio = h / w;
                var viewRatio = 270 / 480;
                if (ratio > viewRatio) {
                    fillStyle = 'width:' + Math.round(270 / (h / w)) + 'px;height: 270px;';
                } else {
                    var newHeight = Math.round(480 / (w / h));
                    var margin = Math.round((270 - newHeight) / 2);
                    fillStyle = 'width:480px;height: ' + newHeight + 'px;margin-top:' + margin + "px;margin-bottom:" + margin + "px;";
                }

            }
            return fillStyle;

        }

        //generate image html for carousel
        $scope.imageHTML = function(ind, url, label, img) {

            var fillStyle;

            if(img == null) {
                //add default placeholder when image can't hold
                fillStyle = "width:150px;";
                return "<center><div class=\"item-img imagenotload\" id='bgUrl" + ind + "'><span class=\"fa fa-warning fa-lg\"></span><div>"+JavaScriptConstants.ImageNotLoaded+"</div></div></center>\
                    <div class='carousel-caption'>\
                        <h3></h3>\
                    </div>";
                
            }
            else {
                fillStyle = $scope.GeneratetCarouselImageStyle(img);
                return "<center><img class=\"item-img\" src='" + url + "' id='bgUrl" + ind + "' alt='" + label + "' style='" + fillStyle + "'></center>\
                    <div class='carousel-caption'>\
                        <h3>" + label + "</h3>\
                    </div>";
            }
        }


        $scope.AddImageToCarousel = function(url, label, img) {

            var str = "<div class='item '  >" + $scope.imageHTML($('#CarouselList .item').size(), url, label, img) + "</div>";

            if (label == null)
                label = "";
            var newItem = $(str);
            $('#CarouselList .item').removeClass('active');
            newItem.addClass('active');
            $("#CarouselList").append(newItem);
            $("#myCarousel").carousel();
        }

        $scope.TestImage = function(url, callbackSuccess, callbackFailure, timeout, element) {

            MessageService.ShowBusy(JavaScriptConstants.VerifingImage);

            timeout = timeout || 5000;
            var timedOut = false, timer;
            var img = new Image();

            img.onabort = function(evt) {
                console.log("Abort: " + evt);
                $scope.LogosSave = false;
                if (!timedOut) {
                    MessageService.HideBusy();
                    clearTimeout(timer);
                    console.log('Not Loaded' + img.src);
                    callbackFailure();
                }
            };

            img.onerror = function(evt) {
                console.log("Error: " + evt);
                $scope.LogosSave = false;
                if (!timedOut) {
                    MessageService.HideBusy();
                    clearTimeout(timer);
                    console.log('Not Loaded' + img.src);
                    callbackFailure();
                }
            };
            img.onload = function() {
                $scope.LogosSave = false;
                if (!timedOut) {
                    console.log('Loaded' + img.src);
                    MessageService.HideBusy();
                    clearTimeout(timer);
                    if (element != null) {
                        if ((img.height > $scope.RoomScheduleScreenCustomization.CustomBackgroundHeight) || (img.width > $scope.RoomScheduleScreenCustomization.CustomBackgroundWidth)) {

                            element.$setValidity('ImageTooLarge', false);
                            $scope.$apply();

                            return;
                        } else {
                            element.$setValidity('ImageTooLarge', true);
                        }
                        $scope.$apply();
                    }


                    callbackSuccess(img);

                }
            };
            img.src = url;
            timer = setTimeout(function() {
                MessageService.HideBusy();
                $scope.LogosSave = false;
                timedOut = true;
                console.log('Not Loaded' + img.src);
                callbackFailure();
            }, timeout);
        }

        $scope.carouselLock = false;


        $scope.RemoveUrl = function(index) {

            $scope.carouselLock = true;

            var len = $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length;

            var item = $('.carousel-inner .item').eq(index);
            if (item.hasClass('active')) {
                item.removeClass('active');
                if (index == 0)
                    $('.carousel-inner .item').eq(1).addClass('active');

                else
                    $('.carousel-inner .item').eq(0).addClass('active');
            }
            item.remove();

            //reorder image id
            $('#myCarousel .item center').each(function( index ) {
                $(this).find(".item-img").attr("id","bgUrl"+index);
              });

            $('#myCarousel').carousel();


            $scope.Config.RoomScheduleScreenCustomizationForm.$setDirty();
            var label = $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[index].Label;
            $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.splice(index, 1);
            for (var x = index; x < $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length; x++) {
                var lbl = $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[x].Label;
                $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[x].Label = label;
                label = lbl;
            }


            $scope.SyncCarouselVis();

            $scope.carouselLock = false;
        }


        $scope.BackgroundUrlChange = function(index, element) {

            var newUrl = null;
            if (element != null)
                newUrl = element.$modelValue;

            var regex = new RegExp($scope.UrlRegEx);
            if ((newUrl == null) || (!newUrl.match(regex))) {
                //MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.InvalidUrl, Alert.Error);
                return;
            }


            $timeout(
                function() {
                    $scope.TestImage(newUrl,
                        function(img) { $scope.UpdateBackgroundUrl(newUrl, index, img); },
                        function() {
                            MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.ImageCouldNotBeLoaded, Alert.Warning,
                                function() { $scope.UpdateBackgroundUrl(newUrl, index); });
                        },
                        15000, element);
                }, 500);


            //            $scope.TestImage(newUrl, 
            //                function(img) { $scope.UpdateBackgroundUrl(newUrl,index,img ); }, 
            //                function() {
            //                 MessageService.ShowConfirm(JavaScriptConstants.Warning, newUrl + "<br>" + JavaScriptConstants.ImageCouldNotBeLoaded, Alert.Warning,
            //                 function() { $scope.UpdateBackgroundUrl(newUrl, index); });
            //             },
            //             5000, element);


        }


        $scope.UpdateBackgroundUrl = function(url, index, img) {

            var str = $scope.imageHTML(index, url, $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[index].Label, img);

            $('#bgUrl' + index).closest(".item").html("").append($(str));
            $scope.RoomScheduleScreenCustomization.CustomBackgroundUrls[index].Url = url;
            $scope.$apply();
            $scope.Config.RoomScheduleScreenCustomizationForm.$setDirty();
        }


        //        $scope.AddCustomLogo = function() {
        //            alert('todo');
        //        }


        $scope.callGetRoomScheduleScreenCustomizationDisabled = function() {

            $scope.GetRoomScheduleScreenCustomizationDisabled();
        }
        $scope.GetRoomScheduleScreenCustomizationDisabled = function() {

            if (!$scope.Config.RoomScheduleScreenCustomizationForm.$dirty)
                return true;
            if ($scope.Config.RoomScheduleScreenCustomizationForm.$invalid)
                return true;
            if ($scope.Config.RoomScheduleScreenCustomizationForm.RoomScheduleScreenCustomization_MinutesBeforeMeetingStart.$invalid)
                return true;

            return false;
        }
        $scope.SyncCarouselVis = function() {


            if (($scope.RoomScheduleScreenCustomization.PanelScreenSaverEnable) && ($scope.RoomScheduleScreenCustomization.EnableCustomBackgrounds) && ($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls != null) && ($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length > 0)) {
                if ($('#myCarousel').is(':visible'))
                    return;

                $('#carouselContainer').show();
                $('#myCarousel').show();

            } else {
                if (!$('#myCarousel').is(':visible'))
                    return;
                $('#myCarousel').hide();
                $('#carouselContainer').hide();
            }

        }
        $scope.ToggleFusionCloudUrlEnabled = function(roomId) {
            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.SetFusionCloudUrlEnabled(roomId, !$scope.FusionConfig.EnableCloud);
            });

        }

        $scope.SetFusionCloudUrlEnabled = function(roomId, enabled) {
            console.log("SetFusionCloudUrlEnabled " + enabled);

            DataService.SetFusionCloudUrlEnabled(roomId, enabled).then(
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        DataService.GetFusionConfig(roomId).then(
                            function(resultConfig) {
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                } else {

                                    $scope.FusionConfig.FusionCloudUrl = resultConfig.FusionCloudUrl;
                                    $scope.FusionConfig.EnableCloud = resultConfig.EnableCloud;
                                    if ($scope.FusionConfig.EnableCloud)
                                        $scope.FusionCloudUrlEnableText = JavaScriptConstants.Disable;
                                    else
                                        $scope.FusionCloudUrlEnableText = JavaScriptConstants.Enable;
                                }

                            }
                        );
                    }
                }
            );
        }


        $scope.FixIpId = function() {

            if (!$scope.IpIdLess255($scope.EditDevice.IpId)) {

                for (var x = 3; x < 255; x++) {
                    var tmp = x.toString(16);
                    if (!$scope.IsIpIdIAlreadyInUse(tmp, "00")) {
                        if (tmp.length == 1)
                            tmp = "0" + tmp;
                        $scope.EditDevice.IpId = tmp;
                        break;
                    }
                }

            }


        }

        $scope.SaveCert = false;
        $scope.ReadyFile = function() {

            $scope.SaveCert = true;
            $scope.Config.ScheduleConfigForm.$setDirty();
            $scope.$apply();
            //            $scope.$digest();
        }

        $scope.imgVerified = null;

        //flag to determine whether to show logo not loaded placeholder
        $scope.logoNotLoaded = false;

        //show Logo Preview on page load if Logo Graphic is enabled
        $scope.loadLogoPreview = function() {      
            if($scope.RoomScheduleScreenCustomization.EnableCustomLogoGraphic) {
                $scope.TestImage($scope.RoomScheduleScreenCustomization.CustomLogoGraphicUrl,
                    function(img) {
                        $scope.logoNotLoaded = false;
                        $scope.VerifyImage(img);
                    },                        
                    function() {
                        $scope.logoNotLoaded = true;
                    }, 15000);
            }            
        }        

        $scope.VerifyImage = function(img) {


            if ((img.height > $scope.RoomScheduleScreenCustomization.CustomBackgroundHeight) || (img.width > $scope.RoomScheduleScreenCustomization.CustomBackgroundWidth)) {

                $scope.Config.RoomScheduleScreenCustomizationForm[$scope.imgVerified].$setValidity('ImageTooLarge', false);
            } else {
                $scope.Config.RoomScheduleScreenCustomizationForm[$scope.imgVerified].$setValidity('ImageTooLarge', true);
            }

            $scope.$apply();
        }

        $scope.VerifyUrlPattern = function(url) {


            var regex = new RegExp($scope.UrlRegEx);


            if ((url == null) || (!url.match(regex))) {
                return;
            }

        }

        $scope.LogosSave = false;
        $scope.SuspendLogosSave = function() {
            $scope.LogosSave = true;
        }

        $scope.ValidateImageSize = function(event) {


            var url = event.target.value;
            if ((url == null) || (url == '')) {
                $scope.LogosSave = false;
                return;
            }

            var regex = new RegExp($scope.UrlRegEx);
            if (!url.match(regex)) {
                $scope.LogosSave = false;
                return;
            }
            $scope.imgVerified = event.target.name;
            $timeout(
                function() {
                    $scope.TestImage(url,
                        function(img) {
                            $scope.logoNotLoaded = false;
                            $scope.VerifyImage(img);
                        },                        
                        function() {
                            $scope.logoNotLoaded = true;
                            MessageService.ShowMessage(JavaScriptConstants.Warning, JavaScriptConstants.ImageCouldNotBeLoaded, Alert.Warning);
                        }, 15000);
                }, 600);            
        }
        // logos only
        $scope.RoomScheduleScreenCustomizationFormValid = function() {
            if ($scope.LogosSave)
                return false;

            if ($scope.RoomScheduleScreenCustomization.EnableCustomBackgrounds) {
                if (($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls == null) || ($scope.RoomScheduleScreenCustomization.CustomBackgroundUrls.length == 0))
                    return false;
            }


            return $scope.Config.RoomScheduleScreenCustomizationForm.$dirty && $scope.Config.RoomScheduleScreenCustomizationForm.$valid;
        }


        $scope.UpdateUrlIfValid = function($event, $index) {
            $scope.imgVerified = event.target.name;
            $scope.ValidateImageSize($event, $index);
            $timeout(
                function() {
                    $scope.Config.RoomScheduleScreenCustomizationForm.$setDirty();
                    $scope.$apply();
                    if ($scope.Config.RoomScheduleScreenCustomizationForm.$valid)
                        $scope.BackgroundUrlChange($index);
                }, 1500);


        }


        $scope.test = function() {


            //$scope.Config.RoomScheduleScreenCustomizationForm.my_Name.$setValidity('bogus', false);
            //$rootScope.$emit(Const.StatusMessageName, '($scope.LastLoadDriverResults != null)');


        }

        // drivers

        $scope.driverStatusData = [];
        $scope.devicetype = "all";


        $scope.GetDriversStatus = function() {
            DataService.GetDriversStatus($scope.devicetype).then
            (
                function(driverStatusData) {
                    console.log("GetDriversStatus  returned..");
                    $scope.driverStatusData = driverStatusData;
                    $scope.driverTableParams = new NgTableParams({}, { dataset: driverStatusData });
                    if ($scope.driverTableParams != null) {
                        $scope.driverTableParams.count($scope.driverPageSize);
                        $scope.driverTableParams.page($scope.driverPage);
                    }


                    //$('#dt').DataTable();
                }
            );
        }


        $scope.ShowBusy = function() {

            MessageService.ShowBusy(JavaScriptConstants.ServerUpdateMessage);
        }

        $scope.driverPageSize = 10;
        $scope.driverPage = 1;
        $scope.ActlualToggleDriver = function(driver) {

            $scope.ShowBusy("");
            $scope.driverPageSize = $scope.driverTableParams.count();
            $scope.driverPage = $scope.driverTableParams.page();
            if (!driver.Enabled) {
                DataService.DisableDrivers(driver.DriverId).then(
                    function(result) {
                        if (!result.result)
                            MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);

                        $interval(function() {
                            $scope.GetDriversStatus();
                            MessageService.HideBusy();
                        }, 1750, 1);


                    }
                );
            } else {
                DataService.EnableDrivers(driver.DriverId).then(
                    function(result) {
                        if (!result.result)
                            MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                        $interval(function() {
                            $scope.GetDriversStatus();
                            MessageService.HideBusy();
                        }, 1750, 1);
                    }
                );
            }

        }
        $scope.ToggleDriver = function(driver) {
            $scope.AskSystemConfiguredIfNeeded(function() { $scope.ActlualToggleDriver(driver); }, function() { $scope.GetDriversStatus(); });
        }
        $scope.DeleteDriver = function(driverId) {
            $scope.AskSystemConfiguredIfNeeded(function() { $scope.ActualDeleteDriver(driverId); });
        }

        $scope.ActualDeleteDriver = function(driverId) {

            DataService.DeleteDrivers(driverId).then(
                function(result) {
                    if (result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {
                        DataService.GetDriversStatus($scope.devicetype);

                    }

                },
                function() { $scope.GetDriversStatus(); }
            );


        }

        // end drivers

        // advanced routing

        $scope.CloseAdvancedRouting = function() {
            $scope.CloseModal('AdvancedRouteSettingsDialog');
        }

        $scope.FilteredOutputsView = [];


        $scope.Config.AdvancedRouteSettingsForm = null;
        $scope.AdvancedRouteSettings = null;
        $scope.currentChannel = null;
        $scope.ShowAdvancedRoutingSettings = function(channel) {
            $scope.AdvancedRouteSettings = $scope.OutputsView[channel - 1].AdvancedRouteSettings;
            $scope.currentChannel = channel;
            $scope.FilteredOutputsView = $linq.Enumerable().From($scope.OutputsView).Where(function(x) {
                return ((x.Channel != $scope.currentChannel) && (x.AdvancedRouteSettings.OutputVideoRouteType == SwitcherOutputRouteType.Manual));
            }).ToArray();
            $scope.ShowCenteredModal('AdvancedRouteSettingsDialog');
            $('#OutputName').text($scope.OutputsView[channel - 1].DisplayName);
        }

        //        $scope.CallGetSaveAdvancedRoutingSettingsDisabled= function() {
        //        {
        //            $scope.GetSaveAdvancedRoutingSettingsDisabled();
        //        }
        //        
        $scope.GetSaveAdvancedRoutingSettingsDisabled = function() {

            if (!$scope.Config.AdvancedRouteSettingsForm.$dirty)
                return true;


            if ($scope.AdvancedRouteSettings.OutputVideoRouteType == SwitcherOutputRouteType.Follow) {
                if ($scope.AdvancedRouteSettings.OutputAssociatedChannelNumber == "")
                    return true;
            }
            if ($scope.AdvancedRouteSettings.OutputVideoRouteType == SwitcherOutputRouteType.Fixed) {
                if ($scope.AdvancedRouteSettings.InputAssociatedChannelNumber == "")
                    return true;
            }
            return false;
        }

        $scope.SaveAdvancedRoutingSettings = function(roomId) {

            $scope.AskSystemConfiguredIfNeeded(function() {
                $scope.CloseAdvancedRouting();
                MessageService.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {
                    DataService.SaveAdvancedRoutingSettings($scope.AdvancedRouteSettings, $scope.currentChannel, roomId).then
                    (
                        function(result) {

                            MessageService.HideBusy();
                            if (!result.result) {
                                MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                            } else {

                                $scope.Config.AdvancedRouteSettingsForm.$setPristine();
                                $scope.removeUnloadEvent();


                            }
                        }
                    );


                }, 10);


            });

        }

        // end advanced routing


        $scope.SaveAllFusionConfig = function(roomId) {


            $scope.AskSystemConfiguredIfNeeded(function() {
                // UX

                $scope.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                $timeout(function() {

                    $scope.ActualSaveUxGeneralCustomization(roomId);
                    $timeout(function() {
                        // sched
                        $scope.ActualSaveSchedulingSettings(roomId);
                    }, 300);

                    $timeout(function() {
                        $scope.ActualSaveFusionConfig(roomId);
                    }, 600);

                }, 10);


            });

            /////////////////


        }
        $scope.TimeChanged = function(newValue, oldValue, form, field) {
            if (oldValue != null) {
                form.$setDirty();
                if (field != null)
                    field.$setDirty();
            }
        }

        $scope.ResetValidity = function(element) {
            element.$setValidity('ImageTooLarge', true);
            //            $scope.$apply();    
        }


        // date and time

        $scope.DeviceTimeZone = {};
        $scope.SystemConfig = {};
        $scope.GetDeviceDateTime = function() {
            DataService.GetDeviceDateTime().then(
                function(result) {
                    var day = new Date(result.Year, result.Month - 1, result.Day, result.Hour, result.Minute, 0);
                    $scope.SystemConfig.DeviceDateTime = moment(day);

                }
            );
        }

        $scope.GetDeviceTimeZone = function() {
            DataService.GetDeviceTimeZone().then(
                function(result) {
                    $scope.DeviceTimeZone = result;
                }
            );
        }

        $scope.SetDeviceTimeZone = function() {

            DataService.SetDeviceTimeZone($scope.DeviceTimeZone.Id).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        $scope.Config.SystemSettingsForm.DeviceTimeZone.$setPristine();
                        $scope.SaveIndex++;
                        if ($scope.SaveIndex < $scope.SaveQ.length) {
                            $scope.SaveQ[$scope.SaveIndex]();
                        } else {
                            $scope.Config.SystemSettingsForm.$setPristine();
                            MessageService.HideBusy();
                        }

                    }
                }
            );
        }


        $scope.SetDeviceDateTime = function() {
            var mom = new moment($scope.SystemConfig.DeviceDateTime);


            var dt = {
                Year: mom.year(),
                Month: mom.month() + 1,
                Day: mom.date(),
                Hour: mom.hour(),
                Minute: mom.minute()
            };
            DataService.SetDeviceDateTime(dt).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        $scope.Config.SystemSettingsForm.DeviceDateTime.$setPristine();
                        $scope.SaveIndex++;
                        if ($scope.SaveIndex < $scope.SaveQ.length) {
                            $scope.SaveQ[$scope.SaveIndex]();
                        } else {
                            $scope.Config.SystemSettingsForm.$setPristine();
                            MessageService.HideBusy();
                        }

                    }
                }
            );
        }
        // end date and time 

        // sntp


        $scope.SetSntpSettings = function() {

            DataService.SetSntpSettings($scope.SntpSettings).then
            (
                function(result) {
                    if (!result.result) {
                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                    } else {

                        $scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Enabled.$setPristine();
                        if ($scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Address != null)
                            $scope.Config.SystemSettingsForm.AvfConfig_SntpSettings_Address.$setPristine();
                        $scope.SaveIndex++;
                        if ($scope.SaveIndex < $scope.SaveQ.length) {
                            $scope.SaveQ[$scope.SaveIndex]();
                        } else {
                            $scope.Config.SystemSettingsForm.$setPristine();
                            MessageService.HideBusy();
                        }


                    }
                }
            );
        }


        $scope.GetSntpSettings = function() {
            DataService.GetSntpSettings().then(
                function(result) {

                    $scope.SntpSettings = result;
                }
            );
        }


        // end sntp


        $scope.ShowCECMessage = function() {
            MessageService.ShowAcknowledge(JavaScriptConstants.CECDriverNoticeHeader, JavaScriptConstants.CECDriverNoticeMessage, Alert.Warning);
        }

        $scope.ShowCrestronConnectedMessage = function() {
            MessageService.ShowAcknowledge(JavaScriptConstants.CrestronConnectedDriverNoticeHeader, JavaScriptConstants.CrestronConnectedDriverNoticeMessage, Alert.Warning);
        }


        $scope.noBusy = false;
        $scope.NoBusyMesssageDuringSave = function() {
            $scope.noBusy = true;
        }

        $scope.ShowBusy = function(msg) {
            if ($scope.noBusy)
                return;
            MessageService.ShowBusy(msg);
        }

        $scope.AskConfirmActivate = function() {
            $rootScope.$broadcast(Subscriptions.AskConfirmActivate);
        }
        $scope.AskConfirmRevert = function() {
            $rootScope.$broadcast(Subscriptions.AskConfirmRevert, Subscriptions.AskConfirmRevert);
        }

        $scope.EditDeviceChanged = function() {
            if ($scope.Config.EditDeviceForm != null)
                $scope.Config.EditDeviceForm.$setDirty();
        }


        $scope.$on(Subscriptions.NewDeviceMessage, function(event, installAction, deviceid) {
            switch (installAction) {
                case Enums.InstallAction.Done:
                    $scope.CompleteNewDeviceWorkflow();
                    break;
                case Enums.InstallAction.Cancel:
                    $scope.DeleteDevice(DefaultRoomId, deviceid);
                    break;
                case Enums.InstallAction.Back:
                    $scope.DeleteDevice(DefaultRoomId, deviceid);
					if (($scope.NewDevice.UnionId != null) && ($scope.NewDevice.UnionId != ""))
						$scope.NewDevice.UnionId = atob($scope.NewDevice.UnionId);
                    $scope.ShowAddDevice(false);
                    break;
            }
        });

        $scope.$on(Subscriptions.EditDeviceMessage, function(event, installAction) {
            switch (installAction) {
                case Enums.InstallAction.Done:
                    $scope.CompleteEditDeviceWorkflow();
                    break;
                case Enums.InstallAction.Test:
                    $scope.ShowTestDevice($scope.CurrentDeviceId, $scope.devicetitle);
                    break;
                case Enums.InstallAction.Back:
                    $scope.ShowEditDevice($scope.CurrentDeviceId);
                    break;
            }
        });


        $scope.SyncRelayBehavior = function(indx) {

            if (($scope.RelayConfig.RelayConfigData[indx].RelayPortId == "") || (($scope.RelayConfig.RelayConfigData[indx].RelayPortId == null)))
                $scope.RelayConfig.RelayConfigData[indx].RelayBehaviorEnum = RelayBehavior.Disable;


        }

        $scope.StartCheckingForServerOnline();


        

        $scope.$on(Subscriptions.DeviceStatus, function(event , deviceStatuses) {

            console.log(JSON.stringify(deviceStatuses));
            deviceStatuses.forEach(function(item) {
                
                var device = $scope.Devices.find(function(x) { return x.DeviceId == item.DeviceId; });
                if (device != null)
                    device.Status = item.Status;

            });

            
        });
        
        
        $scope.dummyData = function() {
            $scope.NewDevice.UnionId = "crestron";
            $scope.NewDevice.Username = "ewellens";
            $scope.NewDevice.IpId = "a1";
            $scope.NewDevice.DisplayName = "name";

            $scope.NewDevice.DeviceType = "AvDisplay";
            //$scope.NewDevice.DeviceType = "AirMedia";
            //$scope.NewDevice.DeviceType = "ButtonPanel";
            $scope.GetDeviceModelsFromType($scope.NewDevice.DeviceType);

            $scope.NewDevice.DeviceModel = "Crestron CEC Controlled-Display";
            //$scope.NewDevice.DeviceModel = "AM-100";
            //$scope.NewDevice.DeviceModel = "MP-B10 IPID";
            $scope.UpdateModelConfig($scope.NewDevice.DeviceModel);
            $scope.NewDevice.RADInputName = "Hdmi1";
            $scope.NewDevice.DevicePort = "Hd-Md6X24-K-e_1_1_Cec";


        }

        


        // bottom close
    });
    
    

    