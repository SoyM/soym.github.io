//最小值
if (typeof Array.prototype['posemin'] == 'undefined') { 
	Array.prototype.posemin = function(a) {
		var min = this[0].pose.position[a];
		var len = this.length;
		for (var i = 1; i < len; i++){ 
			if (this[i].pose.position[a] < min){ 
				min = this[i].pose.position[a]; 
			} 
		} 
	return min;
	}
}

//最大值
if (typeof Array.prototype['posemax'] == 'undefined') { 
	Array.prototype.posemax = function(a) { 
		// console.log("a is ",a)
		// console.log("this is",this)		
		// console.log("this[0] is",this[0])
		var max = this[0].pose.position[a];
		var len = this.length; 
		for (var i = 1; i < len; i++){ 
			if (this[i].pose.position[a] > max) { 
				max = this[i].pose.position[a]; 	
			} 
		} 
		return max;
	}
}

function arraysplit(arr){
	var split = new Array();
	split[0] = jQuery.extend(true,{},arr);
	split[1] = jQuery.extend(true,{},arr);
	split[2] = 0;
    for (let i = 0; i < arr.poses.length; i++) {
    	if( arr.poses[i].header.frame_id !== 'map_2D'){
    		var tmp = i;
    	}
    }
    split[0].poses = split[0].poses.slice(0,tmp);
    split[1].poses = split[1].poses.slice(tmp);
    if( split[1].poses.length == 0 )
    	split[2] = 0;
    else if( split[1].poses.length == 1 )
    	split[2] = 1;
    else if ( split[1].poses.length > 1 )
    	split[2] = 2;
    //console.log(split);
    return split;
}

//        x = (message.poses[i].pose.position.x+23.4)/0.05-SET_RADIUS;
//        y = (message.poses[i].pose.position.y*(-1) + 12.200000)/0.05-SET_RADIUS;
    // map_x = (x+SET_RADIUS)*0.05-23.400000;
    // map_y = ((y+SET_RADIUS)*0.05-12.200000)*-1;