// save
dGet("save").onclick = function () {
    var exportObj = getRoomObject();

    // create download link
    var link = dMake("a");
    link.download = dGet("name").value;
    var blob = new Blob([JSON.stringify(exportObj)], { type: "application/json" });
    link.href = URL.createObjectURL(blob);

    // click the link
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
};

// load
dGet("fileUpload").onchange = function () {
    if (dGet("fileUpload").files[0] !== undefined) {
        if (worldTiles.length !== 0) {
            trackUndo();
        }
        fetch(URL.createObjectURL(dGet("fileUpload").files[0])).then((response) =>
            response.json().then((data) => {
                loadRoomObject(data);
                buildSelection.objectIndex = -1;
                generateObjectUI();
                centerCameraOn(0, 0);
            })
        );
    }
};
