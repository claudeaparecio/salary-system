const express = require("express");
const { requireAuth } = require("./middleware");
const { Invoice } = require("../database/schemas");
const { v4 } = require("uuid");

const router = express.Router();

module.exports = router;

router.get("/", requireAuth, (req, res) => {
  if (req.user.role === "admin") {
    Invoice.find({}, (err, invoices) => {
      if (err) {
        res.status(400).send({
          message: "Get invoices failed",
          err,
        });
      } else {
        res.send({
          message: "Invoices retrieved successfully",
          invoices,
        });
      }
    }).populate("user");
  } else {
    Invoice.find(
      {
        user: req.user.id,
      },
      (err, invoices) => {
        if (err) {
          res.status(400).send({
            message: "Get invoices failed",
            err,
          });
        } else {
          res.send({
            message: "Invoices retrieved successfully",
            invoices,
          });
        }
      }).populate("user");
  }
});

router.get("/find/:id", requireAuth, (req, res) => {
  Invoice.findById(req.params.id, (err, invoice) => {
    if (err) {
      res.status(400).send({
        message: "Get invoice failed",
        err,
      });
    } else {
      res.send({
        message: "Invoice retrieved successfully",
        invoice,
      });
    }
  }).populate("user");
});

router.post("/", requireAuth, (req, res) => {
  req.body.user = req.user.id;
  const referenceNumber = v4().split("-")[0].toUpperCase();

  const newInvoice = Invoice({
    ...req.body,
    reference_number: referenceNumber,
  });

  newInvoice.save((err, invoice) => {
    if (err) {
      res.status(400).send({
        message: "Create invoice failed",
        err,
      });
    } else {
      res.send({
        message: "Invoice created successfully",
        invoice,
      });
    }
  });
});

router.put("/", requireAuth, (req, res) => {
  Invoice.findByIdAndUpdate(
    req.body.id,
    req.body,
    {
      new: true,
    },
    (err, invoice) => {
      if (err) {
        res.status(400).send({
          message: "Update invoice failed",
          err,
        });
      } else {
        res.send({
          message: "Updated invoice successfully",
          invoice,
        });
      }
    }
  ).populate("user");
});

router.delete("/", requireAuth, (req, res) => {
  Invoice.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      res.status(400).send({
        message: "Delete invoice failed",
        err,
      });
    } else {
      res.send({
        message: "Invoice successfully delete",
      });
    }
  });
});
