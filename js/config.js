var debug = false;
var web_dispaly_hz = 0.1;
var origin_x = -21.455003999999988;
var origin_y = -15.575003999999986;
var img_width = 495;
var img_height = 629;
var img_resolution = 0.07;
var offset_x = 0;
var offset_y = 0;

// 图片中心 到 地图原点 的距离
var center_to_origin_x = 59.000057143;
var center_to_origin_y = 91.999942857;

var angle_center_origin = Math.atan(center_to_origin_x / -center_to_origin_y);
var length_center_origin = Math.sqrt(Math.pow(center_to_origin_x, 2) + Math.pow(center_to_origin_y, 2));


//===============================
// 基础配置
//===============================
var config = {
    width: document.body.clientWidth - 5, // 设置canvas的宽
    height: document.documentElement.clientHeight - 7, // 设置canvas的高
    imgSrc: 'img/chuangkexueyuan.png', // 图片路径
    maxScale: 4.6, // 最大放大倍数
    minScale: 0.6, // 最小放大倍数
    step: 0.4 // 每次放大、缩小 倍数的变化值
};


// key var
var path_err = 0;
var forbidden = 1;
var end = 0;
var dot_id = 1;
var line_id = -1;
var CV_NAME = 'target';
var LINE_NAME = 'line';
var MAP_ID = 'map';
var CV_BOTTOM = 'cv_bottom';
var CANVAS_IN_CANVAS = "canvas_in_canvas";
var LINE_DIV = "line_div";
var LOCATE = 'locate';
var frame_id;
var offset_left;
var offset_top;
var tag = {
    status: 0,
    no: 0
};

//draw var
var blue = '#000080';
var red = '#800000';
var green = '#008000';
var aqua = '#00ffff';
var yellow = '#ffff00';
var fuchsia = '#ff00ff';
var line_green = '#229954';
var SET_RADIUS = 9;
var SET_strokeStyle = "#888888";
var SET_globalAlpha = 0.618;
var LINE_WETGHT = 3;
var new_window = 0;

var imgStatus = {
    'scale': 1.0,
    'rotate': 0
};
var lastStatus = {};
var currentStatus = {};

// ------ canvas ---------------------------------------------------
var canvas = document.getElementById("cv_bottom");
var ctx = canvas.getContext("2d");

var locate = document.getElementById('locate');
var locate_ctx = locate.getContext("2d");


var fuck_dot = Array();
var fuck_path = Array();

// if(window.orientation );



function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}



//host_tmp_id = Math.random().toString(36).substr(2)
host_tmp_id = randomWord(false,12);


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

// TargetDot 为 旋转缩放 存在的property
var dot_tmp_hub = [];



