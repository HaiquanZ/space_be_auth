const express = require('express');
const userRouter = require('./api/routes/userRouter');
const calendarRouter = require('./api/routes/calendarRouter')
const errorHandler = require('./api/middlewares/handle-error')
const app = express();
const db = require('./api/config/db')

//grpc
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('C:/grpc/helloworld.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

function extractNumberFromFilename(filename) {
  const regex = /\/(\d+)\.jpg$/;
  const match = filename.match(regex);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  } else {
    throw new Error('Invalid filename format');
  }
}

async function SendAvatar(call, callback) {
  const userId = extractNumberFromFilename(call.request.link);
  await db.promise().query(
    "UPDATE user SET avatar = ? WHERE id = ?", [call.request.link, userId]
  )
  callback(null, { message: "Upload success" });
}
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

  const server = new grpc.Server();
  server.addService(hello_proto.Avatar.service, { SendAvatar: SendAvatar });
  server.bindAsync(
    "localhost:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );

app.use(express.json());
// app.use('/', (req, res) => {
//     return res.status(200).json({"msg": "OK"});
// })
app.use('/', userRouter);
app.use('/calendar', calendarRouter);
app.use(errorHandler);



app.listen(8001, () => {
    console.log('Auth service listening on 8001')
})