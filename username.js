const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3002;

const express = require('express');   
const app = express();  

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const path = require("path");
const fs = require("fs");

const adjlist = ['Lazy', 'Intrepid', 'Bright', 'Colorful', 'Amazing', 'Inspiring', 'Silent', 'Regal', 'Resplendent', 'Swift', 'Honored', 'Giddy'];
const nounlist = ['Lord', 'Idiom', 'Beaver', 'Caracal', 'Alligator', 'Coder', 'Shadow', 'Regent', 'Falcon', 'Wizard', 'One', 'Gopher'];

// waits until the string 'namerequest' has been written into the txt file and then changes it to a randomly generated username
fs.watch('username.txt', (eventType, filename) => {
    if (eventType === 'change') {
        const data = fs.readFileSync('username.txt', 'utf8');
        if (data === 'namerequest') {
            const radj = adjlist[Math.floor(Math.random() * adjlist.length)];
            const rnoun = nounlist[Math.floor(Math.random() * nounlist.length)];
            const rng = Math.floor(1 + Math.random() * 90);
            fs.writeFile('username.txt', radj+rnoun+rng.toString(), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to file');
                }
            });
        }
    }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});