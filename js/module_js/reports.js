//if ($('#srch-visits')[0].type !== 'date'){
//    $('#srch-visits').datepicker();
//}
var api_url = localStorage.getItem('API_URL');

function loadpatients() {

    //$("#patient_table").DataTable();
    var table = $('#patient_table').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'excel', 'pdf'
        ]
    });

    console.log("inside loadpatients");

    $.ajax({
        url: "" + api_url + "/c_patients",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#patient_table').DataTable();


            for (var x = 0; x < data.length; x++) {

                var names = data[x].firstname + " " + data[x].middlename + " " + data[x].lastname;

                table.row.add($(
                    '<tr><td>'
                    + names +
                    '</td><td>'
                    + data[x].code +
                    '</td><td>'
                    + data[x].idnumber +
                    '</td><td>'
                    + data[x].gender +
                    '</td><td>'
                    + data[x].dob +
                    '</td><td>'
                    + data[x].maritalstatus +
                    '</td><td>'
                    + data[x].occupation +
                    '</td><td>'
                    + data[x].nhifno +
                    '</td><td>'
                    + data[x].phoneno +
                    '</td><td>'
                    + data[x].email +
                    '</td></tr>'
                )).draw(false);

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

}

function search_visits() {

    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    //    console.log("date : " + today);

    $.ajax({
        url: "" + api_url + "v_patientvisits?filter[where][visit_date]=" + today,
//        url: "" + api_url + "/v_patientvisits",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            console.log(data);
            //var table = $('#search_visit_table').DataTable( );

            var table = $('#search_visit_table').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'excel', 'pdf'
                ]
            });

            for (var x = 0; x < data.length; x++) {

                table.row.add($(
                    '<tr><td>'
                    + data[x].patient_name +
                    '</td><td>'
                    + data[x].patientno +
                    '</td><td>'
                    + data[x].visitno +
                    '</td><td>'
                    + data[x].visit_date +
                    '</td><td>'
                    + data[x].gender +
                    '</td><td>'
                    + data[x].dob +
                    '</td><td>'
                    + data[x].node +
                    "</td><td><input type='hidden' name='patient_id' class='form-control c_patient_id' id='c_patient_id' value=" + 0 + ">\n\
                   <input type='hidden' name='patient_number' class='form-control patient_name' id='patient_name' value=" + 0 + "> \n\
                    <button class='btn btn-primary btn-md' ><i></i> Continue visit</button> </td>\n\</tr>"
                )).draw(false);

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

    $(document).on('click', '.btn-search-visit', function () {
        //clear datatable content
        $('#search_visit_table').dataTable().fnClearTable();

        var search_date = $(".search_visit").val();

        console.log("search_date :" + search_date);

        $.ajax({
            url: "" + api_url + "/v_patientvisits?filter[where][visit_date]=" + search_date,
            type: "GET",
            data: search_date,
            dataType: "JSON",
            success: function (data) {

                console.log(data);
                var table = $('#search_visit_table').DataTable();
                table.clear().draw(false);
                for (var x = 0; x < data.length; x++) {

                    table.row.add($(
                        '<tr><td>'
                        + data[x].patient_name +
                        '</td><td>'
                        + data[x].patientno +
                        '</td><td>'
                        + data[x].visitno +
                        '</td><td>'
                        + data[x].visit_date +
                        '</td><td>'
                        + data[x].gender +
                        '</td><td>'
                        + data[x].dob +
                        '</td><td>'
                        + data[x].node +
                        "</td><td><input type='hidden' name='patient_id' class='form-control c_patient_id' id='c_patient_id' value=" + 0 + ">\n\
                       <input type='hidden' name='patient_number' class='form-control patient_name' id='patient_name' value=" + 0 + "> \n\
                        <button class='btn btn-primary btn-md' ><i></i> Continue visit</button> </td>\n\</tr>"
                    )).draw(false);

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

    });
}

$(document).on('click', '.btn-search-collection', function () {
    //clear datatable content
    $('#financereporttable').dataTable().fnClearTable();

    var search_date = $(".search_collection").val();

//    console.log("search_collection_date :" + search_date);

    $.ajax({
        url: "" + api_url + "/v_financepayments?filter[where][date_paid]=" + search_date,
        type: "GET",
        data: search_date,
        dataType: "JSON",
        success: function (data) {

            var table = $('#financereporttable').DataTable();
            table.clear().draw(false);
            for (var x = 0; x < data.length; x++) {

                var names = data[x].firstname + " " + data[x].lastname;
                var patient_no = data[x].c_patient_id;
                var visit_no = data[x].vid;
                var product = data[x].payment_of;
                var amnt2bpaid = data[x].sum_tobepaid;
                var amntpaid = data[x].sum_amountpaid;
                var bal = data[x].sum_balance;
                var pay_mode = data[x].paymode;
                var pay_date = data[x].date_paid;

                table.row.add($(
                    '<tr><td>' + names +
                    '</td><td>' + patient_no +
                    '</td><td>' + visit_no +
                    '</td><td>' + product +
                    '</td><td>' + amnt2bpaid +
                    '</td><td>' + amntpaid +
                    '</td><td>' + bal +
                    '</td><td>' + pay_mode +
                    '</td><td>' + pay_date +
                    '</td><td><a href="#" class="btn btn-info" onclick="return generateReport()">Extract Report</a></td><td></tr>'
                )).draw(false);

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

});

function loadFinanceReports() {

    $("#financereporttable").DataTable();
}

function generateReport() {

//    console.log("generating report");
    swal("success!", "Check in the downloads to find report!", "success");
}



function getFinanceReports() {
    var trData = "";
    $.ajax({
        url: "" + api_url + "/v_financepayments",
        type: "get",
        data: {},
        success: function (data) {

//            console.log("payments");
//            console.log(data);
            var table = $('#financereporttable').DataTable();
            table.clear().draw(false);
            for (var x = 0; x < data.length; x++) {

                var names = data[x].firstname + " " + data[x].lastname;
                var patient_no = data[x].c_patient_id;
                var visit_no = data[x].vid;
                var product = data[x].payment_of;
                var amnt2bpaid = data[x].sum_tobepaid;
                var amntpaid = data[x].sum_amountpaid;
                var bal = data[x].sum_balance;
                var pay_mode = data[x].paymode;
                var pay_date = data[x].date_paid;
//                console.log("product" + product + ", " + pay_mode);
                table.row.add($(
                    '<tr><td>'
                    + names +
                    '</td><td>'
                    + patient_no +
                    '</td><td>'
                    + visit_no +
                    '</td><td>'
                    + product +
                    '</td><td>'
                    + amnt2bpaid +
                    '</td><td>'
                    + amntpaid +
                    '</td><td>'
                    + bal +
                    '</td><td>'
                    + pay_mode +
                    '</td><td>'
                    + pay_date +
                    '</td><td><a href="#" class="btn btn-info" onclick="return generateReport()">Extract Report</a></td><td></tr>'
                )).draw(false);
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
}

function generateReport() {

//    console.log("generating report");
    swal("success!", "Check in the downloads to find report!", "success");

}