//  ---------------------------
//  按钮操作 
// ----------------------------

// 
// Connecting to ROS
//
function clear_all_without_init() {
    for (var i = 0; i < dot_id; i++) {
        var dot_clean = CV_NAME + i;
        var line_clean = LINE_NAME + i;
        delete_cv(dot_clean);
        delete_cv(line_clean);
    }
    path_err = 0;
    forbidden = 1;
    end = 0;
    dot_id = 1;
    line_id = -1;
    $("#" + LOCATE).hide();
}


function ros_con(init_ros) {

    document.getElementById("ip").setAttribute('style', 'pointer-events:none');

    var ros_new = new ROSLIB.Ros();

    ros = ros_new;

    // If there is an error on the backend, an 'error' emit will be emitted.
    ros_new.on('error', function (error) {

        globalMap.conn_status = 'error';
        globalMap.conn_mode = "connect";
        globalMap.button_seen = false;
        globalMap.activeColor = 'red';

        console.log(error);
        notify('连接错误', 1.5, "error");


        clear_all_without_init();



        ros_new.close();

        // todo .............
    });

    // Find out exactly when we made a connection.
    ros_new.on('connection', function () {
        var d = new Date();
        init_ros();
    });

    
    ros_new.on('close', function () {
        var d = new Date();
        notify('连接关闭', 1.5, "error");
        new_window = 0;
        console.log('Connection closed.', d.toUTCString());

        globalMap.conn_status = 'closed';
        globalMap.conn_mode = "connect";
        globalMap.button_seen = false;
        globalMap.activeColor = 'yellow';

        if (debug == true) {
            globalMap.conn_status = 'connected';
            init_ros();
        }

        clear_all_without_init();

        ros_new.close();


    });

    var ip = globalMap.ip;
    console.log(ip);
    ip = `ws://${ip}:9090`;

    // Create a connection to the rosbridge WebSocket server.
    ros_new.connect(ip);
    //ros.connect('ws://192.168.1.103:9090');
}

function start_button() {

    var start_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });


    var req_id = get_rand_req_id();
    var index = 0;

    var start_msg = set_request_msg( host_tmp_id, req_id, HS_1, START, index, vpose)

    switchMapMove();

    start_control_pub.publish(start_msg);


    botton_callback(start_msg);

}



function pause_button() {

    console.log("1111111");

    var pause_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });



    var req_id = get_rand_req_id();
    var index = 0;

    var pause_msg = set_request_msg( host_tmp_id, req_id, HS_1, PAUSE, index, vpose)


    pause_control_pub.publish(pause_msg);


    botton_callback(pause_msg);



}



function save_path() {



    var save_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });

    var req_id = get_rand_req_id();
    var index = 0;

    var save_msg = set_request_msg( host_tmp_id, req_id, HS_1, SAVE, index, vpose)


    save_control_pub.publish(save_msg);


    botton_callback(save_msg);

}



function goalend_button() {



    var goend_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });

    var req_id = get_rand_req_id();
    var index = 0;

    var goalend_msg = set_request_msg( host_tmp_id, req_id, HS_1, FINISH, index, vpose);
    
    console.log('go end.');
    goend_control_pub.publish(goalend_msg);


    if (dot_id !== 1 && line_id !== -1) {

        botton_callback(goalend_msg);

    }
}

function clearall() {
    for (var i = 0; i < dot_id; i++) {
        var dot_clean = CV_NAME + i;
        var line_clean = LINE_NAME + i;
        delete_cv(dot_clean);
        delete_cv(line_clean);
    }

    path_err = 0;
    forbidden = 1;
    end = 0;
    dot_id = 1;
    line_id = -1;

    tmp_source = [];

    dot_tmp_hub = [];
    fuck_path = [];

    init_ros();
}






function discon_button(){




    var discon_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });


    var req_id = get_rand_req_id();
    var index = 0;

    var dis_msg = set_request_msg( host_tmp_id, req_id, HS_1, DIS_CONNECT, index, vpose);


    discon_control_pub.publish(dis_msg);

    botton_callback(dis_msg);


}

// function clearall() {

//     for (var i = 0; i < dot_id; i++) {
//         var dot_clean = CV_NAME + i;
//         var line_clean = LINE_NAME + i;
//         delete_cv(dot_clean);
//         delete_cv(line_clean);
//     }
//     path_err = 0;
//     forbidden = 1;
//     end = 0;
//     dot_id = 1;
//     line_id = -1;
//     init_ros();
// }

function switchMapMove() {
    tmp = document.getElementById("MapMoveClick");
    if (tmp.getAttribute("checked") != null) {
        tmp.removeAttribute("checked");
        globalMap.Mode_mapMove = false;
    }else{
        tmp.setAttribute("checked","checked");
        globalMap.Mode_mapMove = true;
    }  
}

function zoom_in(){
    imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;

    mXY = windowToCanvas(globalMap.mapCenterX, globalMap.mapCenterY);
    // console.log(mXY);
    drawImgByStatus(mXY.x, mXY.y);
}

function zoom_out(){
    imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;

    mXY = windowToCanvas(globalMap.mapCenterX, globalMap.mapCenterY);
    // console.log(mXY);
    drawImgByStatus(mXY.x, mXY.y);
}

function rotate_left(){
    rotate = parseInt(imgStatus.rotate / 20) * 20 - 20;
    imgStatus.rotate = rotate;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
}

function rotate_right(){
    rotate = parseInt(imgStatus.rotate / 20) * 20 + 20;
    imgStatus.rotate = rotate;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
}
