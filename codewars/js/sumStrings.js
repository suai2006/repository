function sumStrings(a,b) { 
  if(Number.isInteger(Number(a)) && Number.isInteger(Number(b))){
    var num1=a.replace(/^0+/, '').split("").map(Number);
    var num2=b.replace(/^0+/, '').split("").map(Number);
    var cnt = (num1.length - 1 > num2.length - 1)? num1.length-num2.length:num2.length-num1.length;
    var min = (num1.length - 1 > num2.length - 1)? num2 : num1;
    var max = (num1.length - 1 > num2.length - 1)? num1 : num2;
    for(var i = 0;i < cnt;i++){
        min.splice(i,0,0);
    }
    var n=0;
    var summ = new Array(max.length);
    for(var i = max.length-1;i >= 0;i--){
		var sum = max[i] + min[i] + n;
        summ[i] = (sum.toString().length === 2 && i!==0)?Number(sum.toString()[1]):sum;
        n = (sum.toString().length === 2) ? 1 : 0;
    }
	  return (summ.join("")==="")?"0":summ.join("")
  }
}