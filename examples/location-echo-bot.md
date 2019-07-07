# Location Echo Bot (with Express.js)

## Features
- Full express server with ant initialization.
- Sending longitude & latitude to user, every time when user sent location.

## Usage
Paste code from [location-echo-bot.js](location-echo-bot.js) and define your settings:

```js
// import all what we need
const { AntViber } = require('ant-telegram');
const express      = require('express');

// create new express instance
const app = express();

// define global config for ant & express
const settings = {
    token: '...', // Your token here
    host: 'https://mydomain.com', // Your host here (https required)
    name: 'LocationEchoBot',
    avatar: '',
    webhook: '/viber',
    port: 8080,
    getStatus: (userProfile) => { '...' }, // Your helper here
    setStatus: (userProfile, status) => { '...' }, // Your helper here
}

// create ant instance
const Ant = new AntViber(settings.token, settings.name, settings.avatar, {
    setStatus, getStatus,
    keyboardSettings: {
        buttonColor: '#a0b6d9',
        BorderWidth: 0,
    }
})

// add ant middleware to express server
app.use(settings.webhook, Ant.middleware());

// set webhook 
await Ant.setWebhook(settings.host + settings.webhook);

// add ant listeners
const TextMessage = Ant.Types.TextMessage;

Ant.command('/start', async user => {
    await Ant.status(user, 'echo')
    await Ant.sendMessage(user, [ TextMessage('🚩 Send me your location!') ])
})
Ant.add('location', 'echo', async (user, location) => {
    const text = `Your location:\nLongitude = ${location.longitude}\nLatitude = ${location.latitude}`;
    await Ant.sendMessage(user, [ TextMessage(text) ])
})

// start express server
app.listen(settings.port, () => {
    console.log(`Server started at ${settings.host}:${settings.port}`);
})
```