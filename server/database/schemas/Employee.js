const mongoose = require('mongoose');

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    username: { type: String, required: true, },
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, },
    hourlyRate: { type: Number, required: true },
    walletAddress: { type: Number, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema)