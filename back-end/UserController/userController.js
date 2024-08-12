const bcrypt = require('bcrypt');
const User = require('../UserModel/userModel');

async function register(req, res) {
    try {
        const { username, password, contact, address, qualification } = req.body;
        const newUser = new User({ username, password, contact, address, qualification });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to save OTP to database
async function saveOTPToDatabase(username, otp) {
    const user = await User.findOne({ username });
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = new Date(Date.now() + 90000); // OTP expires in 90 seconds (1.5 minutes)
    await user.save();
}

// Controller function to handle requesting OTP to reset password
async function requestOTPForPasswordReset(req, res) {
    try {
        const { username } = req.body;

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to database
        await saveOTPToDatabase(username, otp);

        // Send OTP in API response
        res.json({ message: 'OTP generated successfully', otp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller function to handle resetting password with OTP
async function resetPasswordWithOTP(req, res) {
    try {
        const { username, otp, newPassword } = req.body;

        // Check if username exists and OTP is valid
        const user = await User.findOne({ username });
        if (!user || user.resetPasswordOTP !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update user's password and clear OTP fields
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password with OTP:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to delete expired OTPs from the database
async function deleteExpiredOTP() {
    // Find and delete expired OTPs
    await User.updateMany(
        { resetPasswordExpires: { $lt: new Date() } }, // Find expired OTPs
        { $unset: { resetPasswordOTP: "", resetPasswordExpires: "" } } // Delete OTP fields
    );
}

// Schedule the cleanup function to run periodically
setInterval(deleteExpiredOTP, 60000);

module.exports = { register, login, requestOTPForPasswordReset, resetPasswordWithOTP };