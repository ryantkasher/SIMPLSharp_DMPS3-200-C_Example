// Copyright (C) 2015 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.

"use strict";

app.service("MessageService", function() {


this.ShowMessage = function(title, content, cssClass , footer , styles) {


    $('#MessageTitle').html(title);
    $('#MessageBody').html(content);
    $('#MessageHeader').addClass(cssClass);
    $('#MessageModal').modal({ keyboard: true });
    if (footer != null)
        $('#MessageFooter').html(footer);


    if (styles == undefined)
        return;

    var me = this;
    $('#MessageModal').on('hidden.bs.modal', function() {
        if (me.oldStyles == null)
            return;
        for (var x = 0; x < me.oldStyles.length; x++) {
            $('#' + me.oldStyles[x].id).css(me.oldStyles[x].property, me.oldStyles[x].value);
        }
    });

    this.oldStyles = [];
    for (var x = 0; x < styles.length; x++) {
        var old = $('#' + styles[x].id).css(styles[x].property);
        this.oldStyles.push({ id: styles[x].id, property: styles[x].property, value: old });
    }
    
    for (var x = 0; x < styles.length; x++) {
        $('#' + styles[x].id).css(styles[x].property, styles[x].value);
    }

}

this.HideMessage = function()
{
    $('#MessageModal').modal('hide');

}

this.UpdateMessage = function(title, content, footer)
{
        if (title != null)
            $('#MessageTitle').html(title);
        if (content  != null)
            $('#MessageBody').html(content);
        if (footer != null)
            $('#MessageFooter').html(footer);
    }

this.HideConfirm= function()
{
    $('#ConfirmModal').modal('hide');

}

    this.isBusyUp = false;
this.ShowBusy = function(content) {
    try {
        
//        $.blockUI({ 
//        message: '<img src="../img/mycrestron-loading-swrils.gif" /><div class="crestron-legend" style="color:black;">'+content+'</div>',

        //        }); 
        if (this.isBusyUp)
            return;
        $.blockUI({ 
        message: '<div id="preload-01" style="margin:0 auto;"  /><div class="crestron-legend" style="color:black;font-size:16px;">'+content+'</div>',

        });
        this.isBusyUp = true;

    }
    catch (ex) {
        this.isBusyUp = false;
        console.log(ex);
        $.unblockUI();
    }
}

this.HideBusy = function() {
    try {
          $.unblockUI();
          this.isBusyUp = false;
        }
        catch (ex) 
        {
            console.log(ex);
        }
}

    this.ShowConfirm = function(title, content, cssClass, callBackOk, callBackCanceled) {

    $('#ConfirmClickOk').unbind();
    $('#ConfirmClickOk').bind('click', callBackOk);
    
    $('#ConfirmClickCancel').unbind();
    if (callBackCanceled != null)
        $('#ConfirmClickCancel').bind('click', callBackCanceled);
    
    $('#ConfirmTitle').html(title);
    $('#ConfirmBody').html(content);
    $('#ConfirmHeader').addClass(cssClass);
    $('#ConfirmModal').modal({ keyboard: true });
    
}


this.ShowAcknowledge= function(title, content, cssClass ) {


    $('#AcknowledgeModalHeader').html(title);
    $('#AcknowledgeModalBody').html(content);
    $('#AcknowledgeModalHeader').addClass(cssClass);
    $('#AcknowledgeModal').modal({ keyboard: true });
}


});
