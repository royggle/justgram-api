const userService = require("../services/userService");

const createUser = async (req, res) => {
  const { email, nickname, password, profile_image } = req.body;

  const hasKey = { email: false, password: false, nickname: false };
  const requireKey = Object.keys(hasKey);
  try {
    const user = await userService.createUser(
      email,
      nickname,
      password,
      profile_image
    );
    res.status(201).json({ message: "userCreated" });
  } catch {
    res.status(500).json({ message: "Signup Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser(email, password);
    if (user === 1) {
      res.status(500).json({ message: "USER CANNOT BE FOUND" });
    }
    if (user === 2) {
      res.status(500).json({ message: "INVALID PASSWORD" });
    } else {
      res.status(200).json({ message: "LOGIN_SUCCESS", token: user });
    }
  } catch {
    res.status(500).json({ message: "LOGIN_ERROR" });
  }
};

module.exports = { createUser, loginUser };
