/**
 * @file BNJS.statistic接口
 * @author wangdanping
 * @time 2015-11-27
 */

(function ($, window) {
    var addLogFn = function () {
        BNJS.statistic.addLog({
            actionID : 'click',
            actionExt : 'test'
        });
    }

    var addCtagFn = function () {
        var obj = {};
        if ($('#j-ctag-s').val().length > 0) {
            obj.s = $('#j-ctag-s').val();
        }
        if ($('#j-ctag-k').val().length > 0) {
           obj.k = $('#j-ctag-k').val(); 
        }
        if ($('#j-ctag-v').val().length > 0) {            
            obj.v = $('#j-ctag-v').val();
        }
        if ($('#j-ctag-x').val().length > 0) {
            obj.x = $('#j-ctag-x').val();
        }

        obj.t = +new Date;
        BNJS.statistic.addCtag(obj);
    }

    var addMTJFn = function () {
        var options = {
            eventId: 'demo-mtj',
            eventLabel: 'test-mtj'
        };
        BNJS.statistic.addMTJ(options);
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
                case 'addLog':
                    addLogFn();
                    break;

                case 'addCtag':
                    addCtagFn();
                    break;

                case 'addMTJ':
                    addMTJFn();
                    break;

                default:
            }
        });
    });
})($, window);