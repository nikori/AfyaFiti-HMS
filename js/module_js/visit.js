var api_url = localStorage.getItem('API_URL');

function get_payment_modes(acc_det) {

    console.log("In here");
    console.log(acc_det);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/b_payforms",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };

    $.ajax(settings).done(function (response) {
        $(".b_paymode_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".b_paymode_id").append(please_select);
        $.each(response, function (i, value) {
            if (acc_det[2] == 'Y') {
                var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                $(".b_paymode_id").append(option_tag);
            } else {
                if (value.name !== 'CORPORATE') {
                    var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                    $(".b_paymode_id").append(option_tag);
                }
            }
        });
    });
}

function get_c_nodes() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/c_nodes",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    }

    $.ajax(settings).done(function (response) {
        $(".c_node_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".c_node_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
            $(".c_node_id").append(option_tag);
        });
    });
}

function get_c_departments() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/c_departments",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };

    $.ajax(settings).done(function (response) {
        $(".c_department_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".c_department_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_department_id + "'>" + value.description + "</option>";
            $(".c_department_id").append(option_tag);
        });
    });
}