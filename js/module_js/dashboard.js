var api_url = localStorage.getItem("API_URL");

function admin_dashboard() {
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/dashboard/dashboard.html", function () {

        get_reg_patients(1);
        get_today_visits(1);
        load_dashboard_data();
        var months = [];
        var visits_num = [];
        $.ajax({
            url: "" + api_url + "/v_visit_trends?filter[order]=visit_date%20ASC",
            type: "GET",
            data: {},
            dataType: "JSON",
            success: function (data) {

                for (var x = 0; x < data.length; x++) {

                    months.push((data[x].visit_date).substr(0, 10));
                    visits_num.push(parseInt(data[x].visits));
                }
                // console.log(visits_num);
                // console.log(months);
                draw_visit_trend(months, visits_num);

            }, error: function (data) {

                swal(
                        'Oops...',
                        'Unable to load some data components, please reload the page!',
                        'error'
                        );
            }
        });

        function draw_visit_trend(months, visits_num) {
            Highcharts.chart('visittrends', {
                title: {
                    text: 'Outpatient Visit Trends'
                },
                subtitle: {
                    text: 'Source: Southlake Health Center'
                },
                xAxis: {
                    categories: months
                },
                yAxis: {
                    title: {
                        text: 'Visits'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                        name: 'Number of Visits',
                        data: visits_num
                    }]
            });


        }

        var items = [];
        var payments = [];

        $.ajax({
            url: "" + api_url + "/v_payment_bars",
            type: "GET",
            data: {},
            dataType: "JSON",
            success: function (data) {

                for (var x = 0; x < data.length; x++) {

                    items.push(data[x].name);
                    payments.push(parseInt(data[x].payments));
                }
                // console.log(items);
                // console.log(payments);
                draw_payments_bar(items, payments);

            }, error: function (data) {

                swal(
                        'Oops...',
                        'Unable to load some data components, please reload the page!',
                        'error'
                        );
            }
        });


        function draw_payments_bar(items, payments) {
            Highcharts.chart('payments_bar', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Payments'
                },
                subtitle: {
                    text: 'Source: Southlake Health Center'
                },
                xAxis: {
                    categories: items,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Amount (Kshs)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Kshs</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                        name: 'Payments',
                        data: payments

                    }]
            });
        }

        var visit_nodes = [];
        $.ajax({
            url: "" + api_url + "/v_visit_nodes",
            type: "GET",
            data: {},
            dataType: "JSON",
            success: function (data) {

                for (var x = 0; x < data.length; x++) {
                    var obj = {};
                    obj["name"] = data[x].name;
                    obj["y"] = parseInt(data[x].count);

                    if (data[x].name == "CLOSED") {
                        obj["sliced"] = true;
                        obj["selected"] = true;

                    }
                    visit_nodes.push(obj);


                }
                console.log(visit_nodes);

                draw_visit_node(visit_nodes);

            }, error: function (data) {

                swal(
                        'Oops...',
                        'Unable to load some data components, please reload the page!',
                        'error'
                        );
            }
        });

        function draw_visit_node(visit_nodes) {

            Highcharts.chart('visit_node', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Visit Level Reached'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y:.0f}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                        name: 'Levels',
                        colorByPoint: true,
                        data: visit_nodes
                    }]
            });
        }
    });

}

function get_reg_patients(id) {

    $.ajax({
        url: "" + api_url + "/c_patients/count",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            if (typeof (data) == 'object') {
                //            if (data.lenth > 0) {

                var total_registered = data.count;

                if (id == 1) {
                    document.getElementById("dash_reg_patients").innerHTML = total_registered;

                } else if (id == 2) {
                    document.getElementById("manager_reg_patients").innerHTML = total_registered;
                }

                //                document.getElementById("reg_patients").innerHTML = total_registered;

            }
            else {

                var total_registered = 0;

                if (id == 1) {
                    document.getElementById("dash_reg_patients").innerHTML = total_registered;

                } else if (id == 2) {
                    document.getElementById("manager_reg_patients").innerHTML = total_registered;
                }

                //                document.getElementById("reg_patients").innerHTML = total_registered;
            }

        }, error: function (data) {

            swal(
                    'Oops...',
                    'Unable to load some data components, please reload the page!',
                    'error'
                    );
        }
    });

}

function get_today_visits(id) {

    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    console.log("date : " + today);

    $.ajax({
        url: "" + api_url + "/v_p_visits?filter[where][visitdate]=" + today,
//        url: "" + api_url + "/p_visits?filter[where][visitdate][between]" + today + "[and]" + today + " 23:59:59",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            console.log("today_visit_data : " + data);
            var today_visit = data.length;
            console.log("today_visit : " + today_visit);

            if (id == 1) {
                console.log("dashboard id = " + id);
                document.getElementById("dash_reg_visits").innerHTML = today_visit;
//                $(".dash_reg_visits").val(today_visit);

            } else if (id == 2) {
                document.getElementById("manager_reg_visits").innerHTML = today_visit;
//                $(".manager_reg_visits").val(today_visit);
            }

            //            document.getElementById("reg_visits").innerHTML = today_visit;

        }, error: function (data) {

            swal(
                    'Oops...',
                    'Unable to load some data components, please reload the page!',
                    'error'
                    );
        }
    });

}


function load_dashboard_data() {

    //clear datatable content
    $('#dashboard_table').dataTable().fnClearTable();

    $.ajax({
        url: "" + api_url + "/v_dashboard_lists",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function (data) {

            var response_type = typeof (data);
            // console.log("response_type = > "+response_type);

            if (response_type == 'object') {

                $.each(data, function (value, i) {

                    var firstname = i.firstname;
                    var lasttname = i.lastname;
                    var idnum = i.idnumber;
                    var nhifno = i.nhifno;
                    var gender = i.gender;
                    var level = i.level;

                    var p_name = firstname + " " + lasttname;
                    var status = "Active";

                    var table = $('#dashboard_table').DataTable();

                    table.row.add([
                        p_name,
                        idnum,
                        gender,
                        nhifno,
                        status,
                        level
                    ]).draw();

                });
            } else {

                swal(
                        'Oops...',
                        'No patients on the queue today!',
                        'error'
                        );
            }

        }, error: function (data) {

            swal(
                    'Oops...',
                    'Unable to load patients data, please reload the page!',
                    'error'
                    );
        }
    });
}

function accounts_dashboard() {
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/dashboard/cashier_dashboard.html", function () {

        //        get_reg_patients();
        //        get_today_visits();
        //        load_dashboard_data();

        Highcharts.chart('accounts_bargraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Days Collection in Sections'
            },
            xAxis: {
                categories: [
                    'Qrt 1',
                    'Qrt 2',
                    'Qrt 3',
                    'Qrt 4'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Kshs'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'Consultation',
                    data: [400, 700, 1000, 200]

                }, {
                    name: 'Laboratory',
                    data: [800, 700, 500, 900]

                }, {
                    name: 'Pharmacy',
                    data: [800, 700, 500, 900]

                }]
        });

        Highcharts.chart('accounts_piechart', {
            title: {
                text: 'Revenue collection'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                    type: 'pie',
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    data: [
                        ['January', 29.9, false],
                        ['February', 71.5, false],
                        ['March', 106.4, false],
                        ['April', 129.2, true, true],
                        ['May', 144.0, false],
                        ['June', 29.9, false],
                        ['July', 71.5, false],
                        ['August', 106.4, false],
                        ['September', 129.2, false],
                        ['October', 144.0, false],
                        ['November', 129.2, false],
                        ['December', 144.0, false]
                    ],
                    showInLegend: true
                }]
        });

    });

}

function clinicians_dashboard() {
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/dashboard/clinician_dashboard.html", function () {

        //        get_reg_patients();
        //        get_today_visits();
        //        load_dashboard_data();

        Highcharts.chart('clinician_bargraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Days Collection in Sections'
            },
            xAxis: {
                categories: [
                    'Qrt 1',
                    'Qrt 2',
                    'Qrt 3',
                    'Qrt 4'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Kshs'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'General',
                    data: [40, 70, 100, 30]

                }, {
                    name: 'Nutrition',
                    data: [40, 40, 40, 40]

                }, {
                    name: 'Maternity',
                    data: [40, 30, 10, 30]

                }, {
                    name: 'Councelling',
                    data: [50, 70, 30, 40]

                }, {
                    name: 'Dental Clinic',
                    data: [80, 45, 10, 15]

                }, {
                    name: 'Circumcision',
                    data: [20, 70, 50, 20]

                }]
        });

        Highcharts.chart('clinician_piechart', {
            title: {
                text: 'Consultation by departments'
            },
            xAxis: {
                categories: ['General', 'Nutrition', 'Maternity', 'Councelling', 'Dental Clinic', 'Circumcision']
            },
            series: [{
                    type: 'pie',
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    data: [
                        ['General', 29.9, false],
                        ['Nutrition', 71.5, false],
                        ['Maternity', 106.4, false],
                        ['Councelling', 129.2, true, true],
                        ['Dental Clinic', 144.0, false],
                        ['Circumcision', 29.9, false]
                    ],
                    showInLegend: true
                }]
        });

    });

}

function manager_dashboard() {
    $("#main_body").empty();
    $("#modal_loading").modal("show");
    $("#main_body").load("module/dashboard/manager_dashboard.html", function () {

        get_reg_patients(2);
        get_today_visits(2);

        Highcharts.chart('v_monthly_bargraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Revenue collection Weekly'
            },
            xAxis: {
                categories: [
                    'Week 1',
                    'Week 2',
                    'Week 3',
                    'Week 4'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No of Visits'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'Visits',
                    data: [4, 7, 10, 2]

                }]
        });

        Highcharts.chart('r_monthly_bargraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Visits Weekly'
            },
            xAxis: {
                categories: [
                    'Week 1',
                    'Week 2',
                    'Week 3',
                    'Week 4'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Units'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'Amount',
                    data: [4, 7, 10, 2]

                }]
        });

        Highcharts.chart('visits_piechart', {
            title: {
                text: 'Visits per Clinic'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                    type: 'pie',
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    data: [
                        ['Dental', 2, false],
                        ['ENT', 7, false],
                        ['Maternity', 10, false],
                        ['Nutrition', 12, true, true],
                        ['Physiotherapy', 14, false]
                    ],
                    showInLegend: true
                }]
        });

        Highcharts.chart('revenue_piechart', {
            title: {
                text: 'Revenue per section'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                    type: 'pie',
                    allowPointSelect: true,
                    keys: ['name', 'y', 'selected', 'sliced'],
                    data: [
                        ['Consultation', 29.9, false],
                        ['Laboratory', 71.5, false],
                        ['Pharmacy', 106.4, false]
                    ],
                    showInLegend: true
                }]
        });

    });

}