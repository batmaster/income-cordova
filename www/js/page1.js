//var connect_db = "http://localhost/text_php_helloworldconnet/connect_db.php";
//var connect_db = "http://172.20.10.4/text_connet/connect_db.php";
//var connect_db = "http://192.168.1.34/text_connet/connect_db.php";
var connect_db = "http://localhost/php_helloworld/connect_mysql.php";

var version_app = "1.0.0 beta";
$(document).ready(function(){
	$(document).on("click", "#pageone .submit_login" ,function (event) {
		var user_id = $("#pageone #user_id").val();
		var user_pass = $("#pageone #user_pass").val();
		if(user_id==""){
			alert("User faild");
			$("#pageone #user_id").focus();
		}else if(user_pass==""){
			alert("Password faild");
			$("#pageone #user_pass").focus()
		}else{
			$.post(connect_db,{
			type:"page1",
			user_id: user_id,
			user_pass: user_pass
			},function(data){
				if(data=="Y"){
				  localStorage.setItem("local_user_id", user_id);
				  localStorage.setItem("local_user_pass", user_pass);
				  $.mobile.changePage( $("#pagetwo"), "none", true, true);
				}else{
					alert("user and password faild...!! ");
					$("#pageone #user_id").focus();
				}
			});
		}
	});
});