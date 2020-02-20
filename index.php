<?php
header('Content-Type: text/html; charset=utf-8');
mb_internal_encoding("UTF-8");

print_r($_SERVER);
require_once realpath(dirname(__FILE__)) . '/core/config.php';