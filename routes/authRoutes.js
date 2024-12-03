import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    loginUser,
    searchUsers,
    updateUser
} from '../Controllers/UserController.js'

const authRoutes = Router();

authRoutes.get('/get-users', getUsers)
authRoutes.get('/search-user/:searchterm', searchUsers)
authRoutes.post('/login', loginUser)
authRoutes.post('/create-user', createUser)
authRoutes.put('/edit-user/:id', updateUser)
authRoutes.delete('/delete-user/:id', deleteUser)

export default authRoutes