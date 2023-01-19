let objects = new Map; // All drawn stuff

// Lines drawing mode
let startPos = null;

// Quads drawing mode
let quadPos = [];

let drawing = false;

function clearIntermediateDrawing()
{
    quadPos = [];
}

function nextId()
{
    let i = 0;
    let release = false;

    while (!release)
    {
        release = true;

        for (const [id, obj] of objects)
        {
            if (id === i.toString())
            {
                release = false;
                i++;
            }
        }
    }

    return i;
}

function startDrawing(pos)
{
    switch (tool)
    {
        case "lines":
            startPos = pos;
            break;
    }

    drawing = true;
}

function endDrawing(pos)
{
    if (tool === "lines" && startPos == null) return;

    const objIdStr = nextId().toString();

    switch (tool)
    {
        case "lines":
            const object =
                {
                    name: lang.line + objIdStr,
                    type: "line",
                    start: startPos,
                    end: pos,
                    selected: false
                };

            objects.set(objIdStr, object);
            pushEvent("add", objIdStr);

            break;

        case "quads":
            if (quadPos.length < 3)
            {
                quadPos.push(pos);
            }
            else
            {
                const object =
                    {
                        name: lang.quad + objIdStr,
                        type: "quad",
                        pos1: quadPos[0],
                        pos2: quadPos[1],
                        pos3: quadPos[2],
                        pos4: pos,
                        selected: false
                    };

                objects.set(objIdStr, object);
                pushEvent("add", objIdStr);

                quadPos = [];
            }

            break;
    }

    refreshObjectsList(true);
    startPos = null;
    drawing = false;
}

function clearDrawing()
{
    startPos = null;
    drawing = false;
}

const objectsList = el("objectsList");

function refreshObjectsList(scrollDown)
{
    objectsList.innerHTML = "";

    for (const [id, obj] of objects)
    {
        const span = document.createElement("span");
        objectsList.appendChild(span);
        span.innerHTML = obj.name;
        span.className = "objectRow";
        span.onclick = () => { showInfo(id); };
    }

    if (scrollDown) objectsList.scrollTop = objectsList.scrollHeight;
}

function unselectAnyObjects()
{
    for (const [id, obj] of objects)
    {
        obj.selected = false;
    }

    selectedId = null;
}

let selectedId = null;

function showInfo(id)
{
    const table = el("infoTable");
    table.innerHTML = "";

    function addInput(name, value, isNumber, callback)
    {
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdInput = document.createElement("td");
        table.appendChild(tr);
        tr.appendChild(tdName);
        tr.appendChild(tdInput);

        tdName.innerHTML = name + ":";

        const input = document.createElement("input");
        tdInput.appendChild(input);
        input.value = value;
        input.style.userSelect = "auto";
        input.type = isNumber ? "number" : "text";
        input.onchange = () => { callback(input.value); };
    }

    if (objects.has(selectedId)) objects.get(selectedId).selected = false;

    hide(el("infoDeleteButton"));

    selectedId = id;
    if (id == null) return;

    show(el("infoDeleteButton"));

    const obj = objects.get(id);
    obj.selected = true;

    for (const property in obj)
    {
        switch (property)
        {
            case "name":
                addInput(lang.nameInfo, obj.name, false, (v) =>
                {
                    if (v.trim().length === 0) return;
                    obj.name = v;
                });
                refreshObjectsList();
                break;

            // lines
            case "start":
                addInput(lang.startX, obj.start.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.start.x = parseFloat(v);
                });
                addInput(lang.startY, obj.start.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.start.y = parseFloat(v);
                });
                break;

            case "end":
                addInput(lang.endX, obj.end.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.end.x = parseFloat(v);
                });
                addInput(lang.endY, obj.end.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.end.y = parseFloat(v);
                });
                break;

            // quads
            case "pos1":
                addInput(lang.pos1X, obj.pos1.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos1.x = parseFloat(v);
                });
                addInput(lang.pos1Y, obj.pos1.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos1.y = parseFloat(v);
                });
                break;

            case "pos2":
                addInput(lang.pos2X, obj.pos2.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos2.x = parseFloat(v);
                });
                addInput(lang.pos2Y, obj.pos2.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos2.y = parseFloat(v);
                });
                break;

            case "pos3":
                addInput(lang.pos3X, obj.pos3.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos3.x = parseFloat(v);
                });
                addInput(lang.pos3Y, obj.pos3.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos3.y = parseFloat(v);
                });
                break;

            case "pos4":
                addInput(lang.pos4X, obj.pos4.x, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos4.x = parseFloat(v);
                });
                addInput(lang.pos4Y, obj.pos4.y, true, (v) =>
                {
                    if (isNaN(parseFloat(v))) return;
                    obj.pos4.y = parseFloat(v);
                });
                break;
        }
    }

    el("infoDeleteButton").onclick = () =>
    {
        deleteObject(selectedId);
    }
}

function exportToClipboard()
{
    let string = "";

    // TODO: Check length to ignore empty
    // Lines
    string += "drawLines{\r\n";
    for (const [id, object] of objects)
    {
        if (object.type !== "line") continue;

        string += "  line {line:p4=";

        string += object.start.x + ",";
        string += object.start.y + ",";
        string += object.end.x + ",";
        string += object.end.y + ";";

        string += "move:b=false;}\r\n";
    }
    string += "\r\n}\r\n";

    // Quads
    string += "drawQuads{\r\n";
    for (const [id, object] of objects)
    {
        if (object.type !== "quad") continue;

        string += "  quad {";

        string += "tl:p2 = " + object.pos1.x + "," + object.pos1.y + ";";
        string += "tr:p2 = " + object.pos2.x + "," + object.pos2.y + ";";
        string += "br:p2 = " + object.pos3.x + "," + object.pos3.y + ";";
        string += "bl:p2 = " + object.pos4.x + "," + object.pos4.y + ";";

        string += "}\r\n"; //move:b=false;
    }
    string += "\r\n}\r\n";

    navigator.clipboard.writeText(string);
}

function deleteObject(id)
{
    if (id == null) return;

    objects.delete(id);
    refreshObjectsList();
    showInfo(null);
}

let snapping = false;

document.onkeydown = (e) =>
{
    if (e.code === "KeyZ" && e.ctrlKey)
    {
        e.preventDefault();
        popEvent();
        refreshObjectsList();
    }

    if (e.code === "Delete")
    {
        e.preventDefault();
        pushEvent("delete", objects.get(selectedId));
        deleteObject(selectedId);
        refreshObjectsList();
    }

    if (e.code === "ControlLeft")
    {
        snapping = true;
    }

    if (e.code === "KeyA" && e.ctrlKey)
    {
        e.preventDefault();
        unselectAnyObjects();
    }
};

document.onkeyup = (e) =>
{
    if (e.code === "ControlLeft")
    {
        snapping = false;
        showInfo(null);
    }
};

function snappingPos(mouse)
{
    let closestPos = null;
    let closestSqrMag = Infinity;

    function comp(pos)
    {
        const sqrMag = v2sqrmag(mouse, pos);
        if (sqrMag < closestSqrMag)
        {
            closestPos = pos;
            closestSqrMag = sqrMag;
        }
    }

    for (const [id, obj] of objects)
    {
        switch (obj.type)
        {
            case "line":
                comp(obj.start);
                comp(obj.end);

                break;

            case "quad":
                comp(obj.pos1);
                comp(obj.pos2);
                comp(obj.pos3);
                comp(obj.pos4);

                break;
        }
    }

    return (closestPos != null ? v2copy(closestPos) : null);
}

function selectNearest(mouse)
{
    let closestId = null;
    let closestSqrMag = Infinity;

    function comp(pos, id)
    {
        const sqrMag = v2sqrmag(mouse, pos);
        if (sqrMag < closestSqrMag)
        {
            closestId = id;
            closestSqrMag = sqrMag;
        }
    }

    for (const [id, obj] of objects)
    {
        switch (obj.type)
        {
            case "line":
                comp(v2avg([ obj.start, obj.end ]), id);

                break;

            case "quad":
                comp(v2avg([ obj.pos1, obj.pos2, obj.pos3, obj.pos4 ]), id);

                break;
        }
    }

    if (closestId == null) return;

    showInfo(closestId);
}