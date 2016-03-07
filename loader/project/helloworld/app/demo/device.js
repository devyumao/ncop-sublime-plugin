/**
 * @file BNJS.device接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) {
    var setScreenRotateFn = function () {
       var params = {
            screenRotateStatus: true
        };
        BNJS.page.start('bainuo://component?compid=jsb&comppage=deviceVideo&hideTitle=1', params);
        // BNJS.page.start('bainuo://component?url=http://172.18.19.75:8080/device_video.html&hideTitle=1', params);
    }

    /* 显示设备信息 */
    var showDeviceInfoFn = function() {
        var tmp = '<li>BNJS.device.name:<span>' + BNJS.device.name + '</span>[1.0]</li>' +
            '<li>BNJS.device.platform:<span>' + BNJS.device.platform + '</span>[1.0]</li>' +
            '<li>BNJS.device.os:<span>' + BNJS.device.os + '</span>[1.0]</li>' +
            '<li>BNJS.device.screenWidth:<span>' + BNJS.device.screenWidth + '</span>[1.0]</li>' +
            '<li>BNJS.device.screenHeight:<span>' + BNJS.device.screenHeight + '</span>[1.0]</li>';
        document.getElementById('j-device-info').innerHTML = tmp;
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
        var list = $('#j-device-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'setScreenRotate':
                    setScreenRotateFn();
                    break;

                default:
            }
        });

        /* 显示设备信息 */
        showDeviceInfoFn();
    });
})($, window);