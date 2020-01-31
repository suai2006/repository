var Sudoku = function (data)
{
    var n = data.length;
    var sN = Math.floor(Math.sqrt(n));
    var worckData = JSON.parse(JSON.stringify(data));
    
    function valid(data){
        var sortArr = [];
        
        for(var i=0; i < n; i += sN){
            var arr = JSON.parse(JSON.stringify(worckData.slice(i, i + sN)));
            for(k=0;k < n; k += sN){
                var cub = [];
                cub = arr.map((x) => x.slice(k, k + sN)).reduce((acc, val) => acc.concat(val), []);
                if([...new Set(cub)].length < cub.length){
                    return false;
                }
            }                   
            
        }               
        
        for(var i = 0; i < data.length; i++){
            if (data.length !== data[i].length) return false;
            var x = [];
            var y = [];               
            
            for(var j = 0; j < data.length; j++){                        
                if(typeof data[j][i] !== "number" || typeof data[i][j] !== "number") return false;                        
                if(data[j][i] === 0 || data[i][j] === 0 || data[j][i] > data.length || data[i][j] > data.length) return false;
                x.push(data[j][i]);
                y.push(data[i][j]);
            }
            if([...new Set(y)].length === data[i].length && [...new Set(x)].length === data[i].length){
              sortArr.push(true); 
            }
            else{
               return false;
            }

        }
        
        return sortArr.every( v => v === true);
    }        

    //   Public methods
    // -------------------------
    return {
        isValid: function () {
            // YOUR SOLUTION
            
            return valid(data);
        }
    };
};


