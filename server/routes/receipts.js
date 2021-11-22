const express = require('express');
const {
    requireAuth
} = require('./middleware');
const {
    Receipt,
} = require('../database/schemas');
const {
    v4
} = require('uuid')

const router = express.Router();

module.exports = router;

router.get('/', requireAuth, (req, res) => {
    if (req.user.role === 'admin') {
        Receipt.find({}, (err, receipts) => {
            if (err) {
                res.status(400).send({
                    message: 'Get receipts failed',
                    err
                });
            } else {
                res.send({
                    message: 'Receipts retrieved successfully',
                    receipts
                });
            }
        })
        .populate('employee')
        .populate('invoice')
    } else {
        Receipt.find({
            employee: req.user.id
        }, {
            __v: 0,
            user: 0
        }, (err, receipts) => {
            if (err) {
                res.status(400).send({
                    message: 'Get receipts failed',
                    err
                });
            } else {
                res.send({
                    message: 'Receipts retrieved successfully',
                    receipts
                });
            }
        })
        .populate('employee')
        .populate('invoice')
    }
});

router.get('/find/:id', requireAuth, (req, res) => {
    Receipt.findById(req.params.id, {
        __v: 0,
        user: 0
    }, (err, receipt) => {
        if (err) {
            res.status(400).send({
                message: 'Get receipt failed',
                err
            });
        } else {
            res.send({
                message: 'Receipt retrieved successfully',
                receipt
            });
        }
    })
    .populate('employee')
    .populate('invoice')
});

router.post('/', requireAuth, (req, res) => {
    const newReceipt = Receipt(req.body);

    newReceipt.save((err, receiptData) => {
        if (err) {
            res.status(400).send({
                message: 'Create receipt failed',
                err
            });
        } else {
            Receipt.populate(receiptData, { path: 'invoice' })
            .then(receipt => {
                res.send({
                    message: 'Receipt created successfully',
                    receipt,
                });
            })
        }
    });
});