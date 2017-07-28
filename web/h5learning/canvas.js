/**
 * Created by pj on 2017/2/23.
 */
$(function () {

    var canvas = document.getElementById("diagonal");
    var context = canvas.getContext('2d');

    context.save();
    context.translate(130, 250);
    drawTrails();
    drawTreeShadow();
    //恢复原有绘图状态
    context.restore();


    context.save();
    context.translate(260, 500);
    //将第二棵树的宽高放大到原来的2倍
    context.scale(2, 1.5);
    drawTrails();
    drawTreeShadow();
    //恢复原有绘图状态
    context.restore();

    var bark = new Image();
    bark.src = "img/lishi.jpg";
    bark.onload = function () {
        drawRoad(context);
    };


    //context.shadowColor = 'rgba(0,0,0,0.2)';
    //context.shadowOffsetX = 15;
    //context.offsetY = -10;
    //context.shadowBlur = 2;

    context.save();
    context.font = "60px impact";
    context.fillStyle = '#996600';
    context.textAlign = 'center';
    context.fillText('Happy Trails!', 200, 60, 400);
    context.restore();




    //画树的阴影效果
    function drawTreeShadow() {
        context.transform(1, 0, -0.5, 1, 0, 0);
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.fillRect(-5, -50, 10, 50);
        context.scale(1, 0.6);
        createCanopyPath(context);
        context.fill();
    }

    //画树
    function drawTrails() {

        jiangbianShugan();


        createCanopyPath(context);
        //加宽线条
        context.lineWidth = 4;
        //平滑路径结合点
        context.lineJoin = 'round';
        //设置线条颜色
        context.strokeStyle = '#663300';

        //绘制路径
        context.stroke();
        //设置填充色并填充树冠
        context.fillStyle = '#009900';

        context.fill();

        //context.fillStyle='#663300';
        //填充树干矩形框
        //context.fillRect(-5,-50,10,50);
        //用背景图案填充树干矩形
        //context.drawImage(bark,-5,-50,10,50);


    }


    //渐变方式填充树干
    function jiangbianShugan() {
        var trunkGradien = context.createLinearGradient(-5, -50, 5, -50);

        trunkGradien.addColorStop(0, '#002200');
        trunkGradien.addColorStop(0.4, '#00dd00');
        trunkGradien.addColorStop(1, '#006600');

        context.fillStyle = trunkGradien;
        context.fillRect(-5, -50, 10, 50);


        var cannopyShadow = context.createLinearGradient(0, -50, 0, 0);
        cannopyShadow.addColorStop(0, 'rgba(11,11,0,0.5)');
        cannopyShadow.addColorStop(0.2, 'rgba(11,11,0,0.0)');

        context.fillStyle = cannopyShadow;
        context.fillRect(-5, -50, 10, 50);


    }


    //画路径
    function drawRoad(context) {
        context.save();
        context.translate(-10, 350);
        context.beginPath();

        context.moveTo(0, 0);
        //绘制第一条曲线  第一组代表控制点  第二组代表曲线的终点
        context.quadraticCurveTo(170, -50, 260, -190);

        context.quadraticCurveTo(310, -250, 410, -250);

        //context.strokeStyle="#663300";

        context.strokeStyle = context.createPattern(bark, 'repeat');


        context.lineWidth = 40;
        context.stroke();

        context.restore();


    }

    //画出树的边框
    function createCanopyPath(context) {
        context.beginPath();

        context.moveTo(-25, -50);
        context.lineTo(-10, -80);
        context.lineTo(-20, -80);
        context.lineTo(-5, -110);
        context.lineTo(-15, -110);

        //树的顶点
        context.lineTo(0, -140);

        context.lineTo(15, -110);
        context.lineTo(5, -110);
        context.lineTo(20, -80);
        context.lineTo(10, -80);

        context.lineTo(25, -50);

        //连接欠点,闭合路径
        context.closePath();

    }
});