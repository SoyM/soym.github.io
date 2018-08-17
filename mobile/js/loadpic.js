var zoom = 1;

    function getScrollWith(){
        var wrap = setAttributes(document.createElement('div'),{
            style : {
                width : '200px',
                height: '200px',
                overflow: 'auto',
                position:'absolute',
                visibility:'hidden'
            }
        })
        var inner = setAttributes(document.createElement('div'),{
            style : {
                width : '100px',
                height: '2000px'
            }
        })
        document.body.appendChild(wrap);
        wrap.appendChild(inner);
        var w = wrap.offsetWidth - wrap.clientWidth;
        document.body.removeChild(wrap);
        wrap = null;
        inner = null;
        return w;
    }
    function setAttributes(elem,opts){
        for(var key in opts){
            if(typeof opts[key] == 'string'){
                elem[key] = opts[key];
            }else{
                if(!elem[key]){
                    elem[key] = {};
                }
                setAttributes(elem[key],opts[key]);
            }
        }
        return elem;
    }



function loadpic(id,picurl){
  var image = new Image();
  image.onload = function(){
    var cv_bottom =document.getElementById(id);
    var cv_bottom_ctx = cv_bottom.getContext("2d");
    // cv_bottom.width = image.width;
    // cv_bottom.height = image.height;
    // console.log(window.screen.availWidth)
    // console.log(getScrollWith())
    // console.log(document.documentElement.clientWidth)
    var ispc = navigator.platform;
    if( ispc.indexOf("Linux x86") !== -1 || ispc.indexOf("Mac") !== -1 || ispc.indexOf("Win32") !== -1){
      var clientWidth = window.screen.availWidth - getScrollWith();
    }
    else{
      clientWidth = window.innerWidth
      // var clientWidth = document.body.clientHeight;
    }
    // console.log(window.innerWidth)
    // console.log(getScrollWith())

    // console.log(clientWidth)
    //var clientHeight = document.body.clientHeight;

    var cw = clientWidth
    var ch = clientWidth*image.height/image.width
    //cv_bottom_ctx.drawImage(image,0,0);

    $("body").width(clientWidth);

    cv_bottom.width = cw;
    cv_bottom.height = ch;

    cv_bottom_ctx.drawImage(image, 0, 0, cw, ch) 

    zoom = cw/image.width

    //document.body.appendChild(image);
    return cv_bottom;   
  }
  image.src = picurl;
}

loadpic('cv_bottom','img/chuangkexueyuan.png');







function loadAndDrawImage(url)
{
    // Create an image object. This is not attached to the DOM and is not part of the page.
    var image = new Image();

    // When the image has loaded, draw it to the canvas
    image.onload = function()
    {
        var locate =document.getElementById('locate');
        var locate_ctx = locate.getContext("2d");
        //document.getElementById("map").appendChild(canvas);

        locate.width  = 30;
        locate.height = 30;

        //var context = canvas.getContext("2d");
        //console.log("aa");

        locate_ctx.drawImage(image, 0, 0,30,30);
       return locate;   

    }

    // Now set the source of the image that we want to load
    image.src = url;
}

  loadAndDrawImage('img/roboto-logo.png')
