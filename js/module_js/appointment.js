var api_url = localStorage.getItem("API_URL");

var patient_list = [];
var patient_id_list = [];

var apt_list = [];
var apt_id_list = [];
var myevents = [];

var patient_list = [];
var patient_id_list=[];

var apt_list = [];
var apt_id_list=[];

function getAptPatients() {
    console.log("inside getAptPatients");
    
    $.ajax({
        url: "" + api_url + "/c_patients",
        type: "GET",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                var names = data[x].firstname + " " + data[x].lastname+" "+data[x].phoneno;
                var patientid=data[x].c_patient_id;

                patient_list.push(names);
                patient_id_list.push(patientid);

            }
            var arrayLength = patient_list.length;

            for (var i = 0; i < arrayLength; i++) {
                x=patient_list[i];
                y=patient_id_list[i];
                console.log("patient name:"+x+"patient id "+y+"\n");

                var option = "<option value='" + x + "'>";
                $("#pat_name").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}




function getAptTypes() {
    console.log("inside getApttypes");
    
    $.ajax({
        url: "" + api_url + "/c_appointment_types",
        type: "GET",
        data: {},
        success: function (data) {
            for (var x = 0; x < data.length; x++) {

                var names = data[x].name;
                var aptid = data[x].id;
                

                apt_list.push(names);
                apt_id_list.push(aptid);

            }
            var arrayLength = apt_list.length;

            for (var i = 0; i < arrayLength; i++) {
                var x=apt_list[i];
                var y=apt_id_list[i];
                console.log("apt type name:"+x+"apt type id "+y+"\n");

                var option = "<option value='" + x + "'>";
                $("#pat_type").append(option);

            }
        },
        error: function () {
            console.log("error");
        }

    });
}

function getSelectedPatientId(){

    
    // var x = document.getElementById("pat_name").selectedIndex;
    // var y = document.getElementById("pat_name").options;
    var x = document.getElementById("apt_name").value;
    var myindex=patient_list.indexOf(x);
    var ptid=patient_id_list[myindex];

    alert("length is"+ptid);




}


function submitAppointment(){

    var x = document.getElementById("apt_name").value;
    var myindex=patient_list.indexOf(x);
    var ptid=patient_id_list[myindex];  


    var y = document.getElementById("apt_type").value;
    var myindex1=apt_list.indexOf(y);
    var ptid1=apt_id_list[myindex1];

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + ":"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

    
    var patient_id=patient_id_list[myindex];
    var appointment_type=apt_id_list[myindex1];
    var appointment_date=document.getElementById('appt_date').value;
    var createdby=$.session.get('user_id');
    var updatedby=$.session.get('user_id');
    var created=datetime;
    var appointment_time=document.getElementById('time').value;
    var facility_id=$.session.get('facility_id');

    if(x==""){

        swal('Input Error...','Appointment name required!','error');

    }
    else if(y==""){

       swal('Input Error...','Appointment type required!','error');

    }
    else if(appointment_date==""){

        swal('Input Error...','Appointment date required!','error');

    }
    else if(appointment_time==""){

        swal('Input Error...','Appointment time required!','error');

    }

else{
    submitting(patient_id,appointment_type,appointment_date,createdby,updatedby,created,facility_id);
}



     
}

function submitting(patient_id,appointment_type,appointment_date,createdby,updatedby,created,facility_id){


    var dataToSubmit= {
            "c_patient_id": patient_id,            
            "appointment_type_id": appointment_type,
            "appointment_date": appointment_date,
            "time":appointment_date,
            "createdby":createdby,
            "updatedby":updatedby,
            "updated":created,
            "created":created,
            "c_facility_id":facility_id
        };


      $.ajax({
        url: "" + api_url + "/c_appointments",
        type: "POST",        
        data:dataToSubmit,

        success: function (data) {
            // alert(data);
            console.log(data);
            console.log('success inserting appoinment');

            document.getElementById('apt_name').innerHTML="";
            // $("#apt_name").html("");
            $("#apt_type").html("");
            $("#appt_date").html("");
            $("#time").html("");

            swal(
                    'Success...',
                    'Success adding appointment!',
                    'success'
                    );


            

        }, error: function (e) {
            console.log(e);
            alert(e);
            swal(
                    'Oops...',
                    'Something went wrong in edit!',
                    'error'
                    );

        }
    });


}


var myappointments=[];


function getAppointments() {   

    $.ajax({
        url: "" + api_url + "/v_appointments",
        type: "get",
        data: {},
        success: function (data) {

            console.log("appointments");
            console.log(data);

            // var table = $('#regtable').DataTable( );
            for (var x = 0; x < data.length; x++) {

                console.log(data[x].appointment_date);
                var mydate=data[x].appointment_date;
                var splitTdate=mydate.split("T");
                console.log("split date");
                console.log(splitTdate[0]);
                var splitTdateHiphen=splitTdate[0].split("-");
                console.log("year "+splitTdateHiphen[0]);

                var year=splitTdateHiphen[0]
                var month=splitTdateHiphen[1]
                var date=splitTdateHiphen[2]
                var mymonth=Number(month)-1;

                myappointments.push({
                    title:data[x].firstname+" "+data[x].lastname+" "+data[x].c_patient_id,                    
                    description:data[x].appointment_type,
                    datetime:new Date(year, mymonth,date)
                    

                });

               
            }
        },
        error: function () {
            console.log("error");

        }
    });
}



//load my new e-calendar 


/**
 * @license e-Calendar v0.9.3
 * (c) 2014-2016 - Jhonis de Souza
 * License: GNU
 */



function populateArray(){

    if(myappointments.length>0){

        myappointments=[];
        getAppointments();

    }
    else{

       getAppointments();

    }
    
    
}




(function ($) {

    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        var dMonth = adMonth;
        var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

       
        

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };
        var mouseOverEvent = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveEvent = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var mouseOverItem = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            print();
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            print();
        };

        function loadEvents() {
            if (typeof settings.url != 'undefined' && settings.url != '') {
                $.ajax({url: settings.url,
                    async: false,
                    success: function (result) {
                        settings.events = result;
                    }
                });
            }
        }

        function print() {
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay() - settings.firstDayOfWeek;
            if (dWeekDayOfMonthStart < 0) {
                dWeekDayOfMonthStart = 6 - ((dWeekDayOfMonthStart + 1) * -1);
            }
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('c-grid');
            var cEvents = $('<div/>').addClass('c-event-grid');
            var cEventsBody = $('<div/>').addClass('c-event-body');
            cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
            var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            var dayOfWeek = settings.firstDayOfWeek;
            for (var i = 0; i < 7; i++) {
                if (dayOfWeek > 6) {
                    dayOfWeek = 0;
                }
                var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                cWeekDay.html(settings.weekDays[dayOfWeek]);
                cBody.append(cWeekDay);
                dayOfWeek++;
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('c-day-previous-month c-pad-top');
                    cDay.html(dLastDayOfPreviousMonth++);
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('c-day c-pad-top');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('c-today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && d.getMonth() == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('c-event').attr('data-event-day', d.getDate());
                            cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('c-day-next-month c-pad-top');
                    cDay.html(dayOfNextMonth++);
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('c-event-list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if (d.getMonth() == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth() + 1, 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('c-event-item');
                    var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title + '<br/>');
                    var description = $('<div/>').addClass('description').html(settings.events[i].description + '<br/>');
                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    item.append(title).append(description);

                    // Add the url to the description if is set
                    if( settings.events[i].url !== undefined )
                    {
                        /**
                         * If the setting url_blank is set and is true, the target of the url
                         * will be "_blank"
                         */
                        type_url = settings.events[i].url_blank !== undefined && 
                                   settings.events[i].url_blank === true ? 
                                   '_blank':'';
                        description.wrap( '<a href="'+ settings.events[i].url +'" target="'+type_url+'" ></a>' );
                    }

                    eventList.append(item);
                }
            }
            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);
        }

        return print();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        textArrows: {previous: '<<', next: '>>'},
        eventTitle: 'Appointments',
        url: '',
        events: myappointments,
        firstDayOfWeek: 1
    };

}(jQuery));

//load my new e-calendar
