/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var product_load_flag = true;

$(document).on('submit', 'form#add_product_form', function (e) {

    e.preventDefault();
    dataString = $("#add_product_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/m_products",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/product.html", function () {

                get_products();
                get_c_nodes();
                $(".update_product_div").hide();
                $(".add_product_div").hide();
                $(".product_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_product_link").click(function () {
    $(".update_product_div").hide();
    $(".add_product_div").show();
    $(".product_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_product_div").hide();
    $(".add_product_div").hide();
    $(".product_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_product_div").hide();
    $(".add_product_div").hide();
    $(".product_table_div").show();
});

$(document).on('submit', 'form#update_product_form', function (e) {

    e.preventDefault();
    dataString = $("#update_product_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/m_products",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/product.html", function () {

                get_products();
                get_c_nodes();
                $(".update_product_div").hide();
                $(".add_product_div").hide();
                $(".product_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var m_product_id = $(this).closest('tr').find('input[name="m_product_id"]').val();

    $.ajax({
        url: "" + api_url + "/v_products?filter[where][m_product_id]=" + m_product_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var m_product_id = i.m_product_id;
                var m_product_name = i.m_product_name;
                var code = i.code;
                var description = i.description;
                var m_uom_id = i.m_uom_id;
                var m_productgroup_id = i.m_productgroup_id;
                var isproduct = i.isproduct;
                var isservice = i.isservice;
                var isgeneric = i.isgeneric;
                var createdby = i.createdby;
                var updatedby = i.updatedby;
                var product_group_name = i.product_group_name;
                var product_group_description = i.product_group_description;
                var uom_code = i.uom_code;
                var uom_description = i.uom_description;




                document.getElementById("update_m_product_id").value = m_product_id;

                document.getElementById("update_description").value = description;
                document.getElementById("update_m_product_name").value = m_product_name;
                document.getElementById("update_code").value = code;
                document.getElementById("update_createdby").value = createdby;
                document.getElementById("updatedby").value = updatedby;
                document.getElementById("update_m_productgroup_id").value = m_productgroup_id;
                document.getElementById("update_m_uom_id").value = m_uom_id;





                $(".update_product_div").show();
                $(".add_product_div").hide();
                $(".product_table_div").hide();

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



     var m_product_id = $(this).closest('tr').find('input[name="m_product_id"]').val();


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
                url: "" + api_url + "/m_products/" + m_product_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/store/product.html", function () {

                        get_products();
                        get_c_nodes();
                        $(".update_product_div").hide();
                        $(".add_product_div").hide();
                        $(".product_table_div").show();
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





function get_products() {
    $.ajax({
        url: "" + api_url + "/v_products?filter[where][or][0][m_productgroup_id]=5&filter[where][or][1][m_productgroup_id]=6",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);


            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" products_table   table table-striped table-bordered dt-responsive nowrap" id="products_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Name</th> \n\
                                  <th>Description </th>   <th>Code </th> <th>Type </th> <th>UOM</th>  <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".product_results_div").empty();
                $('.product_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var m_product_id = i.m_product_id;
                    var m_product_name = i.m_product_name;
                    var code = i.code;
                    var description = i.description;
                    var m_uom_id = i.m_uom_id;
                    var m_productgroup_id = i.m_productgroup_id;
                    var isproduct = i.isproduct;
                    var isservice = i.isservice;
                    var isgeneric = i.isgeneric;
                    var createdby = i.createdby;
                    var updatedby = i.updatedby;
                    var product_group_name = i.product_group_name;
                    var product_group_description = i.product_group_description;
                    var uom_code = i.uom_code;
                    var uom_description = i.uom_description;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + m_product_name + "</td>\n\
               <td>" + description + "</td>\n\
               <td>" + code + "</td>\n\
               <td>" + product_group_name + "</td>\n\
                <td>" + uom_description + " (" + uom_code + ") </td>\n\
                   <td><input type='hidden' name='m_product_id' class='form-control m_product_id' id='m_product_id' value=" + m_product_id + "> \n\
                 <input type='hidden' name='m_uom_id' class='form-control m_uom_id' id='m_uom_id' value=" + m_uom_id + ">  \n\
                <input type='hidden' name='m_productgroup_id' class='form-control m_productgroup_id' id='m_productgroup_id' value=" + m_productgroup_id + ">\n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.products_table').DataTable({});
                //$(".product_results_div").append();



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


function get_productgroups() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/m_productgroups?filter[where][m_productgroup_id][between][0]=5&filter[where][m_productgroup_id][between][1]=6",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    }

    $.ajax(settings).done(function (response) {
        $(".update_m_productgroup_id").empty();
        $(".m_productgroup_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".update_m_productgroup_id").append(please_select);
        $(".m_productgroup_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.m_productgroup_id + "'>" + value.name + "</option>";
            $(".m_productgroup_id").append(option_tag);
            $(".update_m_productgroup_id").append(option_tag);
        });
    });
}
function get_uoms() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/m_uoms",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    }

    $.ajax(settings).done(function (response) {
        $(".update_m_uom_id").empty();
        $(".m_uom_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".update_m_uom_id").append(please_select);
        $(".m_uom_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.m_uom_id + "'>" + value.name + "</option>";
            $(".m_uom_id").append(option_tag);
            $(".update_m_uom_id").append(option_tag);
        });
    });
}


function product_click() {

    $(document).on('click', ".add_product", function () {
        $("#id_sname").empty();
        $(".add_product_div").show();
        $(".product_table_div").hide();
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



