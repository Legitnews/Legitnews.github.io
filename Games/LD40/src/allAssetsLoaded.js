var assets = document.getElementsByClassName("Asset");

var remainingToLoad = assets.length;

for (var i=0; i < assets.length; i++){
    assets[i].onload = function(){ remainingToLoad--; };
}

function allAssetsLoaded(){
    return remainingToLoad === 0;
}