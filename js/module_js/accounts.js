var api_url = localStorage.getItem("API_URL");

var username_session = $.session.get('username');
var user_id_session = $.session.get('user_id');
var facility_id_session = $.session.get('facility_id');

var api_url = localStorage.getItem('API_URL');

function getAccounts() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/c_accounts",
        type: "get",
        data: {},
        success: function (data) {
            //console.log(data);
            var table = $('#accounttable').DataTable();

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
                    + data[x].c_account_code +
                    '</td><td>'
                    + data[x].accountname +
                    '</td><td>'
                    + (data[x].created).substr(0, 10) +
                    '</td><td>'
                    + status +
                    "<td><input type='hidden' name='c_account_id' class='form-control c_account_id' id='c_account_id' value=" + data[x].c_account_id + ">\n\
                    <button class='btn btn-danger btn-sm account_delete_btn' ><i class='fa fa-trash-o'></i> Delete</button><button class='btn btn-primary btn-sm account_edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\
                   <td><button class='btn btn-primary btn-md account_manage_btn'  ><i class='fa fa-edit'></i> Manage</button> </td>\n\n\
                </tr>"
                )).draw(false);

            }
        },
        error: function () {
            console.log("error");
        }
    });
}

$(document).on('click', ".account_edit_btn", function () {

    console.log("iko sawa");

    var c_account_id = $(this).closest('tr').find('input[name="c_account_id"]').val();


    $.ajax({
        url: "" + api_url + "/c_accounts/" + c_account_id,
        type: "get",
        data: {},
        success: function (data) {

            var code = data.c_account_code;
            var name = data.accountname;
            var isactive = data.isactive;


            document.getElementById("updated_createdby").value = user_id_session;
            document.getElementById("updatedby_updated").value = user_id_session;
            document.getElementById("update_account_code").value = code;
            document.getElementById("update_account_id").value = c_account_id;
            document.getElementById("update_account_name").value = name;

            if (isactive == 'Y') {
                document.getElementById("update_account_isactive").value = "Active";

            } else {
                document.getElementById("update_account_isactive").value = "Inactive";
            }

            $(".update_account_div").show();
            $(".add_account_div").hide();
            $(".upload_account_div").hide();
            $(".account_table_div").hide();

        }, error: function (e) {
            swal(
                'Oops...',
                'Something went wrong in edit!',
                'error'
            );

        }
    });

});


$(document).on('click', ".account_delete_btn", function () {

    var c_account_id = $(this).closest('tr').find('input[name="c_account_id"]').val();

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
                url: "" + api_url + "/c_accounts/" + c_account_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Account Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/accounts/accounts.html", function () {

                        getAccounts();
                    });

                }, error: function (error) {
                    swal("Error!", "An Error Occured!", "error");
                }
            });


        } else if (result.dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your Account detail is safe :)',
                'error'
            );
        }
    })



});


$(document).on('click', ".account_manage_btn", function () {
    var c_account_id = $(this).closest('tr').find('input[name="c_account_id"]').val();

    $(".manage_account_div").show();
    $(".update_account_div").hide();
    $(".account_table_div").hide();

    getAccountDetails(c_account_id);

});


$(document).on('click', ".close-account-update", function () {

    console.log("closing");
    $(".update_account_div").hide();
    $(".manage_account_div").hide();
    $(".add_account_div").hide();
    $(".upload_account_div").hide();
    $(".account_table_div").show();
});

$(document).on('click', ".close-account-upload", function () {

    console.log("closing");
    $(".update_account_div").hide();
    $(".manage_account_div").hide();
    $(".add_account_div").hide();
    $(".upload_account_div").hide();
    $(".account_table_div").show();
});

$(document).on('click', ".add_account_btn", function () {


    var val = "";
    document.getElementById("add_createdby").value = user_id_session;
    document.getElementById("add_updatedby").value = user_id_session;
    $(".add_account_div").show();
    $(".upload_account_div").hide();
    $(".update_account_div").hide();
    $(".account_table_div").hide();
});

$(document).on('click', ".upload_account_btn", function () {


    var val = "";
    document.getElementById("upload_createdby").value = user_id_session;
    document.getElementById("upload_updatedby").value = user_id_session;
    $(".add_account_div").hide();
    $(".upload_account_div").show();
    $(".update_account_div").hide();
    $(".account_table_div").hide();
});

$(document).on('click', ".add-account", function () {
    // get all the inputs into an array.

    console.log("In here");
    var $inputs = $('#add_account_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[(this.name)] = $(this).val();
    });

    delete values.c_user_id;
    delete values.created;
    console.log(values);

    if (values.isactive == 'Active') {
        values.isactive = 'Y';
    }
    else if (values.isactive == 'Inactive') {
        values.isactive = 'N';
    }

    addAccount(values);

});

$(document).on('click', ".add-upload", function () {

    console.log("Inside upload file...do the actual upload");
    
});


$(document).on('click', ".set-price", function () {
    // get all the inputs into an array.

    console.log("In here");
    var $inputs = $('#set_account_price_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[(this.name)] = $(this).val();
    });

    console.log(values);


    getProductID(values);

});
$(document).on('click', ".account-update", function () {
    // get all the inputs into an array.
    var $inputs = $('#update_account_form :input');

    // not sure if you wanted this, but I thought I'd add it.
    // get an associative array of just the values.
    var values = {};
    $inputs.each(function () {
        values[this.name] = $(this).val();
    });
    if (values.isactive == 'Active') {
        values.isactive = 'Y';
    }
    else if (values.isactive == 'Inactive') {
        values.isactive = 'N';
    }

    console.log(values);
    updateAccount(values);

});

function addAccount(values) {


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
        url: "" + api_url + "/c_accounts",
        method: "POST",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "Account Details added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/accounts/accounts.html", function () {

                getAccounts();
                $(".update_accounts_div").hide();
                $(".add_accounts_div").hide();
                $(".accounts_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });


}

function updateAccount(values) {

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
        url: "" + api_url + "/c_accounts",
        method: "PUT",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "Account Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/accounts/accounts.html", function () {

                getAccounts();
                $(".update_accounts_div").hide();
                $(".add_accounts_div").hide();
                $(".accounts_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });


}

function getAccountDetails(c_account_id) {

    console.log("Inside get account details: " + c_account_id);
    $.ajax({
        url: "" + api_url + "/c_accounts/" + c_account_id,
        type: "get",
        data: {},
        success: function (data) {
            console.log(data);
            document.getElementById("acc_name").innerHTML = "<i>Account Prices: </i>" + data.accountname;
            document.getElementById("price_account_id").value = data.c_account_id;
            document.getElementById("price_createdby").value = user_id_session;
            document.getElementById("price_updatedby").value = user_id_session;
            document.getElementById("price_facilityid").value = facility_id_session;
            var items_list = [];
            $.ajax({
                url: "" + api_url + "/m_products",
                type: "get",
                data: {},
                success: function (data) {
                    for (var x = 0; x < data.length; x++) {

                        items_list.push(data[x].name);
                    }
                    var arrayLength = items_list.length;

                    for (var i = 0; i < arrayLength; i++) {
                        x = items_list[i];

                        var option = "<option value='" + x + "'>";
                        $("#add_item").append(option);

                    }

                },
                error: function () {
                    console.log("error");
                }
            });

        },
        error: function () {
            console.log("error");
        }
    });
}

function getProductID(values) {

    var m_product_id = values.item;
    console.log("NAME: " + m_product_id);
    $.ajax({
        url: "" + api_url + "/m_products?filter[where][name]=" + m_product_id,
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                values.m_product_id = data[x].m_product_id;
            }
            values.selling_price = values.item_price;
            values.amount = values.base_price;

            delete values.item;
            delete values.base_price;
            delete values.item_price;

            setPrices(values);
        }
    });
}

function setPrices(values) {

    Object.keys(values).forEach(function (key) {
        var value = values[key];
        if (value === "" || value === null) {
            delete values[key];
        }
    });
    values.isactive = "Y";
    values.iscurrent = "Y";
    console.log(values);

    var jsonValues = JSON.stringify(values);

    $.ajax({
        async: true,
        crossDomain: true,
        url: "" + api_url + "/b_price_lists",
        method: "POST",
        data: jsonValues,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        },
        processData: false,
        success: function (data) {
            swal("success!", "Account Prices Set Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/accounts/accounts.html", function () {

                getAccounts();
                $(".update_accounts_div").hide();
                $(".add_accounts_div").hide();
                $(".accounts_table_div").show();
            });
        },
        error: function () {
            console.log("error");
        }

    });

}

