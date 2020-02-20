<?php
# Функция для получения многомерного массива (списка) из базы
function getMyRecursivMenu(){
	global $db;
	$pages="SELECT * FROM site_content" or die("Error in the consult.." . mysqli_error($db));
	$result=$db->query($pages);
	while ($row=$result->fetch_assoc()){
		$data[$row['id']]=$row;
	}
	$item=array();
	foreach ($data as $id=>&$val) {
		if ( $val['parent'] == 0 ) {
			$item[$id] = &$val;
		}else {
			$data[$val['parent']]['child'][$id] = &$val;
		}
	}
	return $item;
}
#Функция для вывода списка деревом с неограниченным уровнем вложенности
#можно использовать для отладки
function view_cat ($data) {
	foreach ($data as $menu) {
	   echo '<li><a href="?id='.$menu["id"].'">'.$menu["pagetitle"].'</a>';
	   if($menu['child']) {
		  echo '<ul class="submenu">';
		  view_cat($menu['child']);
		  echo '</ul>';
	   }
	   echo '</li>';
	}
}

function getContent($table,$pageSize,$show_pages){
	//$table-таблица где делается выборка
	//$pageSize-колличество выводимых элементов
	//$show_pages-колличество цифр выводимых в многостраничности
	global $search;
	global $db;
	// Общее количество записей

	$str=explode(' ',$search);
	foreach ($str as $value) {
		$arr[]= "content LIKE '%$value%' ";
		$arr[]= "pagetitle LIKE '%$value%' ";
	}
	if(mb_strlen($search, "utf-8") > 3){
		$row="MATCH (content,pagetitle) AGAINST('*$search*' IN BOOLEAN MODE)";
	}else{
		$row=implode(" OR ", $arr);
	}
	$itemsTotal=mysqli_fetch_assoc($db->query("SELECT COUNT(*) AS total FROM ".$table." WHERE ".$row));
	$itemsTotal=$itemsTotal["total"];
	// Общее количество страниц
	$pagesTotal=ceil($itemsTotal/$pageSize);

	// Текущий номер страницы
	$page=(int)$_REQUEST["page"];
	$page=max(min($page,$pagesTotal),1);

	$left = $page - 1;
    $right = $pagesTotal - $page;
	if ($left < floor($show_pages / 2)) {$start = 1;}
	else {$start = $page - floor($show_pages / 2);}
    $end = $start + $show_pages - 1;
    if ($end > $pagesTotal) {
      $start -= ($end - $pagesTotal);
      $end = $pagesTotal;
	  if ($start < 1) {$start = 1;}
    }

	// Смещение в таблице
	$offset=($page-1)*$pageSize;
	// Массив записей для данной страницы

	$res=$db->query("SELECT * FROM ".$table." WHERE ".$row." LIMIT $offset,$pageSize");
	$items=array();
	while($item=$res->fetch_assoc()) {$items[]=$item;}

	return $data=array(
		'items'=>$items,
		'itemsTotal'=>$itemsTotal,
		'pagesTotal'=>$pagesTotal,
		'pageSize'=>$pageSize,
		'page'=>$page,
		'show_pages'=>$show_pages,
		'start'=>$start,
		'end'=>$end,
		'search'=>$search,
	);
}

//функция для вывода многостраничности

function multipages($data){
	global $site;
	global $twig;
	global $search;
	global $url;
	//$url=$_SERVER['PHP_SELF'];
	$page.=$twig->loadTemplate('multipages.twig')->render( array(
		'data'=>$data,
		'site'=>$site,
		'url'=>$url,
		'search'=>$search,
	));
	return html_entity_decode($page);
}

#функция для вывода многостраничности
#можно использовать для отладки
function mp($data){
	echo'<div>';
	echo'Страницы: ';
	if($data['page']!=1){
		echo'<a href="/pagination.php" title="Первая страница">&lt;&lt; </a>';
		if($data['page']==2){
			echo '<a href="/pagination.php" title="Предыдущая страница">&lt;</a>';
		}else{
			echo '<a href="/pagination.php?page='.($data['page']-1).'" title="Предыдущая страница"> &lt; </a>';
		}
	}
	 for ($i = $data['start']; $i <= $data['end']; $i++) {
	   if ($i == $data['page']) {
		   echo'<span> ['.$i.'] </span>';
	   } else {
		   if ($i == 1) {
			   echo '<a href="/pagination.php"> '.$i.' </a>';
		   }
		   else {
			   echo '<a href="/pagination.php?page='.$i.'"> '.$i.' </a>';
		   }
		}
	 }
	 if($data['page']!=$data['pagesTotal']){
		echo '<a href="/pagination.php?page='.($data['page']+1).'" title="Следующая страница"> &gt; </a>';
		echo'<a href="/pagination.php?page='.$data['pagesTotal'].'" title="Следующая страница"> &gt;&gt; </a>';
	}
	 echo'</div>';
}
#Функция получения сообщени
function getMess($table,$pageSize,$show_pages){
	global $db;
	$itemsTotal=mysqli_fetch_assoc($db->query("SELECT COUNT(*) AS total FROM ".$table));
	$itemsTotal=$itemsTotal["total"];
	// Общее количество страниц
	$pagesTotal=ceil($itemsTotal/$pageSize);

	// Текущий номер страницы
	$page=(int)$_REQUEST["page"];
	$page=max(min($page,$pagesTotal),1);

	$left = $page - 1;
    $right = $pagesTotal - $page;
	if ($left < floor($show_pages / 2)) {$start = 1;}
	else {$start = $page - floor($show_pages / 2);}
    $end = $start + $show_pages - 1;
    if ($end > $pagesTotal) {
      $start -= ($end - $pagesTotal);
      $end = $pagesTotal;
	  if ($start < 1) {$start = 1;}
    }

	// Смещение в таблице
	$offset=($page-1)*$pageSize;
	// Массив записей для данной страницы

	$res=$db->query("SELECT * FROM ".$table." ORDER BY id DESC LIMIT $offset,$pageSize");
	$items=array();
	while($item=$res->fetch_assoc()) {$items[]=$item;}

	return $data=array(
		'items'=>$items,
		'itemsTotal'=>$itemsTotal,
		'pagesTotal'=>$pagesTotal,
		'pageSize'=>$pageSize,
		'page'=>$page,
		'show_pages'=>$show_pages,
		'start'=>$start,
		'end'=>$end,
	);
}
function loadStart(){
	$time1 = microtime();
	$timeToArr = explode(' ', $time1);
	$timeRes = $timeToArr[1] + $timeToArr[0];
	$start = $timeRes;
}
function loadEnd(){
	$time2 = microtime();
	$timeToArr2 = explode(' ', $time2);
	$timeRes2 = $timeToArr2[1] + $timeToArr2[0];
	$finish = $timeRes2;
	$total_time = round(($finish - $start), 4);
	//echo 'Страница сформирована за '.$total_time.' секунд.'."\n";
}