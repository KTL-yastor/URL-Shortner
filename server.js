const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
})

app.listen(process.env.port || 3000, () => console.log('Server running on port 3000'));