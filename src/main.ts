import express from "express";
import path from "path"
import expressWs from "express-ws"

const app = expressWs(express()).app;

let cache = "";

app.ws('/receiver_ws', function(ws, req) {
  let prevValue = cache;

  setInterval(() => {
    if (prevValue !== cache) {
      ws.send(cache)
      prevValue = cache;
    }
  }, 250) // Cache check interval = 250ms
});

app.ws('/sender_ws', function(ws, req) {
  ws.on("message", (msg) => {
    console.log(msg)
    cache = msg.toString()
  })
});

app.get('/receiver', function (req, res) {
  res.sendFile(path.join(__dirname, '/receiver.html'));
})

app.get('/sender', function (req, res) {
  res.sendFile(path.join(__dirname, '/sender.html'));
})

// For regular HTTP GET update
// app.get('/sender_update', function (req, res) {

//   console.log(req.query.value)
//   cache = req.query.value as string

//   res.redirect('/sender')
// })

app.listen(3000)