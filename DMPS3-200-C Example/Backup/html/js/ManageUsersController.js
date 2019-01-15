// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.



app.controller('ManageUsersController',
            function($scope, DataService, MessageService, JavaScriptConstants,Alert, $interval, $linq, Const, $timeout, OnlineOfflineService) {


                $scope.dataService = DataService;
                $scope.users = [];
                $scope.editingGlobal = false;
                $scope.userValid = false;
                $scope.showDelete = true;
                $scope.canAddNewUser = true;
                $scope.PasswordPattern= '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';
                $scope.UsernamePattern= "(([a-zA-Z0-9_\\-]+))";
                $scope.newUser=false;
                $scope.showCancel = false;
        

                $scope.Validate= function() {

                    console.log("Validate");

                    if (!$scope.ManageUsersForm.$dirty) {
                        $scope.userValid = false;
                        return;
                    }

                    if ($scope.ManageUsersForm.Username != null) {
                        var num = $linq.Enumerable().From($scope.users).Where(function(x) {
                            if  ( (x.Username == null)|| ($scope.ManageUsersForm.Username.$modelValue == null))
                                return false;
                             return x.Username.toLocaleLowerCase() == $scope.ManageUsersForm.Username.$modelValue.toLocaleLowerCase();
                        }).Count();
                        if (num > 1) {
                            $scope.userValid = false;
                            $scope.ManageUsersForm.Username.$setValidity('dupUser', false);
                            // send dup user message
                        } 
                        else{
                            $scope.ManageUsersForm.Username.$setValidity('dupUser', true);
                        }
                    }


                    if (($scope.ManageUsersForm.Password.$dirty)&&($scope.ManageUsersForm.Password.$modelValue != null)) {
                        var regex = new RegExp($scope.PasswordPattern);
                        
                        if ($scope.ManageUsersForm.Password.$modelValue.match(regex) == null) {
                            $scope.ManageUsersForm.Password.$setValidity('pattern', false);
                            $scope.userValid = false;
                            $('#Password').addClass('passRequired');
                            console.log('+passRequired');
                            return;

                        } else {
                            $scope.ManageUsersForm.Password.$setValidity('pattern', true);
                            $('#Password').removeClass('passRequired');
                            console.log('-passRequired');
                        }
                            

                    
                    }
    
                    if ($scope.ManageUsersForm.$valid) {
                        $scope.userValid = true;
                        return;
                    }
                    if ($scope.newUser) {
                        $scope.userValid = false;
                        return;
                    }
                    if  ( (!$scope.ManageUsersForm.FirstName.$valid) && ($scope.ManageUsersForm.Password.$dirty) ) 
                    {
                        $scope.userValid = false;
                        return;
                    }

                    if (
                        ($scope.ManageUsersForm.FirstName.$valid) &&
                        ($scope.ManageUsersForm.LastName.$valid) 
                    ) {
                        $scope.userValid = true;
                        return;
                    }
                    

                    $scope.userValid = false;
                }

                $scope.GetUsers = function() {

                    DataService.GetUsers().then
                            (
                                function(users) {
                                    $scope.users = $scope.InitUsers(users);
                                    //$scope.usersOrig =angular.copy($scope.users);
                                    //$scope.usersOrig = JSON.stringify($scope.users);
                                    //console.log($scope.users);


                                }
                            );
                  }
                  
                $scope.GetS = function(onNext) {

                    DataService.GetS().then
                            (
                                function(res) {
                                    if (onNext != null)
                                        onNext(res.result);

                                }
                            );
                  }
                  



                  $scope.SaveUser = function(user) {

                        MessageService.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                        $timeout(function() {
                          DataService.SaveUser(user).then
                                (
                                function(result) {
                                    MessageService.HideBusy();
                                    if (!result.result) {
                                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                    } else {
                                        // todo 
                                    }
                                }
                                );
                        }, 10);                    
                  }


                  $scope.DeleteUser = function(userName) {
                    MessageService.ShowBusy(JavaScriptConstants.DownloadBusyMessage);
                    $timeout(function() {
                      DataService.DeleteUser(userName).then
                                (
                                function(result) {
                                    MessageService.HideBusy();
                                    if (!result.result) {
                                        MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.SaveProblemWarning, Alert.Error);
                                    } else {
                                        $scope.GetUsers();
                                    }
                                }
                                );
                           }, 10); 
                  }

                  $scope.InitUsers = function(users) {

                      return users.map(
                          function(user) {
                            user.Editing = false;
                            user.NewEditing = false;
                            return user;
                          }
                      );
                      }

                
                
                
                $scope.ShowEdit = function(user) {
                    $scope.CurrentUser = user;
                    $scope.GetS($scope.ActualShowEdit);
                }
                
                
                $scope.ActualShowEdit = function(s) {

                    $scope.editingGlobal = true;
                    $scope.CurrentUser.Editing = true;
                    $scope.CurrentUser.NewEditing = false;
                    $scope.newUser = false;

                    $scope.CurrentUser.Password = "*****";
                    $scope.showDelete = false;
                    $scope.canAddNewUser = false;
                    $scope.CurrentUser.S = s;
                    //$timeout(function() {$('#Password').removeClass('passRequired');}, 100);
                    
                    //console.log('-passRequired');

                }

            $scope.test= function() {
                $('#Password').removeClass('passRequired');
            }
            $scope.HideEdit = function(user) {

            $scope.editingGlobal = false;
                // todo revisit


                if (!$scope.ManageUsersForm.Password.$dirty) 
                {
                    user.Password = null;
                    user.S = null;
                } else {
                    user.S =CryptoJS.SHA1(user.S + user.Password).toString(CryptoJS.enc.Hex);
                    user.Password = null;
                }
                user.Editing = false;
                user.NewEditing = false;
                $scope.SaveUser(user);
                //$scope.formState = FormState.Changed;
                $scope.showDelete = true;
                $scope.canAddNewUser = true;
                $scope.newUser = false;
                
            }
            $scope.ConfirmDelete = function(user) {
                
                MessageService.ShowConfirm(JavaScriptConstants.Warning, JavaScriptConstants.ConfirmDeleteUser, Alert.Warning, function() {

                        $scope.DeleteUser(user.Username);


                });
                
            }
            
            $scope.Cancel = function(user) {

                $scope.editingGlobal = false;
                //var tmp = JSON.parse($scope.usersOrig);
                user.Editing = false;
                user.NewEditing = false;
                $scope.newUser = false;
                //$scope.users = tmp;
                
                $scope.showDelete = true;
                $scope.canAddNewUser = true;
                //$scope.users = $scope.usersOrig;
                $scope.GetUsers(); // work around for angular crash
            }

        $scope.ShowAddNewUser= function() {
        
            if (this.users.length >= Const.MaxUsers) {
                    MessageService.ShowMessage(JavaScriptConstants.Error, JavaScriptConstants.MaxUsersWarning, Alert.Error);
                    return;
                }
            $scope.GetS($scope.ActualShowAddNewUser);
            
        }
        
        
        $scope.ActualShowAddNewUser= function(s) {
        
   


        $scope.users.push(
            {
                Username: '',
                Password: '',
                FirstName: '',
                LastName: '',
                Email: '',
                Editing: true,
                NewEditing: true,
                Id:null,
                S:s,
            }
            );
        $scope.newUser=true;
        $scope.showCancel = true;
        $scope.showDelete = false;
        $scope.canAddNewUser=false;
        $scope.userValid = false;
        $('#Password').addClass('passRequired');
        console.log('+passRequired');

//        setTimeout(() => {
//            let userInput = $('input[placeholder="Username"].ui-inputtext');
//                if(userInput){
//                    userInput.addClass('ui-state-filled');
//                    userInput.addClass('ui-state-focus');
//                }
//        }, 0);
        }

        OnlineOfflineService.StartCheckingForServerOnline();

    });// end controller