function rot13(str) {
	str = str.toUpperCase()
	var solved = ""
	for (var i=0;i<str.length; i++){
		var asciiNum = str[i].charCodeAt()
		if (asciiNum >=65 && asciiNum <= 77){
			solved += String.fromCharCode(asciiNum + 13)
		} else if (asciiNum >=78 && asciiNum <= 90){
			solved += String.fromCharCode(asciiNum - 13)
		} else{
			solved += str[i]
		}
	}
    console.log(solved)
	return solved
}

rot13("TNOEVRY YVAQB") /// your string 