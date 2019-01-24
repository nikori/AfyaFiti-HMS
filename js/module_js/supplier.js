/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var supplier_load_flag = true;




$(document).on('submit', 'form#add_supplier_form', function (e) {

    e.preventDefault();
    dataString = $("#add_supplier_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/c_suppliers",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/supplier.html", function () {

                get_suppliers();
                $(".update_supplier_div").hide();
                $(".add_supplier_div").hide();
                $(".supplier_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_supplier_link").click(function () {
    $(".update_supplier_div").hide();
    $(".add_supplier_div").show();
    $(".supplier_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_supplier_div").hide();
    $(".add_supplier_div").hide();
    $(".supplier_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_supplier_div").hide();
    $(".add_supplier_div").hide();
    $(".supplier_table_div").show();
});

$(document).on('submit', 'form#update_supplier_form', function (e) {

    e.preventDefault();
    dataString = $("#update_supplier_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/c_suppliers",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/supplier.html", function () {

                get_suppliers();
                $(".update_supplier_div").hide();
                $(".add_supplier_div").hide();
                $(".supplier_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var c_supplier_id = $(this).closest('tr').find('input[name="c_supplier_id"]').val();

    $.ajax({
        url: "" + api_url + "/c_suppliers?filter[where][c_supplier_id]=" + c_supplier_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var supplier_name = i.name;

                var code = i.code;
                var c_supplier_id = i.c_supplier_id;
                var description = i.description;
                var c_node_id = i.c_node_id;
                var created_by = i.createdby;
                var updated_by = i.updatedby;




                document.getElementById("update_c_supplier_id").value = c_supplier_id;

                document.getElementById("update_description").value = description;
                document.getElementById("update_name").value = supplier_name;
                document.getElementById("update_createdby").value = created_by;
                document.getElementById("updatedby").value = updated_by;





                $(".update_supplier_div").show();
                $(".add_supplier_div").hide();
                $(".supplier_table_div").hide();

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



    var c_supplier_id = $(this).closest('tr').find('input[name="c_supplier_id"]').val();

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
                url: "" + api_url + "/c_suppliers/" + c_supplier_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/store/supplier.html", function () {

                        get_suppliers();
                        $(".update_supplier_div").hide();
                        $(".add_supplier_div").hide();
                        $(".supplier_table_div").show();
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





function get_suppliers() {
    $.ajax({
        url: "" + api_url + "/c_suppliers",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);
            console.log("response_type = > " + response_type);

            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" suppliers_table   table table-striped table-bordered dt-responsive nowrap" id="suppliers_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Name</th> \n\ <th>Description </th>   <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".supplier_results_div").empty();
                $('.supplier_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var supplier_name = i.name;
                    var code = i.code;
                    var c_supplier_id = i.c_supplier_id;
                    var description = i.description;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + supplier_name + "</td>\n\
                <td>" + description + "</td>\n\
                   <td><input type='hidden' name='c_supplier_id' class='form-control c_supplier_id' id='c_supplier_id' value=" + c_supplier_id + ">\n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.suppliers_table').DataTable({});




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





function supplier_click() {

    $(document).on('click', ".add_supplier", function () {
        $("#id_sname").empty();
        $(".add_supplier_div").show();
        $(".supplier_table_div").hide();
    });


}


function get_c_facility_id(code) {

    $.ajax({
        url: "" + api_url + "/c_facilitys?filter[where][code]=" + code,
        type: "get",
        data: {},
        success: function (data) {
            $.each(data, function (i, val) {
                var c_facility_id = val.c_facility_id;
                $(".c_facility_id").val(c_facility_id);
                $(".update_c_facility_id").val(c_facility_id);
                return c_facility_id;
            });
        },
        error: function () {
            console.log("error");
        }

    });
}




