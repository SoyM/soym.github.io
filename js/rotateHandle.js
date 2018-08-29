function rotate_mapping(x, y) {

    x_mapping = (origin_quadrant == 1) || (origin_quadrant == 4) ?
        globalMap.mapCenterX + center_to_origin_x + x / img_resolution :
        globalMap.mapCenterX - center_to_origin_x + x / img_resolution;
    y_mapping = (origin_quadrant == 1) || (origin_quadrant == 2) ?
        globalMap.mapCenterY - center_to_origin_y - y / img_resolution :
        globalMap.mapCenterY + center_to_origin_y - y / img_resolution;

    // console.log("x_mapping" + x_mapping);
    // console.log("y_mapping" + y_mapping);

    // x_dot base on center
    length_x = x_mapping - globalMap.mapCenterX;
    // y_dot base on center
    length_y = globalMap.mapCenterY - y_mapping;

    // length_dot_center
    length_dot_center = Math.sqrt(Math.pow(length_x, 2) + Math.pow(length_y, 2));
    // angle_dot_center
    angle = Math.atan(length_y / length_x);

    // 点 位于 图片中心坐标 第一，四象限
    if (x_mapping > globalMap.mapCenterX) {
        // console.log("1,4");
        tmp_top = globalMap.mapCenterY - length_dot_center * Math.sin(-imgStatus.rotate * Math.PI / 180 + angle) * imgStatus.scale;
        tmp_left = globalMap.mapCenterX + length_dot_center * Math.cos(-imgStatus.rotate * Math.PI / 180 + angle) * imgStatus.scale;
    }
    // 点 位于 图片中心坐标 第二，三象限 
    else if (x_mapping < globalMap.mapCenterX) {
        // console.log("2,3");
        tmp_top = globalMap.mapCenterY + length_dot_center * Math.sin(-imgStatus.rotate * Math.PI / 180 + angle) * imgStatus.scale;
        tmp_left = globalMap.mapCenterX - length_dot_center * Math.cos(-imgStatus.rotate * Math.PI / 180 + angle) * imgStatus.scale;
    }

    tmp = {
        'x': tmp_left,
        'y': tmp_top,
    };

    return tmp;
}


function oneClickToMapCoordinate(x, y) {
    // Derotate
    x_center_dot = x - globalMap.mapCenterX;
    y_center_dot = globalMap.mapCenterY - y;

    length_origin_dot = Math.sqrt(Math.pow(x_center_dot, 2) + Math.pow(y_center_dot, 2));
    angle_origin_dot = Math.atan(y_center_dot / x_center_dot);

    if (x_center_dot > 0) {
        base_dot_top = globalMap.mapCenterY + length_origin_dot * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
        base_dot_left = globalMap.mapCenterX + length_origin_dot * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
    } else {
        base_dot_top = globalMap.mapCenterY - length_origin_dot * Math.sin(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
        base_dot_left = globalMap.mapCenterX - length_origin_dot * Math.cos(-imgStatus.rotate * Math.PI / 180 - angle_origin_dot);
    }
    // console.log("base_dot_error_coordinates:\n" + pose_trans_x(base_dot_left) + "," + pose_trans_y(base_dot_top));

    mapOriginY = (origin_quadrant == 3) || (origin_quadrant == 4) ?
        globalMap.mapCenterY + center_to_origin_y * lastStatus.scale :
        globalMap.mapCenterY - center_to_origin_y * lastStatus.scale;
    mapOriginX = (origin_quadrant == 1) || (origin_quadrant == 4) ?
        globalMap.mapCenterX + center_to_origin_x * lastStatus.scale :
        globalMap.mapCenterX - center_to_origin_x * lastStatus.scale;

    map_x = (base_dot_left - mapOriginX) / lastStatus.scale * img_resolution;
    map_y = (mapOriginY - base_dot_top) / lastStatus.scale * img_resolution;

    console.log("map_x:" + map_x + ", map_y: " + map_y);
    return [map_x, map_y];


}