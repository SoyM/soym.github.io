//
//  ------ 添加地图目标 --------------------------------------------------------------------
//
function addMapTarget(x, y) {
    var imageData = ctx.getImageData(x, y, 1, 1);
    var pose = {};
    if (imageData.data[0] >= 250) {
        var node = document.createElement("canvas");
        node.id = CV_NAME + dot_id;
        node.width = SET_RADIUS * 2;
        node.height = SET_RADIUS * 2;
        node.className = 'dot';
        // node.style.top = y - SET_RADIUS + offset_top +'px';
        // node.style.left = x - SET_RADIUS + offset_left +'px';
        // node.style.overflow = 'hidden';
        node.style.top = y - SET_RADIUS + 'px';
        node.style.left = x - SET_RADIUS + 'px';
        
        document.getElementById(CANVAS_IN_CANVAS).appendChild(node);
        draw_cirle(node.id, SET_RADIUS, SET_RADIUS, yellow);
        var tmp = "#" + node.id;
        $(tmp).draggable({
            delay: 50,
            cursorAt: {
                top: (SET_RADIUS),
                left: (SET_RADIUS)
            },
            containment: ("#cv_bottom"),
            start: function () {
                // console.log($(tmp)[0]);
                tag.no = tmp.replace(/[^0-9]/ig, "");
                tag.status = 1;
                delete_cv(LINE_NAME + tag.no);
                var drag_id = tag.no - 1;
                tag.drag = 1;

                if (end == 1 && drag_id == 0) {
                    delete_cv(LINE_NAME + line_id);
                } else {
                    delete_cv(LINE_NAME + drag_id);
                }
            },
            stop: function () {
                // console.log($(tmp)[0]);
                // drag_x = $(tmp)[0].offsetLeft-offset_left+SET_RADIUS;
                // drag_y = $(tmp)[0].offsetTop-offset_top+SET_RADIUS;
                drag_x = $(tmp)[0].offsetLeft + SET_RADIUS;
                drag_y = $(tmp)[0].offsetTop + SET_RADIUS;
                var i = tmp.replace(/[^0-9]/ig, "");
                pose[i] = set_pose(drag_x, drag_y, i);

                var drag_point = new ROSLIB.Topic({
                    ros: ros,
                    name: '/control',
                    queue_size: 10,
                    messageType: 'actioncli_move_base/ControlRequest'
                });


                var req_id = get_rand_req_id();
                pose[i].header.stamp = new Date().getTime();

                var point_msg = set_request_msg(host_tmp_id, req_id, HS_1, SEND_POSE, Number(i), pose[i]);

                frame_id = point_msg.header.frame_id;


                drag_point.publish(point_msg);
                //console.log("drag a point.")


                // posestamped.publish(pose[dot_id]);

                // tag.status = 0;
                // tag.no = dot_id;
                // tag.drag = 0

                //setTimeout(ros_callback(tag,req), 2000);
                ros_callback(tag, point_msg);
            }
        });
        //send the really pose msg
        pose[dot_id] = set_pose(x, y, dot_id);
        //console.log(pose[dot_id])



        var req_id = get_rand_req_id();
        pose[dot_id].header.stamp = new Date().getTime();

        var point_msg = set_request_msg(host_tmp_id, req_id, HS_1, SEND_POSE, dot_id, pose[dot_id]);

        frame_id = point_msg.header.frame_id;


        var send_point = new ROSLIB.Topic({
            ros: ros,
            name: '/control',
            queue_size: 10,
            messageType: 'actioncli_move_base/ControlRequest'
        });



        send_point.publish(point_msg);


        // posestamped.publish(pose[dot_id]);

        tag.status = 0;
        tag.no = dot_id;
        tag.drag = 0;

        //setTimeout(ros_callback(tag,req), 2000);
        ros_callback(tag, point_msg);

        dot_id++;
        line_id++;
    }
}



/* draw a mini circle.*/
function draw_cirle(id, x, y, color) {
    dotCanvas = document.getElementById(id);
    if (dotCanvas.getContext) {
        dotCtx = dotCanvas.getContext('2d');
        dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
        dotCtx.beginPath();
        dotCtx.strokeStyle = SET_strokeStyle;
        dotCtx.globalAlpha = SET_globalAlpha;
        dotCtx.fillStyle = color;
        dotCtx.arc(x, y, SET_RADIUS, 0, 360, 0);
        dotCtx.stroke();
        dotCtx.fill();
        dotCtx.font = "Bold 14px Arial";
        dotCtx.textAlign = "center";
        dotCtx.fillStyle = "#000000";
        var txt = id.replace(/[^0-9]/ig, "");
        dotCtx.fillText(txt, x, 1.5 * y);
    }
}


/*set node pose.*/
function set_pose(x, y, dot_id) {
    // Derotate
    x_center_dot = x - globalMap.mapCenterX;
    y_center_dot = globalMap.mapCenterY - y;

    length_origin_dot = Math.sqrt(Math.pow(x_center_dot, 2) + Math.pow(y_center_dot, 2));
    angle_origin_dot = Math.atan(y_center_dot / x_center_dot);

    if (x_center_dot > 0) {
        base_dot_top = globalMap.mapCenterY + length_origin_dot * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
        base_dot_left = globalMap.mapCenterX + length_origin_dot * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
    } else {
        base_dot_top = globalMap.mapCenterY - length_origin_dot * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
        base_dot_left = globalMap.mapCenterX - length_origin_dot * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
    }
    // console.log("base_dot_error_coordinates:\n" + pose_trans_x(base_dot_left) + "," + pose_trans_y(base_dot_top));

    mapOriginY = globalMap.mapCenterY + center_to_origin_y * lastStatus.scale;
    mapOriginX = globalMap.mapCenterX + center_to_origin_x * lastStatus.scale;

    map_x = (base_dot_left - mapOriginX) / lastStatus.scale * img_resolution;
    map_y = (mapOriginY - base_dot_top) / lastStatus.scale * img_resolution;
    // console.log("base_dot\n" + map_x + "," + map_y);

    // length_base_mapping_dot = Math.sqrt(Math.pow(x - globalMap.mapOriginX, 2) + Math.pow(globalMap.mapOriginY - y, 2));
    // angle_dot_CenterY = Math.atan(x_center_dot / y_center_dot);
    // angle_dot_origin_rotateY = imgStatus.rotate * Math.PI / 180 - angle_dot_CenterY;
    // map_tmp_x = length_base_mapping_dot * Math.sin(angle_dot_origin_rotateY) * img_resolution;
    // map_tmp_y = length_base_mapping_dot * Math.cos(angle_dot_origin_rotateY) * img_resolution;
    // map_x = map_tmp_x;
    // map_y = map_tmp_y;

    // // console.log(Math.PI / 2 -angle_origin_dot);
    // // console.log(Math.PI / 2 - angle_origin_dot + imgStatus.rotate * Math.PI / 180);
    // // console.log("top:" + base_dot_top + "left: " + base_dot_left);
    // // console.log("test" + pose_trans_x(base_dot_left) + "," + pose_trans_y(base_dot_top));
    // console.log("test:\n" + map_x + ',' + map_y);
    // console.log("will send:\n" + pose_trans_x(x) + "," + pose_trans_y(y));
    // map_x = pose_trans_x(x);
    // map_y = pose_trans_y(y);
    fuck_dot[dot_id] = [map_x, map_y];
    // console.log(fuck_dot);

    var pose = new ROSLIB.Message({
        header: {
            seq: 1,
            stamp: null,
            frame_id: 'map_2D'
        },
        pose: {
            position: {
                x: map_x,
                y: map_y,
            },
            orientation: {
                //x: (dot_id - false),
                w: 1
            }
        }
    });
    return pose;
}

function phone_tap() {
    var path = document.getElementById(MAP_ID);
    path.addEventListener('touchstart', function (e) {
        //  $("#"+MAP_ID).on("tap",function(e){
        if (isJqmGhostClick(e)) {
            return;
        }
        var canvas = document.getElementById(CV_BOTTOM);
        if (canvas.getContext && path_err == 0 && forbidden == 0 && end == 0) {

            // offset_left = $("#"+CV_BOTTOM)[0].offsetLeft;
            // offset_top = $("#"+CV_BOTTOM)[0].offsetTop;
            if (navigator.platform.indexOf("iPhone") !== -1 || navigator.platform.indexOf("iPad") !== -1) {
                x = e.pageX - offset_left;
                y = e.pageY - offset_top;
            } else {

                x = e.targetTouches[0].pageX - offset_left;
                y = e.targetTouches[0].pageY - offset_top;
            }

            var ctx = canvas.getContext('2d');
            var imageData = ctx.getImageData(x, y, 1, 1);
            var pose = Array();


            if (imageData.data[0] >= 250) {
                var node = document.createElement("canvas");
                node.id = CV_NAME + dot_id;
                node.width = SET_RADIUS * 2;
                node.height = SET_RADIUS * 2;
                node.className = 'dot';
                node.style.top = y - SET_RADIUS + offset_top + 'px';
                node.style.left = x - SET_RADIUS + offset_left + 'px';

                document.getElementById(MAP_ID).appendChild(node);
                draw_cirle(node.id, SET_RADIUS, SET_RADIUS, yellow);
                var tmp = "#" + node.id;
                // the ios clientX is different from android clintx.
                // if( navigator.platform.indexOf("iPhone")!==-1 || navigator.platform.indexOf("iPad")!==-1 ){

                //console.log('offset_top',offset_top)
                //console.log('y',y)

                pose[dot_id] = set_pose(x, y, dot_id);
                frame_id = pose[dot_id].header.frame_id;
                posestamped.publish(pose[dot_id]);
                tag.status = 0;
                tag.no = dot_id;
                ros_callback(tag);
                dot_id++;
                line_id++;
            }
        }
    });
}

//check if click event firing twice.
var lastTapTime;

function isJqmGhostClick(event) {
    var currTapTime = new Date().getTime();
    if (lastTapTime == null || currTapTime > (lastTapTime + 800)) {
        lastTapTime = currTapTime;
        return false;
    } else {
        return true;
    }
}


// window.onload = function () {
//     var ispc = navigator.platform;
//     if (ispc.indexOf("Linux x86") !== -1 || ispc.indexOf("Mac") !== -1 || ispc.indexOf("Win32") !== -1)
//         pc_click();
//     else
//         phone_tap();
// };