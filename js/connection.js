// Connecting to ROS
// -----------------


var ros = new ROSLIB.Ros()

function clear_all_without_init(){
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
}

function ros_con(init_ros) {

  document.getElementById("ip").setAttribute('style', 'pointer-events:none');



  var ros_new = new ROSLIB.Ros();

  ros = ros_new
  // If there is an error on the backend, an 'error' emit will be emitted.
  ros_new.on('error', function (error) {

      globalMap.conn_status = 'error';
      globalMap.conn_mode = "connect";
      globalMap.button_seen = false;
      globalMap.activeColor = 'red';

      console.log(error);
      notify('连接错误', 1.5, "error");


      clear_all_without_init()



      ros_new.close()



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

      clear_all_without_init()

      ros_new.close()


  });

  var ip = $("#ip")[0].value;
  ip = `ws://${ip}:9090`;

  // Create a connection to the rosbridge WebSocket server.
  ros_new.connect(ip);
  //ros.connect('ws://192.168.1.103:9090');
}
