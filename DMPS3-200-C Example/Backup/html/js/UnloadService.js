// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";
app.service("UnloadService", function(JavaScriptConstants) {
    var _funcs = [];
    var _id = 0;
    var _onOff = false;
    return {
        InterceptUnload: InterceptUnload,
        RegisterForUnload: RegisterForUnload,
        UnRegisterForUnload: UnRegisterForUnload

    };

    
    function RegisterForUnload(func) {
        if (func) {
            _id++;
            _funcs[_id] = func;            
        }
        if (!_onOff)
            InterceptUnload(true);
        return _id;
    }
    
    function UnRegisterForUnload(key) {
        delete _funcs[key];

        var unreg = true;
        for ( var x = 0 ; x <= _funcs.length; x++)
            if (_funcs[x] != null)
                unreg = false;
        if (unreg)
            InterceptUnload(false);

    }


    function InterceptUnload(onOff) {
        if (onOff) {
            if (window.addEventListener) {
                window.addEventListener("beforeunload", handleUnloadEvent);
            } else {
                window.attachEvent("onbeforeunload", handleUnloadEvent);
            }

        } else {
            console.log("removeUnloadEvent");
            if (window.removeEventListener) {
                window.removeEventListener("beforeunload", handleUnloadEvent);
            } else {
                window.detachEvent("onbeforeunload", handleUnloadEvent);
            }
        }
    }

    function handleUnloadEvent() {

        var prevent = false;
            for (var x = 0; x <= _id; x++) {
                if (_funcs[x] != null)
                    prevent = prevent || _funcs[x]();
            }
        if (prevent) {
            event.returnValue = JavaScriptConstants.UnSavedChangesWarning;
            
        } else {
            InterceptUnload(false);
            event.preventDefault();

            return false;
        }
        }





    });

