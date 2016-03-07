/**
 * @file BNJS.location接口
 * @author wangdanping
 * @time 2015-11-26
 */

(function ($, window) {
    var watchLocationFn = function () {
        // 位置变化时，触发回调
        BNJS.location.watchLocation({
            onLocationChanged : function(){
                alert('location changed');
            }
        });
    }

    var getLocationFn = function () {
        // 刷新BNJS.location相关位置信息的属性值，读取native的缓存值，仅安卓生效
        BNJS.location.getLocation();
    }

    var requestRealTimeLocationFn = function () {
        BNJS.location.requestRealTimeLocation(function (res) {
            setTimeout(function () {
                alert('获取实时定位返回的结果：' + JSON.stringify(res));  
            });
        });
    }

    var showPosInfoListFn = function() {
        var locationInfoDiv = document.getElementById('j-location-info');
        var tmp = '<li>定位失败</li>';
        if (BNJS.location.hasLocation) {
            tmp = '<li>BNJS.location.hasLocation[1.0]:<span>' + BNJS.location.hasLocation + '</span></li>' +
                '<li>BNJS.location.cityCode[1.0]:<span>' + BNJS.location.cityCode + '</span></li>' +
                '<li>BNJS.location.cityName[1.0]:<span>' + BNJS.location.cityName + '</span></li>' +
                '<li>BNJS.location.shortCityName[1.0]:<span>' + BNJS.location.shortCityName + '</span></li>' +
                '<li>BNJS.location.cityUrl[1.0]:<span>' + BNJS.location.cityUrl + '</span></li>' +
                '<li>BNJS.location.latitude[1.0]:<span>' + BNJS.location.latitude + '</span></li>' +
                '<li>BNJS.location.longitude[1.0]:<span>' + BNJS.location.longitude + '</span></li>' +
                '<li>BNJS.location.address[1.0]:<span>' + BNJS.location.address + '</span></li>' +
                '<li>BNJS.location.selectCityCode[1.0]:<span>' + BNJS.location.selectCityCode + '</span></li>' +
                '<li>BNJS.location.selectCityName[1.0]:<span>' + BNJS.location.selectCityName + '</span></li>' +
                '<li>BNJS.location.selectShortCityName[1.0]:<span>' + BNJS.location.selectShortCityName + '</span></li>' +
                '<li>BNJS.location.selectCityUrl[1.0]:<span>' + BNJS.location.selectCityUrl + '</span></li>' +
                '<li>BNJS.location.districtID[1.7]:<span>' + BNJS.location.districtID + '</span></li>' +
                '<li>BNJS.location.districeName[1.7]: <span>' + BNJS.location.districeName + '</span></li>';
        } 

        locationInfoDiv.innerHTML = tmp;
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
        var list = $('#j-location-list');
        list.on('click', 'button', function () {
            var targetObj = $(this).data('target');

            switch(targetObj){
                case 'watchLocation':
                    watchLocationFn();
                    break;

                case 'getLocation':
                    getLocationFn();
                    break;

                case 'requestRealTimeLocation':
                    requestRealTimeLocationFn();
                    break;

                default:
            }
        });

        showPosInfoListFn();
    });
})($, window);