var vpose
var request_msg = new ROSLIB.Message({
        header: {
            stamp: new Date().getTime(),
            frame_id: "@" + host_tmp_id,
        },
        type: 0,
        command: 0,
        patrol_pose:{
            index: 0,
            pose: vpose,
        }

})

function login_success(){
    document.getElementById('warning').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('closed').style.display = 'none';
    document.getElementById('connected').style.display = 'inline';
    document.getElementById('ip').style.display = 'none';
    document.getElementById('con').style.display = 'none';


    document.getElementById('clearall').style.display = 'inline';
    document.getElementById('start').style.display = 'inline';
    document.getElementById('pause').style.display = 'inline';
    document.getElementById('savepath').style.display = 'inline';
    document.getElementById('goend').style.display = 'inline';
    document.getElementById('iptag').style.display = 'none';
    document.getElementById('discon').style.display = 'inline';
}






function rand(min,max) {
    return Math.floor(Math.random()*(max-min))+min
}

function get_rand_req_id(){
    return rand(10000,99999)
}



function set_request_msg(host_tmp_id,req_rand_id,type,command,index,patrol_pose){
    //var msg = new ROSLIB.Message
    request_msg.header.frame_id = host_tmp_id + '@' + req_rand_id
    request_msg.type = type
    request_msg.command = command
    request_msg.patrol_pose.pose = patrol_pose
    request_msg.patrol_pose.index = index
    request_msg.header.stamp = new Date().getTime()
    return request_msg
}


function rep_hs_third(response){

    //console.log("publish third handshake")

    response.type = HS_3;
    response.header.stamp = new Date().getTime()

    var rep_hs_third = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 10,
        messageType: 'actioncli_move_base/ControlRequest'
    })

    rep_hs_third.publish(response)

}




function check_timestmap(pub_time,sub_time){
    if(sub_time > pub_time){
        //console.log("time error.")
        return false
    }else{
        return true
    }

}




function html_control() {
    var clientWidth = document.body.clientWidth;
    var clientHeight = document.body.clientHeight;
    var textlength = document.getElementById("iptag").offsetWidth;
    var con = document.getElementById("con");
    var con_length = con.offsetWidth;
    var input = document.getElementById("ip");
    var iptag = document.getElementById("iptag");
    var text_marginLeft = parseInt((iptag.currentStyle || window.getComputedStyle(iptag)).marginLeft);
    var con_marginLeft = parseInt((con.currentStyle || window.getComputedStyle(con)).marginLeft);
    var con_marginRight = parseInt((con.currentStyle || window.getComputedStyle(con)).marginRight);
    input.style.width = ((((clientWidth - textlength - con_length - text_marginLeft - con_marginLeft - con_marginRight) / clientWidth) - 0.02) * 100) + "%";
}

$(window).resize(function() {
    html_control()
})


function set_cv_bg() {
    var canvas = document.getElementById(CV_BOTTOM);
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(3, 3, 1, 1);
        var cv_bg = "#" + imageData.data[0].toString(16) + imageData.data[1].toString(16) + imageData.data[2].toString(16)
        document.body.style.backgroundColor = cv_bg;
        document.body.style.backgroundColor = "#212833";
    }
}

//init a posestamped.
function init_ros() {
    setInterval(function() {
        $("#" + CANVAS_IN_CANVAS).width($("#" + CV_BOTTOM).width());
        $("#" + CANVAS_IN_CANVAS).height($("#" + CV_BOTTOM).height());
        $("#" + CANVAS_IN_CANVAS).offset({
            top: $("#" + CV_BOTTOM).position().top,
            left: $("#" + CV_BOTTOM).position().left
        });

        $("#" + LINE_DIV).width($("#" + CV_BOTTOM).width());
        $("#" + LINE_DIV).height($("#" + CV_BOTTOM).height());
        $("#" + LINE_DIV).offset({
            top: $("#" + CV_BOTTOM).position().top,
            left: $("#" + CV_BOTTOM).position().left
        });
    }, 100)



    offset_left = $("#" + CV_BOTTOM)[0].offsetLeft;
    offset_top = $("#" + CV_BOTTOM)[0].offsetTop;




    var req_id = get_rand_req_id()
    var index = 0

    var init_msg = set_request_msg( host_tmp_id, req_id, HS_1, INIT_AND_RELOAD, index, vpose)



    var init_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })



    init_control_pub.publish(init_msg);


    botton_callback(init_msg)



    // if (new_window !== 0) {
    //     console.log("hahahaha")
    //     //botton_callback(init_msg)
    // } else {
    //     new_window = 1

    // }
}








function botton_callback(botton) {

    var botton_second = new ROSLIB.Topic({
        ros: ros,
        name: '/control_status',
        queue_size: 1,
        messageType: 'actioncli_move_base/SystemResponse'
    })


    botton_second.subscribe(function(message) {
        //console.log(botton)
        var tmp = botton

        if(check_timestmap(tmp.header.stamp, message.header.stamp) && message.type !== HS_BC){
            if (String(message.header.frame_id) == String(tmp.header.frame_id)) {
                if (Number(message.command) == Number(tmp.command)) {
                    if (message.type == HS_2) {
                        if(tmp.command == INIT_AND_RELOAD){
                            if(message.success === true){
                                //notify(message.info, 1.5, "success")
                                rep_hs_third(tmp)
                                //todo.....
                                login_success()
                                //console.log(botton_second)
                                botton_second.unsubscribe()

                                forbidden = 0
                                $("div.row").show()

                                $("#" + LOCATE).show()

                                setInterval(function() {
                                    var get_robot_pose = new ROSLIB.Topic({
                                        ros: ros,
                                        name: '/control_status',
                                        queue_size: 10,
                                        messageType: 'actioncli_move_base/SystemResponse'
                                    })
                                    get_robot_pose.subscribe(function(message) {
                                        if (message.type === HS_BC) {
                                            var robot_offset_left = $("#" + CANVAS_IN_CANVAS)[0].offsetLeft;
                                            var robot_offset_top = $("#" + CANVAS_IN_CANVAS)[0].offsetTop;
                                            $("#" + LOCATE).offset({
                                                top: y_trans_pose(message.robot_pose.pose.position.y) + robot_offset_top - ($("#" + LOCATE).height()) / 2,
                                                left: x_trans_pose(message.robot_pose.pose.position.x) + robot_offset_left - ($("#" + LOCATE).width()) / 2
                                            })
                                            get_robot_pose.unsubscribe()
                                        }
                                    })
                                }, web_dispaly_hz * 1000)

                                //listen to disconnection.

                                var rec_dis_con = new ROSLIB.Topic({
                                    ros: ros,
                                    name: '/control_status',
                                    queue_size: 1,
                                    messageType: 'actioncli_move_base/SystemResponse'
                                })

                                rec_dis_con.subscribe(function(message) {

                                    //if(message.command == DIS_CONNECT && message.header.frame_id == host_tmp_id){
                                    if(message.command == DIS_CONNECT && message.header.frame_id.indexOf(host_tmp_id) !==-1 ){
                                        //console.log(message.header.frame_id)
                                        //console.log
                                        //console.log(message)
                                        notify(message.info, 1.5, "warn")

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
                                        $("#" + LOCATE).hide()
                                        ros.close()
                                        //rec_dis_con.unsubscribe()
                                    }
                                })



                            }else{
                                forbidden = 1

                                //console.log("gagaga")
                                rep_hs_third(tmp)
                                //todo.....
                                //console.log(message)
                                //botton_second.unsubscribe()
                                botton_second.unsubscribe()
                                //console.log(botton_second.unsubscribe())

                                //botton_second.unsubscribe()

                                notify(message.info, 1.5, "warn")



                                ros.close()
                            }

                        } else if(tmp.command == FINISH){

                            if (end == 0) {

                                if(message.success == true){
                                    line_id++;
                                    draw_line(message.fplan, line_id);
                                    end = 1;
                                }

                                tag_status();

                                rep_hs_third(tmp)  

                                botton_second.unsubscribe();

                            }else{
                                console.log("it has done.")

                                tag_status();

                                rep_hs_third(tmp)  

                                botton_second.unsubscribe();


                            }

                        } else if(tmp.command == DIS_CONNECT){

                                host_tmp_id = randomWord(false,12)
                                console.log("close connection")
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
                                $("#" + LOCATE).hide()
                                ros.close()


                        }else{

                            notify(message.info, 1.5, "success")
                            //console.log(message)

                            rep_hs_third(tmp)

                            //console.log(botton_second.listener('message'))
                            botton_second.unsubscribe()

                        }


                    }  else {


                        notify(message.info, 1.5, "warn")



                        rep_hs_third(tmp)

                        //console.log(botton_second.listener('message'))
                        botton_second.unsubscribe()


                        console.log("server response false...................................")

                    }
                }else{
                    //console.log("this message maybe for other command.")
                }
                //b.unsubscribe()
            }
            else{
                //console.log(message.header.frame_id + " maybe wrong. " + botton.header.frame_id)
                //console.log("frame_id error. this message maybe belong to others.")
            }
        }
        else{
            //console.log("time wrong....")
        }

    })
    //


}



function notify(message, time, css) {
    $("body").overhang({
        type: css,
        message: message,
        closeConfirm: false,
        duration: time
    });
}




// var zoom = detectZoom();
// alert(zoom);


function x_trans_pose(x) {
    //x = ((x+25)/img_resolution) ;
    x = ((x - origin_x) / img_resolution) - offset_x;
    x = x * zoom
    return x;
}

function y_trans_pose(y) {
    //y = (y*(-1)+13.8)/img_resolution ;
    //y = (y*(-1)+11.8)/img_resolution 
    y = ((((img_height * img_resolution) + origin_y) - y) / img_resolution - offset_y)
    y = y * zoom
    //console.log(y)
    return y;
}

function pose_trans_x(x) {
    //console.log(zoom)
    x = x / zoom
    // x =  (x+SET_RADIUS)*img_resolution-2500000;
    //x =  (x)*img_resolution-25.00000;
    x = (x + offset_x) * img_resolution + origin_x;
    //console.log("x:",x)
    return x;
}

function pose_trans_y(y) {
    y = y / zoom
    //console.log(y)
    // y = ((y+SET_RADIUS)*img_resolution-13.800000)*-1;
    // y = ((y)*img_resolution-13.800000)*-1;
    // y = ((y)*img_resolution-11.800000)*(-1);
    y = -(-((img_height * img_resolution) + origin_y) + (y + offset_y) * img_resolution)
    //console.log("y:",y)
    return y;
}

/* draw a mini circle.*/
function draw_cirle(id, x, y, color) {
    var canvas = document.getElementById(id);
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = SET_strokeStyle;
        ctx.globalAlpha = SET_globalAlpha;
        ctx.fillStyle = color;
        ctx.arc(x, y, SET_RADIUS, 0, 360, 0);
        ctx.stroke();
        ctx.fill();
        ctx.font = "Bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        var txt = id.replace(/[^0-9]/ig, "");
        ctx.fillText(txt, x, 1.5 * y);
    }
}

function draw_line(message, line_id) {
    var line = line_cv_property(message);
    var line_cv = document.createElement("canvas");
    line_cv.id = LINE_NAME + line_id;
    line_cv.width = line.width;
    line_cv.height = line.height;
    line_cv.className = LINE_NAME;
    // the ios clientX is different from android clintx.
    //if( navigator.platform.indexOf("iPhone")!==-1 || navigator.platform.indexOf("iPad")!==-1 ){
    // line_cv.style.top = line.top + offset_top +'px';
    // line_cv.style.left = line.left + offset_left +'px';
    line_cv.style.top = line.top + 'px';
    line_cv.style.left = line.left + 'px';
    document.getElementById(LINE_DIV).appendChild(line_cv);
    var canvas = document.getElementById(line_cv.id);
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.strokeStyle = line_green;
    ctx.lineWidth = LINE_WETGHT;
    // if( navigator.platform.indexOf("iPhone")!==-1 || navigator.platform.indexOf("iPad")!==-1 ){
    // console.log("draw length is :",message.poses.length)
    // for (var i = 0; i < message.poses.length; i++) {
    //console.log("draw length is :",message.length)
    for (var i = 0; i < message.length; i++) {

        // x = (x_trans_pose(message.poses[i].pose.position.x) - line.left);
        // y = (y_trans_pose(message.poses[i].pose.position.y) - line.top);
        x = (x_trans_pose(message[i].pose.position.x) - line.left);
        y = (y_trans_pose(message[i].pose.position.y) - line.top);

        if (i == 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    path_err = 0;
    forbidden = 0;
}

function line_cv_property(message) {



    x_max = x_trans_pose(message.posemax("x"));
    x_min = x_trans_pose(message.posemin("x"));
    // y error...
    y_min = y_trans_pose(message.posemax("y"));
    y_max = y_trans_pose(message.posemin("y"));



    var line = {
        top: y_min - LINE_WETGHT,
        left: x_min - LINE_WETGHT,
        width: (x_max - x_min) + 2 * LINE_WETGHT,
        height: (y_max - y_min) + 2 * LINE_WETGHT
    };
    return line;
}

function tag_status() {
    for (var i = 1; i <= dot_id; i++) {
        var dot_tmp = '#' + CV_NAME + i;
        var dot_change = CV_NAME + i;
        var line_tmp0 = '#' + LINE_NAME + (i - 1);
        var line_tmp1 = '#' + LINE_NAME + i;
        if ($(dot_tmp).length == 1) {
            if (($(line_tmp0).length + $(line_tmp1).length) == 2) {
                draw_cirle(dot_change, SET_RADIUS, SET_RADIUS, green);
            } else if (($(line_tmp0).length + $(line_tmp1).length) == 1) {
                draw_cirle(dot_change, SET_RADIUS, SET_RADIUS, yellow);
            } else if (($(line_tmp0).length + $(line_tmp1).length) == 0) {
                draw_cirle(dot_change, SET_RADIUS, SET_RADIUS, red);
            } else console.log('error no1000');
        }
    }
    tmp = '#' + LINE_NAME + line_id;
    if ($('#cv1').length == 1 && $('#line1').length == 1 && $(tmp).length == 1 && end == 1)
        draw_cirle('cv1', SET_RADIUS, SET_RADIUS, green);
    else if ($('#cv1').length == 1 && $('#line1').length == 0 && $(tmp).length == 1)
        draw_cirle('cv1', SET_RADIUS, SET_RADIUS, yellow);
}

function delete_cv(id) {
    var tmp = "#" + id;
    if ($(tmp).length == 1) {
        $(tmp).remove();
    }
}

/*set node pose.*/
function set_pose(x, y, dot_id) {
    map_x = pose_trans_x(x);
    map_y = pose_trans_y(y);

    var pose = new ROSLIB.Message({
        header: {
            seq: 1,
            //stamp: null,
            frame_id: "map_2D"
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






function pc_click() {
    var path = document.getElementById(CANVAS_IN_CANVAS);
    path.addEventListener('click', function(e) {
        //console.log(e)
        var canvas = document.getElementById(CV_BOTTOM);
        if (canvas.getContext && path_err == 0 && forbidden == 0 && end == 0) {
            //console.log("in")
            offset_left = $("#" + CANVAS_IN_CANVAS)[0].offsetLeft;
            offset_top = $("#" + CANVAS_IN_CANVAS)[0].offsetTop;
            // c_x = e.pageX - offset_left;
            // c_y = e.pageY - offset_top;
            //console.log(detectZoom())
            if (detectZoom() > 1.01 || detectZoom() < 0.99) {
                x = e.offsetX
                y = e.offsetY
            } else {
                x = e.layerX
                y = e.layerY
            }


            var ctx = canvas.getContext('2d');

            var imageData = ctx.getImageData(x, y, 1, 1);

            var pose = new Array();

            if (imageData.data[0] >= 250) {
                var node = document.createElement("canvas");
                node.id = CV_NAME + dot_id;
                node.width = SET_RADIUS * 2;
                node.height = SET_RADIUS * 2;
                node.className = 'dot';
                // node.style.top = y - SET_RADIUS + offset_top +'px';
                // node.style.left = x - SET_RADIUS + offset_left +'px';        
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
                    containment: ("#" + CANVAS_IN_CANVAS),
                    start: function() {
                        tag.no = tmp.replace(/[^0-9]/ig, "");
                        tag.status = 1;
                        delete_cv(LINE_NAME + tag.no);
                        var drag_id = tag.no - 1;
                        tag.drag = 1
                        if (end == 1 && drag_id == 0) {
                            delete_cv(LINE_NAME + line_id);
                        } else {
                            delete_cv(LINE_NAME + drag_id);
                        }
                    },
                    stop: function() {
                        //console.log($(tmp)[0])
                        // drag_x = $(tmp)[0].offsetLeft-offset_left+SET_RADIUS;
                        // drag_y = $(tmp)[0].offsetTop-offset_top+SET_RADIUS;
                        drag_x = $(tmp)[0].offsetLeft + SET_RADIUS;
                        drag_y = $(tmp)[0].offsetTop + SET_RADIUS;
                        var i = tmp.replace(/[^0-9]/ig, "");
                        pose[i] = set_pose(drag_x, drag_y, i);
                        // frame_id = pose[i].header.frame_id;




                        var drag_point = new ROSLIB.Topic({
                            ros: ros,
                            name: '/control',
                            queue_size: 10,
                            messageType: 'actioncli_move_base/ControlRequest'
                        })




                        var req_id = get_rand_req_id()
                        pose[i].header.stamp = new Date().getTime()

                        var point_msg = set_request_msg( host_tmp_id, req_id, HS_1, SEND_POSE, Number(i), pose[i])

                        frame_id = point_msg.header.frame_id;


                        drag_point.publish(point_msg);
                        //console.log("drag a point.")


                        // posestamped.publish(pose[dot_id]);

                        // tag.status = 0;
                        // tag.no = dot_id;
                        // tag.drag = 0

                        //setTimeout(ros_callback(tag,req), 2000);
                        ros_callback(tag,point_msg)





                    }
                });
                //send the really pose msg
                pose[dot_id] = set_pose(x, y, dot_id);
                //console.log(pose[dot_id])        



                var req_id = get_rand_req_id()
                pose[dot_id].header.stamp = new Date().getTime()

                var point_msg = set_request_msg( host_tmp_id, req_id, HS_1, SEND_POSE, dot_id, pose[dot_id])

                frame_id = point_msg.header.frame_id;


                var send_point = new ROSLIB.Topic({
                    ros: ros,
                    name: '/control',
                    queue_size: 10,
                    messageType: 'actioncli_move_base/ControlRequest'
                })



                send_point.publish(point_msg);


                // posestamped.publish(pose[dot_id]);

                tag.status = 0;
                tag.no = dot_id;
                tag.drag = 0

                //setTimeout(ros_callback(tag,req), 2000);
                ros_callback(tag,point_msg)

                dot_id++;
                line_id++;
            }
        }
    }, false);
}


function phone_tap() {
    var path = document.getElementById(MAP_ID);
    path.addEventListener('touchstart', function(e) {
        //  $("#"+MAP_ID).on("tap",function(e){
        if (isJqmGhostClick(e)) {
            return;
        }
        var canvas = document.getElementById(CV_BOTTOM)
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
            var pose = new Array();


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

                pose[dot_id] = set_pose(x, y, dot_id)
                // frame_id = pose[dot_id].header.frame_id;


                var send_point = new ROSLIB.Topic({
                    ros: ros,
                    name: '/control',
                    queue_size: 10,
                    messageType: 'actioncli_move_base/ControlRequest'
                })

                var req_id = get_rand_req_id()
                pose[dot_id].header.stamp = new Date().getTime()

                var point_msg = set_request_msg( host_tmp_id, req_id, HS_1, SEND_POSE, dot_id, pose[dot_id])

                frame_id = point_msg.header.frame_id;


                send_point.publish(point_msg);



                // pose[dot_id].header.stamp = new Date().getTime()
                // posestamped.publish(pose[dot_id]);
                tag.status = 0;
                tag.no = dot_id;
                ros_callback(tag,point_msg);



                dot_id++;
                line_id++;
            }
        }
    })
}


/*click point...*/
window.onload = function() {
    html_control()
    set_cv_bg()
    var ispc = navigator.platform;
    if (ispc.indexOf("Linux x86") !== -1 || ispc.indexOf("Mac") !== -1 || ispc.indexOf("Win32") !== -1)
        pc_click()
    else
        phone_tap()
}



/*send path button.*/
function ros_callback(tag,req) {
    forbidden = 1;
    //Subscribing to a Topic


    // Then we add a callback to be called every time a message is published on this topic.


    var point_second = new ROSLIB.Topic({
        ros: ros,
        name: '/control_status',
        queue_size: 1,
        messageType: 'actioncli_move_base/SystemResponse'
    })




    if(tag.drag == 0){
        point_second.subscribe(function(message) {
            console.log(message)
            var pose_length = message.fplan.length;
            if (req.header.frame_id == message.header.frame_id) {
                if(message.success == true){
                    if (tag.no == 1) { //That means this is the first point ,then it need not draw a line.
                        forbidden = 0;
                        path_err = 0;
                        point_second.unsubscribe();
                        rep_hs_third(req)

                    } else {
                        // forbidden = 0;
                        // path_err = 0;                        
                        //console.log(pose_length)


                        if(pose_length !== 0){
                            draw_line(message.fplan, line_id);
                            rep_hs_third(req)
                            point_second.unsubscribe();
                        }
                        else{
                            console.log("path error.")
                            notify('路径不可达', 1.5, "warn")
                            rep_hs_third(req)
                            point_second.unsubscribe();                            
                        }

                    }
                }else{
                    path_err = 1;
                    console.log("the planner service is error.")
                    rep_hs_third(req)                    
                    point_second.unsubscribe();

                }

            } else if (req.header.frame_id !== message.header.frame_id) {
                console.log('frame_id varify error.' , message.header.frame_id);

                path_err = 1;
            } 


            tag_status();
        });
    }
    else
    {
        point_second.subscribe(function(message) {
            console.log(message)
            //var pose_length = message.poses.length;
            //console.log(message)
            //console.log("get pose length is : ",message.poses.length)
            if (req.header.frame_id == message.header.frame_id) {

                if(message.success == true){
                    length_of_fplan = message.fplan.length
                    length_of_splan = message.splan.length
                    if(length_of_fplan){
                        if(tag.no == 1){
                            draw_line(message.fplan, dot_id-1);
                        }else{
                            draw_line(message.fplan, tag.no-1);
                        }
                        //forbidden = 0;
                        path_err = 0;
                    }
                    else{
                        //forbidden = 1;
                        //console.log(dot_id - tag.no)
                        if(dot_id - tag.no !== 1){
                            path_err = 1;                        
                            console.log("first plan error.")
                        }
                        else{
                            console.log("drag the first point.")
                        }
                    }

                    if(length_of_splan){
                        //forbidden = 0;
                        path_err = 0;    
                        draw_line(message.splan, tag.no);
                    }
                    // else if (end == 1 && tag.no == dot_id - 1){
                    //     console.log("drag the last point.")
                    // }
                    else{
                        //forbidden = 1;
                        if(dot_id - tag.no !== 1){
                            path_err = 1;                        
                            console.log("second plan error.")
                        }
                        else{
                            forbidden = 0;
                            console.log("drag the first point.")
                        }
                    }

                    rep_hs_third(req)
                    point_second.unsubscribe();
                }
                else
                {
                    path_err = 1;
                    console.log("the planner service is error.")
                    rep_hs_third(req)                    
                    point_second.unsubscribe();
                }

            } else{
                console.log('frame_id varify error.' + message.header.frame_id);
                path_err = 1;
            }
            tag_status();
        });        
    }    
}


function start_button() {




    var start_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })



    var req_id = get_rand_req_id()
    var index = 0

    var start_msg = set_request_msg( host_tmp_id, req_id, HS_1, START, index, vpose)


    start_control_pub.publish(start_msg);


    botton_callback(start_msg)

}



function pause_button() {



    var pause_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })



    var req_id = get_rand_req_id()
    var index = 0

    var pause_msg = set_request_msg( host_tmp_id, req_id, HS_1, PAUSE, index, vpose)


    pause_control_pub.publish(pause_msg);


    botton_callback(pause_msg)



}



function save_path() {



    var save_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })

    var req_id = get_rand_req_id()
    var index = 0

    var save_msg = set_request_msg( host_tmp_id, req_id, HS_1, SAVE, index, vpose)


    save_control_pub.publish(save_msg);


    botton_callback(save_msg)

}



function goalend_button() {



    var goend_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })




    var req_id = get_rand_req_id()
    var index = 0

    var goalend_msg = set_request_msg( host_tmp_id, req_id, HS_1, FINISH, index, vpose)
    console.log('go end.');
    goend_control_pub.publish(goalend_msg);



    if (dot_id !== 1 && line_id !== -1) {


        botton_callback(goalend_msg)


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
    init_ros();
}






function discon_button(){




    var discon_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })


    var req_id = get_rand_req_id()
    var index = 0

    var dis_msg = set_request_msg( host_tmp_id, req_id, HS_1, DIS_CONNECT, index, vpose)


    discon_control_pub.publish(dis_msg);

    botton_callback(dis_msg)


}



$(window).bind('beforeunload',function(){



    var discon_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    })


    var req_id = get_rand_req_id()
    var index = 0

    var dis_msg = set_request_msg( host_tmp_id, req_id, HS_1, DIS_CONNECT, index, vpose)


    discon_control_pub.publish(dis_msg);



    botton_callback(dis_msg)




    host_tmp_id = randomWord(false,12)

    // command.publish(close_window_msg);
    //alert("Goodbye!");


});

