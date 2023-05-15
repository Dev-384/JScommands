const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const fs = require("fs");
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
var data = {};

async function main(){
  try {
    data.projectName = (await prompt("Name of new project:\n\t:|> "));
    data.files = (await prompt("Names of files (seporated by commas \",\"):\n\t:|> ")).replaceAll(" ", "").split(",");
    fs.mkdirSync(("./project/"+data.projectName.replaceAll(" ", "_")).toLowerCase(), { recursive: true });
    let filename = "./project/projects.json";
    content = require("../../"+filename)
    content.projects.push({
      "title": data.projectName,
      "location": ("./"+data.projectName.replaceAll(" ", "_")+"/").toLowerCase()
    })
    fs.writeFileSync(filename, JSON.stringify(content, null, "    ".length));


    let commands = [];
    for(let i = 0; i < data.files.length; i++){
      commands.push(data.files[i]+".jsc");
    }
    fs.writeFileSync("./project/"+data.projectName.replaceAll(" ", "_")+"/jsc.json", JSON.stringify({
      "commands": commands
    }, null, "    ".length));

    for(let i = 0; i < data.files.length; i++){
      fs.writeFileSync("./project/"+data.projectName.replaceAll(" ", "_")+"/"+data.files[i]+".jsc", "# New Jsc file");
    }

    rl.close();
  } catch (err) {
    console.error("Unable to prompt", err);
  }
};

main();
rl.on('close', () => process.exit(0));