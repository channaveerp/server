import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

// signin
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await userModel.findOne({ email: email });

    if (!email || !password) {
      return res.status(404).json({ message: 'Please fill data' });
    }
    if (!oldUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isOlderPassword = await bcrypt.compare(password, oldUser.password);
    if (!isOlderPassword) {
      return res.status(401).json({ message: 'Wrong credentials' });
    }

    const token = jwt.sign(
      {
        email: oldUser.email,
        userId: oldUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user: oldUser, token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// signup
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(404).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        userId: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user: newUser, token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const googleSignIn = async (req, res, next) => {
  const { name, email, token, googleId } = req.body;
  try {
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }
    const result = await userModel.create({ email, name, googleId });
    res
      .status(200)
      .json({ result, token, message: 'new google user creted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
