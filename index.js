//This isn't too much to do for one's crush is it? <3

/**setup**/

const guildId=""

/**node modules**/

//setting up discord.js
const { Client, 
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
    Permissions,
    Embed,
    Webhook,
    PermissionFlagsBits,
  } = require(`discord.js`);
  
  require("dotenv").config();
  const TOKEN = process.env.DISCORD_TOKEN;
  
  const prefix = "+";
    
  const client = new Client({
      intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      ],
  });

//fs
const fs = require('fs')
let storage = require("./public/storage.json");
let loginData = require("./logins.json")

//save storage.json
function save(data,readify){
    if(readify){
        fs.writeFileSync("./public/storage.json",JSON.stringify(data,null,"  "))
        return;
    }else{
        fs.writeFileSync("./public/storage.json",JSON.stringify(data))
    }
}

//setting up express
const express = require('express');
const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));


/**universal variables**/
let messageDotChannel = {}

/**universal constants**/
const sensorWords = []


/**universal functions**/


async function sendHook(what,message){
        var hook=await message.channel.fetchWebhooks()
    
    hook=hook.find(h=>h.token);
    if(hook){
        hook.send(what)
    }
    else{
        messageDotChannel.createWebhook({
            name:message.author.username,
            avatar: message.author.avatar,
        }).then(d=>{
            d.send(what)
        })
    }
}

function sensorMessage(msg){
    let passes = true
    for(var i = 0; i < sensorWords.length; i++){
        if(msg.toLowerCase().includes(sensorWords[i])){
            console.log(msg)
            msg = msg.toLowerCase().replace(sensorWords[i],"[_]")
            console.log(msg)
            passes = false
        }
    }
    return msg;
}
function sensor(message){
    let passes = true
    for(var i = 0; i < sensorWords.length; i++){
        if(message.content.toLowerCase().includes(sensorWords[i])){
            console.log(message.content)
            message.content = message.content.toLowerCase().replace(sensorWords[i],"[_]")
            console.log(message.content)
            passes = false
        }
    }
    if(passes === true)return;
    message.delete()
    if(message.guild.id == guildId){
        sendHook({
        username:message.author.username,
        avatarURL:message.member?.displayAvatarURL(),
        content:message.content
    },message).catch();
    return;
    }
    message.channel.send({embeds:[{"type":"rich","title":`${message.author.username}`,"description":`${message.content}`}]})

  }

async function sendChannel(c,msg){
    let chan = await client.channels.cache.find(channel => channel.id === c)
    chan.send(msg)
}

async function sendChannelHook(c,msg){
    
    let chan = await client.channels.cache.find(channel => channel.id === c)
    var hook=await chan.fetchWebhooks()
    let t = new Date(msg.timestamp)
    t = `${t}`
    let what=msg
    hook=hook.find(h=>h.token);
    if(hook){
        chan.send(`**${msg.author}** - ${t.slice(4,21)}\n${msg.content}`)
    }else{
        chan.createWebhook({
            name:msg.author,
        }).then(d=>{
            d.send(what)
        })
    }
}

//API
app.post("/api", (message,res) => {
    console.log("recieved request");
    console.log(message.body);
    const msg = message.body;
    sendChannelHook(msg.channel.id,msg)
    if(!storage[msg.channel.id])return;
    storage[msg.channel.id].messages.push(msg)
    console.log(msg)
    save(storage,true)
    console.log("data saved")
    res.json({
        "message":msg,
        "sent":true
    })
});

app.post("/login",(data,responce) =>{
    console.log("new login requested")
    const login = data.body
    let dataOut={
        "error":null,
        "passes":false,
        "username":login.username,
        "timestamp":login.timestamp
    }

    let log = {
            "timestamp":login.timestamp,
            "success":false,
            "user":{
                "id":0,
                "name":login.username
            }
        }

    console.log(login);

    let err = false;

    for(var i = 0; i < loginData.users.length+1; i++){
        if(loginData.users[i].username === login.username){
            log.user.id=i
            if(loginData.users[i].password === login.password || loginData.users[i].passowrd === "0000" && login.password === ""){
                dataOut.passes = true;
                loginData.users[i].timestamp=Date.now()
                
            }else{
                dataOut.error="incorrect password";
                err = true;
                log.password=login.password;
            }
        }else if(i = loginData.users.length && !err){
            dataOut.error="username not found";
        }
        
    
    }

    log.success = dataOut.passes;
    log.error=dataOut.error;
    
    loginData.logs.push(log)

    dataOut.log=log

    fs.writeFileSync("./logins.json",JSON.stringify(loginData,null, "  "))
    responce.json(dataOut)
    
})

  function c(message){
    console.log(`${Date.now()}: ${message}`)
  }

  
  client.on("ready", () => {
    console.log("The bot is online!");
    client.user.setPresence({ activities: [{ name: "the middle man" }] });
      
  });

  client.on("messageCreate", async (message) => {
    
    if(message.author.bot)return;
    if(message.guild.id != guildId)return;


    const msg = {
        "content":message.content,
        "author":message.author.username,
        "timestamp":`${Date.now()}`
    }

    if(!storage[message.channel.id]){
        storage[message.channel.id]={
            "name":`${message.channel.name}`,
            "created":{
                "date":`${Date()}`,
                "author":`${message.author.username}`,
                "timestamp":`${Date.now()}`
            },
            "messages":[]
        }
        storage.channels.push(message.channel.id)
        storage[message.channel.id].messages.push(msg)
        c(`created channel ${message.channel.name}`)
        console.log(storage[message.channel.id])
        save(storage,true)
        return;
    }
    storage[message.channel.id].messages.push(msg)
    console.log(msg)
    save(storage,true)

})

  client.login(TOKEN);
