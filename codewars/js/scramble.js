function scramble(str1, str2) {
    var pattern = str1, search = str2;
    for(let i=0; i < search.length; i++){
  		var regex = new RegExp(search[i],"igs");
  		if(pattern.match(regex) === null || pattern.match(regex).length < search.match(regex).length){
  			return false;
  		}
    }
    return true;
}