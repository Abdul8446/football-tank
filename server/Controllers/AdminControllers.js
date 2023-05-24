const User = require("../Models/UserModel");

module.exports.adminHome = (req, res) => {
  if (req.user) {
    res.json({ admindata: req.user, admin: true });
  } else {
    res.json({ error: { message: "token expired" } });
  }
};

module.exports.adminLoginGet = (req, res) => {
  if (req.user) {
    res.json({ admindata: req.user, admin: true });
  } else {
    res.json({ error: { message: "token expired" } });
  }
};

module.exports.usersData = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ error: { message: "token expired" } });
    } else {
      const users = await User.find({}).exec(); // Use exec() to execute the query and return a promise
      // You can send the retrieved users to the client or perform other operations with the data
      res.json(users);
    }
  } catch (err) {
    // Handle the error and send an appropriate response to the client
    res.json({ error: { message: "Failed to retrieve users data" } });
  }
};

module.exports.blockUser = async (req, res) => {
  const userId = req.query.id;
  const status = JSON.parse(req.query.status);
  try {
    if (!req.user) {
      return res.json({ error: { message: "token expired" } });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: !status },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user status", err);
    res.json({ error: "Failed to update user status" });
  }
};
