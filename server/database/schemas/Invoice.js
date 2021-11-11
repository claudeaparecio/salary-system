const mongoose = require('mongoose');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
    amount: { type: Number, required: true, },
    employee: { type: mongoose.Types.ObjectId, ref: 'Employee', required: true },
    number_of_hours: { type: Number, required: true, },
    description: { type: String, },
    reference_number: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Payable', InvoiceSchema)