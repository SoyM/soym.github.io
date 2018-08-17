// draw_route1();

function draw_globalmap() {
    // ctx.beginPath();

    ctx.lineWidth = "2";
    for (var i = 0; i < line_num; i++) {
        ctx.beginPath();
        // ctx.save();
        // ctx.strokeStyle = 'rgb(' + (255-(255 - 50) / line_num * i) + "," + ((255 - 100) / line_num * i) + "," + (200 /
        //         line_num * i) +
        //     ")";
        ctx.strokeStyle = "orange";
        ctx.arc(globalMap.mapCenterX, globalMap.mapCenterY, ((i + 1) * line_space) * imgStatus.scale, Math.PI, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    ctx.beginPath();
    ctx.moveTo(globalMap.mapCenterX, globalMap.mapCenterY);
    ctx.lineTo(globalMap.mapCenterX + ((i + 1) * line_space) * imgStatus.scale, globalMap.mapCenterY);
    ctx.lineTo(globalMap.mapCenterX - ((i + 1) * line_space) * imgStatus.scale, globalMap.mapCenterY);
    ctx.stroke();


    for (i = 0; i <= line_num; i += 2) {
        text(globalMap.mapCenterX + ((i) * line_space) * imgStatus.scale, globalMap.mapCenterY - 2, i / 2);
    }
    // console.log("hhhh");
}

function text(left, top, n) {
    ctx.beginPath();
    ctx.save(); //save和restore可以保证样式属性只运用于该段canvas元素
    ctx.fillStyle = "#000000"; //设置描边样式
    ctx.font = "lighter 10px Arial"; //设置字体大小和字体
    //绘制字体，并且指定位置
    ctx.fillText(n.toFixed(0)+"m", left, top);
    ctx.fill(); //执行绘制
    ctx.restore();
}