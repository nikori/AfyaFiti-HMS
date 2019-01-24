var api_url = localStorage.getItem('API_URL');

function loadPhysioTable() {

    $("#physiotable").DataTable();
}

function getPhysioPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_physio_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#physiotable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getPhysioPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getPhysioPatientDetails(x, y) {

    document.getElementById("physio_tablediv").className += ' hidden';
    document.getElementById("physio_consult").className = "consult";

    console.log("physio C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x ,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("physio_pname").innerHTML = name;
                document.getElementById("physio_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("physio_pvid").innerHTML = y;
                document.getElementById("physio_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("physio_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("physio_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getPhysionDiseases() {

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
                $("#physio_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getPhysioDrugs() {

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
                $("#physio_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_physio_functions() {

    $(".submit_physio_sympt").click(function () {

       post_physio_symptoms();
       
    });
    
    $(".physio_submit_diagnos").click(function () {

       post_physio_diagnosis();
       
    });
    
    $(".physio_submit_treatment").click(function () {

       post_physio_treatment();
       
    });
}

function post_physio_symptoms() {
   
    $.ajax({
        url: "" + api_url + "/p_physiosymptoms",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting physio sympt test values');

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

function post_physio_diagnosis() {
   
    $.ajax({
        url: "" + api_url + "/p_physiodiagnosis",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting physio diagnosis test values');
            
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

function post_physio_treatment() {
   
    $.ajax({
        url: "" + api_url + "/p_physiotreatment",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting physio treatment test values');

            //if its the last value of the done test, update visit level
            if (data.length) {

//                update_dental_visit_level(p_visit_id);
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
function  update_physio_visit_level(visit_id) {

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