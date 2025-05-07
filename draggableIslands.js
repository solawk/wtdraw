makeDraggable("functionalMenu");
makeDraggable("toolsMenu");
makeDraggable("objectsMenu");
makeDraggable("infoMenu");
makeDraggable("disclaimer");

function makeDraggable(name)
{
    let posFrom = null;

    const element = el(name);
    const dragger = el(name + "Dragger");

    if (dragger != null) dragger.onmousedown = dragMouseDown;

    function dragMouseDown(e)
    {
        e.preventDefault();

        posFrom = { x: e.clientX, y: e.clientY };

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e)
    {
        e.preventDefault();
        const movement = v2sub(posFrom, { x: e.clientX, y: e.clientY });
        posFrom = { x: e.clientX, y: e.clientY };

        element.style.top = (element.offsetTop - movement.y) + "px";
        element.style.left = (element.offsetLeft - movement.x) + "px";

        element.style.right = null;
        element.style.bottom = null;
    }

    function closeDragElement()
    {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function closeDisclaimer()
{
    localStorage.setItem("wtdraw-disclaimerClosed", true);
    document.body.removeChild(document.getElementById("disclaimer"));
}