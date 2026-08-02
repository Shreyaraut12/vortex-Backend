const repoService = require('../services/repoService.js');

const createRepo = async (req, res) => {
    try {
        const { name, description, visibility } = req.body;

        // Temporary guard here until a dedicated validators layer exists.
        if (!name) {
            return res.status(400).json({ message: 'Repo name is required' });
        }

        const newRepo = await repoService.createRepo({
            name,
            description,
            visibility,
            owner: req.userId,
        });

        res.status(201).json({
            message: 'Repo created Successfully',
            repo: newRepo,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const listRepos = async (req, res) => {
    try {
        console.log('userId:', req.userId);
        const repos = await repoService.listRepos(req.userId);
        console.log('repos found:', repos.length);

        res.status(200).json({ repos: repos });
    } catch (err) {
        console.log('error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createRepo, listRepos };
