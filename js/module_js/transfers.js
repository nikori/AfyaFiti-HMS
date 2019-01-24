/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var transfers_load_flag = true;

$(document).on('submit', 'form#add_transfers_form', function (e) {

    e.preventDefault();
    dataString = $("#add_transfers_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/v_transfers",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/transfers.html", function () {

                get_transfers();
                $(".update_transfers_div").hide();
                $(".add_transfers_div").hide();
                $(".transfers_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_transfers_link").click(function () {
    $(".update_transfers_div").hide();
    $(".add_transfers_div").show();
    $(".transfers_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_transfers_div").hide();
    $(".add_transfers_div").hide();
    $(".transfers_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_transfers_div").hide();
    $(".add_transfers_div").hide();
    $(".transfers_table_div").show();
});

$(document).on('submit', 'form#update_transfers_form', function (e) {

    e.preventDefault();
    dataString = $("#update_transfers_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/v_transfers",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/transfers.html", function () {

                get_transfers();
                $(".update_transfers_div").hide();
                $(".add_transfers_div").hide();
                $(".transfers_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var m_transfers_id = $(this).closest('tr').find('input[name="m_transfers_id"]').val();

    $.ajax({
        url: "" + api_url + "/v_transfers?filter[where][m_transfers_id]=" + m_transfers_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var transfers_name = i.name;

                var code = i.code;
                var m_transfers_id = i.m_transfers_id;
                var description = i.description;




                document.getElementById("update_m_transfers_id").value = m_transfers_id;

                document.getElementById("update_description").value = description;
                document.getElementById("update_name").value = transfers_name;
                document.getElementById("update_code").value = code;





                $(".update_transfers_div").show();
                $(".add_transfers_div").hide();
                $(".transfers_table_div").hide();

            });

        }, error: function (e) {
            swal(
                    'Oops...',
                    'Something went wrong in edit!',
                    'error'
                    );

        }
    });

});

$(document).on('click', ".delete_btn", function () {



    var m_transfers_id = $(this).closest('tr').find('input[name="m_transfers_id"]').val();







//

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
                url: "" + api_url + "/v_transfers/" + m_transfers_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/store/transfers.html", function () {

                        get_transfers();
                        $(".update_transfers_div").hide();
                        $(".add_transfers_div").hide();
                        $(".transfers_table_div").show();
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


function get_transfers() {
    $.ajax({
        url: "" + api_url + "/v_transfers",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);
            console.log("response_type = > " + response_type);

            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" transfers_table   table table-striped table-bordered dt-responsive nowrap" id="transfers_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Product Name</th> \n\
                                    <th>Batch No</th> <th>Quantity </th>  <th>Store Name </th>   <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".transfers_results_div").empty();
                $('.transfers_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var m_transfer_id = i.m_transfer_id;
                    var m_store_id = i.m_store_id;
                    var batchno = i.batchno;
                    var m_product_id = i.m_product_id;
                    var qty = i.qty;
                    var createdby = i.createdby;
                    var store_name = i.store_name;
                    var product_name = i.product_name;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + product_name + "</td>\n\
               <td>" + batchno + "</td>\n\
                <td>" + qty + "</td>\n\
                <td>" + store_name + "</td>\n\
                   <td>\n\
                <input type='hidden' name='m_transfer_id' class='form-control m_transfer_id' id='m_transfer_id' value=" + m_transfer_id + ">\n\
                <input type='hidden' name='m_store_id' class='form-control m_store_id' id='m_store_id' value=" + m_store_id + ">\n\
                <input type='hidden' name='m_product_id' class='form-control m_product_id' id='m_product_id' value=" + m_product_id + ">\n\
                <input type='hidden' name='createdby' class='form-control createdby' id='createdby' value=" + createdby + ">\n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.transfers_table').DataTable({});
                //$(".transfers_results_div").append();

            } else {

                swal({
                    title: "Error",
                    text: "There was a problem getting data",
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
                                $("#main_body").empty();
                                $("#modal_loading").modal("show");
                                $("#main_body").load("module/registration/register.html");
                            } else {
                                swal("Cancelled", "Patient Registration process cancelled", "error");
                            }
                        });
            }

        }, error: function (data) {

            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });
}


function transfers_click() {

    $(document).on('click', ".add_transfers", function () {
        $("#id_sname").empty();
        $(".add_transfers_div").show();
        $(".transfers_table_div").hide();
    });


}


function getStores() {


    $.ajax({
        url: "" + api_url + "/m_stores",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {


                var option = "<option value='" + +data[x].m_store_id + "'>" + data[x].name + "</option>";
                $("#stores").append(option);
                console.log(option);
            }

        },
        error: function () {
            console.log("error");
        }

    });

}
function getProducts() {


    $.ajax({
        url: "" + api_url + "/m_stores",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {


                var option = "<option value='" + +data[x].m_store_id + "'>" + data[x].name + "</option>";
                $("#stores").append(option);
                console.log(option);
            }

        },
        error: function () {
            console.log("error");
        }

    });

}
function batchNo() {


    $.ajax({
        url: "" + api_url + "/m_stores",
        type: "get",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {


                var option = "<option value='" + +data[x].m_store_id + "'>" + data[x].name + "</option>";
                $("#stores").append(option);
                console.log(option);
            }

        },
        error: function () {
            console.log("error");
        }

    });

}


