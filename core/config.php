<?php

spl_autoload_register(function ($class) {
	$filename = realpath(dirname(__FILE__).'/../core/classes/'.$class.'.php');
    include_once($filename);
});
