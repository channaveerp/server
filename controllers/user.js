import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

const secret = 'test';

// signin

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await userModel.findOne({ email: email });

    if (!oldUser)
      return res.status(404).json({ message: 'user doews not exist' });
    const isOlderPassword = await bcrypt.compare(password, oldUser.password);
    if (!isOlderPassword)
      return res.status(404).json({ message: 'wrong credentials' });

    // token
    const token = await jwt.sign(
      {
        email: oldUser.email,
        password: oldUser.password,
      },
      secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ oldUser, token });
  } catch (err) {
    console.log(err.message);
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    //    if user is already existed
    const olduser = await userModel.findOne({ email });
    if (olduser) {
      return res.status(400).json({ message: 'user already exists' });
    }
    //  password hashing
    const passwordHash = await bcrypt.hash(password, 12);
    // create new user
    const newuser = await userModel.create({
      email,
      password: passwordHash,
      name: `${firstName} ${lastName}`,
    });
    // creating jwt token
    const token = await jwt.sign(
      {
        email: newuser.email,
        id: newuser._id,
      },

      { expiresIn: '1h' }
    );
    //  sending user created response
    res.status(201).json({ newuser, token });
  } catch (err) {
    res.status(500).json({ message: 'something went wrong' });
    console.error(err);
  }
};
