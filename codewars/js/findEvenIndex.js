function findEvenIndex(arr)
{
  var trueArr = [];
  for(var i = 0; i < arr.length; i++){	
  	var leftSumm = 0;
    var rightSumm = 0;
  	var newArr1 = arr.slice(i + 1,arr.length);
  	var newArr2 = arr.slice(0, i);
  	if(newArr1.length > 0){
      var rightSumm = newArr1.reduce(function (res, cur) {
          return res + cur;
      });
  	}  	
  	if(newArr2.length > 0){
      var leftSumm = newArr2.reduce(function (res, cur) {
          return res + cur;
      }); 
  	}	 	
  	trueArr.push(leftSumm === rightSumm);
  }
  return trueArr.indexOf(true);
}