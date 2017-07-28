/**
 * Created by pj on 2017/2/22.
 */
$(function () {
    var i = 0;
    var offsetLeft=$(".banner").width();
    //初始化img的高和宽
    $(".banner .img li a img").css({
        width:$(".banner").width(),
        height:$(".banner").height()
    });

    var cloneFirst = $(".banner .img li").first().clone();
    $(".banner .img").append(cloneFirst);


    var size = $(".banner .img li").length;
    //alert(size);
    for (var l = 0; l < size - 1; l++) {
        $("<li>").appendTo($(".number"));
    }

    $(".banner .number li").eq(i).addClass("on");

    /*鼠标划入圆点事件*/
    $(".banner .number li").hover(function () {
        var index = $(this).index();
        i = index;
        //$(".banner .img").css({left:-(i-1) * offsetLeft});
        $(".banner .img").animate({left: -i * offsetLeft}, 500);
        $(this).addClass("on").siblings().removeClass("on");
    });

    var timeId = setInterval(leftToright, 5000);

    $(".banner").hover(function () {
        clearInterval(timeId)
    }, function () {
        timeId = setInterval(leftToright, 5000);
    });

    $(".banner .btn_r").click(function () {
        leftToright()
    });

    function leftToright() {
        $(".banner .number li").removeClass("on");
        i++;
        if (i == size) {
            $(".banner .img").css({left: 0});
            i = 1;
        }
        if (i == size - 1) {
            $(".banner .number li").eq(0).addClass("on");
        }
        cssChange();
    }

    $(".banner .btn_l").click(function () {
        $(".banner .number li").removeClass("on");
        i--;
        if (i == -1) {
            $(".banner .img").css({left: -(size - 1) * offsetLeft});
            i = size - 2;
        }
        cssChange();
    });

    function cssChange() {
        $(".banner .img").stop().animate({left: -i * offsetLeft}, 500);

        $(".banner .number li").eq(i).addClass("on");
    }
})