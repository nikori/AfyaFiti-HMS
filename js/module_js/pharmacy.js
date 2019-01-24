var api_url = localStorage.getItem('API_URL');

function loadDispensing() {

    $("#disp_table").DataTable();
}

function getDispensingPatients() {
    var tnrData = "";

    $.ajax({
        url: "" + api_url + "/v_prescriptions?filter[where][dispensed]=N&filter[where][ispaid]=Y",
        type: "GET",
        data: {},
        success: function (data) {

            console.log(data);
            var table = $('#disp_table').DataTable( );


            for (var x = 0; x < data.length; x++) {

                var visitno = data[x].visitno;
                var patientname = data[x].patientname;
                var visit_date = data[x].created;

                console.log("date is " + visit_date);

                var split_date = visit_date.split("T");
                console.log(split_date[0]);

                table.row.add($(
                        '<tr><td>'
                        + data[x].visitid +
                        '</td><td>'
                        + patientname +
                        '</td><td>'
                        + split_date[0] +
                        '</td><td>'
                        + "Paid" +
                        '</td><td><a href="#" class="btn btn-info" onclick="return displayPrescription(\'' + data[x].patientid + '\',\'' + visitno + '\',\'' + data[x].visitid + '\',\'' + patientname + '\')">Proceed</a></td><td></tr>'
                        )).draw(false);

            }

        },
        error: function () {
            console.log("error");

        }
    });
}

function displayPrescription(patient_id, visno, visit_id, pname) {
    console.log(" inside displayPrescription");
    console.log("visitno" + visit_id);

    document.getElementById("disp_tablediv").className += ' hidden';
    document.getElementById("disp").className = "disp";

    $.ajax({
        url: "" + api_url + "/v_prescriptions?filter[where][dispensed]=N&filter[where][visitid]=" + visit_id,
        type: "GET",
        data: {},
        success: function (data) {


            console.log(" inside success");

            var v_table = $('#visittable').DataTable();
            v_table.clear().draw(false);

            pt_name = 'Patient name: ' + pname;
            v_no = 'Visit no: ' + visno;
            document.getElementById("visit_id").innerHTML = visit_id;
            document.getElementById("patname").innerHTML = pt_name;
            document.getElementById("visitno").innerHTML = visno;

            for (var x = 0; x < data.length; x++) {

                console.log("inside for loop");

                console.log("inside for loop==>" + data[x].visitno + data[x].productname + data[x].dosage + data[x].dispenseqty);

                var visit_date = data[x].created;

                var split_date = visit_date.split("T");
                console.log(split_date[0]);

                var visitid = data[x].visitid;
                var prescrptnid = data[x].prescriptionid;

                v_table.row.add($(
                        '<tr><td>'
                        + split_date[0] +
                        '</td><td>'
                        + data[x].visitno +
                        '</td><td>'
                        + data[x].productname +
                        '</td><td>'
                        + data[x].dosage +
                        '</td><td>'
                        + data[x].dispenseqty +
                        '</td><td>\n\<a href="#" class="btn btn-info" onclick="return dispense_print_label(\'' + patient_id + '\',\'' + data.length + '\',\'' + visitid + '\',\'' + data[x].productname + '\',\'' + data[x].dosage + '\',\'' + pname + '\',\'' + prescrptnid + '\',\'' + data[x].visitno + '\',\'' + pname + '\')">Dispense</a></td></tr>'

                        )).draw(false);

            }

            //load patients prescription history
            get_prev_prescription(patient_id);


        },
        error: function () {
            console.log("error");

        }
    });

}
//this function allows downloding of prescription note

function print_prescription() {
   alert("dsdfdfdfd");
    //get visitid
  var visit_id = $("#visit_id").text();
  var patient_name = $("#patname").text();
//   var visit_id = $("#visit_id").text();
//   var visit_id = $("#visit_id").text();
  console.log("this is the posted visit id"+visit_id);
  $.ajax({
    url: "" + api_url + "/v_prescriptions?filter[where][dispensed]=N&filter[where][visitid]=" + visit_id,
    type: "GET",
    data: {},
    success: function (data) {
    var prescriptions = []
    for (var x = 0; x < data.length; x++) {     
       

      
           var prescription_item = x+1 +'.   '+ data[x].productname +','+ data[x].dosage +','+  data[x].dispenseqty
    

        prescriptions.push([prescription_item])

    }
       
         // download label
  var docDefinition = {
    content: [
        
        {
            // if you specify both width and height - image will be stretched
            image: "data:image/jpeg;base64,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",
            width: 115,
            height: 115,
            alignment: 'center'
        },
        { text: 'BEACON OF HOPE', style: 'header1' },
        { text: 'HEALTH CENTER', style: 'header2' },
        { text: 'P.O. Box 4326-00200 Nairobi, Kenya', style: 'header3' },
        { text: 'TEL: 020 20202793 Fax: +254 716 642469', style: 'header3' },
        { text: 'Email: info@beaconafrica.org Website: www.beaconafrica.org', style: 'header3' },
        { text: 'DRUG PRESCRIPTION', style: 'header2' },
      
        { text: patient_name },
        {
            table: {
                body: prescriptions
            },layout: 'noBorders'
        },
        
       
                          
    
    ],
    styles: {
        header1: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        },
        header2: {
            fontSize: 15,
            bold: true,
            alignment: 'center'
          },
          header3: {
            fontSize: 13,
            bold: false,
            alignment: 'center'
          },
        anotherStyle: {
          italic: true,
          alignment: 'right'
        }
      }
  };

 // download the PDF 
 pdfMake.createPdf(docDefinition).download('download_prescription.pdf');
   
        // for (var x = 0; x < data.length; x++) {

         
        //     var visit_date = data[x].created;

        //     var split_date = visit_date.split("T");
        //     console.log(split_date[0]);
            
        //     var visitid = data[x].visitid;
        //     var prescrptnid = data[x].prescriptionid;

        //     v_table.row.add($(
        //             '<tr><td>'
        //             + split_date[0] +
        //             '</td><td>'
        //             + data[x].visitno +
        //             '</td><td>'
        //             + data[x].productname +
        //             '</td><td>'
        //             + data[x].dosage +
        //             '</td><td>'
        //             + data[x].dispenseqty +
        //             '</td><td>\n\<a href="#" class="btn btn-info" onclick="return dispense_print_label(\'' + patient_id + '\',\'' + data.length + '\',\'' + visitid + '\',\'' + data[x].productname + '\',\'' + data[x].dosage + '\',\'' + pname + '\',\'' + prescrptnid  + '\',\'' + data[x].visitno + '\',\'' + pname  + '\')">Dispense</a></td></tr>'

        //             )).draw(false);

        // }
       
    },
    error: function () {
        console.log("error");

    }
});
}
function get_prev_prescription(patient_id) {

    $.ajax({
        url: "" + api_url + "/p_visits?filter[where][c_node_id]=0&filter[where][c_patient_id]=" + patient_id,
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            //  console.log(data);
            for (var i = 0; i < data.length; i++) {

                var vid = data[i].p_visit_id, etad = data[i].visitdate;

                prescription_history(i, vid, etad)
            }
        },
        error: function (e) {

            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });
}
function prescription_history(i, vid, etad) {

    console.log("VISIT KWA VIST: " + vid);
    $.ajax({
        //url: "http://197.248.10.20:3002/api/v_historys?filter[where][visit_id]=" + vid,
        url: "" + api_url + "/v_prescriptions?filter[where][visitid]=" + vid,
        type: "GET",
        data: {},
        success: function (data) {
            $("#accordion").append("<div class='panel panel-default'><div class='panel-heading'>" +
                    "<h4 class='panel-title'>" +
                    "<a data-toggle='collapse' data-parent='#accordion' href='#col" + i + "'>" + "Visit Date:  " + (etad).substring(0, 10) + "</a>" +
                    "</h4></div><div id ='col" + i + "' class='panel-collapse collapse'>" + "<div class='panel-body'>" +
                    "<div class='col-sm-12'></div></div></div>");
            for (var x = 0; x < data.length; x++) {
                // var visit_date = data[x].created;
// 
                // var split_date = visit_date.split("T");
                // console.log(split_date[0]);



//                      
                // + split_date[0] +
                // '</td><td>'
                // + prescrptnid +
                // '</td><td>'
                // + data[x].productname +
                // '</td><td>'
                // + data[x].dosage +
                // '</td><td>'
                // + data[x].dispenseqty +
                prescriptions = "<p><b>" + data[x].productname + "</b>" + "," + data[x].dosage
                        + "</p>";

                $("#col" + i + "").append(prescriptions);
            }
        },
        error: function () {
            console.log("error");

        }
    });
}

$(".send_return_note").click(function () {

    console.log("inside send_return_note");
    var patvis_id = document.getElementById("patvis_id").innerHTML;
    var ret_note = document.getElementById("return_note").innerHTML;

    $.ajax({
//        url: "http://197.248.10.20:3002/api/p_prescriptions?filter[where][p_visit_id]=" + patvis_id,
        url: "" + api_url + "/p_prescriptions/" + patvis_id,
        type: "PUT",
        data: {
            "return_note": ret_note
        },
        dataType: "JSON",
        success: function (data) {

//            swal("success!", "Patient's prescription saved!", "success");
            return_prescription_visit_level(patvis_id);

        }, error: function (data) {

            console.log(data);

        }
    });

});

function dispense_print_label(patient_id, data_length, visit_id, drug_name, dosage, pname, prescrptnid, visno, pname) {
    console.log("this is the numebr of element in data object==>" + data_length);
    var userid_Value = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

    $.ajax({
        url: "" + api_url + "/p_prescriptions/" + prescrptnid,
        type: "PUT",
        data: {
            isdispensed: 'Y',
            updated: datetime,
            updatedby: userid_Value
        },
        dataType: "JSON",
        success: function (data) {
            // download label
            var docDefinition = {
                content: [
                    {
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            widths: ['*', '*'],
                            body: [
                                ["Patient's Name", pname],
                                ['Drug Name', drug_name],
                                ['Dosage', dosage]
                            ]
                        }
                    }
                ]
            };

            // download the PDF
            //pdfMake.createPdf(docDefinition).download('prescriprion_label.pdf');
            if (data_length == 1) {

                $.ajax({
                    url: "" + api_url + "/p_visits/" + visit_id,
                    type: "put",
                    data: {
                        "c_node_id": 0,
                        "updatedby": userid_Value
                    },
                    dataType: "JSON",
                    success: function (data) {

                        swal("success!", "Patient Visit Successfully Closed!", "success");
                        $("#main_body").empty();
                        $("#modal_loading").modal("show");
                        $("#main_body").load("module/pharmacy/dispensing.html", function () {
                            getDispensingPatients();
                            loadDispensing();
                        });


                    }, error: function (data) {

                        console.log(data);
                        swal(
                                'Oops...',
                                'Something went wrong!',
                                'error'
                                );
                    }
                });

            }
            else {
                displayPrescription(patient_id, visno, visit_id, pname)
            }
            // swal("success!", "Patient Visit Successfully Closed!", "success");

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });

}
function dispense(prescrptnid, visno, pname) {

    console.log(" inside endVisit, visitid : " + visno);
    console.log(" inside endVisit, prescrptnid : " + prescrptnid);

    var userid_Value = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

    console.log("date update prescription ==>" + datetime);

    $.ajax({
        url: "" + api_url + "/p_prescriptions/" + prescrptnid,
        type: "PUT",
        data: {
            isdispensed: 'Y',
            updated: datetime,
            updatedby: userid_Value
        },
        dataType: "JSON",
        success: function (data) {
            displayPrescription(visno, pname)

            // swal("success!", "Patient Visit Successfully Closed!", "success");

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });

}
function endVisit(visitid, prescrptnid) {

    console.log(" the current visit id being modified, visitid : " + visitid);
    console.log(" the current prescription id being modified, prescrptnid : " + prescrptnid);


    var userid_Value = $.session.get('user_id');
    var facility_id = $.session.get('facility_id');

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

    console.log("date update visit ==>" + datetime);

    $.ajax({
        url: "" + api_url + "/p_visits/" + visitid,
        type: "put",
        data: {
            "c_node_id": 0,
            "updatedby": userid_Value
        },
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Patient Visit Successfully Closed!", "success");

            getDispensingPatients();
            loadDispensing();

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });

}

function change_dispensed(prescrptnid, userid_Value) {

    console.log(" inside change_dispensed, prescrptnid : " + prescrptnid);

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

    console.log("date update prescription ==>" + datetime);

    $.ajax({
        url: "" + api_url + "/p_prescriptions/" + prescrptnid,
        type: "PUT",
        data: {
            isdispensed: 'Y',
            updated: datetime,
            updatedby: userid_Value
        },
        dataType: "JSON",
        success: function (data) {

            swal("success!", "Patient Visit Successfully Closed!", "success");

        }, error: function (data) {

            console.log(data);
            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );
        }
    });

}

//update visit level status
function  return_prescription_visit_level(visit_id) {

    $.ajax({
        url: "" + api_url + "/p_visits/" + visit_id,
        type: "PUT",
        data: {
            "c_node_id": 3,
        },
        dataType: "JSON",
        success: function (data) {

            console.log(data);
            console.log('success update visit id');
            swal("success!", "Prescription returned to doctor for amendments!", "success");

        },
        error: function (e) {

            swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                    );

        }
    });
}