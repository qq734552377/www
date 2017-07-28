/**
 * Created by pj on 2017/2/20.
 */
$(document).ready(function () {
    $(window).on("load", function () {
        imgLocation();

        window.onscroll = function () {
            var data = {"data": [{"src": "1.jpg"}, {"src": "2.jpg"}, {"src": "3.jpg"}, {"src": "4.jpg"}, {"src": "5.jpg"}, {"src": "6.jpg"}, {"src": "7.jpg"}, {"src": "8.jpg"}, {"src": "9.jpg"}, {"src": "10.jpg"}]};
            if (isScrollSide()) {
                $.each(data.data, function (index, value) {
                    var box = $("<div>").addClass("box").appendTo($(".container"));
                    var conent = $("<div>").addClass("content").appendTo(box);
                    var img = $("<img>").attr("src", "./img/" + $(value).attr("src")).appendTo(conent);
                });
                imgLocation()
            }
        };

		show();
		alert(a);
    });

});

var a=5;
function show(){
	alert(a);
	a=4;
	alert(a);
}

function imgLocation() {
    var box = $(".box");
    var boxWidth = box.eq(0).width();
    //alert(boxWidth); 204
    var windowWidth = $(window).width();
    //alert(windowWidth); 1263
    var num = Math.floor(windowWidth / boxWidth);

    var boxArr = [];//记录一列所有图片的高度和

    box.each(function (index, value) {

        var boxHeight = box.eq(index).height();
        if (index < num) {
            boxArr[index] = boxHeight;
        } else {
            var minHeight = Math.min.apply(null, boxArr);//得到一列中最小的高度
            var minHeigetIndex = $.inArray(minHeight, boxArr);//找到最小高度的图片的索引
            $(value).css({
                "position": "absolute",
                "top": minHeight,
                "left": box.eq(minHeigetIndex).position().left
            });
            boxArr[minHeigetIndex] += boxHeight;
        }
    });
}

function isScrollSide() {
    var box = $(".box");
    var lastBox = box.last();
    var lastboxHeight = lastBox.get(0).offsetTop + Math.floor(lastBox.height() / 2);

    var docHeight = $(window).height();
    var scrollHeight = $(window).scrollTop();


    console.log("lastboxHeight:"+lastboxHeight+"  docHeight:"+docHeight+"  scrollHeight:"+scrollHeight);
    return (lastboxHeight < docHeight + scrollHeight) ? true : false;
}