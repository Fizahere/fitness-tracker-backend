import { Router } from "express";
import {
    comment,
    createPost,
    deleteComment,
    deletePost,
    disLikePost,
    getAllPosts,
    getPostById,
    getPosts,
    likePost,
    markNotificationAsRead,
    searchPosts,
    updatePost,
} from "../Controllers/PostController.js";
import { authenticateToken } from "../Middlewares/authMiddleWare.js";

const postRoutes = Router()

postRoutes.get('/get-all-posts', getAllPosts);
postRoutes.get('/get-posts',authenticateToken, getPosts);
postRoutes.get('/get-post/:id', getPostById);
postRoutes.get('/search-post/:searchterm', searchPosts)
postRoutes.post('/mark-as-read', authenticateToken, markNotificationAsRead)
postRoutes.post('/create-post', createPost);
postRoutes.post('/like-post', authenticateToken, likePost);
postRoutes.post('/dislike-post', authenticateToken, disLikePost);
postRoutes.post('/comment', authenticateToken, comment);
postRoutes.delete('/delete-comment/:id', authenticateToken, deleteComment);
postRoutes.put('/edit-post/:id', authenticateToken, updatePost);
postRoutes.delete('/delete-post/:id', authenticateToken, deletePost);

export default postRoutes