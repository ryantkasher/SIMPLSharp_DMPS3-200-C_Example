// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";

app.controller('MenuController', function($scope, MenuService, $window)
{

$scope.MainMenu = {}


$scope.ChangeLocation = function(url) {
//this will mark the URL change
    $window.location.href = url;  //use $location.path(url).replace() if you want to replace the location instead

    $scope = $scope || angular.element(document).scope();
    if (!$scope.$$phase) {
        //this will kickstart angular if to notice the change
        $scope.$apply();
    }
};



$scope.SelectMenuItem = function(itemId, url)
{
    
        MenuService.SelectMenuItem(itemId).then
            (
                function(result) {
        
                $scope.ChangeLocation(url);
                }
            );
}

$scope.GetMenu = function() {
    
    MenuService.GetMenu().then
        (
            function(menu)
    {
                $scope.MainMenu = menu;
            }
        );
    }



$scope.Hello = function() {

    alert('hello');
}


});