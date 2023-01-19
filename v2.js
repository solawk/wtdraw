function v2add(a, b)
{
    return { x: a.x + b.x, y: a.y + b.y };
}

function v2inv(a)
{
    return { x: -a.x, y: -a.y };
}

function v2sub(a, b)
{
    return v2add(a, v2inv(b));
}

function v2mul(a, c)
{
    return { x: a.x * c, y: a.y * c };
}

function v2equal(a, b)
{
    return a.x === b.x && a.y === b.y;
}

function v2sqrmag(a, b)
{
    return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

function v2copy(a)
{
    return { x: a.x, y: a.y };
}

function v2avg(positions)
{
    let avg = { x: 0, y: 0 };

    for (const pos of positions)
    {
        avg = v2add(avg, pos);
    }

    avg = v2mul(avg, 1 / positions.length);

    return avg;
}