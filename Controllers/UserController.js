import User from '../Models/UserModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { upload } from "../Middlewares/imageMiddleWare.js";
import mongoose from 'mongoose';
import Notification from '../Models/NotificationModel.js';
import { uploadImageToGitHub } from '../Middlewares/imageMiddleWare.js'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getAllUsers = async (req, res) => {
    try {
        const results = await User.find();
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const getUser = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const results = await User.findById(userId);
        return res.status(200).json({ 'results': results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await User.findById(userId);
        return res.status(200).json({ 'results': results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//sipn up & create user
export const createUser = async (req, res) => {
    try {
        const { username, email, password: plainTextPassword, about, location, currentWeight } = req.body;

        const findUserByUsername = await User.findOne({ username });
        const findUserByEmail = await User.findOne({ email });
        if (findUserByUsername) {
            return res.status(400).json({ msg: "Username already exists." });
        }
        if (findUserByEmail) {
            return res.status(400).json({ msg: "Email already exists." });
        }

        if (!plainTextPassword) {
            return res.status(400).json({ msg: "Password is required." });
        }

        const password = await bcrypt.hash(plainTextPassword, 10);
        const profileImage = req.file?.path || '/files/userImage.png';
        const formattedLocation = location
            ? {
                city: location.city || 'Karachi',
                country: location.country || 'Pakistan',
            }
            : { city: 'Karachi', country: 'Pakistan' };

        const formattedWeight = currentWeight ? Number(currentWeight) : 0;

        const user = new User({
            username,
            email,
            password,
            about: about || 'We Love Fitness Tracker.',
            location: formattedLocation,
            currentWeight: formattedWeight,
            profileImage,
        });

        await user.save();

        return res.status(201).json({ msg: "User created successfully.", user });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error.", error: error.message });
    }
};

// login
export const loginUser = async (req, res) => {
    try {
        let { username, password } = req.body;
        console.log(username,password)

        const user = await User.findOne({ username });
        console.log(user)

        if (!user) {
            console.log(user)
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        const token = jwt.sign(
            { user: { id: user._id, username: user.username } },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1h" }
        );

        // Send response first, then handle notifications asynchronously
        res.json({ token, user: { username: user.username } });

        // Save notification asynchronously
        const sendNotification = new Notification({
            toUser: user._id, // Use user._id instead of undefined targetUserId
            message: `Welcome Back, ${user.username}.`,
        });
        await sendNotification.save();
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ msg: "Internal server error." });
    }
};

// export const loginUser = async (req, res) => {
//     try {
//         let { username, password } = req.body;
//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(401).json({ msg: "invalid credentials." });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ msg: "invalid credentials." });
//         }
//         const token = jwt.sign(
//             { user: { id: user._id, username: user.username, } },
//             "fitness_tracker",
//             // { expiresIn: '1h' }
//         );
//         res.json({ token, user: { username: user.username, } });
//         const sendNotification = new Notification({
//             toUser: targetUserId,
//             message: `Welcome Back, ${user.username}.`,
//         })
//         await sendNotification.save();
//     } catch (error) {
//         res.status(500).json({ msg: 'internal server error.' });
//     }
// };

export const updateUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            const { username, email, bio, location, currentWeight } = req.body;
            const localFilePath = path.join(__dirname, "../files", req.file.filename);
            const fileName = req.file.filename;
            const profileImage = await uploadImageToGitHub(localFilePath, fileName);

            const results = await User.findByIdAndUpdate(
                req.params.id,
                { username, email, bio, location, currentWeight, profileImage },
                { new: true, runValidators: true }
            );
            if (!results) {
                return res.status(404).json({ msg: 'user not found' });
            }
            fs.unlinkSync(localFilePath);
            return res.status(200).json({ msg: 'user updated.', results });
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userIdFromToken = req.user.id;
        if (userIdFromToken === req.params.id) {
            const results = await User.findByIdAndDelete(req.params.id);
            if (!results) {
                return res.status(404).json({ msg: 'user not found' });
            }
        }
        return res.status(200).json({ msg: 'user deleted.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const escapeRegex = (text) => {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const searchUsers = async (req, res) => {
    try {
        const searchedValue = req.params.searchterm;

        if (!searchedValue) {
            return res.status(400).json({ msg: "Search term is required." });
        }

        const sanitizedSearchTerm = escapeRegex(searchedValue);

        const result = await User.find({
            "$or": [
                { "username": { $regex: sanitizedSearchTerm, $options: 'i' } },
                { "category": { $regex: sanitizedSearchTerm, $options: 'i' } }
            ]
        });

        if (result.length === 0) {
            return res.status(404).json({ msg: "User not found." });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const followUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: 'User ID is missing.' });
        }

        if (!targetUserId || targetUserId.trim() === "") {
            return res.status(400).json({ msg: 'Target User ID is invalid.' });
        }

        const trimmedTargetUserId = targetUserId.trim();

        if (!mongoose.Types.ObjectId.isValid(trimmedTargetUserId)) {
            return res.status(400).json({ msg: 'Invalid target user ID format.' });
        }

        if (userId === trimmedTargetUserId) {
            return res.status(400).json({ msg: 'You cannot follow yourself.' });
        }

        const userToFollow = await User.findById(trimmedTargetUserId);
        const user = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({ msg: 'User to follow not found.' });
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        if (userToFollow.followers.includes(userId)) {
            return res.status(400).json({ msg: 'You are already following.' });
        }

        userToFollow.followers.push(userId);
        user.following.push(trimmedTargetUserId);

        await userToFollow.save();
        await user.save();

        const sendNotification = new Notification({
            fromUser: userId,
            toUser: targetUserId,
            message: `${user.username} followed you.`,
        })
        await sendNotification.save();

        return res.status(200).json({ msg: `You are now following ${userToFollow.username}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user.id;

        const userToUnfollow = await User.findById(targetUserId);
        const user = await User.findById(userId);

        if (!userToUnfollow || !user) {
            return res.status(404).json({ msg: 'user not found.' });
        }

        if (!userToUnfollow.followers.includes(userId)) {
            return res.status(400).json({ msg: 'you are not following.' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userId.toString());
        user.following = user.following.filter(following => following.toString() !== targetUserId.toString());

        await userToUnfollow.save();
        await user.save();

        return res.status(200).json({ msg: `you have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await User.findById(id).populate('followers', 'username profileImage');

        if (!results) {
            return res.status(404).json({ msg: 'followers not found.' });
        }

        return res.status(200).json(results.followers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await User.findById(id).populate('following', 'username profileImage');

        if (!results) {
            return res.status(404).json({ msg: 'following not found.' });
        }

        return res.status(200).json(results.following);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
