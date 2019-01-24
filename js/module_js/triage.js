var api_url = localStorage.getItem('API_URL');

function calculateBmi() {
    var weight = $("#weight").val();
    var height = $("#height").val();
    if (weight > 0 && height > 0) {
        var finalBmi = weight / (height / 100 * height / 100);
        $("#finalBmi").text(finalBmi.toFixed(2));

        if (finalBmi < 18.5) {
            $("#Bmifeedback").text("Patient is too thin.");
        }
        if (finalBmi > 18.5 && finalBmi < 25) {
            $("#Bmifeedback").text("Patient is healthy.");
        }
        if (finalBmi > 25 && finalBmi < 35) {
            $("#Bmifeedback").text("Patient is overweight.");
        }
        if (finalBmi > 35) {
            $("#Bmifeedback").text("Patient is obese.");
        }
    } 
}

//B.P calculation refference 
//https://www.cdc.gov/bloodpressure/measure.htm
function calculateBp() {
    var systolic = $("#systolic").val();
    var diastolic = $("#diastolic").val();
    var syst = parseInt(systolic);
    var diast = parseInt(diastolic);
    if (syst > 0 && diast > 0) {
        
        $("#finalBp").text(systolic +"/"+diastolic);
        
        if (syst < 120 && diast > 80) {
            $("#Bpfeedback").text("B.P Normal.");
        }
        if (120 >= syst <= 139 && 80 >= diast <= 89) {
            $("#Bpfeedback").text("B. P At risk (prehypertension).");
        }
        if (syst > 140 && diast > 90) {
            $("#Bpfeedback").text("B.P High.");
        }
    }
}

function getTriagePatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_triage_lists",
        type: "get",
        data: {},
        success: function (data) {

            var table = $('#mpattable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'excel', 'pdf'
                ]
            });

            for (var x = 0; x < data.length; x++) {

                var vdate = data[x].visitdate;
                var mydarr = vdate.split("T");
                var thedate = mydarr[0];

                table.row.add($(
                        '<tr><td>'
                        + data[x].p_visit_id +
                        '</td><td>'
                        + data[x].code +
                        '</td><td>'
                        + thedate +
                        '</td><td>'
                        + data[x].firstname + ' ' + data[x].lastname +
                        '</td><td><a href="#" class="btn btn-info" onclick="savePatientDetailsSession(\'' + data[x].code + '\',\'' + data[x].c_patient_id + '\', \'' + data[x].p_visit_id + '\', \'' + data[x].gender + '\',\'' + data[x].firstname + '\',\'' + data[x].lastname + '\')">Proceed</a></td></tr>'
                        )).draw(false);

            }
        },
        error: function () {
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
        }
    });
}

function savePatientDetailsSession(patient_no, patient_id, visit_id, gender, first_name, last_name) {

    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/triage/triage_form.html", function () {
        var patient_name = first_name + " " + last_name;

        $("#patient_no").text("Patient ID: " + patient_no);
        $("#patient_name").text("Patient Name: " + patient_name);
        $("#gender").text("Gender: " + gender);
        $("#patient_visit_no").text("Visit ID: " + visit_id);

        if (gender.trim() === "male" || gender.trim() === "Male") {
//            console.log("if>" + gender);
            document.getElementById("mp").style.display = "none";
        } else {
//            console.log("else>" + gender);
            document.getElementById("mp").style.display = "inline";
        }

        //function Triagedetails(){
        $(".triage_submit_btn").click(function () {
            var userid = $.session.get('user_id');
            //Systolic
            console.log("is integr+" + Number.isInteger(systolic))
            var systolic = $("#systolic").val();
            var diastolic = $("#diastolic").val();
            var pulse_rate = $("#pulse_rate").val();
            var weight = $("#weight").val();
            var temp = $("#temp").val();
            var height = $("#height").val();

            //form validation
            if (systolic.length === 0 || diastolic.length === 0 || pulse_rate.length === 0 || weight.length === 0 || 
                    temp.length === 0 || height.length === 0) {
                swal("Error!", "Input values with ( * ) can not be empty ! ", "error");
            } else if(systolic.length > 3 || diastolic.length > 3){
                swal("Error!", "Systolic or Diastolic value too high ! ", "error");
            }else {

                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": systolic,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 383,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess systolic');
                        update_triage_visit_level(visit_id);
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );
                    }
                });

                //diastolic
                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": diastolic,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 384,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess diastolic');

                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );
                    }
                });

                //pulse_rate            
                console.log(pulse_rate);

                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": pulse_rate,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 385,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess pulse_rate');

                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );
                    }
                });

                //weight            
                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": weight,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 386,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess weight');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );

                    }
                });

                //temp           
                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": temp,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 5,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess temp');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );
                    }
                });

                //height            
                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": height,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 387,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess height');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );

                    }
                });

                //special_notes
                var special_notes = $("#special_notes").val();

                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": special_notes,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 392,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess special notes');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );

                    }
                });
                //Allergies
                var allergies = $("#allergies").val();

                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": allergies,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 393,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
                        console.log('sucess allergies notes');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );

                    }
                });
                //Medical Allergies
                var medical_allergies = $("#medical_allergies").val();

                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": medical_allergies,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 395,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
//                    console.log('sucess medical allergies notes');
                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );

                    }
                });

                var bmi = $("#finalBmi").text();
                $.ajax({
                    url: "" + api_url + "/p_medicalnotelines",
                    type: "post",
                    data: {
                        "notes": bmi,
                        "p_medicalnote_id": 1,
                        "p_visit_id": visit_id,
                        "m_product_id": 8,
                        "createdby": userid,
                        "updatedby": userid
                    },
                    success: function (data) {
                        console.log('sucess bmi');

                    },
                    error: function (e) {
                        swal(
                                'Oops...',
                                'Something went wrong!\n\
                                Check your network status',
                                'error'
                                );
                    }
                });
            }

        });

    });

}

//update visit level status
function  update_triage_visit_level(visit_id) {

    //Check checkbox status
//    var isemergency_status = $("#isemergency").is(':checked');
//    console.log("this is the emergecny" + isemergency_status);
    var isemergency = "N";

    if ($("#isemergency").is(':checked')) {
        isemergency = "Y";
    }

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "put",
        data: {
            "c_node_id": 3,
            "isemergency": isemergency
        },
        success: function (data) {

            swal("success!", "Patient can move to the next level!", "success")
            //Move to the queue to serve next patient
            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/triage/triage_list.html", function () {
                getTriagePatients();
            });

        },
        error: function (e) {

            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });
}


function getPatientDetails(x) {
    console.log("C_Patient ID => " + x);

    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x + "",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);

        },
        error: function () {
            console.log("error");
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });
}