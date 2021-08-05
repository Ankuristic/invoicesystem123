const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const InvoiceModel = require('../models/invoice');
const { ROLE, ROLE_VALUE } = require('../role/role');
const dotenv = require('dotenv');
dotenv.config();
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'thisismynewcourse');

    const user = await UserModel.findOne({
      _id: decoded._id,
      'tokens.token': token
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    if (user.passwordFlag === false) {
      req.message = 'please change your password';
    }
    next();
  } catch (error) {
    res.status(401).send({ error: 'authentication failure' });
  }
};

const authRole = (req, res, next) => {
  const { role } = req.params;
  try {
    const LoggedUserRole = req.user.role;
    const LoggedUserRoleValue = ROLE_VALUE[LoggedUserRole];
    if (LoggedUserRoleValue === 0 || LoggedUserRoleValue < ROLE_VALUE[role]) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(400).send({ message: 'user not allowed for this action' });
  }
};

// const authUpdateUser = (req, res, next) => {
//   const { id } = req.params;
//   try {
//     if (id !== req.user.id) {
//       throw new Error();
//     }
//     next();
//   } catch (error) {
//     res.status(400).send({ message: 'user not allowed for this action' });
//   }
// };

// const authGetInvoice = async (req, res, next) => {
//   try {
//     if (req.user.role === ROLE.CASHIER) {
//       req.invoiceList = await Invoice.find({ invoiceBy: req.user._id });
//       next();
//     } else {
//       req.invoiceList = await Invoice.find();
//       next();
//     }
//   } catch (error) {
//     res.status(500).send({ message: 'somthing went wrong' });
//   }
// };

module.exports = {
  auth,
  authRole
  // authUpdateUser,
  // authGetInvoice
};
