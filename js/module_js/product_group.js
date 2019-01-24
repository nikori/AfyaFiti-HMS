/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var product_group_load_flag = true;

$(document).on('submit', 'form#add_product_group_form', function (e) {

    e.preventDefault();
    dataString = $("#add_product_group_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/m_productgroups",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/product_group.html", function () {

                get_product_groups();
                get_c_nodes();
                $(".update_product_group_div").hide();
                $(".add_product_group_div").hide();
                $(".product_group_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_product_group_link").click(function () {
    $(".update_product_group_div").hide();
    $(".add_product_group_div").show();
    $(".product_group_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_product_group_div").hide();
    $(".add_product_group_div").hide();
    $(".product_group_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_product_group_div").hide();
    $(".add_product_group_div").hide();
    $(".product_group_table_div").show();
});

$(document).on('submit', 'form#update_product_group_form', function (e) {

    e.preventDefault();
    dataString = $("#update_product_group_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/m_productgroups",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/product_group.html", function () {

                get_product_groups();
                get_c_nodes();
                $(".update_product_group_div").hide();
                $(".add_product_group_div").hide();
                $(".product_group_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var m_productgroup_id = $(this).closest('tr').find('input[name="m_productgroup_id"]').val();

    $.ajax({
        url: "" + api_url + "/m_productgroups?filter[where][m_productgroup_id]=" + m_productgroup_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var product_group_name = i.name;

                var code = i.code;
                var m_productgroup_id = i.m_productgroup_id;
                var description = i.description;
                var c_node_id = i.c_node_id;
                var created_by = i.createdby;
                var updated_by = i.updatedby;




                document.getElementById("update_m_productgroup_id").value = m_productgroup_id;

                document.getElementById("update_description").value = description;
                document.getElementById("update_name").value = product_group_name;
                document.getElementById("update_code").value = code;
                document.getElementById("update_createdby").value = created_by;
                document.getElementById("updatedby").value = updated_by;
                document.getElementById("update_c_node_id").value = c_node_id;





                $(".update_product_group_div").show();
                $(".add_product_group_div").hide();
                $(".product_group_table_div").hide();

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



    var m_productgroup_id = $(this).closest('tr').find('input[name="m_productgroup_id"]').val();

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
                url: "" + api_url + "/m_productgroups/" + m_productgroup_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/store/product_group.html", function () {

                        get_product_groups();
                        get_c_nodes();
                        $(".update_product_group_div").hide();
                        $(".add_product_group_div").hide();
                        $(".product_group_table_div").show();
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





function get_product_groups() {
    $.ajax({
        url: "" + api_url + "/m_productgroups",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);
            console.log("response_type = > " + response_type);

            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" product_groups_table   table table-striped table-bordered dt-responsive nowrap" id="product_groups_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Name</th> \n\
                                    <th>Code No</th> <th>Description </th>   <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".product_group_results_div").empty();
                $('.product_group_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var product_group_name = i.name;
                    var code = i.code;
                    var m_productgroup_id = i.m_productgroup_id;
                    var description = i.description;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + product_group_name + "</td>\n\
               <td>" + code + "</td>\n\
                <td>" + description + "</td>\n\
                   <td><input type='hidden' name='m_productgroup_id' class='form-control m_productgroup_id' id='m_productgroup_id' value=" + m_productgroup_id + ">\n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.product_groups_table').DataTable({});
                //$(".product_group_results_div").append();



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


function get_c_nodes() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/c_nodes",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    }

    $.ajax(settings).done(function (response) {
        $(".update_c_node_id").empty();
        $(".c_node_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".update_c_node_id").append(please_select);
        $(".c_node_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.c_node_id + "'>" + value.name + "</option>";
            $(".c_node_id").append(option_tag);
            $(".update_c_node_id").append(option_tag);
        });
    });
}


function product_group_click() {

    $(document).on('click', ".add_product_group", function () {
        $("#id_sname").empty();
        $(".add_product_group_div").show();
        $(".product_group_table_div").hide();
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



$("#facilities").blur(function () {
    var code = $("#facilities").val();
    get_selected_facility(code);
    get_c_facility_id(code);

});
$("#update_facilities").blur(function () {
    var code = $("#update_facilities").val();
    get_selected_facility(code);
    get_c_facility_id(code);

});

function get_selected_facility(code) {
    $(".selected_facility").empty();
    $.ajax({
        url: "" + api_url + "/c_facilitys?filter[where][code]=" + code + "",
        type: "get",
        data: {},
        success: function (data) {
            var facility_name = data[0].name;
            console.log(facility_name);
            $(".selected_facility").append(facility_name);
            $(".update_selected_facility").append(facility_name);
        },
        error: function () {
            console.log("error");
        }
    });
}



