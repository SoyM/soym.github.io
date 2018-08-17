// ===============================
//  通用 画图操作
// ===============================
drawImgByStatus(config.width, config.height);


// 移动
function drawImgByMove(x, y) {
    translate_value_X = x - lastStatus.mouseX;
    translate_value_Y = y - lastStatus.mouseY;
    lastStatus.translateX = lastStatus.translateX + (x - lastStatus.mouseX);
    lastStatus.translateY = lastStatus.translateY + (y - lastStatus.mouseY);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();


    globalMap.mapCenterX = globalMap.mapCenterX + x - lastStatus.mouseX;
    globalMap.mapCenterY = globalMap.mapCenterY + y - lastStatus.mouseY;

    draw_globalmap();


    //  Mark the CENTER of map and the ORIGIN of map 
    lastStatus.mouseX = x;
    lastStatus.mouseY = y;

    if ((origin_quadrant == 1) || (origin_quadrant == 2)) {
        globalMap.mapOriginX = globalMap.mapCenterX - length_center_origin * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_center_origin) * imgStatus.scale;
        globalMap.mapOriginY = globalMap.mapCenterY - length_center_origin * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_center_origin) * imgStatus.scale;
    } else {
        globalMap.mapOriginX = globalMap.mapCenterX - length_center_origin * Math.sin(imgStatus.rotate * Math.PI / 180 + angle_center_origin) * imgStatus.scale;
        globalMap.mapOriginY = globalMap.mapCenterY + length_center_origin * Math.cos(imgStatus.rotate * Math.PI / 180 + angle_center_origin) * imgStatus.scale;
    }


    // console.log("move-center:"+globalMap.mapCenterX+","+globalMap.mapCenterY);
    // console.log("move-origin:"+globalMap.mapOriginX+","+globalMap.mapOriginY);

    markOriginAndCenter();

    // 
    // ROBOT
    // 
    globalMap.robotOffsetTop += translate_value_Y;
    globalMap.robotOffsetLeft += translate_value_X;
    if (globalMap.robotOffsetTop + locate.height > config.height || globalMap.robotOffsetLeft + locate.width > config.width) {
        document.getElementById("locate").style.display = "none";
    } else {
        document.getElementById("locate").style.display = "";
    }

    // 
    // K.DOT and Trajectory
    // 
    for (i = 1; i < dot_id; i++) {
        dot_tmp = document.getElementById(CV_NAME + i);
        dot_tmp.style.top = parseInt(dot_tmp.style.top) + translate_value_Y + 'px';
        dot_tmp.style.left = parseInt(dot_tmp.style.left) + translate_value_X + 'px';
        // console.log($("#" + CV_NAME + i)[0].offsetLeft);
        // console.log("top: " + parseInt(dot_tmp.style.top) + "," + parseInt(dot_tmp.style.left));
        if ((parseInt(dot_tmp.style.top) + parseInt(dot_tmp.height) > canvas.height) || (parseInt(dot_tmp.style.left) + parseInt(dot_tmp.width) > canvas.width)) {
            dot_tmp.style.display = "none";
        } else {
            dot_tmp.style.display = "";
        }
    }
    for (i = 1; i <= line_id; i++) {
        if (document.getElementById(LINE_NAME + i) != null) {
            document.getElementById(LINE_NAME + i).style.top = $("#" + LINE_NAME + i)[0].offsetTop + translate_value_Y + 'px';
            document.getElementById(LINE_NAME + i).style.left = $("#" + LINE_NAME + i)[0].offsetLeft + translate_value_X + 'px';
        }
    }
}

// 伸缩
function drawImgByStatus(x, y) {
    // 
    // Global Map
    // 
    var imgX = lastStatus.imgX - (x - lastStatus.translateX) / lastStatus.scale;
    var imgY = lastStatus.imgY - (y - lastStatus.translateY) / lastStatus.scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    globalMap.mapCenterX += (globalMap.mapCenterX - x) * (lastStatus.scale / globalMap.lastScale - 1);
    globalMap.mapCenterY += (globalMap.mapCenterY - y) * (lastStatus.scale / globalMap.lastScale - 1);

    draw_globalmap();


    last_rotate = lastStatus.rotate;

    lastStatus = {
        'imgX': imgX,
        'imgY': imgY,
        'translateX': x,
        'translateY': y,
        'scale': imgStatus.scale,
        'rotate': imgStatus.rotate
    };

    //  Mark the CENTER of map and the ORIGIN of map 
    if ((origin_quadrant == 1) || (origin_quadrant == 2)) {
        globalMap.mapOriginX = globalMap.mapCenterX - length_center_origin * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_center_origin) * imgStatus.scale;
        globalMap.mapOriginY = globalMap.mapCenterY - length_center_origin * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_center_origin) * imgStatus.scale;
    } else {
        globalMap.mapOriginX = globalMap.mapCenterX - length_center_origin * Math.sin(imgStatus.rotate * Math.PI / 180 + angle_center_origin) * imgStatus.scale;
        globalMap.mapOriginY = globalMap.mapCenterY + length_center_origin * Math.cos(imgStatus.rotate * Math.PI / 180 + angle_center_origin) * imgStatus.scale;
    }
    // console.log(Math.sin(imgStatus.rotate * Math.PI / 180 + angle_center_origin));

    markOriginAndCenter();

    // 
    // ROBOT 
    // 
    locate.width = globalMap.robotWidth * lastStatus.scale;
    locate.height = globalMap.robotHeight * lastStatus.scale;


    var mapped = rotate_mapping(globalMap.robotOriginX, globalMap.robotOriginY);
    globalMap.robotOffsetTop = mapped.y;
    globalMap.robotOffsetLeft = mapped.x;

    // locate_ctx.clearRect(0, 0, locate.width, locate.height);
    locate_ctx.save();
    locate_ctx.scale(lastStatus.scale / 4, lastStatus.scale / 4);
    locate_ctx.drawImage(robot_img, 0, 0, robot_img.width, robot_img.height);
    locate_ctx.restore();

    if (globalMap.robotOffsetTop + locate.height > config.height || globalMap.robotOffsetLeft + locate.width > config.width) {
        document.getElementById("locate").style.display = "none";
    } else {
        document.getElementById("locate").style.display = "";
    }

    // 
    // K.DOT
    // 
    dot_tmp_hub = [];
    for (i = 1; i < dot_id; i++) {
        dot_tmp = document.getElementById(CV_NAME + i);
        target_property = $("#" + CV_NAME + i)[0];
        dot_tmp_hub[i] = Array();

        dot_tmp_hub[i].x_mapping = globalMap.mapCenterX + center_to_origin_x + fuck_dot[i][0] / img_resolution;
        dot_tmp_hub[i].y_mapping = globalMap.mapCenterY + center_to_origin_y - fuck_dot[i][1] / img_resolution;
        // x_dot base on center
        dot_tmp_hub[i].length_x = dot_tmp_hub[i].x_mapping - globalMap.mapCenterX;
        // y_dot base on center
        dot_tmp_hub[i].length_y = globalMap.mapCenterY - dot_tmp_hub[i].y_mapping;

        // length_dot_center
        dot_tmp_hub[i].length_dc = Math.sqrt(Math.pow(dot_tmp_hub[i].length_x, 2) + Math.pow(dot_tmp_hub[i].length_y, 2));
        // angle_dot_center
        dot_tmp_hub[i].angle = Math.atan(dot_tmp_hub[i].length_y / dot_tmp_hub[i].length_x);

        // console.log(dot_tmp_hub[i]);
        tmp_top = globalMap.mapCenterY - dot_tmp_hub[i].length_dc * Math.cos(imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;
        tmp_left = globalMap.mapCenterX + dot_tmp_hub[i].length_dc * Math.sin(imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;

        // 点 位于 图片中心坐标 第一，四象限
        if (dot_tmp_hub[i].x_mapping > globalMap.mapCenterX) {
            // console.log("1,4");
            tmp_top = globalMap.mapCenterY - dot_tmp_hub[i].length_dc * Math.sin(-imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;
            tmp_left = globalMap.mapCenterX + dot_tmp_hub[i].length_dc * Math.cos(-imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;
        }
        // 点 位于 图片中心坐标 第二，三象限 
        else if (dot_tmp_hub[i].x_mapping < globalMap.mapCenterX) {
            // console.log("2,3");
            tmp_top = globalMap.mapCenterY + dot_tmp_hub[i].length_dc * Math.sin(-imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;
            tmp_left = globalMap.mapCenterX - dot_tmp_hub[i].length_dc * Math.cos(-imgStatus.rotate * Math.PI / 180 + dot_tmp_hub[i].angle) * imgStatus.scale;
        }

        document.getElementById(CV_NAME + i).style.top = tmp_top - 6 + 'px';
        document.getElementById(CV_NAME + i).style.left = tmp_left - 6 + 'px';

        if ((parseInt(dot_tmp.style.top) + parseInt(dot_tmp.height) > canvas.height) || (parseInt(dot_tmp.style.left) + parseInt(dot_tmp.width) > canvas.width)) {
            dot_tmp.style.display = "none";
        } else {
            dot_tmp.style.display = "";
        }

    }

    // 
    // trajectory
    // 
    trajectory_hub = [];
    for (i = 1; i <= line_id; i++) {
        if (document.getElementById(LINE_NAME + i) != null) {
            var parent = document.getElementById(LINE_DIV);
            var child = document.getElementById(LINE_NAME + i);
            // console.log("parent:" + parent + "remove child:" + child);
            parent.removeChild(child);

            // console.log(fuck_path)

            draw_line(fuck_path[i - 1], i);

        }
    }


    globalMap.lastScale = imgStatus.scale;
}

// 标注 图片中心 和 地图原点
function markOriginAndCenter() {
    ctx.beginPath();
    ctx.arc(globalMap.mapCenterX, globalMap.mapCenterY, 4, 0, 2 *
        Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.fillRect(globalMap.mapOriginX, globalMap.mapOriginY, 8, 8);
}