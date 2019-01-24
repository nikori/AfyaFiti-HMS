/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var environment = 'DEV';
// var environment = 'PROD';
var appName = 'MED ASSIST';
var appVersion = '1.0';
var username = '';
var user_id = null;
var c_facility_id = null;
var logged = false;

if (environment === 'PROD') {
//    var apiUrl = 'http://192.168.0.110:3002/api/';

//    var apiUrl = 'http://197.248.10.20:3002/api/';
    var apiUrl = 'http://127.0.0.1:3002/api/';
//     var localUrl = 'http://127.0.0.1:3002/api/';


} else if (environment === 'DEV') {
    var apiUrl = 'http://127.0.0.1:3002/api/';
//    var apiUrl = 'http://192.168.0.110:3002/api/';
    // var apiUrl = 'http://197.248.10.20:3002/api/';

    // var localUrl = 'http://127.0.0.1:3002/api/';
//    var apiUrl = 'http:/127.0.0.1:3002/api/';

    var apiUrl = 'http://127.0.0.1:3002/api/';
    var localUrl = 'http://127.0.0.1:3002/api/';

}

localStorage.setItem("API_URL", apiUrl);
localStorage.setItem("LOCAL_URL", localUrl);
localStorage.setItem("App_Name", appName);

