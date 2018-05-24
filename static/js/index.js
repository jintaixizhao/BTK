var ipEle = document.getElementById("ipAddress")
const btnEditPage = document.querySelector("#editPage")
const getPWD = document.querySelector("#getPWD")

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}
// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function(response) {
            if (callback) callback(response);
        });
    });
}

// 发送消息，通知页面可编辑
$('#editPage').click(() => {
    sendMessageToContentScript('editPage');
});
// 发送消息，停止页面可编辑
$('#cancelEditPage').click(() => {
    sendMessageToContentScript('cancelEditPage');
});
// 发送消息，查询页面密码
$('#getPWD').click(() => {
    sendMessageToContentScript('getPWD');
});
// 发送消息，下载页面图片
$('#showLine').click(() => {
    sendMessageToContentScript('showLine');
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //console.log('收到来自content-script的消息：');
    console.log(request);
    if(request.type=="getPWD"){
        var value = request.value==""?"本页没有密码":request.value
        $("#pwds").html(value)
    }
    //sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});


document.addEventListener('DOMContentLoaded', function() {
    getIP()
}, false);

function getIP() {
    var ipaddress = '';

    function getIPcallback(_ips) {
        var ips = _ips.filter(function(item) {
            return item.indexOf(":") < 0
        })
        ipaddress = ips.join('\n');
        ipEle.value = ipaddress;
        $("#copyIP").click(function(){
            ipEle.select();
            document.execCommand("Copy");
        })
    }

    !(function getLocalIPs(callback) {
        var ips = [],
            RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection,
            pc = new RTCPeerConnection({ iceServers: [] });

        pc.createDataChannel('');
        pc.onicecandidate = function(e) {
            if (!e.candidate) {
                pc.close();
                callback(ips);
                return;
            }
            var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
            if (ips.indexOf(ip) == -1)
                ips.push(ip);
        };
        pc.createOffer(function(sdp) {
            pc.setLocalDescription(sdp);
        }, function onerror() {});
    })(getIPcallback)
}