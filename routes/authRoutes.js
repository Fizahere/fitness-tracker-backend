import { Router } from "express";
import {
    createUser,
    deleteUser,
    followUser,
    getAllUsers,
    getFollowers,
    getFollowing,
    getUser,
    loginUser,
    searchUsers,
    unfollowUser,
    updateUser
} from '../Controllers/UserController.js'
import { authenticateToken } from "../Middlewares/authMiddleWare.js";

const authRoutes = Router();

authRoutes.get('/get-all-users', getAllUsers)
authRoutes.get('/get-user:id', getUser)
authRoutes.get('/search-user/:searchterm', searchUsers)
authRoutes.post('/login', loginUser)
authRoutes.post('/create-user', createUser)
authRoutes.put('/edit-user/:id', updateUser)
authRoutes.delete('/delete-user/:id', deleteUser)
/////////////////////////////////////////////////////////////
authRoutes.post('/follow/:targetUserId', authenticateToken, followUser);
authRoutes.post('/unfollow/:targetUserId', authenticateToken, unfollowUser);
authRoutes.get('/get-followers/:id', getFollowers);
authRoutes.get('/get-following/:id', getFollowing);


export default authRoutes