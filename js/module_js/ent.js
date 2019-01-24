var api_url = localStorage.getItem("API_URL");

function loadentTable() {

    $("#enttable").DataTable();
}

function getentPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_ent_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#enttable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getentPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getentPatientDetails(x, y) {

    document.getElementById("ent_tablediv").className += ' hidden';
    document.getElementById("ent_consult").className = "consult";

    console.log("ENT C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("ent_pname").innerHTML = name;
                document.getElementById("ent_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("ent_pvid").innerHTML = y;
                document.getElementById("ent_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("ent_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("ent_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getentDiseases() {

    var disease_list = [];
    $.ajax({
        url: "" + api_url + "/c_diseases",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                disease_list.push(data[x].name);
            }
            var arrayLength = disease_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = disease_list[i];

                var option = "<option value='" + x + "'>";
                $("#ent_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getentDrugs() {

    var drug_list = [];
    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=null",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                drug_list.push(data[x].name);
            }
            var arrayLength = drug_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = drug_list[i];

                var option = "<option value='" + x + "'>";
                $("#ent_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_ent_functions() {

    $(".submit_ent_sympt").click(function () {

        post_ent_symptoms();

    });

    $(".ent_submit_diagnos").click(function () {

        post_ent_diagnosis();

    });

    $(".ent_submit_treatment").click(function () {

        post_ent_treatment();

    });
}

function post_ent_symptoms() {

    $.ajax({
        url: "" + api_url + "/p_entsymptoms",
        type: "POST",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting ent sympt test values');

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

function post_ent_diagnosis() {

    $.ajax({
        url: "" + api_url + "/p_entdiagnosis",
        type: "POST",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting ent diagnosis test values');

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

function post_ent_treatment() {

    $.ajax({
        url: "" + api_url + "/p_enttreatment",
        type: "POST",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting ent treatment test values');

            //if its the last value of the done test, update visit level
            if (data.length) {

//                update_ent_visit_level(p_visit_id);
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
function  update_ent_visit_level(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": 3//change
        },
        dataType: "JSON",
        success: function (data) {

            console.log('sucess update visit id');

            swal("success!", "Advice patient to go collect medication!", "success");

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