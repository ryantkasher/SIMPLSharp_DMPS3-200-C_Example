// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";

 app.service("MenuService",
            function($http, $q) {
                return({
                    GetMenu: GetMenu,
                    SelectMenuItem:SelectMenuItem

                });


                function SelectMenuItem(menuId) {
                    var request = $http({
                        method: "get",
                        params: { "command": "SelectMenuItem", "menuid": menuId  , "cacheKill": new Date().getTime()},
                        url: "/MenuServiceController",
                        
                });
                
                    return( 
                    
                    request.then( handleSuccess, handleError ) );
                }

                function GetMenu() {
                    var request = $http({
                        method: "get",
                        params: {"command": "GetMenu",  "cacheKill": new Date().getTime()},
                        url: "/MenuServiceController",
                    });
                    return( request.then( handleSuccess, handleError ) );
                }
                

                
                function handleError( response ) {
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

            }
        );