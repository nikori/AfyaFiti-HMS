proceedvar api_url = localStorage.getItem("API_URL");

var level_vals = new Array;
var checkbox_vals = new Array;
var prod_grp_name = new Array;
var mpid;

function loadPrescriptiontables() {

    $("#mpattable").DataTable();
    $("#disp_table").DataTable();
    $("#laboratory_table").DataTable();
    $("#radio_table").DataTable();

}

function getConsultationPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_consultation_queues",
        type: "get",
        data: {},
        success: function (data) {

//            console.log(data);
            var table = $('#mpattable').DataTable();

            for (var x = 0; x < data.length; x++) {

                (function (x) {
                    var test_v_id = data[x].p_visit_id;
                    var test_visit_no = data[x].visitno;
                    var test_code = data[x].code;
                    var test_names = data[x].firstname + ' ' + data[x].lastname;
                    var test_visitdate = data[x].visitdate;
                    var test_patient_id = data[x].c_patient_id;
                    console.log("test_v_id : " + test_v_id);
                    
                    jQuery.ajax({
                        url: "" + api_url + "/p_laboratorynotelines?filter[where][p_visit_id]=" + test_v_id,
                        type: "GET",
                        dataz: {},
                        success: function (dataz) {
                            var ret_v;
                            if (dataz.length > 0) {
                                //if there are lab results related to the visit
                                ret_v = "Laboratory";
                                console.log("success > 0=> " + ret_v);
                                table.row.add($(
                                        '<tr><td>'
                                        + test_visit_no +
                                        '</td><td>'
                                        + test_code +
                                        '</td><td>'
                                        + test_names +
                                        '</td><td>'
                                        + ret_v +
                                        '</td><td>'
                                        + test_visitdate +
                                        '</td><td>\n\
                                    <a href="#" class="btn btn-info" onclick="return getPatientDetails(\'' + test_patient_id + '\',\'' + test_v_id + '\',\'' + ret_v + '\' ) ">Proceed</a></td></tr>'
                                        )).draw(false);

                            } else {

                                //*******************check if value is in p_radiologyynotelines to display********************
                                $.ajax({
                                    url: "" + api_url + "/p_radiologynotelines?filter[where][p_visit_id]=" + test_v_id,
                                    type: "GET",
                                    dataz: {},
                                    success: function (dataj) {

                                        if (dataj.length > 0) {
                                            //if there are lab results related to the visit
                                            ret_v = "Radiology";
                                            console.log("success > 1=> " + ret_v);
                                            table.row.add($(
                                                    '<tr><td>'
                                                    + test_visit_no +
                                                    '</td><td>'
                                                    + test_code +
                                                    '</td><td>'
                                                    + test_names +
                                                    '</td><td>'
                                                    + ret_v +
                                                    '</td><td>'
                                                    + test_visitdate +
                                                    '</td><td>\n\
                                                <a href="#" class="btn btn-info" onclick="return getPatientDetails(\'' + test_patient_id + '\',\'' + test_v_id + '\',\'' + ret_v + '\' ) ">Proceed</a></td></tr>'
                                                    )).draw(false);

                                        } else {

                                            ret_v = "Triage";
                                            console.log("success else > 3=> " + ret_v);
                                            table.row.add($(
                                                    '<tr><td>'
                                                    + test_visit_no +
                                                    '</td><td>'
                                                    + test_code +
                                                    '</td><td>'
                                                    + test_names +
                                                    '</td><td>'
                                                    + ret_v +
                                                    '</td><td>'
                                                    + test_visitdate +
                                                    '</td><td>\n\
                                                <a href="#" class="btn btn-info" onclick="return getPatientDetails(\'' + test_patient_id + '\',\'' + test_v_id + '\',\'' + ret_v + '\' ) ">Proceed</a></td></tr>'
                                                    )).draw(false);

                                        }

                                    }, error: function (e) {

                                        swal(
                                                'Oops...',
                                                'Something went wrong. Refresh page!',
                                                'error'
                                                );

                                    }
                                });

                            }

                        },
                        error: function () {
                            console.log("error");
                        }
                    });
                })(x);

            }

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

function getLevel(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_laboratorynotelines?filter[where][p_visit_id]=" + visit_id,
        type: "GET",
        data: {},
        success: function (data) {
            var ret_v;
            if (data.length > 0) {
                //if there are lab results related to the visit
                ret_v = "Laboratory";
                //                console.log("success > 0=> " + ret_v);
                level_vals.push(ret_v);
                //                console.log("level_vals length=> " + level_vals.length);
                return ret_v;

            } else {
                ret_v = "Triage";
                //                console.log("success = 0=> " + ret_v);
                level_vals.push(ret_v);
                //                console.log("level_vals length=> " + level_vals.length);
                return ret_v;

            }

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

function getPatientDetails(x, y, ret_v) {

    document.getElementById("tablediv").className += ' hidden';
    document.getElementById("consult").className = "consult";
    console.log("retv >> " + ret_v);

    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + x + "",
        type: "get",
        data: {},
        success: function (data) {

            //console.log(data);

            for (var n = 0; n < data.length; n++) {

                name = data[n].firstname + ' ' + data[n].lastname;
                document.getElementById("pname").innerHTML = name;
                document.getElementById("cpid").innerHTML = data[n].c_patient_id;
                document.getElementById("pvid").innerHTML = y;
                document.getElementById("pid").innerHTML = "Patient ID: " + data[n].code;
                document.getElementById("gender").innerHTML = "Gender: " + data[n].gender;
                document.getElementById("dob").innerHTML = "DOB: " + data[n].dob;

                $("#name").val(function () {
                    return this.value + name;
                });
                $("#sex").val(function () {
                    return this.value + data[n].gender;
                });
                $("#pno").val(function () {
                    return this.value + data[n].code;
                });
                var d = new Date();

                var yob = (data[n].dob).substring(0, 10);
                var parts = yob.split('-');
                // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
                // January - 0, February - 1, etc.
                var mydate = new Date(parts[0], parts[1] - 1, parts[2]);


                var difference = dateDiffInDays(mydate, d);
                $("#age").val(function () {
                    return this.value + difference + ' Yrs';
                });

                if (ret_v == "Laboratory") {
                    //enable the lab result tab to be displayed
                    $("#lab_results").css({"display": "inline"});
                    getLabResults(y);

                } else if (ret_v == "Radiology") {
                    //enable the radiology result tab to be displayed
                    $("#radiology_results").css({"display": "inline"});
                    getRadiologyResults(y);

                }

                //load triage data
                getTriageData(y);

                //load lab test categories
//                getLabtests();

                //load lab categories on the radiology modal
                getLabCategory();
                
                //load radiology categories on the radiology modal
                getRadioCategory();

                //load patients history
                get_prev_visit(data[n].c_patient_id);

                //load prescription
                getPrescription(y);

                //load any lab test for this visit
                getLaboratory(y);

            }
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

function getLaboratory(p_visit_id) {

    console.log("Inside getLaboratory " + p_visit_id);
    $.ajax({
        url: "" + api_url + "/p_lab_referrals?filter[where][p_visit_id]=" + p_visit_id,
        type: "GET",
        data: {},
        success: function (data) {

            var table = $('#laboratory_table').DataTable();

            for (var x = 0; x < data.length; x++) {

                var group_name = data[x].group_name;
                var test_notes = data[x].test_notes;

                table.row.add($(
                        '<tr><td>'
                        + group_name +
                        '</td><td>'
                        + test_notes +
                        '</td><td>\n\
                        <a href="#" class="btn btn-info" onclick="editLabDetails(\'' + group_name + '\',\'' + test_notes + '\')">Edit</a></td>' +
                        '</td><td>\n\
                        <a href="#" class="btn btn-info" onclick="deleteLabDetails(\'' + group_name + '\',\'' + test_notes + '\',\'' + p_visit_id + '\')">Delete</a></td></tr>'
                        )).draw(false);

            }

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

function getRadiology(p_visit_id) {

    console.log("Inside getRadiology " + p_visit_id);
    $.ajax({
        url: "" + api_url + "/p_radiology_referrals?filter[where][p_visit_id]=" + p_visit_id,
        type: "GET",
        data: {},
        success: function (data) {

            var table = $('#radio_table').DataTable();

            for (var x = 0; x < data.length; x++) {

                var category_name = data[x].category_name;
                var test_name = data[x].test_name;
                var test_notes = data[x].test_notes;

                table.row.add($(
                        '<tr><td>'
                        + category_name +
                        '</td><td>'
                        + test_name +
                        '</td><td>'
                        + test_notes +
                        '</td><td>\n\
                        <a href="#" class="btn btn-info" onclick="editLabDetails(\'' + test_name + '\',\'' + test_notes + '\')">Edit</a></td>' +
                        '</td><td>\n\
                        <a href="#" class="btn btn-info" onclick="deleteLabDetails(\'' + test_name + '\',\'' + test_notes + '\',\'' + p_visit_id + '\')">Delete</a></td></tr>'
                        )).draw(false);

                swal("success!", "Test details saved!", "success");

            }

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

function editLabDetails(group_name, notes) {

    console.log("Inside edit lab details#" + notes);
    console.log("group_name##" + group_name);

//    $("#edit_drug_list").val(group_name);
//    $("#edit_notes").val(notes);

    $('#LabModal').modal('show');

}

function deleteLabDetails(group_name, notes, p_visit_id) {

    console.log("Inside delete lab details#" + p_visit_id);
    console.log("group_name##" + group_name);

//    $("#edit_drug_list").val(group_name);
//    $("#edit_notes").val(notes);
//
//    $('#LabModal').modal('show');

}

function getPrescription(p_visit_id) {

    console.log("Inside getPrescription " + p_visit_id);
    $.ajax({
        url: "" + api_url + "/p_prescriptions?filter[where][p_visit_id]=" + p_visit_id,
        type: "GET",
        data: {},
        success: function (data) {

            var table = $('#disp_table').DataTable();

            for (var x = 0; x < data.length; x++) {

                (function (x) {
                    var DrugName = data[x].m_product_id;
                    var dosage = data[x].dosage;
                    var frequency = data[x].frequency;
                    var duration = data[x].duration;
                    var quantity = data[x].quantity;
                    var dosage_instructions = data[x].dosage_instructions;
                    var meal_instructions = data[x].meal_instructions;
                    var notes = data[x].notes;
                    var drug = "";

                    jQuery.ajax({
                        url: "" + api_url + "/m_products?filter[where][m_product_id]=" + DrugName + "",
                        type: "GET",
                        dataz: {},
                        success: function (dataz) {
                            for (var n = 0; n < dataz.length; n++) {
                                drug = dataz[n].name;

                                table.row.add($(
                                        '<tr><td>'
                                        + drug +
                                        '</td><td>'
                                        + dosage +
                                        '</td><td>'
                                        + frequency +
                                        '</td><td>'
                                        + duration +
                                        '</td><td>'
                                        + quantity +
                                        '</td><td>'
                                        + dosage_instructions +
                                        '</td><td>'
                                        + meal_instructions +
                                        '</td><td>'
                                        + notes +
                                        '</td><td>\n\
                                         <a href="#" class="btn btn-info" onclick="editDetails(\'' + drug + '\',\'' + dosage + '\',\'' + frequency + '\',\'' + duration + '\',\''
                                        + quantity + '\',\'' + dosage_instructions + '\',\'' + meal_instructions + '\',\'' + notes + '\')">Edit</a></td></tr>'
                                        )).draw(false);

                            }

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
                })(x);

            }

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

function editDetails(drug, dosage, frequency, duration, quantity, d_instructions, m_instructions, notes) {

    console.log("drug##" + drug);

    $("#edit_drug_list").val(drug);
    $("#edit_dosage").val(dosage);
    $("#edit_frequency").val(frequency);
    $("#edit_duration").val(duration);
    $("#edit_quantity").val(quantity);
    $("#edit_dosage_instructions").val(d_instructions);
    $("#edit_meal_instructions").val(m_instructions);
    $("#edit_notes").val(notes);

    $('#edit_prescritionModal').modal('show');

}

function getLabtests() {
    
    var m_productgroup_id = $('#group_name option:selected').attr("id");

    console.log("Inside getLabtests m_productgroup_id " + m_productgroup_id);

    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=" + m_productgroup_id,
        type: "GET",
        data: {},
        success: function (data) {
//            console.log(data);

            for (var x = 0; x < data.length; x++) {

                $("#lab_m_product_id").val(data[x].m_product_id);
            }
            
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

function getRadioCategory() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/m_productgroups?filter[where][c_node_id]=" + 8,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };

    $.ajax(settings).done(function (response) {
        $(".category_name").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".category_name").append(please_select);
        $.each(response, function (i, value) {
            var option_tag = "<option value='" + value.name + "'id='" + value.m_productgroup_id + "'>" + value.name + "</option>";
            $(".category_name").append(option_tag);

        });
    });

}

function getLabCategory() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/m_products?filter[where][m_productgroup_id]=" + 3,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };

    $.ajax(settings).done(function (response) {
        $(".group_name").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".group_name").append(please_select);
        $.each(response, function (i, value) {
            var option_tag = "<option value='" + value.name + "'id='" + value.m_product_id + "'>" + value.name + "</option>";
            $(".group_name").append(option_tag);

        });
    });

}
function getRadiologytests() {

    var m_product_id = $('#category_name option:selected').attr("id");

    console.log("Inside getRadiologytests m_product_id " + m_product_id);

    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=" + m_product_id,
        type: "GET",
        data: {},
        success: function (data) {

            $(".test_name").empty();
            var please_select = "<option value=''>Please Select : </option>";
            $(".test_name").append(please_select);

            for (var x = 0; x < data.length; x++) {

                var option_tag = "<option value='" + data[x].name + "'id='" + data[x].m_product_id + "'>" + data[x].name + "</option>";
                $(".test_name").append(option_tag);
            }
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

function getTriageData(y) {
    //    console.log("Triage = Visit ID => " + y);
    $.ajax({
        url: "" + api_url + "v_vitals?filter[where][p_visit_id]=" + y + "",
        type: "get",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#vts').DataTable({searching: false, paging: false});
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
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });

}

var _MS_PER_YR = 1000 * 60 * 60 * 24 * 365;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_YR);
}

function getConsultationDiseases() {

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
                $("#disease").append(option);

            }
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

function getLabResults(v_id) {
    //    console.log("Lab Results = Visit ID => " + v_id);
    $.ajax({
        url: "" + api_url + "/v_labresults?filter[where][p_visit_id]=" + v_id + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#test_table').DataTable({searching: false, paging: false});
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
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });

}

function getRadiologyResults(v_id) {
    //    console.log("Radio Results = Visit ID => " + v_id);
    $.ajax({
        url: "" + api_url + "/v_radiologyresults?filter[where][p_visit_id]=" + v_id + "",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#radio_test_table').DataTable({searching: false, paging: false});
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
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });

}

function getDrugs() {

    var drug_list = [];
    var drug_id_list = [];
    $.ajax({
        url: "" + api_url + "/m_products?filter[where][m_productgroup_id]=null&filter[where][isproduct]=Y",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                drug_id_list.push(data[x].m_product_id);
                drug_list.push(data[x].name);
            }
            var arrayLength = drug_list.length;

            for (var i = 0; i < arrayLength; i++) {
                var dlist = drug_list[i];
                var d_id = drug_id_list[i];

                var option = "<option value='" + dlist + "' id=' " + d_id + "'>";
                $("#drg").append(option);

            }
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

function getDosages() {

    var dosage_list = [];
    $.ajax({
        url: "" + api_url + "/c_dosages",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                dosage_list.push(data[x].name);
            }
            var arrayLength = dosage_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = dosage_list[i];

                var option = "<option value='" + x + "'>";
                $("#dsg").append(option);

            }
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


function click_functions() {

    $(".submit_symptoms").click(function () {

        var note = $(".sympt_notes").val();
        var finding_note = $(".findings_notes").val();
        //Validation
        if (note.length === 0 || finding_note.length === 0) {
            swal("Error!", "Input values with(* ) must have values before saving!", "error");
        } else {

            var cpid = document.getElementById("cpid").innerHTML;
            var pvid = document.getElementById("pvid").innerHTML;

            postSymptom(note, finding_note, cpid, pvid);
        }

    });
    $(".submit_diagnosis").click(function () {

        var disease = $(".dis").val();
        var note = $(".diag_notes").val();
        if (disease.length === 0) {
            swal("Error!", "Select diagnisis type from the drop down!", "error");
        } else {
            var cpid = document.getElementById("cpid").innerHTML;
            var pvid = document.getElementById("pvid").innerHTML;

            getDiseaseId(note, cpid, pvid, disease);
        }

    });

    $(document).on('submit', 'form#add_lab_test', function (e) {

        var test_id = 0;
        var test_name = '';
        var TestName = $("#group_name").val();

//        test_id = $('#labtst').find('option[value="' + TestName + '"]').attr('id');
//        test_name = $('#labtst').find('option[id="' + test_id + '"]').attr('value');
        
        var test_id = $('#group_name').find(":selected").attr('id');
        var test_name = $('#group_name').find(":selected").val();


        console.log("labtst_name : " + test_name);
        console.log("lab_m_product_id : " + $("#lab_m_product_id").val());

        //get session variables to set to the hidden fields in the form before serialization
        var cpid = document.getElementById("cpid").innerHTML;
        var pvid = document.getElementById("pvid").innerHTML;
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        $("#lab_c_patient_id").val(cpid);
        $("#lab_p_visit_id").val(pvid);
        $("#lab_m_product_id").val(test_id.trim());
        $("#lab_createdby").val(user_id_session);
        $("#lab_updatedby").val(user_id_session);
        $("#group_name").val(test_name);
        $("#lab_c_facility_id").val(facility_id_session);

        e.preventDefault();
        e.stopImmediatePropagation();

        dataString = $("#add_lab_test").serialize();
        console.log("dataString : " + dataString);
        
        $.ajax({
            url: "" + api_url + "/p_lab_referrals",
            type: "POST",
            data: dataString,
            dataType: "JSON",
            success: function (data) {
                var table = $("#laboratory_table").DataTable();
                table.clear();
//                loadPrescriptiontables();
                swal("success!", "Lab test Successful saved!", "success");
                $('#LabModal').modal('hide');
                getLaboratory(pvid);

            }, error: function (e) {
                console.log(e);
                swal(
                        'Oops...',
                        'Something went wrong!\n\
                                Check your network status',
                        'error'
                        );

            }
        });

        return false;

    });

    $(document).on('submit', 'form#add_radiology', function (e) {

        console.log("inside add_radiology");

        var test_id = $('#test_name').find(":selected").attr('id');
        var test_name = $('#test_name').find(":selected").val();

        var category_id = $('#category_name').find(":selected").attr('id');
        var category_name = $('#category_name').find(":selected").val();

        console.log("radiotest_name : " + test_name + "; radiotest_id : " + test_id + "; catname :" + category_name + "; catid >" + category_id);

        //get session variables to set to the hidden fields in the form before serialization
        var cpid = document.getElementById("cpid").innerHTML;
        var pvid = document.getElementById("pvid").innerHTML;
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        $("#radio_c_patient_id").val(cpid);
        $("#radio_p_visit_id").val(pvid);
        $("#radio_m_productgroup").val(category_id.trim());
        $("#radio_m_product_id").val(test_id.trim());
        $("#radio_createdby").val(user_id_session);
        $("#radio_updatedby").val(user_id_session);
        $("#radio_c_facility_id").val(facility_id_session);
        $("#test_name").val(test_name);

        e.preventDefault();
        e.stopImmediatePropagation();

        dataString = $("#add_radiology").serialize();

        console.log("dataString : " + dataString);

        $.ajax({
            url: "" + api_url + "/p_radiology_referrals",
            type: "POST",
            data: dataString,
            dataType: "JSON",
            success: function (data) {
                var table = $("#radio_table").DataTable();
                table.clear();

                getRadiology(pvid);

            }, error: function (e) {
                console.log(e);
                swal(
                        'Oops...',
                        'Something went wrong!\n\
                                Check your network status',
                        'error'
                        );

            }
        });

        return false;

    });

    $(document).on('submit', 'form#add_prescription', function (e) {

        var drug_id = 0;
        var drg_name = '';
        var DrugName = $("#drug_list").val();

        drug_id = $('#drg').find('option[value="' + DrugName + '"]').attr('id');
        drg_name = $('#drg').find('option[id="' + drug_id + '"]').attr('value');

        console.log("drg_name : " + drg_name);

        //get session variables to set to the hidden fields in the form before serialization
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        var cpid = document.getElementById("cpid").innerHTML;
        var pvid = document.getElementById("pvid").innerHTML;

        console.log(" facility_id_session " + facility_id_session);

        $("#c_patient_id").val(cpid);
        $("#p_visit_id").val(pvid);
        $("#m_product_id").val(drug_id.trim());
        $("#cons_createdby").val(user_id_session);
        $("#cons_updatedby").val(user_id_session);
        $("#cons_c_facility_id").val(facility_id_session);
        $("#drug_nam").val(drg_name);

        e.preventDefault();
        e.stopImmediatePropagation();

        dataString = $("#add_prescription").serialize();

        //        console.log(dataString);

        $.ajax({
            type: 'POST',
            url: "" + api_url + "/p_prescriptions",
            crossDomain: true,
            data: dataString,
            success: function (data) {
                swal("success!", "Prescription Successful saved!", "success");
                
                $('#prescritionModal').modal('hide');
                //clearing the form after submission
                //                $(".add_prescription")[0].reset();

                //pull saved prescription to the datatable..reload the datatable
                var table = $("#disp_table").DataTable();
                table.clear();
                loadPrescriptiontables();
                getPrescription(pvid);

            }, error: function (error) {
                console.log(error);
                swal(
                        'Oops...',
                        'Something went wrong!\n\
                                Check your network status',
                        'error'
                        );
            }
        });

        return false;

    });

    $(document).on('submit', 'form#add_edit_prescription', function (e) {

        var drug_id = 0;
        var drg_name = '';
        var DrugName = $("#edit_drug_list").val();

        drug_id = $('#drg').find('option[value="' + DrugName + '"]').attr('id');
        drg_name = $('#drg').find('option[id="' + drug_id + '"]').attr('value');

        console.log("drg_name : " + drg_name);

        //get session variables to set to the hidden fields in the form before serialization
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        var cpid = document.getElementById("cpid").innerHTML;
        var pvid = document.getElementById("pvid").innerHTML;

        $("#edit_c_patient_id").val(cpid);
        $("#edit_p_visit_id").val(pvid);
        $("#edit_m_product_id").val(drug_id.trim());
        $("#edit_cons_createdby").val(user_id_session);
        $("#edit_cons_updatedby").val(user_id_session);
        $("#edit_cons_c_facility_id").val(facility_id_session);
        $("#edit_drug_nam").val(drg_name);

        e.preventDefault();
        e.stopImmediatePropagation();

//        dataString = $("#add_edit_prescription").serialize();

        var edit_dosage = $("#edit_dosage").val();
        var edit_frequency = $("#edit_frequency").val();
        var edit_duration = $("#edit_duration").val();
        var edit_quantity = $("#edit_quantity").val();
        var edit_dosage_instructions = $("#edit_dosage_instructions").val();
        var edit_meal_instructions = $("#edit_meal_instructions").val();
        var edit_notes = $("#edit_notes").val();

        var values = {
            "p_medicalnote_id": 10,
            "c_dosage_id": 1,
            "m_store_id": 1000014,
            "c_patient_id": cpid,
            "p_visit_id": pvid,
            "m_product_id": drug_id.trim(),
            "createdby": user_id_session,
            "updatedby": user_id_session,
            "c_facility_id": facility_id_session,
            "dosage": edit_dosage,
            "frequency": edit_frequency,
            "duration": edit_duration,
            "quantity": edit_quantity,
            "dosage_instructions": edit_dosage_instructions,
            "meal_instructions": edit_meal_instructions,
            "notes": edit_notes
        }

        console.log(values);

        $.ajax({
            type: 'PUT',
            url: "" + api_url + "/p_prescriptions?filter[where][p_visit_id]=" + pvid + "&filter[where][m_product_id]=" + drug_id,
            crossDomain: true,
            data: values,
            success: function (data) {
                swal("success!", "Updating Prescription Successful saved!", "success");

                //clearing the form after submission
                //                $(".add_edit_prescription")[0].reset();

                //pull saved prescription to the datatable..reload the datatable
                var table = $("#disp_table").DataTable();
                table.clear();
                loadprescription();
                getPrescription(pvid);

            }, error: function (error) {
                console.log(error);
                swal(
                        'Oops...',
                        'Something went wrong!\n\
                                Check your network status',
                        'error'
                        );
            }
        });

        return false;

    });

    $(".submit_prescription").click(function () {

        console.log("inside submit_prescription");

        var pvid = document.getElementById("pvid").innerHTML;
        var node = 6;
        update_visit_level(pvid, node);

    });

    $(document).on('submit', 'form#add_admission', function (e) {

        //get session variables to set to the hidden fields in the form before serialization
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        var cpid = document.getElementById("cpid").innerHTML;
        var pvid = document.getElementById("pvid").innerHTML;

        $("#admn_c_patient_id").val(cpid);
        $("#admn_p_visit_id").val(pvid);
        $("#admn_c_user_id").val(user_id_session);
        $("#admn_createdby").val(user_id_session);
        $("#admn_updatedby").val(user_id_session);
        $("#admn_c_facility_id").val(facility_id_session);

        e.preventDefault();
        e.stopImmediatePropagation();

        dataString = $("#add_admission").serialize();

        console.log(dataString);

        $.ajax({
            type: 'POST',
            url: "" + api_url + "/p_admissions",
            crossDomain: true,
            data: dataString,
            success: function (data) {
                swal("success!", "Patient Booked for admission!", "success");

                //changes the cnodeid
                var node = 15;
                update_visit_level(pvid, node);

            }, error: function (error) {
                console.log(error);
                swal(
                        'Oops...',
                        'Something went wrong!\n\
                                Check your network status',
                        'error'
                        );
            }
        });

        return false;

    });

    $(".submit_radiology").click(function () {

        console.log("inside submit_radiology");

        var pvid = document.getElementById("pvid").innerHTML;
        var node = 17;
        update_visit_level(pvid, node);

    });

    $(".submit_notes").click(function () {

        swal("Ooops!", "Special notes not ready!", "error");

    });

    $(".save_img").click(function () {

        //get users input
        var name = $("#name").val();
        var age = $("#age").val();
        var sex = $("#sex").val();
        var pno = $("#pno").val();
        var doff = $("#doff").val();
        var diagnosis = $("#diagnosis").val();
        var from = $("#from").val();
        var to = $("#to").val();
        var Light_duty = $("#light_duty").val();
        var bed_rest = $("#bed_rest").val();
        var next_review_date = $("#next_review_date").val();
        //$("#gender").text("Gender: "+gender);
        //$("#patient_visit_no").text("Visit ID: "+visit_id);
        // download label
        var docDefinition = {
            content: [
                {
                    // if you specify both width and height - image will be stretched
                    image: "data:image/jpeg;base64,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",
                    width: 115,
                    height: 115,
                    alignment: 'center'
                },
                {text: 'SouthLake', style: 'header1'},
                {text: 'HEALTH CENTER', style: 'header2'},
                {text: 'P.O. Box 4326-00200 Nairobi, Kenya', style: 'header3'},
                {text: 'TEL: 020 20202793 Fax: +254 716 642469', style: 'header3'},
                {text: 'Email: info@southlakemc.org Website: www.southlakemc.org', style: 'header3'},
                {text: 'SICK SHEET', style: 'header2'},
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'Name'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '80%',
                            text: name
                        },
                    ],
                    // optional space between columns
                    columnGap: 50
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'Age'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: age
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'Gender'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: sex
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'O.P. No.'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '20%',
                            text: pno
                        },
                    ],
                    // optional space between columns
                    columnGap: 10
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'Diagnosis'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '80%',
                            text: diagnosis
                        },
                    ],
                    // optional space between columns
                    columnGap: 50
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'Days Off:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: doff
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'From:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: from
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'To:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '20%',
                            text: to
                        },
                    ],
                    // optional space between columns
                    columnGap: 50
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'Light Duty:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '80%',
                            text: Light_duty
                        },
                    ],
                    // optional space between columns
                    columnGap: 20
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '25%',
                            text: 'Strict Bed Rest:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '25%',
                            text: bed_rest
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '25%',
                            text: 'Next Review Date:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '25%',
                            text: next_review_date
                        },
                    ],
                    // optional space between columns
                    columnGap: 20
                },
                {
                    columns: [
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'Doc/Nurse:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: 'test'
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '15%',
                            text: 'Signature'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '15%',
                            text: from
                        },
                        {
                            // auto-sized columns have their widths based on their content
                            width: '20%',
                            text: 'Date:'
                        },
                        {
                            // star-sized columns fill the remaining space
                            // if there's more than one star-column, available width is divided equally
                            width: '20%',
                            text: 'test'
                        },
                    ],
                    // optional space between columns
                    columnGap: 20

                },
            ],
            styles: {
                header1: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center'
                },
                header2: {
                    fontSize: 15,
                    bold: true,
                    alignment: 'center'
                },
                header3: {
                    fontSize: 13,
                    bold: false,
                    alignment: 'center'
                },
                anotherStyle: {
                    italic: true,
                    alignment: 'right'
                }
            }
        };

        // download the PDF 
        pdfMake.createPdf(docDefinition).download('download_sicksheet.pdf');

    });

    $(".submit_labnotes").click(function () {

        var pvid = document.getElementById("pvid").innerHTML;
        var node = 4;
        update_visit_level(pvid, node);

    });
///////////////////////////////////////////////////////////////////////////////////////
    $(document).on('click', '.btn-add', function (e) {
        e.preventDefault();


        var controlForm = $('.controls form:first'),
                currentEntry = $(this).parents('.entry:first'),
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

        x = $(this).parents('.entry').find('input').attr('id');

        //        console.log(x);
        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
                .removeClass('btn-add').addClass('btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function (e) {
        $(this).parents('.entry:first').remove();

        e.preventDefault();
        return false;
    });

}

function changeQuantity(form) {
    //get dosage then multiply with frequency to get the quantity and show on quantity
    var dosage = $("#dosage").val();
    var frequency = $("#frequency").val();
    var duration = $("#duration").val();
    var calculate_value = (dosage * frequency) * duration;
    $("#quantity").val(calculate_value);
}

//function getDrugId(dose, cpid, pvid, drug, qty) {
//
//    //    console.log("inside getDrugId");
//
//    $.ajax({
//        url: "" + api_url + "/m_products?filter[where][name]=" + drug + "",
//        type: "get",
//        data: {},
//        success: function (data) {
//
//            for (var n = 0; n < data.length; n++) {
//                mpid = data[n].m_product_id;
//                //                getDosageId(dose, cpid, pvid, mpid, qty);
//
//                postTreatment(dose, cpid, pvid, mpid, qty);
//
//            }
//        },
//        error: function () {
//            swal(
//                    'Oops...',
//                    'Something went wrong!\n\
//                                Check your network status',
//                    'error'
//                    );
//
//        }
//    });
//
//}

function getDiseaseId(a, b, c, d) {
    console.log(d);
    $.ajax({
        url: "" + api_url + "/c_diseases?filter[where][name]=" + d + "",
        type: "get",
        data: {},
        success: function (data) {

            console.log("Data => " + data);

            for (var n = 0; n < data.length; n++) {
                x = data[n].c_disease_id;

                postDiagnosis(a, b, c, x);

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

//function getDosageId(dose, cpid, pvid, mpid, qty) {
//
//    console.log("inside getDosageId");
//    console.log("Dose =>" + dose);
//
//    $.ajax({
//        url: "" + api_url + "/c_dosages?filter[where][name]=" + dose + "",
//        type: "get",
//        data: {},
//        success: function (data) {
//
//            console.log("Data => " + data);
//
//            for (var n = 0; n < data.length; n++) {
//                var dozid = data[n].c_dosage_id;
//
//                postTreatment(dozid, cpid, pvid, mpid, qty);
//                update_to_pharmacy_payment(pvid);
//
//
//            }
//        },
//        error: function () {
//            swal(
//                    'Oops...',
//                    'Something went wrong!\n\
//                                Check your network status',
//                    'error'
//                    );
//        }
//    });
//
//
//
//}

function postDiagnosis(a, b, c, x) {
    n = parseInt(c);
    m = parseInt(x);

    var value = {
        "notes": "a",
        "c_patient_id": b,
        "p_visit_id": n,
        "c_disease_id": m
    };

    $.ajax({
        url: "" + api_url + "/p_diagnosiss",
        type: "POST",
        data: value,
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Patient's diagnosis saved!", "success");
            //reset the drop down after submitting the values
            $(".dis").val = "";

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });
}

//funtion to save symptoms of the patient
function postSymptom(note, finding_note, cpid, pvid) {

    var created_by = $.session.get('user_id');
    var updated_by = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');

    var value = {
        "notes": note,
        "finding_notes": finding_note,
        "c_patient_id": cpid,
        "p_visit_id": pvid,
        "createdby": created_by,
        "updatedby": updated_by,
        "c_facility_id": facility_id
    };

    $.ajax({
        url: "" + api_url + "/p_symptoms",
        type: "POST",
        data: {
            "notes": note,
            "finding_notes": finding_note,
            "c_patient_id": cpid,
            "p_visit_id": pvid,
            "createdby": created_by,
            "updatedby": updated_by,
            "c_facility_id": facility_id
        },
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Patient's Observation saved!", "success");
            $(".observation_form")[0].reset();

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

        }
    });
}

function get_prev_visit(x) {

    $.ajax({
        url: "" + api_url + "/p_visits?filter[where][c_patient_id]=" + x + "&filter[order]=p_visit_id%20DESC&filter[skip]=1&filter[limit]=5",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            //  console.log(data);
            for (var i = 0; i < data.length; i++) {

                var vid = data[i].p_visit_id, etad = data[i].visitdate;

                visit_history(i, vid, etad)
            }
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


function visit_history(i, vid, etad) {

    //    console.log("VISIT KWA VIST: " + vid);
    $.ajax({
        url: "" + api_url + "/v_historys?filter[where][visit_id]=" + vid,
        type: "GET",
        data: {},
        success: function (data) {
            $("#accordion").append("<div class='panel panel-default'><div class='panel-heading'>" +
                    "<h4 class='panel-title'>" +
                    "<a data-toggle='collapse' data-parent='#accordion' href='#col" + i + "'>" + "Visit Date:  " + (etad).substring(0, 10) + "</a>" +
                    "</h4></div><div id ='col" + i + "' class='panel-collapse collapse'>" + "<div class='panel-body'>" +
                    "<div class='col-sm-12'>" +
                    "<button type='button' class='btn btn-info col-sm-2' data-toggle='collapse' data-target='#triage" + i + "'>" +
                    "Triage</button><div class='col-sm-1'></div>" +
                    "<button type='button' class='btn btn-warning col-sm-2' data-toggle='collapse' data-target='#lab" + i + "'>" +
                    "Laboratory</button><div class='col-sm-1'></div>" +
                    "<button type='button' class='btn btn-danger col-sm-2' data-toggle='collapse' data-target='#diag" + i + "'>" +
                    "Diagnosis</button><div class='col-sm-1'></div>" +
                    "<button type='button' class='btn btn-success col-sm-2' data-toggle='collapse' data-target='#treat" + i + "'>" +
                    "Treatment</button><div class='col-sm-1'></div>" +
                    "</div><div style='height: 40px;'></div></div><div id='triage" + i + "' class='collapse'><h3  class='btn-info'> Triage</h3></div>" +
                    "<div id='lab" + i + "' class='collapse'><h3 class='btn-warning'> Laboratory</h3></div>" +
                    "</div><div id='diag" + i + "' class='collapse'><h3 class='btn-danger' > Diagnosis</h3></div>" +
                    "</div><div id='treat" + i + "' class='collapse'><h3 class='btn-success'> Treatment</h3></div>");

            var trg = {};
            var lab = {};
            var diag = {};
            var symp = {};
            var dis = {};
            var trt = {};

            console.log(Object.keys(trg).length + "TRT Length 0");
            for (var x = 0; x < data.length; x++) {

                $.each(data[x], function () {

                    trg[data[x].triage_product] = data[x].triage_result;
                    lab[data[x].lab_product] = data[x].lab_result;
                    symp["symptoms"] = data[x].symptoms;
                    dis["disease"] = data[x].disease;
                    diag["diagnosis"] = data[x].diagnosis;
                    trt[data[x].medicine_prescribed] = data[x].dosage;

                });
            }

            // console.log(trg);
            if ((Object.keys(trg).length != 0)) {
                $.each(trg, function (index, value) {
                    if (value == null) {
                        value = "No Data";
                    }
                    tri = "<p><b>" + index + "</b>" + " = " + value + "</p>";

                    $("#triage" + i + "").append(tri);

                });
            }
            if ((Object.keys(lab).length != 0)) {
                $.each(lab, function (i, v) {
                    if (i == null || v == null) {
                        lb = "<p>No Data</p>";
                    }
                    else {
                        lb = "<p><b>" + i + "</b>" + " = " + v + "</p>";
                    }

                    $("#lab" + i + "").append(lb);
                });
            }
            if ((Object.keys(symp).length != 0)) {
                $.each(symp, function (id, a) {
                    if (a == null) {
                        a = "No Data";
                    }
                    sym = "<div style='border-bottom: solid 1px;'><p><b>" + id + "</b>" + "</p><p>" + a + "</p></div>";

                    $("#diag" + i + "").append(sym);

                });
            }
            if ((Object.keys(dis).length != 0)) {
                $.each(dis, function (indi, val) {
                    if (val == null) {
                        val = "No Data";
                    }
                    dis = "<div style='border-bottom: solid 1px;'><p><b>" + indi + "</b>" + "</p><p>" + val + "</p></div>";

                    $("#diag" + i + "").append(dis);

                });
            }
            if ((Object.keys(diag).length != 0)) {
                $.each(diag, function (ind, va) {
                    if (va == null) {
                        va = "No Data";
                    }
                    dia = "<div style='border-bottom: solid 1px;'><p><b>" + ind + "</b>" + "</p><p>" + va + "</p></div>";

                    $("#diag" + i + "").append(dia);

                });
            }
            if ((Object.keys(trt).length != 0)) {

                $.each(trt, function (tr, ds) {
                    if (tr == null || ds == null) {
                        ds = "<p>No Data</p>";
                        tr = "";
                    }
                    else {
                        trmt = "<p><b>" + tr + "</b>" + " = " + ds + "</p>";

                        $("#treat" + i + "").append(trmt);
                    }

                });
            }
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

//update visit level status
function update_visit_level(visit_id, node) {

    console.log("node> " + node)
    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": node,
        },
        dataType: "JSON",
        success: function (data) {

            //            console.log(data);
            console.log('success update visit id');
            if (node == "4") {
                swal("success!", "Advice patient to pay then visit the Labarory for set tests!", "success");
            } else if (node == "6") {
                swal("success!", "Advice patient to pay for drugs!", "success");
            } else if (node == "16") {
                swal("success!", "Advice patient to pay for Radiology test!", "success");
            }
            //Move to the queue to serve next patient
            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/consultation/consultation.html", function () {
                getConsultationPatients();
                getConsultationDiseases();
                getDrugs();
                getDosages();
                click_functions();
                loadPrescriptiontables();
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