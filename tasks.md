# Move all logic related to rendering the 'outside stuff' in Mainlevel.js to new file OutsideWorld.js

This will make it easy to split levels and quests etc into multiple files, f.example;

- FindItemLevel.js
- DeliverItemLevel.js
- FightPiratesQuest.js

After that we can do...

# Create a new quest/level for when all the piss has been cleaned up

use the new implementation to make a new quest.
One simple idea for now is to deliver the piss to someone.
