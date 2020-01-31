/* 
 * We need to sum big numbers and we require your help.
 * Write a function that returns the sum of two numbers. The input numbers are strings and the function must return a string.
 * 
 * Example
 * add("123", "321"); -> "444"
 * add("11", "99");   -> "110"
 * 
 */
function add(a, b) {
  if (Number.isInteger(Number(a)) && Number.isInteger(Number(b))) {  
      a = a.replace(/^0+/, '').split("").map(Number);
      b = b.replace(/^0+/, '').split("").map(Number);    
      var min = (a.length - 1 > b.length - 1) ? b : a;
      var max = (a.length - 1 > b.length - 1) ? a : b;
      
      var cnt = max.length - min.length;      
      for (var i = 0; i < cnt; i++) {
          min.splice(i, 0, 0);
      }    
      
      var n = 0;
      var summ = new Array(max.length);      
      for (var i = max.length - 1; i >= 0; i--) {
          var sum = max[i] + min[i] + n;
          summ[i] = (sum.toString().length === 2 && i !== 0) ? Number(sum.toString()[1]) : sum;
          n = (sum.toString().length === 2) ? 1 : 0;
      }
      return (summ.join("") === "") ? "0" : summ.join("");
  }
}


