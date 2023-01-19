let events = [];
const capacity = 30;

function pushEvent(type, data)
{
    const newLength = events.push({
        type: type,
        data: data
    });

    if (newLength > capacity)
    {
        events.shift();
    }
}

function popEvent()
{
    if (events.length < 1)
    {
        console.log("No events to pop");
        return;
    }

    const event = events.pop();

    switch (event.type)
    {
        case "add":
            deleteObject(event.data);

            break;

        case "delete":
            const objIdStr = nextId().toString();
            event.data.selected = false;
            objects.set(objIdStr, event.data);

            break;
    }
}

function clearEvents()
{
    events = [];
}