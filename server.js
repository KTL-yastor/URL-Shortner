const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortURL');
mongoose.connect('mongodb://127.0.0.1/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('Connected to database'))

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); // to make sure that we can access the data from the form in our request handler
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {title: 'Home', shortUrls: shortUrls});
})

app.post('/shortUrls',async (req, res) => {
    //teraz musimy stworzyć nowy obiekt ShortUrl, który będzie zawierał pełny adres URL,
    //który użytkownik wprowadził do formularza.
    //Aby to zrobić, musimy użyć modelu ShortUrl, który zaimportowaliśmy na początku pliku.
    //Następnie używamy metody create, która tworzy nowy obiekt ShortUrl w naszej bazie danych.
    //poniewaz input ma name="fullUrl" to req.body.fullUrl

    await ShortUrl.create({full: req.body.fullUrl});
    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {

    //teraz musimy znaleźć obiekt ShortUrl w bazie danych, 
    //który ma taki sam skrót, jak ten, który został przekazany w adresie URL.
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();
    //teraz musimy przekierować użytkownika na pełny adres URL,
    // odczytuje go z obiektu ShortUrl czyli z bazy danych

    res.redirect(shortUrl.full);

})
 
//delete short url from database and redirect to home page  <form action="/shortUrls/<%= shortUrl._id %>?_method=DELETE" method="POST">
app.post('/shortUrls/:id', async (req, res) => {

    await ShortUrl.findByIdAndDelete(req.params.id).then(() => console.log('Deleted'));
    res.redirect('/');

})

app.listen(process.env.port || 3000, () => console.log('Server running on port 3000'));