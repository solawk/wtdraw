const ru =
    {
        loadRefButton: "Загрузить",
        sizeRefButton: "Задать размер",
        exportButton: "Экспортировать",

        saveButton: "Сохранить в файл",
        loadButton: "Загрузить из файла",
        infoDeleteButton: "Удалить объект",

        toolsLinesButton: "Линии",
        toolsQuadsButton: "Четырёхугольники",
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
        quad: "Четырёхугольник"
    };

const en =
    {
        loadRefButton: "Load",
        sizeRefButton: "Set size",
        exportButton: "Export",

        saveButton: "Save to file",
        loadButton: "Load from file",
        infoDeleteButton: "Delete object",

        toolsLinesButton: "Lines",
        toolsQuadsButton: "Quads",
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
        quad: "Quad"
    };

const langDependent =
    [
        "loadRefButton",
        "sizeRefButton",
        "exportButton",

        "saveButton",
        "loadButton",
        "infoDeleteButton",

        "toolsLinesButton",
        "toolsQuadsButton",
        "objectsTitle",

        "selObjectTitle",
        "saveFileNameTitle"
    ];

function changeLang(to)
{
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