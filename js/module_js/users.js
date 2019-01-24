var username_session = $.session.get('username');
var user_id_session = $.session.get('user_id');
var facility_id_session = $.session.get('facility_id');

var api_url = localStorage.getItem('API_URL');

function getUsers() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_users",
        type: "get",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#mpattable').DataTable();

            for (var x = 0; x < data.length; x++) {

                if (data[x].isactive == 'Y') {
                    var status = "Active";
                } else {
                    var status = "Inactive";
                }
                table.row.add($(
                    '<tr><td>'
                    + (x + 1) +
                    '</td><td>'
                    + data[x].name +
                    '</td><td>'
                    + data[x].facility +
                    '</td><td>'
                    + data[x].role +
                    '</td><td>'
                    + (data[x].created).substr(0, 10) +
                    '</td><td>'
                    + status +
                    "<td><input type='hidden' name='c_user_id' class='form-control c_user_id' id='c_user_id' value=" + data[x].c_user_id + ">\n\
                    <button class='btn btn-danger btn-md user_delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md user_edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>"
                )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}


function getAllRoles() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/c_roles",
        type: "get",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#roletable').DataTable();

            for (var x = 0; x < data.length; x++) {

                table.row.add($(
                    '<tr><td>'
                    + (x + 1) +
                    '</td><td>'
                    + data[x].name +                    
                    "<td><input type='hidden' name='c_role_id' class='form-control c_role_id' id='c_role_id' value=" + data[x].c_role_id + ">\n\
                    <button class='btn btn-danger btn-md role_delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td></tr>"
                )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}


$(document).on('click', ".user_delete_btn", function () {



    var c_user_id = $(this).closest('tr').find('input[name="c_user_id"]').val();


    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
    }).then((result) => {

        if (result) {


            $.ajax({
                type: 'DELETE',
                url: "" + api_url + "/c_users/" + c_user_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/users/users.html", function () {

                        getUsers();
                    });

                }, error: function (error) {
                    swal("Error!", "An Error Occured!", "error");
                }
            });


        } else if (result.dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your Store detail is safe :)',
                'error'
            );
        }
    })



});


$(document).on('click', ".role_delete_btn", function () {



    var c_role_id = $(this).closest('tr').find('input[name="c_role_id"]').val();


    swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false,
        reverseButtons: true
    }).then((result) => {

        if (result) {


            $.ajax({
                type: 'DELETE',
                url: "" + api_url + "/c_roles/" + c_role_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Roles Deleted Successfully!", "success");

                    $(".role_table_div").show();
                    $(".update_user_div").hide();
                    $(".user_table_div").hide();

                }, error: function (error) {
                    swal("Error!", "An Error Occured!", "error");
                }
            });


        } else if (result.dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your Roles detail is safe :)',
                'error'
            );
        }
    })

});

$(document).on('click', ".user_edit_btn", function () {

    var c_user_id = $(this).closest('tr').find('input[name="c_user_id"]').val();

    console.log(c_user_id);

    $.ajax({
        url: "" + api_url + "/c_users/" + c_user_id,
        type: "get",
        data: {},
        success: function (data) {

            var name = data.name;
            var email = data.email;
            var c_facility_id = data.c_facility_id;
            var c_role_id = data.c_role_id;
            var isactive = data.isactive;


            console.log("UID: " + c_user_id);


            document.getElementById("updated_createdby").value = user_id_session;
            document.getElementById("updatedby_updated").value = user_id_session;
            document.getElementById("update_user_id").value = c_user_id;
            document.getElementById("update_email").value = email;
            document.getElementById("update_name").value = name;
            $.ajax({
                url: "" + api_url + "/c_facilitys/" + c_facility_id,
                type: "get",
                data: {},
                success: function (datax) {
                    //document.getElementById("upd_facility").value = datax.code;


                    getFacilities(datax.code);
                }
            });

            $.ajax({
                url: "" + api_url + "/c_roles/" + c_role_id,
                type: "get",
                data: {},
                success: function (datay) {
                    //document.getElementById("update_c_role_id").value = datay.name;
                    getRoles(datay.name);
                }
            });


            if (isactive == 'Y') {
                document.getElementById("update_isactive").value = "Active";

            } else {
                document.getElementById("update_isactive").value = "Inactive";
            }

            $(".update_user_div").show();
            $(".add_user_div").hide();
            $(".user_table_div").hide();

        }, error: function (e) {
            swal(
                'Oops...',
                'Something went wrong in edit!',
                'error'
            );

        }
    });

});

$(document).on('click', ".add_user_btn", function () {
    var val = "";
    document.getElementById("add_createdby").value = user_id_session;
    document.getElementById("add_updatedby").value = user_id_session;
    getFacilities(val);
    getRoles(val);
    $(".add_user_div").show();
    $(".update_user_div").hide();
    $(".user_table_div").hide();
});


$(document).on('click', ".add_role_btn", function () {
    var val = "";
    document.getElementById("addrole_createdby").value = user_id_session;
    document.getElementById("addrole_updatedby").value = user_id_session;;
    $(".add_role_div").show();
    $(".update_user_div").hide();
    $(".role_table_div").hide();
});


$(document).on('click', ".manage_role_btn", function () {

    getAllRoles();
    // document.getElementById("add_createdby").value = user_id_session;
    // document.getElementById("add_updatedby").value = user_id_session;
  
    $(".role_table_div").show();
    $(".update_user_div").hide();
    $(".user_table_div").hide();
});

$(document).on('click', ".close-user-update", function () {

    console.log("closing");
    $(".update_user_div").hide();
    $(".add_user_div").hide();
    $(".user_table_div").show();
});




$(document).on('click', ".user-update", function () {
    // get all the inputs into an array.
    var $inputs = $('#update_user_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[this.name] = $(this).val();
    });
    console.log(values);
    //console.log(key+ " = " + values[key]);


    //console.log("Key: "+key);


    var y = values.role;
    console.log("Value: " + y);
    var c_role_id = getUserRoleid(values);

});

$(document).on('click', ".add-user", function () {
    // get all the inputs into an array.
    var $inputs = $('#add_user_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[(this.name).substring(4)] = $(this).val();
    });

    delete values.c_user_id;
    delete values.created;
    console.log(values);

    getAddUserRoleid(values);

});

$(document).on('click', ".add-role", function () {
    // get all the inputs into an array.
    var $inputs = $('#add_role_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[(this.name).substring(4)] = $(this).val();
    });

    console.log(values);

    addRole(values);

});

function getUserRoleid(values) {
    var y = values.role;

    $.ajax({
        url: "" + api_url + "/c_roles?filter[where][name]=" + y,
        type: "get",
        data: {},
        success: function (data) {
            $.each(data, function (i, val) {
                var c_role_id = val.c_role_id;
                values['c_role_id'] = c_role_id;

                if (values.isactive == 'Active') {
                    values.isactive = 'Y';
                }
                else if (values.isactive == 'Inactive') {
                    values.isactive = 'N';
                }
                delete values.role;
                if (val.i === '') {
                    delete val.i;
                }

                getUserFacilityid(values);
            });

        },
        error: function () {
            console.log("error");
        }

    });
}

function getAddUserRoleid(values) {

    var y = values.role;

    $.ajax({
        url: "" + api_url + "/c_roles?filter[where][name]=" + y,
        type: "get",
        data: {},
        success: function (data) {
            $.each(data, function (i, val) {
                var c_role_id = val.c_role_id;
                values['c_role_id'] = c_role_id;

                if (values.isactive == 'Active') {
                    values.isactive = 'Y';
                }
                else if (values.isactive == 'Inactive') {
                    values.isactive = 'N';
                }
                delete values.role;
                if (val.i === '') {
                    delete val.i;
                }

                getAddUserFacilityid(values);
            });

        },
        error: function () {
            console.log("error");
        }

    });
}

function getAddUserFacilityid(values) {

    var y = values.facility;
    $.ajax({
        url: "" + api_url + "/c_facilitys?filter[where][code]=" + y,
        type: "get",
        data: {},
        success: function (data) {
            $.each(data, function (i, val) {
                var c_facility_id = val.c_facility_id;
                values['c_facility_id'] = c_facility_id;
                delete values.facility;

                addUser(values);
            });

        },
        error: function () {
            console.log("error");
        }

    });
}

function getUserFacilityid(values) {

    var y = values.facility;
    $.ajax({
        url: "" + api_url + "/c_facilitys?filter[where][code]=" + y,
        type: "get",
        data: {},
        success: function (data) {
            $.each(data, function (i, val) {
                var c_facility_id = val.c_facility_id;
                values['c_facility_id'] = c_facility_id;
                delete values.facility;

                updateUser(values);
            });

        },
        error: function () {
            console.log("error");
        }

    });
}

function addUser(values) {


    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (value === "" || value === null) {
            delete values[key];
        }
    });

    var jsonValues = JSON.stringify(values);


    $.ajax({
        async: true,
        crossDomain: true,
        url: "" + api_url + "/c_users",
        method: "POST",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "User Details added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/users/users.html", function () {

                getUsers();
                $(".update_users_div").hide();
                $(".add_users_div").hide();
                $(".users_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });


}

function addRole(values) {


    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (value === "" || value === null) {
            delete values[key];
        }
    });

    var jsonValues = JSON.stringify(values);


    $.ajax({
        async: true,
        crossDomain: true,
        url: "" + api_url + "/c_roles",
        method: "POST",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "Role added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/users/users.html", function () {

                getUsers();
                $(".update_users_div").hide();
                $(".add_role_div").hide();
                $(".user_table_div").show();
                $(".role_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });


}

function updateUser(values) {


    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (value === "" || value === null) {
            delete values[key];
        }
    });

    var jsonValues = JSON.stringify(values);

    $.ajax({
        async: true,
        crossDomain: true,
        url: "" + api_url + "/c_users",
        method: "PUT",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "User Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/users/users.html", function () {

                getUsers();
                $(".update_users_div").hide();
                $(".add_users_div").hide();
                $(".users_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });


}

function getFacilities(yx) {
    console.log(yx);
    var s = document.getElementById('upd_facility');
    s.value = yx;
    var facilities_list = [];
    $.ajax({
        url: "" + api_url + "/c_facilitys",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                facilities_list.push(data[x].code);
            }
            var arrayLength = facilities_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = facilities_list[i];

                var option = "<option value='" + x + "'>";

                $("#update_facility").append(option);
                $("#add_facility").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}

function getRoles(yx) {
    console.log(yx);
    var s = document.getElementById('upd_role');
    s.value = yx;
    var facilities_list = [];
    $.ajax({
        url: "" + api_url + "/c_roles",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                facilities_list.push(data[x].name);
            }
            var arrayLength = facilities_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x = facilities_list[i];

                var option = "<option value='" + x + "'>";

                $("#update_role").append(option);
                $("#add_role").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });

}
