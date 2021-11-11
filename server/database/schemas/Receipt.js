const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReceiptSchema = new Schema({
    employee: { type: mongoose.Types.ObjectId, ref: 'Employee', required: true },
    invoice: { type: mongoose.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    memo: { type: String, }
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', ReceiptSchema)