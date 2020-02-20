<?php
defined('_BACKENDLOCK') or die('Ай-яй-яй, сюда нельзя!');
session_start();
include_once realpath(dirname(__FILE__).'/../../lib/startup.php');
$session = '';
if(isset($_SESSION['name'])){
	$session = $_SESSION['name'];
}
if($session){
	$tpl='main.xsl';
}
else{
	$tpl='login.xsl';
}
$xsldoc = new DOMDocument();
$xsldoc->load(realpath(dirname(__FILE__).'/../../stuff-only/tpl/'.$tpl));
$doc = new DOMDocument();
$doc->formatOutput = true;
$root = $doc->createElement('xml');
$doc->appendChild($root);
$doc->saveXML();

$xsl = new XSLTProcessor();
$xsl->importStyleSheet($xsldoc);
echo $xsl->transformToXML($doc);

//Header("Content-type: application/xml; charset=utf-8");
//echo $doc->saveXML();