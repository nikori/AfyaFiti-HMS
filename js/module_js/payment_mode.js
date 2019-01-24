/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var payment_mode_load_flag = true;

$(document).on('submit', 'form#add_paymentmode_form', function (e) {

    e.preventDefault();
    dataString = $("#add_paymentmode_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/b_paymodes",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/administration/payment_mode.html", function () {

                getpaymentmodes();

                $(".update_payment_mode_div").hide();
                $(".add_payment_mode_div").hide();
                $(".payment_mode_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_payment_mode_link").click(function () {
    $(".update_payment_mode_div").hide();
    $(".add_payment_mode_div").show();
    $(".payment_mode_table_div").hide();
});
$(".close_payment_mode_add_form").click(function () {
    $(".update_payment_mode_div").hide();
    $(".add_payment_mode_div").hide();
    $(".payment_mode_table_div").show();
});
$(".close_payment_mode_update_form").click(function () {
    $(".update_payment_mode_div").hide();
    $(".add_payment_mode_div").hide();
    $(".payment_mode_table_div").show();
});

$(document).on('submit', 'form#update_payment_mode_form', function (e) {

    e.preventDefault();
    dataString = $("#update_payment_mode_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/b_paymodes",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Payment Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/administration/payment_mode.html", function () {

                getpaymentmodes();

                $(".update_payment_mode_div").hide();
                $(".add_payment_mode_div").hide();
                $(".payment_mode_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".payment_mode_edit_btn", function () {



    var b_paymode_id = $(this).closest('tr').find('input[name="b_paymode_id"]').val();

    $.ajax({
        url: "" + api_url + "/b_paymodes?filter[where][b_paymode_id]=" + b_paymode_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var b_paymode_id = i.b_paymode_id;
                var name = i.name;
                var code = i.code;
                var createdby = i.createdby;
                var updatedby = i.updatedby;




                document.getElementById("update_b_paymode_id").value = b_paymode_id;

                document.getElementById("update_paymentmode_name").value = name;
                document.getElementById("update_payment_code").value = code;
                document.getElementById("update_paymentmode_createdby").value = createdby;
                document.getElementById("update_paymentmode_updatedby").value = updatedby;





                $(".update_payment_mode_div").show();
                $(".add_payment_mode_div").hide();
                $(".payment_mode_table_div").hide();

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

$(document).on('click', ".payment_mode_delete_btn", function () {



    var b_paymode_id = $(this).closest('tr').find('input[name="b_paymode_id"]').val();


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
                url: "" + api_url + "/b_paymodes/" + b_paymode_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Payment Mode Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/administration/payment_mode.html", function () {

                        getpaymentmodes();
                        ;
                        $(".update_payment_mode_div").hide();
                        $(".add_payment_mode_div").hide();
                        $(".payment_mode_table_div").show();
                    });

                }, error: function (error) {
                    swal("Error!", "An Error Occured!", "error");
                }
            });


        } else if (result.dismiss === 'cancel') {
            swal(
                    'Cancelled',
                    'Your Payment mode detail is safe :)',
                    'error'
                    );
        }
    })

















});





function getpaymentmodes() {
    $.ajax({
        url: "" + api_url + "/b_paymodes",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);


            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" payment_modes_table   table table-striped table-bordered dt-responsive nowrap" id="payment_modes_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Name</th> \n\
                                   <th>Code </th>  <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".payment_mode_results_div").empty();
                $('.payment_mode_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var b_paymode_id = i.b_paymode_id;
                    var name = i.name;
                    var code = i.code;
                    var createdby = i.createdby;
                    var updatedby = i.updatedby;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + name + "</td>\n\
               <td>" + code + "</td>\n\
                   <td><input type='hidden' name='b_paymode_id' class='form-control b_paymode_id' id='b_paymode_id' value=" + b_paymode_id + "> \n\
                 <button class='btn btn-primary btn-md payment_mode_delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md payment_mode_edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.payment_modes_table').DataTable({});
                //$(".payment_mode_results_div").append();



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



function payment_mode_click() {

    $(document).on('click', ".add_payment_mode", function () {
        $("#id_sname").empty();
        $(".add_payment_mode_div").show();
        $(".payment_mode_table_div").hide();
    });


}




