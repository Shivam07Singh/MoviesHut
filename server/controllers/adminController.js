const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminData = require("../model/adminModel"); // Import the admin model

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    const user = new adminData({
      name,
      email,
      password: hashedPass,
    }); // Create a new user object
    await user.save(); // Save the user to the database
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      msg: "Signup Successfully",
    }); // Send a success response with user details
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors and send a response
  }
};

exports.login = async (req, res) => { 
  try {
    const { email, password } = req.body; // Destructure email and password from request body
    const user = await adminData.findOne({ email }); // Find user by email

    if (!user) {
      return res.status(404).json({ msg: "Invalid password or user not found" });
    }

    const correctPass = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password

    if (correctPass) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        process.env.JWT_SECRET_KEY, // Use the secret key from environment variables
        { expiresIn: "24h" }
      );
      res.status(200).json({ token }); // Send the JWT token as a response
    } else {
      res.status(401).json({ msg: "Invalid password" }); // Handle incorrect password
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors and send a response
  }
}