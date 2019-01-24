/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var api_url = localStorage.getItem('API_URL');

var store_load_flag = true;

$(document).on('submit', 'form#add_store_form', function (e) {

    e.preventDefault();
    dataString = $("#add_store_form").serialize();

    $.ajax({
        type: 'POST',
        url: "" + api_url + "/m_stores",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "New Store Added Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/store.html", function () {
                getFacilites();
                get_stores();
                $(".update_store_div").hide();
                $(".add_store_div").hide();
                $(".store_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});

$(".add_store_link").click(function () {
    $(".update_store_div").hide();
    $(".add_store_div").show();
    $(".store_table_div").hide();
});
$(".close_add_form").click(function () {
    $(".update_store_div").hide();
    $(".add_store_div").hide();
    $(".store_table_div").show();
});
$(".close_update_form").click(function () {
    $(".update_store_div").hide();
    $(".add_store_div").hide();
    $(".store_table_div").show();
});

$(document).on('submit', 'form#update_store_form', function (e) {

    e.preventDefault();
    dataString = $("#update_store_form").serialize();

    $.ajax({
        type: 'PUT',
        url: "" + api_url + "/m_stores",
        crossDomain: true,
        data: dataString,
        success: function (data) {
            swal("success!", "Store Details Updated Successfully!", "success");

            $("#main_body").empty();
            $("#modal_loading").modal("show");
            $("#main_body").load("module/store/store.html", function () {
                getFacilites();
                get_stores();
                $(".update_store_div").hide();
                $(".add_store_div").hide();
                $(".store_table_div").show();
            });

        }, error: function (error) {
            swal("Error!", "An Error Occured!", "error");
        }
    });

});




$(document).on('click', ".edit_btn", function () {



    var m_store_id = $(this).closest('tr').find('input[name="m_store_id"]').val();

    $.ajax({
        url: "" + api_url + "/v_stores?filter[where][m_store_id]=" + m_store_id,
        type: "GET",
        data: {
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);

            $.each(data, function (value, i) {

                var store_name = i.store_name;
                var facility_name = i.facility_name;
                var iscentral = i.iscentral;
                var code = i.code;
                var m_store_id = i.m_store_id;
                var c_facility_id = i.c_facility_id;
                var c_facility_id = i.c_facility_id;



                document.getElementById("update_m_store_id").value = m_store_id;
                document.getElementById("update_c_facility_id").value = facility_name;
                document.getElementById("update_name").value = store_name;
                document.getElementById("update_c_facility_id").value = c_facility_id;
                document.getElementById("update_is_central").value = iscentral;
                document.getElementById("update_facilities").value = code;
                $(".update_store_div").show();
                $(".add_store_div").hide();
                $(".store_table_div").hide();

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



    var m_store_id = $(this).closest('tr').find('input[name="m_store_id"]').val();


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
                url: "" + api_url + "/m_stores/" + m_store_id,
                crossDomain: true,
                success: function (data) {
                   
                    swal("success!", "Store Details Deleted Successfully!", "success");

                    $("#main_body").empty();
                    $("#modal_loading").modal("show");
                    $("#main_body").load("module/store/store.html", function () {
                        getFacilites();
                        get_stores();
                        $(".update_store_div").hide();
                        $(".add_store_div").hide();
                        $(".store_table_div").show();
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





function get_stores() {
    $.ajax({
        url: "" + api_url + "/v_stores",
        type: "GET",
        dataType: "JSON",
        success: function (data) {

            console.log(jQuery.type(data));

            var response_type = typeof (data);
            console.log("response_type = > " + response_type);

            // if(data.objects && data.objects.length){
            if (response_type == 'object') {

                var table = '<table class=" stores_table   table table-striped table-bordered dt-responsive nowrap" id="stores_table" cellspacing="0" width="100%">\n\ <thead>\n\
                                    <tr> <th> No</th>  <th>Store Name</th> \n\
                                    <th>Facility No</th> <th>Facility  Name</th> <th>Central Store ? </th>  <th>Action</th> <th>Edit</th> </tr>\n\
                                   </thead>  <tbody id="results_tbody" class="results_tbody"> </tbody> </table>';

                $(".store_results_div").empty();
                $('.store_results_div').append(table);
                var no = 1;
                $.each(data, function (value, i) {
                    var store_name = i.store_name;
                    var facility_name = i.facility_name;
                    var iscentral = i.iscentral;
                    var code = i.code;
                    var m_store_id = i.m_store_id;
                    var c_facility_id = i.c_facility_id;

                    var tr_results = "<tr class='patient_detials_tr'>\n\
                <td>" + no + "</td>\n\
                <td>" + store_name + "</td>\n\
               <td>" + code + "</td>\n\
                <td>" + facility_name + "</td>\n\
                <td>" + iscentral + "</td>\n\
                   <td><input type='hidden' name='m_store_id' class='form-control m_store_id' id='m_store_id' value=" + m_store_id + ">\n\
                   <input type='hidden' name='c_facility_id' class='form-control c_facility_id' id='c_facility_id' value=" + c_facility_id + "> \n\
                    <button class='btn btn-primary btn-md delete_btn' ><i class='fa fa-trash-o'></i> Delete</button> </td>\n\
                   <td><button class='btn btn-primary btn-md edit_btn'  ><i class='fa fa-edit'></i> Edit</button> </td>\n\n\
                </tr>";
                    $(".results_tbody").append(tr_results);
                    no++;
                });
                $('.stores_table').DataTable({});
                //$(".store_results_div").append();

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


function store_click() {

    $(document).on('click', ".add_store", function () {
        $("#id_sname").empty();
        $(".add_store_div").show();
        $(".store_table_div").hide();
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



function getFacilites() {

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
                $("#facilities_list").append(option);

            }
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



