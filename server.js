var net = require('net');
var clients = [];

var server = net.createServer((socket) => {
  socket.clientName = socket.remoteAddress + ":" + socket.remotePort;
  clients.push(socket);
  console.log('Client connected: ' + socket.clientName + ' Total: ' + clients.length);
  sendConnectionInformation();
    socket.on('data', (data) => {
      processSocketData(socket, data.toString('utf-8'));
    });

    socket.on('end', function () {
        console.log('end, socket disconnected', socket.clientName);
        //removeClient(socket);
    });

    socket.on('close', function () {
        console.log('close, socket disconnected', socket.clientName);
        removeClient(socket);
    });

    socket.on('error', function (error) {
        console.log('error, socket disconnected', error);
        removeClient(socket);
    });
});

port = 9093
server.listen(port, ()=>{
    console.log('Started server on port:',port);
});

function sendConnectionInformation(){
    let msg = '' + clients.length + ' clients connected';
    let json = { 'Message': msg }
    clients.forEach((client, index, array) => {
        console.log("Sending data to: " + client.clientName);
        client.write(JSON.stringify(json) + '\n');
    });
}

function processSocketData(from, message){
    console.log('Message from: ' + from.clientName + ': ' + message);
    if (clients.length <= 1){
        console.log("Too few clients connected: " + clients.length);
        return;
    }
    clients.forEach((client, index, array) => {
        if(client.clientName === from.clientName) return;
        console.log("Sending data to: " + client.clientName);
        client.write(message);
    });
}

function removeClient(socket){
    clients.splice(clients.indexOf(socket), 1);
    console.log("Connected clients: " + clients.length);
}