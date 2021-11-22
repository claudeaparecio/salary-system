const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReceiptSchema = new Schema({
    employee: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    invoice: { type: mongoose.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    transaction: { type: Object }
}, {
    timestamps: true
});

module.exports = mongoose.model('Receipt', ReceiptSchema)