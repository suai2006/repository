admin={
	login: function(){
		var login=$('#login').val();
		var password=$('#password').val();
		$('#login_err').empty();
		$('#password_err').empty();
		params = {
			login : login,
			password:password,
			submit:'submit'
		};
		var request =$.ajax({
			url: "/stuff-only/backend/login.php",
			method: "POST",
			data:params
		});
		request.done(function( msg ) {
			var data;
			try {
				data = JSON.parse(msg);
				console.log(msg);
			} catch (e) {
				window.location.reload();
				return false;
			}
			if(data['login-error']){
				$('#login_err').text(data['login-error']);
			}
			if(data['pass-error']){
				$('#password_err').text(data['pass-error']);
			}
			if(data['mistake']){
				$('#login_err').text(data['mistake']);
				$('#password_err').text(data['mistake']);
			}
		});
		return false;
	}
};