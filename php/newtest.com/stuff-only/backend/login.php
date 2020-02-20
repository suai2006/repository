<?php
if(empty(filter_input(INPUT_POST,'submit'))){
	defined('_BACKENDLOCK') or die('Ай-яй-яй, сюда нельзя!');
}
include_once realpath(dirname(__FILE__).'/../../lib/startup.php');
$adminname='slava';
$adminpswd='754575';
if (isset($_POST['login']) and $_POST['login'] != ''){
	$login = $_POST['login'];
}
if (isset($_POST['password']) and $_POST['password'] != ''){
	$password = $_POST['password'];
}
if (empty($login) and empty($password) )
{
	$array = array(
		'login-error' => 'Не введен логин',
		'pass-error' => 'Не введен пароль'
	);
	echo json_encode(new ArrayValue($array), JSON_UNESCAPED_UNICODE);
}
else if(empty($login) and !empty($password))
{
	$array = array(
		'login-error' => 'Не введен логин'
	);
	echo json_encode(new ArrayValue($array), JSON_UNESCAPED_UNICODE);
}
else if(empty($password) and !empty($login))
{
	$array = array(
		'pass-error' => 'Не введен пароль'
	);
	echo json_encode(new ArrayValue($array), JSON_UNESCAPED_UNICODE);
}
else
{
	if($login != $adminname)
	{
		$array = array(
			'mistake' => 'Неверный логин или пароль'
		);
		echo json_encode(new ArrayValue($array), JSON_UNESCAPED_UNICODE);
	}
	else if($password != $adminpswd)
	{
		$array = array(
			'mistake' => 'Неверный логин или пароль'
		);
		echo json_encode(new ArrayValue($array), JSON_UNESCAPED_UNICODE);
	}
	else if ($login == $adminname and $password == $adminpswd)
	{
		session_start();
		$_SESSION['name'] = $adminname;
	}
}
