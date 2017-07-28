/**
 * Created by pj on 2017/2/24.
 */
$(function(){
    $(".list a").hover(function(){
        $(this).stop().animate({"margin-top":-40},300);
    },function(){
        $(this).stop().animate({"margin-top":0},300);

    });



})