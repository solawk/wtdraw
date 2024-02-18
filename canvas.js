const canvas = el("mainCanvas");
const ctx = canvas.getContext("2d");

// Positioning
let screenPos = { x: 0, y: 0.1 }; // In sight coordinates
let screenZoom = 1 / 1.21; // Sight scale * zoom * 2000 = pixels
// Zoom = 1 => 0.5 sight = 1000 pixels, zoom = 2 => 0.5 sight = 2000 pixels

let gridSize = 0.1; // Size of grid cell in sight scale

let mousePos = { x: 0, y: 0 };
let mousePosWindow = { x: 0, y: 0 }

function initialize()
{

}

initialize();

function render()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawReference();
    drawGrid();
    drawCrosshair();
    drawStuff();
    drawArrows();
    drawGhost();

    requestAnimationFrame(render);
}
render();

function v2disposSight2v2sight(disposSight)
{
    return { x: disposSight.x - screenPos.x, y: disposSight.y - screenPos.y };
}

function sight2pixel(sight)
{
    return sight * screenZoom * 2000;
}

function v2sight2v2pixel(sight)
{
    return { x: sight.x * screenZoom * 2000, y: sight.y * screenZoom * 2000 };
}

function v2pixel2v2canvas(pixel)
{
    return { x: pixel.x + canvas.width / 2, y: pixel.y + canvas.height / 2 };
}

function v2pixel2v2sight(pixel)
{
    return { x: pixel.x / screenZoom / 2000, y: pixel.y / screenZoom / 2000 };
}

function v2disposSight2v2canvas(disposSight)
{
    return v2pixel2v2canvas(v2sight2v2pixel(v2disposSight2v2sight(disposSight)));
}

function v2canvas2v2pixel(canv)
{
    return { x: canv.x - canvas.width / 2, y: canv.y - canvas.height / 2 };
}

function v2sight2v2disposSight(sight)
{
    return { x: sight.x + screenPos.x, y: sight.y + screenPos.y };
}

function v2canvas2v2disposSight(canv)
{
    return v2sight2v2disposSight(v2pixel2v2sight(v2canvas2v2pixel(canv)));
}

function drawCrosshair()
{
    const crossSightPos =
        {
            x: 0,
            y: 0
        };

    const crossPixelPos = v2sight2v2pixel(v2disposSight2v2sight(crossSightPos));
    const crossCanvasPos = v2pixel2v2canvas(crossPixelPos);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();

    ctx.moveTo(0, crossCanvasPos.y);
    ctx.lineTo(canvas.width, crossCanvasPos.y);

    ctx.moveTo(crossCanvasPos.x, 0);
    ctx.lineTo(crossCanvasPos.x, canvas.height);

    ctx.closePath();
    ctx.stroke();
}

function drawGrid()
{
    ctx.lineWidth = 1;

    for (let z = 1; (0.5 * Math.pow(10, z - 1) < screenZoom) || (z === 1); z++)
    {
        const alpha = 0.25 * Math.pow(0.7, z - 1);
        const gridStep = gridSize * Math.pow(0.1, z - 1);

        ctx.strokeStyle = "rgba(0, 0, 0, " + alpha.toString() + ")";
        ctx.beginPath();

        for (let i = -0.5; i <= 0.5; i += gridStep)
        {
            const from = v2disposSight2v2canvas({ x: -1, y: i });
            const to = v2disposSight2v2canvas({ x: 1, y: i });

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
        }

        for (let j = -1; j <= 1; j += gridStep)
        {
            const from = v2disposSight2v2canvas({ x: j, y: -0.5 });
            const to = v2disposSight2v2canvas({ x: j, y: 0.5 });

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
        }

        ctx.closePath();
        ctx.stroke();
    }
}

function drawStuff()
{
    const timeSin = ((Math.sin(Date.now() * 0.01)) * 0.25) + 0.75;

    for (const [id, object] of objects)
    {
        const opacity = el("opacityInput").value;
        const color = !object.selected ? "rgba(0, 0, 0, " + opacity + ")" : "rgba(0, 0, 255, " + timeSin.toString() + ")";
        const width = !object.selected ? 1 : 3;

        switch (object.type)
        {
            case "line":
                const from = v2disposSight2v2canvas(object.start);
                const to = v2disposSight2v2canvas(object.end);

                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.closePath();
                ctx.stroke();

                break;

            case "quad":
                const pos1 = v2disposSight2v2canvas(object.pos1);
                const pos2 = v2disposSight2v2canvas(object.pos2);
                const pos3 = v2disposSight2v2canvas(object.pos3);
                const pos4 = v2disposSight2v2canvas(object.pos4);

                ctx.fillStyle = color;
                ctx.lineWidth = width;
                ctx.beginPath();

                ctx.moveTo(pos1.x, pos1.y);
                ctx.lineTo(pos2.x, pos2.y);
                ctx.lineTo(pos3.x, pos3.y);
                ctx.lineTo(pos4.x, pos4.y);

                ctx.closePath();

                ctx.fill();

                break;
        }
    }

    ctx.lineWidth = 1;
}

function getMousePos(offsetX, offsetY)
{
    return { x: offsetX * (canvas.width / canvas.clientWidth), y: offsetY * (canvas.height / canvas.clientHeight) };
}

function drawGhost()
{
    if (typeof mousePos === "undefined") return;

    let mousePosCanvas;
    let trueMousePosCanvas;

    if (!snapping)
    {
        trueMousePosCanvas = mousePosCanvas = v2disposSight2v2canvas(mousePos);
    }
    else
    {
        trueMousePosCanvas = v2disposSight2v2canvas(mousePos);

        const snapPos = snappingPos(mousePos);
        if (snapPos != null)
            mousePosCanvas = v2disposSight2v2canvas(snapPos);
        else
            mousePosCanvas = trueMousePosCanvas;
    }

    ctx.lineWidth = 1;

    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";

    function drawCircle(x, y, r)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    function drawLine(x1, y1, x2, y2)
    {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    }

    function drawQuad(coords)
    {
        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
        ctx.closePath();
        ctx.fill();
    }

    switch (tool)
    {
        case "lines":
            if (drawing)
            {
                const from = v2disposSight2v2canvas(startPos);
                const to = trueMousePosCanvas;

                drawLine(from.x, from.y, to.x, to.y);
            }

            if (snapping)
            {
                drawCircle(mousePosCanvas.x, mousePosCanvas.y, 20);
            }
            
            break;

        case "quads":
            if (snapping)
            {
                drawCircle(mousePosCanvas.x, mousePosCanvas.y, 20);
            }

            if (quadPos.length === 0)
            {
                if (drawing && !snapping)
                {
                    drawCircle(mousePosCanvas.x, mousePosCanvas.y, 20);
                }
            }
            else if (quadPos.length === 1)
            {
                if (!drawing)
                {
                    drawCircle(v2disposSight2v2canvas(quadPos[0]).x, v2disposSight2v2canvas(quadPos[0]).y, 10);
                }
                
                drawLine(v2disposSight2v2canvas(quadPos[0]).x, v2disposSight2v2canvas(quadPos[0]).y, mousePosCanvas.x, mousePosCanvas.y);
            }
            else if (quadPos.length === 2)
            {
                if (!drawing)
                {
                    drawLine(v2disposSight2v2canvas(quadPos[0]).x, v2disposSight2v2canvas(quadPos[0]).y, v2disposSight2v2canvas(quadPos[1]).x, v2disposSight2v2canvas(quadPos[1]).y);
                }
                else
                {
                    drawQuad([
                        { x: v2disposSight2v2canvas(quadPos[0]).x, y: v2disposSight2v2canvas(quadPos[0]).y },
                        { x: v2disposSight2v2canvas(quadPos[1]).x, y: v2disposSight2v2canvas(quadPos[1]).y },
                        { x: mousePosCanvas.x, y: mousePosCanvas.y },
                    ]);
                }
               
                drawLine(v2disposSight2v2canvas(quadPos[1]).x, v2disposSight2v2canvas(quadPos[1]).y, mousePosCanvas.x, mousePosCanvas.y);
            }
            else if (quadPos.length === 3)
            {
                drawQuad([
                    { x: v2disposSight2v2canvas(quadPos[0]).x, y: v2disposSight2v2canvas(quadPos[0]).y },
                    { x: v2disposSight2v2canvas(quadPos[1]).x, y: v2disposSight2v2canvas(quadPos[1]).y },
                    { x: v2disposSight2v2canvas(quadPos[2]).x, y: v2disposSight2v2canvas(quadPos[2]).y },
                    { x: mousePosCanvas.x, y: mousePosCanvas.y },
                ]);
            }

            break;
    }
}

function drawReference()
{
    if (reference == null) return;

    
    const refAspectRatio = reference.width / reference.height;
    const from = v2disposSight2v2canvas({ x: (-referenceSize / 2) * refAspectRatio + referenceX, y: (-referenceSize / 2) + referenceY });
    const to = v2disposSight2v2canvas({ x: (referenceSize / 2) * refAspectRatio + referenceX, y: (referenceSize / 2) + referenceY });

    ctx.globalAlpha = 0.5;
    try
    {
        ctx.drawImage(reference, from.x, from.y, to.x - from.x, to.y - from.y);
    }
    catch (e)
    {
        reference = null;
        alert(lang === ru ? "Картинка не найдена/не подходит!" : "Image not found/not applicable!");
    }
    ctx.globalAlpha = 1;
}

function getArrowSources(object)
{
    const arrowSources = [];

    switch (object.type)
    {
        case "line":
            arrowSources.push(v2disposSight2v2canvas(object.start));
            arrowSources.push(v2disposSight2v2canvas(object.end));

            break;

        case "quad":
            arrowSources.push(v2disposSight2v2canvas(object.pos1));
            arrowSources.push(v2disposSight2v2canvas(object.pos2));
            arrowSources.push(v2disposSight2v2canvas(object.pos3));
            arrowSources.push(v2disposSight2v2canvas(object.pos4));

            break;
    }

    return arrowSources;
}

let hoveredArrowHitbox = null; // number of the arrow hitbox being hovered on, doesn't account for no object selected!!!

function drawArrows()
{
    if (selectedId == null) return;
    const object = objects.get(selectedId);

    ctx.globalAlpha = 0.5;

    const arrowSources = getArrowSources(object);
    const arrowHitboxes = getArrowHitboxes();

    hoveredArrowHitbox = null;

    for (let i = 0; i < arrowHitboxes.length; i++)
    {
        const hitbox = arrowHitboxes[i];

        if (mousePosWindow.x > hitbox.x1 && mousePosWindow.y > hitbox.y1
            && mousePosWindow.x < hitbox.x2 && mousePosWindow.y < hitbox.y2)
            hoveredArrowHitbox = i;
    }

    let hoveredSource = null;
    let hoveredAxis = null;

    if (hoveredArrowHitbox != null)
    {
        hoveredSource = Math.floor(hoveredArrowHitbox / 2);
        hoveredAxis = hoveredArrowHitbox - (hoveredSource * 2);
    }

    for (let i = 0; i < arrowSources.length; i++)
    {
        const pos = arrowSources[i];

        ctx.lineWidth = 5;

        // x
        ctx.strokeStyle = (hoveredSource === i && hoveredAxis === 0) ? "rgb(128, 0, 0, 1)" : "rgb(255, 0, 0, 1)";
        ctx.beginPath();

        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 100, pos.y);
        ctx.lineTo(pos.x + 80, pos.y - 10);
        ctx.moveTo(pos.x + 100, pos.y);
        ctx.lineTo(pos.x + 80, pos.y + 10);

        ctx.closePath();

        ctx.stroke();

        // y
        ctx.strokeStyle = (hoveredSource === i && hoveredAxis === 1) ? "rgb(0, 128, 0, 1)" : "rgb(0, 255, 0, 1)";
        ctx.beginPath();

        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x, pos.y - 100);
        ctx.lineTo(pos.x - 10, pos.y - 80);
        ctx.moveTo(pos.x, pos.y - 100);
        ctx.lineTo(pos.x + 10, pos.y - 80);

        ctx.closePath();

        ctx.stroke();
    }

    ctx.globalAlpha = 1;
}

function getArrowHitboxes()
{
    // pos1x, pos1y, pos2x, pos2y etc.
    if (selectedId == null) return null;
    const object = objects.get(selectedId);

    const arrowSources = getArrowSources(object);
    const arrowHitboxes = [];

    for (const src of arrowSources)
    {
        arrowHitboxes.push({ x1: src.x + 10, y1: src.y - 10, x2: src.x + 100, y2: src.y + 10 });
        arrowHitboxes.push({ x1: src.x - 10, y1: src.y - 100, x2: src.x + 10, y2: src.y - 10 });
    }

    return arrowHitboxes;
}

// Canvas interaction

let canvasHover = false;

canvas.onpointerover = (e) =>
{
    canvasHover = true;
};

canvas.onpointerleave = (e) =>
{
    canvasHover = false;
    clearDrawing();
};

canvas.oncontextmenu = (e) =>
{
    e.preventDefault();
};

let dragging = false;

let arrowPulling = false;
let posPulled = null;

canvas.onpointerdown = (e) =>
{
    if (e.button === 2)
    {
        dragging = true;
        //console.log("drag start");
    }

    if (e.button === 1)
    {
        e.preventDefault();
        selectNearest(v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY)));
    }

    if (e.button === 0)
    {
        mousePos = v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY));
        mousePosWindow = getMousePos(e.offsetX, e.offsetY);

        if (selectedId != null && hoveredArrowHitbox != null) // Arrow pulling
        {
            arrowPulling = true;
            posPulled = hoveredArrowHitbox;

            // Pull the pos
            const object = objects.get(selectedId);
            let prevValue;

            switch (object.type)
            {
                case "line":
                    switch (posPulled)
                    {
                        case 0: prevValue = object.start.x; break;
                        case 1: prevValue = object.start.y; break;
                        case 2: prevValue = object.end.x; break;
                        case 3: prevValue = object.end.y; break;
                    }

                    break;

                case "quad":
                    switch (posPulled)
                    {
                        case 0: prevValue = object.pos1.x; break;
                        case 1: prevValue = object.pos1.y; break;
                        case 2: prevValue = object.pos2.x; break;
                        case 3: prevValue = object.pos2.y; break;
                        case 4: prevValue = object.pos3.x; break;
                        case 5: prevValue = object.pos3.y; break;
                        case 6: prevValue = object.pos4.x; break;
                        case 7: prevValue = object.pos4.y; break;
                    }

                    break;
            }

            pushEvent("move", { id: selectedId, posPulled: posPulled, prevValue: prevValue });
        }
        else
        {
            if (!snapping)
                startDrawing(mousePos);
            else
            {
                const snapPos = snappingPos(mousePos);
                if (snapPos != null)
                    startDrawing(snapPos);
                else
                    startDrawing(mousePos);
            }
        }

        //const pixelPos = v2canvas2v2pixel(pos);
        //const sightPos = v2pixel2v2sight(pixelPos);
        //const disposSightPos = v2sight2v2disposSight(sightPos);
        //console.log(pos);
        //console.log(pixelPos);
        //console.log(sightPos);
        //console.log(disposSightPos);
        //console.log("drawing start");
    }
};

let canvasDragSensitivity = 2;
let canvasPullSensitivity = 1.5;

canvas.onpointermove = (e) =>
{
    mousePos = v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY));
    mousePosWindow = getMousePos(e.offsetX, e.offsetY);

    const movement = v2mul({ x: e.movementX, y: e.movementY }, canvasDragSensitivity);
    const sightMovement = v2pixel2v2sight(movement);
    const pullMovement = v2pixel2v2sight(v2mul({ x: e.movementX, y: e.movementY }, canvasPullSensitivity));

    if (dragging)
    {
        screenPos = v2add(screenPos, v2inv(sightMovement));
    }

    if (arrowPulling)
    {
        if (selectedId == null)
        {
            arrowPulling = false;
        }
        else
        {
            // Pull the pos
            const object = objects.get(selectedId);

            function pullPos(object, index)
            {
                switch (object.type)
                {
                    case "line":
                        switch (index)
                        {
                            case 0: object.start.x += pullMovement.x; break;
                            case 1: object.start.y += pullMovement.y; break;
                            case 2: object.end.x += pullMovement.x; break;
                            case 3: object.end.y += pullMovement.y; break;
                        }

                        break;

                    case "quad":
                        switch (index)
                        {
                            case 0: object.pos1.x += pullMovement.x; break;
                            case 1: object.pos1.y += pullMovement.y; break;
                            case 2: object.pos2.x += pullMovement.x; break;
                            case 3: object.pos2.y += pullMovement.y; break;
                            case 4: object.pos3.x += pullMovement.x; break;
                            case 5: object.pos3.y += pullMovement.y; break;
                            case 6: object.pos4.x += pullMovement.x; break;
                            case 7: object.pos4.y += pullMovement.y; break;
                        }

                        break;
                }
            }

            pullPos(object, posPulled);
        }
    }
};

canvas.onpointerup = (e) =>
{
    if (e.button === 2)
    {
        dragging = false;
        //console.log("drag end");
    }

    if (e.button === 0)
    {
        if (arrowPulling === true)
        {
            arrowPulling = false;
            showInfo(selectedId);
        }
        else
        {
            if (!snapping)
                endDrawing(v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY)));
            else
            {
                const snapPos = snappingPos(v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY)));
                if (snapPos != null)
                    endDrawing(snapPos);
                else
                    endDrawing(v2canvas2v2disposSight(getMousePos(e.offsetX, e.offsetY)));
            }
        }
        //console.log("drawing end");
    }
};

// Zooming

onwheel = (e) =>
{
    if (!canvasHover) return;

    const zoomIn = e.deltaY < 0;

    if (zoomIn)
    {
        screenZoom *= 1.1;
    }
    else
    {
        screenZoom /= 1.1;
        if (screenZoom <= 0.1) screenZoom = 0.1;
    }

    //console.log("Zoom: " + screenZoom);
};