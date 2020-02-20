<?php
$db = new mysqli('localhost', 'root', '754575', 'my_db');
if ($db->connect_error) {
    die('Ошибка подключения (' . $db->connect_errno . ') '
            . $db->connect_error);
}
if (mysqli_connect_error()) {
    die('Ошибка подключения (' . mysqli_connect_errno() . ') '
            . mysqli_connect_error());
}
$db->query("set names utf8");        
//$dsn='mysql:host=localhost;dbname=my_db';
//$opt = array(
//    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
//    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
//);
//$db = new PDO($dsn, 'slava', '754575', $opt);