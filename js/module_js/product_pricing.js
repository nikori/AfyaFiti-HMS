/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var product_price_load_flag = true;




$(document).on('submit', 'form#add_product_price_form', function (e) {

    e.preventDefault();
    dataString = $("#add_product_price_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/b_price_lists",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/administration/product_pricing.html", function () {

                get_product_prices();
                get_products();
                $(".update_product_price_div").hide();
                $(".add_product_price_div").hide();
                $(".product_price_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_product_price_link").click(function () {
    $(".update_product_price_div").hide();
    $(".add_product_price_div").show();
    $(".product_price_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_product_price_div").hide();
    $(".add_product_price_div").hide();
    $(".product_price_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_product_price_div").hide();
    $(".add_product_price_div").hide();
    $(".product_price_table_div").show();
});

$(document).on('submit', 'form#update_product_price_form', function (e) {

    e.preventDefault();
    dataString = $("#update_product_price_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/b_price_lists",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/administration/product_pricing.html", function () {

                get_product_prices();
                get_products();
                $(".update_product_price_div").hide();
                $(".add_product_price_div").hide();
                $(".product_price_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var m_product_price_id = $(this).closest('tr').find('input[name="m_product_price_id"]').val();

    $.ajax({
        url: "" + api_url + "/v_product_prices?filter[where][b_price_list_id]=" + m_product_price_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var product_price_name = i.name;

                var code = i.code;
                var m_product_price_id = i.m_product_price_id;
                var description = i.description;




                document.getElementById("update_m_product_price_id").value = m_product_price_id;

                document.getElementById("update_description").value = description;
                document.getElementById("update_name").value = product_price_name;
                document.getElementById("update_code").value = code;





                $(".update_product_price_div").show();
                $(".add_product_price_div").hide();
                $(".product_price_table_div").hide();







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



    var m_product_price_id = $(this).closest('tr').find('input[name="m_product_price_id"]').val();


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
                url: "" + api_url + "/b_price_lists/" + m_product_price_id,
                crossDomain: true,
                success: function (data) {

                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/administration/product_pricing.html", function () {

                        get_product_prices();
                        get_products();
                        $(".update_product_price_div").hide();
                        $(".add_product_price_div").hide();
                        $(".product_price_table_div").show();
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





function get_product_prices() {
    $.ajax({
        url: "" + api_url + "/v_product_prices",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log((data));

            var response_type = typeof (data);
            console.log("response_type = > " + response_type);

            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" product_prices_table   table table-striped table-bordered dt-responsive nowrap" id="product_prices_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th> Name</th> \n\
                                    <th>Code No</th> <th>Group Name </th>  <th>Amount</th>  <th>Selling Price</th> <th>Is Current</th> <th>Is Active</th> <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".product_price_results_div").empty();
                $('.product_price_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var product_name = i.product_name;
                    var productgroup_name = i.productgroup_name;
                    var code = i.code;
                    var amount = i.amount;
                    var selling_price = i.selling_price;
                    var b_price_list_id = i.b_price_list_id;
                    var c_facility_id = i.c_facility_id;
                    var createdby = i.createdby;
                    var updatedby = i.updatedby;
                    var iscurrent = i.iscurrent;
                    var isactive = i.isactive;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + product_name + "</td>\n\
               <td>" + code + "</td>\n\
                <td>" + productgroup_name + "</td>\n\
                <td>" + amount + "</td>\n\
                <td>" + selling_price + "</td>\n\
                <td>" + iscurrent + "</td>\n\
                <td>" + isactive + "</td>\n\
                   <td>\n\
                <input type='hidden' name='b_price_list_id' class='form-control b_price_list_id' id='b_price_list_id' value=" + b_price_list_id + ">\n\
                <input type='hidden' name='c_facility_id' class='form-control c_facility_id' id='c_facility_id' value=" + c_facility_id + ">\n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.product_prices_table').DataTable({});
                //$(".product_price_results_div").append();



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
                                $("#main_body").load("module/administration/product_pricing.html");
                            } else {
                                swal("Cancelled", "Product Pricing deletion process cancelled", "error");
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


function product_price_click() {

    $(document).on('click', ".add_product_price", function () {
        $("#id_sname").empty();
        $(".add_product_price_div").show();
        $(".product_price_table_div").hide();
    });


}





function get_products() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "" + api_url + "/m_products?filter[where][isproduct]=Y",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "376d32db-5367-9d3f-fee5-00319590bf22"
        }
    }

    $.ajax(settings).done(function (response) {
        $(".update_m_product_id").empty();
        $(".m_product_id").empty();
        var please_select = "<option value=''>Please Select : </option>";
        $(".update_m_product_id").append(please_select);
        $(".m_product_id").append(please_select);
        $.each(response, function (i, value) {

            var option_tag = "<option value='" + value.m_product_id + "'>" + value.name + "</option>";
            $(".m_product_id").append(option_tag);
            $(".update_m_product_id").append(option_tag);
        });
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



