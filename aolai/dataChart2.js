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
        ctx.arc(globalMap.mapCenterX, globalMap.mapCenterY, ((i + 1) * line_space) * imgStatus.scale, Math.PI, 2 *
            Math.PI);
        ctx.stroke();
        ctx.restore();
    }


    ctx.beginPath();
    ctx.strokeStyle = "orange";
    var foo_num = 36;
    for (i = foo_num/2; i < foo_num; i++) {
        ctx.moveTo(globalMap.mapCenterX, globalMap.mapCenterY);
        foo_x = globalMap.mapCenterX + ((line_num * line_space) * Math.cos(i * Math.PI * 2 / foo_num)) *
            imgStatus.scale;
        foo_y = globalMap.mapCenterY + ((line_num * line_space) * Math.sin(i * Math.PI * 2 / foo_num)) *
            imgStatus.scale;
        ctx.lineTo(foo_x, foo_y);
        ctx.stroke();
        if (i != 0) {
            text(foo_x >= globalMap.mapCenterX ? foo_x + 10 : foo_x - 10, foo_y > globalMap.mapCenterY ? foo_y + 10 : foo_y, 360 - (i * 10));
        } else {
            text(foo_x >= globalMap.mapCenterX ? foo_x + 10 : foo_x - 10, foo_y > globalMap.mapCenterY ? foo_y + 10 : foo_y, 0);
        }
    }


    for (i = 0; i <= line_num; i += 2) {
        text(globalMap.mapCenterX + ((i) * line_space) * imgStatus.scale, globalMap.mapCenterY - 2, i / 2);
    }


    // console.log("hhhh");
}

function text(left, top, n, color) {
    ctx.beginPath();
    ctx.save(); //save和restore可以保证样式属性只运用于该段canvas元素
    ctx.fillStyle = "black"; //设置描边样式
    ctx.font = "lighter 10px Arial"; //设置字体大小和字体
    ctx.textAlign = "center";
    //绘制字体，并且指定位置
    ctx.fillText(n.toFixed(0), left, top);
    ctx.fill(); //执行绘制
    ctx.restore();
}