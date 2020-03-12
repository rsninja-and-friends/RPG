# RPG
javascript rpg thing

## code structure
 * everything in the world will be an object
 * things there are multiple of (items, enemies) will have a base class that gets extended by more specific classes.
 * work in states (battle, pre/post battle, cutscene etc.)

## world
 * set map with multiple rooms loaded from custom format
 * fixed camera (except big areas like towns)

 ## mechanics
 * 
 
## graphics
 * maybe will draw once to some sort of cache, then each frame only cache and things that moved will be drawn