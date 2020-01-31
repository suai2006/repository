var snail = function(array) {
	var result = [];
	
  for (var i = 0; i < Math.floor((array.length + 1)/2); i++){
		var circle = [];
    var curLine = array[i].slice(i,array.length-i);
    var bottomLine = array[array.length - i - 1].slice(i,array.length - i).reverse();

    circle = circle.concat(curLine);

    for(var j = i+1; j <array.length-1-i; j++){
        circle.push(array[j][array.length-1-i]);			
    }
    circle = (i === array.length - 1 - i) ? circle.concat([]) : circle.concat(bottomLine);

    for(var k = array.length - 2 - i; k >= i + 1; k--){
        circle.push(array[k][i]);			
    }
		result = result.concat(circle);
  }
  return result;
};