// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";
app.service("TestService", function() {

this.Hello = function(str) { alert(str); }

});

 app.service("DataService",
            function($http, $q ,  MessageService ,JavaScriptConstants, Alert,$rootScope , Subscriptions , OnlineOfflineService, HttpStatus) {
            
                
                return({
                    GetRoomStatus: GetRoomStatus,
                    GetDeviceIcons:GetDeviceIcons,
                    GetOutputsView:GetOutputsView,
                    SaveInputOutputsView:SaveInputOutputsView,
                    GetChannelTypeOptions:GetChannelTypeOptions,
                    GetInputsView:GetInputsView,
                    GetEndpointsView:GetEndpointsView,
                    GetSupportedDevices:GetSupportedDevices,
                    GetDeviceTypeChoices:GetDeviceTypeChoices,
                    GetDevices:GetDevices,
                    SaveNewDevice:SaveNewDevice,
                    DeleteDevice:DeleteDevice,
                    GetTransportTypeOptions:GetTransportTypeOptions,
                    GetScalerOutputResolutionTypeChoices:GetScalerOutputResolutionTypeChoices,
                    GetScalerOutputResolution4KTypeChoices:GetScalerOutputResolution4KTypeChoices,
                    GetScalerOutputDisplayModeTypeChoices:GetScalerOutputDisplayModeTypeChoices,
                    GetPorts:GetPorts,
                    GetBaudRateChoices:GetBaudRateChoices,
//                    GetRoomDetails:GetRoomDetails,
//                    SaveRoomDetails:SaveRoomDetails,
                    GetLocaleChoices:GetLocaleChoices,
                    SaveLocale:SaveLocale,
                    GetLocale:GetLocale,
                    GetDateFormatChoices:GetDateFormatChoices,
                    GetAvfConfig:GetAvfConfig,
                    DownloadConfiguration:DownloadConfiguration,
                    Activate:Activate,
                    GetActivityLog:GetActivityLog,
                    SaveEditDevice:SaveEditDevice,
                    SaveDialerSettings:SaveDialerSettings,
                    SaveFusionConfig:SaveFusionConfig,
                    SaveRoomConfig:SaveRoomConfig,
                    SaveSystemConfig:SaveSystemConfig,
                    SetFusionEnabled:SetFusionEnabled,
                    SetDialerEnabled:SetDialerEnabled,
                    GetRelayConfig:GetRelayConfig,
                    SetRelayEnabled:SetRelayEnabled,
                    SaveRelayConfig:SaveRelayConfig,
                    SetLightingEnabled:SetLightingEnabled,
                    SaveLightingSettings:SaveLightingSettings,
                    GetSwitchChannelStateChoices:GetSwitchChannelStateChoices,
                    GetFusionConfig:GetFusionConfig,
                    Revert:Revert,
                    Apply:Apply,
                    GetUsedIpIds:GetUsedIpIds,
                    GetAssociatedChannelChoices:GetAssociatedChannelChoices,
                    GetAssociatedChannelDevices:GetAssociatedChannelDevices,
                    GetSchedulingSettings:GetSchedulingSettings,
                    SaveSchedulingSettings:SaveSchedulingSettings,
                    GetUxGeneralCustomization:GetUxGeneralCustomization,
                    SaveUxGeneralCustomization:SaveUxGeneralCustomization,
                    GetPresentationScreenCustomization:GetPresentationScreenCustomization,
                    SavePresentationScreenCustomization:SavePresentationScreenCustomization,
                    GetTimeZoneChoices:GetTimeZoneChoices,
                    GetRoomScheduleScreenCustomization:GetRoomScheduleScreenCustomization,
                    SaveRoomScheduleScreenCustomization:SaveRoomScheduleScreenCustomization,
                    GetBackgroundUrlLabels:GetBackgroundUrlLabels,
                    SetFusionCloudUrlEnabled:SetFusionCloudUrlEnabled,
                    GetSchedulingTypeChoices:GetSchedulingTypeChoices,
                    SetScheduleEnabled:SetScheduleEnabled,
                    SetSchedulingType:SetSchedulingType,
                    SetOutlookPassword:SetOutlookPassword,
                    GetDefaultInputChoices:GetDefaultInputChoices,
                    GetStandbyModeChoices:GetStandbyModeChoices,
                    GetDriversStatus:GetDriversStatus,
                    GetUsers:GetUsers,
                    GetUser:GetUser,
                    SaveUser:SaveUser,
                    DeleteUser:DeleteUser,
                    GetS:GetS,
                    GetSwitcherOutputAudioRouteTypeChoices:GetSwitcherOutputAudioRouteTypeChoices,
                    GetSwitcherOutputRouteTypeChoices:GetSwitcherOutputRouteTypeChoices,
                    EnableDrivers:EnableDrivers,
                    DisableDrivers:DisableDrivers,
                    DeleteDrivers:DeleteDrivers,
                    SetDeviceDateTime:SetDeviceDateTime, 
                    SetDeviceTimeZone:SetDeviceTimeZone,
                    GetDeviceDateTime:GetDeviceDateTime,
                    GetDeviceTimeZone:GetDeviceTimeZone,
                    SaveAdvancedRoutingSettings:SaveAdvancedRoutingSettings,
                    IsWarningAvailable:IsWarningAvailable,
                    GetNextWarning:GetNextWarning, 
                    SetSntpSettings:SetSntpSettings,
                    GetSntpSettings:GetSntpSettings,
                    GetLdapSettings:GetLdapSettings,
                    SaveLdapSettings:SaveLdapSettings,
                    ConnectResults:ConnectResults,
                    SearchLdap:SearchLdap,
                    LdapSearchResults:LdapSearchResults,
                    EnableLdap:EnableLdap,
                    GetLdapAuthenticationChoices:GetLdapAuthenticationChoices,
                    GetDevicesStatus:GetDevicesStatus,
                    GetTestableDisplayCommands :GetTestableDisplayCommands ,
                    SendDeviceCommand:SendDeviceCommand,
                    GetLastCreatedDeviceId:GetLastCreatedDeviceId,
               });

// todo group enum calls into master object one call


                function GetDevicesStatus(roomId , deviceIds, detailed) {
                    var request = $http({
                        method: "post",
                        data: { "command": "GetDevicesStatus", "deviceids": encodeURIComponent(angular.toJson(deviceIds)), "roomid": roomId, "detailed" : detailed ,  "cacheKill": new Date().getTime() },
                        url: "DeviceDataController",
                    });
                    return( request.then( handleSuccess, handleError ) );                    
                }

                
                
                function GetLastCreatedDeviceId() {
                      var request = $http({
                        method: "get",
                        params: { "command" : "GetLastCreatedDeviceId" ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                        return( request.then( handleSuccess, handleError ) );                    
                }
                
                function GetLdapAuthenticationChoices() {
                      var request = $http({
                        method: "get",
                        params: { "command" : "GetLdapAuthenticationChoices" ,"cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );                    
                }

                function GetActivityLog(id ,filterType, filterExpression) 
                {
                      var request = $http({
                        method: "get",
                        params: { "id" : id, "filtertype" :filterType, "filterexpression": filterExpression,  "cacheKill": new Date().getTime()},
                        url: "LoggerController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function EnableLdap(enabled, roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "EnableLdap", "enabled" : enabled,"roomid":roomId , "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                function SearchLdap(query, roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "SearchLdap", "query" : encodeURIComponent(query), "roomid":roomId ,  "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                function LdapSearchResults() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "LdapSearchResults",  "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                
                
                function GetDriversStatus(devicetype) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDriverList", "devicetype" : devicetype, "cacheKill": new Date().getTime()},
                        url: "DynamicDriver",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                function ConnectResults() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "ConnectResults", "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }


                function DisableDrivers (driverId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "DisableDrivers", "driverid" : driverId, "cacheKill": new Date().getTime()},
                        url: "DynamicDriver",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }            
                
                function EnableDrivers (driverId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "EnableDrivers", "driverid" : driverId, "cacheKill": new Date().getTime()},
                        url: "DynamicDriver",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }      
                
                function DeleteDrivers(driverId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "DeleteDrivers", "driverid" : driverId, "cacheKill": new Date().getTime()},
                        url: "DynamicDriver",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }            
                
                
           
                
                
                function GetRoomStatus(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetRoomStatus", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function Revert() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "Revert", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function Activate(roomId) {
                    console.log("DataServices Activate");
                    var request = $http({
                        method: "get",
                        params: {"command": "Activate", "roomid" :roomId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function Apply() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "Apply",  "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                
                
                function DownloadConfiguration() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "DownloadConfiguration", "cacheKill": new Date().getTime() },
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                

                
                function GetBaudRateChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetBaudRateChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetSwitchChannelStateChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSwitchChannelStateChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetDefaultInputChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDefaultInputChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetStandbyModeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetStandbyModeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                


                function GetSwitcherOutputAudioRouteTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSwitcherOutputAudioRouteTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetSwitcherOutputRouteTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSwitcherOutputRouteTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                function GetSchedulingTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSchedulingTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                
                
                function GetAvfConfig(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetAvfConfig", 'roomid':roomId,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                    return( request.then( handleSuccess, handleError ) );
                }                
                
//                function GetRoomDetails(roomId) {
//                    
//                    var request = $http({
//                        method: "get",
//                        params: {"command": "GetRoomDetails", 'roomid':roomId,"cacheKill": new Date().getTime()},
//                        url: "DeviceDataController",
//                    });
//                
//                    return( request.then( handleSuccess, handleError ) );
//                }                
                
                

                
                
                function GetRelayConfig(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetRelayConfig","roomid": roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                
                
                function GetTransportTypeOptions() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetTransportTypeOptions", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                


                function GetDevices(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDevices", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                

                
                
                function GetEndpointsView(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetEndpointsView", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetFusionConfig(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetFusionConfig", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                function GetUsedIpIds(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetUsedIpIds", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                
           
                
                function GetChannelTypeOptions() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetChannelTypeOptions", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                     
                return( request.then( handleSuccess, handleError ) );
                }
                



                
                function IsWarningAvailable() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "IsWarningAvailable", "cacheKill": new Date().getTime()},
                        url: "WarningController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetNextWarning() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetNextWarning", "cacheKill": new Date().getTime()},
                        url: "WarningController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetDeviceIcons() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDeviceIcons", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                function GetOutputsView(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetOutputsView", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                


                function GetInputsView(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetInputsView", "roomid" : roomId, "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                


                function GetSupportedDevices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSupportedDevices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                
                

                function GetSntpSettings() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSntpSettings", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                


                function GetLdapSettings(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetLdapSettings", 'roomid': roomId, "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                



                function GetDeviceTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDeviceTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                
                
                function GetLocale() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetLocale", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                

                function GetDeviceDateTime() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDeviceDateTime", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                function GetDeviceTimeZone() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDeviceTimeZone", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                
                function GetSchedulingSettings(roomId ) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetSchedulingSettings", "roomid":roomId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                
                
                function GetUxGeneralCustomization(roomId ) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetUxGeneralCustomization", "roomid":roomId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetRoomScheduleScreenCustomization(roomId ) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetRoomScheduleScreenCustomization", "roomid":roomId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                                                                
                function GetPresentationScreenCustomization(roomId ) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetPresentationScreenCustomization", "roomid":roomId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                


                
                function GetDateFormatChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetDateFormatChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                
                
                function GetBackgroundUrlLabels() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetBackgroundUrlLabels", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                            
                

                
                function GetLocaleChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetLocaleChoices", "cacheKill": new Date().getTime()},
                        contentType: "application/json; charset=utf-8",
                        headers: {
                               "Accept": "application/json;charset=utf-8",
                               "Accept-Charset":"charset=utf-8"
                           },
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                


                function GetTimeZoneChoices(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetTimeZoneChoices", "roomid":roomId , "cacheKill": new Date().getTime()},
                        contentType: "application/json; charset=utf-8",
                        headers: {
                               "Accept": "application/json;charset=utf-8",
                               "Accept-Charset":"charset=utf-8"
                           },
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                                                




                function DeleteDevice(roomId , deviceId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "DeleteDevice","roomid":roomId , "deviceid" :deviceId ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }


                function SendDeviceCommand(roomId, deviceId, deviceCommand) {

                    var request = $http({
                        method: "post",
                        data: { "command": "SendDeviceCommand", "roomid": roomId, "deviceid": deviceId, "devicecommand": deviceCommand, "cacheKill": new Date().getTime() },
                        url: "DeviceDataController",

                    });

                    return(request.then(handleSuccess, handleError));
                }

                function SaveInputOutputsView(outView, inView) {

                    var request = $http({
                        method: "post",
                        data: {"command": "SaveInputOutputsView", "outview" : encodeURIComponent(angular.toJson(outView)) , "inview" : encodeURIComponent(angular.toJson(inView)) , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                        //headers: {"Content-Type": "application/x-www-form-urlencoded"}
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveLocale(locale) {

                    var request = $http({
                        method: "post",
                        data: {"command": "SaveLocale", "locale" : encodeURIComponent(locale)  , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                

                function SaveSystemConfig(AvfConfig) {
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveSystemConfig", "systemconfig" : encodeURIComponent(angular.toJson(AvfConfig))  ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveRoomConfig(RoomConfig) {
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveRoomConfig", "roomconfig" : encodeURIComponent(angular.toJson(RoomConfig))  ,"cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                
                function SaveSchedulingSettings(schedulingSettings, roomId) {
                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveSchedulingSettings", "schedulingsettings" : encodeURIComponent(angular.toJson(schedulingSettings))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                


                function SaveLdapSettings(ldapSettings, roomId) {
                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveLdapSettings", "ldapsettings" : encodeURIComponent(angular.toJson(ldapSettings))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "LdapSettings",
                    });
                  return( request.then( handleSuccess, handleError ) );
                }
                
                function SaveUxGeneralCustomization(uxGeneralCustomization, roomId) {
                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveUxGeneralCustomization", "uxgeneralcustomization" : encodeURIComponent(angular.toJson(uxGeneralCustomization))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveRoomScheduleScreenCustomization(roomScheduleScreenCustomization, roomId) {
                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveRoomScheduleScreenCustomization", "roomschedulescreencustomization" : encodeURIComponent(angular.toJson(roomScheduleScreenCustomization))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                
                function SavePresentationScreenCustomization(presentationScreenCustomization, roomId) {
                
                    var request = $http({
                        method: "post",
                        data: {"command": "SavePresentationScreenCustomization", "presentationscreencustomization" : encodeURIComponent(angular.toJson(presentationScreenCustomization))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveRelayConfig(RelayConfig, roomId) {
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveRelayConfig", "relayconfig" : encodeURIComponent(angular.toJson(RelayConfig))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveFusionConfig(FusionConfig, roomId) {
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveFusionConfig", "fusionconfig" : encodeURIComponent(angular.toJson(FusionConfig))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                  return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                
                
                
//                function SaveRoomDetails(roomDetails, roomId) {
//                    var request = $http({
//                        method: "post",
//                        data: {"command": "SaveRoomDetails", "roomdetails" : encodeURIComponent(angular.toJson(roomDetails))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
//                        url: "DeviceDataController",
//                    });
//                  return( request.then( handleSuccess, handleError ) );
//                }
                
                
                
                
                 function SetOutlookPassword(roomId, outlookPassword ) {

                    var request = $http({
                        method: "post",
                        data: {"command": "SetOutlookPassword", "outlookpassword" : encodeURIComponent(outlookPassword ) ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                        return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveEditDevice(editDevice, roomId) {

                    var request = $http({
                        method: "post",
                        data: {"command": "SaveEditDevice", "device" : encodeURIComponent(angular.toJson(editDevice))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                function SaveNewDevice(newDevice, roomId) {

                    var request = $http({
                        method: "post",
                        data: {"command": "SaveNewDevice", "newdevice" : encodeURIComponent(angular.toJson(newDevice))  ,"roomid": roomId , "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );
                }
                
                
                
                function GetScalerOutputResolutionTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetScalerOutputResolutionTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }          
                
                
                function GetScalerOutputResolution4KTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetScalerOutputResolution4KTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }          


                function GetTestableDisplayCommands() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetTestableDisplayCommands", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }

                function GetScalerOutputDisplayModeTypeChoices() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetScalerOutputDisplayModeTypeChoices", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }          


                function GetPorts(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetPorts", "roomid":roomId,  "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                      
                

                
                
                function handleError( response ) {
                    
                    if ( 
                            (response.status == HttpStatus.ConnectionRefused)||
                            (response.status == HttpStatus.ServiceUnavailable)
                            
                        )
                     {
                        OnlineOfflineService.StartCheckingForServerOnline();
                        MessageService.ShowBusy(JavaScriptConstants.SystemOffline);    
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    
                    if  ( (response.status == HttpStatus.UnAuthorized)|| (response.status == HttpStatus.Forbidden) )  {
                        location.reload(true);
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    MessageService.HideBusy();
                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.ServerCommunicationError,  Alert.Error);
                        
                    if (
                        ! angular.isObject( response.data ) ||
                        ! response.data.message
                        ) {
                        return( $q.reject( "An unknown error occurred." ) );
                    }
                    return( $q.reject( response.data.message ) );
                }
                
                
                
                
                function handleSuccess( response ) {

                    
                    return( response.data );
                }
                
                function handleSuccessDataChanged( response ) {

                    $rootScope.$broadcast(Subscriptions.ConfigurationChanged);
                    return( response.data );
                }



            function SaveLightingSettings(lightingConfig, roomId) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveLightingSettings", "lightingconfig" : encodeURIComponent(angular.toJson(lightingConfig)) , "roomid":roomId,   "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );      
            }

                
            function SaveDialerSettings(dialerConfig, roomId) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveDialerSettings", "dialerconfig" : encodeURIComponent(angular.toJson(dialerConfig)) , "roomid":roomId,   "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );      
            }
            
            function SaveAdvancedRoutingSettings(advancedRoutingSettings, channel, roomId) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveAdvancedRoutingSettings", "advancedroutingsettings" : encodeURIComponent(angular.toJson(advancedRoutingSettings)) , "channel":channel, "roomid":roomId,   "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccessDataChanged, handleError ) );      
            }
            
            



            function SetSntpSettings(sntpSettings) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SetSntpSettings", "sntpsettings" : encodeURIComponent(angular.toJson(sntpSettings)) ,    "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );      
            }
            
            function SetDeviceDateTime(dateTime) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SetDeviceDateTime", "devicedatetime" : encodeURIComponent(angular.toJson(dateTime)) ,    "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );      
            }
            
            function SetDeviceTimeZone(id) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SetDeviceTimeZone", "id" : encodeURIComponent(id) ,    "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );      
            }



            function SetLightingEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetLightingEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }

            function SetRelayEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetRelayEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }




            function SetSchedulingType(roomId ,schedulingType) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetSchedulingType", "roomid" : roomId, "schedulingtype" :schedulingType, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }


            function SetScheduleEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetScheduleEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }


            function SetFusionEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetFusionEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }
            
            
            function SetFusionCloudUrlEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetFusionCloudUrlEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }
            
            
            function SetDialerEnabled(roomId ,enabled) 
            {
                  var request = $http({
                    method: "get",
                    params: {"command": "SetDialerEnabled", "roomid" : roomId, "enabled" :enabled, "cacheKill": new Date().getTime()},
                    url: "DeviceDataController",
                });
            
            return( request.then( handleSuccessDataChanged, handleError ) );
            }
            
            


            function GetAssociatedChannelDevices(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetAssociatedChannelDevices", "roomid":roomId,  "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                      


            function GetAssociatedChannelChoices(roomId) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetAssociatedChannelChoices", "roomid":roomId,  "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }                      


                function GetUsers() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetUsers", "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                function GetUser(userName) {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "GetUsers","username": encodeURIComponent(userName), "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                function GetS() {
                    
                    var request = $http({
                        method: "get",
                        params: {"command": "S","cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );
                }
                
                
                function SaveUser(userData) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "SaveUser", "userdata" : encodeURIComponent(angular.toJson(userData)) ,  "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );      
            }
            
                function DeleteUser(userName) {

                
                    var request = $http({
                        method: "post",
                        data: {"command": "DeleteUser", "username" : encodeURIComponent(userName) ,   "cacheKill": new Date().getTime()},
                        url: "DeviceDataController",
                    });
                
                return( request.then( handleSuccess, handleError ) );      
            }


});