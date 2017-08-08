let express = require('express');
let http = require('http');
let path = require('path');
let config = require('./config');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let mongoose = require('./libs/mongoose');
let mainRoutes = require('./routes/mainRoutes');
let appRoutes = require('./routes/appRoutes');

let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let mongoose_store = new MongoStore({mongooseConnection: mongoose.connection});

let app = express();

app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    saveUninitialized: false,
    resave: false,
    store: mongoose_store
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.use('/', mainRoutes);
app.use('/app', appRoutes);

http.createServer(app).listen(config.get('port'), function() {
    console.log('Express server listening on port ' + config.get('port'));
});
