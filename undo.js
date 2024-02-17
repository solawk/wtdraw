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

        case "move":
            const posPulled = event.data.posPulled;
            const prevValue = event.data.prevValue;
            const object = objects.get(event.data.id);

            if (object == null)
            {
                console.log("Moved object not found!");
                break;
            }

            switch (object.type)
            {
                case "line":
                    switch (posPulled)
                    {
                        case 0: object.start.x = prevValue; break;
                        case 1: object.start.y = prevValue; break;
                        case 2: object.end.x = prevValue; break;
                        case 3: object.end.y = prevValue; break;
                    }

                    break;

                case "quad":
                    switch (posPulled)
                    {
                        case 0: object.pos1.x = prevValue; break;
                        case 1: object.pos1.y = prevValue; break;
                        case 2: object.pos2.x = prevValue; break;
                        case 3: object.pos2.y = prevValue; break;
                        case 4: object.pos3.x = prevValue; break;
                        case 5: object.pos3.y = prevValue; break;
                        case 6: object.pos4.x = prevValue; break;
                        case 7: object.pos4.y = prevValue; break;
                    }

                    break;
            }

            break;
    }
}

function clearEvents()
{
    events = [];
}