/**
 * @file BNJS.localStorage接口
 * @author wangdanping
 * @time 2015-11-27
 */

(function ($, window) {
    var setItemFn = function () {
        var $keyInput = $('#j-localstorage-key-input');
        var $valueInput = $('#j-localstorage-value-input');
        BNJS.localStorage.setItem($keyInput.val(), $valueInput.val(), function(res){
            setTimeout(function(){
                alert('写缓存成功：' + JSON.stringify(res));
            });
        }, function(res){
            setTimeout(function(){
                alert('写缓存失败：' + JSON.stringify(res));
            });
        });
    }

    var getItemFn = function () {
        var $keyInput = $('#j-localstorage-key-input');
        BNJS.localStorage.getItem($keyInput.val(), function(res){
            setTimeout(function(){
                alert('读取缓存成功：' + JSON.stringify(res));
            });
        }, function(res){
            setTimeout(function(){
                alert('读取缓存失败：' + JSON.stringify(res));
            });
        });
    }

    var removeItemFn = function () {
        var $keyInput = $('#j-localstorage-key-input');

        BNJS.localStorage.removeItem($keyInput.val(), function(res){
            setTimeout(function(){
                alert('移除缓存：' + JSON.stringify(res));
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
        var list = $('#j-localStorage-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'setItem':
                    setItemFn();
                    break;

                case 'getItem':
                    getItemFn();
                    break;

                case 'removeItem':
                    removeItemFn();
                    break;

                default:
            }
        });
    });
})($, window);