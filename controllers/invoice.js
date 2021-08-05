const Invoice = require('../models/invoice');
const { ROLE } = require('../role/role');
const responseHandler = require('response-handler');
const dotenv = require('dotenv');
// const moment = require('moment');

dotenv.config();

const downloadInvoice = async (req, res) => {
  const { customerName, customerEmail, productsDetail } = req.body;

  try {
    let totalAmount = 0;
    let totalTax = 0;
    productsDetail.forEach((product) => {
      totalAmount = parseInt(product.price) + parseInt(product.price * 0.1);
      product.tax = product.price * 0.1; //10%
      totalTax = product.tax;
    });
    const userInvoice = new Invoice({
      customerName,
      customerEmail,
      productsDetail,
      totalAmount,
      totalTax,
      invoiceBy: req.user._id
    });
    const newInvoiceSaved = await userInvoice.save();
    res.status(200).send(newInvoiceSaved);
    // return responseHandler(res, 200, null, newInvoiceSaved);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
    // return responseHandler(res, 200, error, null);
  }
};

// GET /invoice?date&InvoiceBy
// GET /invoice?limit=10&skip=20
// GET /invoice?sortBy=createdAt:desc

const allInvoice = async (req, res) => {
  let { page, size } = req.query; //pagination
  page = page ? page : 1;
  size = size ? size : 2;
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  // if (req.query.sortBy) {
  //   const parts = req.query.sortBy.split(':');
  //   sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  // }
  const sort = req.query.sortBy === 'desc' ? -1 : 1; //sorting

  //filtering
  const { date, invoiceBy } = req.query;
  const match = {};
  match.createdAt = date ? date : null;
  match.invoiceBy = invoiceBy ? invoiceBy : null;

  try {
    let invoiceList = {};
    if (req.user.role === ROLE.CASHIER) {
      invoiceList = await InvoiceModel.find({
        invoiceBy: req.user._id,
        date: {
          $gte: ISODate(match.createdAt),
          $lt:  ISODate(match.createdAt)
        }
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: sort });
    } else {
      invoiceList = await Invoice.find({
        invoiceBy: invoiceBy,
        date: {
          $gte: new Date(match.createdAt),
          $lt:  ISODate(match.createdAt)
         
        }
      })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: sort });
    }
    res.status(200).send(invoiceList);
    // return responseHandler(res, 200, null, invoiceList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'somthing went wrong!' });
    // return responseHandler(res, 500, error, null);
  }
};

const searchInvoice = async (req, res) => {
  //search invoice by id
  const { id } = req.params;
  try {
    let invoiceList;
    console.log(ROLE.CASHIER);
    if (req.user.role === ROLE.CASHIER) {
      invoiceList = await InvoiceModel.find({
        invoiceBy: req.user._id,
        _id: id
      });
    } else {
      invoiceList = await InvoiceModel.find({ _id: id });
    }
    console.log(id);
    if (invoiceList.length === 0) {
      res.status(404).send('not found');
      return;
    }
    res.status(200).send(invoiceList);
    // return responseHandler(res, 200, null, invoiceList);
  } catch (error) {
    res.status(500).send({ message: 'somthing went wrong' });
    // return responseHandler(res, 500, error, null);
  }
};

module.exports = {
  downloadInvoice,
  allInvoice,
  searchInvoice
};
