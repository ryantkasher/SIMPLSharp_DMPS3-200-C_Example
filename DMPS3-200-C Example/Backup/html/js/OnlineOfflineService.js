// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

app.service("OnlineOfflineService", function( $window , $rootScope , $http, $q, $interval, Const,Subscriptions, MessageService, JavaScriptConstants , HttpStatus )
{

    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;
    var state = true;
    //onlineStatus.isOnline = function()
    this.isOnline = function()
    {
        return onlineStatus.onLine;

    }
    this.intervalPromise = null;
    this.StartCheckingForServerOnline = function() {
        if ($rootScope.intervalPromise == null)
            $rootScope.intervalPromise =$interval(this.TestServerOnline, Const.ServerOfflinePollInterval);
        
    }
    this.StopCheckingForServerOnline = function() 
    {
        if ($rootScope.intervalPromise != null)
            $interval.cancel($rootScope.intervalPromise);
        $rootScope.intervalPromise = null;
    }
    this.TestServerOnline= function() {
        
         var request = $http({
            method: "get",
            params: {"cacheKill": new Date().getTime()},
            url: "PingController", 
            timeout:Const.ServerOfflineRequestTimeout,
        });
    
        return( request.then( handleSuccess, handleError ) );
    }
    

    $window.addEventListener("online", function()
    {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function()
    {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);
    
    handleError = function( response ) {
        console.log('ServerOffline');
        state = false;
        if ( 
        (response.status == HttpStatus.ConnectionRefused)||
        (response.status == HttpStatus.ServiceUnavailable)
        ) {
            MessageService.ShowBusy(JavaScriptConstants.SystemOffline);    
            $rootScope.$broadcast(Subscriptions.ServerOffline);            
        }

    }
    
    function handleSuccess( response ) {
        console.log('ServerOnline');
        if (!state) {
            location.reload(true);
            $rootScope.$broadcast(Subscriptions.ServerOnline);
        }
            
        state = true;
        MessageService.HideBusy();
        
    }


});