let mongoose = require('../libs/mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({

    projectName: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    developers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    tasks: [
        {
            taskName: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "Waiting"
            },
            developers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            ],
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comments: [
                {
                    author: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    text: {
                        type: String,
                        required: true
                    },
                    created: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', schema);
