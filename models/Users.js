const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    warnsIssued: {
        type: Number,
        required: true,
        default: 0
    },
    recoveryKey: {
        type: String,
        required: true
    },
    recoveryKeyVoid: {
        type: Boolean,
        required: true
    }

});

module.exports = model("Users", userSchema);