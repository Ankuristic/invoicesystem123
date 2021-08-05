const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const data = require('../helpers/data');

const homeview = (req, res, next) => {
  res.render('home');
};

const generatePdf = async (req, res, next) => {
  const html = fs.readFileSync(
    path.join(__dirname, '../views/template.html'),
    'utf-8'
  );
  const filename = Math.random() + '_doc' + '.pdf';
  let array = [];

  data.forEach((d) => {
    const prod = {
      customername: d.name,
      customeremail: d.email,
      invoiceBy: d.invoiceBy,
      Date: d.Date,
      price: d.price,
      total: d.quantity * d.price
    };
    array.push(prod);
  });

  let productprice = 0;
  array.forEach((i) => {
    productprice += i.total;
  });
  const tax = (productprice * 10) / 100;
  const totalAmount = productprice + tax;
  const obj = {
    prodlist: array,
    productprice: productprice,
    totalAmount: totalAmount,
    tax: tax
  };
  const document = {
    html: html,
    data: {
      products: obj
    },
    path: './docs/' + filename
  };
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  const filepath = 'http://localhost:3000/public/docs/' + filename;

  res.setHeader('Content-disposition', 'attachment; filename=file.pdf.');
  res.set('Content-Type', 'application/pdf');
  // res.status(200).send(file);

  res.render('download', {
    path: filepath
  });
};

module.exports = {
  homeview,
  generatePdf
};
