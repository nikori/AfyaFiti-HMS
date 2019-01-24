var API_URL = localStorage.getItem("API_URL");
//start registration module script

function loadRegistrationDataTable() {

    $("#regtable").DataTable();
}

function getRegistrationPayments() {
    var trData = "";
    $.ajax({
        url: "" + api_url + "/v_billings?filter[where][ispayed]=N&filter[where][c_node_id]=1",
        type: "get",
        data: {},
        success: function (data) {

            console.log("payments");
            console.log(data);
            var table = $('#regtable').DataTable();
            table.clear().draw(false);
            for (var x = 0; x < data.length; x++) {

                var visitno = data[x].visitno;
                var lname = data[x].lastname;
                var dno = data[x].documentno;
                var amnt = data[x].amount;
                var billid = data[x].b_billing_id;
                var visitdate = data[x].visitdate;
                var patientid = data[x].c_patient_id;
                // var patientcode = data[x].patient_code;
                var patientcode = "";
                console.log(data);
                console.log("date is " + visitdate);
                var myd = visitdate;
                var mydarr = myd.split("T");
                console.log(mydarr);
                var thedate = mydarr[0];
                // if (thedate == returnCurrDate()) {

                table.row.add($(
                        '<tr><td>'
                        + visitno +
                        '</td><td>'
                        + lname +
                        '</td><td>'
                        + dno +
                        '</td><td>'
                        + amnt +
                        '</td><td><a href="#" class="btn btn-info" onclick="return showTabs(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\',\'' + patientid + '\',\'' + patientcode + '\',\'' + visitdate + '\')">Proceed</a></td><td></tr>'
                        )).draw(false);
                // }
                // else {


                // }
            }
        },
        error: function () {

            console.log("error");
            
        }
    });
}

function showTabs(bilid, amnt, vno, lname, pid,pcode,vdate) {

// '</td><td><a href="#" onclick="return displayPaymentPrompt(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\')">Pay</a></td><td></tr>'

    $("#divregpayment").css({display: "block"});
    $("#dispregdetails").css({display: "none"});
    $("#patientname").html(lname);
    // $("#patientid").html(pcode);
    $("#visitnumber").html(vno);
    $("#pdate").html(vdate);
    $("#tdamount").html(amnt);
    $("#totalbill").html(amnt);
    $("#hiddenbillid").val(bilid);
    $("#patientname").val(lname);
    // $("#patientid").val(pcode);
    $("#visitnumber").val(vno);
    $("#pdate").val(vdate);
    $("#tdamount").val(amnt);
    $("#totalbill").val(amnt);
    console.log("billid is " + bilid);
    getPaymentModes(false);
    getPatientHistoryPayments(pid,"#reghistorytable","1");
    // getPatientHistoryPayments(pid);
}

function addPaymentMode(){

    $("#extrapaymentmode").css("display","block");
    getPaymentModes(true);

}

function removePaymentMode(){

    $("#extrapaymentmode").css("display","none");
    $("#amountpaidbill2").val("");


}

//function to paybill for registration start 
function payBill() {

    var secondmode="";
    var secondamount="";


      if ( $("#extrapaymentmode").css('display') == 'none' ){

        // element is hidden
        secondamount=0;
    }
    else{

        secondmode = $("#paymentmodes2").val();
        secondamount= $("#amountpaidbill2").val();

    }

    var myamnt = $("#amountpaidbill").val();
    var passedamnt = $("#tdamount").val();
    var mybillid = $("#hiddenbillid").val();
    var vno = $("#visitnumber").val();
    var lname = $("#lname").val();
    var paymode = $("#paymentmodes").val();
    var usercomments=$("#usercomments").val();
    console.log("payment mode is " + paymode);
    console.log("hidden billid is " + mybillid);
    console.log("amount paid is " + myamnt);

    if(isEmpty(paymode)){
        console.log("specify a payment mode to proceed");
        swal("error", "Specify a payment mode to proceed", "error");
    }
    
    else if(isEmpty(myamnt)){

        swal("error", "Specify amount to pay", "error");

    }

    else if(isEmpty(secondmode) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second mode of payment", "error");

    }

    else if(isEmpty(secondamount) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second amount", "error");

    }
    else if(paymode.toUpperCase()=="1" && isEmpty(usercomments)){

        swal("error","specify mpesa details in the comment section","error");
    }

    else{

        displayPaymentPrompt(mybillid, passedamnt, myamnt, vno, lname, paymode,secondmode,secondamount);


    }
}


function displayPaymentPrompt(billid, amount, enteredamnt, visitno, lastname, paymode,secondmode,secondamount) {
    console.log("passed amount " + amount);
    console.log("entered amount " + enteredamnt);
    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    console.log(datetime);
    var product = {"ispayed": "Y", "updated": datetime, "updatedby": userid};
    if ($.isNumeric(enteredamnt)) {

        if ((Number(enteredamnt) + Number(secondamount)) != Number(amount)) {

            swal("error", "Provide a value equal to " + amount, "error");
        }
        else {

            var balance = 0;
            balance = (Number(enteredamnt)+Number(secondamount))- Number(amount)
            console.log(balance);
            $.ajax({
                url: "" + api_url + "/b_billings/" + billid,
                type: 'PUT',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(product),
                success: function (data) {
                    console.log(data);

                        $("#amountpaidbill").val("");
  
                        $("#paymentmodes").val("");

                        $("#usercomments").val("");
                    getPatientId(billid, enteredamnt, amount, balance, paymode);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

    }
    else {


        swal("error", "Provide Numeric Values Only", "error");
    }




}



function getPatientId(billingid, paidamount, amount, balance, paymode) {

    $.ajax({
        url: "" + api_url + "/b_billings?filter[where][b_billing_id]=" + billingid,
        type: 'get',
        data: {},
        success: function (data) {
            console.log("patient data");
            console.log("visit id is");
            console.log(data);
            console.log("new")
            console.log(data);
            console.log("length");
            for (var y = 0; y < data.length; y++) {
                var pvisit = data[y].p_visit_id;
                var patientid = data[y].c_patient_id;
                console.log("visit id is");
                console.log(pvisit);
                updateLevel(pvisit, patientid, paidamount, amount, balance, paymode);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}


function updateLevel(visit_id, patientid, paidamount, amount, balance, paymode) {

    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    var level = {"c_node_id": "2", "updated": datetime, "updatedby": userid};
    $.ajax({
        url: "" + api_url + "p_visits/" + visit_id,
        type: 'put',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(level),
        success: function (data) {

            console.log("success updating level");
            // console.log(data);

            swal("success", "Payment successfully acknowledged", "success");
            savePaymentDetails(patientid, "12", paymode, visit_id, "1", amount, paidamount, balance)

        },
        error: function (error) {
            console.log(error);
        }
    });
}


function getPatientHistoryDate(nid, pid) {

    var date = "";
    $.ajax({
        url: "" + api_url + "b_financepayments?filter[where][c_node_id]=" + nid + "&filter[where][c_patient_id]=" + pid,
        type: "get",
        data: {},
        success: function (data) {

            for (var x = 0; x < data.length; x++) {

                date = data[x].date_paid;
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function getPatientHistoryPayments(pid,divelement,nodeid) {
    var trData = "";
    console.log("the patient id is " + pid);
    $.ajax({
        url: "" + api_url + "v_historical_payments?filter[where][c_node_id]="+nodeid+"&filter[where][c_patient_id]=" + pid,
        type: "get",
        data: {},
        success: function (data) {

            console.log("payments");
            console.log(data);
            var table = $(divelement).DataTable();
            table.clear().draw(false);
            for (var x = 0; x < data.length; x++) {

                var patientname = data[x].patientname;
                var paymode = data[x].paymode;
                var nodelevel = data[x].nodename;
                var patientcode = data[x].patientcode;
                var visitno = data[x].visitno;
                var productname = data[x].productname;
                var balance = data[x].balance;
                var amountpaid = data[x].amount_paid;
                var amounttopay = data[x].amount_to_be_paid;
                var datepaid = data[x].date_paid;

                table.row.add($(
                        '<tr><td>'
                        + patientname +
                        '</td><td>'
                        + patientcode +
                        '</td><td>'
                        + visitno +
                        '</td><td>'
                        + productname +
                        '</td><td>'
                        + amounttopay +
                        '</td><td>'
                        + amountpaid +
                        '</td><td>'
                        + balance+
                        '</td><td>'
                        + paymode +
                        '</td><td>'
                        + datepaid +
                        '</td></tr>'
                        )).draw(false);
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

//end registration module script



//start pharmacy module script

function loadPharmacyDataTable() {

    $("#mregtable").DataTable();
}

function getPharmacyPayments() {

    // populate data into our local alasql database for easy access
    alasql("DROP TABLE IF EXISTS pharmacydata");
    alasql("CREATE TABLE pharmacydata (visitno text, productname text,dosage text,dqty text,presdate text,unitprice text,productid text,prescid text,visitid text,patientid text,patientname text)");
    // populate data into our local al

    var tnrData = "";
    $.ajax({
        url: "" + api_url + "/v_prescriptions?filter[where][ispaid]=N&filter[where][c_node_id]=6",
        type: "get",
        data: {},
        success: function (data) {
            console.log("pharmacy data");

            console.log(data);

            var table = $('#mregtable').DataTable();
            table.clear().draw(false);

            for (var x = 0; x < data.length; x++) {

                var visitno = data[x].visitno;
                var patientname = data[x].patientname;
                var productname = data[x].productname;
                var thedosage = data[x].drug_dosage;
                var dqty = data[x].dispenseqty;
                var onhandqty = data[x].onhandqty;
                var prescriptiondate = data[x].created;
                var unitprice = data[x].unitprice;
                var productid = data[x].m_product_id;
                var prescid = data[x].prescriptionid;
                var amnt = Number(dqty) * Number(unitprice);
                var myvisitid = data[x].visitid;
                var patient_id = data[x].patientid;
                var names=data[x].patientname;
                var visitdate=data[x].created;




                alasql("INSERT INTO pharmacydata(visitno,productname,dosage,dqty,presdate,unitprice,productid,prescid,visitid,patientid,patientname) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[visitno,productname,thedosage,dqty,prescriptiondate,unitprice,productid,prescid,myvisitid,patient_id,patientname]);

                console.log(data);
                console.log("date is " + prescriptiondate);
                var myd = prescriptiondate;
                var mydarr = myd.split("T");
                console.log(mydarr);
                
            }

            var res=alasql("select * from pharmacydata group by visitno,patientname,visitid,patientid");
            console.log("db data");
            console.log(res);

            if(isEmpty(res[0].visitno)){


            }
            else{


                    for (var t = 0; t < res.length; t++) {

                    var visitno = res[t].visitno;
                    var patientname = res[t].patientname;
                    // var date = res[t].presdate;
                    var visitid=res[t].visitid;
                    var pid=res[t].patientid;
                                   

                     table.row.add($(
                            '<tr><td>'
                            + visitno +
                            '</td><td>'
                            + patientname +
                                                   
                            '</td><td><a href="#" class="btn btn-info" onclick="return showTabsPharmacy(\'' + visitid + '\',\'' + patientname + '\',\'' + visitno + '\',\'' + pid + '\')">Proceed</a></td><td></tr>'
                            
                            )).draw(false);


                }
                

            }

            

           

            // '</td><td><a href="#" class="btn btn-info" onclick="return showTabsPharmacy(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\',\'' + patientid + '\',\'' + patientcode + '\',\'' + visitdate + '\')">Proceed</a></td><td></tr>'
            // '</td><td><a href="#" class="btn btn-info" onclick="return displayPaymentPromptPharmacy(\'' + productid + '\',\'' + unitprice + '\',\'' + dqty + '\',\'' + onhandqty + '\',\'' + prescid + '\',\'' + myvisitid + '\',\'' + patient_id + '\')">Pay</a></td><td></tr>'

        },
        error: function () {
            console.log("error");
        }
    });
}





function showTabsPharmacy(visitid,patientname,visitno,pid) {
    console.log("visitid is "+visitid);

// '</td><td><a href="#" onclick="return displayPaymentPrompt(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\')">Pay</a></td><td></tr>'

    $("#divpharmacypayment").css({display: "block"});
    $("#disppharmacydetails").css({display: "none"});
    $("#patientname").html(patientname);    
    $("#visitnumber").html(visitno);
    // $("#pdate").html(date);

    $("#patientname").val(patientname);    
    $("#visitnumber").val(visitno);
    // $("#pdate").val(date);
    
    // $("#totalbill").html(amnt);
    // $("#totalbill").val(amnt);

    getPatientHistoryPayments(pid,"#pharmacyhistorytable","6");
    populatePharmacyDetailsTable(visitid);

    
    // if(unitprice=="null"){
    //     $("#unitprice").html("Not Set");

    // }
    // else{
    //     $("#unitprice").html(unitprice);
    // }

    
    // $("#dqty").html(dqty);

    // if(onhandqty=="null"){

    //     $("#onhandqty").html("Not Set");

    // }
    // else{

    //     $("#onhandqty").html(onhandqty);
    // }
    
    getPaymentModes(false);
   
}






function populatePharmacyDetailsTable(myvid){  


           console.log("details table visit id "+myvid);
           var myvar=parseInt(myvid);
            
            var table = $('#pharmacyDetailsTable').DataTable();
            table.clear().draw(false);
            var total=0;

            //get saved data from alasql

                // alasql("CREATE TABLE pharmacydata (visitno text, productname text,dosage text,dqty text,presdate text,unitprice text,productid text,prescid text,visitid text,patientid text,patientname text)");
                // <th>Product Name</th>
                //                                                     <th>Dodage</th>
                //                                                     <th>Dispense Quantity</th>
                //                                                     <th>Unit Price</th>
                //                                                     <th>Amount</th>

                var resDetails = alasql("select productname,dqty,dosage,unitprice from pharmacydata where visitid=?",[myvid]);
                console.log("pharmacy table data");
                console.log(resDetails);
                
                for (var y = 0; y < resDetails.length; y++) {

                    var pname = resDetails[y].productname;
                    var dqty = resDetails[y].dqty;
                    var dosage = resDetails[y].dosage;
                    var unitprice = resDetails[y].unitprice;
                    var myunit="";
                    if(isEmpty(unitprice)){
                        myunit="0";
                    }
                    else{
                        myunit=unitprice;
                    }
                    var amount =dqty*myunit;
                    total=total+amount;
                


                    table.row.add($(
                            '<tr><td>'
                            + pname +
                            '</td><td>'
                            + dosage +
                            '</td><td>'
                            + dqty +
                            '</td><td>'
                            + myunit +
                            '</td><td>'
                            + amount +
                            '</td></tr>'
                            
                            )).draw(false);
                  
            }

            $("#totalbill").html(total);
            $("#totalbill").val(total);
        


}





//function to paybill for registration start 
function payPharmacyBill() {

    var secondmode="";
    var secondamount="";


      if ( $("#extrapaymentmode").css('display') == 'none' ){

        // element is hidden
        secondamount=0;
    }
    else{

        secondmode = $("#paymentmodes2").val();
        secondamount= $("#amountpaidpharmacybill2").val();

    }

    var amountpaid = $("#amountpaidpharmacybill").val();
    var amounttopay = $("#totalbill").val();
    // var mybillid = $("#hiddenbillid").val();
    
    var paymode = $("#paymentmodes").val();
    var usercomments=$("#usercomments").val();

    var visitnumber = $("#visitnumber").val();
    
    console.log("payment mode is " + paymode);
    // console.log("hidden billid is " + mybillid);
    // console.log("amount paid is " + myamnt);

    if(isEmpty(paymode)){
        console.log("specify a payment mode to proceed");
        swal("error", "Specify a payment mode to proceed", "error");
    }
    
    else if(isEmpty(amountpaid)){

        swal("error", "Specify amount to pay", "error");

    }

    else if(isEmpty(secondmode) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second mode of payment", "error");

    }

    else if(isEmpty(secondamount) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second amount", "error");

    }
    else if(paymode.toUpperCase()=="1" && isEmpty(usercomments)){

        swal("error","specify mpesa details in the comment section","error");
    }

    else{

    
        displayPaymentPromptPharmacy(visitnumber,amountpaid,amounttopay,paymode,secondmode,secondamount);


    }
}


function displayPaymentPromptPharmacy(visitnumber,amountpaid,amounttopay,paymode,secondmode,secondamount){


    // logic here

    console.log("passed amount " + amounttopay);
    console.log("entered amount " + amountpaid);
    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    console.log(datetime);
    var product = {"ispaid": "Y", "updated": datetime, "updatedby": userid};
    var node = {"c_node_id": "7", "updated": datetime, "updatedby": userid};
    if ($.isNumeric(amountpaid)) {

        if ((Number(amountpaid) + Number(secondamount)) != Number(amounttopay)) {

            swal("error", "Provide a value equal to " + amounttopay, "error");
        }
        else {
                    var balance = 0;

                    var resDetails2 = alasql("select visitid from pharmacydata where visitno=? limit 1",[visitnumber]);
                    console.log("visiti id data");
                    console.log(resDetails2);
                
                
                    for (var y = 0; y < resDetails2.length; y++) {
                        var vid=resDetails2[y].visitid;

                        updateVisitPharmacy(vid);


                    }
                    // balance = ((Number(enteredamnt)+Number(secondamount))- (Number(unitprice)*Number(dqty)));
                    balance = ((Number(amountpaid)+Number(secondamount))- (Number(amounttopay)));
                    console.log(balance);

                    // get userdetails from local db

                var resDetails = alasql("select * from pharmacydata where visitno=?",[visitnumber]);
                console.log("pharmacy table data");
                console.log(resDetails);
                
                
                for (var y = 0; y < resDetails.length; y++) {

                    var vno=resDetails[y].visitno;
                    var pname=resDetails[y].productname;
                    var dosage=resDetails[y].dosage;
                    var dqty=resDetails[y].dqty;
                    var presdate=resDetails[y].presdate;
                    var unitprice=resDetails[y].unitprice;
                    var productid=resDetails[y].productid;
                    var prescid=resDetails[y].prescid;
                    var visitid=resDetails[y].visitid;
                    var patientid=resDetails[y].patientid;
                    var patientname=resDetails[y].patientname;



                    //save individual drug data into remote db

                    $.ajax({
                        url: "" + api_url + "/p_prescriptions/" + prescid,
                        type: 'PUT',
                        async:false,
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(product),
                        success: function (data) {
                      
                                

                                    var total=(Number(amountpaid) + Number(secondamount));

                                    if (isNaN(total)) {

                                        swal("success", "Payment successfully acknowledged", "success");

                                        savePaymentDetailsPharmacy(patientid, productid, paymode, visitid, "6", "0", total, total);
                                    }
                                    else {

                                        swal("success", "Payment successfully acknowledged", "success");

                                        savePaymentDetailsPharmacy(patientid, productid, paymode, visitid, "6", total, total, balance);
                                    }
//                                   
                                
                        },

                        error: function (error) {
                            console.log(error);
                        }

                    });


                    //save individual data into remote db


                }
                    //get userdetails from local db


                   
                }

    }
    else {


        swal("error", "Provide Numeric Values Only", "error");
    }



    // logic here


}



function updateVisitPharmacy(visitid){



    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    console.log(datetime);


    var node = {"c_node_id": "7", "updated": datetime, "updatedby": userid};

    $.ajax({
            url: "" + api_url + "/p_visits/" + visitid,
            type: 'put',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(node),
            success: function (data) {

               console.log("success updating prescription");
            },
            error: function (error) {
                console.log(error);
            }

    });




}


// function displayPaymentPromptPharmacy(productid, unitprice, dqty, onhandqty, prescid, visitid, patientid, amount, enteredamnt, visitno, lastname, paymode,secondmode,secondamount) {
//     console.log("passed amount " + amount);
//     console.log("entered amount " + enteredamnt);
//     var userid = $.session.get('user_id');
//     var currentdate = new Date();
//     var formatedMonth = formatNumber((currentdate.getMonth() + 1));
//     var formatedDate = formatNumber(currentdate.getDate());
//     var datetime = currentdate.getFullYear() + "-"

//             + formatedMonth + "-"
//             + formatedDate + ":"
//             + currentdate.getHours() + ":"
//             + currentdate.getMinutes() + ":"
//             + currentdate.getSeconds();
//     console.log(userid);
//     console.log(datetime);
//     var product = {"ispaid": "Y", "updated": datetime, "updatedby": userid};
//     var node = {"c_node_id": "7", "updated": datetime, "updatedby": userid};
//     if ($.isNumeric(enteredamnt)) {

//         if ((Number(enteredamnt) + Number(secondamount)) != Number(amount)) {

//             swal("error", "Provide a value equal to " + amount, "error");
//         }
//         else {
//                     var balance = 0;
//                     // balance = ((Number(enteredamnt)+Number(secondamount))- (Number(unitprice)*Number(dqty)));
//                     balance = ((Number(enteredamnt)+Number(secondamount))- (Number(amount)));
//                     console.log(balance);

//                     var resDetails = alasql("select * from pharmacydata where visitid=?",[myvid]);
                
                
//                     for (var y = 0; y < resDetails.length; y++) {



//                     }

//                     $.ajax({
//                         url: "" + api_url + "/p_prescriptions/" + prescid,
//                         type: 'PUT',
//                         contentType: "application/json;charset=utf-8",
//                         data: JSON.stringify(product),
//                         success: function (data) {
                      
                                

//                                     var total=(Number(enteredamnt) + Number(secondamount));

//                                     if (isNaN(total)) {

//                                         swal("success", "Payment successfully acknowledged", "success");

//                                         savePaymentDetailsPharmacy(patientid, productid, paymode, visitid, "6", "0", amount, amount);
//                                     }
//                                     else {

//                                         swal("success", "Payment successfully acknowledged", "success");

//                                         savePaymentDetailsPharmacy(patientid, productid, paymode, visitid, "6", total, amount, balance);
//                                     }
// //                                   
                                
//                         },

//                         error: function (error) {
//                             console.log(error);
//                         }

//                     });
//                 }

//     }
//     else {


//         swal("error", "Provide Numeric Values Only", "error");
//     }




// }



function loadDataTableLab() {

    $("#exampleTable").DataTable();
}

function getLabPayments() {
    var trData = "";
    $.ajax({
        url: "" + api_url + "/v_labpayments?filter[where][ispaid]=false",
        type: "get",
        data: {},
        success: function (data) {

            alasql("DROP TABLE IF EXISTS labpayments");
            alasql("CREATE TABLE labpayments(patientid text,fname text,lname text,productname text,productcode text,productid text,amount integer,c_node_id text,visit_id text)");
            alasql("DELETE FROM labpayments");
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
                alasql("INSERT INTO labpayments VALUES ('" + patientId + "','" + fname + "','" + lname + "','" + productName + "','" + productCode + "','" + productId + "'," + amount + "," + cnodeid + "," + visitid + ")");
                console.log("table created");
                console.log(data);
            }

            loadNewLabTable();
            // var res=alasql("select patientid,fname,lname,productname,productcode,productid,sum(amount) as amount,c_node_id from labpayments group by patientid,productname,productcode,productid,fname,lname,c_node_id");
            // var res=alasql("select patientid,fname,lname,sum(amount) as amount from labpayments group by patientid,fname,lname");

        },
        error: function (data) {
            console.log("error");
            console.log(data);
        }
    });
}

//end lab module script

//start radiology module script




//end radiology module script


//new lab module script


function fnFormatDetails(table_id, html) {
    var sOut = "<table id=\"exampleTable_" + table_id + "\">";
    sOut += html;
    sOut += "</table>";
    return sOut;
}




// var rowA = { fname: "Zerg", lname: "2014", total: "3", details: detailsRowA};
// var rowB = { fname: "Protoss", lname: "2014", total: "1", details: detailsRowB};
// var rowC = { fname: "Terran", lname: "2014", total: "1", details: detailsRowC};

// var newRowData = [rowA, rowB, rowC] ;

////////////////////////////////////////////////////////////



//Run On HTML Build

function loadNewLabTable() {


//intialisation

    // $('#exampleTable').DataTable().destroy();
    var table = $('#exampleTable').DataTable();
    table.clear().draw(false);
    var newRowData = [];
    var res = alasql("select patientid,fname,lname,sum(amount) as amount,visit_id from labpayments group by patientid,fname,lname,visit_id");
    console.log(res);
    console.log(typeof res);
    if (typeof res[0].patientid == "undefined") {



        $('#exampleTable').dataTable();
    }

//since there is data populate our array newRowData with values
    else {


        for (var x = 0; x < res.length; x++) {

            var mpid = res[x].patientid;
            var newmpid=parseInt(mpid);
            var mvid = res[x].visit_id;
            console.log("the visit id is " + mvid);
            var resDetails = alasql("select productname,productcode,amount from labpayments where patientid=?",[newmpid]);
            console.log("the details here");
            console.log(resDetails.length);
            for (var x = 0; x < res.length; x++) {

                var mpid = res[x].patientid;
                var newmpid=parseInt(mpid);
                var mvid = res[x].visit_id;
                console.log("the visit id is " + mvid);
                var resDetails = alasql("select productname,productcode,amount from labpayments where patientid=?",[newmpid]);
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
            detailsTableHtml = $("#detailsTable").html();
            //Insert a 'details' column to the table
            var nCloneTh = document.createElement('th');
            var nCloneTd = document.createElement('td');
            nCloneTd.innerHTML = '';
            nCloneTd.className = "center";
            $('#exampleTable thead tr').each(function () {

                this.insertBefore(nCloneTh, this.childNodes[0]);
            });
            $('#exampleTable tbody tr').each(function () {
                this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
            });
            //initialisation part


            var oTable = $('#exampleTable').dataTable({
                "bJQueryUI": true,
                "bDestroy": true,
                "aaData": newRowData,
                "bPaginate": true,
                "aoColumns": [
                    {
                        "mDataProp": null,
                        "sClass": "control center",
                        "sDefaultContent": ''
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
                    var pid=aData['pid'];
                    var myTag = '<a href="#" class="btn btn-info" onclick="showLabTabs(\'' + pid + '\',\'' + myvid + '\',\'' + mytotal + '\')" width="100px">Proceed</a>';
                    $('td:eq(5)', nRow).html(myTag);
                    return nRow;
                },
                "aaSorting": [[1, 'asc']]
            });
            
        }
        else {

            console.log("my array is empty" + newRowData.length);
        }
// $("#exampleTable").dataTable().fnDestroy();

    }

}




function populatePatientDetails(myvid){
    console.log("my visit id "+myvid);
    var myvar=parseInt(myvid);

    var res = alasql("select patientid,fname,lname,sum(amount) as amount,visit_id from labpayments where visit_id=? group by patientid,fname,lname,visit_id",[myvar]);
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




function showLabTabs(pid, myvid, mytotal) {

// '</td><td><a href="#" onclick="return displayPaymentPrompt(\'' + billid + '\',\'' + amnt + '\',\'' + visitno + '\',\'' + lname + '\')">Pay</a></td><td></tr>'

    $("#divlabpayment").css({display: "block"});
    $("#displabdetails").css({display: "none"});

    populatePatientDetails(myvid);
    populatelabDetailsTable(pid,myvid);
  
    getPaymentModes(false);
    // getPatientHistoryPayments(pid);
    getPatientHistoryPayments(pid,"#labhistorytable","4");
}



//paying logic here on clicking pay bill


//function to paybill for registration start 
function payLabBill() {

    var secondmode="";
    var secondamount="";


      if ( $("#extrapaymentmode").css('display') == 'none' ){

        // element is hidden
        secondamount=0;
    }
    else{

        secondmode = $("#paymentmodes2").val();
        secondamount= $("#amountpaidbill2").val();

    }

    // $("#patientname").val(fname+" "+lname);
    //                 // $("#patientid").html(pcode);
    //                 $("#patientid").val(patientid);
    //                 $("#visitnumber").val(vid);                    
    //                 $("#totalbill").val(amount);

    var myamnt = $("#amountpaidbill").val();
    var passedamnt = $("#totalbill").val();
    // var mybillid = $("#hiddenbillid").val();
    // var vno = $("#visitnumber").val();
    // var lname = $("#lname").val();
    var paymode = $("#paymentmodes").val();
    var usercomments=$("#usercomments").val();
    console.log("payment mode is " + paymode);
    // console.log("hidden billid is " + mybillid);
    console.log("amount paid is " + myamnt);

    if(isEmpty(paymode)){
        console.log("specify a payment mode to proceed");
        swal("error", "Specify a payment mode to proceed", "error");
    }
    
    else if(isEmpty(myamnt)){

        swal("error", "Specify amount to pay", "error");

    }

    else if(isEmpty(secondmode) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second mode of payment", "error");

    }

    else if(isEmpty(secondamount) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second amount", "error");

    }
    else if(paymode.toUpperCase()=="1" && isEmpty(usercomments)){

        swal("error","specify mpesa details in the comment section","error");
    }

    else{

        var vid=$("#visitnumber").val(); 
        var lname = $("#patientname").val();
        // displayPaymentPrompt(mybillid, passedamnt, myamnt, vno, lname, paymode,secondmode,secondamount);
        displayLabPaymentPrompt(vid,passedamnt, myamnt,lname, paymode,secondmode,secondamount)


    }
}



function displayLabPaymentPrompt(vid,amount, enteredamnt,lastname, paymode,secondmode,secondamount) {
    console.log("passed amount " + amount);
    console.log("entered amount " + enteredamnt);
    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    console.log(datetime);
    // var product = {"ispayed": "Y", "updated": datetime, "updatedby": userid};
    if ($.isNumeric(enteredamnt)) {

        if ((Number(enteredamnt) + Number(secondamount)) != Number(amount)) {

            swal("error", "Provide a value equal to " + amount, "error");
        }
        else {

            var balance = 0;
            var allamount=Number(enteredamnt)+Number(secondamount)
            balance = (Number(enteredamnt)+Number(secondamount))- Number(amount)
            console.log(balance);

            updateLab(vid, allamount, balance, amount,paymode);
            
        }

    }
    else {


        swal("error", "Provide Numeric Values Only", "error");
    }




}




//paying logic here on clicking pay bill


function populatelabDetailsTable(pid,myvid){  


           console.log("details table visit id "+myvid);
           var myvar=parseInt(myvid);
            
            var table = $('#detailsTable').DataTable();
            table.clear().draw(false);

            //get saved data from alasql

                var resDetails = alasql("select productname,productcode,amount from labpayments where visit_id=?",[myvar]);
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




function promptReferralPayment(pid,vid, reqAmount) {


    $.gDialog.prompt("Lab Fee: " + reqAmount+"patient id "+pid, "", {
        title: "Enter Lab Fee",
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
                    console.log(balance);
                    var paymode="2";
                    updateLab(vid, res, balance, reqAmount,paymode);
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



function updateLab(vid, pamount, balance, reqamount,paymode) {

    var level = {"ispaid": "true"};
    $.ajax({
        url: "" + api_url + "/p_lab_referrals/" + vid,
        type: 'put',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(level),
        success: function (data) {


            console.log("**********my visit id*********" + vid);
            var cnode = 5;
            updateLabNodeId(vid, pamount, balance, reqamount, cnode,paymode);
            // getLabPayments();
            // getLabPayments();


        },
        error: function (error) {
            console.log(error);
        }
    });
}



function updateLabNodeId(visitid, pamount, balance, reqamount, cnode,paymode) {

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
          
                updateLabPaymentDetails(visitid, pamount, balance, reqamount,paymode);
            

            // swal("Success", "Amount Paid: " + pamount + " \nBalance: " + balance, "Success");
        },
        error: function (error) {
            console.log(error);
        }

    });
}




//start of function to update lab payments per product id

function updateLabPaymentDetails(visitid, pamount, balance, reqamount,paymode) {
    var myvar=parseInt(visitid);

    var resDetails = alasql("select * from labpayments where visit_id=?",[myvar]);
    console.log("updatelabpayments called");
    console.log(resDetails);

    swal("success", "Payment successfully acknowledged", "success");

    for (var x = 0; x < resDetails.length; x++) {



        var product_id = resDetails[x].productid;
        var patient_id = resDetails[x].patientid;
        var node_id = resDetails[x].c_node_id;
        var amount = resDetails[x].amount;
        savePaymentDetailsLab(patient_id, product_id, paymode, visitid, node_id, amount, pamount, balance);
        pamount = pamount - amount;
    }


}



//end of function to update lab payments per product id

//new lab module script



//start of radiology module script




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
            console.log("called radiology payments");
            console.log(data);

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



//Run On HTML Build

function loadNewRadiologyTable() {


//intialisation

    // $('#radiologyTable').DataTable().destroy();
    var table = $('#radiologyTable').DataTable();
    table.clear().draw(false);
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
            var newmpid=parseInt(mpid);
            var mvid = res[x].visit_id;
            console.log("the visit id is " + mvid);
            var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[newmpid]);
            console.log("the details here");
            console.log(resDetails.length);
            for (var x = 0; x < res.length; x++) {

                var mpid = res[x].patientid;
                var newmpid=parseInt(mpid);
                var mvid = res[x].visit_id;
                console.log("the visit id is " + mvid);
                var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[newmpid]);
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
            nCloneTd.innerHTML = '';
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
                        "sDefaultContent": ''
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
                    var pid=aData['pid'];
                    var myTag = '<a href="#" class="btn btn-info" onclick="showRadiologyTabs(\'' + pid + '\',\'' + myvid + '\',\'' + mytotal + '\')" width="100px">Proceed</a>';
                    $('td:eq(5)', nRow).html(myTag);
                    return nRow;
                },
                "aaSorting": [[1, 'asc']]
            });
            
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
    getPatientHistoryPayments(pid,"#radiologyhistorytable","17");
}


//paying logic here on clicking pay bill


function populateRadiologyDetailsTable(pid,myvid){    

            
            var table = $('#radiologydetailsTable').DataTable();
            table.clear().draw(false);

            //get saved data from alasql

                var resDetails = alasql("select productname,productcode,amount from radiologypayments where patientid=?",[pid]);
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







//function to paybill for registration start 
function payRadiologyBill() {

    var secondmode="";
    var secondamount="";


      if ( $("#extrapaymentmode").css('display') == 'none' ){

        // element is hidden
        secondamount=0;
    }
    else{

        secondmode = $("#paymentmodes2").val();
        secondamount= $("#amountpaidbill2").val();

    }

    // $("#patientname").val(fname+" "+lname);
    //                 // $("#patientid").html(pcode);
    //                 $("#patientid").val(patientid);
    //                 $("#visitnumber").val(vid);                    
    //                 $("#totalbill").val(amount);

    var myamnt = $("#amountpaidbill").val();
    var passedamnt = $("#totalbill").val();
    // var mybillid = $("#hiddenbillid").val();
    // var vno = $("#visitnumber").val();
    // var lname = $("#lname").val();
    var paymode = $("#paymentmodes").val();
    var usercomments=$("#usercomments").val();
    console.log("payment mode is " + paymode);
    // console.log("hidden billid is " + mybillid);
    console.log("amount paid is " + myamnt);

    if(isEmpty(paymode)){
        console.log("specify a payment mode to proceed");
        swal("error", "Specify a payment mode to proceed", "error");
    }
    
    else if(isEmpty(myamnt)){

        swal("error", "Specify amount to pay", "error");

    }

    else if(isEmpty(secondmode) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second mode of payment", "error");

    }

    else if(isEmpty(secondamount) && ($("#extrapaymentmode").css('display') == 'block') ){

        swal("error", "Specify the second amount", "error");

    }
    else if(paymode.toUpperCase()=="1" && isEmpty(usercomments)){

        swal("error","specify mpesa details in the comment section","error");
    }

    else{

        var vid=$("#visitnumber").val(); 
        var lname = $("#patientname").val();
        // displayPaymentPrompt(mybillid, passedamnt, myamnt, vno, lname, paymode,secondmode,secondamount);
        displayRadiologyPaymentPrompt(vid,passedamnt, myamnt,lname, paymode,secondmode,secondamount)


    }
}



function displayRadiologyPaymentPrompt(vid,amount, enteredamnt,lastname, paymode,secondmode,secondamount) {

    console.log("passed amount " + amount);
    console.log("entered amount " + enteredamnt);
    var userid = $.session.get('user_id');
    var currentdate = new Date();
    var formatedMonth = formatNumber((currentdate.getMonth() + 1));
    var formatedDate = formatNumber(currentdate.getDate());
    var datetime = currentdate.getFullYear() + "-"

            + formatedMonth + "-"
            + formatedDate + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    console.log(userid);
    console.log(datetime);
    // var product = {"ispayed": "Y", "updated": datetime, "updatedby": userid};
    if ($.isNumeric(enteredamnt)) {

        if ((Number(enteredamnt) + Number(secondamount)) != Number(amount)) {

            swal("error", "Provide a value equal to " + amount, "error");
        }
        else {

            var balance = 0;
            var allamount=Number(enteredamnt)+Number(secondamount)
            balance = (Number(enteredamnt)+Number(secondamount))- Number(amount)
            console.log(balance);

            updateRadiology(vid, allamount, balance, amount,paymode);
            
        }

    }
    else {


        swal("error", "Provide Numeric Values Only", "error");
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








function updateRadiology(vid, pamount, balance, reqamount,paymode) {

    console.log("updating radiology called");
    var level = {"ispaid": "Y"};
    $.ajax({
        url: "" + api_url + "/p_radiology_referrals/" + vid,
        type: 'put',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(level),
        success: function (data) {

            var node = "16";
            updateRadiologyNodeId(vid, pamount, balance, reqamount, node,paymode);
            // getLabPayments();
            // getLabPayments();


        },
        error: function (error) {
            console.log(error);
        }
    });

}





function updateRadiologyNodeId(visitid, pamount, balance, reqamount, cnode,paymode) {

    var node = {"c_node_id": cnode};
    console.log("updating node called");
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
          
                updateRadiologyPaymentDetails(visitid, pamount, balance, reqamount,paymode);
            

            // swal("Success", "Amount Paid: " + pamount + " \nBalance: " + balance, "Success");
        },
        error: function (error) {
            console.log(error);
        }

    });
}







function updateRadiologyPaymentDetails(visitid, pamount, balance, reqamount,paymode) {

    var myvar=parseInt(visitid);
    var resDetails = alasql("select * from radiologypayments where visit_id=?",[myvar]);
    console.log("updaterdiologypayments called");
    console.log("visit id "+visitid);
    console.log("paid amount "+pamount);
    console.log("required amount "+reqamount);
    console.log(resDetails);
    for (var x = 0; x < resDetails.length; x++) {



        var product_id = resDetails[x].productid;
        var patient_id = resDetails[x].patientid;
        var node_id = resDetails[x].c_node_id;
        var amount = resDetails[x].amount;

        swal("success", "Payment successfully acknowledged", "success");
        savePaymentDetailsRadiology(patient_id, product_id,paymode, visitid, node_id, amount, pamount, balance);
        pamount = pamount - amount;
    }


}





//end of radiology module script




function loadConsultationTable1() {

    $("#mpattable").DataTable();
}


// function dialogAlert(mymessage, mytitle) {

//     $.gDialog.alert(mymessage, {
//         title: mytitle,
//         animateIn: "bounceIn",
//         animateOut: "flipOutY"
//     });

// }

function regPrint() {
    console.log("am printing");
    var docDefinition = {content: 'registration pinting test'};
    pdfMake.createPdf(docDefinition).download();
    pdfMake.createPdf(docDefinition).open();
}


function printReceipt() {

    $("#myprintdiv").css({"visibility": "visible"});
    $("#myprintdiv").print({
        globalStyles: true,
        mediaPrint: false,
        stylesheet: null,
        noPrintSelector: ".no-print",
        iframe: true,
        append: null,
        prepend: null,
        manuallyCopyFormValues: true,
        deferred: $.Deferred(),
        timeout: 10000,
        title: "KAJIADO RECEIPT",
        doctype: '<!doctype html>'
    });
    $("#myprintdiv").css({"visibility": "hidden"});
}



//sart of function to get current date
function returnCurrDate() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//end of function to get current date

//start of function to return double digits e.g 01,02,12,13
function formatNumber(n) {

    return (n > 9 ? "" + n : "0" + n);
}
//end of function to return double digits e.g 01,02,12,13


//start of function to save all our payments for tracking

function savePaymentDetails(patientid, productid, paymode, visitid, nodeid, amounttopay, amountpaid, balance) {


    var userid = $.session.get('user_id');
    var facilityid = $.session.get('facility_id');
    var updateValues = {"c_patient_id": patientid, "m_product_id": productid, "b_paymode_id": paymode, "p_visit_id": visitid, "c_node_id": nodeid, "served_by": userid, "amount_to_be_paid": amounttopay, "amount_paid": amountpaid, "balance": balance, "ispayed": "Y", "c_facility_id": facilityid};
    $.ajax({
        url: "" + api_url + "/b_financepayments",
        type: 'POST',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(updateValues),
        success: function (data) {
            console.log("calling save payment details");
            console.log(data);

//            console.log("success saving payments");
            getRegistrationPayments();
            loadRegistrationDataTable();
            $("#divregpayment").hide();
            $("#dispregdetails").show();
        },
        error: function (error) {
            console.log(error);
        }
    });
    console.log("IN THE END!!");
}


function savePaymentDetailsLab(patientid, productid, paymode, visitid, nodeid, amounttopay, amountpaid, balance) {


    var userid = $.session.get('user_id');
    var facilityid = $.session.get('facility_id');
    var updateValues = {"c_patient_id": patientid, "m_product_id": productid, "b_paymode_id": paymode, "p_visit_id": visitid, "c_node_id": nodeid, "served_by": userid, "amount_to_be_paid": amounttopay, "amount_paid": amountpaid, "balance": balance, "ispayed": "Y", "c_facility_id": facilityid};
    $.ajax({
        url: "" + api_url + "/b_financepayments",
        type: 'POST',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(updateValues),
        success: function (data) {
            console.log("calling save payment details");
            console.log(data);

//            console.log("success saving payments");
            loadDataTableLab();
            getLabPayments();
            
            $("#divlabpayment").hide();
            $("#displabdetails").show();
        },
        error: function (error) {
            console.log(error);
        }
    });
    console.log("IN THE END!!");
}



function savePaymentDetailsPharmacy(patientid, productid, paymode, visitid, nodeid, amounttopay, amountpaid, balance) {


    var userid = $.session.get('user_id');
    var facilityid = $.session.get('facility_id');
    var updateValues = {"c_patient_id": patientid, "m_product_id": productid, "b_paymode_id": paymode, "p_visit_id": visitid, "c_node_id": nodeid, "served_by": userid, "amount_to_be_paid": amounttopay, "amount_paid": amountpaid, "balance": balance, "ispayed": "Y", "c_facility_id": facilityid};
    $.ajax({
        url: "" + api_url + "/b_financepayments",
        type: 'POST',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(updateValues),
        success: function (data) {
            console.log("calling save payment details");
            console.log(data);

//            console.log("success saving payments");
            // loadNewRadiologyTable();
            getPharmacyPayments();
            loadPharmacyDataTable();
            // getRadiologyPayments();
            // loadDataTableRadiology();
            $("#divpharmacypayment").hide();
            $("#disppharmacydetails").show();
        },
        error: function (error) {
            console.log(error);
        }
    });
    console.log("IN THE END!!");
}





function savePaymentDetailsRadiology(patientid, productid, paymode, visitid, nodeid, amounttopay, amountpaid, balance) {


    var userid = $.session.get('user_id');
    var facilityid = $.session.get('facility_id');
    var updateValues = {"c_patient_id": patientid, "m_product_id": productid, "b_paymode_id": paymode, "p_visit_id": visitid, "c_node_id": nodeid, "served_by": userid, "amount_to_be_paid": amounttopay, "amount_paid": amountpaid, "balance": balance, "ispayed": "Y", "c_facility_id": facilityid};
    $.ajax({
        url: "" + api_url + "/b_financepayments",
        type: 'POST',
        contentType:
                "application/json;charset=utf-8",
        data: JSON.stringify(updateValues),
        success: function (data) {
            console.log("calling save payment details");
            console.log(data);

//            console.log("success saving payments");
            // loadNewRadiologyTable();
            getRadiologyPayments();
            // getRadiologyPayments();
            // loadDataTableRadiology();
            $("#divradiologypayment").hide();
            $("#dispradiologydetails").show();
        },
        error: function (error) {
            console.log(error);
        }
    });
    console.log("IN THE END!!");
}
//end of function to save all our payments for tracking

//function to get payment modes start
function getPaymentModes(istrue) {
    var trData = "";
    $.ajax({
        url: "" + api_url + "b_paymodes",
        type: "get",
        data: {},
        success: function (data) {

            var listItems = '<option selected disabled>Select Payment Modes</option>';
            for (var x = 0; x < data.length; x++) {
                if (data[x].name == 'CASH') {
                    listItems += "<option selected value='" + data[x].b_paymode_id + "'>" + data[x].name + "</option>";
                } else {
                    listItems += "<option value='" + data[x].b_paymode_id + "'>" + data[x].name + "</option>";
                }

            }

            // var x=$("#paymentmodes").val();

            if(istrue){

                $("#paymentmodes2").html(listItems);

                // code to remove an item from the options
                
                // $('#paymentmodes2').find('option:contains("'+x+'")').remove();

            }
            else{

                $("#paymentmodes").html(listItems);

            }

                      
        },
        error: function () {
            console.log("error");
        }
    });
}

// function to check for empty fields

function isEmpty(val){

    return (val === undefined || val == null || val.length <= 0) ? true : false;

}

// function to check for empty fields