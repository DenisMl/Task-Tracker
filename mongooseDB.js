let mongoose = require('./libs/mongoose');
let User = require('./models/user');

let db = mongoose.connection; // mongodb native driver
console.log(mongoose.connection.readyState);
// mongoose.connection.collections[projectsCollection].drop()
db.close(function(err) {
    if (err) {
        throw err;
    } else {
        console.log('DB dropped');
    }
});
