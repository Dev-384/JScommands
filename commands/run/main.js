// Get function to "decode" and run the "jsc" files
const generateCommands = require("./decoding/decode.js").generateCommands;

// Get all projects
var projectData = require("../../project/projects.json").projects;


// For each project in array ["projects"] inside projects.json
for(let projects = 0; projects < projectData.length; projects++){

    // Using folder location from project, get file names from the "jsc.json" file as an array
    var jscDATA = require("../../project/"+projectData[projects].location+"/jsc.json");

    // For each file in "jsc.json", Run each file
    for(let commands = 0; commands < jscDATA.commands.length; commands++) {

        // Run each file in "jsc.json"
        generateCommands("./project/"+projectData[projects].location+"/" + jscDATA.commands[commands], {
            showOutput: true,
            runOutput: false,
            isJSC: true,
        })[0];
    }
}