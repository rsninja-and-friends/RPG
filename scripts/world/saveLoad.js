// save
document.getElementById("save").onclick = function () {
    var exportObj = getRoomObject();

    // create download link
    var link = document.createElement("a");
    link.download = document.getElementById("name").value;
    var blob = new Blob([JSON.stringify(exportObj)], { type: "application/json" });
    link.href = URL.createObjectURL(blob);

    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
};

// load
document.getElementById("fileUpload").onchange = function () {
    if (document.getElementById("fileUpload").files[0] !== undefined) {
        if(worldTiles.length !== 0) {
            trackUndo();
        }
        fetch(URL.createObjectURL(document.getElementById("fileUpload").files[0])).then((response) => response.json().then((data) => { loadRoomObject(data); buildSelection.objectIndex = -1; generateObjectUI(); centerCameraOn(0, 0);}));
    }
};