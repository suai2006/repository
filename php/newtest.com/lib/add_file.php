<?php
header('Content-Type: text/html; charset=utf-8');
// В PHP 4.1.0 и более ранних версиях следует использовать $HTTP_POST_FILES
// вместо $_FILES.
$rpath= $_SERVER['DOCUMENT_ROOT'].'/';
require_once $rpath.'/lib/function.php';
require_once $rpath.'/lib/work_function.php';
if(isset($_FILES['userfile'])){if($_FILES['userfile']==''){unset($_FILES['userfile']);die();}}
if(isset($_POST['sendfile'])){
	$db = mysqli_connect("localhost","slava","754575","my_db") or die("Error " . mysqli_error($db));
	$car = mysqli_connect("localhost","slava","754575","cars") or die("Error " . mysqli_error($car));
	$dir=$rpath.'image/';
	$target = $dir .basename($_FILES['userfile']['name']) ;
//	f_echo($_FILES['userfile']['type']);
//	die();
	$img_info=pathinfo($target);
	$img_format=array('jpg','JPG','png','PNG','JPEG','jpeg','BMP','bmp','GIF','gif');
	$flg_format=FALSE;
	foreach ($img_format as $key => $value) {
		if($img_info['extension']==$value){
			$flg_format=true;
		}
	}
	if($flg_format==FALSE){
		header("Location: http://slava:81/01072015.php");
	}else{
		if(move_uploaded_file($_FILES['userfile']['tmp_name'],$target)){
			$result = mysqli_query ($db,"INSERT INTO user_img (img_name) VALUES('".$_FILES['userfile']['name']."')");
			header("HTTP/1.1 301 Moved Permanently");
			header("Location: http://slava:81/01072015.php");
		}else{
			header("Location: http://slava:81/01072015.php");
		}
	}

}

