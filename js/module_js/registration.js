var api_url = localStorage.getItem('API_URL');

var patient_id = "";
var pid = "";
var is_acnt_active = "N";

function registration_clicks() {

    $(document).on('submit', 'form#add_visit_form', function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        var existid = $("#c_patient_id").val();
        var pay_cnode_id = $('#c_node_id').find(":selected").val();
        console.log(existid);
        console.log(pay_cnode_id);
        dataString = $("#add_visit_form").serialize();

        var userid = $.session.get('user_id');
        var currentdate = new Date();
        var formatedMonth = formatNumber((currentdate.getMonth() + 1));
        var formatedDate = formatNumber(currentdate.getDate());
        var datetime = currentdate.getFullYear() + "-" + formatedMonth + "-" + formatedDate + ":"
                + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        var pay_update = {"ispayed": "C", "updated": datetime, "updatedby": userid};

        $.ajax({
            url: "" + api_url + "/p_visits?filter[order]=p_visit_id%20DESC&filter[limit]=1&filter[where][c_patient_id]=" + existid,
            type: "get",
            data: {},
            success: function (data) {
                if (data.length == 0) {

                    //no previous visit exist
                    $.ajax({
                        type: 'POST',
                        url: "" + api_url + "/p_visits",
                        crossDomain: true,
                        data: dataString,
                        success: function (data) {

                            //check the cnode_id of the patient based on where patient has been 
                            //pushed and change the payment status to appear in the next stage
                            if (pay_cnode_id == 1) {
                                //patient pushed directly consultation

                                swal("success!", "Visit No. added. Advice patient to go for consultation payment!", "success");

                            } else if (pay_cnode_id == 2) {
                                //patient pushed directly to triage                                                                
                                $.ajax({
                                    //get billing_id to update billing
                                    url: "" + api_url + "/b_billings?filter[order]=b_billing_id%20DESC&filter[limit]=1&filter[where][c_patient_id]=" + existid,
                                    type: 'GET',
                                    data: {},
                                    success: function (data) {
                                        for (var x = 0; x < data.length; x++) {
                                            var billing_id = data[x].b_billing_id;
                                            console.log("billing_id>>" + billing_id);

                                            $.ajax({
                                                url: "" + api_url + "/b_billings/" + billing_id,
                                                type: 'PUT',
                                                contentType: "application/json;charset=utf-8",
                                                data: JSON.stringify(pay_update),
                                                success: function (data) {
                                                    console.log("success updating billing -- triage");
                                                    swal("success!", "Visit No added. Advice patient to go for triage!", "success");
                                                },
                                                error: function (error) {
                                                    console.log(error);
                                                    swal(
                                                            'Oops...',
                                                            'Something went wrong!\n\
                                        Check your network status',
                                                            'error'
                                                            );
                                                }
                                            });
                                        }

                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            } else {
                                //patient pushed directly to consultation
                                $.ajax({
                                    //get billing_id to update billing
                                    url: "" + api_url + "/b_billings?filter[order]=b_billing_id%20DESC&filter[limit]=1&filter[where][c_patient_id]=" + existid,
                                    type: 'GET',
                                    data: {},
                                    success: function (data) {
                                        for (var x = 0; x < data.length; x++) {

                                            var billing_id = data[x].b_billing_id;
                                            var visit_id = data[x].p_visit_id;
                                            console.log("billing_id>>visitid" + billing_id + ": " + visit_id);

                                            $.ajax({
                                                url: "" + api_url + "/b_billings/" + billing_id,
                                                type: 'PUT',
                                                contentType: "application/json;charset=utf-8",
                                                data: JSON.stringify(pay_update),
                                                success: function (data) {
                                                    //update medicalnoteline table for no triage details
                                                    $.ajax({
                                                        url: "" + api_url + "/p_medicalnotelines",
                                                        type: "POST",
                                                        data: {
                                                            "notes": "Patient did not pass through triage",
                                                            "p_medicalnote_id": 1,
                                                            "p_visit_id": visit_id,
                                                            "m_product_id": 392,
                                                            "createdby": userid,
                                                            "updatedby": userid

                                                        },
                                                        success: function (data) {

                                                            console.log("success updating billing and medicalnoteline -- triage");
                                                            swal("success!", "Visit No added. Advice patient to go for consultation!", "success");

                                                        },
                                                        error: function (e) {
                                                            console.log(e);
                                                            swal(
                                                                    'Oops...',
                                                                    'Something went wrong!\n\
                            Check your network status',
                                                                    'error'
                                                                    );
                                                        }
                                                    });
                                                },
                                                error: function (error) {
                                                    console.log(error);
                                                }
                                            });
                                        }

                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            }

                            //                            swal("success!", "Visit No Added Successfully!", "success");

                            $("#main_body").empty();
                            $("#modal_loading").modal("show");
                            $("#main_body").load("module/registration/search_patient.html", function () {
                                search();
                                //                    register_patient();
                                edit_details();
                            });

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
                } else {
                    for (var x = 0; x < data.length; x++) {

                        var vist_id = data.p_visit_id;
                        console.log("vist_id>>" + vist_id);

                        console.log("Found: " + data[x].visitdate);

                        var dt = (data[x].visitdate).substring(0, 10);

                        console.log(dt);
                        var today = new Date();
                        var date = today.toISOString().slice(0, 10);

                        console.log("Today: " + date);

                        if (dt == date) {
                            swal("info!", "Patient is already in today's visit queue!!", "info");
                        }
                        else {
                            $.ajax({
                                type: 'POST',
                                url: "" + api_url + "/p_visits",
                                crossDomain: true,
                                data: dataString,
                                success: function (data) {

                                    //check the cnode_id of the patient based on where patient has been 
                                    //pushed and change the payment status to appear in the next stage
                                    if (pay_cnode_id == 1) {
                                        //patient pushed directly consultation

                                        swal("success!", "Visit No added. Advice patient to go for consultation payment!", "success");

                                    } else if (pay_cnode_id == 2) {
                                        //patient pushed directly to triage                                                                
                                        $.ajax({
                                            //get billing_id to update billing
                                            url: "" + api_url + "/b_billings?filter[order]=b_billing_id%20DESC&filter[limit]=1&filter[where][c_patient_id]=" + existid,
                                            type: 'GET',
                                            data: {},
                                            success: function (data) {
                                                for (var x = 0; x < data.length; x++) {

                                                    var billing_id = data[x].b_billing_id;
                                                    console.log("billing_id>>" + billing_id);

                                                    $.ajax({
                                                        url: "" + api_url + "/b_billings/" + billing_id,
                                                        type: 'PUT',
                                                        contentType: "application/json;charset=utf-8",
                                                        data: JSON.stringify(pay_update),
                                                        success: function (data) {
                                                            console.log("success updating billing -- triage");
                                                            swal("success!", "Visit No added. Advice patient to go for triage!", "success");
                                                        },
                                                        error: function (error) {
                                                            console.log(error);
                                                            swal(
                                                                    'Oops...',
                                                                    'Something went wrong!\n\
                                                                Check your network status',
                                                                    'error'
                                                                    );
                                                        }
                                                    });
                                                }

                                            },
                                            error: function (error) {
                                                console.log(error);
                                                swal(
                                                        'Oops...',
                                                        'Something went wrong!\n\
                                Check your network status',
                                                        'error'
                                                        );
                                            }
                                        });
                                    } else {
                                        //patient pushed directly to consultation
                                        $.ajax({
                                            //get billing_id to update billing
                                            url: "" + api_url + "/b_billings?filter[order]=b_billing_id%20DESC&filter[limit]=1&filter[where][c_patient_id]=" + existid,
                                            type: 'GET',
                                            data: {},
                                            success: function (data) {
                                                for (var x = 0; x < data.length; x++) {

                                                    var billing_id = data[x].b_billing_id;
                                                    var visit_id = data[x].p_visit_id;
                                                    console.log("billing_id>>visitid" + billing_id + ": " + visit_id);

                                                    $.ajax({
                                                        url: "" + api_url + "/b_billings/" + billing_id,
                                                        type: 'PUT',
                                                        contentType: "application/json;charset=utf-8",
                                                        data: JSON.stringify(pay_update),
                                                        success: function (data) {
                                                            //update medicalnoteline table for no triage details
                                                            $.ajax({
                                                                url: "" + api_url + "/p_medicalnotelines",
                                                                type: "POST",
                                                                data: {
                                                                    "notes": "Patient did not pass through triage",
                                                                    "p_medicalnote_id": 1,
                                                                    "p_visit_id": visit_id,
                                                                    "m_product_id": 392,
                                                                    "createdby": userid,
                                                                    "updatedby": userid

                                                                },
                                                                success: function (data) {

                                                                    console.log("success updating billing and medicalnoteline -- triage");
                                                                    swal("success!", "Visit No added. Advice patient to go for consultation!", "success");

                                                                },
                                                                error: function (e) {
                                                                    console.log(e);
                                                                    swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
                                                                }
                                                            });

                                                        },
                                                        error: function (error) {
                                                            console.log(error);
                                                            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
                                                        }
                                                    });
                                                }

                                            },
                                            error: function (error) {
                                                console.log(error);
                                                swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
                                            }
                                        });
                                    }
                                    //swal("success!", "Visit No Added Successfully!", "success");

                                    $("#main_body").empty();
                                    $("#modal_loading").modal("show");
                                    $("#main_body").load("module/registration/search_patient.html", function () {
                                        search();
                                        //                    register_patient();
                                        edit_details();
                                    });

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
                        }
                    }
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

        //console.log(dataString);

        return false;

    });

    $(document).on('submit', 'form#add_registration_form', function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        //get session variables to set to the hidden fields in the form before serialization
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        $("#reg_createdby").val(user_id_session);
        $("#reg_updatedby").val(user_id_session);
        $("#reg_c_facility_id").val(facility_id_session);

        dataString = $("#add_registration_form").serialize();

        var phoneno = $(".phoneno").val();
        var lastname = $(".lastname").val();
        var idnum = $(".idnumber").val();
        //vaidate mobile number
        if (phoneno.length !== 10) {
            swal("Error!", "Please enter mobile number correctly", "error");
        } else if (idnum.length < 6) {
            swal("Error!", "ID number value must be higher than 5 digits", "error");
        } else {
            //check if patient details appear to stop another registration of the same details
            $.ajax({
                url: "" + api_url + "/c_patients/count?where=%7B%22phoneno%22%3A%20%22" + phoneno + "%22%2C%20%22lastname%22%3A%20%22" + lastname +
                        "%22%2C%20%22idnumber%22%3A%20%22" + idnum + "%22%7D",
                type: "GET",
                dataType: "JSON",
                success: function (data) {
                    console.log("inside search patient details success");
                    if (data.count > 0) {

//                        console.log("user exist");
                        swal("Error! Double entry", "Patient with same name, ID no and phone no exist. \n\
                Search for patient to continue booking a visit", "error");
                    } else {
                        console.log("user does not exist...creating new user");
                        $.ajax({
                            type: 'POST',
                            url: "" + api_url + "/c_patients",
                            crossDomain: true,
                            data: dataString,
                            success: function (data) {
                                swal("success!", "Registration Successful!", "success");

                                get_patientid(lastname, phoneno);
                                //clearing the form after submission
                                $(".add_registration_form")[0].reset();
                            }, error: function (error) {
                                console.log(error);
                                swal("Error!", "An Error Occured!\n\
                                        Check network connectivity", "error");
                            }
                        });

                        return false;
                    }

                }, error: function (data) {

                    swal('Oops...',
                            'Something went wrong! \n\
            Check network connectivity',
                            'error'
                            );
                }
            });

        }

    });

    $(".c_patient_id").keyup(function () {
        var patient_code = $(".c_patient_id").val();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "" + api_url + "/c_patients?filter=%7B%22where%22%3A%7B%22code%22%3A%7B%22like%22%3A%22" + patient_code + "%22%7D%7D%7D",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "ee1eaa1c-d6d8-b23b-b4be-9722b5872bb3"
            }
        };

        $.ajax(settings).done(function (response) {
            $.each(response, function (i, value) {
                pid = i.c_patient_id;
                console.log("pid : " + pid);
            });
        });
    });

    //    $(document).on('click', ".add_register", function () {
    //
    //        insert_personal_details();
    //    });

    $(document).on('click', ".add_kin", function () {

        insert_kin_details();
    });

    $(document).on('click', ".add_insurance", function () {

        insert_insurance_details();
    });

    $(document).on('click', '.btn-reg-patient', function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/registration/reg_test.html"), function () {
            ////        $("#main_body").load("module/registration/registration.html"), function () {

            handleStatusChanged();
        };
    });
}

function handleStatusChanged() {
    $('#iscorporate').on('change', function () {
        toggleStatus();
    });
}

function toggleStatus() {
    if ($('#iscorporate').is(':checked')) {
        $('#a_num :input').removeAttr('disabled');
        $('#p_num :input').removeAttr('disabled');
        $('#is_dep :input').removeAttr('disabled');

        get_accounts();

    } else {
        $('#a_num :input').attr('disabled', true);
        $('#p_num :input').attr('disabled', true);
        $('#is_dep :input').attr('disabled', true);
    }
}

function edit_handleStatusChanged() {
    $('#edit_iscorporate').on('change', function () {
        edit_toggleStatus();
    });
}

function edit_toggleStatus() {
    if ($('#edit_iscorporate').is(':checked')) {
        $('#edit_a_num :input').removeAttr('disabled');
        $('#edit_p_num :input').removeAttr('disabled');
        $('#edit_is_dep :input').removeAttr('disabled');

        get_accounts();

    } else {
        $('#edit_a_num :input').attr('disabled', true);
        $('#edit_p_num :input').attr('disabled', true);
        $('#edit_is_dep :input').attr('disabled', true);
    }
}

function get_accounts() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/c_accounts",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    };

    $.ajax(settings).done(function (response) {
        $(".department_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".department_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_account_id + "'>" + value.accountname + "</option>";
            $(".department_id").append(option_tag);
        });
    });
}

function search() {

    $(document).on('click', '.btn-search', function () {
        //clear datatable content
        $('#patients_table').dataTable().fnClearTable();

        var search_item = $(".search_item").val();

        //check if search_item is lastname or phoneno
        var search_val = {};

        if (/^\d{10}$/.test(search_item)) {
            console.log("inside search_item = phoneno");
            search_val = {
                "phoneno": search_item
            };

//        } else if (/^\d{7}$/.test(search_item)) {
        } else if (search_item.length >= 6) {
            console.log("inside search_item = idnumber");
            search_val = {
                "idnumber": search_item
            };

        } else {
            console.log("inside search_item = lastname");
            search_val = {
                "lastname": search_item
            };
        }

        if (!search_item) {
            swal(
                    'Oops...',
                    'You did not type anything! Please enter something',
                    'info'
                    );
        } else {

            $.ajax({
                url: "" + api_url + "/c_patients/search",
                type: "POST",
                data: search_val,
                dataType: "JSON",
                success: function (data) {

                    var response_type = typeof (data);
                    console.log("response_type = > " + response_type);

                    console.log("data.length() = > " + data.length);

                    // if(data.objects && data.objects.length){
                    if (data.length > 0) {

                        var table = '<table class=" patients_table   table table-striped table-bordered dt-responsive nowrap" id="patients_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th>Patient No</th>  <th>Patient Names</th> \n\
                                    <th>Phone No</th> <th>Id Number</th> <th>DOB</th> <th>Gender</th> <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                        $(".patient_results_div").empty();
                        $('.patient_results_div').append(table);

                        $.each(data, function (value, i) {
                            var firstname = i.firstname;
                            var lasttname = i.lastname;
                            var names = firstname.concat(" " + lasttname);
                            var dob = i.dob;
                            var phone = i.phoneno;
                            var patientno = i.code;
                            var idnum = i.idnumber;
                            var nhifno = i.nhifno;
                            var gender = i.gender;
                            var emp_num = i.employment_number;
                            var c_patient_id = i.c_patient_id;

                            var tr_results = "<tr class='patient_detials_tr'>\n\
                    <td>" + patientno + "</td>\n\
                            <td>" + names + "</td>\n\
                    <td>" + phone + "</td>\n\
                        <td>" + idnum + "</td>\n\
                        <td>" + dob + "</td>\n\
                        <td>" + gender + "</td>\n\
                        <td><input type='hidden' name='patient_id' class='form-control c_patient_id' id='c_patient_id' value=" + c_patient_id + ">\n\
                            <input type='hidden' name='patient_number' class='form-control patient_name' id='patient_name' value=" + patientno + ">\n\
                            <input type='hidden' name='patient_names' class='form-control patient_names' id='patient_names' value=" + firstname.concat(lasttname) + ">\n\
                            <input type='hidden' name='patient_dob' class='form-control patient_dob' id='patient_dob' value=" + dob.substring(0, 10) + "> \
                        <input type='hidden' name='patient_gender' class='form-control patient_gender' id='patient_gender' value=" + gender + "> \
                                <input type='hidden' name='patient_employment_number' class='form-control patient_employment_number' id='patient_employment_number' value=" + emp_num + "> \n\
                                <button class='btn btn-primary btn-md add_visit_btn' ><i class='fa fa-plus'></i> Visit</button> </td>\n\
                                <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                            $(".results_tbody").append(tr_results);

                        });
                        $('.patients_table').DataTable({});

                        //Activate the registration button
                        $("#btn-reg-patient").css({"display": "inline"});

                    } else {

                        swal({
                            title: "Patient NOT registered",
                            text: "You want to register the patient?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "Yes!",
                            cancelButtonText: "No!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {

                                //                                document.getElementById("btn-reg-patient").click();
                                $("#main_body").empty();
                                $("#modal_loading").modal("show");
                                $("#main_body").load("module/registration/reg_test.html"), function () {

                                    handleStatusChanged();
                                };
                            } else {
                                swal("Cancelled", "Patient Registration process cancelled", "error");
                            }
                        });

                    }

                }, error: function (data) {

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

    // Search patient on enter button click
    var input = document.getElementById("btn-input");

    input.addEventListener("keyup", function (event) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Trigger the button element with a click
            document.getElementById("btn-search").click();
        }
    });


    $(document).on('click', ".add_visit_btn", function () {
        var username_session = $.session.get('username');
        var user_id_session = $.session.get('user_id');
        var facility_id_session = $.session.get('facility_id');

        var c_patient_id = $(this).closest('tr').find('input[name="patient_id"]').val();
        var patient_number = $(this).closest('tr').find('input[name="patient_number"]').val();
        var patient_name = $(this).closest('tr').find('input[name="patient_names"]').val();
        var patient_emp_num = $(this).closest('tr').find('input[name="patient_employment_number"]').val();
        var patient_gender = $(this).closest('tr').find('input[name="patient_gender"]').val();
        var patient_dob = $(this).closest('tr').find('input[name="patient_dob"]').val();
        var p_num = "";
        is_acnt_active = "N";//reset default to N

        if (patient_emp_num == 0) {
            p_num = "None";
        } else {
            p_num = patient_emp_num;
        }

        //*******************check if a booking aleady exists before going to the visit page*****************************

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/visit/visit.html", function () {
            $(".createdby").val(user_id_session);
            $(".updatedby").val(user_id_session);
            $(".c_facility_id").val(facility_id_session);
            get_c_nodes();

            var acc = "none";

            get_payment_modes(acc);
            get_c_departments();
            $(".c_patient_id").val(c_patient_id);
            $(".c_patient_number").val(patient_number);
            document.getElementById("pat_pname").innerHTML = "Patient Name : " + patient_name;
            document.getElementById("pat_pno").innerHTML = "Patient No : " + patient_number;
            document.getElementById("pat_gender").innerHTML = "Gender : " + patient_gender;
            document.getElementById("pat_dob").innerHTML = "DOB : " + patient_dob.substring(0, 10);
            if (patient_emp_num != 0) {
                //document.getElementById("pat_emp_num").innerHTML = "Employee No : " + p_num;
                check_employee(p_num);
            }


        });

    });
    $(document).on('change', ".b_paymode_id", function () {

        $(".c_node_div").hide();

        $.ajax({
            url: "" + api_url + "/c_departments",
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                $(".c_department_id").empty();
                var please_select = "<option value=''>Please Select : </option>";
                $(".c_department_id").append(please_select);
                $.each(response, function (i, value) {
                    var option_tag = "<option value='" + value.c_department_id + "'>" + value.description + "</option>";
                    $(".c_department_id").append(option_tag);
                });
            }, error: function (jqXHR, textStatus, errorThrown) {
                swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
            }
        });

    });


    $(document).on('change', ".visittype", function () {

        var payvisittype = $('#visittype').find(":selected").val();
        $(".c_node_div").hide();

        $.ajax({
            url: "" + api_url + "/b_payforms",
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                $(".b_paymode_id").empty();
                var please_select = "<option value=''>Please Select : </option>";
                $(".b_paymode_id").append(please_select);
                $.each(response, function (i, value) {
                    if (is_acnt_active == 'Y') {//checks if patient is corporate 
                        if (payvisittype == "Walk-In" || payvisittype == "Referred") {
                            var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                            $(".b_paymode_id").append(option_tag);
                        } else {
                            if (value.name == 'SELF PAY') {
                                var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                                $(".b_paymode_id").append(option_tag);
                            }
                        }
                    } else {
                        if (payvisittype == "Walk-In" || payvisittype == "Referred") {
                            if (value.name !== 'CORPORATE') {//patient is not corporate so eleminate Corporate pay option
                                var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                                $(".b_paymode_id").append(option_tag);
                            }
                        } else {
                            if (value.name == 'SELF PAY') {
                                var option_tag = "<option value='" + value.b_payform_id + "'>" + value.name + "</option>";
                                $(".b_paymode_id").append(option_tag);
                            }
                        }
                    }
                });
            }, error: function (jqXHR, textStatus, errorThrown) {
                swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
            }
        });

    });

    $(document).on('change', ".c_department_id", function () {
        $(".c_node_div").hide();
        var c_department_id = $('#c_department_id').find(":selected").val();
        var b_paymode_id = $('#b_paymode_id').find(":selected").val();
        var payvisittype = $('#visittype').find(":selected").val();
        //        console.log("pay visittype >>" + payvisittype);//hapa

        $.ajax({
            url: "" + api_url + "/c_nodes?filter[where][c_department_id]=" + c_department_id,
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                $(".c_node_div").show();
                $(".c_node_id").empty();
                var please_select = "<option value=''>Please Select : </option>";
                $(".c_node_id").append(please_select);
                $.each(response, function (i, value) {
                    //add payment logic to allow patient flow
                    if (c_department_id == 1) {
                        //if its OTP service
                        if (b_paymode_id == 1 || b_paymode_id == 3 || b_paymode_id == 4 || b_paymode_id == 5) {
                            //if payment is corporate push directly to service dpt
                            if (payvisittype == "Walk-In") {
                                if (value.name !== 'Consultation Payment' && value.name !== 'Lab Payment' && value.name !== 'Pharmacy Payment') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            } else {
                                //Not to allow corporate clients to use other visit type but walk-in OTP
                                swal("Error", "Corporate clients accept ONLY walk-in outpatient visit type", "error");
                            }
                        } else if (b_paymode_id == 2) {
                            //if payment is cash force patient to pay for service
                            if (payvisittype == "Walk-In") {
                                //for walk-in outpatient
                                if (value.name == 'Consultation Payment') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            } else if (payvisittype == "Laboratory service") {
                                //for walk-in Laboratory
                                //find ways of capturing the lab tests away from consultation
                                if (value.name == 'Lab Payment') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            } else if (payvisittype == "Pharmacy service") {
                                //for walk-in Pharmacy
                                //find ways of capturing the medication away from consultation
                                if (value.name == 'Pharmacy Payment') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            } /*addition*/
                            else if (payvisittype == "Radiology service") {
                                //for walk-in Radiology service
                                //find ways of capturing the medication away from consultation
                                if (value.name == 'Radiology Payment') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            } else if (payvisittype == "Referred") {
                                //for walk-in Referred
                                //find ways of capturing the medication away from consultation
                                if (value.name == 'Ward') {
                                    var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                                    $(".c_node_id").append(option_tag);
                                }
                            }/*end of addition*/
                        }
                    } else {
                        //other departments >> logic to be thought
                        var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
                        $(".c_node_id").append(option_tag);
                    }
                });
            }, error: function (jqXHR, textStatus, errorThrown) {
                swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
            }
        });

    });

    $(document).on('change', ".c_node_id", function () {

        var c_node_id = $('#c_node_id').find(":selected").val();

        $.ajax({
            url: "" + api_url + "/c_nodes?filter[where][c_node_id]=" + c_node_id,
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                $(".m_product_id").empty();

                //                $.each(response, function (i, value) {
                //                    var m_product_id = value.m_product_id;
                //
                //                    $(".m_product_id").append(m_product_id);
                //                });             }, error: function (jqXHR, textStatus, errorThrown) {

            }
        });

    });

    $(document).on('click', ".edit_btn", function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/registration/edit_registration.html");

        var c_patient_id = $(this).closest('tr').find('input[name="patient_id"]').val();

        $.ajax({
            url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + c_patient_id,
            type: "GET",
            data: {
            },
            dataType: "JSON",
            success: function (data) {

                $.each(data, function (value, i) {

                    var firstname = i.firstname;
                    var lasttname = i.lastname;
                    var middlename = i.middlename;
                    var idnumber = i.idnumber;
                    var gender = i.gender;
                    var maritalstatus = i.maritalstatus;
                    var dob = i.dob;
                    var email = i.email;
                    var occupation = i.occupation;
                    var phone = i.phoneno;
                    var physicaladdress = i.physicaladdress;
                    var postaladdress = i.postaladdress;
                    var postalcode = i.postalcode;
                    var town = i.town;
                    var nhifno = i.nhifno;
                    //corporate variables
                    var iscorporate = i.iscorporate;
                    var employment_number = i.employment_number;
                    var isdependent = i.isdependent;
                    var account_id = i.account_id;

                    //check if patient is corporate to show on the edit form
                    if (employment_number === "") {

                        $(".edit_account_div").hide();
                        document.getElementById("edit_fname").value = firstname;
                        document.getElementById("edit_lname").value = lasttname;
                        document.getElementById("edit_mname").value = middlename;
                        document.getElementById("edit_num").value = idnumber;
                        document.getElementById("edit_dob").value = dob;
                        document.getElementById("edit_status").value = maritalstatus;
                        document.getElementById("edit_gender").value = gender;
                        document.getElementById("edit_occupation").value = occupation;
                        document.getElementById("edit_email").value = email;
                        document.getElementById("edit_phone").value = phone;
                        document.getElementById("edit_physical").value = physicaladdress;
                        document.getElementById("edit_postal").value = postaladdress;
                        document.getElementById("edit_postalcode").value = postalcode;
                        document.getElementById("edit_town").value = town;
                        document.getElementById("edit_nhif").value = nhifno;
                        document.getElementById("c_patient_id").value = c_patient_id;

                    } else {

                        edit_handleStatusChanged();
                        $(".edit_account_div").show();
                        //show corporate fields
                        document.getElementById("edit_fname").value = firstname;
                        document.getElementById("edit_lname").value = lasttname;
                        document.getElementById("edit_mname").value = middlename;
                        document.getElementById("edit_num").value = idnumber;
                        document.getElementById("edit_dob").value = dob;
                        document.getElementById("edit_status").value = maritalstatus;
                        document.getElementById("edit_gender").value = gender;
                        document.getElementById("edit_occupation").value = occupation;
                        document.getElementById("edit_email").value = email;
                        document.getElementById("edit_phone").value = phone;
                        document.getElementById("edit_physical").value = physicaladdress;
                        document.getElementById("edit_postal").value = postaladdress;
                        document.getElementById("edit_postalcode").value = postalcode;
                        document.getElementById("edit_town").value = town;
                        document.getElementById("edit_nhif").value = nhifno;
                        document.getElementById("c_patient_id").value = c_patient_id;

                        document.getElementById("edit_iscorporate").value = iscorporate;
                        document.getElementById("department_id").value = account_id;
                        document.getElementById("edit_employment_number").value = employment_number;
                        document.getElementById("edit_isdependent").value = isdependent;

                    }

                });

            }, error: function (e) {
                swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );

            }
        });
    });

}

function edit_details() {
    $(document).on('click', '.edit_submit-btn', function () {

        var status_v = document.getElementById("edit_status");
        var m_status = status_v.options[status_v.selectedIndex].text;
        var gender_v = document.getElementById("edit_gender");
        var m_gender = gender_v.options[gender_v.selectedIndex].text;
        var c_patient_id = document.getElementById("c_patient_id").value;

        console.log("edit_details=> c_patient_id >>" + c_patient_id);
        console.log("edit_details=> m_status >>" + m_status);
        console.log("edit_details=> m_gender >>" + m_gender);

        var firstname = $(".edit_fname").val();
        var lastname = $(".edit_lname").val();
        var middlename = $(".edit_mname").val();
        var dob = $(".edit_dob").val();
        var status = m_status;
        var gender = m_gender;
        var email = $(".edit_email").val();
        var phoneno = $(".edit_phone").val();
        var postal_address = $(".edit_postal").val();
        var physical_address = $(".edit_physical").val();
        var postalcode = $(".edit_postalcode").val();
        var town = $(".edit_town").val();
        var occupation = $(".edit_occupation").val();
        var nhifno = $(".edit_nhif").val();

        var iscorporate = $(".edit_iscorporate").val();
        var department_id = $(".department_id").val();
        var employment_number = $(".edit_employment_number").val();
        var isdependent = $(".edit_isdependent").val();

        var userid_Value = $.session.get('user_id');
        var facility_Value = $.session.get('facility_id');

        console.log("Edit...iscorporate=>" + iscorporate);
        console.log("department_id=>" + department_id);
        console.log("employment_number=>" + employment_number);
        console.log("isdependent=>" + isdependent);

        if (department_id == "" || department_id == null) {
            department_id = 0;
        }
        if (employment_number == "") {
            employment_number = 0;
        }
        if (iscorporate == "") {
            iscorporate = "N";
        }
        if (isdependent == "") {
            isdependent = "N";
        }

        $.ajax({
            url: "" + api_url + "/c_patients?filter[where][c_patient_id]=" + c_patient_id,
            type: "PUT",
            data: {
                firstname: firstname,
                lastname: lastname,
                middlename: middlename,
                dob: dob,
                maritalstatus: status,
                gender: gender,
                email: email,
                phoneno: phoneno,
                postaladdress: postal_address,
                physicaladdress: physical_address,
                postalcode: postalcode,
                occupation: occupation,
                town: town,
                nhifno: nhifno,
                createdby: userid_Value,
                updatedby: userid_Value,
                c_facility_id: facility_Value,
                department_id: department_id,
                employment_number: employment_number,
                iscorporate: iscorporate,
                isdependent: isdependent
            },
            dataType: "JSON",
            success: function (data) {

                //                console.log("the data");

                swal("success!", "Patient details saved Successfully!", "success");

                //clearing the form
                $(".edit_fname").val('');
                $(".edit_lname").val('');
                $(".edit_mname").val('');
                $(".edit_dob").val('');
                $('.edit_status').val('Select Status');
                $('.edit_gender').val('Select Gender');
                $(".edit_email").val('');
                $(".edit_phone").val('');
                $(".edit_postal").val('');
                $(".edit_physical").val('');
                $(".edit_postalcode").val('');
                $(".edit_town").val('');
                $(".edit_occupation").val('');
                $(".edit_nhif").val('');
                //send the user to register page
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
    });

    $(document).on('click', '.edit_cancel-btn', function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/registration/search_patient.html");

    });
}

function get_patientid(lastname, phoneno) {
    $.ajax({
        url: "" + api_url + "/c_patients?filter[where][lastname]=" + lastname + "&filter[where][phoneno]=" + phoneno,
        type: "GET",
        data: {},
        success: function (data) {

            for (var x = 0; x < data.length; x++) {

                patient_id = data[x].c_patient_id;
                console.log("patient_id=>" + patient_id);

                //enable the other tabs click
                $("#kin_tab").attr("data-toggle", "tab");
                $("#insurance_tab").attr("data-toggle", "tab");

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


function insert_kin_details() {

    console.log("insert_kin_details>>" + patient_id);

    var names1 = $(".kin_name").val();
    var relation1 = $(".kin_ralation").val();
    var phone1 = $(".kin_phone").val();
    var userid_Value = $.session.get('user_id');
    var facility_Value = $.session.get('facility_id');

    $.ajax({url: "" + api_url + "/c_nextofkin",
        type: "POST",
        data: {
            c_patient_id: patient_id,
            name: names1,
            relation: relation1,
            phoneno: phone1,
            createdby: userid_Value,
            updatedby: userid_Value,
            c_facility_id: facility_Value
        },
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Next of Kin details saved Successful!", "success");
            //clearing the form
            $(".kin_name").val('');
            $(".kin_ralation").val('');
            $(".kin_phone").val('');

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

function insert_insurance_details() {

    var provider = $(".provider").val();
    var membership = $(".membership").val();
    var company = $(".company").val();
    var expiry = $(".expiry").val();
    var userid_Value = $.session.get('user_id');

    $.ajax({
        url: "" + api_url + "/c_insurance",
        type: "POST",
        data: {
            c_patient_id: patient_id,
            provider: provider,
            membership_no: membership,
            employer: company,
            expiry: expiry,
            createdby: userid_Value,
            updatedby: userid_Value
        },
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Insurance details saved Successful!", "success");
            //clearing the form
            $(".provider").val('');
            $(".membership").val('');
            $(".company").val('');
            $(".expiry").val('');

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

function check_employee(p_num) {
    acc_det = [];
    $.ajax({
        url: "" + api_url + "/c_employees?filter[where][employeenum]=" + p_num,
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                acc_det.push(data[x].c_account_id);
                acc_det.push(p_num);
                acc_det.push(data[x].isactive);

                is_acnt_active = data[x].isactive;

                get_acc_details(acc_det);

            }
        },
        error: function (e) {
            console.log("error" + e);
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
        }

    });

}

function get_acc_details(acc_det) {

    var acc_id = acc_det[0];
    $.ajax({
        url: "" + api_url + "/c_accounts?filter[where][isactive]=Y&filter[where][c_account_id]=" + acc_id,
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                acc_det.push(data[x].accountname);

                if (acc_det[2] == 'Y') {
                    var sta = "Active";

                } else {
                    var sta = "Inactive";
                }

                // get_payment_modes(acc_det);

                //console.log(acc_det);
                document.getElementById("pat_emp_num").innerHTML = "Employee No : " + acc_det[1];
                document.getElementById("pat_acc_name").innerHTML = "Account : " + acc_det[3];
                document.getElementById("pat_acc_status").innerHTML = "Status : " + sta;

            }
        },
        error: function (e) {
            console.log("error"+e);
            swal(
                    'Oops...',
                    'Something went wrong!\n\
                                Check your network status',
                    'error'
                    );
        }

    });

    get_payment_modes(acc_det);

}