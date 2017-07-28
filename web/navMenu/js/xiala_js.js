/**
 * Created by pj on 2017/2/24.
 */
$(function(){
    $(".nav .list li").hover(function(){
        $(this).find(".down").stop().slideDown();
    },function(){
        $(this).find(".down").stop().slideUp();

    });


})