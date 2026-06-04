const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');   
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: '.hbs'}));  
app.set('view engine', '.hbs');                 

const path = require('path');
const fs = require('fs');

const httpServer = http.createServer(app);

const { readdir } = require('node:fs/promises');
const { readdirSync } = require('node:fs');

app.get('/', function(req, res){
    res.render('test'); 
    });

// Reads the text file
app.get('/read-username-file', (req, res) => {
    fs.readFile('username.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
});

app.post('/write-to-username-file', (req, res) => {
    fs.writeFile('username.txt', 'namerequest', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('File written successfully!');
    });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
