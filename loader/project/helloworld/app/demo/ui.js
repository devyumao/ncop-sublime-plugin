/**
 * @file BNJS.ui接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) { 
    var setTitleFn = function () {
        BNJS.ui.title.setTitle('标题');
    };

    var addActionButtonFn = function () {
        BNJS.ui.title.addActionButton({             
            tag : '23',
            text : '收藏',
            icon : 'collection',
            callback: function(){
                BNJS.ui.toast.show('成功添加一个tag为23的button');
                BNJS.ui.title.addActionButton({                
                    tag : '23',
                    text : '已收藏',
                    icon : 'collected',
                    callback: function(){
                        BNJS.ui.toast.show('已收藏');
                    }
                });
            }
        });
    }

    var addT10NoticeButtonFn = function () {
        BNJS.ui.title.addT10NoticeButton();
    }

    var setClickableTitleFn = function () {
        BNJS.ui.title.setClickableTitle('上海市', function(){
            setTimeout(function () {
                alert('页面顶部可点击的Title设置成功！');
            });
        });
    }

    var removeBtnAllFn = function () {
        BNJS.ui.title.removeBtnAll();
    }

    var removeBtnByTagFn = function () {
        BNJS.ui.title.removeBtnByTag('23');
        BNJS.ui.toast.show('成功移除一个tag为23的button');
    }

    var addTagListFn = function () {
        BNJS.ui.title.addTagList({             
            id: 1,
            tagList: ['tag1','tag2', 'tag3'],
            callback: function(res){
                setTimeout(function(){
                    alert(JSON.stringify(res));
                });
            }
        });
    }

    var toastShowFn = function () {
        BNJS.ui.toast.show('测试toast show, 我一会儿就消失哒~~~');
    }

    var dialogShowFn = function () {
        BNJS.ui.dialog.show({
            title: '测试Dialog',
            message: '我是测试Dialog~设置了确认和取消按钮',
            ok: '确认',
            cancel: '取消',
            onConfirm: function() {
                setTimeout(function(){
                    alert('您刚刚点击了确定按钮');
                });
            },
            onCancel: function() {
                setTimeout(function(){
                    alert('您刚刚点击了取消按钮');
                });
            }
        });
    }

    var showLoadingFn = function () {
        /* 调用Loading */
        BNJS.ui.dialog.showLoading('我们在努力加载，请耐心等待，5秒后会调用关闭方法，测试关闭加载框接口...');

        setTimeout(hideLoad, 5000);
    }

    function hideLoad() {
        BNJS.ui.dialog.hideLoading();
    };

    var shareFn = function () {
        BNJS.ui.share({
            title : '分享测试',
            imgUrl : 'http://e.hiphotos.baidu.com/nuomi/wh%3D470%2C285/sign=bbd1a730d588d43ff0fc99f64a2efe29/3801213fb80e7bec133503a42c2eb9389a506b83.jpg',
            url : 'http://www.nuomi.com',
            onSuccess : function(){
                setTimeout(function(){
                    alert('分享测试成功');
                });
            },
            onFail : function(){
                setTimeout(function(){
                    alert('分享测试失败');
                });
            }
        });
    }

    var showLoadingPageFn = function () {
        setTimeout(function(){
            alert('3秒后会调用关闭加载中页面接口，测试关闭加载中页面接口');
        });

        BNJS.ui.showLoadingPage();

        setTimeout(hideLoadPage, 3000);
    }

    function hideLoadPage() {
        BNJS.ui.hideLoadingPage();
    };

    var showErrorPageFn = function () {
        /* 调用错误页面 */
        BNJS.ui.showErrorPage('错误页面，带刷新按钮，5秒后调用关闭错误页接口，测试关闭错误页接口', 1);
        setTimeout(hideErrorPage, 5000);
    };

    function hideErrorPage() {
        BNJS.ui.hideErrorPage();
    };

    // 注册下拉刷新，进入页面注册一次即可
    var pullDownCallLock = false; // 下拉刷新动作开启标记，默认未开启下拉刷新
    function initPulldownRefreshList() {
        BNJS.ui.nativeInterfere({
            pullDown: true,
            pullDownCallback: refreshPage
        });
    }

    var closePullDownFresh = function () {
        if (!pullDownCallLock) {
            return
        };
        // 收起下拉刷新区域
        BNJS.ui.closePullAction('pulldown');
        pullDownCallLock = false;
    };

    // 下拉刷新完成后，需要关闭下拉刷新的动画丸子
    function refreshPage () {
        pullDownCallLock = true;
        setTimeout(function(){
            alert('下拉刷新完成！');
            closePullDownFresh();
        });
    };

    var nativeInterfereFn = function () {
        setTimeout(function(){
            alert('点击后，会给本页面添加下拉刷新功能');
        });
        initPulldownRefreshList();
    };

    var hasBannerFn = function () {
        setTimeout(function(){
            alert('告知native首页有banner');
        });

        BNJS.ui.hasBanner(true);
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
        var list = $('#j-ui-tittle-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'setTitle':
                    setTitleFn();
                    break;

                case 'addActionButton':
                    addActionButtonFn();
                    break;

                case 'addT10NoticeButton':
                    addT10NoticeButtonFn();
                    break;

                case 'setClickableTitle':
                    setClickableTitleFn();
                    break;

                case 'removeBtnAll':
                    removeBtnAllFn();
                    break;

                case 'removeBtnByTag':
                    removeBtnByTagFn();
                    break;

                case 'addTagList':
                    addTagListFn();
                    break;

                default:
            }
        });

        var toastList = $('#j-ui-toast-list');
        toastList.on('click', 'button', function () {
            var targetObj = $(this).data('target');
            switch(targetObj){
                case 'toastShow':
                    toastShowFn();
                    break;

                default:
            }
        });

        var dialogList = $('#j-ui-dialog-list');
        dialogList.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'dialogShow':
                    dialogShowFn();
                    break;

                case 'showLoading':
                    showLoadingFn();
                    break;

                case 'hideLoading':
                    showLoadingFn();
                    break;

                default:
            }
        });

        var uiList = $('#j-ui-list');
        uiList.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'share':
                    shareFn();
                    break;

                case 'showLoadingPage':
                    showLoadingPageFn();
                    break;

                case 'hideLoadingPage':
                    showLoadingPageFn();
                    break;

                case 'showErrorPage':
                    showErrorPageFn();
                    break;

                case 'hideErrorPage':
                    showErrorPageFn();
                    break;

                case 'nativeInterfere':
                    nativeInterfereFn();
                    break;

                case 'closePullAction':
                    nativeInterfereFn();
                    break;

                case 'hasBanner':
                    hasBannerFn();
                    break;

                default:
            }
        });
    });
})($, window);