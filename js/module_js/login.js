var API_URL = localStorage.getItem("API_URL");

function login() {
    $(".login_btn").click(function () {

        var username = $(".username").val();
        var password = $(".password").val();
        
//        console.log("login method URL => " + API_URL);

        $.ajax({
//            url: "http://197.248.10.20:3000/api/c_users/login",
            url: "" + API_URL + "/c_users/login",
            type: "POST",
            data: {
                "name": username,
                "password": password
            },
            dataType: "JSON",
            success: function (data) {
                console.log(jQuery.type(data));
                x = [];

                var response_type = typeof (data);
                console.log("response_type = > " + response_type);
                if (response_type == 'object') {

                    $.each(data, function (value, i) {

                        var username = value.name;
                        var email = value.email;
                        var facility_id = value.c_facility_id;
                        var user_id = value.c_user_id;
                        var is_active = value.isactive;
                        console.log("username => " + username + "Email => " + email);

                        $.session.set('username', i.username);
                        $.session.set('email', i.email);
                        $.session.set('facility_id', i.c_facility_id);
                        $.session.set('user_id', i.c_user_id);
                        $.session.set('is_active', i.isactive);

                        swal({
                            title: 'Login success!',
                            text: 'You will be redirected to your Home Page.',
                            timer: 3000,
                            onOpen: function () {
                                swal.showLoading();
                            }
                        }).then(
                                function () {
                                },
                                // handling the promise rejection
                                        function (dismiss) {
                                            if (dismiss === 'timer') {
                                                window.location.href = "index.html";
                                            }
                                        }
                                )
                            });

                } else {

                    swal({
                        position: 'top-right',
                        type: 'warning',
                        title: 'Invalid Username/Password',
                        showConfirmButton: false,
                        timer: 1500
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

    });

}
