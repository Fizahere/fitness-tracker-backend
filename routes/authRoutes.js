import { Router } from "express";
import {
    createUser,
    deleteUser,
    followUser,
    getAllUsers,
    getFollowers,
    getFollowing,
    getUser,
    getUserById,
    loginUser,
    searchUsers,
    unfollowUser,
    updateUser
} from '../Controllers/UserController.js'
import { authenticateToken } from "../Middlewares/authMiddleWare.js";
import { getNotifications } from "../Controllers/PostController.js";

const authRoutes = Router();

authRoutes.get('/get-all-users', getAllUsers)
authRoutes.get('/get-user',authenticateToken, getUser)
authRoutes.get('/get-user-by-id/:id', getUserById)
authRoutes.get('/search-user/:searchterm', searchUsers) //remaining
authRoutes.post('/login', loginUser)
authRoutes.post('/create-user', createUser)
// authRoutes.post('/create-user', upload, createUser);

authRoutes.put('/edit-user/:id', updateUser)
authRoutes.delete('/delete-user/:id',authenticateToken, deleteUser)
/////////////////////////////////////////////////////////////
authRoutes.post('/follow/:targetUserId', authenticateToken, followUser);
authRoutes.post('/unfollow/:targetUserId', authenticateToken, unfollowUser);
authRoutes.get('/get-followers/:id', getFollowers); //remaining
authRoutes.get('/get-following/:id', getFollowing); //remaining
//notifications
authRoutes.get('/get-notifications',authenticateToken, getNotifications);


export default authRoutes