// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



angular.module('AVF')
    .constant("HttpStatus", {
        ConnectionRefused: -1,
        UnAuthorized: 401,
        Forbidden: 403,
        ServiceUnavailable: 503,
        IntnernalServerError: 500,
});

angular.module('AVF')
    .constant("Subscriptions", {
        ConfirmSystemConfigured: "ConfirmSystemConfigured",
        ConfigurationChanged:"ConfigurationChanged",
        StartCheckingForServerOnline:"StartCheckingForServerOnline",
        ServerOnline:"ServerOnline",
        ServerOffline:"ServerOffline",
        OnGetDevicesCompleted:"OnGetDevicesCompleted",
        OnGetSupportedDevicesCompleted:"OnGetSupportedDevicesCompleted",
        AskConfirmActivate:"AskConfirmActivate",
        AskConfirmRevert:"AskConfirmRevert",
        NewDeviceMessage:"NewDeviceMessage",
        EditDeviceMessage:"EditDeviceMessage",
        DeviceStatus:"DeviceStatus",
        ShowDeviceStatusDialog:"ShowDeviceStatusDialog",
        });



angular.module('AVF')
    .constant("SchedulingType", {
        Fusion: 'Fusion',
        Exchange: 'Exchange',
        Google: 'Google'
    });
    
angular.module('AVF')
    .constant("SchedulingType", {
        Fusion: 'Fusion',
        Exchange: 'Exchange',
        Google: 'Google'
    });


angular.module('AVF')
    .constant("MessageType", {
        Status: 'Status',
        Driver: 'Driver'
    });

angular.module('AVF')
    .constant("DeviceOnlineStatus", {
        Online: 'Online',
        Offline: 'Offline',
        Unknown: 'Unknown'
    });


angular.module('AVF')
    .constant("Alert", {
        Warning: 'alert alert-warning',
        Error: 'alert alert-danger',
        Sucess: 'alert alert-success',
        Info: 'alert alert-info',
    });
    
angular.module('AVF')
    .constant("PortType", {
        Ir: 'Ir',
        Serial: 'Serial',
        Cec: 'Cec',
        Usb: 'Usb',
        Relay: 'Relay'
    });
    
angular.module('AVF')
    .constant("SwitchChannelState", {
        Disabled: 'Disabled',
        Enabled: 'Enabled',
        EnabledDefault: 'EnabledDefault'
    });
    
angular.module('AVF')
    .constant("DeviceInstallStatus", {
        Unknown: 'Unknown',
        Busy: 'Busy',
        Failed: 'Failed',
        Success: 'Success'
    });
    

    
angular.module('AVF')
    .constant("SystemState", {
        UnKnown: 'UnKnown',
        UnConfigured: 'UnConfigured',
        Configuring: 'Configuring',
        Configured: 'Configured'
    });
    
angular.module('AVF')
    .constant("RelayBehavior", {
        Disable: 'Disable',
        Latching: 'Latching',
        Momentary: 'Momentary'
    });

    
angular.module('AVF')
    .constant("LdapAuthentication", {
        Kerberos: 'Kerberos',
        KerberosServer: 'KerberosServer',
        Server: 'Server'
    });
    
    
    angular.module('AVF')
    .constant("DeviceTransport", {
            Unknown: 'Unknown',
            None: 'None',
            CrestronIpId: 'CrestronIpId',
            CrestronInternal: 'CrestronInternal',   
            CrestronIp: 'CrestronIp',
            CrestronIpPort: 'CrestronIpPort',
            IpPort: 'IpPort',
            Ip: 'Ip',
            IpPortChannel: 'IpPortChannel',
            IpChannel: 'IpChannel',
            Serial: 'Serial',
            SerialChannel: 'SerialChannel',
            SerialBaud: 'SerialBaud',
            SerialBaudChannel: 'SerialBaudChannel',
            SerialBaudCustom: 'SerialBaudCustom',
            Ir: 'Ir',
            Cec: 'Cec',
            CrestronUsb: 'CrestronUsb',
            CrestronCrestnet:'CrestronCrestnet',
            
        });
        
        /////////////
        
angular.module('AVF')
    .constant("ChannelType", {
        Undefined:'Undefined',
        Hdmi:'Hdmi',
        HdmiVga:'HdmiVga',
        HdmiVgaBnc:'HdmiVgaBnc',
        Vga:'Vga',
        Dvi:'Dvi',
        Dm:'Dm',
        DmHdmi:'DmHdmi',
        SingleModeFiber:'SingleModeFiber',
        Fiber:'Fiber',
        Audio:'Audio',
        Sip:'Sip',
        Composite:'Composite',
        DisplayPort:'DisplayPort',
        Aec:'Aec',
        Codec:'Codec'
            });
        
        /////////////
        
        
        
    angular.module('AVF')
    .constant("SwitcherOutputRouteType", {
            Manual: 'Manual',
            Fixed: 'Fixed',
            Follow: 'Follow',   
          });
          
    angular.module('AVF')
    .constant("ConnectionStates", {
            NotRegistered: 'NotRegistered',
            NotConnected: 'NotConnected',
            Connected: 'Connected',   
            Retry: 'Retry',  
          });
          

    angular.module('AVF')
    .constant("LdapSearchResultState", {
            None: 'None',
            Busy: 'Busy',
            Complete: 'Complete',  
          });

          
    angular.module('AVF')
    .constant("SwitcherOutputAudioRouteType", {
            Follows: 'Follows',
            FollowWithVolumeControl: 'FollowWithVolumeControl',
            None: 'None',   
          });
          
angular.module('AVF')
    .constant("Enums", {
    InstallAction: {
        Cancel:"Cancel",
        Done:"Done",
        Back:"Back",
        Test:"Test",
    }
});
angular.module('AVF')
    .constant("Const", {
        ShowCompleteDelay: 1000,
        CountUpdateDownSeconds: 5,
        StartCheckingServerStatusDelay: 1000,
        ForwardToLoginAfterResetDelay: 15000,
        ServerOfflinePollInterval: 20000,
        ServerOfflineRequestTimeout: 2000,
        Label : {
                    Success:"label label-success",
                    Danger:"label label-danger",
                }
                ,
        StatusMessageName: "StatusMessage",
        MaxUsers: 5,
        BusyFlashTime: 1000,
        DisplayDriverMessageTime: 7000,
        WarningMessagePollInterval: 5000,
        DeviceStatusMode: {
                Install:"Install",
                Test:"Test",
        },
        Dialogs : {
            DeviceStatusDialog :"DeviceStatusDialog",
            AddDeviceDialog:"AddDeviceDialog",
            EditDeviceDialog:"EditDeviceDialog",
        }
});
        


     angular.module('AVF')
        .constant("DefaultRoomId", 1);
     
     
     angular.module('AVF')
        .constant("MaxConfigUploadSize", 20000000);
     
     angular.module('AVF')
        .constant("MaxCertUploadSize", 2500000);
     
     angular.module('AVF')
        .constant("MaxDriverUploadSize", 10000000);
        
     angular.module('AVF')
        .constant("LogPollingInterval", 1000);
     
     angular.module('AVF')
        .constant("ConfigExtension", "ZIP");
        
        
 angular.module('AVF')
    .constant("DeviceType", {
        Switcher: 'Switcher',
        EndpointTx: 'EndpointTx',
        EndpointRx: 'EndpointRx',
        EndpointRxScaler: 'EndpointRxScaler',
        AvDisplay: 'AvDisplay',
        Projector: 'Projector',
        Bluray: 'Bluray',
        CableTv: 'CableTv',
		VideoServer: 'VideoServer',
        AirMedia: 'AirMedia',
        ButtonPanel: 'ButtonPanel',
        Panel: 'Panel',
        Occupancy: 'Occupancy',
        Keypad: 'Keypad'
        
    }).run(function($rootScope, DeviceOnlineStatus, DeviceType, DeviceTransport, DefaultRoomId, PortType, MaxCertUploadSize,MaxDriverUploadSize,MaxConfigUploadSize,Alert,ConfigExtension ,LogPollingInterval,SwitchChannelState, SystemState, Const, SchedulingType, SwitcherOutputRouteType , SwitcherOutputAudioRouteType, ChannelType, ConnectionStates, LdapSearchResultState, LdapAuthentication, Subscriptions, HttpStatus , MessageType,DeviceInstallStatus, Enums, RelayBehavior)
    {
        $rootScope.DeviceOnlineStatus = DeviceOnlineStatus;
        $rootScope.DeviceType = DeviceType;
        $rootScope.DeviceTransport = DeviceTransport;
        $rootScope.DefaultRoomId = DefaultRoomId;
        $rootScope.PortType = PortType;
        
        $rootScope.Alert = Alert;
        $rootScope.ConfigExtension = ConfigExtension;
        $rootScope.LogPollingInterval = LogPollingInterval;
        $rootScope.SwitchChannelState= SwitchChannelState;
        $rootScope.SystemState = SystemState;
        $rootScope.Const = Const;
        $rootScope.SchedulingType = SchedulingType;
        $rootScope.SwitcherOutputRouteType = SwitcherOutputRouteType;
        $rootScope.SwitcherOutputAudioRouteType = SwitcherOutputAudioRouteType;
        $rootScope.MaxCertUploadSize =MaxCertUploadSize ;
        $rootScope.MaxConfigUploadSize =MaxConfigUploadSize ;
        $rootScope.MaxDriverUploadSize = MaxDriverUploadSize;
        $rootScope.ChannelType = ChannelType;
        $rootScope.ConnectionStates = ConnectionStates;
        $rootScope.LdapSearchResultState = LdapSearchResultState;
        $rootScope.LdapAuthentication = LdapAuthentication;
        $rootScope.Subscriptions = Subscriptions;
        $rootScope.HttpStatus= HttpStatus;
        $rootScope.MessageType= MessageType;
        $rootScope.DeviceInstallStatus = DeviceInstallStatus;
        $rootScope.Enums = Enums;
        $rootScope.RelayBehavior = RelayBehavior;
        
    });
        
        
        ;
    
