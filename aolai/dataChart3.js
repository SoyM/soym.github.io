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

        foo_y = globalMap.mapCenterY + (i * line_space) * imgStatus.scale;
        foo_x = globalMap.mapCenterX + (i * line_space) * imgStatus.scale;
        ctx.moveTo(globalMap.mapCenterX - (line_num * line_space) * imgStatus.scale, foo_y);
        ctx.lineTo(globalMap.mapCenterX + (line_num * line_space) * imgStatus.scale, foo_y);
        ctx.moveTo(foo_x, globalMap.mapCenterY - (line_num * line_space) * imgStatus.scale);
        ctx.lineTo(foo_x, globalMap.mapCenterY + (line_num * line_space) * imgStatus.scale);

        foo_y = globalMap.mapCenterY - (i * line_space) * imgStatus.scale;
        foo_x = globalMap.mapCenterX - (i * line_space) * imgStatus.scale;
        ctx.moveTo(globalMap.mapCenterX - (line_num * line_space) * imgStatus.scale, foo_y);
        ctx.lineTo(globalMap.mapCenterX + (line_num * line_space) * imgStatus.scale, foo_y);
        ctx.moveTo(foo_x, globalMap.mapCenterY - (line_num * line_space) * imgStatus.scale);
        ctx.lineTo(foo_x, globalMap.mapCenterY + (line_num * line_space) * imgStatus.scale);

        // ctx.arc(globalMap.mapCenterX, globalMap.mapCenterY, ((i + 1) * line_space) * imgStatus.scale, 0, 2 *
        //     Math.PI);
        ctx.stroke();
        ctx.restore();
    }


    for (i = 0; i <= line_num; i += 2) {
        text(globalMap.mapCenterX + ((i) * line_space) * imgStatus.scale, globalMap.mapCenterY - 2, i / 2);
        text(globalMap.mapCenterX-5, globalMap.mapCenterY - ((i) * line_space) * imgStatus.scale, i / 2);
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