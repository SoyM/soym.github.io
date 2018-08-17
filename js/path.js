
// window.onload = function () {
//     var ispc = navigator.platform;
//     if (ispc.indexOf("Linux x86") !== -1 || ispc.indexOf("Mac") !== -1 || ispc.indexOf("Win32") !== -1)
//         pc_click();
//     else
//         phone_tap();
// };

// init a posestamped.
function init_ros() {
    //host_tmp_id = Math.floor(Math.random() * 10000);
    console.log("host_tmp_id:" + host_tmp_id);


    //-------------------------------------------
    var req_id = get_rand_req_id();
    var index = 0;

    var init_msg = set_request_msg(host_tmp_id, req_id, HS_1, INIT_AND_RELOAD, index, vpose);


    var init_control_pub = new ROSLIB.Topic({
        ros: ros,
        name: '/control',
        queue_size: 1,
        messageType: 'actioncli_move_base/ControlRequest'
    });


    init_control_pub.publish(init_msg);


    botton_callback(init_msg);

}


function botton_callback(botton) {

    var botton_second = new ROSLIB.Topic({
        ros: ros,
        name: '/control_status',
        queue_size: 1,
        messageType: 'actioncli_move_base/SystemResponse'
    });


    botton_second.subscribe(function (message) {
        // console.log(botton)
        // console.log(message)
        var tmp = botton;

        if (check_timestmap(tmp.header.stamp, message.header.stamp) && message.type !== HS_BC) {
            if (String(message.header.frame_id) == String(tmp.header.frame_id)) {

                console.log(botton);
                console.log(message);


                if (Number(message.command) == Number(tmp.command)) {
                    if (message.type == HS_2) {
                        if (tmp.command == INIT_AND_RELOAD) {
                            if (message.success === true) {
                                //notify(message.info, 1.5, "success")
                                rep_hs_third(tmp);

                                notify('连接成功', 1.5, "success");

                                //console.log('Connection made!', d.toUTCString());

                                globalMap.conn_status = 'connected';
                                globalMap.conn_mode = "reconnect";
                                globalMap.button_seen = true;
                                globalMap.activeColor = 'green';


                                //todo.....
                                //                                login_success()
                                //console.log(botton_second)
                                botton_second.unsubscribe();
                                console.log("ROS Init Success");

                                forbidden = 0;
                                //$("div.row").show()

                                //$("#" + LOCATE).show()


                                setInterval(function () {
                                    locate_robot = new ROSLIB.Topic({
                                        ros: ros,
                                        name: '/control_status',
                                        queue_size: 10,
                                        messageType: 'actioncli_move_base/SystemResponse'
                                    });

                                    locate_robot.subscribe(function (message) {
                                        if (message.type === HS_BC) {
                                            globalMap.robotOriginX = message.robot_pose.pose.position.x;
                                            globalMap.robotOriginY = message.robot_pose.pose.position.y;

                                            // console.log(message.robot_pose);
                                            // 小机器人图片的位置偏移
                                            tmp = rotate_mapping(message.robot_pose.pose.position.x, message.robot_pose.pose.position.y);

                                            globalMap.robotOffsetTop = tmp.y - globalMap.robotHeight * lastStatus.scale / 2;
                                            globalMap.robotOffsetLeft = tmp.x - globalMap.robotWidth * lastStatus.scale / 2;
                                            // console.log("x" + message.pose.position.x + "y" + message.pose.position.y);
                                            // console.log("map Origin X:" + globalMap.mapCenterX + "Y" + globalMap.mapCenterY);
                                            // console.log("offser" + globalMap.robotOffsetTop + "," + globalMap.robotOffsetTop);
                                            locate_robot.unsubscribe();
                                        }
                                    });
                                }, web_dispaly_hz * 1000);


                                // setInterval(function() {
                                //     var get_robot_pose = new ROSLIB.Topic({
                                //         ros: ros,
                                //         name: '/control_status',
                                //         queue_size: 10,
                                //         messageType: 'actioncli_move_base/SystemResponse'
                                //     })
                                //     get_robot_pose.subscribe(function(message) {
                                //         if (message.type === HS_BC) {
                                //             var robot_offset_left = $("#" + CANVAS_IN_CANVAS)[0].offsetLeft;
                                //             var robot_offset_top = $("#" + CANVAS_IN_CANVAS)[0].offsetTop;
                                //             $("#" + LOCATE).offset({
                                //                 top: y_trans_pose(message.robot_pose.pose.position.y) + robot_offset_top - ($("#" + LOCATE).height()) / 2,
                                //                 left: x_trans_pose(message.robot_pose.pose.position.x) + robot_offset_left - ($("#" + LOCATE).width()) / 2
                                //             })
                                //             get_robot_pose.unsubscribe()
                                //         }
                                //     })
                                // }, web_dispaly_hz * 1000)

                                //listen to disconnection.

                                var rec_dis_con = new ROSLIB.Topic({
                                    ros: ros,
                                    name: '/control_status',
                                    queue_size: 1,
                                    messageType: 'actioncli_move_base/SystemResponse'
                                });

                                rec_dis_con.subscribe(function (message) {

                                    //if(message.command == DIS_CONNECT && message.header.frame_id == host_tmp_id){
                                    if (message.command == DIS_CONNECT && message.header.frame_id.indexOf(host_tmp_id) !== -1) {
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
                                        $("#" + LOCATE).hide();
                                        ros.close();
                                        //rec_dis_con.unsubscribe()
                                    }
                                });



                            } else {
                                forbidden = 1;

                                //console.log("gagaga")
                                rep_hs_third(tmp);
                                //todo.....
                                //console.log(message)
                                //botton_second.unsubscribe()
                                botton_second.unsubscribe();
                                //console.log(botton_second.unsubscribe())

                                //botton_second.unsubscribe()

                                notify(message.info, 1.5, "warn");



                                ros.close();
                            }

                        } else if (tmp.command == FINISH) {

                            if (end == 0) {

                                if (message.success == true) {
                                    line_id++;
                                    draw_line(message.fplan, line_id);
                                    fuck_path.push(message.fplan);
                                    end = 1;
                                    notify(message.info, 2000, 'success');

                                }

                                tag_status();

                                rep_hs_third(tmp);

                                botton_second.unsubscribe();

                            } else {
                                console.log("it has done.");

                                tag_status();

                                rep_hs_third(tmp)

                                botton_second.unsubscribe();


                            }

                        } else if (tmp.command == DIS_CONNECT) {

                            host_tmp_id = randomWord(false, 12)
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
                            $("#" + LOCATE).hide();
                            ros.close();


                        } else {

                            notify(message.info, 1.5, "success");
                            //console.log(message)

                            rep_hs_third(tmp);

                            //console.log(botton_second.listener('message'))
                            botton_second.unsubscribe();

                        }


                    } else {


                        notify(message.info, 1.5, "warn");



                        rep_hs_third(tmp);

                        //console.log(botton_second.listener('message'))
                        botton_second.unsubscribe();


                        console.log("server response false...................................");

                    }
                } else {
                    console.log("this message maybe for other command.");
                }
            } else {
                //console.log(message.header.frame_id + " maybe wrong. " + botton.header.frame_id)
                console.log("frame_id error. this message maybe belong to others.");
            }
        } else {
            console.log("time wrong....");
        }

    });


}



function draw_line(message, line_id) {
    var line = line_cv_property(message);
    console.log(line);
    var line_cv = document.createElement("canvas");
    line_cv.id = LINE_NAME + line_id;
    line_cv.width = line.width;
    line_cv.height = line.height;
    line_cv.className = LINE_NAME;

    line_cv.style.top = line.top + 'px';
    line_cv.style.left = line.left + 'px';

    document.getElementById(LINE_DIV).appendChild(line_cv);
    var pathCanvas = document.getElementById(line_cv.id);

    var pathCtx = pathCanvas.getContext('2d');
    pathCtx.globalAlpha = 1;
    pathCtx.strokeStyle = line_green;
    pathCtx.lineWidth = LINE_WETGHT;

    console.log("draw length is :", line.source.length);
    for (var i = 0; i < line.source.length; i++) {

        // console.log('x : ',message[i].pose.position.x)
        // console.log('y : ',message[i].pose.position.y)
        // tmp = rotate_mapping(message[i].pose.position.x, message[i].pose.position.y);
        var tmp = line.source[i];

        var x = (tmp.x - line.left);
        var y = (tmp.y - line.top);
        if (i == 0) {
            pathCtx.beginPath();
            pathCtx.moveTo(x, y);
        } else {
            pathCtx.lineTo(x, y);
            pathCtx.stroke();
        }
    }

    pathCanvas.setAttribute('style', 'overflow:hidden; pointer-events:none; position:fixed; top:' + pathCanvas.style.top + "; left:" + pathCanvas.style.left);
    path_err = 0;
    forbidden = 0;
}

function line_cv_property(message) {

    var horizontal_max = 0;
    var horizontal_min = Number.MAX_VALUE;
    var vertical_max = 0;
    var vertical_min = Number.MAX_VALUE;
    var tmp_source = [];
    for (var i = 0; i < message.length; i++) {
        if (i % 8 == 0 || i == message.length - 1) {

            tmp = rotate_mapping(message[i].pose.position.x, message[i].pose.position.y);
            tmp_source.push(tmp);
            horizontal_max = (tmp.x > horizontal_max ? tmp.x : horizontal_max);
            horizontal_min = (tmp.x < horizontal_min ? tmp.x : horizontal_min);
            vertical_max = (tmp.y > vertical_max ? tmp.y : vertical_max);
            vertical_min = (tmp.y < vertical_min ? tmp.y : vertical_min);
        }
    }

    // console.log(vertical_min + "," + vertical_max);

    // 取 线段起点和终点 和 线段最小 horizontal 值和最小 vertical 作对比
    var line_begin = rotate_mapping(message[0].pose.position.x, message[0].pose.position.y);
    var line_end = rotate_mapping(message[message.length - 1].pose.position.x, message[message.length - 1].pose.position.y);
    // 水平对比
    var tmp_left = 0;
    if (line_begin.x > horizontal_min || line_end.x > horizontal_min) {
        tmp_left = horizontal_min;
    } else {
        tmp_left = line_begin.x;
    }
    // 垂直对比
    var tmp_top = 0;
    if (line_begin.y > vertical_min || line_end.y > vertical_min) {
        tmp_top = vertical_min;
    } else {
        tmp_top = line_begin.y;
    }
    // 求 路径 canvas 的 高度 ，宽度
    var width_tmp = (horizontal_max - horizontal_min) + 2 * LINE_WETGHT;
    var height_tmp = (vertical_max - vertical_min) + 2 * LINE_WETGHT;
    // 防止取得的值 小于 最小路径的高度 ，宽度
    if (width_tmp < 2 * LINE_WETGHT) {
        width_tmp = 2 * LINE_WETGHT;
    }
    if (height_tmp < 2 * LINE_WETGHT) {
        height_tmp = 2 * LINE_WETGHT;
    }

    var line = {
        top: tmp_top - LINE_WETGHT,
        left: tmp_left - LINE_WETGHT,
        width: width_tmp,
        height: height_tmp,
        source: tmp_source,
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
                // console.log("wow,change to green");

            } else if (($(line_tmp0).length + $(line_tmp1).length) == 1) {

                draw_cirle(dot_change, SET_RADIUS, SET_RADIUS, yellow);

            } else if (($(line_tmp0).length + $(line_tmp1).length) == 0) {

                draw_cirle(dot_change, SET_RADIUS, SET_RADIUS, red);
                // console.log("wow,change to red");

            } else {
                console.log('error no1000');
            }
        }
    }
    tmp = '#' + LINE_NAME + line_id;
    if ($('#target1').length == 1 && $('#line1').length == 1 && $(tmp).length == 1 && end == 1)
        draw_cirle('target1', SET_RADIUS, SET_RADIUS, green);
    else if ($('#target1').length == 1 && $('#line1').length == 0 && $(tmp).length == 1)
        draw_cirle('target1', SET_RADIUS, SET_RADIUS, yellow);
}

function delete_cv(id) {
    tmp = "#" + id;
    if ($(tmp).length == 1) {
        $(tmp).remove();
    }
}



/*send path button.*/
function ros_callback(tag, req) {
    forbidden = 1;
    //Subscribing to a Topic

    // Then we add a callback to be called every time a message is published on this topic.

    var point_second = new ROSLIB.Topic({
        ros: ros,
        name: '/control_status',
        queue_size: 1,
        messageType: 'actioncli_move_base/SystemResponse'
    });


    if (tag.drag == 0) {
        point_second.subscribe(function (message) {
            console.log(message);
            var pose_length = message.fplan.length;
            if (req.header.frame_id == message.header.frame_id) {
                if (message.success == true) {
                    if (tag.no == 1) { //That means this is the first point ,then it need not draw a line.
                        forbidden = 0;
                        path_err = 0;
                        point_second.unsubscribe();
                        rep_hs_third(req);

                    } else {
                        // forbidden = 0;
                        // path_err = 0;
                        //console.log(pose_length)


                        if (pose_length !== 0) {

                            draw_line(message.fplan, line_id);


                            fuck_path.push(message.fplan);


                            rep_hs_third(req)
                            point_second.unsubscribe();
                        } else {
                            console.log("path error.")
                            notify('路径不可达', 1.5, "warn");
                            rep_hs_third(req);
                            point_second.unsubscribe();
                        }

                    }
                } else {
                    path_err = 1;
                    console.log("the planner service is error.");
                    rep_hs_third(req);
                    point_second.unsubscribe();

                }

            } else if (req.header.frame_id !== message.header.frame_id) {
                console.log('frame_id varify error.', message.header.frame_id);

                path_err = 1;
            }


            tag_status();
        });
    } else {
        point_second.subscribe(function (message) {
            console.log(message);
            //var pose_length = message.poses.length;
            //console.log(message)
            //console.log("get pose length is : ",message.poses.length)
            if (req.header.frame_id == message.header.frame_id) {

                if (message.success == true) {
                    length_of_fplan = message.fplan.length;
                    length_of_splan = message.splan.length;
                    if (length_of_fplan) {
                        if (tag.no == 1) {
                            draw_line(message.fplan, dot_id - 1);
                            fuck_path[dot_id - 1 - 1] = message.fplan;
                            console.log("draw fplan");
                        } else {
                            draw_line(message.fplan, tag.no - 1);
                            fuck_path[tag.no - 1 - 1] = message.fplan;
                            console.log("draw fplan");

                        }
                        //forbidden = 0;
                        path_err = 0;
                    } else {
                        //forbidden = 1;
                        //console.log(dot_id - tag.no)
                        if (dot_id - tag.no !== 1) {
                            path_err = 1;
                            console.log("first plan error.");
                        } else {
                            console.log("drag the first point.");
                        }
                    }

                    if (length_of_splan) {
                        //forbidden = 0;
                        path_err = 0;
                        draw_line(message.splan, tag.no);
                        fuck_path[tag.no - 1] = message.splan;
                        console.log("draw splan");

                    }
                    // else if (end == 1 && tag.no == dot_id - 1){
                    //     console.log("drag the last point.")
                    // }
                    else {
                        //forbidden = 1;
                        if (dot_id - tag.no !== 1) {
                            path_err = 1;
                            console.log("second plan error.");
                        } else {
                            forbidden = 0;
                            console.log("drag the first point.");
                        }
                    }

                    rep_hs_third(req);
                    point_second.unsubscribe();
                } else {
                    path_err = 1;
                    notify(message.info, 2000, 'warn');
                    console.log("the planner service is error.");
                    rep_hs_third(req);
                    point_second.unsubscribe();
                }

            } else {
                console.log('frame_id varify error.' + message.header.frame_id);
                path_err = 1;
            }
            tag_status();
        });
    }
}
