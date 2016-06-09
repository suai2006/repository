//Пример each function
//	$('.dropodown').each(function(i, element){
//		$(this).on('click', function(){
//			//console.log($(element).get(0).src);
//			$("#"+to).append('<img class="smile" src='+$(element).get(0).src+'>');
//			$("#placeholder").hide();
//		});
//	});

function valid_mail(email) {
	var reg =/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;//send.php
	return reg.test(email);
 }
 function valid_phone(phone){
	 var num=/^( +)?((\+?7|8) ?)?((\(\d{3}\))|(\d{3}))?( )?(\d{3}[\- ]?\d{2}[\- ]?\d{2})( +)?$/;
	 return num.test(phone);
 }
//			$('#send').on('click',function(){
//				var e = $('#email').val();
//				var ev = valid_phone(e);
//				if(ev == false){
//					alert(e+'-not correct');
//				}
//			});

function check_error(){
	var emailval = $('#email').val();
	var emailvalid = valid_mail(emailval);
	var text =$('#text').val();
	var a = 10;
	var valid = true;

	if (emailvalid == false) {
		$('#email').css({outline: '1px solid red'});
		$('#mail_error').html('Введите email');
		valid = false;
	}else if(emailvalid == true){
		$('#email').css({outline: 'none'});
		$('#email').empty();
	}
	if(text.length < a ){
		$('#text').css({outline: '1px solid red'});
		$('#text_error').html('Введите телефон');
		valid = false;
	}else{
		$('#text').css({outline: 'none'});
		$('#text_error').empty();
	}
	return valid;
}
function showModel(id){
	if($('#brand').val() > 0){
		params = {
			brand: id
	};
	$.ajax({
		type: 'get',
		url: "/lib/show_model.php",
		cache: false,
		data: params,
		success: function(data){
			$("#models").html(data);
		}
	});
	}else{
		$("#models").html('\
			<select id="models_sel" class="search__select-box" disabled="disabled">\n\
				<option>Выберете модель</option>\n\
			</select>');
		$("#years").html('\
			<select id="year_sel" class="search__select-box" disabled="disabled">\n\
				<option>Выберете год</option>\n\
			</select>');
	}

}
function showYear(id){
	if($('#model').val() > 0 ){
		params = {
			model: id
		};
	$.ajax({
		type: 'get',
		url: "/lib/show_year.php",
		cache: false,
		data: params,
		success: function(data){
			$("#years").html(data);
		}
	});
	}else{
		$("#years").html('\
			<select id="year_sel" class="search__select-box" disabled="disabled">\n\
				<option>Выберете год</option>\n\
			</select>');
	}

}
function showHiddenTopMenu(){
	$('#main__top-hide-nav-480').toggle();
}
//function showSubNav(){
//	$('#main__top-subnav').toggle();
////	$(document).mouseup(function (e){ // событие клика по веб-документу
////		var div = $("#main__top-subnav"); // тут указываем ID элемента
////		if (!div.is(e.target) // если клик был не по нашему блоку
////		    && div.has(e.target).length === 0) { // и не по его дочерним элементам
////			div.hide(); // скрываем его
////		}
////	});
//}
jQuery(function($){
	$('#main__top-nav-li6').on('click', function(){
		$('#main__top-subnav6').toggle();
		return false;
	});
	$(document).click(function() {
		$("#main__top-subnav6").hide();
	});

	$("#main__top-subnav6").click(function(e) {
		e.stopPropagation();
	});
});
function showLoginForm(){
	$('body').prepend('<div id="login"></div>');
	$('body').css({overflow:'hidden'});
	$.ajax({
		type: "POST",
		url: "/login/index.php",
		cache: false,
		//data: params,
		success: function(data){
			$("#login").html(data);
		}
	});
}
function hideLoginForm(){
	$("#login").remove();
	$('body').css({overflow:'auto'});
}
function checkAdminForm(){
	var login = $('#login').val();
	var pass =$('#password').val();
	var valid = true;

	if(login.length < 2){
		$('#login').css({outline: '1px solid red'});
		$('#error_admin_name').html('Введите логин');
		valid = false;
	}else{
		$('#login').css({outline: 'none'});
		$('#error_admin_name').empty();
	}
	if(pass.length < 3 ){
		$('#password').css({outline: '1px solid red'});
		$('#error_admin_pass').html('Введите пароль');
		valid = false;
	}else{
		$('#password').css({outline: 'none'});
		$('#error_admin_pass').empty();
	}
	return valid;
}
$(document).ready(function(){
	var h=$(window).height()-40;
	$('.admin_main-left').css({height:+h });

	// Открытие и скрытие подменю Только для 2-х уровней
//	$("li.dropodown").each(function(i, element){
//		//console.info(element);
//		$(this).click(function(){
//			$(".submenu").hide('slow');
//			$(this).find('ul').toggle('slow');
//			console.info($(this));
//			return false;
//		});
//		$(document).click(function() {
//			$(".submenu").hide('slow');
//		});
//		$(".submenu").click(function(e) {
//			e.stopPropagation();
//		});
//	});
});
function creatNewDoc(){
$.ajax({
		type: "POST",
		url: "/admin/manager/create_doc.php",
		cache: false,
		success: function(data){
			$("#admin_main-right").html(data);
		}
	});
}
function get_mess(){
	$.ajax({
		url: "/messages/send_mess.php",
		cache: false,
		success: function(data){
			$("#site-mess").html(data);
		}
	});
}
function add_mess(){
	var msg   = $('#formx').serialize();
	var name=$("#name").val();
	var mess=$("#mess").html();
	//var valid=true;
	if(name.length==0 || mess.length==0){
		return false;
	}
	params = {
			name: name,
			mess:mess
	};
	$.ajax({
		type: "POST",
		url: "/messages/send_mess.php",
		cache: false,
		data: params,
		success: function(data){
			//$("#name").val("Гость");
			//$("#mess").html("");
			get_mess(data);
		}
	});
}


function loadMess(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/messages/send_mess.php", false);
  xhttp.send();
  document.getElementById(id).innerHTML = xhttp.responseText;
}

function new_mess(id){
	var http=null;
	var name=document.getElementById("name").value;
	//var mess=document.getElementById("mess").value;
	var mess=document.getElementById("mess").innerHTML;
	console.log(mess);
	var data="name=" + name + "&mess=" + mess;
	if(data=='name=&mess='){
		return false;
	}
	console.info(data);
	//return false;
	if (window.XMLHttpRequest){
	// код для IE7+, Firefox, Chrome, Opera, Safari
		http=new XMLHttpRequest();
	}else {
	// код для IE6, IE5
		http=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(http){
		http.open("POST","/messages/send_mess.php",true);
		http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		http.onreadystatechange=function(){
			if (http.readyState==4 && http.status==200){
				http.responseText;
			}
		};
		http.send(data);
		document.getElementById("name").value='';
		//document.getElementById("mess").value='';
		document.getElementById("mess").innerHTML='';
		loadMess(id);
	}else{
		document.getElementById(id).innerHTML = 'Ошибка подключения к серверу';
	}
}

//Добавить смайлик
//to- id поля куда вставлять смайл
//img- название картинки
smile={
	small:['sml32','sml33','sml1','sml2','sml2','sml3','sml4','sml5','sml6','sml7','sml8',
			'sml9','sml10','sml11','sml12','sml13','sml14','sml15','sml16','sml18',
			'sml19','sml20','sml21','sml22','sml23','sml24','sml25','sml26',
			'sml27','sml28','sml29','sml30','sml31']
	};
function addSmile(to,img){//
	sml='<img class="f_smile '+img+'" src="/css/img/blank.gif" title=":~'+img+'~:">';
	$("#"+to).append(sml);
}
function showSmile(mess,num){
	$("#add_smile__list").html('');
	smiles_img = '';
		for(i=0; i<=smile[num].length-1; i++){
			sm = smile[num][i];
			//smiles_img += '<img class="dropodown" onmousedown="return addSmile(\''+mess+'\',\''+sm+'\')" src="/test/css/smile/'+sm+'.gif" alt=""/>';
			smiles_img += '<span class="a_smile '+sm+'" onmousedown="addSmile(\''+mess+'\',\''+sm+'\');" title=":~'+sm+'~:" alt=""/></span>';
		}
	$('#add_smile__list').prepend(smiles_img);
}
//javascript:void(document.body.contentEditable = true);