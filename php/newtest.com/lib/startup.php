<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding("UTF-8");
$site='http://'.$_SERVER['HTTP_HOST'];
$url=$_SERVER['PHP_SELF'];
require_once realpath(dirname(__FILE__).'/../lib/db_conect.php');
require_once realpath(dirname(__FILE__).'/../lib/function.php');
require_once realpath(dirname(__FILE__).'/../lib/work_function.php');
require_once realpath(dirname(__FILE__).'/../lib/resize_crop.php');
#Автозагрузка классов
spl_autoload_register(function ($class) {
	$filename = realpath(dirname(__FILE__).'/../lib/classes/'.$class.'.php');
    include_once($filename);
});

//$files1 = scandir($rpath.'css/smile');
//unset($files1[0]);unset($files1[1]);
//$file=array_values($files1);
//
//foreach ($file as $key => $value) {
//	echo '"'.$value.'",';
//}
class ArrayValue implements JsonSerializable {
	public function __construct(array $array) {
		$this->array = $array;
	}

	public function jsonSerialize() {
		return $this->array;
	}
}