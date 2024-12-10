import { Router } from "express";
import {
    createUser,
    deleteUser,
    followUser,
    getFollowers,
    getFollowing,
    getUsers,
    loginUser,
    searchUsers,
    unfollowUser,
    updateUser
} from '../Controllers/UserController.js'
import { authenticateToken } from "../Middlewares/authMiddleWare.js";

const authRoutes = Router();

authRoutes.get('/get-users', getUsers)
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