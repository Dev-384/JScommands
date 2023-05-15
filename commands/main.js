console.log("\n        __   ____  _____");
console.log("    __ / /  / __/ / ___/");
console.log(" _ / // /  _\\ \\  / /__");
console.log("(_)\\___/  /___/  \\___/");
console.log("  _________________________");
console.log(" / JavaScript Commands    /");
console.log("/________________________/\n\n");

AboutItems("NPM - Commands", [
    { title: "npm run jsc",         message: "Shows all information about JSC" },
    { title: "npm run jsc-new",     message: "Creates a blank JSC project" },
    { title: "npm run jsc-run",     message: "Runs all current projects" },
    { title: "npm run jsc-compile", message: "Compiles JSC into Javascript files (located at 'project/<PROJECTNAME>/compile')" },
]);

AboutItems("JSC - Commands (Used inside '.jsc' files)", [
    { title: "player inventory manage add 'itemNumber'",         message: "Adds an item to the players inventory" },
    { title: "player inventory manage remove 'itemNumber'",      message: "Reomves an item from the players inventory" },
    { title: "player inventory clear",                           message: "Clears the players inventory" },
    { title: "player teleport relative 'relativeX' 'relativeY'", message: "Moves the player by (x, y)" },
    { title: "player teleport position 'positionX' 'positionY'", message: "Moves the player to positon (x, y)" },
    { title: "player teleport world 'worldName'",                message: "Teleports the player to (0, 0) in a specified world" },
    { title: "world manage",                                     message: "Opens the world manager" },
    { title: "print 'message'",                                  message: "Prints a message to console" },
    { title: "run file 'projectName:fileName'",                  message: "Runs a JSC/JSCcompiled file in any project" },
    { title: "run web 'url'",                                    message: "Opens a web-url" },
]);

function AboutItems(title="", array=[]){
    console.log(title);
    for(let i = 0; i < array.length; i++){
        console.log(`\t - \x1b[33m ${array[i].title}\x1b[0m`);
        console.log(`\t\t${array[i].message}`);
    }
    console.log("")
}