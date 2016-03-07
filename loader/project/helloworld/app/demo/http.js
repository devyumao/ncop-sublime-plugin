/**
 * @file BNJS.http接口
 * @author wangdanping
 * @time 2015-11-17
 */

var REQUESRT_HOST = 'http://cp01-testing-tuan02.cp01.baidu.com:8087';
(function ($, window) { 
    var getFn = function () {
        BNJS.http.get({
            url: 'http://op.juhe.cn/onebox/exchange/currency?from=CNY',
            params: {
                key: 'eba96f0461d99d94f7a8fc4c6bc113b2',
                to: 'USD'
            },
            onSuccess: function(res) {
                BNJS.ui.toast.show('get请求成功 ' + JSON.stringify(res));
            },
            onFail: function(){
                BNJS.ui.toast.show('get请求失败 ');
            }
        });
    };

    var postFn = function () {
        BNJS.http.post({
            url: 'http://op.juhe.cn/onebox/exchange/currency?from=CNY',
            params: {
                key: 'eba96f0461d99d94f7a8fc4c6bc113b2',
                to: 'USD'
            },
            onSuccess: function(res) {
                BNJS.ui.toast.show('Post请求成功 ' + JSON.stringify(res));
            },
            onFail : function(res) {
                BNJS.ui.toast.show('Post请求失败' + JSON.stringify(res));
            }
        });
    };

    var getNAFn = function () {
        var params = {
            cityid: BNJS.location.cityCode
        };

        BNJS.http.getNA({
            url : REQUESRT_HOST + '/naserver/item/ItemScreenFavour',
            params: params,
            onSuccess: function(res) {
                BNJS.ui.toast.show('getNA请求成功' + JSON.stringify(res));
            },
            onFail : function(res) {
                BNJS.ui.toast.show('getNA请求失败' + JSON.stringify(res));
            }
        });
    };

    var postNAFn = function () {
        BNJS.http.postNA({
            url: REQUESRT_HOST + '/naserver/user/feedback',
            params : {
                msg : '测试post接口',
                contact : '18277369122'
            },
            onSuccess: function(res) {
                BNJS.ui.toast.show('Post请求成功 ' + JSON.stringify(res));
            },
            onFail : function(res) {
                BNJS.ui.toast.show('Post请求失败' + JSON.stringify(res));
            }
        });
    };

    var signFn = function () {
        BNJS.http.sign({
            source: '9UR0VmRDhnWC04WTVHbGRNR3Nldkx3N2xPWkRLV25tYm5KSkNHRWU2TnN3U05VQVFBQUFBJCQAAAAAAAAAAAEAAABzzVIlc2hpcmxleUxpWGl1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGw0~FNsNPxTZ21426745279702{"movieId":"9400"}',
            customerId: 1,
            callback: function(res) {
                setTimeout(function () {
                    alert(res.result);
                }); 
            }
        });
    };

    var getCatgDataFn = function () {
        BNJS.http.getCatgData({
            onSuccess : function(res){
                BNJS.ui.toast.show(JSON.stringify(res));
            },
            onFail : function(res){
                BNJS.ui.toast.show('Native本地没有筛选项数据' + JSON.stringify(res));
            }
        });
    };

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
        var list = $('#j-http-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'get':
                    getFn();
                    break;
                case 'post':
                    postFn();
                    break;
                case 'getNA':
                    getNAFn();
                    break;
                case 'postNA':
                    postNAFn();
                    break;
                case 'sign':
                    signFn();
                    break;
                case 'getCatgData':
                    getCatgDataFn();
                    break;
                default:
            }
        });
    });
})($, window);