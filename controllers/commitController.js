const commitService = require('../services/commitService.js');

const createCommit = async (req, res) => {
    try {
        const { message, repoId, files } = req.body;

        const newCommit = await commitService.createCommit({
            message,
            repoId,
            files,
            authorId: req.userId,
        });

        res.status(201).json({
            message: 'Commit created successfully',
            commit: newCommit
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

const listCommits = async (req, res) => {
    try {
        const { repoId } = req.params
        const commits = await commitService.listCommits(repoId);
        res.status(200).json({ commits })
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

module.exports = { createCommit, listCommits };
