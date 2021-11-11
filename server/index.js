const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const configPassport = require('./passport/passport-config');

require('./config/environment');

const uri = `mongodb+srv://admin:66oVouJHrCSYZmRh@salary-system.k9ayw.mongodb.net/salary-system?retryWrites=true&w=majority`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const database = mongoose.connect(uri, options)
.then(() => {
    console.log('Connected to database.')
    const assetFolder = path.resolve(__dirname, '../dist/');
    const port = process.env.PORT;
    const app = express();
    
    app.use(express.static(assetFolder));
    app.use(bodyParser.json());
    
    configPassport(app, express);
    
    app.use('/', routes);
    
    app.listen(port, () => console.log(`Server is listening on port ${port}`));

})
.catch(err => console.error('Error connecting to database:', err.message));

mongoose.Promise = global.Promise;
