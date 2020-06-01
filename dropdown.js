var platform = document.getElementById("selectHardwarePlatform")
var select = document.getElementById("selectBinary");

var platforms = ["Daisy Seed", "Daisy Pod", "Daisy Patch", "Daisy Petal", "Daisy Field"]
var files = ["ex_adenv", "ex_adsr", "etc."]

for (var i = 0; i < files.length; i++) {
    var opt = files[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

for (var i = 0; i < files.length; i++) {
    var opt = files[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}
