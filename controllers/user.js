const UserModel = require('../models/user');
const { ROLE } = require('../role/role');
const responseHandler = require('response-handler');
// const ObjectID = require('mongodb').ObjectID;
const dotenv = require('dotenv');
dotenv.config();

const startingApp = async () => {
  try {
    const user = await UserModel.find();
    if (user.length === 0) {
      //const defaultUser = await makeDefaultUser();
      const defaultUser = await UserModel.create({
        name: process.env.DEFAULT_SUPERADMIN_NAME,
        email: process.env.DEFAULT_SUPERADMIN_EMAIL,
        password: process.env.DEFAULT_SUPERADMIN_PASSWORD,
        role: ROLE.SUPERADMIN
        // createdBy: new ObjectID()
      });
      const token = await defaultUser.generateAuthToken();
      // res.status(200).json({ defaultUser, token });
      // return responseHandler(res,200,null,{defaultUser,token});

      console.log(process.env.DEFAULT_SUPERADMIN_EMAIL);
      defaultUser.save();

      console.log(process.env.DEFAULT_SUPERADMIN_PASSWORD);
    }
    // res.status(200).json({ message: 'login required for any process' }); //change unauth
    // return responseHandler(res,200,null,{message:"login required for any process"});
  } catch (error) {
    // res.status(500).json({ message: 'something went wrong' });
    // return responseHandler(res,200,error,null);
    console.log(error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    if (user.passwordChange === false) {
      res.send({ user, token, message: 'please change your default password' });
      // return responseHandler(res,200,null,{user,token,message:"please change your default password"});
    } else {
      res.send({ user, token });
      // return responseHandler(res,200,null,{user,token});
    }
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send();
    // return responseHandler(res,400,error,null);
  }
};
const createUser = async (req, res) => {
  const { role } = req.params;
  const { name, email, password } = req.body;
  console.log(process.env.DEFAULT_ADMIN_PASSWORD);
  try {
    if (!role == 'super-admin' && !role == 'admin' && !role == 'cashier') {
      throw new Error("role doesn't exists!");
    }
    const newUser = new UserModel({
      name,
      email,
      password,
      role,
      createdBy: req.user._id
    }); //default pass
    const newUserSaved = await newUser.save();
    const token = await newUserSaved.generateAuthToken();

    if (newUserSaved.passwordChange === false) {
      res.send({
        newUserSaved,
        token,
        message: 'please change your default password'
      });
      // return responseHandler(res,200,null,{newUserSaved,token,message:"please change your default password"});
    } else {
      res.status(200).json({ newUserSaved, token });
      // return responseHandler(res,200,null,{newUserSaved,token});
    }
  } catch (error) {
    res.status(500).send(error.message);
    // return responseHandler(res,500,error,null);
  }
};

module.exports = {
  startingApp,
  login,
  createUser
};
