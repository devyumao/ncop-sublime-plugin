/**
 * @file BNJS.hardware接口
 * @author wangdanping
 * @time 2015-11-27
 */

(function ($, window) {
    var scanQRCodeFn = function () {
        BNJS.hardware.scanQRCode(function(res){
            setTimeout(function () {
                alert(JSON.stringify(res));
            });  
        });
    }

    var getWifiAroundFn = function () {
        BNJS.hardware.getWifiAround(function (data) {
            setTimeout(function () {
                alert(JSON.stringify(data));
            });
        });
    }

    var BNJSReady = function (readyCallback) {
        if(readyCallback && typeof readyCallback == 'function'){
            if(window.BNJS && typeof window.BNJS == 'object' && BNJS._isAllReady){
                readyCallback();                 
            }else{
                document.addEventListener('BNJSReady', function() {
                    readyCallback();
                }, false);
            }
        }
    };

    BNJSReady(function(){
        BNJS.ui.hideLoadingPage();
        var list = $('#j-hardware-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'scanQRCode':
                    scanQRCodeFn();
                    break;

                case 'getWifiAround':
                    getWifiAroundFn();
                    break;

                default:
            }
        });
    });
})($, window);