// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

app.controller("LoginController", ['$scope', '$log', '$http', '$window', 'MessageService', 'JavaScriptConstants', 'Alert', function($scope, $log, $http, $window, MessageService, JavaScriptConstants, Alert)
{
    this.user = {};
    $scope.user = this.user;
    $scope.user.username = "";
    $scope.user.password = "";
    $scope.authenticate = {};

    this.loginUser = function()
    {

        $http.get("/PageNotFound.html?cacheKill=" + new Date().getTime())
            .then(function(response) {
            
            $scope.actualLoginUser();
        });

    }

    $scope.actualLoginUser = function()
    {
        
        $log.info("This is a submit for " + $scope.user.username);

        $http.get("/LoginRest?request=a&username=" + $scope.user.username + "&cacheKill=" + new Date().getTime())
      .then(function(response)
      {
          $scope.authenticate = response.data;
          //$log.info("The salt is " + $scope.authenticate.Salt);
          // $log.info("The challenge is " + $scope.authenticate.Challenge);
          //  $log.info("The password is " + $scope.user.password);
          //  $log.info("Status is " + $scope.authenticate.Status);
          if ($scope.authenticate.Status)
          {
              var saltedpw = $scope.authenticate.Salt + $scope.user.password;
              var pwhash = CryptoJS.SHA1(saltedpw).toString(CryptoJS.enc.Hex);
             // $log.info("User hash  is " + pwhash);
              var token = CryptoJS.SHA1($scope.authenticate.Challenge + pwhash);
              var tokenhash = token.toString(CryptoJS.enc.Hex);
              RespondToChallenge(tokenhash, $scope.user.username);
          }
          else {

              MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.InvalidLogin, Alert.Error);
              $log.warn("Invalid user/password for " + $scope.user.username);
              
          }

      })
    };

    var RespondToChallenge = function(token, username)
    {
        $log.info("This in RespondToChallenge " + token);
        var url = "/LoginRest?request=t&username=" + $scope.user.username
          + "&token=" + token + "&cacheKill=" + new Date().getTime();
        $http.get(url)
    .then(function(response)
    {
        var auth = response.data;
        if (auth.Status)
        {

            //var url = "http://" + $window.location.host +"/"+ auth.RedirectUrl ;
            var url = auth.RedirectUrl;
            $log.info("Redirect to " + url);
            $window.location.href = url;
        }
        else
        {

            MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.InvalidLogin, Alert.Error);
            $log.warn("Invalid user/password for " + $scope.user.username);
            
        }


    })
    };

} ]);