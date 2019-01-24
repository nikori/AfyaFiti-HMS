var api_url = localStorage.getItem("API_URL");

function loadDentalTable() {

    $("#dentaltable").DataTable();
}

function getDentalPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_dental_queues",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#dentaltable').DataTable( );

            for (var x = 0; x == data.length; x++) {
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
                        <a href="#" class="btn btn-info" onclick="return getDentalPatientDetails(\'' + data[x].c_patient_id + '\',\'' + data[x].p_visit_id + '\' ) ">Proceed</a></td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function getDentalPatientDetails(x, y) {

    document.getElementById("dental_tablediv").className += ' hidden';
    document.getElementById("dental_consult").className = "consult";

    console.log("dental C_Patient ID => " + x);
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x ,
        type: "GET",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {

                name = 'Name: ' + data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("dental_pname").innerHTML = name;
                document.getElementById("dental_cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("dental_pvid").innerHTML = y;
                document.getElementById("dental_pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("dental_gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("dental_dob").innerHTML = "DOB: " + data[n].dob;

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function getDentalDiseases() {

    var disease_list = [];
    $.ajax({
        url: "" + api_url + "/c_diseases",
        type: "GET",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                disease_list.push(data[x].name);
            }
            var arrayLength = disease_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = disease_list[i];

                var option = "<option value='" + x + "'>";
                $("#dental_disease").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getDentalDrugs() {

    var drug_list = [];
    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=null",
        type: "GET",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                drug_list.push(data[x].name);
            }
            var arrayLength = drug_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = drug_list[i];

                var option = "<option value='" + x + "'>";
                $("#dental_drg").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function click_dental_functions() {

    $(".submit_dental_sympt").click(function () {

       post_dental_symptoms();
       
    });
    
    $(".dental_submit_diagnos").click(function () {

       post_dental_diagnosis();
       
    });
    
    $(".dental_submit_treatment").click(function () {

       post_dental_treatment();
       
    });
    
    $(".dental_submit_treatment").click(function () {

        console.log("inside dental_submit_treatment");

        var drg_ar = [];
        var dose_ar = [];
        var notes_ar = [];

        $('.drugs').each(function () {
            drg_ar.push($(this).val());
        });
        $('.dose').each(function () {
            dose_ar.push($(this).val());
        });
        $('.notes').each(function () {
            notes_ar.push($(this).val());
        });

        var cpid = document.getElementById("dental_cpid").innerHTML;
        var pvid = document.getElementById("dental_pvid").innerHTML;


        for (var i = 0; i < drg_ar.length; i++) {

            getDentalDrugId(dose_ar[i], cpid, pvid, drg_ar[i], notes_ar[i]);

        }

    });
}

function getDentalDrugId(dose, cpid, pvid, drug, qty) {

//    console.log("inside getDrugId");

    $.ajax({
        url: "" + api_url + "/m_products?filter[where][name]=" + drug + "",
        type: "get",
        data: {},
        success: function (data) {

            for (var n = 0; n < data.length; n++) {
                var mpid = data[n].m_product_id;

                post_dental_treatment(dose, cpid, pvid, mpid, qty);

            }
        },
        error: function () {
            console.log("error");

        }
    });

}

function post_dental_symptoms() {
   
    $.ajax({
        url: "" + api_url + "/p_dentalsymptoms",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting dental sympt test values');

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

function post_dental_diagnosis() {
   
    $.ajax({
        url: "" + api_url + "/p_dentaldiagnosis",
        type: "POST",
        data: {
            
        },
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting dental diagnosis test values');
            
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

function post_dental_treatment(dose, cpid, pvid, mpid, qty) {
   var pv_id = parseInt(pvid);
    var mp_id = parseInt(mpid);
    var facility_id = $.session.get('facility_id');
    var userid_Value = $.session.get('user_id');

    var value = {
        "dosage": dose,
        "c_dosage_id": 1,
        "quantity": 1,
        "c_patient_id": cpid,
        "p_visit_id": pv_id,
        "m_product_id": mp_id,
        "notes": qty,
        "c_facility_id": facility_id,
        "p_medicalnote_id": 10,
        "m_store_id": 1000009,
        "createdby": userid_Value,
        "updatedby": userid_Value
    };
   
    $.ajax({
        url: "" + api_url + "/p_dentaltreatment",
        type: "POST",
        data: value,
        dataType: "JSON",
        success: function (data) {

            console.log('success inserting dental treatment test values');

            swal("success!", "Patient's dental treatment saved!", "success");
            update_dental_visit_level(pvid);


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
function  update_dental_visit_level(visit_id) {

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