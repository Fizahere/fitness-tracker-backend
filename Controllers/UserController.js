import User from '../Models/UserModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { upload } from "../Middlewares/imageMiddleWare.js";

export const getUsers = async (req, res) => {
    try {
        const results = await User.find();
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//sipn up & create user
export const createUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            console.log(req.body);
            const { username, email, password: plainTextPassword, about } = req.body;
            const findUserByUsername = await User.findOne({ username })
            const findUserByEmail = await User.findOne({ email })
            if (findUserByUsername) {
                res.json({ msg: 'username already exist.' })
            }
            if (findUserByEmail) {
                res.json({ msg: 'email already exist.' })
            }
            const password = await bcrypt.hash(plainTextPassword, 10);
            const isPasswordCorrect = await bcrypt.compare(plainTextPassword, password)
            const profileImage = req.file.path;
            const backgroundImage = req.file.path;
            const results = new User({
                username,
                email,
                password,
                about,
                profileImage,
                backgroundImage,
            });
            await results.save();
            return res.status(201).json({ msg: 'user created.', results });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};

// login
export const loginUser = async (req, res) => {
    try {
        let { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ msg: "invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "invalid credentials." });
        }
        const token = jwt.sign(
            { user: { id: user._id, username: user.username, } },
            "fitness_tracker",
            // { expiresIn: '1h' }
        );
        res.json({ token, user: { username: user.username, } });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' });
    }
};
export const updateUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            const { username, email, bio } = req.body;
            const profileImage = req.file.path;
            const backgroundImage = req.file.path;
            const results = await User.findByIdAndUpdate(
                req.params.id,
                { username, email, bio, profileImage, backgroundImage },
                { new: true, runValidators: true }
            );
            if (!results) {
                return res.status(404).json({ msg: 'user not found' });
            }
            return res.status(200).json({ msg: 'user updated.', results });
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const results = await User.findByIdAndDelete(req.params.id);
        if (!results) {
            return res.status(404).json({ msg: 'user not found' });
        }
        return res.status(200).json({ msg: 'user deleted.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const searchedValue = req.params.searchterm;
        if (!searchedValue) {
            return res.status(400).json({ msg: "search term is required." });
        }
        const result = await User.find({
            "$or": [
                { "content": { $regex: searchedValue, $options: 'i' } }
            ]
        });
        if (result.length === 0) {
            return res.status(404).json({ msg: "user not found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "internal server error.", error: error.message });
    }
};