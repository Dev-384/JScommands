const commands = {
    player: {
        inventory: {
            manage: {
                add: async function(item){
                    console.log("Added item (" + item + ") to inventory")
                },
                remove: async function(item){
                    console.log("Removed item (" + item + ") to inventory")
                },
            },
            clear: async function(){
                console.log("Cleared inventory")
            },
        },
        teleport: {
            relative: async function(x,y){
                x = x || 0, y = y || 0;
                console.log("Teleported [" + x +"," + y + "] blocks")
            },
            position: async function(x,y){
                x = x || 0, y = y || 0;
                console.log("Teleported to [" + x +"," + y + "]")
            },
            world: async function(worldName){
                console.log("Teleporting to world (" + worldName + ")")
            },
        },
    },
    world: {
        manage: async function(){
            console.log("Opened world manager");
        },

    },
    print: async function(message){
        if(typeof message !== "undefined"){
            console.log(message);
        }else{
            console.log("");
        }
    },
    run: {
        file: async function(file,isJSC){
            file = file.split(".");
            if(typeof isJSC !== "undefined"){
                let path = "./project/"+file[0]+"/"+file[1]+".jsc";
                let generateCommands = require("./decode").generateCommands;
                await generateCommands(path, {
                    showOutput: false,
                    runOutput: true,
                });
            }else if(!isJSC){
                let path = "./project/"+file[0]+"/compiled/"+file[1]+".js";
                eval('require("../../../project/'+file[0]+'/compiled/commands/'+file[1]+'.js").main()');
            }
        },
        web: async function(address){
            require("child_process").exec("start "+ address);
        },
    },
};

module.exports.commands = commands;