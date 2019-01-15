// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";
app.service("DialogService", function() {

    return {
        Show:show,
        Close:close
    }
    
    function show(id, closedCallback) {
        $('#' + id).on('hidden.bs.modal', function() {
                if (closedCallback != null )
                    closedCallback();
            }
           );
        $("#" + id).modal('show').css({
            'margin-top': function() { return 0; },
            'margin-left': function() { return (($(window).width() - $(this).width()) / 2); }
        });
        $("#" + id).modal({ keyboard: true });
    }

    function close(id) {
        $('#' + id).modal('hide');
    }

});

