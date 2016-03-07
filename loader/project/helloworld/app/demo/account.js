/**
 * @file BNJS.account接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) {
    var loginFn = function () {
        BNJS.account.login({
            onSuccess : function(){
                BNJS.ui.toast.show('登陆成功！');
                location.href = location.href;
            },
            onFail : function(res){
                BNJS.ui.toast.show('登陆失败！' + res.errmsg);
            }
       });
    }

    var getMobileFn = function () {
        BNJS.account.getMobile({
            onSuccess : function(res){
                if(res.mobile != ''){
                    BNJS.ui.toast.show(res.mobile);
                }else{
                    BNJS.ui.toast.show('用户未填写手机号');
                }     
            },
            onFail : function(res){
                BNJS.ui.toast.show('获取mobile信息失败~ ' + res.errmsg);
            }
        });
    }

    var getSecretAccountFn = function () {
        BNJS.account.getSecretAccount({
            onSuccess: function(res){
                if (res !== '') {
                    setTimeout(function () {
                        alert(JSON.stringify(res));
                    });
                }      
            },
            onFail: function(res){
                setTimeout(function () {
                    alert(JSON.stringify(res));
                });
            }
        });
    }

    var getCommonSecretAccountFn = function () {
        var obj = {};
        var tpFlag = '';
        var requestData = '';

        if ($('#j-get-tpFlag').val().length === 0 && $('#j-get-requestData').val().length === 0) {
            setTimeout(function () {
                alert('请输入参数');
            });
            return;
        }

        if ($('#j-get-tpFlag').val().length > 0) {
            tpFlag = $('#j-get-tpFlag').val();
        }
        if ($('#j-get-requestData').val().length > 0) {
           requestData = $('#j-get-requestData').val(); 
        }
        BNJS.account.getCommonSecretAccount({
            tpFlag: tpFlag,
            requestData: requestData,
            onSuccess: function (res) {
                setTimeout(function () {
                    alert(JSON.stringify(res));
                });
            },
            onFail: function (res) {
                setTimeout(function () {
                    alert(JSON.stringify(res));
                });
            }
        });
    }

    /* 显示账户信息 */
    var showAccountInfoFn = function() {
        var tmp = '<li>BNJS.account.isLogin:<span>' + BNJS.account.isLogin + '</span>[1.0]</li>' +
            '<li>BNJS.account.uid:<span>' + BNJS.account.uid + '</span>[1.0]</li>' +
            '<li>BNJS.account.uName:<span>' + BNJS.account.uName + '</span>[1.0]</li>' +
            '<li>BNJS.account.displayName:<span>' + BNJS.account.displayName + '</span>[1.0]</li>' +
            '<li>BNJS.account.bduss:<span>' + BNJS.account.bduss + '</span>[1.0]</li>';
        document.getElementById('j-account-info').innerHTML = tmp;
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
        var list = $('#j-account-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'login':
                    loginFn();
                    break;

                case 'getMobile':
                    getMobileFn();
                    break;

                case 'getSecretAccount':
                    getSecretAccountFn();
                    break;

                case 'getCommonSecretAccount':
                    getCommonSecretAccountFn();
                    break;

                default:
            }
        });

        /* 显示账户信息 */
        showAccountInfoFn();
    });
})($, window);