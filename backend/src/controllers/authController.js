import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new tourist user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim()) || typeof password !== 'string' || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 3. Create new user (default role is 'tourist')
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim().trim(),
      password,
      role: 'tourist',
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to RajaRata DayTrail.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data received.',
      });
    }
  } catch (error) {
    console.error('[Registration Error]', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim().trim() });

    // 3. Verify user and password
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        message: 'Login successful!',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      // Return generic error message to protect credential discovery (FR-025, NFR-SEC-05)
      res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      });
    }
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
};

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/profile
 * @access  Private (Protected by JWT)
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user was populated by the protect middleware
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }
  } catch (error) {
    console.error('[Profile Error]', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile.',
    });
  }
};