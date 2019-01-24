var api_url = localStorage.getItem('API_URL');

var req_ids = new Array;

function loadRadiologyTable1() {

    $("#radiologytable").DataTable();
}

function getRadiologyPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_radiology_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#radiologytable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getRadiologyPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getRadiologyPatientDetails(x, y) {

    document.getElementById("radiology_tablediv").className += ' hidden';
    document.getElementById("radiology_consult").className = "consult";

    console.log("radiology C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x + "",
        type: "GET",
        data: {},
        success: function (data) {

//            console.log(data);

            getTestRequest(y);

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("radiology_pname").innerHTML = name;
                document.getElementById("radiology_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("radiology_pvid").innerHTML = y;
                document.getElementById("radiology_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("radiology_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("radiology_dob").innerHTML = "DOB: " + data[n].dob;

                getRadiologyTriageData(y);

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

//function to get the labtest request from consultation
function getTestRequest(visit_id) {

    console.log("getTestRequest : Patient ID => " + visit_id);
    $.ajax({
        url: "" + api_url + "/p_radiology_referrals?filter[where][p_visit_id]=" + visit_id + "",
        type: "GET",
        data: {},
        success: function (data) {

//            console.log(data);

            for (var n = 0; n < data.length; n++) {

                console.log("Test Details: " + data[n].test_notes);
                console.log("Product group: " + data[n].m_product_id);
                document.getElementById("radiology_test_details").innerHTML = "Test request notes: " + data[n].test_notes;
                getTestProducts(data[n].m_product_id, data[n].group_name);

            }

        },
        error: function () {
            console.log("error");

        }
    });

}

function getTestProducts(m_product_id, group_name) {

    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_product_id]=" + m_product_id + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);

            var container = document.getElementById("radiology_container");

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
                input.id = "radiology_input" + req_ids.length;
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

function getRadiologyTriageData(y) {
    console.log("Triage = Visit ID => " + y);
    $.ajax({
        url: "" + api_url + "/v_vitals?filter[where][p_visit_id]=" + y + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#radiology_vts').DataTable({searching: false, paging: false});
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


function click_radiology_functions() {

    $(".submitradiology").click(function () {

        console.log("req_ids.length" + req_ids[0]);
        var j = 1;
        for (var i = 0; i < req_ids.length; i++) {
            console.log("i_value : " + i);
            console.log("j_value : " + j);
            var product_id = req_ids[i];
            var input_val = document.getElementById("radiology_input" + j).value;
            console.log("m_product_id value=>" + product_id);
            console.log("text_val : " + input_val);

            post_radiologynotelines(product_id, input_val, i);
            j++;

        }

    });
}

function post_radiologynotelines(product_id, notes, i_val) {

    var created_by = $.session.get('user_id');
    var updated_by = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');
    var p_visit_id = document.getElementById("radiology_pvid").innerHTML;

    $.ajax({
        url: "" + api_url + "/p_radiologynotelines",
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

            console.log('success inserting radiology test values');

            //if its the last value of the done test, update visit level
            if (i_val + 1 === req_ids.length) {

                update_radiology_visit_level(p_visit_id);
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
function  update_radiology_visit_level(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": 3//return tests to the doc
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);
            console.log('sucess update visit id');

            //empty the array after submission
            req_ids.length = 0;

            //empty the content on the table
            for (var i = 0; i < req_ids.length; i++) {
                document.getElementById("radiology_input" + i).value = "";
            }

            swal("success!", "Advice patient to return to the doctor!", "success");

            //Move to the queue to serve next patient
            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/radiology/radiology.html", function () {
                getRadiologyPatients();
                loadRadiologyTable1();
                click_radiology_functions();
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