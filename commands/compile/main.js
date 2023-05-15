console.log('Compiling JSC...');

const fs = require('fs')

// Get all projects
var projectData = require('../../project/projects.json').projects;

const decode = require('../run/decoding/decode.js').generateCommands;

// Get all projects
var projectData = require('../../project/projects.json').projects;


// For each project in array ['projects'] inside projects.json
for(let i = 0; i < projectData.length; i++){
    fs.readdir(`./project/${projectData[i].location}`, async function(err, files){
        for(let f = 0; f < files.length; f++){
            if(`${files[f]}`.endsWith('.jsc')){
                const decodedCommands = await decode(`./project/${projectData[i].location}/${files[f]}`,{
                    showOutput: false,
                    runOutput: false,
                    isJSC: false
                });
                let runScripts = ``;
                for(let run = 0; run < decodedCommands.length; run++){
                    runScripts += `\n\t${decodedCommands[run]}\n\t`
                }
                fs.mkdirSync(`./project/${projectData[i].location}/compiled/commands/`, { recursive: true });
                fs.writeFileSync(`./project/${projectData[i].location}/compiled/commands/${files[f].replace('.jsc', '')}.js`, `async function main(){\n\tconst commands = require('../../../../commands/run/decoding/commands.js').commands;${runScripts}\n}\n\nmodule.exports.main = main;`, null, `    `.length);
            }
        }
    });
    const currentProject = require(`../../project/${projectData[i].location}/jsc.json`)
    const fileNames = currentProject.commands

    let requireScripts = '';
    for (let index = 0; index < fileNames.length; index++) {
        requireScripts += `\n\tconst ${fileNames[index].split('.jsc')[0]} = require('./commands/${fileNames[index].split('.jsc')[0]}.js').main; // Load compiled JS commands from file ('${fileNames[index].split('.jsc')[0]}.js')`; 
    }
    let runScripts = '';
    for (let index = 0; index < fileNames.length; index++) {
        runScripts += `\n\t${fileNames[index].split('.jsc')[0]}(); // Run compiled JS commands from file ('${fileNames[index].split('.jsc')[0]}.js')`; 
    }

    fs.mkdirSync(`./project/${projectData[i].location}/compiled/`, { recursive: true });
    fs.writeFileSync(`./project/${projectData[i].location}/compiled/main.js`, `async function main(){${requireScripts+runScripts}\n}\n\nmodule.exports.main = main;`, null, `    `.length);

    console.log(`\t${i+1}. Project'${projectData[i].title}' was successfully compiled.\n\t   \x1b[33mnpx run-func project/${projectData[i].location.replaceAll('./', '').split('/')[0]}/compiled/main.js main\x1b[0m`);
}