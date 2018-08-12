// 标记是否移动事件
var isMove = false;
var robot_img;
var robot_lastStatus = {};

function golbalInit(golbalWidth, golbalHeight) {
    //===============================
    // 全局Map Init
    //===============================

    canvas.width = golbalWidth;
    canvas.height = golbalHeight;

    console.log(canvas.width);
    console.log(canvas.height);

    img = new Image();
    img.src = config.imgSrc;

    img.onload = function () {
        lastStatus = {
            "imgX": -1 * img.width / 2,
            "imgY": -1 * img.height / 2,
            'mouseX': 0,
            'mouseY': 0,
            'translateX': canvas.width / 2,
            'translateY': canvas.height / 2,
            'scale': 1.0,
            'rotate': 0
        };
        // console.log(lastStatus);
        drawImgByStatus(canvas.width / 2, canvas.height / 2);
    };

    globalMap.mapCenterX = canvas.width / 2;
    globalMap.mapCenterY = canvas.height / 2;

    // sign the map center
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(globalMap.mapCenterX, globalMap.mapCenterY, 8, 8);


    //===============================
    // 机器人图片 -初始化
    //===============================
    //document.getElementById("map").appendChild(canvas);
    locate.width = globalMap.robotWidth;
    locate.height = globalMap.robotHeight;

    robot_img = new Image();
    robot_img.src = 'img/roboto-logo.png';

    robot_img.onload = function () {
        robot_lastStatus = {
            "imgX": -1 * robot_img.width / 2,
            "imgY": -1 * robot_img.height / 2,
            'translateX': globalMap.robotWidth / 2,
            'translateY': globalMap.robotHeight / 2,
        };
        locate_ctx.drawImage(robot_img, 0, 0, locate.width, locate.height);

        globalMap.robotOffsetTop = globalMap.mapOriginY - globalMap.robotOriginY / img_resolution;
        globalMap.robotOffsetLeft = globalMap.mapOriginX + globalMap.robotOriginX / img_resolution;
    };


    //  ===============================
    //   鼠标操作
    // ===============================
    canvas.onmousedown = function (e) {
        isMove = true;
        canvas.style.cursor = "move";

        var box = windowToCanvas(e.clientX, e.clientY);
        lastStatus.mouseX = box.x;
        lastStatus.mouseY = box.y;

        if (globalMap.Mode_mapMove == false) {
            // console.log(111);
            // ------ after connect ----------------------------------------------------------------
            if (globalMap.conn_status == "connected") {
                // console.log(222);
                // ctx.fillRect(e.clientX, e.clientX, 8, 8);

                // console.log("line_id"+line_id+"dot_id"+dot_id);
                // console.log(document.getElementById(LINE_NAME + line_id));
                if (line_id > 0) {
                    // console.log(line_id);
                    if (document.getElementById(LINE_NAME + line_id) === null) {
                        // console.log("444");
                        return;
                    }
                }
                // console.log("555");
                //if(end == 0){

                addMapTarget(e.clientX, e.clientY);
                //}
            }
        }

    };

    canvas.onclick = function (e) {};

    canvas.onmouseout = function (e) {
        isMove = false;
        canvas.style.cursor = "default";
    };

    canvas.onmouseup = function (e) {
        isMove = false;
        canvas.style.cursor = "default";
    };

var onmousemove_count = 0;
    canvas.onmousemove = function (e) {
        if (isMove) {
            // console.log(lastStatus.translateX);
            if (((globalMap.mapCenterX < config.width - 10 || lastStatus.mouseX - e.clientX > 0) &&
                    (globalMap.mapCenterY < config.height - 10 || lastStatus.mouseY - e.clientY > 0) &&
                    (globalMap.mapCenterX > 0 || lastStatus.mouseX - e.clientX < 0) &&
                    (globalMap.mapCenterY > 0 || lastStatus.mouseY - e.clientY < 0)
                )) {
                var box = windowToCanvas(e.clientX, e.clientY);
                drawImgByMove(box.x, box.y);

            } else {
                if (onmousemove_count == 10) {
                    notify('快到底啦 (＞﹏＜)', 1.5, "warn");
                    onmousemove_count = 0;
                }
                onmousemove_count++;

            }


        }
    };

    canvas.onmousewheel = function (e) {
        // console.log(e.wheelDelta);
        if (e.wheelDelta > 0) {
            imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;
        } else {
            imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;
        }
        // var mXY = windowToCanvas(e.clientX, e.clientY);
        // console.log(mXY);
        // drawImgByStatus(mXY.x, mXY.y);
        drawImgByStatus(globalMap.mapCenterX, globalMap.mapCenterY);
    };
}

golbalInit(config.width, config.height);
setInterval(loop_checkClient, 50);


function loop_checkClient() {
    if (document.body.clientWidth - 5 != canvas.width || document.documentElement.clientHeight - 7 != canvas.height) {
        golbalInit(document.body.clientWidth - 5, document.documentElement.clientHeight - 7);
    }
}



/**
 * 计算相对于canvas左上角的坐标值
 */
function windowToCanvas(x, y) {
    var box = canvas.getBoundingClientRect();
    // console.log(box);
    // console.log("x"+x+"y"+y);
    return {
        'x': x - box.left,
        'y': y - box.top
    };
}