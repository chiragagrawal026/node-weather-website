const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url= 'http://api.openweathermap.org/data/2.5/onecall?lat='+ encodeURIComponent(latitude) +'&lon='+ encodeURIComponent(longitude) +'&appid=19bfdae687da8b7565012bccdc5f6d2d&units=metric'
    
    request({url, json:true}, (error, response) => {
        const {body} = response

        if(error) {
            callback('Unable to connect to weather service!', undefined)
        } else if(body.message) {
            callback('Unable to find location!', undefined)
        } else {
            callback(undefined, {
                description: body.daily[0].weather[0].description,
                temperature: body.current.temp,
                humidity: body.current.humidity
            })    
        } 
    })
}

module.exports = forecast