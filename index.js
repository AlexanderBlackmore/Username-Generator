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

const cors = require('cors');
app.use(cors());

const path = require('path');
const fs = require('fs');

const httpServer = http.createServer(app);

const multer = require('multer');
const { readdir } = require('node:fs/promises');
const { readdirSync } = require('node:fs');

const upload = multer({
  dest: '/public/images'
});

const { collection, db } = require('./mongodb')

app.get('/', function(req, res){
    res.render('login'); 
    });

app.get('/register', function(req, res){
    res.render('register'); 
    });

app.post('/loginform', async (req, res) => {
    try {
        const infoCheck = await collection.findOne({name: req.body.name});
        if (infoCheck.password === req.body.password) {
            fs.writeFile('user.txt', req.body.name, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to file');
                }
                res.render('home');
            });
        } else {
            res.send('Incorrect Password');
        }
    } catch (e) {
        res.send('No Matching User Information');
    }
});

app.post('/registerform', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };
    fs.writeFile('user.txt', req.body.name, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        await collection.insertMany([data]);
        res.render('home');
    });
});

app.post('/upload', upload.single('file'), function(req, res) {
    var file = './public/images' + '/' + req.file.originalname;
    fs.readFile('user.txt', 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        await collection.updateOne(
            { name: data },
            { $push: { images: req.file.originalname }}
        )
    });
    fs.rename(req.file.path, file , function(err) {
        res.render('home')
    });
});

app.get('/api/images', async (req, res) => {
    fs.readdir('./public/images', (err, files) => {
        fs.readFile('user.txt', 'utf8', async (err, data) => {
            if (err) {
                return res.status(500).send('Error reading file');
            }
            const usercol = await collection.findOne({name: data}, 'images').exec();
            const userimages = usercol.images;
            console.log(userimages);
            res.json(userimages);
        });
    });
});

app.get('/read-verification-file', (req, res) => {
    fs.readFile('verification.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
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

// Writes into the text file
app.post('/write-to-verification-file', (req, res) => {
    fs.writeFile('verification.txt', 'verify', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('File written successfully!');
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