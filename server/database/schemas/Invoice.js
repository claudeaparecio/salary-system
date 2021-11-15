const mongoose = require('mongoose');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
    amount: { type: Number, required: true, },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    number_of_hours: { type: Number, required: true },
    description: { type: String, },
    reference_number: { type: String, required: true },
    hourly_rate: { type: Number, required: true},
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema)