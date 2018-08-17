function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}


function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function get_rand_req_id() {
    return rand(10000, 99999);
}


function notify(message, time, css) {
    switch (css) {
        case "success":
            //toastr.success(message, {timeOut: 100000000})
            M.toast({
                html: message,
                classes: 'rounded green'
            });
            break;
        case "warn":
            M.toast({
                html: message,
                classes: 'blue'
            });
            break;
        case "error":
            M.toast({
                html: message,
                classes: 'red'
            });
            break;
        default:
            console.log("error notify type");
    }

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
