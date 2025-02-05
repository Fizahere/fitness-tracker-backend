import Posts from '../Models/PostModel.js'
import { upload } from '../Middlewares/imageMiddleWare.js';
import multer from 'multer';
import Notification from '../Models/NotificationModel.js';
import { uploadImageToGitHub } from '../Middlewares/imageMiddleWare.js'
import {fileURLToPath} from 'url'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPosts = async (req, res) => {
    try {
        const results = await Posts.find().populate({ path: 'author', select: 'username profileImage followers' });
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
};
export const getPosts = async (req, res) => {
    try {
        // const author = req?.user?.id;
        const author = req.params.id;

        if (!author) {
            return res.status(400).json({ msg: 'User is not authenticated.' });
        }

        const results = await Posts.find({ author })
            .populate({
                path: 'author',
                select: 'username profileImage'
            })
            .populate({
                path: 'likes',
                select: 'username profileImage'
            });
        if (!results.length) {
            return res.status(404).json({ msg: 'No posts found for the user.' });
        }

        return res.json({ results });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const results = await Posts.findById(req.params.id);
        if (!results) {
            return res.status(404).json({ msg: 'post not found.' });
        }
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.' });
    }
}
export const createPost = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ msg: err.message });
            } else if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'No file selected!' });
            }

            const { author, content } = req.body;
            const localFilePath = path.join(__dirname, "../files", req.file.filename);
            const fileName = req.file.filename;

            try {
                const postImageUrl = await uploadImageToGitHub(localFilePath, fileName);

                const newPost = new Posts({
                    author,
                    content,
                    image: postImageUrl,
                });

                await newPost.save();
                fs.unlinkSync(localFilePath);
                return res.status(201).json({ msg: 'Post created successfully.', newPost });
            } catch (error) {
                console.error("Image upload error:", error.message);
                return res.status(500).json({ msg: "Failed to upload image." });
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return res.status(404).json({ msg: 'Post ID is missing.' });
        }

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ msg: 'No file selected!' });
            }

            const { author, content } = req.body;
            // const image = req.file.path;
            const localFilePath = path.join(__dirname, "../files", req.file.filename);
            const fileName = req.file.filename;

            try {
                const postImageUrl = await uploadImageToGitHub(localFilePath, fileName);

                const results = await Posts.findByIdAndUpdate(
                    postId,
                    { author, content, image: postImageUrl },
                    { new: true, runValidators: true }
                );

                await results.save();
                fs.unlinkSync(localFilePath);
                if (!results) {
                    return res.status(404).json({ msg: 'Post not found.' });
                }
                return res.status(200).json({ msg: 'Post updated.', results });
            } catch (error) {
                return res.status(500).json({ msg: "failed to upload image." });
            }
            // const results = await Posts.findByIdAndUpdate(
            //     postId,
            //     { author, content, image },
            //     { new: true, runValidators: true }
            // );

            // if (!results) {
            //     return res.status(404).json({ msg: 'Post not found.' });
            // }

            // return res.status(200).json({ msg: 'Post updated.', results });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error.' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'post not found.' });
        }
        return res.status(200).json({ msg: 'post deleted.' });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.', error: error.message })
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;
        if (!postId) {
            return res.json({ msg: 'post Id is missing.' })
        }
        if (!userId) {
            return res.json({ msg: 'user Id is missing.' })
        }
        const postToLike = await Posts.findById(postId)
        postToLike.likes.push(userId)
        await postToLike.save()
        return res.status(200).json({ msg: 'liked.' })
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.' })
    }
}

export const disLikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;
        if (!postId) {
            return res.json({ msg: 'post Id is missing.' })
        }
        if (!userId) {
            return res.json({ msg: 'user Id is missing.' })
        }
        const postToDisLike = await Posts.findById(postId)
        postToDisLike.likes = postToDisLike.likes.filter(like => like.toString() !== userId.toString())
        await postToDisLike.save()
        return res.status(200).json({ msg: 'disliked.' })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

export const comment = async (req, res) => {
    try {
        const author = req.user.id;
        const postId = req.params.id;
        const { content } = req.body;
        const postToCommentOn = await Posts.findById(postId);
        if (!postToCommentOn) {
            return res.status(404).json({ msg: 'post not found.' });
        }

        const newComment = {
            author,
            content
        };

        postToCommentOn.comments.push(newComment);
        await postToCommentOn.save();

        if (postToCommentOn.author.toString() !== author.toString()) {
            await Notification.create({
                user: postToCommentOn.author,
                fromUser: author,
                type: 'new_comment',
                relatedPost: postId
            });
        }

        res.status(201).json({ msg: 'Comment added.', comment: newComment });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { postId } = req.body;
        const post = await Posts.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'post not found.' });
        }
        const commentIndex = post.comments.findIndex(
            comment => comment._id.toString() === commentId
        );
        if (commentIndex === -1) {
            return res.status(404).json({ msg: 'comment not found.' });
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.status(200).json({ msg: 'comment deleted.' });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};

export const markNotificationAsRead = async (req, res) => {
    const { notificationId, userId } = req.body;

    try {
        const notification = await Notification.findOne({ _id: notificationId, user: userId });
        if (!notification) {
            return res.status(404).json({ msg: 'notification not found or does not belong to you.' });
        }
        notification.read = true;
        await notification.save();

        res.status(200).json({ msg: 'notification marked as read.', notification });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};

export const getNotifications = async (req, res) => {
    const userId = req.user?.id;
    console.log(userId)
    try {
        const notifications = await Notification.find({ toUser: userId })
            .populate('fromUser', 'username profileImage')
            .sort({ createdAt: -1 });
        if (!notifications.length) {
            return res.status(404).json({ msg: 'no notifications found.' });
        }
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};
const escapeRegex = (text) => {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const searchPosts = async (req, res) => {
    try {
        const searchedValue = req.params.searchterm;
        if (!searchedValue) {
            return res.status(400).json({ msg: "search term is required." });
        }
        const result = await Posts.find({
            "$or": [
                { "content": { $regex: searchedValue, $options: 'i' } }
            ]
        });
        if (result.length === 0) {
            return res.status(404).json({ msg: "posts not found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "internal server error.", error: error.message });
    }
};

export const searchUserPosts = async (req, res) => {
    try {
        const author = req.user.id;
        const { searchQuery } = req.params;
        if (!searchQuery || !author) {
            return res.status(400).json({ msg: "User ID and search term are required." });
        }

        const sanitizedSearchTerm = escapeRegex(searchQuery);

        const result = await Posts.find({
            author,
            "$or": [
                { "content": { $regex: sanitizedSearchTerm, $options: 'i' } }
            ]
        });

        if (result.length === 0) {
            return res.status(404).json({ msg: "No matching posts found for this user." });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};
