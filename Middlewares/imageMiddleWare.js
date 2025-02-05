import multer from "multer";
import axios from "axios";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');

export const uploadImageToGitHub = async (filePath, fileName) => {
    try {
        const fileContent = fs.readFileSync(filePath, { encoding: "base64" });
        let sha = null;

        const githubUrl = `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/fitness_tracker_uploads/${fileName}`;
        const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` };

        try {
            const fileExistsResponse = await axios.get(githubUrl, { headers });
            sha = fileExistsResponse.data.sha;
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("File existence check failed:", error.response?.data || error.message);
                throw new Error("Error checking if file exists.");
            }
            console.log("File does not exist, proceeding with new upload.");
        }

        const response = await axios.put(
            githubUrl,
            {
                message: `Upload ${fileName}`,
                content: fileContent,
                branch: process.env.BRANCH || "main",
                sha: sha || undefined,
            },
            { headers }
        );

        console.log("Upload successful:", response.data.content.download_url);
        return response.data.content.download_url;

    } catch (error) {
        console.error("GitHub API Error:", error.response?.data || error.message);
        throw new Error(`Failed to upload image: ${error.response?.data?.message || error.message}`);
    }
};
