$(document).ready(function(){
	$(document).on('pagebeforeshow','#pagetwo', function() {
		var user_id = localStorage.getItem("local_user_id");
		var user_pass = localStorage.getItem("local_user_pass");
		$("#pagetwo .user_id").html(user_id);
		$("#pagetwo .user_pass").html(user_pass);
	});
});