const ru =
    {
        refUrlTitle: "URL картинки",
        refFileTitle: "Файл картинки",
        loadRefButton: "Загрузить",
        sizeRefTitle: "Размер картинки",
        shiftRefTitle: "Смещение картинки",
        exportButton: "Экспортировать прицел",

        saveButton: "Сохранить в файл",
        loadButton: "Загрузить из файла",
        infoDeleteButton: "Удалить объект",

        toolTitle: "Инструмент",
        toolsLinesButton: "Линии",
        toolsQuadsButton: "Четырёхугольники",
        opacityTitle: "Непрозрачность",
        objectsTitle: "Объекты",

        selObjectTitle: "Выбранный объект",
        saveFileNameTitle: "Название файла",
        nameInfo: "Название",

        startX: "Начало X",
        startY: "Начало Y",
        endX: "Конец X",
        endY: "Конец Y",

        pos1X: "Вершина 1 X",
        pos2X: "Вершина 2 X",
        pos3X: "Вершина 3 X",
        pos4X: "Вершина 4 X",
        pos1Y: "Вершина 1 Y",
        pos2Y: "Вершина 2 Y",
        pos3Y: "Вершина 3 Y",
        pos4Y: "Вершина 4 Y",

        line: "Линия",
        quad: "Четырёхугольник",

        hintsText: "[ПКМ] - Двигать холст, [ЛКМ] - Рисовать, [СКМ] - Выбрать объект, [Ctrl] - Приклеить курсор к существующей вершине<br>" +
        "[Колёсико] - Масштабирование, [Ctrl+Z] - Отмена, [Ctrl+A] - Сброс выбора объекта, [Delete] - Удалить выбранный объект",

        massLabel: "Преобразование рисунка",
        massXLabel: "Смещение X",
        massYLabel: "Смещение Y",
        massRLabel: "Поворот",
        massSXLabel: "Масштаб X",
        massSYLabel: "Масштаб Y",
        massB: "Применить",

        clearButton: "Очистить",
        autosaveManually: "Принудительно автосохранить",
    };

const en =
    {
        refUrlTitle: "Image URL",
        refFileTitle: "Image file",
        loadRefButton: "Load",
        sizeRefTitle: "Image size",
        shiftRefTitle: "Image shift",
        exportButton: "Export sight",

        saveButton: "Save to file",
        loadButton: "Load from file",
        infoDeleteButton: "Delete object",

        toolTitle: "Tool",
        toolsLinesButton: "Lines",
        toolsQuadsButton: "Quads",
        opacityTitle: "Opacity",
        objectsTitle: "Objects",

        selObjectTitle: "Selected object",
        saveFileNameTitle: "Savefile name",
        nameInfo: "Name",

        startX: "Start X",
        startY: "Start Y",
        endX: "End X",
        endY: "End Y",

        pos1X: "Vertex 1 X",
        pos2X: "Vertex 2 X",
        pos3X: "Vertex 3 X",
        pos4X: "Vertex 4 X",
        pos1Y: "Vertex 1 Y",
        pos2Y: "Vertex 2 Y",
        pos3Y: "Vertex 3 Y",
        pos4Y: "Vertex 4 Y",

        line: "Line",
        quad: "Quad",

        hintsText: "[RMB] - Move canvas, [LMB] - Draw, [MMB] - Select object, [Ctrl] - Snap to vertices<br>" +
        "[Mouse Wheel] - Zoom, [Ctrl+Z] - Undo, [Ctrl+A] - Clear selection, [Delete] - Delete selected object",

        massLabel: "Drawing transform",
        massXLabel: "Shift X",
        massYLabel: "Shift Y",
        massRLabel: "Rotate",
        massSXLabel: "Scale X",
        massSYLabel: "Scale Y",
        massB: "Apply",

        clearButton: "Clear",
        autosaveManually: "Force autosave",
    };

const langDependent =
    [
        "refUrlTitle",
        "refFileTitle",
        "loadRefButton",
        "sizeRefTitle",
        "shiftRefTitle",
        "exportButton",

        "saveButton",
        "loadButton",
        "infoDeleteButton",

        "toolTitle",
        //"toolsLinesButton",
        //"toolsQuadsButton",
        "opacityTitle",
        "objectsTitle",

        "selObjectTitle",
        "saveFileNameTitle",

        "hintsText",

        "massLabel",
        "massXLabel",
        "massYLabel",
        "massRLabel",
        "massSXLabel",
        "massSYLabel",
        "massB",

        "clearButton",
        "autosaveManually"
    ];

function changeLang(to)
{
    if (!to)
    {
        to = (lang === ru) ? "en" : "ru";
    }

    switch (to)
    {
        case "ru":
            lang = ru;
            break;

        case "en":
            lang = en;
            break;
    }

    for (const name of langDependent)
    {
        el(name).innerHTML = lang[name];
    }

    showInfo(selectedId);
}

let lang = ru;

changeLang("ru");