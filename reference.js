let reference = null;
let referenceSize = 1;

function setReference()
{
    setReferenceSrc(el("refUrl").value);
}

function setReferenceSize()
{
    referenceSize = parseFloat(el("refSize").value);
}

el("refFile").onchange = () =>
{
    setReferenceSrc(window.URL.createObjectURL(el("refFile").files[0]));
};

function setReferenceSrc(url)
{
    const referenceUrl = url;
    reference = new Image();
    reference.src = referenceUrl;
}

function calc()
{
    const canv = document.createElement("canvas");

    const w = reference.width;
    const h = reference.height;
    const pixels = w * h;

    canv.width = w;
    canv.height = h;
    const canvctx = canv.getContext("2d");
    canvctx.drawImage(reference, 0, 0);
    const data = canvctx.getImageData(0, 0, canv.width, canv.height);
    const brightnesses = [];

    for (let i = 0; i < pixels; i++)
    {
        brightnesses[i] = data.data[i * 4];
    }

    function addQuad(id, pos1, pos2, pos3, pos4)
    {
        const object =
            {
                name: lang.quad + id,
                type: "quad",
                pos1: pos1,
                pos2: pos2,
                pos3: pos3,
                pos4: pos4,
                selected: false
            };

        objects.set(id, object);
    }

    const decimation = 12.25;
    const size = 1 / h * decimation;
    let id = 100;
    const xS = -0.5 * (w/h);
    const yS = -0.5;
    const threshold = 10;

    for (let y = 0; y < h; y += decimation)
    {
        for (let x = 0; x < w; x += decimation)
        {
            const v = brightnesses[Math.floor(y) * w + Math.floor(x)];
            //if (v === 255) continue;
            if (v >= 255 - threshold) continue;
            const r = 1 - (v / 255);

            const x0 = xS + ((x + 0.5) / decimation) * size - (r * 0.5 * size);
            const y0 = yS + ((y + 0.5) / decimation) * size - (r * 0.5 * size);
            const x1 = xS + ((x + 0.5) / decimation) * size + (r * 0.5 * size);
            const y1 = yS + ((y + 0.5) / decimation) * size + (r * 0.5 * size);

            addQuad(id, {x: x0, y: y0}, {x: x1, y: y0}, {x: x1, y: y1}, {x: x0, y: y1});
            id++;
        }
    }

    console.log(id - 100);
}