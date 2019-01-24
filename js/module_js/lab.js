var api_url = localStorage.getItem('API_URL');

var req_ids = new Array;

function loadLabTable1() {

    $("#mlabtable").DataTable();
}

function getLabPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_laboratory_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#mlabtable').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].visitno +
                        '</td><td>'
                        + data[x].code +
                        '</td><td>'
                        + data[x].firstname + ' ' + data[x].lastname +
                        '</td><td>'
                        + data[x].visitdate +
                        '</td><td>\n\
                        <a href="#" class="btn btn-info" onclick="return getLabPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getLabPatientDetails(x, y) {

    document.getElementById("lab_tablediv").className += ' hidden';
    document.getElementById("lab_consult").className = "consult";

    console.log("lab C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x + "",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);

//            getTestRequest(y);

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("lab_pname").innerHTML = name;
                document.getElementById("lab_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("lab_pvid").innerHTML = y;
                document.getElementById("lab_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("lab_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("lab_dob").innerHTML = "DOB: " + data[n].dob;

                getLabTriageData(y);

            }
        },
        error: function () {
            console.log("error");

        }
    }).done(getTestRequest(y));

}

//function to get the labtest request from consultation
function getTestRequest(visit_id) {

    console.log("getTestRequest : Patient ID => " + visit_id);
    $.ajax({
        url: "" + api_url + "/p_lab_referrals?filter[where][p_visit_id]=" + visit_id + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);

            for (var n = 0; n < data.length; n++) {

                console.log("Test Details: " + data[n].test_notes);
                console.log("Product group: " + data[n].m_productgroup);
                document.getElementById("test_details").innerHTML = "Test request notes: " + data[n].test_notes;
                getTestProducts(data[n].m_productgroup, data[n].group_name);

            }

        },
        error: function () {
            console.log("error");

        }
    });

}

function getTestProducts(productgroup, group_name) {

    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=" + productgroup + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);

            var container = document.getElementById("laboratory_container");

            var newlabel = document.createElement("Label");
            newlabel.class = "col-md-3 control-label";
            var text = document.createTextNode(group_name);
            newlabel.appendChild(text);
            container.appendChild(newlabel);
            container.appendChild(document.createElement("br"));
            container.appendChild(document.createElement("br"));

            for (var n = 0; n < data.length; n++) {

                req_ids.push(data[n].m_product_id);
                console.log("m_product_id ==>" + data[n].m_product_id);

                console.log("Product Details: " + data[n].name);

                console.log("red id: " + req_ids.length);
                var lab_id = +Number(req_ids.length) + Number(1);

                container.appendChild(document.createTextNode((n + 1) + ". " + data[n].name + "      "));

                var input = document.createElement("input");
                input.type = "text";
                input.class = "custom-control-input test_text";
                input.id = "lab_input" + req_ids.length;
                container.appendChild(input);
                container.appendChild(document.createElement("br"));
                container.appendChild(document.createElement("br"));

            }

        },
        error: function () {
            console.log("error");

        }
    });

}

function getLabTriageData(y) {
    console.log("Triage = Visit ID => " + y);
    $.ajax({
        url: "" + api_url + "/v_vitals?filter[where][p_visit_id]=" + y + "",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#lab_vts').DataTable({searching: false, paging: false});
            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].product +
                        '</td><td>'
                        + data[x].notes +
                        '</td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });

}


function click_lab_functions() {

    $(".submit_urine").click(function () {

        console.log("req_ids.length" + req_ids[0]);
        var j = 1;
        for (var i = 0; i < req_ids.length; i++) {
            console.log("i_value : " + i);
            console.log("j_value : " + j);
            var product_id = req_ids[i];
            var input_val = document.getElementById("lab_input" + j).value;
            console.log("m_product_id value=>" + product_id);
            console.log("text_val : " + input_val);

            post_labnotelines(product_id, input_val, i);
            j++;

        }

    });
}

function post_labnotelines(product_id, notes, i_val) {

    var created_by = $.session.get('user_id');
    var updated_by = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');
    var p_visit_id = document.getElementById("lab_pvid").innerHTML;

    $.ajax({
        url: "" + api_url + "/p_laboratorynotelines",
        type: "POST",
        data: {
            "p_visit_id": p_visit_id,
            "createdby": created_by,
            "updatedby": updated_by,
            "facility_id": facility_id,
            "notes": notes,
            "m_product_id": product_id
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting lab test values');

            //if its the last value of the done test, update visit level
            if (i_val + 1 === req_ids.length) {

                update_lab_visit_level(p_visit_id);
            }


        }, error: function (e) {

            console.log("error" + e.responseText);
            swal(
                    'Oops...',
                    'Something went wrong in edit!',
                    'error'
                    );

        }
    });

}

//update visit level status
function  update_lab_visit_level(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": 3
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);
            console.log('sucess update visit id');

            //empty the array after submission
            req_ids.length = 0;

            //empty the content on the table
            for (var i = 0; i < req_ids.length; i++) {
                document.getElementById("lab_input" + i).value = "";
            }

            swal("success!", "Advice patient to return to the doctor!", "success");

            //Move to the queue to serve next patient
            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/laboratory/laboratory.html", function () {
                getLabPatients();
                loadLabTable1();
                click_lab_functions();
            });

        },
        error: function (e) {

            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );

        }
    });
}