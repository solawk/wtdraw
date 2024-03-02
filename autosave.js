function saveToStorage()
{
    localStorage.setItem("wtdraw-save", formSaveData());
}

function forcedSave()
{
    saveToStorage();

    //alert(lang === ru ? "Принудительно сохранено!" : "Force-saved!");
    saveNotify();
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
        saveNotify();
        //console.log("Autosaved");
    }
    else
    {
        //console.log("Nothing to autosave");
    }
}

restoreFromStorage();
setInterval(autosaveRoutine, 1 * 60 * 1000);

const saveIcon = el("saveIcon");
let saveNotification = null;
let saveIconOpacity = 0;

function saveNotify()
{
    saveIconOpacity = 100;   

    if (saveNotification != null) clearInterval(saveNotification);
    saveNotification = setInterval(saveNotificationVanishing, 15);
}

function saveNotificationVanishing()
{
    saveIcon.style.opacity = saveIconOpacity + "%";

    if (saveIconOpacity === 0)
    {
        clearInterval(saveNotification);
        saveNotification = null;
    }
    else
    {
        saveIconOpacity -= 1;
    }
}