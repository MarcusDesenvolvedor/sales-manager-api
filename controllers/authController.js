import userSchema from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator"

dotenv.config();

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const sanitizedErrors = errors.array().map(({ msg, param, location }) => ({
      msg,
      param,
      location,
    }));
    return res.status(400).json({ errors: sanitizedErrors });
  }

  try {
    const { login, password } = req.body;

    const existingUser = await userSchema.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userSchema({
      login,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao registrar usuário", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await userSchema.findOne({ login }).lean();
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ login: user.login }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      expiresIn: "6 hours",
      user: {
        id: user._id,
        login: user.login,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
