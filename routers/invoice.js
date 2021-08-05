const express = require('express');
const {
  downloadInvoice,
  allInvoice,
  searchInvoice
} = require('../controllers/invoice');
const { auth, authGetInvoice } = require('../middleware/auth');
const router = express.Router();

router.post('/invoice/downloadInvoice', auth, downloadInvoice);
router.get('/invoice/all', auth, allInvoice);
router.get('/invoice/search/:id', auth, searchInvoice);

module.exports = router;
