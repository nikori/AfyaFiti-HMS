var api_url = localStorage.getItem('API_URL');

function loadMaternityTable() {

    $("#maternitytable").DataTable();
}

function getMaternityPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_maternity_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#maternitytable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getMaternityPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getMaternityPatientDetails(x, y) {

    document.getElementById("maternity_tablediv").className += ' hidden';
    document.getElementById("maternity_consult").className = "consult";

    console.log("maternity C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x ,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("maternity_pname").innerHTML = name;
                document.getElementById("maternity_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("maternity_pvid").innerHTML = y;
                document.getElementById("maternity_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("maternity_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("maternity_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getMaternityDiseases() {

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
                $("#maternity_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getMaternityDrugs() {

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
                $("#maternity_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_maternity_functions() {

    $(".submit_maternity_sympt").click(function () {

       post_maternity_symptoms();
       
    });
    
    $(".maternity_submit_diagnos").click(function () {

       post_maternity_diagnosis();
       
    });
    
    $(".maternity_submit_treatment").click(function () {

       post_maternity_treatment();
       
    });
}

function post_maternity_symptoms() {
   
    $.ajax({
        url: "" + api_url + "/p_maternitysymptoms",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting maternity sympt test values');

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

function post_maternity_diagnosis() {
   
    $.ajax({
        url: "" + api_url + "/p_maternitydiagnosis",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting maternity diagnosis test values');
            
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

function post_maternity_treatment() {
   
    $.ajax({
        url: "" + api_url + "/p_maternitytreatment",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting maternity treatment test values');

            //if its the last value of the done test, update visit level
            if (data.length) {

//                update_maternity_visit_level(p_visit_id);
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
function  update_maternity_visit_level(visit_id) {

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