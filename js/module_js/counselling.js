var api_url = localStorage.getItem("API_URL");

function loadCounsellingTable() {

    $("#counsellingtable").DataTable();
}

function getCounsellingPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_counselling_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#counsellingtable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getCounsellingPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getCounsellingPatientDetails(x, y) {

    document.getElementById("counselling_tablediv").className += ' hidden';
    document.getElementById("counselling_consult").className = "consult";

    console.log("counselling C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x ,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("counselling_pname").innerHTML = name;
                document.getElementById("counselling_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("counselling_pvid").innerHTML = y;
                document.getElementById("counselling_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("counselling_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("counselling_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getCounsellingDiseases() {

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
                $("#counselling_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getCounsellingDrugs() {

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
                $("#counselling_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_counselling_functions() {

    $(".submit_counselling_sympt").click(function () {

       post_counselling_symptoms();
       
    });
    
    $(".counselling_submit_diagnos").click(function () {

       post_counselling_diagnosis();
       
    });
    
    $(".counselling_submit_treatment").click(function () {

       post_counselling_treatment();
       
    });
}

function post_counselling_symptoms() {
   
    $.ajax({
        url: "" + api_url + "/p_counsellingsymptoms",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting counselling sympt test values');

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

function post_counselling_diagnosis() {
   
    $.ajax({
        url: "" + api_url + "/p_counsellingdiagnosis",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting counselling diagnosis test values');
            
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

function post_counselling_treatment() {
   
    $.ajax({
        url: "" + api_url + "/p_counsellingtreatment",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting counselling treatment test values');

            //if its the last value of the done test, update visit level
            if (data.length) {

//                update_counselling_visit_level(p_visit_id);
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
function  update_counselling_visit_level(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": 3//change
        },
        dataType: "JSON",
        success: function (data) {

            console.log('sucess update visit id');            

            swal("success!", "Advice patient to return to the doctor!", "success");

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