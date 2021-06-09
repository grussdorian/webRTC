const socket = io('ws://192.168.1.104:8080');
var canvas = document.getElementById('art');
var context = canvas.getContext('2d');

context.font= '16px Arial';
context.textBaseline = 'middle';
context.fillStyle = '#000000';

socket.on('message',(message)=>{
    var element = document.createElement('li');
    element.innerText = message;
    var messages = document.getElementById('messages');
    messages.appendChild(element);
})
sendMessage = ()=>{
    const msg =  document.getElementById('message-box');
    const message = msg.value;
    msg.value = '';
    socket.emit('message',message);
}
document.getElementById('send').addEventListener("click", sendMessage);
const peer = new Peer(undefined,{
    host:"/",
    port:'8081'
})
peer.on('open',id=>{
    socket.emit('sdpExchange',id);
})
peer.on('connection',(conn)=>{
    conn.on('data',(data)=>{
        var text = '(' + data.x + ', ' + data.y+ ')';
        document.getElementById('coordinates').innerText = `(${data.x},${data.y})`;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(data.x, data.y, 3, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
        context.fillText(text, data.x + 5, data.y-5);
    })
})



canvas.addEventListener('mouseout', function(e) {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// canvas.addEventListener('mousemove', function(e) {

//   var text = '(' + e.layerX + ', ' + e.layerY + ')';
//   context.fillText(text, e.layerX + 5, e.layerY-5);
// });