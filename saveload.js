const saver = el("saver");

function formSaveData()
{
    const data = Object.fromEntries(objects);

    return JSON.stringify(data);
}

async function save()
{
    const file = new Blob([formSaveData()], {type: "application/json"});
    saver.href = URL.createObjectURL(file);

    const name = el("saveFileName").value;
    saver.download = name.length !== 0 ? name : "sight";
    saver.click();
}

el("loadButtonInput").onchange = () =>
{
    const fr = new FileReader();
    fr.onload = loadFromFile;
    fr.readAsText(el("loadButtonInput").files[0]);
};

function loadFromFile(e)
{
    load(e.target.result);
}

function load(rawData)
{
    objects = new Map(Object.entries(JSON.parse(rawData)));
    refreshObjectsList();
    unselectAnyObjects();
    clearEvents();
}