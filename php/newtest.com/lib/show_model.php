<?php
header('Content-Type: text/html; charset=utf-8');
//подключение к БД
$car = mysqli_connect("localhost","slava","754575","cars") or die("Error " . mysqli_error($car));
if(isset($_GET['brand'])){ $brand = $_GET['brand']; }
	//Запрос в БД
$tsql = "SELECT tm.id,tm.model_name FROM `brand` tb
		LEFT OUTER JOIN `model` tm ON tb.id=tm.bid
		WHERE tb.id=".mysqli_real_escape_string($car,$brand)."" or die("Error in the consult.." . mysqli_error($link));

$res = $car->query($tsql);

echo '<select id="model" name="model" class="search__select-box" onchange="showYear(this.value,0)">';
echo '<option>Выберете модель</option>';
//Вывод массива данных из БД
while($step2 = mysqli_fetch_array($res)){
	$model=$step2["model_name"];
	$id=$step2["id"];
	echo "<option value=".$id.">".$model."</option>";
}
echo '</select>';

mysqli_close($car);