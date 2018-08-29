var debug = false;

// ==Default================================
//  地图配置
// =========================================
var mapImgSrc = '/img/chuangkexueyuan.png';
var img_resolution = 0.07;
var img_width = 495;
var img_height = 629;
var origin_x = -21.455003999999988;
var origin_y = -15.575003999999986;
var body_bgcolor = '#e7e7e7';

// ==Replaceable=============================
//OCTF4-exhibition 
// ==========================================
// mapImgSrc = "img/OCTF4-exhibition.png";
// img_resolution = 0.05;
// img_width = 915;
// img_height = 682;
// origin_x = -23.874997999999998;
// origin_y = -20.374997999999998;
// body_bgcolor = 'rgb(205, 205, 205)';

// ==Replaceable================================
//  地图配置
// =========================================
var mapImgSrc = '/img/cropped.png';
var img_resolution = 0.07;
var img_width = 495;
var img_height = 629;
var origin_x = -21.455003999999988;
var origin_y = -15.575003999999986;
var body_bgcolor = 'rgb(204, 204, 204)';




// ===============================
// 读取其他配置
// ===============================
// read config json usage:
// readTextFile("./OCTF4-exhibition.json", function(text){
//     var json_config = JSON.parse(text);
//     console.log(json_config);
// });

// ===============================
// 基础配置
// ===============================
var web_dispaly_hz = 0.1;
var canvas_width_offerset = 5;
var canvas_height_offerset =10;
var config = {
    width: document.body.clientWidth - canvas_width_offerset, // 设置canvas的宽
    height: document.documentElement.clientHeight - canvas_height_offerset, // 设置canvas的高
    imgSrc: mapImgSrc, // 图片路径
    maxScale: 4.6, // 最大放大倍数
    minScale: 0.6, // 最小放大倍数
    step: 0.4 // 每次放大、缩小 倍数的变化值
};


// =================================
//  画图 handle
// =================================
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
var tag = {
    status: 0,
    no: 0
};


// =================================
// TargetDot,TrajectoryLine样式
// =================================
var red = '#800000';
var green = '#008000';
var yellow = '#ffff00';
var line_green = '#229954';
var SET_RADIUS = 9;
var SET_strokeStyle = "#888888";
var SET_globalAlpha = 0.618;
var LINE_WETGHT = 3;
var new_window = 0;
var nav_seen = true;


var tips_message = "1,输入机器人地址，然后点击Connect按钮\
2,连接成功后，在地图上空白处点击第一个点，为机器人的起始位置\
3,点击第二个点 ，等待机器人响应。 若是可以到达，地图上将会出现一条路径，以此操作，您可以添加您想要的路径 如果您点击的位置是一个红色的点，请耐心等候，有可能是网络原因或者是路径不可到达，这个时候，您可以拖动您的点到其他可以到达的地方并等待机器人的响应。\
4,当您想要的路径已经规划完成,点击完成按钮，然后点击 开始行走，机器人就会随着路径开始行走了。";

var globalMap = new Vue({
    el: '#map',
    data: {
        is_mobile: false,
        ip: '192.168.1.200',
        tips_seen: false,
        button_seen: false,
        robot_seen: true,
        rotate_seen: true,
        sidenav_seen: true,
        seen: false,

        Mode_mapMove: true,

        conn_status: "offline",
        conn_mode: "connect",
        activeColor: 'white',

        // seen: true,
        mapCenterX: 0,
        mapCenterY: 0,
        mapOriginX: 0,
        mapOriginY: 0,
        lastScale: 1,
        robotLastScale: 1,
        robotSpecCount: 1,

        robotZindex: -100,
        robotPosition: 'relative',
        robotWidth: 15,
        robotHeight: 15,
        robotOffsetTop: 500,
        robotOffsetLeft: 800,
        robotShowTop: 500,
        robotShowLeft: 800,
        robotOriginX: 2,
        robotOriginY: 4,

        targetMapLeft: 0,
        targetMapTop: 0,
        targetMapWidth: 0,
        targetMapHeigth: 0,
        targetMapPosMode: 'fixed',

        trajectoryMapWidth: 0,
        trajectoryMapHeight: 0,
        trajectoryMapLeft: 0,
        trajectoryMapTop: 0,

        tips_message: tips_message,
    },
    methods: {
        showtips: function () {
            this.tips_seen = !this.tips_seen;
        }
    },
});

// 
// 移动适配
// 
if (window.orientation != undefined) {
    globalMap.is_mobile = true;
    if (window.orientation != 90 && window.orientation != 270) {
        // alert("横屏体验更佳");
    }
}