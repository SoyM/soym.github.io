
window.onbeforeunload = function(event) {
    
    var discon_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });

    var req_id = get_rand_req_id();
    var index = 0;

    var dis_msg = set_request_msg(host_tmp_id, req_id, HS_1, DIS_CONNECT, index, vpose);

    discon_control_pub.publish(dis_msg);


    botton_callback(dis_msg);

    host_tmp_id = randomWord(false, 12);

    // command.publish(close_window_msg);
    //alert("Goodbye!");
    console.log(event);

};

// ===========================
// 沟通协议
// ===========================
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
//host_tmp_id = Math.random().toString(36).substr(2)
var host_tmp_id = randomWord(false, 12);
//command
var INIT_AND_RELOAD = 0;
var START = 1;
var PAUSE = 2;
var SAVE = 3;
var SEND_POSE = 4;
var FINISH = 5;
var DIS_CONNECT = 6;
//HS
var HS_1 = 0;
var HS_2 = 1;
var HS_3 = 2;
var HS_BC = 3;

var vpose;
var request_msg = new ROSLIB.Message({
    header: {
        stamp: new Date().getTime(),
        frame_id: "@" + host_tmp_id,
    },
    type: 0,
    command: 0,
    patrol_pose: {
        index: 0,
        pose: vpose,
    }

});


function set_request_msg(host_tmp_id, req_rand_id, type, command, index, patrol_pose) {
    //var msg = new ROSLIB.Message
    request_msg.header.frame_id = host_tmp_id + '@' + req_rand_id;
    request_msg.type = type;
    request_msg.command = command;
    request_msg.patrol_pose.pose = patrol_pose;
    request_msg.patrol_pose.index = index;
    request_msg.header.stamp = new Date().getTime();
    return request_msg;
}


function rep_hs_third(response) {
    //console.log("publish third handshake")
    response.type = HS_3;
    response.header.stamp = new Date().getTime();

    var rep_hs_third = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 10,
        messageType: 'actioncli_move_base/ControlRequest'
    });

    rep_hs_third.publish(response);
}



function check_timestmap(pub_time, sub_time) {
    if (sub_time > pub_time) {
        //console.log("time error.")
        return false;
    } else {
        return true;
    }

}