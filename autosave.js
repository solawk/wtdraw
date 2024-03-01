function saveToStorage()
{
    localStorage.setItem("wtdraw-save", formSaveData());
}

function forcedSave()
{
    saveToStorage();

    alert(lang === ru ? "Принудительно сохранено!" : "Force-saved!");
}

function restoreFromStorage()
{
    const save = localStorage.getItem("wtdraw-save");

    if (save == null) return;

    load(save);
}

function autosaveRoutine()
{
    if (objects.size > 0)
    {
        saveToStorage();
        //console.log("Autosaved");
    }
    else
    {
        //console.log("Nothing to autosave");
    }
}

restoreFromStorage();
setInterval(autosaveRoutine, 1 * 60 * 1000);