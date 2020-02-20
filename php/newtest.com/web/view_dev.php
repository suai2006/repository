<?php

defined('_LOCK') or die('Ай-яй-яй, сюда нельзя!');
include_once realpath(__DIR__ . '/../lib/startup.php');
$tpl = new tempelate();
$tpl->db = $db;
if (!empty(filter_input(INPUT_GET, 'page'))) {
    $tpl->id = $db->real_escape_string(filter_input(INPUT_GET, 'page'));
} else {
    $tpl->id = '';
}
$tpl->value = array
    (
    'menu' => 'id,pagetitle,uri,parent',
    'content' => 'id,pagetitle,content'
);
$tpl->table = array
    (
    "site_content"
);
$tpl->where = array
    (
    "parent=0",
    "uri='" . $tpl->id . "'"
);
$tpl->rootTag = 'pageinfo';
$tpl->parent = 'menu';
$tpl->child = 'link';
echo $tpl->xmlDoc('index.xsl');
mysqli_close($db);
