var assets = document.getElementsByName("Asset");

var remainingToLoad = assets.length;

for (var i=0; i < assets.length; i++){
    assets[i].onload = function(){ remainingToLoad--; };
}

function allAssetsLoaded(){
    return remainingToLoad === 0;
}