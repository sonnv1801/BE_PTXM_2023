const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      // Kiểm tra email đã tồn tại trong cơ sở dữ liệu
      const existingEmail = await User.findOne({ email: req.body.email });

      if (existingEmail) {
        // Nếu email đã tồn tại, báo lỗi và ngừng thêm người dùng mới
        return res.status(409).json({
          message: 'Email đã tồn tại.',
        });
      }

      // Kiểm tra số điện thoại đã tồn tại trong cơ sở dữ liệu
      const existingPhone = await User.findOne({ phone: req.body.phone });

      if (existingPhone) {
        // Nếu số điện thoại đã tồn tại, báo lỗi và ngừng thêm người dùng mới
        return res.status(409).json({
          message: 'Số điện thoại đã tồn tại.',
        });
      }

      // Kiểm tra tên người dùng đã tồn tại trong cơ sở dữ liệu
      const existingUsername = await User.findOne({
        username: req.body.username,
      });

      if (existingUsername) {
        // Nếu tên người dùng đã tồn tại, báo lỗi và ngừng thêm người dùng mới
        return res.status(409).json({
          message: 'Username đã tồn tại.',
        });
      }

      // Nếu cả email, số điện thoại và tên người dùng không tồn tại, tiếp tục thêm người dùng mới
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Tạo người dùng mới
      const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        username: req.body.username,
        password: hashed,
      });

      // Lưu người dùng vào cơ sở dữ liệu
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: '10d',
      }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: '365d',
      }
    );
  },

  //Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json('Wrong username!');
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json('Wrong password!');
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });

        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Refresh token is not valid');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  },

  userLogout: async (req, res) => {
    res.clearCookie('refreshToken');
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json('Logged out!');
  },
};

module.exports = authController;
