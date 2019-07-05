### Step-by-step start with MongoDB.

1. Install mongoose:  
`npm i -s mongoose`

2. Define status model:
```js
const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    userProfile: {
        type: String,
        require: true,
        unique: true,
    },
    status: {
        type: String,
    },
}, { collection: 'statuses' });

const Status = mongoose.model('Status', Schema);
```

3. Define `getStatus` and `setStatus` methods:
```js
const setStatus = (userProfile, status) => {
    return new Promise((resolve, reject) => {
        Status.findOne({ userProfile }).then(res => {
            if (res) {
                res.status = status;
                res.save(err => err ? reject(err) : resolve());
            } else {
                const newStatus = new Status({ userProfile, status });
                newStatus.save(err => err ? reject(err) : resolve());
            }
        })
        .catch(err => reject(err));
    });
}

const getStatus = userProfile => {
    return new Promise((resolve, reject) => {
        Status.findOne({ userProfile })
        .then(res => resolve(res ? res.status : null))
        .catch(err => reject(err));
    });
}
```

4. Use it in Ant:Telegram instance:
```js
const Ant = new AntTelegram(bot_token, bot_name, bot_link, { getStatus, setStatus })
``` 

5. PROFIT! Ant:Telegram fully ready to use.