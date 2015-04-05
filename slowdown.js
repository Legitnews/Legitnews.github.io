"use strict";

var hugeImages = [
	"http://img4.wikia.nocookie.net/__cb20091230105332/trekcreative/images/7/78/Galaxy_Map-Huge.jpg",
	"http://upload.wikimedia.org/wikipedia/commons/c/cb/PAUL_DELAROCHE_-_Ejecuci%C3%B3n_de_Lady_Jane_Grey_%28National_Gallery_de_Londres%2C_1834%29.jpg",
	"https://upload.wikimedia.org/wikipedia/commons/6/66/Map_of_London.jpg",
	"http://upload.wikimedia.org/wikipedia/commons/f/f5/The_Three_Graces%2C_by_Peter_Paul_Rubens%2C_from_Prado_in_Google_Earth.jpg",
	"http://upload.wikimedia.org/wikipedia/commons/f/fe/Trajan%27s_Column_Panorama.jpeg",
	"http://upload.wikimedia.org/wikipedia/commons/1/11/Galactic_Cntr_full_cropped.jpg",
	"http://upload.wikimedia.org/wikipedia/commons/b/b1/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF.jpg",
	"https://www.llnl.gov/news/newsreleases/2012/Jul/images/23979_preamplifier2_blue_big.jpg",
	"http://farm6.staticflickr.com/5347/7401451012_aede80f650_o.png",
];

function main(){
	console.log("This page has been slowed down today. Support Net Neutrality so this never has to happen again. http://www.savetheinternet.com/net-neutrality");

	for (var i=0; i < hugeImages.length; i++){
		var img = new Image();
		img.src = hugeImages[i];

		while (! img.complete){ }; //Stall until image loads.
	}
}

main();
