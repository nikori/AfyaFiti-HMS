function loadDataTableRadiology() {

    $("#radiologyTable").DataTable();
}


function getRadiologyPayments() {
    var trData = "";
    $.ajax({
        url: "" + api_url + "/v_radiologypayments?filter[where][ispaid]=N",
        type: "get",
        data: {},
        success: function (data) {

            alasql("DROP TABLE IF EXISTS radiologypayments");
            alasql("CREATE TABLE radiologypayments(patientid text,fname text,lname text,productname text,productcode text,productid text,amount integer,c_node_id text,visit_id text)");
            alasql("DELETE FROM radiologypayments");
            // var table = $('#exampleTable').DataTable();
            // table.clear().draw(false);
            for (var x = 0; x < data.length; x++) {



                var patientId = data[x].patient_id;
                var fname = data[x].firstname;
                var lname = data[x].lastname;
                var productName = data[x].product_name;
                var productCode = data[x].product_code;
                var productId = data[x].product_id;
                var amount = Number(data[x].amount);
                var cnodeid = data[x].c_node_id;
                var visitid = data[x].p_visit_id;
                alasql("INSERT INTO radiologypayments VALUES ('" + patientId + "','" + fname + "','" + lname + "','" + productName + "','" + productCode + "','" + productId + "'," + amount + "," + cnodeid + "," + visitid + ")");
                console.log("table created");
                console.log(data);
            }

            loadNewRadiologyTable();
            // var res=alasql("select patientid,fname,lname,productname,productcode,productid,sum(amount) as amount,c_node_id from labpayments group by patientid,productname,productcode,productid,fname,lname,c_node_id");
            // var res=alasql("select patientid,fname,lname,sum(amount) as amount from labpayments group by patientid,fname,lname");

        },
        error: function (data) {
            console.log("error");
            console.log(data);
        }
    });
}














function loadNewRadiologyTable() {


//intialisation

    $('#radiologyTable').DataTable().destroy();
    var newRowData = [];
    var res = alasql("select patientid,fname,lname,sum(amount) as amount,visit_id from radiologypayments group by patientid,fname,lname,visit_id");
    console.log(typeof res);
    if (typeof res[0].patientid == "undefined") {

        $('#radiologyTable').dataTable();
    }

//since there is data populate our array newRowData with values
    else {
        for (var x = 0; x < res.length; x++) {

            var mpid = res[x].patientid;
            var mvid = res[x].visit_id;
            console.log("the visit id is " + mvid);
            var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[mpid]);
            console.log("the details here");
            console.log(resDetails.length);
            for (var x = 0; x < res.length; x++) {

                var mpid = res[x].patientid;
                var mvid = res[x].visit_id;
                console.log("the visit id is " + mvid);
                var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[mpid]);
                console.log("the details here");
                console.log(resDetails.length);
                var detailsRowA = [];
                var detailsRowAPlayer1 = {};
                for (var y = 0; y < resDetails.length; y++) {

                    var mypname = resDetails[y].productname;
                    var mypcode = resDetails[y].productcode;
                    var myamount = resDetails[y].amount;
                    detailsRowAPlayer1 = {pname: mypname, pcode: mypcode, amount: myamount};
                    detailsRowA.push(detailsRowAPlayer1);
                }


                var myrow = {pid: res[x].patientid, fname: res[x].fname, lname: res[x].lname, total: res[x].amount, action: res[x].visit_id, details: detailsRowA};
                newRowData.push(myrow);
            }

        }

        if (newRowData.length > 0) {
//intialisation part

            var iTableCounter = 1;
            var oTable;
            var oInnerTable;
            var detailsTableHtml;
            //initialisation


            // you would probably be using templates here
            detailsTableHtml = $("#radiologydetailsTable").html();
            //Insert a 'details' column to the table
            var nCloneTh = document.createElement('th');
            var nCloneTd = document.createElement('td');
            nCloneTd.innerHTML = '<img src="http://i.imgur.com/SD7Dz.png">';
            nCloneTd.className = "center";
            $('#radiologyTable thead tr').each(function () {

                this.insertBefore(nCloneTh, this.childNodes[0]);
            });
            $('#radiologyTable tbody tr').each(function () {
                this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
            });
            //initialisation part


            var oTable = $('#radiologyTable').dataTable({
                "bJQueryUI": true,
                "bDestroy": true,
                "aaData": newRowData,
                "bPaginate": true,
                "aoColumns": [
                    {
                        "mDataProp": null,
                        "sClass": "control center",
                        "sDefaultContent": '<img src="http://i.imgur.com/SD7Dz.png">'
                    },
                    {"mDataProp": "pid"},
                    {"mDataProp": "fname"},
                    {"mDataProp": "lname"},
                    {"mDataProp": "total"},
                    {"mDataProp": "action"}
                ],
                "oLanguage": {
                    "sInfo": "_TOTAL_ entries"
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    var myvid = aData['action'];
                    var mytotal = aData['total'];
                    var myTag = '<a href="#" class="btn btn-info" onclick="promptRadiologyPayment(\'' + myvid + '\',\'' + mytotal + '\')" width="100px">pay</a>';
                    $('td:eq(5)', nRow).html(myTag);
                    return nRow;
                },
                "aaSorting": [[1, 'asc']]
            });
            //Initialse DataTables, with no sorting on the 'details' column


            /* Add event listener for opening and closing details
             * Note that the indicator for showing which row is open is not controlled by DataTables,
             * rather it is done here
             */
            $j('#radiologyTable tbody td img').live('click', function () {
                var nTr = $(this).parents('tr')[0];
                var nTds = this;
                if (oTable.fnIsOpen(nTr)) {
                    /* This row is already open - close it */
                    this.src = "http://i.imgur.com/SD7Dz.png";
                    oTable.fnClose(nTr);
                }
                else {
                    /* Open this row */
                    var rowIndex = oTable.fnGetPosition($(nTds).closest('tr')[0]);
                    var detailsRowData = newRowData[rowIndex].details;
                    this.src = "http://i.imgur.com/d4ICC.png";
                    oTable.fnOpen(nTr, fnFormatDetails(iTableCounter, detailsTableHtml), 'details');
                    oInnerTable = $("#radiologyTable_" + iTableCounter).dataTable({
                        "bJQueryUI": true,
                        "bFilter": false,
                        "aaData": detailsRowData,
                        "bSort": true, // disables sorting
                        "aoColumns": [
                            {"mDataProp": "pname"},
                            {"mDataProp": "pcode"},
                            {"mDataProp": "amount"}

                        ],
                        "bPaginate": false,
                        "oLanguage": {
                            "sInfo": "_TOTAL_ entries"
                        }

                    });
                    iTableCounter = iTableCounter + 1;
                }
            });
            // datatable code here

        }
        else {

            console.log("my array is empty" + newRowData.length);
        }
// $("#exampleTable").dataTable().fnDestroy();

    }

}











function loadNewRadiologyTable() {


//intialisation

    $('#radiologyTable').DataTable().destroy();
    var newRowData = [];
    var res = alasql("select patientid,fname,lname,sum(amount) as amount,visit_id from radiologypayments group by patientid,fname,lname,visit_id");
    console.log(typeof res);
    if (typeof res[0].patientid == "undefined") {

        $('#radiologyTable').dataTable();
    }

//since there is data populate our array newRowData with values
    else {
        for (var x = 0; x < res.length; x++) {

            var mpid = res[x].patientid;
            var mvid = res[x].visit_id;
            console.log("the visit id is " + mvid);
            var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[mpid]);
            console.log("the details here");
            console.log(resDetails.length);
            for (var x = 0; x < res.length; x++) {

                var mpid = res[x].patientid;
                var mvid = res[x].visit_id;
                console.log("the visit id is " + mvid);
                var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[mpid]);
                console.log("the details here");
                console.log(resDetails.length);
                var detailsRowA = [];
                var detailsRowAPlayer1 = {};
                for (var y = 0; y < resDetails.length; y++) {

                    var mypname = resDetails[y].productname;
                    var mypcode = resDetails[y].productcode;
                    var myamount = resDetails[y].amount;
                    detailsRowAPlayer1 = {pname: mypname, pcode: mypcode, amount: myamount};
                    detailsRowA.push(detailsRowAPlayer1);
                }


                var myrow = {pid: res[x].patientid, fname: res[x].fname, lname: res[x].lname, total: res[x].amount, action: res[x].visit_id, details: detailsRowA};
                newRowData.push(myrow);
            }

        }

        if (newRowData.length > 0) {
//intialisation part

            var iTableCounter = 1;
            var oTable;
            var oInnerTable;
            var detailsTableHtml;
            //initialisation


            // you would probably be using templates here
            detailsTableHtml = $("#radiologydetailsTable").html();
            //Insert a 'details' column to the table
            var nCloneTh = document.createElement('th');
            var nCloneTd = document.createElement('td');
            nCloneTd.innerHTML = '<img src="http://i.imgur.com/SD7Dz.png">';
            nCloneTd.className = "center";
            $('#radiologyTable thead tr').each(function () {

                this.insertBefore(nCloneTh, this.childNodes[0]);
            });
            $('#radiologyTable tbody tr').each(function () {
                this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
            });
            //initialisation part


            var oTable = $('#radiologyTable').dataTable({
                "bJQueryUI": true,
                "bDestroy": true,
                "aaData": newRowData,
                "bPaginate": true,
                "aoColumns": [
                    {
                        "mDataProp": null,
                        "sClass": "control center",
                        "sDefaultContent": '<img src="http://i.imgur.com/SD7Dz.png">'
                    },
                    {"mDataProp": "pid"},
                    {"mDataProp": "fname"},
                    {"mDataProp": "lname"},
                    {"mDataProp": "total"},
                    {"mDataProp": "action"}
                ],
                "oLanguage": {
                    "sInfo": "_TOTAL_ entries"
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    var myvid = aData['action'];
                    var mytotal = aData['total'];
                    var myTag = '<a href="#" class="btn btn-info" onclick="promptRadiologyPayment(\'' + myvid + '\',\'' + mytotal + '\')" width="100px">pay</a>';
                    $('td:eq(5)', nRow).html(myTag);
                    return nRow;
                },
                "aaSorting": [[1, 'asc']]
            });
            //Initialse DataTables, with no sorting on the 'details' column


            /* Add event listener for opening and closing details
             * Note that the indicator for showing which row is open is not controlled by DataTables,
             * rather it is done here
             */
            $j('#radiologyTable tbody td img').live('click', function () {
                var nTr = $(this).parents('tr')[0];
                var nTds = this;
                if (oTable.fnIsOpen(nTr)) {
                    /* This row is already open - close it */
                    this.src = "http://i.imgur.com/SD7Dz.png";
                    oTable.fnClose(nTr);
                }
                else {
                    /* Open this row */
                    var rowIndex = oTable.fnGetPosition($(nTds).closest('tr')[0]);
                    var detailsRowData = newRowData[rowIndex].details;
                    this.src = "http://i.imgur.com/d4ICC.png";
                    oTable.fnOpen(nTr, fnFormatDetails(iTableCounter, detailsTableHtml), 'details');
                    oInnerTable = $("#radiologyTable_" + iTableCounter).dataTable({
                        "bJQueryUI": true,
                        "bFilter": false,
                        "aaData": detailsRowData,
                        "bSort": true, // disables sorting
                        "aoColumns": [
                            {"mDataProp": "pname"},
                            {"mDataProp": "pcode"},
                            {"mDataProp": "amount"}

                        ],
                        "bPaginate": false,
                        "oLanguage": {
                            "sInfo": "_TOTAL_ entries"
                        }

                    });
                    iTableCounter = iTableCounter + 1;
                }
            });
            // datatable code here

        }
        else {

            console.log("my array is empty" + newRowData.length);
        }
// $("#exampleTable").dataTable().fnDestroy();

    }

}










function populatePatientRadiologyDetails(myvid){
    console.log("my visit id "+myvid);
    var myvar=parseInt(myvid);

    var res = alasql("select patientid,fname,lname,sum(amount) as amount,visit_id from radiologypayments where visit_id=? group by patientid,fname,lname,visit_id",[myvar]);
    for (var y = 0; y < res.length; y++) {

                    var patientid = res[y].patientid;
                    var fname = res[y].fname;
                    var lname = res[y].lname;
                    var amount = res[y].amount;
                    var vid = res[y].visit_id;
                    console.log("fname "+fname+" lname "+lname);

                    $("#patientname").html(fname+" "+lname);
                    // $("#patientid").html(pcode);
                    $("#patientid").html(patientid);
                    $("#visitnumber").html(vid);                    
                    $("#totalbill").html(amount);
                    
                    // $("#patientid").val(pcode);
                    $("#patientname").val(fname+" "+lname);
                    // $("#patientid").html(pcode);
                    $("#patientid").val(patientid);
                    $("#visitnumber").val(vid);                    
                    $("#totalbill").val(amount);
    }
}







function showRadiologyTabs(pid, myvid, mytotal) {

// '</td><td><a href="#" onclick="return displayPaymentPrompt(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\')">Pay</a></td><td></tr>'

    $("#divradiologypayment").css({display: "block"});
    $("#dispradiologydetails").css({display: "none"});

    // populatePatientDetails(myvid);
    populatePatientRadiologyDetails(myvid);
    populateRadiologyDetailsTable(pid,myvid);
  
    getPaymentModes(false);
    // getPatientHistoryPayments(pid);
}












function showRadiologyTabs(pid, myvid, mytotal) {

// '</td><td><a href="#" onclick="return displayPaymentPrompt(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\')">Pay</a></td><td></tr>'

    $("#divradiologypayment").css({display: "block"});
    $("#dispradiologydetails").css({display: "none"});

    // populatePatientDetails(myvid);
    populatePatientRadiologyDetails(myvid);
    populateRadiologyDetailsTable(pid,myvid);
  
    getPaymentModes(false);
    // getPatientHistoryPayments(pid);
}


//paying logic here on clicking pay bill


function populateRadiologyDetailsTable(pid,myvid){    

            
            var table = $('#radiologydetailsTable').DataTable();
            table.clear().draw(false);

            //get saved data from alasql

                var resDetails = alasql("select productname,productcode,amount from labpayments where patientid=?",[pid]);
                console.log("the details here");
                console.log(resDetails.length);
                var detailsRowA = [];
                var detailsRowAPlayer1 = {};
                for (var y = 0; y < resDetails.length; y++) {

                    var mypname = resDetails[y].productname;
                    var mypcode = resDetails[y].productcode;
                    var myamount = resDetails[y].amount;
                


                    table.row.add($(
                            '<tr><td>'
                            + mypname +
                            '</td><td>'
                            + mypcode +
                            '</td><td>'
                            + myamount +
                            '</td></tr>'
                            
                            )).draw(false);
                  
            }
        


}










function promptRadiologyPayment(vid, reqAmount) {


    $.gDialog.prompt("Radiology Fee: " + reqAmount, "", {
        title: "Enter Radiology Fee",
        animateIn: "rollIn",
        animateOut: "zoomOutDown",
        required: true,
        onSubmit: function (res) {

            if ($.isNumeric(res)) {

                if (Number(res) < Number(reqAmount)) {

                    swal("error", "Provide a value greater than or equal to " + reqAmount, "error");
                }
                else {
                    var balance = 0;
                    balance = Number(res) - Number(reqAmount);
//                    console.log(balance);
                    updateRadio(vid, res, balance, reqAmount);
                }

            }
            else {


                swal("error", "Provide Numeric Values Only", "error");
            }
        },
        onCancel: function (res) {

        }

    });
}








function updateRadio(vid, pamount, balance, reqamount) {

    var level = {"ispaid": "Y"};
    $.ajax({
        url: "" + api_url + "/p_radiology_referrals/" + vid,
        type: 'put',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(level),
        success: function (data) {

            var node = 8
            updateLabNodeId(vid, pamount, balance, reqamount, node);
            // getLabPayments();
            // getLabPayments();


        },
        error: function (error) {
            console.log(error);
        }
    });
}





function updateRadiologyNodeId(visitid, pamount, balance, reqamount, cnode) {

    var node = {"c_node_id": cnode};
    $.ajax({
        url: "" + api_url + "/p_visits/" + visitid,
        type: 'put',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(node),
        success: function (data) {

//            console.log("success updating node");
//            console.log(data);
//            console.log("success updating lab referral");
//            console.log(data);
            if (cnode == "4") {
                updateLabPaymentDetails(visitid, pamount, balance, reqamount);
            }else if(cnode == "8"){
                updateRadiologyPaymentDetails(visitid, pamount, balance, reqamount);
            }

            // swal("Success", "Amount Paid: " + pamount + " \nBalance: " + balance, "Success");
        },
        error: function (error) {
            console.log(error);
        }

    });
}







function updateRadiologyPaymentDetails(visitid, pamount, balance, reqamount) {

    var resDetails = alasql("select * from radiologypayments where visit_id=?",[visitid]);
    console.log("updaterdiologypayments called");
    console.log(resDetails);
    for (var x = 0; x < resDetails.length; x++) {



        var product_id = resDetails[x].productid;
        var patient_id = resDetails[x].patientid;
        var node_id = resDetails[x].c_node_id;
        var amount = resDetails[x].amount;

        swal("success", "Payment successfully acknowledged", "success");
        savePaymentDetails(patient_id, product_id, "2", visitid, node_id, amount, pamount, balance);
        pamount = pamount - amount;
    }


}