const socket = io('ws://192.168.1.104:8080');
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
    // console.log('My id is ',id);
})
socket.on('sdpExchange',(id)=>{
    console.log('sdp is here => ' , id );
    var conn = peer.connect(id);
    conn.on('open',()=>{
        // $( "div" ).mousemove(function( event ) {
        //     var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
        //     var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
        //     $( "span" ).first().text( "( event.pageX, event.pageY ) : " + pageCoords );
        //     $( "span" ).last().text( "( event.clientX, event.clientY ) : " + clientCoords );
        //     conn.send(clientCoords);
        //     });
        var canvas = document.getElementById('art');
        var context = canvas.getContext('2d');
        
        context.font= '16px Arial';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        
        canvas.addEventListener('mouseout', function(e) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        });
        
        canvas.addEventListener('mousemove', function(e) {
          var text = '(' + e.layerX + ', ' + e.layerY + ')';
          conn.send({x:e.layerX,y:e.layerY});
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.beginPath();
          context.arc(e.layerX, e.layerY, 3, 0, 2 * Math.PI, false);
          context.closePath();
          context.fill();
          context.fillText(text, e.layerX + 5, e.layerY-5);
        });
    })
})

