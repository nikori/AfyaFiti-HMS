function load_menu() {
    var API_URL = localStorage.getItem("API_URL");

    var username_session = $.session.get('username');
    var user_id_session = $.session.get('user_id');
    var facility_id_session = $.session.get('facility_id');

    if (typeof username_session === "undefined") {
        // ...
        window.location.href = "module/login/login.html";

        console.log("API_URL ; " + API_URL);
    } else {
//        console.log("Username session => " + username_session);
        //pull the roles to minimize access
        getRoleId(user_id_session);
        console.log("API_URL ; " + API_URL);
    }

//Loading of the menus
    $(".dashboard_menu").click(function () {
        //load dashboard based on the user role
        getRoleId(user_id_session);
    });

    $(".add_register").click(function () {
        insert_details();
    });

    $(".registration_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/registration/search_patient.html", function () {
            registration_clicks();
            search();
//            register_patient();
            edit_details();
        });

    });
    $(".users_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/users/users.html", function () {
            getUsers();
            loadDataTable1();
        });
    });

    $(".accounts_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/accounts/accounts.html", function () {
            getAccounts();
            loadDataTable1();
        });
    });
    $(".visit_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/visit/visit.html");
        $(".createdby").val(user_id_session);
        $(".updatedby").val(user_id_session);
        $(".c_facility_id").val(facility_id_session);
//        today_date();
        get_payment_modes();
        get_c_nodes();
        get_c_departments();

    });
    $(".reg_bill_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/cashier/reg_payment.html", function () {
            getRegistrationPayments();
            loadRegistrationDataTable();

        });
    });
    $(".pharmacy_bill_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/cashier/pharmacy_payment.html", function () {
            getPharmacyPayments()
            loadPharmacyDataTable()
        });
    });

    $(".lab_bill_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/cashier/lab_payment.html", function () {
            // getLabPayments()
            // loadDataTableLab();

            getLabPayments();
            // loadNewLabTable();

        });
    });

    $(".radiology_bill_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/cashier/radiology_payment.html", function () {

            getRadiologyPayments();
            // loadNewRadiologyTable();

        });
    });



    // $(".financereports_menu").click(function () {
    //     $("#main_body").empty();
    //     $("#modal_loading").modal("show");
    //     $("#main_body").load("module/cashier/financereports.html", function () {
    //         // getLabPayments()
    //         // loadDataTableLab();



    //         // loadNewLabTable();

    //     });
    // });

    $(".clinic_bill_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/cashier/clinic_payment.html", function () {
            // getLabPayments()
            // loadDataTableLab();

            // getLabPayments();
            // loadNewLabTable();

        });
    });


    $(".triage_outpatient_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/triage/triage_list.html", function () {
            getTriagePatients();
//            loadDataTable1();
        });
    });
    $(".consultation_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/consultation/consultation.html", function () {
            getConsultationPatients();
//            loadConsultationTbl();
            getConsultationDiseases();
            getDrugs();
            getDosages();
            click_functions();
//            loadprescription();
            loadPrescriptiontables();
        });
    });
    $(".laboratory_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/laboratory/laboratory.html", function () {
            getLabPatients();
            loadLabTable1();
            click_lab_functions();
        });
    });
    $(".radiology_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/radiology/radiology.html", function () {
            getRadiologyPatients();
            loadRadiologyTable1();
            click_radiology_functions();
        });
    });
    $(".book_appointments").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/appointment/book_appointment.html", function () {
            getAptPatients();
            getAptTypes();

        });
    });
    $(".view_appointments").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/appointment/view_appoinrment.html", function () {
            // getAppointments();
            // loadCalendar();
            populateArray();
            $('#calendar').eCalendar();
        });
    });
    $(".error_page").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/error_page.html");
    });
    $(".test_reg").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/registration/registration.html");
    });
    $(".pharmacy_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/pharmacy/dispensing.html", function () {
            loadDispensing();
            getDispensingPatients();
        });
    });
    $(".lab_report_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/reports/lab-report.html", function () {

        });
    });
    $(".patients_report_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/reports/patients-report.html", function () {
            loadpatients();
            search_visits();
        });
    });
    $(".accounts_report_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/reports/accounts-report.html", function () {
            loadFinanceReports();
            getFinanceReports();

        });
    });
    $(".pharmacy_report_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/reports/pharmacy-report.html", function () {

        });
    });
    $(".inventory_report_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/reports/inventory-report.html", function () {

        });
    });
    $(".inpat_mgt").click(function () {
        //console.log("inside inpatient_mgt");
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/inpatient/inpatient.html", function () {
            getInPatients();

            //inpatientTable();
        });
    });
    $(".admitted_mgt").click(function () {
        //console.log("inside admittedmgt");
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/inpatient/admittedPatients.html", function () {
            getAdmittedInPatients();
            //AdmittedTable();
        });
    });
    $(".bed_mgt").click(function () {
        //console.log("inside admittedmgt");
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/inpatient/bed.html", function () {
            BedMgt();
            //AdmittedTable();
        });
    });
    $(".editbed").click(function () {
        //console.log("inside admittedmgt");
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/inpatient/editbed.html", function () {
            getWards();
            //AdmittedTable();
        });
    });
    $(".dental_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/dental.html", function () {

            getDentalPatients();
            loadDentalTable();
            getDentalDiseases();
            getDentalDrugs();
            click_dental_functions();

        });
    });
    $(".eye_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/ent.html", function () {

            getentPatients();
            loadentTable();
            getentDiseases();
            getentDrugs();
            click_ent_functions();
        });
    });
    $(".maternal_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/maternal.html", function () {

            getMaternityPatients();
            loadMaternityTable();
            getMaternityDiseases();
            getMaternityDrugs();
            click_maternity_functions();
        });
    });
    $(".pysio_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/physio.html", function () {

            getPhysioPatients();
            loadPhysioTable();
            getPhysionDiseases();
            getPhysioDrugs();
            click_physio_functions();
        });
    });
    $(".nutrition_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/nutrition.html", function () {

            getNutritionPatients();
            loadNutritionTable();
            getNutritionDiseases();
            getNutritionDrugs();
            click_nutrition_functions();
        });
    });
    $(".counselling_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/specialclinics/counselling.html", function () {

            getCounsellingPatients();
            loadCounsellingTable();
            getCounsellingDiseases();
            getCounsellingDrugs();
            click_counselling_functions();
        });
    });

    $(".store_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/store.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {


                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Store JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/store.js")
                            .done(function (script, textStatus) {


                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                getFacilites();
                                get_stores();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Store JS ");

                    getFacilites();
                    get_stores();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }
        });
    });
    $(".payment_mode_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/administration/payment_mode.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Payment Mode JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/payment_mode.js")
                            .done(function (script, textStatus) {
                                getpaymentmodes();

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Payment Mode JS ");
                    getpaymentmodes();

                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }
        });
    });

    $(".accounts_management_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/administration/accounts_management.html", function () {
//        (response, status, xhr) {
//            if (status == "error") {
//                var msg = "Sorry but there was an error: ";
//                $("#error").html(msg + xhr.status + " " + xhr.statusText);
//            } else {
//
//                if (typeof window.appointment_load_flag == 'undefined') {
//                    console.log("Payment Mode JS First Time Loading...");
//                    //the flag was not found, so the code has not run
//                    $.getScript("js/module_js/payment_mode.js")
//                            .done(function (script, textStatus) {
//                                getpaymentmodes();
//
//                                $(".createdby").val(user_id_session);
//                                $(".updatedby").val(user_id_session);
//
//                            })
//                            .fail(function (jqxhr, settings, exception) {
//                                console.log(exception);
//                            });
//                } else {
//                    console.log("Already Loaded Payment Mode JS ");
//                    getpaymentmodes();
//
//                    $(".createdby").val(user_id_session);
//                    $(".updatedby").val(user_id_session);
//
//                }
//            }
        });
    });

    $(".product_price_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/administration/product_pricing.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Product Pricing JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/product_pricing.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);
                                $(".c_facility_id").val(facility_id_session);
                                get_product_prices();
                                get_products();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Product Pricing JS ");

                    get_product_prices();
                    get_products();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);
                    $(".c_facility_id").val(facility_id_session);

                }
            }

        });
    });

    $(".service_price_menu").click(function () {
        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/administration/service_pricing.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Service Pricing JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/service_pricing.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);
                                $(".c_facility_id").val(facility_id_session);
                                get_service_prices();
                                get_services();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Service Pricing JS ");

                    get_service_prices();
                    get_services();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);
                    $(".c_facility_id").val(facility_id_session);

                }

            }

        });
    });

    $(".uom_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/uom.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("UOM JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/uom.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_uoms();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded UOM JS ");

                    get_uoms();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }

        });
    });

    $(".transfer_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/transfers.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Transfers JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/transfers.js")
                            .done(function (script, textStatus) {

                                console.log("Transfer JS Loaded");
                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_transfers();
                                getStores();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Transfers JS ");

                    get_transfers();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }

        });
    });

    $(".product_group_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/product_group.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Product Grouping JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/product_group.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_product_groups();
                                get_c_nodes();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Product Grouping JS ");

                    get_product_groups();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }

            }

        });
    });

    $(".product_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/product.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Product Grouping JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/product.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_products();
                                get_uoms();
                                get_productgroups();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Product Grouping JS ");

                    get_product_groups();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }

        });
    });


    $(".supplier_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/supplier.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Supplier  JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/supplier.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_suppliers();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded Supplier JS ");

                    get_product_groups();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }

            }

        });
    });

    $(".grn_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/grn.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Supplier  JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/grn.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_grns();
                                getSuppliers();
                                getStores();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded GRN JS ");

                    get_product_groups();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }

        });
    });

    $(".grn_line_menu").click(function () {

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        $("#main_body").load("module/store/grnline.html", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#error").html(msg + xhr.status + " " + xhr.statusText);
            } else {

                if (typeof window.appointment_load_flag == 'undefined') {
                    console.log("Supplier  JS First Time Loading...");
                    //the flag was not found, so the code has not run
                    $.getScript("js/module_js/grnline.js")
                            .done(function (script, textStatus) {

                                $(".createdby").val(user_id_session);
                                $(".updatedby").val(user_id_session);

                                get_grnlines();
                            })
                            .fail(function (jqxhr, settings, exception) {
                                console.log(exception);
                            });
                } else {
                    console.log("Already Loaded GRN JS ");

                    get_product_groups();
                    $(".createdby").val(user_id_session);
                    $(".updatedby").val(user_id_session);

                }
            }
        });
    });
    $(".logout_link").click(function () {
        $.session.remove('username');
        $.session.remove('email');
        $.session.remove('facility_id');
        $.session.remove('user_id');
        $.session.remove('is_active');

        $("#main_body").empty();
        $("#modal_loading").modal("show");
        window.location.href = "module/login/login.html";

    });

}

function getRoleId(user_id_session) {

    $.ajax({
        url: "" + API_URL + "/c_users?filter[where][c_user_id]=" + user_id_session,
        type: "get",
        data: {},
        success: function (data) {

            console.log("role data size : " + data.length);

            for (var x = 0; x < data.length; x++) {
                //if user in the administrator
                console.log("Role id ==>" + data[x].c_role_id);
                if (data[x].c_role_id == 1) {
                    $("#invmenu").css({"display": "inline"});
                    $("#registration_menu").css({"display": "inline"});
                    $("#pregmenu").css({"display": "inline"});
                    $("#outpmenu").css({"display": "inline"});
                    $("#inpmenu").css({"display": "inline"});
                    $("#specialclinicmenu").css({"display": "inline"});
                    $("#pharmacymenu").css({"display": "inline"});
                    $("#financemenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});
                    $("#invmenu").css({"display": "inline"});
                    $("#repmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "inline"});
                    $("#confmenu").css({"display": "inline"});

                    admin_dashboard();
                }
                //if the user is a records officer
                else if (data[x].c_role_id == 2) {

                    $("#registration_menu").css({"display": "inline"});
                    $("#pregmenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});

                }
                //if the user is a cashier
                else if (data[x].c_role_id == 3) {

//                    $("#pharmacymenu").css({"display": "inline"});
//                    $("#financemenu").css({"display": "inline"});
//                    $("#invmenu").css({"display": "inline"});
//                    $("#repmenu").css({"display": "inline"});

                    $("#invmenu").css({"display": "hidden"});
                    $("#pregmenu").css({"display": "hidden"});
                    $("#outpmenu").css({"display": "hidden"});
                    $("#pharmacymenu").css({"display": "inline"});
                    $("#financemenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "hidden"});
                    $("#invmenu").css({"display": "inline"});
                    $("#repmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "hidden"});
                    $("#confmenu").css({"display": "hidden"});

                    accounts_dashboard();
                }
                //if the user is a Nursing Station
                else if (data[x].c_role_id == 4) {

                    $("#registration_menu").css({"display": "inline"});
                    $("#pregmenu").css({"display": "inline"});
                    $("#outpmenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "inline"});

                }
                //if the user is a Outpatient Nursing
                else if (data[x].c_role_id == 5) {

                    $("#pregmenu").css({"display": "inline"});
                    $("#outpmenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "inline"});

                }
                //if the user is a Clinician
                else if (data[x].c_role_id == 6) {

                    $("#pregmenu").css({"display": "inline"});
                    $("#outpmenu").css({"display": "inline"});
                    $("#pharmacymenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "inline"});
                    $("#repmenu").css({"display": "inline"});

                    clinicians_dashboard();

                }
                //if the user is a pharmacist
                else if (data[x].c_role_id == "7") {

                    $("#pharmacymenu").css({"display": "inline"});
                    $("#invmenu").css({"display": "inline"});
                    $("#repmenu").css({"display": "inline"});

                }
                //if the user is a Inpatient Nursing
                else if (data[x].c_role_id == 8) {

                    $("#pregmenu").css({"display": "inline"});
                    $("#outpmenu").css({"display": "inline"});
                    $("#appmenu").css({"display": "inline"});
                    $("#hospmenu").css({"display": "inline"});
                }

                //if the user is a Store keeper
                else if (data[x].c_role_id == 9) {

                    $("#invmenu").css({"display": "inline"});

                }

                //if the user is a Lab assistant
                else if (data[x].c_role_id == 10) {

                    $("#outpmenu").css({"display": "inline"});

                }

                //if the user is a Manager
                else if (data[x].c_role_id == 11) {

                    $("#repmenu").css({"display": "inline"});
                    manager_dashboard();

                }


            }

        },
        error: function (e) {
            console.log(e);

        }
    });
}