const mongoose = require('mongoose');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
    amount: { type: Number, required: true, },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    number_of_hours: { type: Number, required: true, },
    description: { type: String, },
    reference_number: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema)