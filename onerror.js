window.onerror = (event, source, lineno, colno, error) =>
{
    if (el("errorIsland") != null) document.body.removeChild(el("errorIsland"));

    const island = document.createElement("div");
    island.className = "menuIsland";
    island.id = "errorIsland";
    island.innerHTML = "Error: " + event + "<br>In: " + source + "<br>Line " + lineno + ", column " + colno;
    island.style.backgroundColor = "rgb(255, 100, 100)";
    island.style.textAlign = "center";
    island.style.top = "0em";
    island.style.left = "50%";

    document.body.appendChild(island);
    makeDraggable("errorIsland");

    //setTimeout(() => { if (el("errorIsland") != null) document.body.removeChild(el("errorIsland")); }, 5000);

    return false;
};