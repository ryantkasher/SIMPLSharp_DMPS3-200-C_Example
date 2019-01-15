app.controller('ActivationController', function($scope, DataService, MessageService, JavaScriptConstants, $rootScope, Const, DefaultRoomId, Alert, $timeout, $window, SystemState, Subscriptions) {

// Global Activation

    $scope.createButtonMessage = function () {


        var activatePlaceholder = $('#activatePlaceholder');
        var revertPlaceholder = $('#revertPlaceholder');
        if ((revertPlaceholder.length == 0) || (revertPlaceholder.length == 0))
            return;

        var but = $('<button class="activateButton" >' + JavaScriptConstants.Activate + '</button>').click(function() {
            $scope.AskConfirmActivate(DefaultRoomId);
        });

        var but2 = $('<button class="activateButton" >' + JavaScriptConstants.Revert + '</button>').click(function() {
            $scope.AskConfirmRevert();
        });

        activatePlaceholder.replaceWith(but);
        revertPlaceholder.replaceWith(but2);

    }
        $scope.createButtonMessage();
        $scope.$on(Subscriptions.ConfirmSystemConfigured, $scope.createButtonMessage);



        

        $scope.SetSystemConfiguringMessage = function() {
            var msg = $("#ConfiguredMessage");
            if (msg.length == 0)
                return;
            
            Const.Label.Success.split(' ').forEach(function(item) {
                msg.removeClass(item);
            });

            Const.Label.Danger.split(' ').forEach(function(item) {
                msg.removeClass(item);
            });

            Const.Label.Danger.split(' ').forEach(function(item) {
                msg.addClass(item);
            });

            msg.html(JavaScriptConstants.ConfiguredMessageOffline);
            $timeout(function() { $rootScope.$broadcast("ConfirmSystemConfigured", "ConfirmSystemConfigured"); }, 1000);

        }



        $scope.$on(Subscriptions.ConfigurationChanged, function() {
            $scope.SetSystemConfiguringMessage();
            $window.currentSystemState = SystemState.Configuring;
        });


        $scope.AskConfirmActivate = function(roomId) {
            if (roomId == undefined)
                roomId = DefaultRoomId;
            MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.ActivateConfigWarning, Alert.Warning,
                function() { $scope.Activate(roomId); });
        }

        $scope.AskConfirmRevert = function() {

            MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.RevertConfigWarning, Alert.Warning,
                function() { $scope.Revert(); }
            );
        }

        $scope.Activate = function(roomId) {
            
            MessageService.HideConfirm();
            MessageService.ShowBusy(JavaScriptConstants.ServerUpdateMessage);
            DataService.Activate(roomId).then(function(result) {
                $rootScope.$broadcast(Subscriptions.StartCheckingForServerOnline, Subscriptions.StartCheckingForServerOnline);
            });
        }

        $scope.Revert = function() {
            MessageService.ShowBusy(JavaScriptConstants.ServerUpdateMessage);
            DataService.Revert().then(function(result) {
            $rootScope.$broadcast(Subscriptions.StartCheckingForServerOnline, Subscriptions.StartCheckingForServerOnline);
            });
        }

        $scope.$on(Subscriptions.AskConfirmRevert, function() {
            console.log(Subscriptions.AskConfirmRevert);
            $scope.AskConfirmRevert();
        });

        $scope.$on(Subscriptions.AskConfirmActivate, function() {
                $scope.AskConfirmActivate(DefaultRoomId);
            }
        );

        $scope.$on(Subscriptions.AskConfirmRevert, function() {
            console.log(Subscriptions.AskConfirmRevert);
            $scope.AskConfirmRevert();
        });
        
// end Global Activation

    /// end 
});