  // Connecting to ROS
  // -----------------




var ros = new ROSLIB.Ros()


  function ros_con(init_ros) {

      var ros_new = new ROSLIB.Ros();

      ros = ros_new


      // If there is an error on the backend, an 'error' emit will be emitted.
      ros_new.on('error', function(error) {
          document.getElementById('warning').style.display = 'none';
          document.getElementById('connected').style.display = 'none';
          document.getElementById('closed').style.display = 'none';
          document.getElementById('error').style.display = 'inline';
          document.getElementById('ip').style.display = 'inline';
          document.getElementById('con').style.display = 'inline';
          document.getElementById('iptag').style.display = 'inline';


          document.getElementById('clearall').style.display = 'none';
          document.getElementById('start').style.display = 'none';
          document.getElementById('pause').style.display = 'none';
          document.getElementById('savepath').style.display = 'none';
          document.getElementById('goend').style.display = 'none';
          document.getElementById('discon').style.display = 'none';

          console.log(error);
          notify('连接错误', 1.5, "warn")


    //if(message.command == DIS_CONNECT){
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
        ros_new.close()
     // }



      });

      // Find out exactly when we made a connection.
      ros_new.on('connection', function() {
          var d = new Date();

          //notify('连接成功', 1.5, "success")

          console.log('Connection made!', d.toUTCString());

          //forbidden = 0;
          init_ros();
      });

      ros_new.on('close', function() {
          var d = new Date();
          //notify('连接关闭', 1.5, "warn")
          new_window = 0
          console.log('Connection closed.', d.toUTCString());
          document.getElementById('warning').style.display = 'none';
          document.getElementById('connected').style.display = 'none';
          document.getElementById('closed').style.display = 'inline';
          document.getElementById('ip').style.display = 'inline';
          document.getElementById('con').style.display = 'inline';
          document.getElementById('warning').style.display = 'none';
          document.getElementById('error').style.display = 'none';
          document.getElementById('iptag').style.display = 'inline';

          //warning


          document.getElementById('clearall').style.display = 'none';
          document.getElementById('start').style.display = 'none';
          document.getElementById('pause').style.display = 'none';
          document.getElementById('savepath').style.display = 'none';
          document.getElementById('goend').style.display = 'none';
          document.getElementById('discon').style.display = 'none';


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


          
      });

      var ip = $("#ip")[0].value;
      ip = `ws://${ip}:9090`;

      // Create a connection to the rosbridge WebSocket server.
      ros_new.connect(ip);
      //ros.connect('ws://192.168.1.103:9090');
  }