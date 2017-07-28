
/**
 * Created by pj on 2017/2/21.
 */

var timeId;
$(document).ready(function(){


    //位每一个li标签添加鼠标的移动监听事件
    $(".tabfirst li").each(function(index){

        var liNode=$(this);


        liNode.mouseover(function(){
            timeId=setTimeout(function(){
                $(".first").removeClass("first");
                $(".tabfirst li.tabin").removeClass("tabin");
                $(".content").eq(index).addClass("first");
                liNode.addClass("tabin");
            },300);
        }).mouseout(function(){
            clearTimeout(timeId);
        });
    });
    $("#content").load("a.html");
    $(".tabsecond li").each(function(index){
        var liNode=$(this);

        liNode.click(function(){
            $(".tabsecond li.tabin2").removeClass("tabin2");

            if(index==0){
                $("#content").load("a.html");
            }else if(index==1){
                $("#content").load("b.html");

            }else{
                $("#content").load("c.html");


            }
            liNode.addClass("tabin2");
        });

    });

});