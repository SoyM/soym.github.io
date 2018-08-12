function rotate_mapping(x, y) {

    x_mapping = globalMap.mapCenterX + center_to_origin_x + x / img_resolution;
    y_mapping = globalMap.mapCenterY + center_to_origin_y - y / img_resolution;

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