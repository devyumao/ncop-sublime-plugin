/**
 * @file BNJS.env接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) {
    var networkFn = function () {
        BNJS.env.network(function(res){
            var tmp = res.network;
            setTimeout(function () {
                alert(JSON.stringify(tmp));
            });
        });
    }

    var getConfigFn = function () {
        BNJS.env.getConfig(function (data) {
            setTimeout(function () {
                alert(JSON.stringify(data));
            }, 0);
        });
    }

    var acCodeFn = function () {
        BNJS.env.acCode(function(res){
            setTimeout(function () {
                alert(JSON.stringify(res));
            });
        });
    }

    /* 显示环境信息 */
    var showEnvInfoFn = function() {
        var tmp = '<li>BNJS.env.cuid:<span>' + BNJS.env.cuid + '</span>[1.0]</li>' +
            '<li>BNJS.env.appName:<span>' + BNJS.env.appName + '</span>[1.0]</li>' +
            '<li>BNJS.env.appVersion:<span>' + BNJS.env.appVersion + '</span>[1.0]</li>' +
            '<li>BNJS.env.appChannel:<span>' + BNJS.env.appChannel + '</span>[1.0]</li>' +
            '<li>BNJS.env.sidList:<span>' + JSON.stringify(BNJS.env.sidList) + '</span>[1.5] [Array]</li>' +
            '<li>BNJS.env.uuid:<span>' + BNJS.env.uuid + '</span>[1.9]</li>' + 
            '<li>BNJS.env.packageName:<span>' + BNJS.env.packageName + '</span>[1.9]</li>';
        document.getElementById('j-env-info').innerHTML = tmp;
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
        var list = $('#j-env-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'network':
                    networkFn();
                    break;

                case 'getConfig':
                    getConfigFn();
                    break;

                case 'acCode':
                    acCodeFn();
                    break;

                default:
            }

        });

        /* 显示环境信息 */
        showEnvInfoFn(); 
    });
})($, window);