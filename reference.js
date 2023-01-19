let reference = null;
let referenceSize = 1;

function setReference()
{
    const referenceUrl = el("refUrl").value;
    reference = new Image();
    reference.src = referenceUrl;
}

function setReferenceSize()
{
    referenceSize = parseFloat(el("refSize").value);
}

el("refFile").onchange = () =>
{
    const referenceUrl = window.URL.createObjectURL(el("refFile").files[0]);
    reference = new Image();
    reference.src = referenceUrl;
};