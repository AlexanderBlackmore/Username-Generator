# Username-Generator
Hey Jonathan, 
To call on the microservice, utilize a function (or functions) that writes 'namerequest' into the connected txt file and then reads the txt file such as:

Backend - Javascript:
```javascript
app.post('/write-to-username-file', (req, res) => {
    fs.writeFile('username.txt', 'namerequest', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to file');
        }
        res.send('File written successfully!');
    });
});

app.get('/read-username-file', (req, res) => {
    fs.readFile('username.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
});
```

Frontend - HTML:
```javascript
<script>
    document.getElementById('rusername').addEventListener('click', async () => {
        const write = await fetch('/write-to-username-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textData: "namerequest" })
        });
        const result = await write.text();
        alert('username generated');
        try {
            // Request the file data from the Node.js endpoint
            const read = await fetch('read-username-file');
            const text = await read.text();
            document.getElementById('registername').value = text;
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
</script>
```

## How to Run Test File

Install NPM:

```bash
npm install
```

Start the microservice:

```bash
npm start
```
