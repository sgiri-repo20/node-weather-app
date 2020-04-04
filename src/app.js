const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(path.join(__dirname, '../views'));
console.log(__filename);

const partialsPath = path.join(__dirname, '../templates/views/partials');
console.log(partialsPath);
hbs.registerPartials(partialsPath);

app.set('views', path.join(__dirname, '../templates/views'));
app.set('view engine', 'hbs');

const publicDirectoyPath = path.join(__dirname, '../public')
// Load static file
app.use(express.static(publicDirectoyPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: "Weather App",
        name: 'Soumitra Giri'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Soumitra'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some usefull help',
        title: 'Help',
        name: 'Soumitra'
    })
})
app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Not found page'
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    
});

app.get('/product', (req, res) => {
    if(!req.query.product) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    res.send({
        forecast: 'it is snowing',
        location: 'Philadelphia',
        address: req.query.product
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Not found page',
        name: 'Soumitra'
    })
})

app.listen(3000, () => {
    console.log("Server is up")
})
