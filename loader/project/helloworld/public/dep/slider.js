/*
 * jQuery Slider v1.0.0
 * Copyright 2015
 * Contributing Author: chuxiaoyu
 */
;
(function ($) {
    var autoPlayInterval = null;
    $.fn.mobileSwap = function () {
        var swap = this;
        var tpl = {
            imgList: '<ul class="mobile-swap-list" id="mobile-swap-list" style="left: -{{img-left}}px;">{{img-list}}</ul>',
            numList: '<ul id="mobile-swap-num" class="mobile-swap-num">{{img-num}}</ul>'
        };
        this.imgWidth = 0;
        this.nowLeft = 0;
        this.onMoveFlag = false;

        this.init = function () {
            this.imgList = this.find('img');
            this.linkList = [];
            this.nowIndex = 0;
            this.initLayout();
            this.initEvent();
        };

        this.initLayout = function  (op) {
            var imgList = '';
            var htmlNum = '';
            var numClass = '';

            var parent = this.parent();
            this.imgWidth = parent.width();

            for(var i = 0, length = this.imgList.length; i < length; i++) {
                if ($(this.imgList[i]).parent().attr("href")) {
                    this.linkList[i] = $(this.imgList[i]).parent().attr("href");
                } 
                this.imgList[i] = this.imgList[i].src;
                numClass = i === this.nowIndex ? 'fc' : '';

                htmlNum +=  '<li id="swap-num' + i + '" class="' + numClass + '"><a></a></li>';
            }
            imgList += '<li><img id="swap-img' + 0 + '" width="' + swap.imgWidth + '" src=""/></li>';
            imgList += '<li><img id="swap-img' + 1 + '" width="' + swap.imgWidth + '" src=""/></li>';
            imgList += '<li><img id="swap-img' + 2 + '" width="' + swap.imgWidth + '" src=""/></li>';
            this.remove();

            this.container = $(document.createElement('div'));
            this.container.addClass('mobile-swap');

            var html = tpl.imgList.replace('{{img-list}}', imgList);
            html = html.replace('{{img-left}}', this.imgWidth);
            html += tpl.numList.replace('{{img-num}}', htmlNum);

            this.container.html(html);
            parent.append(this.container[0]);
            this.list = this.container.find('#mobile-swap-list');
            this.refreshList();
        };

        this.initEvent = function (op) {
            var startX;
            var startY;
            var moveDistence = 0;
            var moveDistenceY = 0;
            var defaultOp = {
                tap: function(link) {
                    // 统计
                    BNJS.statistic.addMTJ({
                        eventId: 'Clist_banner',
                        eventLabel: '分类列表页_Banner点击总量'
                    });         
                    BNJS.page.start(link);
                }
            };
            op = defaultOp;

            this.container[0].ontouchstart = function (e) {
                e = e || window.event;
                if (swap.onMoveFlag) {
                    return false;
                }
                clearInterval(autoPlayInterval);
                // swap.nowLeft = swap.list[0].style.webkitTransform ?
                //                parseInt(swap.list[0].style.webkitTransform.split('(')[1]) :
                //                0;
                swap.nowLeft = -swap.imgWidth;
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                moveDistence = 0;
                moveDistenceY = 0;
            };
            this.container[0].ontouchmove = function (e) {
                e = e || window.event;
                if (swap.onMoveFlag) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                var endX = e.touches[0].pageX;
                var endY =  e.touches[0].pageY;
                moveDistence += endX - startX;
                moveDistenceY += endY - startY;

                if (swap.imgList.length > 1) {
                    swap.move(swap.nowLeft+moveDistence);
                }
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;

                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            this.container[0].ontouchend = function (e) {
                e = e || window.event;
                if (swap.onMoveFlag) {
                    return false;
                }
                var decration = 0;
                if (Math.abs(moveDistence) > 50 && swap.imgList.length > 1) {
                    if (moveDistence > 0) {
                        decration = 1;
                    } else {
                        decration = -1;
                    }
                } else if (moveDistence < 20 && moveDistenceY < 20) {
                    op.tap(swap.linkList[swap.nowIndex]);
                }
                swap.nowLeft += moveDistence; 

                swap.change(decration);
                moveDistence = 0;

                swap.goAutoPlay();
            };
        };

        this.move = function (left) {
            // swap.list[0].style.webkitTransform = 'translate(' + left + 'px, 0)';
            swap.list[0].style.left = left + 'px';
        };

        this.getNowPos = function () {
            return parseInt(swap.list[0].style.left) || 0;
        };

        this.change = function (decration) {
            var left = -swap.imgWidth + decration*swap.imgWidth;
            if (decration > 0) {
                swap.nowIndex = (swap.nowIndex - 1) < 0 ? (swap.imgList.length - 1) : (swap.nowIndex - 1);
            } else {
                swap.nowIndex = (swap.nowIndex + 1) >= swap.imgList.length ? 0 : (swap.nowIndex + 1);
            }
            swap.onMoveFlag = true;
            swap.list.addClass('mobile-swap-delay');
            // swap.list[0].style.webkitTransform = 'translate(' + left + 'px, 0)';
            swap.list[0].style.left = left + 'px';
            setTimeout(function(){
                if (swap.list.hasClass('mobile-swap-delay')) {
                    swap.list.removeClass('mobile-swap-delay');
                    swap.onMoveFlag = false;
                    swap.refreshList();
                }
            }, 500);
        };

        this.goAutoPlay = function () {
            if (swap.imgList.length < 2) {
                return;
            }
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(function() {
                swap.change(-1);
            }, 4000);
        }

        this.refreshList = function () {
            var now = swap.nowIndex;
            var pre = swap.nowIndex - 1;
            var next = swap.nowIndex + 1;

            pre = pre < 0 ? (swap.imgList.length - 1) : pre;
            next = next >= swap.imgList.length ? 0 : next;

            $('#swap-img1')[0].src = swap.imgList[now];
            $('#swap-img2')[0].src = swap.imgList[next];

            swap.move(-swap.imgWidth);
            $('#swap-img0')[0].src = swap.imgList[pre];

            $("#mobile-swap-num .fc").removeClass('fc')
            $("#swap-num"+now).addClass('fc');
        } 

        if (this.imgWidth === 0) {
            this.init();
            this.goAutoPlay();
        }
        
    };
})(Zepto);
