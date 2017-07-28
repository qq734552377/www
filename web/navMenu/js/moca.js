/**
 * Created by pj on 2017/2/27.
 */
$(function(){
    var width=$(".nav_con li a.on").outerWidth();
    //alert(width)
    var left=$(".nav_con li a.on").position().left;
    //alert(left)
    $(".nav_con .line").css({
        width:width,
        left:left
    });

    $(".nav_con li a").each(function(index,value){
        var aNode=$(this);

        aNode.click(function(){
            $(".nav_con li a").removeClass("on");
            aNode.addClass("on");
            var width=aNode.outerWidth();
            var left=aNode.position().left;
            $(".nav_con .line").stop().animate({
                width:width,
                left:left
            },{duration:1000,easing:'easeOutBack'});
        });
    });

    $(".nav_con li a").each(function(index,value){
        var aNode=$(this);

        aNode.hover(function(){
            var width=aNode.outerWidth();
            var left=aNode.position().left;
            $(".nav_con .line").stop().animate({
                width:width,
                left:left
            },{duration:1000,easing:'easeOutBack'});
        },function(){
            var width=$(".nav_con li a.on").outerWidth();
            //alert(width)
            var left=$(".nav_con li a.on").position().left;
            $(".nav_con .line").stop().animate({
                width:width,
                left:left
            },{duration:1000,easing:'easeOutBack'});
        });
    });
});