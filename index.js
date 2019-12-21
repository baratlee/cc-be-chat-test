const inquirer = require('inquirer');
const WebSocket = require('ws');

var wsclient = new WebSocket("ws://127.0.0.1:3000");

wsclient.on('open', function open() {
  // console.log('connected\n');
});

wsclient.on('close', function close() {
  console.log('disconnected\n');
});

wsclient.on('message', function incoming(data) {
  console.log(data+'\n');
});

const run = async () => {
  let name = "";
  while ("" === name){
    const { name } = await askName();
    if ("" === name){
      continue;
    }
    wsclient.send(name);
    while (true) {
      const answers = await askChat();
      const { message } = answers;
      if ("" === message){
        continue;
      }
      wsclient.send(message);
      // console.log(`${name}: `, message);
    }
  }
};

const askChat = () => {
  const questions = [
    {
      name: "message",
      type: "input",
      message: "Enter chat message:"
    }
  ];
  return inquirer.prompt(questions);
};

const askName = () => {
  const questions = [
    {
      name: "name",
      type: "input",
      message: "Enter your name:"
    }
  ];
  return inquirer.prompt(questions);
};

run();
