var senceInfo_array = Array()
var array_senceInfo_title = Array()

// 读取table数据
var tb = document.getElementById("senceInfo");
// console.log(tb)
var rows = tb.rows;
var key;
console.log("rows.length: " + rows.length + ",cells.lenght: " + rows[0].cells.length)
for (var i = 1; i < rows.length; i++) {
    key = rows[i].cells[0].innerHTML
    senceInfo_array[i - 1] = Array()

    var cells = rows[i].cells;
    for (var j = 0; j < cells.length; j++) {
        senceInfo_array[i - 1][j] = cells[j].innerHTML;

        if (j < cells.length - 4) {

            //get array_senceInfo_title
            if (i == 1) {
                array_senceInfo_title[j] = Array()
            }
            if (array_senceInfo_title[j].indexOf(cells[j].innerText) == -1) {
                array_senceInfo_title[j].push(cells[j].innerText)
            }
        }

    }
}
console.log("array_senceInfo_title")
console.log(array_senceInfo_title)
console.log("senceInfo_array")
console.log(senceInfo_array)

var classify_product_model = Array()
var array_title_id = ['product_model_select', 'lens_model_select', 'mounting_height_select', 'test_site_select',
    'Installation_method_select', 'temp_humi_select'
]

// 填入select数据
for (var m = 1; m < array_senceInfo_title.length; m++) {

    for (var i = 0; i < array_senceInfo_title[m].length; i++) {
        var product_model_select = document.createElement("option")

        product_model_select.innerText = array_senceInfo_title[m][i]
        product_model_select.id = "product_model" + i
        product_model_select.value = array_senceInfo_title[m][i];
        document.getElementById(array_title_id[m - 1]).appendChild(product_model_select)

    }
}
// console.log(classify_product_model)

var classify_array = senceInfo_array

function getclassifyInfo() {
    classify_array = Array()
    var classify_count = 0
    for (var i = 0; i < array_title_id.length; i++) {

        if (document.getElementById(array_title_id[i]).value != 'all') {
            // console.log(document.getElementById(array_title_id[i]).value)
            if (classify_count == 0) {

                for (var m = 0; m < senceInfo_array.length; m++) {
                    // console.log(senceInfo_array[m][i + 1] + "-" + document.getElementById(array_title_id[i]).value)
                    if (senceInfo_array[m][i + 1] == document.getElementById(array_title_id[i]).value) {

                        classify_array.push(senceInfo_array[m])
                    }
                }

                classify_count++
            }
            //over second classify
            else {
                var temp_classify_array = Array()
                for (var m = 0; m < classify_array.length; m++) {
                    // console.log(senceInfo_array[m][i + 1] + "-" + document.getElementById(array_title_id[i]).value)
                    if (classify_array[m][i + 1] == document.getElementById(array_title_id[i]).value) {

                        temp_classify_array.push(classify_array[m])
                    }
                }
                classify_array = temp_classify_array
            }
        }
    }
    // reset all select
    if (classify_count == 0) {
        classify_array = senceInfo_array;
    }
    renderForm(classify_array)
    console.log(classify_array)
}

function getSortedInfo(sortby) {

    var temp_classify_array = Array()

    if (sortby == "sence_id") {


        //读取原来的顺序
        if (parseInt(classify_array[1][0]) < parseInt(classify_array[0][0])) {
            for (var i = 0; i < classify_array.length; i++) {
                // 获取记录的值 用于对比
                if (i == 0) {
                    temp_classify_array[0] = classify_array[0]
                } else {

                    for (var m = 0; m < temp_classify_array.length; m++) {

                        if ((parseInt(classify_array[i][0]) > parseInt(temp_classify_array[m][0]))) {

                            // 进行下次比对
                            if (m < temp_classify_array.length - 1) {
                                if ((parseInt(classify_array[i][0]) > parseInt(temp_classify_array[m + 1][0]))) {
                                    continue
                                }
                            }

                            temp_classify_array.splice(m + 1, 0, classify_array[i])
                            console.log("a")
                            break

                        } else {
                            console.log("b")
                            temp_classify_array.splice(m, 0, classify_array[i])
                            break
                        }
                    }
                }

            }

        } else {
            console.log("1")
            for (var i = 0; i < classify_array.length; i++) {

                // 首次赋值
                if (i == 0) {
                    temp_classify_array[0] = classify_array[0]
                } else {
                    // 开始排序
                    for (var m = 0; m < temp_classify_array.length; m++) {

                        if (parseInt(classify_array[i][0]) > parseInt(temp_classify_array[m][0])) {

                            temp_classify_array.splice(m, 0, classify_array[i])
                            console.log("a")
                            break
                        } else {
                            // 进行下次比对
                            if (m < temp_classify_array.length - 1) {
                                if (parseInt(classify_array[i][0]) < parseInt(temp_classify_array[m + 1][0])) {
                                    continue
                                }
                            }
                            console.log("b")
                            temp_classify_array.splice(m + 1, 0, classify_array[i])
                            break
                        }
                    }
                }
            }


        }


    }

    // 日期排序
    else if (sortby == "sence_date_sort") {

        //读取原来的顺序
        if ((new Date(classify_array[1][7])).getTime() < (new Date(classify_array[0][7])).getTime()) {
            for (var i = 0; i < classify_array.length; i++) {
                // 获取记录的时间用于对比
                date = new Date(classify_array[i][7]);
                var sence_date = date.getTime()
                if (i == 0) {
                    temp_classify_array[0] = classify_array[0]
                } else {

                    for (var m = 0; m < temp_classify_array.length; m++) {

                        if ((sence_date > (new Date(temp_classify_array[m][7]).getTime()))) {

                            // 进行下次比对
                            if (m < temp_classify_array.length - 1) {
                                if ((sence_date > (new Date(temp_classify_array[m + 1][7]).getTime()))) {
                                    continue
                                }
                            }

                            temp_classify_array.splice(m + 1, 0, classify_array[i])
                            console.log("a")
                            break

                        } else {
                            console.log("b")
                            temp_classify_array.splice(m, 0, classify_array[i])
                            break
                        }
                    }
                }
            }

        } else {

            for (var i = 0; i < classify_array.length; i++) {
                date = new Date(classify_array[i][7]);
                var sence_date = date.getTime()
                // 首次赋值
                if (i == 0) {
                    temp_classify_array[0] = classify_array[0]
                } else {
                    // 开始排序
                    for (var m = 0; m < temp_classify_array.length; m++) {

                        if (sence_date > (new Date(temp_classify_array[m][7]).getTime())) {

                            temp_classify_array.splice(m, 0, classify_array[i])
                            console.log("a")
                            break
                        } else {
                            // 进行下次比对
                            if (m < temp_classify_array.length - 1) {
                                if ((sence_date < (new Date(temp_classify_array[m + 1][7]).getTime()))) {
                                    continue
                                }
                            }

                            temp_classify_array.splice(m + 1, 0, classify_array[i])
                            break
                        }
                    }
                }
            }


        }
    }
    console.log(temp_classify_array)
    renderForm(temp_classify_array)
}


function renderForm(temp_classify_array) {
    for (var i = 0; i < temp_classify_array.length; i++) {
        // console.log(i)
        // var cells = tb.rows[i + 1].cells;

        for (var j = 0; j < tb.rows[i + 1].cells.length; j++) {
            tb.rows[i + 1].cells[j].innerHTML = temp_classify_array[i][j];

        }
    }

    for (var i = temp_classify_array.length; i < tb.rows.length - 1; i++) {
        var cells = tb.rows[i + 1].cells;
        for (var j = 0; j < cells.length; j++) {
            cells[j].innerHTML = '';
        }
    }
    classify_array = temp_classify_array
}
