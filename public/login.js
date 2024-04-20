let res;

async function checkPassword(data){
    const options = {
        "method": 'POST',
        headers:{
            "content-type":"application/json",
            "body":JSON.stringify(data)
        },
        "body":JSON.stringify(data)
    }
    const res = await fetch('/login', options)
    const obj = await res.json()
    console.log(obj)
    if(obj.passes === false){
        switch(obj.error){
            case null:
                console.error("Unknown login error");
            break;
            default:
                console.warn(`login error: ${obj.error}`);
            break;
        }
    }
    return obj;
}

let disallowed = false;

function alertUser(code,a,b,c){
    switch(code){
        case "invalid login":
            document.getElementById("alert").classList.remove("hidden");
            disallowed = true;
        break;
    }
}

function run(e){
    document.getElementById("alert").classList.add("hidden")
    if(e.key != "Enter" || disallowed)return;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.toLowerCase();

    const data={
        "username":username,
        "password":password,
        "timestamp":Date.now()
    }

    checkPassword(data).then((resp)=>{
        const responce = resp
        console.log(responce)
        if(responce.passes){
            let obj = {
                    "username":data.username,
                    "timestamp":data.timestamp
                }
                obj = JSON.stringify(obj)
            if(!localStorage.chat){
                localStorage.setItem("chat",obj);
            }else{
                localStorage.chat = obj
            }
            window.location.replace("index.html")
        }else{
            alertUser("invalid login");
        }
    })
}

document.getElementById("password").onkeyup = (e) =>{
    console.log("running");
    run(e);
}

document.getElementById("username").onkeyup = (e) =>{
    console.log("running");
    run(e);
}
