import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    comments: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Posts = mongoose.model('Posts', PostSchema)

export default Posts;