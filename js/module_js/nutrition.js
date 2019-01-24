var api_url = localStorage.getItem('API_URL');

function loadNutritionTable() {

    $("#nutritiontable").DataTable();
}

function getNutritionPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_nutrition_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#nutritiontable').DataTable( );

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
                        <a href="#" class="btn btn-info" onclick="return getNutritionPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getNutritionPatientDetails(x, y) {

    document.getElementById("nutrition_tablediv").className += ' hidden';
    document.getElementById("nutrition_consult").className = "consult";

    console.log("nutrition C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x ,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("nutrition_pname").innerHTML = name;
                document.getElementById("nutrition_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("nutrition_pvid").innerHTML = y;
                document.getElementById("nutrition_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("nutrition_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("nutrition_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getNutritionDiseases() {

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
                $("#nutrition_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getNutritionDrugs() {

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
                $("#nutrition_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_nutrition_functions() {

    $(".submit_nutrition_sympt").click(function () {

       post_nutrition_symptoms();
       
    });
    
    $(".nutrition_submit_diagnos").click(function () {

       post_nutrition_diagnosis();
       
    });
    
    $(".nutrition_submit_treatment").click(function () {

       post_nutrition_treatment();
       
    });
}

function post_nutrition_symptoms() {
   
    $.ajax({
        url: "" + api_url + "/p_nutritionsymptoms",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting nutrition sympt test values');

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

function post_nutrition_diagnosis() {
   
    $.ajax({
        url: "" + api_url + "/p_nutritiondiagnosis",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting nutrition diagnosis test values');
            
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

function post_nutrition_treatment() {
   
    $.ajax({
        url: "" + api_url + "/p_nutritiontreatment",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting nutrition treatment test values');

            //if its the last value of the done test, update visit level
            if (data.length) {

//                update_nutrition_visit_level(p_visit_id);
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
function  update_nutrition_visit_level(visit_id) {

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