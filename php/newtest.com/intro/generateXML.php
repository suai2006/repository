<?php
defined('_BACKENDLOCK') or die('Ай-яй-яй, сюда нельзя!');
session_start();
include_once realpath(dirname(__FILE__).'/../../lib/startup.php');
//$xsldoc = new DOMDocument();
//$xsldoc->load(realpath(dirname(__FILE__).'/../../stuff-only/tpl/admin.xsl'));
//$doc = new DOMDocument();
//$doc->formatOutput = true;
//$root = $doc->createElement('pageinfo');
//$doc->appendChild($root);
//
//$doc->saveXML();
//$xsl = new XSLTProcessor();
//$xsl->importStyleSheet($xsldoc);
//echo $xsl->transformToXML($doc);
////Header("Content-type: application/xml; charset=utf-8");
////echo $doc->saveXML();


$xsldoc = new DOMDocument();
$xsldoc->load(realpath(dirname(__FILE__).'/../../stuff-only/tpl/admin.xsl'));
$xml = new SimpleXMLElement('<xml/>');

$character = $xml->addChild('character');
$character->addChild('name', 'Mr. Parser');
$character->addChild('actor', 'John Doe');

$xml->asXML();
$xsl = new XSLTProcessor();
$xsl->importStyleSheet($xsldoc);
//echo $xsl->transformToXML($xml);
Header('Content-type: text/xml');
print($xml->asXML());

$domtree = new DOMDocument('1.0', 'UTF-8');

/* create the root element of the xml tree */
$xmlRoot = $domtree->createElement("xml");
/* append it to the document created */
$domtree->appendChild($xmlRoot);

$currentTrack = $domtree->createElement("track");
$xmlRoot->appendChild($currentTrack);

/* you should enclose the following two lines in a cicle */
$currentTrack->appendChild($domtree->createElement('path','song1.mp3'));
$currentTrack->appendChild($domtree->createElement('title','title of song1.mp3'));
$currentTrack->appendChild($domtree->createElement('path','song2.mp3'));
$currentTrack->appendChild($domtree->createElement('title','title of song2.mp3'));

    /* get the xml printed */
Header("Content-type: application/xml; charset=utf-8");
echo $domtree->saveXML();