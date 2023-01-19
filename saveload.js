const saver = el("saver");

async function save()
{
    const data = Object.fromEntries(objects);

    const file = new Blob([JSON.stringify(data)], {type: "application/json"});
    saver.href = URL.createObjectURL(file);

    const name = el("saveFileName").value;
    saver.download = name.length !== 0 ? name : "sight";
    saver.click();
}

el("loadButtonInput").onchange = () =>
{
    const fr = new FileReader();
    fr.onload = load;
    fr.readAsText(el("loadButtonInput").files[0]);
};

function load(e)
{
    const data = JSON.parse(e.target.result);

    objects = new Map(Object.entries(data));
    refreshObjectsList();
    unselectAnyObjects();
    clearEvents();
}