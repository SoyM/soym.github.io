var center_to_origin_x = Math.abs(img_width / 2 - Math.abs(origin_x / img_resolution));
var center_to_origin_y = Math.abs(img_height / 2 - Math.abs(origin_y / img_resolution));
var origin_quadrant;
// 判断 origin 象限
if (img_width / 2 + origin_x / img_resolution <= 0) {
    if (-img_height / 2 - origin_y / img_resolution >= 0) {
        origin_quadrant = 1;
    } else {
        origin_quadrant = 4;
    }
} else {
    if (-img_height / 2 - origin_y / img_resolution >= 0) {
        origin_quadrant = 2;
    } else {
        origin_quadrant = 3;
    }
}
console.log("origin_quadrant: " + origin_quadrant);

var angle_center_origin = ((origin_quadrant == 1) || (origin_quadrant == 3)) ? Math.atan(center_to_origin_x / center_to_origin_y) : Math.atan(center_to_origin_x / -center_to_origin_y);

var length_center_origin = Math.sqrt(Math.pow(center_to_origin_x, 2) + Math.pow(center_to_origin_y, 2));

// ==================================
//  canvas Handle
// ==================================
var canvas = document.getElementById("cv_bottom");
var ctx = canvas.getContext("2d");

var locate = document.getElementById('locate');
var locate_ctx = locate.getContext("2d");

var robot_img;
var robot_lastStatus = {};
var imgStatus = {
    'scale': 1.0,
    'rotate': 0
};

var lastStatus = {};
var currentStatus = {};

var fuck_dot = Array();
var fuck_path = Array();
// TargetDot 为 旋转缩放 存在的property
var dot_tmp_hub = [];
// 标记是否移动事件
var isMove = false;

var meshGridPoint = Array();
var meshGridPointCount = 0;

// =================
// Materialize Init
// =================
M.AutoInit();

var sidenav_obj = document.getElementById("slide-out");
var sidenav_ins = M.Sidenav.getInstance(sidenav_obj);

// sidenav 控制键

var sidenav_btn = document.createElement("a");
var bars = document.createElement("i");
bars.style.fontSize = "66px";
bars.classList.add("fa", "fa-bars");
sidenav_btn.appendChild(bars);
document.body.appendChild(sidenav_btn);
sidenav_btn.classList.add("sidenav-trigger");
sidenav_btn.setAttribute("data-target", "slide-out");
sidenav_btn.style.position = "absolute";
sidenav_btn.style.zIndex = "1";
sidenav_btn.style.top = "20px";
var sidenav_offsetWidth = sidenav_obj.offsetWidth;
sidenav_btn.style.left = sidenav_offsetWidth + 20 + "px";

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var options = {};
    var instance = M.Sidenav.init(elems, options);

    sidenav_btn.style.left = sidenav_offsetWidth + 20 + "px";
});

sidenav_btn.addEventListener("click", function () {

    globalMap.sidenav_seen = (globalMap.sidenav_seen == true ? false : true);
    // console.log(globalMap.sidenav_seen);
    if (globalMap.sidenav_seen == true) {

        document.getElementById("slide-out").style.display = "inline";
        sidenav_btn.style.left = sidenav_offsetWidth + 20 + "px";
    } else {
        document.getElementById("slide-out").style.display = "none";
        sidenav_btn.style.left = 20 + "px";
    }

    // nav_seen = (nav_seen == true ? false : true);
    // console.log(nav_seen);

    // if (nav_seen == true) {
    //     // sidenav_obj.classList.add("sidenav-fixed");
    //     sidenav_btn.style.left = sidenav_obj.offsetWidth + 20 + "px";
    //     // var elems = document.querySelectorAll('.sidenav');

    //     // M.Sidenav.init(elems, {});
    //     sidenav_ins.open();

    //     // sidenav_ins.destroy();
    // } else {
    //     sidenav_btn.style.left = 20 + "px";
    //     // sidenav_obj.classList.remove("sidenav-fixed");
    //     // var elems = document.querySelectorAll('.sidenav');

    //     // M.Sidenav.init(elems, {});
    //     sidenav_ins.close();
    //     sidenav_ins.destroy();
    // }
});
if (globalMap.is_mobile) {
    // console.log("y");
    sidenav_ins.open();
    // var elems = document.querySelectorAll('.sidenav');
    // var options = {};
    // var instance = M.Sidenav.init(elems, options);
}


// =================================
// 初始化golbalMap, 机器人 ，鼠标操作
// =================================
golbalInit(config.width, config.height);
// 监听窗口width，height变化
setInterval(loop_checkClient, 50);
// 引入ROS
var ros = new ROSLIB.Ros();


function golbalInit(golbalWidth, golbalHeight) {
    //===============================
    // 全局Map Init
    //===============================
    document.body.style.backgroundColor = body_bgcolor;

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
    robot_img.src = '/img/roboto-logo.png';

    robot_img.onload = function () {
        robot_lastStatus = {
            "imgX": -1 * robot_img.width / 2,
            "imgY": -1 * robot_img.height / 2,
            'translateX': globalMap.robotWidth / 2,
            'translateY': globalMap.robotHeight / 2,
        };
        locate_ctx.drawImage(robot_img, 0, 0, locate.width, locate.height);
        var mapped = rotate_mapping(globalMap.robotOriginX, globalMap.robotOriginY);
        globalMap.robotOffsetTop = mapped.y;
        globalMap.robotOffsetLeft = mapped.x;
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


        meshGridPoint[meshGridPointCount] = [e.clientX, e.clientY];
        var foo_octmc = oneClickToMapCoordinate(e.clientX, e.clientY);
        meshGridPoint[meshGridPointCount].map_x = foo_octmc[0];
        meshGridPoint[meshGridPointCount].map_y = foo_octmc[1];
        console.log(meshGridPoint);
        meshGridPointCount++;
        if (meshGridPoint.length == 2) {
            draw_meshGrid(meshGridPoint, 20);
        }


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

    canvas.ontouchstart = function (e) {
        // console.log(e);
        isMove = true;
        canvas.style.cursor = "move";

        var box = windowToCanvas(e.touches[0].clientX, e.touches[0].clientY);
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

    // canvas.onclick = function (e) {};

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
        console.log(meshGridPoint.length);
        if (meshGridPoint.length == 1) {

        }


        if (isMove) {
            // console.log(e.clientX + "," + e.clientY);
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

    canvas.ontouchmove = function (e) {
        clinet_x = e.touches[0].clientX;
        clinet_y = e.touches[0].clientY;
        // console.log(clinet_x + "," + clinet_y);

        if (isMove) {
            // console.log(lastStatus.translateX);
            if (((globalMap.mapCenterX < config.width - 10 || lastStatus.mouseX - clinet_x > 0) &&
                    (globalMap.mapCenterY < config.height - 10 || lastStatus.mouseY - clinet_y > 0) &&
                    (globalMap.mapCenterX > 0 || lastStatus.mouseX - clinet_x < 0) &&
                    (globalMap.mapCenterY > 0 || lastStatus.mouseY - clinet_y < 0)
                )) {
                var box = windowToCanvas(clinet_x, clinet_y);
                drawImgByMove(box.x, box.y);

            } else {
                if (onmousemove_count == 15) {
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


function loop_checkClient() {
    if (document.body.clientWidth - 5 != canvas.width || document.documentElement.clientHeight - 10 != canvas.height) {
        golbalInit(document.body.clientWidth - 5, document.documentElement.clientHeight - 10);

        if (window.orientation != undefined) {
            globalMap.is_mobile = true;
            if (window.orientation != 90 && window.orientation != 270) {
                alert("横屏体验更佳");
            }
            console.log("mobile");
        } else {
            globalMap.is_mobile = false;
            console.log("desktop");
        }

    }
    // console.log(document.getElementsByClassName("sidenav-overlay").length);
    if (document.getElementsByClassName("sidenav-overlay").length != 0) {
        document.getElementsByClassName("sidenav-overlay")[0].classList.remove("sidenav-overlay");
    }

    config.width = document.body.clientWidth - canvas_width_offerset;
    config.height = document.documentElement.clientHeight - canvas_height_offerset;
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


function draw_meshGrid(meshGridPoint, line_num) {
    console.log(meshGridPoint);
    // ctx.beginPath();
    var middlePosi_x;
    var middlePosi_y;
    if (meshGridPoint[0][0] - meshGridPoint[1][0] >= 0) {
        middlePosi_x = meshGridPoint[1][0] + (meshGridPoint[0][0] - meshGridPoint[1][0]) / 2;
    } else {
        middlePosi_x = meshGridPoint[0][0] + (meshGridPoint[1][0] - meshGridPoint[0][0]) / 2;
    }

    if (meshGridPoint[0][1] - meshGridPoint[1][1] >= 0) {
        middlePosi_y = meshGridPoint[1][1] + (meshGridPoint[0][1] - meshGridPoint[1][1]) / 2;
    } else {
        middlePosi_y = meshGridPoint[0][1] + (meshGridPoint[1][1] - meshGridPoint[0][1]) / 2;
    }

    var angle = Math.atan(Math.abs(meshGridPoint[0][1] - meshGridPoint[1][1]) / Math.abs(meshGridPoint[0][0] - meshGridPoint[1][0]));

    var max_length = Math.sqrt(Math.pow(meshGridPoint[0][0] - meshGridPoint[1][0], 2) + Math.pow(meshGridPoint[0][1] - meshGridPoint[1][1], 2));
    var squareLength = Math.sqrt(Math.pow(max_length, 2) / 2);
    var line_space = squareLength / line_num;

    leftPosi_x = middlePosi_x - max_length * Math.sin(angle);
    leftPosi_y = middlePosi_y - max_length * Math.cos(angle);
    rightPosi_x = middlePosi_x + max_length * Math.cos(angle);
    rightPosi_y = middlePosi_y - max_length * Math.sin(angle);

    ctx.lineWidth = "2";
    ctx.strokeStyle = "orange";

    var disparity_x = meshGridPoint[0][0] - meshGridPoint[1][0];
    var disparity_y = meshGridPoint[0][1] - meshGridPoint[1][1];


    for (var i = 0; i < line_num; i++) {
        ctx.beginPath();

        ctx.moveTo(meshGridPoint[0][0] + (max_length * Math.sin(angle) / line_num) * i, meshGridPoint[0][1] - (max_length / line_num) * i * Math.cos(angle));
        ctx.lineTo(meshGridPoint[1][0] + (max_length * Math.sin(angle) / line_num) * i, meshGridPoint[1][1] - (max_length / line_num) * i * Math.cos(angle));

        foo_x = disparity_x > 0 ? meshGridPoint[1][0] + Math.abs(disparity_x) * i / line_num : meshGridPoint[0][0] + Math.abs(disparity_x) * i / line_num;
        foo_y = disparity_y > 0 ? meshGridPoint[1][1] + Math.abs(disparity_y) * i / line_num : meshGridPoint[0][1] + Math.abs(disparity_y) * i / line_num;

        foo2_x = disparity_x > 0 ? meshGridPoint[1][0] + max_length * Math.sin(angle) + Math.abs(disparity_x) * i / line_num : meshGridPoint[0][0] + max_length * Math.sin(angle) + +Math.abs(disparity_x) * i / line_num;
        foo2_y = disparity_y > 0 ? meshGridPoint[1][1] - max_length * Math.cos(angle) + Math.abs(disparity_y) * i / line_num : meshGridPoint[0][1] - max_length * Math.cos(angle) + Math.abs(disparity_y) * i / line_num;

        ctx.moveTo(foo_x, foo_y);
        ctx.lineTo(foo2_x, foo2_y);

        // ctx.arc(globalMap.mapCenterX, globalMap.mapCenterY, ((i + 1) * line_space) * imgStatus.scale, 0, 2 *
        //     Math.PI);
        ctx.stroke();
        ctx.restore();
    }


    // for (i = 0; i <= line_num; i += 2) {
    //     text(globalMap.mapCenterX + ((i) * line_space) * imgStatus.scale, globalMap.mapCenterY - 2, i / 2);
    //     text(globalMap.mapCenterX - 5, globalMap.mapCenterY - ((i) * line_space) * imgStatus.scale, i / 2);
    // }
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