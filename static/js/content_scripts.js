// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    switch(request){
        case "editPage": editPage();break;
        case "cancelEditPage": cancelEditPage();break;
        case "getPWD": getPWD(request, sender, sendResponse);break;
        case "showLine": showLine();break;
    }
});

function editPage(){
    document.body.setAttribute('contenteditable', true);
}

function cancelEditPage(){
    document.body.setAttribute('contenteditable', false);
}

function getPWD(request, sender, sendResponse){
    const pwdStr = Array.prototype.slice.apply(document.querySelectorAll("input[type=password]")).map(i=>{
        return i.value
    }).join("<br>")
    chrome.runtime.sendMessage({type:"getPWD",value: pwdStr}, function(response) {});
}

function showLine(){
    [].forEach.call(document.querySelectorAll("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)})
}
