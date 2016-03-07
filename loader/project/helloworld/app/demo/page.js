/**
 * @file BNJS.page接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) { 
    var startFn = function () {
        setTimeout(function () {
            alert('点击在新页面，从上到下打开ui测试页面， 并传入参数{pagename: 测试getData}');

            var params = {
                pagename : '测试getData'
            };
            var url = 'bainuo://component?compid=jsb&comppage=page';
            // var url = 'bainuo://component?url=http://172.18.19.83:8080/app/demo/page.html';
            BNJS.page.start(url, params, 0, 'btt');
        });
    };

    var backFn = function () {
        setTimeout(function () {
            alert('调用返回上一页接口');
        });
        BNJS.page.back();
    }

    var getDataFn = function () {
        BNJS.page.getData(function(res){
            setTimeout(function () {
                alert(JSON.stringify(res));
            });
        });
    }

    var startPayFn = function () {
        BNJS.page.startPay({
            customerId : 170,
            deviceType : 1,
            itemInfo   : '[{"id":1,"name":"星美五折会员卡","price":20000,"number":1}]',
            mobile     : '15618594235',
            notifyUrl  : 'http://cq01-rdqa-dev082.cq01.baidu.com:8080/api/lbsCallback/payCallback',
            orderCreateTime: '1426049254',
            originalAmount : 20000,
            passuid : '310253156',
            payAmount : 20000,
            orderId : '300186',
            sdk : 1,
            service : 'cashier',
            title : '星美五折会员卡',
            sign: '7a7a478962e01054a5ac5cc8af220fd9',
            signType:1
        });
    }

    var registerReceiverFn = function () {
        BNJS.page.registerReceiver('com.nuomi.broadcast.PAGE_REFRESH', function(res){ 
            BNJS.ui.toast.show('PAGE_REFRESH接收器注册成功！')
            setTimeout(function () {
                alert(JSON.stringify(res));
            });
        });
    }

    var sendBroadCastFn = function () {
        BNJS.page.sendBroadcast('com.nuomi.broadcast.PAGE_REFRESH',{
            name : '测试发送广播PAGE_REFRESH, 注册接收广播的页面都能收到此广播'
        });
    }

    var startBindFn = function () {
        BNJS.page.startBind({
            onSuccess : function(){
                BNJS.ui.toast.show('调用绑定手机号页面成功');
            },
            onFail : function(res){
                BNJS.ui.toast.show('调用绑定手机号页面失败~~errno: ' + res.errno + '; errmsg: ' + res.errmsg);
            }
        });
    }

    var onBtnBackClickFn = function () {
        BNJS.page.onBtnBackClick({
            callback: function () {
                setTimeout(function () {
                    alert('返回按钮已点击， 如果要返回上一页面，需要调用返回上一页接口');
                    backFn();
                });
            }
        });
    }

    var orderConfirmFn = function () {
        BNJS.page.orderConfirm({
            onFail: function(){
                onSuccess('下单成功~');
            },
            onFail: function(){
                alert('下单失败~');
            }
        });
    }

    var reShowFn = function () {
        BNJS.page.reShow(function () {
            setTimeout(function () {
                alert('页面再次展示！');
            });
        });
    }

    var enableBounceFn = function () {
        BNJS.page.enableBounce(true);
    }

    var onCityChangeFn = function () {
        BNJS.page.onCityChange(function (res) {
            BNJS.ui.toast.show('城市切换至：'+ JSON.stringify(res));
        });
    }

    var startPageforResultFn = function () {
        var params = {
            pagename : '测试startPageforResult'
        };
        var url = 'bainuo://component?compid=jsb&comppage=pagePostmessage';
        // var url = 'bainuo://component?url=http://172.18.19.34:8080/app/demo/page_postmessage.html';
        BNJS.page.startPageforResult({
            url: url,
            params: params,
            action: 0,
            direction: 'btt',
            onSuccess: function(resp){
                setTimeout(function () {
                    alert('startPageforResult success: ' + JSON.stringify(resp));
                });
            },
            onFail: function(resp){
                setTimeout(function () {
                    alert('startPageforResult fail: ' + JSON.stringify(resp));
                });
            }
        });
    }

    var postMessageFn = function () {
        BNJS.page.postMessage({
            test: '测试-传给index页面的信息'
        });
    }

    var imgWrap = $('#j-show-img');
    function showPhoto (res) {
        imgWrap.find('img').attr('src', 'data:image/png;base64,' + res.base64);
        imgWrap.find('p').html('图片类型： ' + res.type + '<br />图片的base64编码字符串长度： ' + res.base64.length + '<br />图片的base64编码： ' + res.base64);
    }

    var getAlbumFn = function () {
        var obj = {};
        if ($('#j-getAlbum-source').val().length > 0) {
            obj.source = parseInt($('#j-getAlbum-source').val(), 10);
        }
        if ($('#j-getAlbum-width').val().length > 0) {
           obj.width = parseInt($('#j-getAlbum-width').val(), 10); 
        }
        if ($('#j-getAlbum-height').val().length > 0) {            
            obj.height = parseInt($('#j-getAlbum-height').val(), 10);
        }
        if ($('#j-getAlbum-quality').val().length > 0) {
            obj.quality = parseInt($('#j-getAlbum-quality').val(), 10);
        }
        obj.onSuccess = function (res) {
            showPhoto(res);
        };
        obj.onFail = function (res) {
            // 用户取消操作  50017
            // 读取图片失败 50018
            if (res.errno === 50017) {
                setTimeout(function () {
                    alert(res.errmsg);
                });
            } else if (res.errno === 50018) {
                setTimeout(function () {
                    alert('读取图片失败');
                });
            }
        };
        BNJS.page.getAlbum(obj);
    }

    var leaveFn = function () {
        BNJS.page.leave(function () {
            setTimeout(function () {
                alert('此页面注册了离开页面的监听事件，再您离开页面时，会提醒，您要离开page啦~~');
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
        getDataFn();
        var list = $('#j-page-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'start':
                    startFn();
                    break;

                case 'back':
                    backFn();
                    break;

                case 'getData':
                    getDataFn();
                    break;

                case 'startPay':
                    startPayFn();
                    break;

                case 'registerReceiver':
                    registerReceiverFn();
                    break;

                case 'sendBroadCast':
                    sendBroadCastFn();
                    break;

                case 'startBind':
                    startBindFn();
                    break;

                case 'onBtnBackClick':
                    onBtnBackClickFn();
                    break;

                case 'orderConfirm':
                    orderConfirmFn();
                    break;

                case 'reShow':
                    reShowFn();
                    break;

                case 'enableBounce':
                    enableBounceFn();
                    break;

                case 'onCityChange':
                    onCityChangeFn();
                    break;

                case 'startPageforResult':
                    startPageforResultFn();
                    break;

                case 'postMessage':
                    postMessageFn();
                    break;

                case 'getAlbum':
                    getAlbumFn();
                    break;

                case 'leave':
                    leaveFn();
                    break;

                default:
            }
        });
    });
})($, window);