let tool = "lines";

const toolNames = [ "lines", "quads" ];
for (const toolName of toolNames)
{
    const buttonName = "tools" + toolName.substring(0, 1).toUpperCase() + toolName.substring(1) + "Button";

    el(buttonName).onclick = () =>
    {
        tool = toolName;

        clearIntermediateDrawing();

        markAllTools();
    }

}
markAllTools();

function markAllTools()
{
    for (const toolName of toolNames)
    {
        const buttonName = "tools" + toolName.substring(0, 1).toUpperCase() + toolName.substring(1) + "Button";

        markTool(buttonName, toolName === tool);
    }
}

function markTool(name, isSelected)
{
    el(name).disabled = isSelected;
}

