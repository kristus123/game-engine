The server needs to store everything, and send it to the players.
world-editor stores the initial state, and sends it to the client.

Which means the Client needs an empty Level.js
that gets loaded up with current server state

When a Client interacts With something, it will be broadcasted to the other Clients.
    - it will update its velocity values
    - which means a Physics loop needs to run.

You can have the player update the physics
- How to ensure they are matched as close as possible?
    - objectManagedBy: player
    - the last one interacting handles the physics
    - local state will be prioritized over server state
        - Some way to smooth out the positions between client/server state

# What is needed to achieve this ?

- global/synced RunAll
    - CRUD for objects must also happen

- events to trigger when user does something to an object
    - to update velocity / position

- a RunAll for both Static and Dynamic Objects (to avoid having to run logic for static objects
    - depending on the object, it will be placed in different runalls

# First step

Refactor RunAll. Have a global RunAll with SubRunAlls

Every object in runall needs to have a id/uuid so it
can be referenced in order to be updated and removed.

- have id as a key in runall

# Second step

Have SubRunAll's inside of MainRunAll
- give these subs names to make it easy to keep it organized
- to make it easy to render stuff in a predicatble order
    - eq. players must be rendered after the background is rendered in order to be visible
