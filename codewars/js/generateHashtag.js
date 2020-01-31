function generateHashtag (str) {
    var hashTag,arr = [];
    if(str!==""){
        arr = str.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s+/igs," ").split(" ").map(function(s){
            return (s!=="")?s[0].toUpperCase() + s.substring(1, s.length):null;
        }).filter(Boolean);
        hashTag = (arr.length > 0)? "#"+arr.join(""):false;
		if(hashTag !== false && hashTag.length > 140){
			hashTag = false;
		}
    }
    else{
        hashTag = false;
    }
    return hashTag;
}