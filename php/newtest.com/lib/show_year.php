<?php
header('Content-Type: text/html; charset=utf-8');
//подключение к БД
$car = mysqli_connect("localhost","slava","754575","cars") or die("Error " . mysqli_error($car));
if(isset($_GET['model'])){ $model = $_GET['model']; }
	//Запрос в БД
$tsql = "SELECT ty.year FROM `brand` tb
		LEFT OUTER JOIN `model` tm ON tb.id=tm.bid
		LEFT OUTER JOIN `year` ty ON tm.id=ty.mid
		WHERE tm.id=".mysqli_real_escape_string($car,$model)."" or die("Error in the consult.." . mysqli_error($link));
$res = $car->query($tsql);
echo '<select id="year" name="year" class="search__select-box">';
echo '<option>Выберете год</option>';
//Вывод массива данных из БД
while($step2 = mysqli_fetch_array($res)){
	$year=$step2["year"];
	if($year!=NULL){
		echo "<option value=".$year.">".$year."</option>";
	}
	
}
echo '</select>';
//SELECT tb.name, tm.name, ty.year, tu.name, tu.phone FROM cars.`brand` tb
//LEFT OUTER JOIN cars.`model` tm ON tb.id=tm.bid
//LEFT OUTER JOIN cars.`year` ty ON tm.id=ty.mid
//LEFT OUTER JOIN my_db.`user` tu ON ty.id=tu.id
//WHERE ty.year;
mysqli_close($car);

