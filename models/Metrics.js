const {Schema, model} = require('mongoose');

const metricsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    commandName: {
        type: String,
        required: true,
        default: null
    },
    timesRun: {
        type: Number,
        required: true
    }

});

module.exports = model("Users", userSchema);