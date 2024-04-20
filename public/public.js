//variable setup
let storage = {}
let channelId = "1224924341398143061";
let user = {}


//login stuff
if(!localStorage.chat){
    window.location.replace("login.html")
}
const ls =JSON.parse(localStorage.chat)

if(ls.channel){
    channelId=ls.channel;
}

async function send(data){
    const options = {
        "method": 'POST',
        headers:{
            "content-type":"application/json"
        },
        "body":JSON.stringify(data)
    }

    const res = await fetch('/api', options);
    const obj = await res.json();
    console.log(obj);
    return obj;
}
nl = false;
document.getElementById("input").onkeydown = (e)=>{
    if(e.key === "Shift"){
        nl = true;
    }
}

document.getElementById("input").onkeyup = (e) =>{
    if(e.key === "Enter" && nl === false && document.getElementById("input").value){
        send({"content":`${document.getElementById("input").value}`,"author":ls.username,"timestamp":Date.now(),"channel":{"id":channelId}}).then((resp)=>{
            console.log(resp)
            document.getElementById("input").value = ""
            xhttp.open("GET", "storage.json",true);
            xhttp.send();
            dispMsgs()
            //window.location.reload()
        }).catch((err)=>{
            console.error(err)
        })
    }
}
//constants setup


//functions

function channelSwitch(channel){
    xhttp.open("GET", "storage.json",true);
    xhttp.send();
    channelId=channel;
    ls.channel=channel;
    localStorage.chat = JSON.stringify(ls)
    document.getElementById("title").innerText = `#${storage[channelId].name} | HCLC`;
    document.getElementById("channel").innerHTML = `<h2> #${storage[channelId].name}</h2>`;
    dispMsgs();
}

function readTimestamp(t){
    let time = parseInt(t)
    let d = new Date(time)
    time = `${d}`
    return time.slice(4,21);
}

function dispChannels(){
    document.getElementById("nav").innerHTML=""
    for(var i = 0; i < storage.channels.length; i++){
        document.getElementById("nav").innerHTML+=`<br><br><button class="nav_button" onClick="channelSwitch('${storage.channels[i]}')"><h3><b> # ${storage[storage.channels[i]].name}</b></h3></button>`
    }
}

async function dispMsg (msg,channel){
    let content = msg.content.replace("\n","<br>")
    document.getElementById("message").innerHTML += `<span><h3 class="a">${msg.author} - ${readTimestamp(msg.timestamp)}</h3>${content}<br></span>`
}

function dispMsgs(content, author, timestamp, channel) {
    document.getElementById("message").innerHTML = ""
    console.log(storage.channels);
    for(var i = 0; i < storage.channels.length; i++){
        
        if(channelId == storage.channels[i]){
            
            let channel = storage.channels[i]

            for(var j = 0; j < storage[channel].messages.length; j++){

                let msg = storage[channel].messages[j]
                dispMsg(msg).catch((err)=>{
                    console.warn(err)
                })
            }
        }
        
    }   
    document.getElementById("message").scroll(0, 10000000)
}


//retrieve storage.json
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
        storage = JSON.parse(xhttp.responseText)
        dispChannels()
        dispMsgs()
        document.getElementById("title").innerText = `#${storage[channelId].name} | HCLC`;
        document.getElementById("channel").innerHTML = `<h2> #${storage[channelId].name}</h2>`;
    }
}
xhttp.open("GET", "storage.json",true);
xhttp.send();


/*document.body.onclick = () => {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            storage = JSON.parse(xhttp.responseText)
            dispMsg()
            console.log(xhttp.responceText)
            console.log(storage.messages)
        }
    }
    xhttp.open("GET", "storage.json",true);
    xhttp.send();
}*/

/*
function save(){
    const options = {
        "method": 'POST',
        headers:{
            "content-type":"application/json"
        },
        "body":JSON.stringify(storage)
    }
    fetch('/api', options)
    fetch('/api-temp',options)
}
*/

//test features
