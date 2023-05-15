/**
 * The `generateCommands` function takes all text commands from any `.jsc` file and returns the formatted javascript commands as an array
 * 
 * @param {string}  path               - Path to the JSC file
 * @param {object}  options            - An object containing options for outputs, and running
 * @param {boolean} options.showOutput - Prints the contents of the {path} file in propper javascript
 * @param {boolean} options.runOutput  - Runs the javascript output
 * @param {boolean} options.isJSC      - Generating commands depends on if the file is JSC or not.
 */
async function generateCommands(path, options) {
    function returnError(message){
        if(typeof window !== "undefined"){
            console.log("%cERROR:",`color: white; background-color: red; padding: 0px 0.25rem; border-radius: 0.25rem;`, message);
        }else{
            console.log("\x1b[31m"+"-----ERROR-----"+"\x1b[0m\nProblem:",
                message,
            "\n\x1b[31m"+"---------------"+"\x1b[0m")
        }
    }
    const { commands } = require('./commands.js');
    let events = require('events');
    let fs = require('fs');
    let readline = require('readline');
    let rl = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: 0
    });

    let contents = []

    rl.on('line', (line) => {
        contents.push(line)
    });

    await events.once(rl, 'close');

    let requestedCommands = []

    for(let i = 0; i < contents.length; i++){
        let runString = "commands";
        let lineContents = contents[i];

        if(lineContents.startsWith(" ")){
            while(lineContents.startsWith(" ")){
                lineContents = lineContents.substring(1);
            }
        }

        if(lineContents.length < 1){
            continue;
        }else if(lineContents.startsWith("#")){
            continue;
        }else if(lineContents.startsWith("//")){
            continue;
        }

        lineContents = lineContents.split(" ");
        let addingParameters = false;
        for(let line = 0; line < lineContents.length; line++){
            // Get the past working runnable string:
            let pastString = runString;
            if(!addingParameters){
                runString += "." + lineContents[line];
            }else{
                if(options.isJSC == true){
                    if(pastString.endsWith(", true)")){
                        if(((pastString.split("\"").length - 1) % 2 == 1) || ((pastString.split("'").length - 1) % 2 == 1) || ((pastString.split("`").length - 1) % 2 == 1)){
                            runString = runString.slice(0, -7) + " " + lineContents[line] + ", true)";
                        }else{
                            runString = runString.slice(0, -7) + ", " + lineContents[line] + ", true)";
                        }
                    }else{
                        runString += lineContents[line] + ", true)";
                    }
                }else{
                    if(pastString.endsWith(")")){
                        if(((pastString.split("\"").length - 1) % 2 == 1) || ((pastString.split("'").length - 1) % 2 == 1) || ((pastString.split("`").length - 1) % 2 == 1)){
                            runString = runString.slice(0, -1) + " " + lineContents[line] + ")";
                        }else{
                            runString = runString.slice(0, -1) + ", " + lineContents[line] + ")";
                        }
                    }else{
                        runString += lineContents[line] + ")";
                    }
                }
            }
            // Fixing issues with brackets:
            runString = runString
                .replaceAll("{,", "{")
                .replaceAll(",}", "}")
                .replaceAll("[,", "[")
                .replaceAll(",]", "]")
                .replaceAll(",:", ":")
                .replaceAll(":,", ":")
                .replaceAll(", :", ":")
                .replaceAll(",,", ",")
                .replaceAll(",:", ":")
                .replaceAll(", ,", ",");
            if(!addingParameters){
                let possibleCommand;
                try{
                    possibleCommand = eval(runString)
                }catch{
                        // Problems with be dealt with throughout the script
                }
                if(typeof possibleCommand == "function"){
                    runString += "(";
                    addingParameters = true;
                }
                if(typeof possibleCommand == "undefined"){
                    returnError({
                        message: "Error compiling command",
                        issue: "The requested command does not exist",
                        project: {
                            name: path.split("/")[path.split("/").length-2],
                            file: path.split("/")[path.split("/").length-1],
                            line: JSON.stringify(i + 1),
                        }
                    });
                }
            }
        }
        if(!runString.endsWith(")")){
            if(runString[runString.length - 1] == "("){
                runString += "true)";
            }else{
                runString += ", true)";
            }
        }
        
        requestedCommands.push(runString+";")
    }
    if(options.showOutput){
        let message = ``;
        message += `# JSC File "${path.split("/")[path.split("/").length-1]}"\n`;
        for(let i = 0; i < requestedCommands.length; i++){
            message += requestedCommands[i] + "\n";
        }
        console.log(message);
    }
    if(options.runOutput){
        
        for(let i = 0; i < requestedCommands.length; i++){
            try{
                eval(requestedCommands[i]);
            }catch(err){
                returnError({
                    message: "Error running command",
                    issue: "There was an issue within a command",
                    project: {
                        name: path.split("/")[path.split("/").length-2],
                        file: path.split("/")[path.split("/").length-1],
                        line: JSON.stringify(i + 1),
                    }
                });
            }
        }
    }
    return(requestedCommands);
};
if(typeof module !== "undefined"){
    module.exports.generateCommands = generateCommands;
}