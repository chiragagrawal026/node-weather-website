const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engines and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title:'Weather',
        name:'Chirag Agrawal'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Chirag Agrawal'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        helpText:'This is some helpful text',
        name:'Chirag Agrawal'
    })
})

app.get('/weather',(req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Address must be provided.'
        })    
    }

    const address=req.query.address

    geocode(address, (error, {location,latitude,longitude}={} ) => {       
        if(error){
            return res.send ({ error })
        } 
        forecast(latitude, longitude, (error, {description,temperature,humidity,moreData}={}) => {
            if (error) {
                return res.send ({ error })
            } 

            res.send ({
                forecast:description,
                temperature:temperature +' C',
                humidity:humidity+ '%',
                moreData,
                location,
                address
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title:'404',
        errorMessage:'Help Article not found',
        name:'Chirag'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title:'404',
        errorMessage:'Page not found!',
        name:'Chirag'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})