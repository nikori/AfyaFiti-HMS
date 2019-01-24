var api_url = localStorage.getItem('API_URL');
//function inpatientTable() {
////console.log("hapa ndani");
//    $("#inpattable").DataTable();
//}
//
//function editinpattable() {
//    $("#editinpattable").DataTable();
//}
//function AdmittedTable() {
//    $("#admittable").DataTable();
//}
function getInPatients() {
    //console.log("uko wapi");
    $.ajax({
        url: "" + api_url + "/v_patientvisits?filter[where][c_node_id]=14",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#inpattable').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].patient_name +
                        '</td><td>'
                        + data[x].dob +
                        '</td><td>'
                        + data[x].gender +
                        '</td><td>'
                        + data[x].visitno +
                        '</td><td>'
                        + data[x].patientno +
                        '</td><td><a href="#" class="btn btn-info" onclick="AdmitPatient(\'' + data[x].visitno + '\',\'' + data[x].c_patient_id + '\', \'' + data[x].p_visit_id + '\')">Admit Patient</a></td></tr>'

                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}
function AdmitPatient(visit_no, patient_id, visit_id) {
    getDoctors();
    getWards();
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/inpatient/admitpatient.html", function () {
        //function inpatientdetails(){
        $(".submit_btn").click(function () {
//            console.log("PID "+patient_id);
//            console.log("VID "+visit_id);
//            console.log("VisitNo. "+visit_no);
            var ward = $("#ward").val();
            var bed = $("#bed").val();
            var doc = $("#doc").val();
            var admissiondate = $("#date_admitted").val();
            var reason = $("#adreason").val();
            //var discharge_date = $("#discharge_date").val()
            // var userid_Value = $.session.get('user_id');
            if (ward != "" || bed != "" || visit_id != "" || visit_no != "" || admissiondate != "" || reason != "") {
                console.log("PID " + patient_id);
                console.log("VID " + visit_id);
                console.log("VisitNo. " + visit_no);
                console.log("Ward id " + ward);
                console.log("Bed selected  " + bed);
                console.log("Date Admitted " + admissiondate);
                console.log("Doc selected  " + doc);
                console.log("Reason  " + reason);
                $.ajax({
                    url: "" + api_url + "p_ward_admissions",
                    type: "POST",
                    data: {
                        "doc_id": doc,
                        "bed_id": bed,
                        "ward_id": ward,
                        "c_patient_id": patient_id,
                        "date_admitted": admissiondate,
                        "admissionreason": reason,
                        "visit_id": visit_id,
                        "visit_no": visit_no
//                        "createdby": userid_Value,
//                        "updatedby": userid_Value
                    },
                    success: function (data) {
                        UpdateInpatientLevelAndBed(visit_id, bed);
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
        });
    });

}
function getSelectedBed() {
    var ward = $("#ward").val();
    getBeds(ward);
}
function getDoctors() {
    var docs = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/c_users?filter[where][c_role_id]=19",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };
    $.ajax(docs).done(function (response) {
        $(".doc").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".doc").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_user_id + "'>" + value.name + "</option>";
            $(".doc").append(option_tag);
        });
    });
}
function getDiseases() {
    var docs = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/v_icd10s",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };
    $.ajax(docs).done(function (response) {
        $(".dis").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".dis").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_icd10 + "'>" + value.disease_name + "</option>";
            $(".dis").append(option_tag);
        });
    });
}
function getWards() {
    var wards = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/p_wards",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };
    $.ajax(wards).done(function (response) {
        $(".ward").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".ward").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.id + "'>" + value.name + "</option>";
            $(".ward").append(option_tag);
        });
    });

}
function getWard() {
    var wards = {
        "async": true,
        "crossDomain": true,
//        "url": "" + api_url + "/v_beds?filter[where][c_role_id]=19",
        "url": "" + api_url + "/p_wards",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };
    $.ajax(wards).done(function (response) {
        $(".wards").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".wards").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.id + "'>" + value.name + "</option>";
            $(".wards").append(option_tag);
        });
    });

}
function getBeds(ward) {
    var beds = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/p_beds?filter[where][wardid]=" + ward + "&filter[where][status]=Free",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };
    $.ajax(beds).done(function (response) {
        $(".bed").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".bed").append(please_select);
        $.each(response, function (i, value) {
            var option_tag = "<option value='" + value.id + "'>" + value.name + "</option>";
            $(".bed").append(option_tag);
        });
    });

}
function getAdmittedInPatients() {
    //console.log("uko wapi");    
    $.ajax({
        url: "" + api_url + "/v_patientvisits?filter[where][c_node_id]=15",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#admittable').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].patient_name +
                        '</td><td>'
                        + data[x].dob +
                        '</td><td>'
                        + data[x].gender +
                        '</td><td>'
                        + data[x].visitno +
                        '</td><td>'
                        + data[x].patientno +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditInPatient(\'' + data[x].visitno + '\',\'' + data[x].c_patient_id + '\', \'' + data[x].p_visit_id + '\')">View Patient</a></td></tr>'

                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}
function AddBed() {
    //console.log("Bed maneno ");

//    $("#main_body").empty();
//    $("#modal_loading").modal("show");
//    $("#main_body").load("module/inpatient/addbed.html", function () {
//        //function inpatientdetails(){
//       
//    });

//    $(".submit_bed").click(function () {
    //console.log("Bed ndani ");
    var ward = $("#wards").val();
    var bed = $("#bed_name").val();

    console.log("Ward ID " + ward);
    console.log("Bed Name " + bed);
    if (ward != "" && bed != "") {

        $.ajax({
            url: "" + api_url + "p_beds",
            type: "POST",
            data: {
                "name": bed,
                "wardid": ward
            },
            success: function (data) {
                swal("success!", "Bed added succesffuly!", "success");
                $('#wards').children().remove();
                $("#bed_name").val("");
                getWard();
            },
            error: function (e) {
                swal(
                        'Oops...',
                        'Something went wrong!',
                        'error'
                        );
            }
        });
    } else {
        swal("Error!", "Kindly select ward or input bed name!", "error");
    }
//    });

}
function BedMgt() {
    //console.log("uko wapi");    
    getWard();
    $.ajax({
        url: "" + api_url + "/v_beds?filter[where][wardid]=2",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#children').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].bedname +
                        '</td><td>'
                        + data[x].wardname +
                        '</td><td>'
                        + data[x].bedstatus +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditBeds(\'' + data[x].wardid + '\',\'' + data[x].bedid + '\', \'' + data[x].bedstatus + '\')">Edit Bed</a></td></tr>'


                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax({
        url: "" + api_url + "/v_beds?filter[where][wardid]=3",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#labourward').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].bedname +
                        '</td><td>'
                        + data[x].wardname +
                        '</td><td>'
                        + data[x].bedstatus +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditBeds(\'' + data[x].wardid + '\',\'' + data[x].bedid + '\', \'' + data[x].bedstatus + '\')">Edit Bed</a></td></tr>'


                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax({
        url: "" + api_url + "/v_beds?filter[where][wardid]=4",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#maleward').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].bedname +
                        '</td><td>'
                        + data[x].wardname +
                        '</td><td>'
                        + data[x].bedstatus +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditBeds(\'' + data[x].wardid + '\',\'' + data[x].bedid + '\', \'' + data[x].bedstatus + '\')">Edit Bed</a></td></tr>'


                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax({
        url: "" + api_url + "/v_beds?filter[where][wardid]=5",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#femaleward').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].bedname +
                        '</td><td>'
                        + data[x].wardname +
                        '</td><td>'
                        + data[x].bedstatus +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditBeds(\'' + data[x].wardid + '\',\'' + data[x].bedid + '\', \'' + data[x].bedstatus + '\')">Edit Bed</a></td></tr>'


                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
    $.ajax({
        url: "" + api_url + "/v_beds?filter[where][wardid]=1",
        type: "GET",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#maternityward').DataTable( );

            for (var x = 0; x < data.length; x++) {
                table.row.add($(
                        '<tr><td>'
                        + data[x].bedname +
                        '</td><td>'
                        + data[x].wardname +
                        '</td><td>'
                        + data[x].bedstatus +
                        '</td><td><a href="#" class="btn btn-info" onclick="EditBeds(\'' + data[x].wardid + '\',\'' + data[x].bedid + '\', \'' + data[x].bedstatus + '\')">Edit Bed</a></td></tr>'


                        )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}
function testModal() {
    $('#myTestModal').on('show.bs.modal', function (e) {
        var getIdFromRow = $(e.relatedTarget).data('id');
        $("#buyghc").val(getIdFromRow);
    });
}
function EditBeds(ward, bed) {
    $('#EditBed').modal('show');
    console.log("Vitu");
    //console.log(vid);
    var prof = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/v_beds?filter[where][bedid]=" + bed,
        "method": "GET"
    };
    $.ajax(prof).done(function (response) {
        $.each(response, function (i, value) {
            //var patient_name = value.firstname + " " + value.lastname;
            //$("#patientno").text("Patient Number: " + value.patientno);
            $("#bed_name").text("Name: " + value.bedname);
//                $("#gender").text("Gender: " + value.gender);
//                $("#patient_visit_no").text("Visit ID: " + value.visitno);
//                $("#patient_dob").text("Date Of Birth: " + value.dob);

        });
    });

}
function EditInPatient(vno, puid, vid) {
//    console.log("prof");
//    console.log(vid);
    getDiseases();
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body   ").load("module/inpatient/ProfileInpatient.html", function () {
        
        var prof = {
            "async": true,
            "crossDomain": true,
            "url": "" + api_url + "/v_patientvisits?filter[where][c_patient_id]=" + puid,
            "method": "GET"
        };
        $.ajax(prof).done(function (response) {
            $.each(response, function (i, value) {
                //var patient_name = value.firstname + " " + value.lastname;
                $("#patientno").text("Patient Number: " + value.patientno);
                $("#patient_name").text("Name: " + value.patient_name);
                $("#gender").text("Gender: " + value.gender);
                $("#patient_visit_no").text("Visit ID: " + value.visitno);
                $("#patient_dob").text("Date Of Birth: " + value.dob);
                $("#patient_id").text("Date Of Birth: " + value.c_patient_id);

            });
        });

        var Weight = {
            "async": true,
            "crossDomain": true,
            "url": "" + api_url + "/p_medicalnotelines?filter[where][m_product_id]=386&filter[where][p_visit_id]=" + vid,
            "method": "GET"
        };
        $.ajax(Weight).done(function (response) {
            $.each(response, function (i, value) {
                //var patient_name = value.firstname + " " + value.lastname;
                //$("#patientname").text("Marital Status: " + value.patientname);
                $("#weight").text("Weight(kg): " + value.notes);


            });
        });

        var height = {
            "async": true,
            "crossDomain": true,
            "url": "" + api_url + "/p_medicalnotelines?filter[where][m_product_id]=387&filter[where][p_visit_id]=" + vid,
            "method": "GET"
        };
        $.ajax(height).done(function (response) {
            $.each(response, function (i, value) {
                $("#height").text("Height(cm): " + value.notes);


            });
        });

        var bmi = {
            "async": true,
            "crossDomain": true,
            "url": "" + api_url + "/p_medicalnotelines?filter[where][m_product_id]=8&filter[where][p_visit_id]=" + vid,
            "method": "GET"
        };
        $.ajax(bmi).done(function (response) {
            $.each(response, function (i, value) {
                $("#bmi").text("BMI: " + value.notes);


            });
        });
    });

}
function AddDiagnosis() {
    //console.log("Bed maneno ");

//    $("#main_body").empty();
//    $("#modal_loading").modal("show");
//    $("#main_body").load("module/inpatient/addbed.html", function () {
//        //function inpatientdetails(){
//       
//    });

//    $(".submit_bed").click(function () {
//    console.log("Bed ndani ");
    var ward = $("#dise").val();
    var bed = $("#patient_id").val();
    

    console.log("Ward ID " + ward);
    console.log("Bed Name " + bed);
    
//    if (ward != "" && bed != "") {
//
//        $.ajax({
//            url: "" + api_url + "p_beds",
//            type: "POST",
//            data: {
//                "name": bed,
//                "wardid": ward
//            },
//            success: function (data) {
//                swal("success!", "Bed added succesffuly!", "success");
//                $('#wards').children().remove();
//                $("#bed_name").val("");
//                getWard();
//            },
//            error: function (e) {
//                swal(
//                        'Oops...',
//                        'Something went wrong!',
//                        'error'
//                        );
//            }
//        });
//    } else {
//        swal("Error!", "Kindly select ward or input bed name!", "error");
//    }
//    });

}
function UpdateBedName() {
    var bed = $("#bedname").val();
    console.log("Vidu Kwa Bed  " + bed);
    $.ajax({
        url: "" + api_url + "/p_beds?filter[where][name]=" + bed,
        type: "put",
        data: {
            "name": "Booked"
        },
        dataType: "JSON"
    });
}
function UpdateInpatientLevelAndBed(visit_id, bed) {
    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "put",
        data: {
            "c_node_id": 15
        },

        dataType: "JSON",
        success: function (data) {

            console.log(data);
            console.log('success update visit id');
            swal("success!", "Patient admitted succesffuly!", "success");
            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/inpatient/inpatient.html", function () {
            });
        },
        error: function (e) {
            swal(
                    'Ooh NOT',
                    'There was an error updating record!',
                    'error'
                    );

        }
    });
    $.ajax({
        url: "" + api_url + "/p_beds/" + bed,
        type: "put",
        data: {
            "status": "Booked"
        },
        dataType: "JSON"
    });
}
//function inPatientProf(patient_no, patient_id, visit_id, gender, first_name, last_name) {
//    console.log("mkombera ndani ndani");
//    console.log(patient_no);
//    $("#main_body").empty();
//    $("#modal_loading").modal("show");
//    $("#main_body").load("module/inpatient/ProfileInpatient.html", function () {
//        var patient_name = first_name + " " + last_name;
//
//        $("#patient_no").text("Patient ID: " + patient_no);
//        $("#patient_name").text("Patient Name: " + patient_name);
//        $("#gender").text("Gender: " + gender);
//        $("#patient_visit_no").text("Visit ID: " + visit_id);
//
//        if (gender.trim() === "male" || gender.trim() === "Male") {
////            console.log("if>" + gender);
//            document.getElementById("mp").style.display = "none";
//        } else {
////            console.log("else>" + gender);
//            document.getElementById("mp").style.display = "inline";
//        }
//
//        //function Triagedetails(){
//        $(".triage_submit_btn").click(function () {
//            var userid = $.session.get('user_id');
//            //Systolic
//            //console.log("is integr+" + Number.isInteger(systolic))
//            var systolic = $("#systolic").val();
//            var diastolic = $("#diastolic").val();
//            var pulse_rate = $("#pulse_rate").val();
//            var weight = $("#weight").val();
//            var temp = $("#temp").val();
//            var height = $("#height").val();
//
//            //form validation
//            if (systolic.length === 0 || diastolic.length === 0 || pulse_rate.length === 0 || weight.length === 0 ||
//                    temp.length === 0 || height.length === 0) {
//                swal("Error!", "Input values with ( * ) can not be empty ! ", "error");
//            } else if (systolic.length > 3 || diastolic.length > 3) {
//                swal("Error!", "Systolic or Diastolic value too high ! ", "error");
//            } else {
//
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": systolic,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 383,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess systolic');
//                        update_triage_visit_level(visit_id);
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//                    }
//                });
//
//                //diastolic
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": diastolic,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 384,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess diastolic');
//
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//                    }
//                });
//
//                //pulse_rate            
//                //console.log(pulse_rate);
//
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": pulse_rate,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 385,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess pulse_rate');
//
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//                    }
//                });
//
//                //weight            
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": weight,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 386,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess weight');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//
//                    }
//                });
//
//                //temp           
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": temp,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 5,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess temp');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//                    }
//                });
//
//                //height            
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": height,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 387,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess height');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//
//                    }
//                });
//
//                //special_notes
//                var special_notes = $("#special_notes").val();
//
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": special_notes,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 392,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess special notes');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//
//                    }
//                });
//                //Allergies
//                var allergies = $("#allergies").val();
//
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": allergies,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 393,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
//                        //console.log('sucess allergies notes');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//
//                    }
//                });
//                //Medical Allergies
//                var medical_allergies = $("#medical_allergies").val();
//
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": medical_allergies,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 395,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
////                    console.log('sucess medical allergies notes');
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//
//                    }
//                });
//
//                var bmi = $("#finalBmi").text();
//                $.ajax({
//                    url: "" + api_url + "/p_medicalnotelines",
//                    type: "post",
//                    data: {
//                        "notes": bmi,
//                        "p_medicalnote_id": 1,
//                        "p_visit_id": visit_id,
//                        "m_product_id": 8,
//                        "createdby": userid,
//                        "updatedby": userid
//                    },
//                    success: function (data) {
//                        //console.log('sucess bmi');
//
//                    },
//                    error: function (e) {
//                        swal(
//                                'Oops...',
//                                'Something went wrong!\n\
//                                Check your network status',
//                                'error'
//                                );
//                    }
//                });
//            }
//
//        });
//
//    });
//
//}




