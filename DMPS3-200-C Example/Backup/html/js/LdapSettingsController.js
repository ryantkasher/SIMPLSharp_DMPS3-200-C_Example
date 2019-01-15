app.controller('LdapSettingsController', function($scope, DataService, MessageService, $interval, NgTableParams, ConnectionStates, LdapSearchResultState, JavaScriptConstants, LdapAuthentication) {


$scope.searchRegEx = /^(\(.*\%QUERY\%.*\))$/;
//(%QUERY%)


// ldap
$scope.GetLdapSettings = function(roomId) {
    DataService.GetLdapSettings(roomId).then(
                function(resultData) {
                    $scope.LdapSettings = resultData;
                    $scope.LdapSettings.Password = 'xxxx';

                });
}



$scope.SaveLdapSettings = function(roomId) {
    ;
    var ldapSettings = angular.copy($scope.LdapSettings);
    if (!$scope.Config.LdapSettingsForm.LdapSettings_Password.$dirty)
        ldapSettings.Password = '';
    $scope.StopPollingLdapConnected();
    DataService.SaveLdapSettings(ldapSettings, roomId).then
                        (
                            function(result) {
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                } else {
                                    if ($scope.Config.LdapSettingsForm != null)
                                        $scope.Config.LdapSettingsForm.$setPristine();
                                    $scope.removeUnloadEvent();
                                    $scope.StartPollingLdapConnected();

                                }
                            }
                        );
}

$scope.CalletLdapSettingsSaveDisabled = function() {
    $scope.GetLdapSettingsSaveDisabled();
}




    $scope.GetLdapSettingsSaveDisabled = function() {

    if (!$scope.Config.LdapSettingsForm.$dirty)
        return true;

  

            if (
                    (!$scope.Config.LdapSettingsForm.LdapSettings_Username.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_Search.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_DisplayAttribute.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_LocationAttribute.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_DepartmentAttribute.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_PhoneAttribute.$valid) ||
                    (!$scope.Config.LdapSettingsForm.LdapSettings_Dn.$valid)

                )
        return true;

    if (($scope.LdapSettings.AuthenticationMethod == LdapAuthentication.Server) || ($scope.LdapSettings.AuthenticationMethod == LdapAuthentication.KerberosServer)) {
            if (!$scope.Config.LdapSettingsForm.LdapSettings_Host.$valid)
                return true;
        } else {
            if (!$scope.Config.LdapSettingsForm.LdapSettings_Domain.$valid)
                return true;
        }


    if (($scope.Config.LdapSettingsForm.LdapSettings_Password.$dirty) && (!$scope.Config.LdapSettingsForm.LdapSettings_Password.$valid))
        return true;
    return false;
}


$scope.LdapConnectionState = ConnectionStates.NotConnected;
$scope.ConnectResults = function() {
    DataService.ConnectResults().then
                        (
                            function(result) {
                                $scope.LdapConnectionState = result;
                                if (($scope.LdapConnectionState == ConnectionStates.Connected) || ($scope.LdapConnectionState == ConnectionStates.NotRegistered))
                                    $scope.StopPollingLdapConnected();
                                console.log("ConnectResults returned.." + $scope.LdapConnectionState);
                            }
                        );
}
$scope.LdapSearch = {};
$scope.LdapSearch.SearchFor = '';
$scope.SearchLdap = function() {
    $scope.LdapResults = null;
    if (($scope.ldapTableParams != null) && ($scope.ldapTableParams.settings != null)) {
        $scope.ldapTableParams.settings().dataset = [];
        $scope.ldapTableParams.reload();
    }

    DataService.SearchLdap($scope.LdapSearch.SearchFor).then
                    (
                    function(result) {
                        if (result.result) {
                            $scope.StartPollingLdapSearchResults();
                            $scope.ldapSearchBusy = true;
                        }

                        console.log("SearchLdap returned.." + result.result);
                    }
                );
}

$scope.ldapSearchBusy = false;
$scope.ldapTableParams= {};
$scope.ShowLdapSearchResults = function() {
    $scope.ldapSearchBusy = false;
    $scope.ldapTableParams = new NgTableParams({
        page: 1,   // show first page
        count: 5  // count per page
    }, {
        counts: [], // hide page counts control
        dataset: $scope.LdapResults.results
    });



    $scope.StopPollingLdapSearchResults();
}

$scope.LdapSearchResults = function() {
    DataService.LdapSearchResults().then
                        (
                            function(result) {
                                $scope.LdapResults = result;
                                if (result.State == LdapSearchResultState.Complete)
                                    $scope.ShowLdapSearchResults();

                                console.log("SearchLdap LdapSearchResults.." + result.State);
                            }
                        );
}

$scope.stopLdapConnectionPoll = null;
$scope.StartPollingLdapConnected = function() {

    if ($scope.stopLdapConnectionPoll != null)
        return;

    $scope.stopLdapConnectionPoll = $interval(
                function() { console.log("Connection Polling"); $scope.ConnectResults(); }
                , 1000);
}
$scope.StopPollingLdapConnected = function() {
    $interval.cancel($scope.stopLdapConnectionPoll);
    $scope.stopLdapConnectionPoll = null;

}

$scope.stopLdapSearchPoll = null;
$scope.StartPollingLdapSearchResults = function() {

    if ($scope.stopLdapSearchPoll != null)
        return;

    $scope.stopLdapSearchPoll = $interval(
                function() { console.log("Search Polling"); $scope.LdapSearchResults(); }
                , 1000);
}
$scope.StopPollingLdapSearchResults = function() {
    $interval.cancel($scope.stopLdapSearchPoll);
    $scope.stopLdapSearchPoll = null;

}

$scope.ShowSearchLdapDialog = function() {


    $scope.LdapQuery = null;

    $('#SearchLdapDialog').on('hidden.bs.modal', function(e) {
        $scope.StopPollingLdapSearchResults();
        $scope.ldapSearchBusy = false;
    })
    $("#SearchLdapDialog").modal('show').css(
           {

               'margin-left': function() { //Horizontal centering

                   return (($(window).width() - $(this).width()) / 2);
               }
           });


    $("#SearchLdapDialog").modal({ keyboard: true });

}


$scope.EnableLdap = function(roomId) {

    console.log("LdapSettings.Enabled=" + $scope.LdapSettings.Enabled);

    DataService.EnableLdap($scope.LdapSettings.Enabled, roomId).then
                        (
                            function(result) {
                                if (!result.result) {
                                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                }
                            }
                        );
}

$scope.LdapAuthenticationChoices = [];

$scope.GetLdapAuthenticationChoices = function() {
    DataService.GetLdapAuthenticationChoices().then(function(result) {
        $scope.LdapAuthenticationChoices = result;

    });
}


// end ldap
    
    /// end 
});