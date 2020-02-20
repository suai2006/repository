<?php
set_time_limit(0);
function str_trim($str){
	$order   = array("\r\n", "\n", "\r");
	$replace = '';
	$newstr = str_replace($order, $replace, $str);
	return $newstr;
}
function writeToFile($hendle,$value){
	if (is_writable("total.txt")) {
		if(fwrite($hendle, $value."\r\n")===FALSE){
			echo 'Ошибка';
			exit;
		}
	}else {
		echo "Файл text3.txt недоступен для записи";
	}
}
$handle1 = fopen("text1.txt", "r");
$handle2 = fopen("text2.txt", "r");
$hendle3=fopen("total.txt", "w");
$line1 = fgets($handle1);
$line2 = fgets($handle2);
while (true) {	
	if(str_trim($line1)==str_trim($line2)){
		writeToFile($hendle3,str_trim($line1));
		$line1 = fgets($handle1);
		$line2 = fgets($handle2);
	}elseif(str_trim($line1)!=str_trim($line2)){		
		if(str_trim($line1)<str_trim($line2)){			
			if(!empty(str_trim($line1))){
				writeToFile($hendle3,str_trim($line1));
				$line1 = fgets($handle1);
			}else{
				writeToFile($hendle3,str_trim($line2));
				$line2 = fgets($handle2);
			}			
		}elseif(str_trim($line1)>str_trim($line2)){
			if(!empty(str_trim($line2))){
				writeToFile($hendle3,str_trim($line2));
				$line2 = fgets($handle2);
			}else{
				writeToFile($hendle3,str_trim($line1));
				$line1 = fgets($handle1);
			}			
		} else {
			break;
		}
	}	
	if ($line1 === false and $line2 === false) {
		break;
	}
}
fclose($handle1);
fclose($handle2);
$result=fopen("total.txt",'r');
while (!feof($result)) {
    $buffer = fgets($result, 1000);
    echo "<div>$buffer</div>";
}
fclose($result);