import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { JWT_SECRET } from '../config/jwt';
import { localDb } from '../services/localDb';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || (!phone && !email) || !password) {
      return res.status(400).json({ 
        error: 'Name, password, and either a Phone Number or Email are required.' 
      });
    }

    // Check if phone or email is already registered
    if (phone) {
      const existingPhone = localDb.findUserByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ error: 'This Mobile Number is already registered. Please log in.' });
      }
    }

    if (email) {
      const existingEmail = localDb.findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'This Email is already registered. Please log in.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = localDb.createUser({
      name: name.trim(),
      phone: phone ? phone.trim() : undefined,
      email: email ? email.trim() : undefined,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error('[User] Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, phone, email, password } = req.body;
    const loginTarget = identifier || phone || email;

    if (!loginTarget || !password) {
      return res.status(400).json({ error: 'Please enter your Mobile Number or Email, and Password.' });
    }

    const user = localDb.findUserByIdentifier(loginTarget);
    if (!user) {
      return res.status(401).json({ error: 'Account not found. Please check your Mobile Number or Email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error('[User] Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

export const getUserMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = localDb.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      xp: user.xp,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = localDb.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('[User] Stats error:', error);
    res.status(500).json({ error: 'Failed to calculate user stats' });
  }
};
