const branchService = require('../services/branchService.js');

const createBranch = async (req, res) => {
    try {
        const { name, repoId, headCommit } = req.body;

        const newBranch = await branchService.createBranch({
            name,
            repoId,
            headCommit,
            createdBy: req.userId,
        });

        res.status(200).json({
            message: 'branch created Successfully',
            branch: newBranch,
        })
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
}

const listBranches = async (req, res) => {
    try {
        const { repoId } = req.params
        const branches = await branchService.listBranches(repoId);
        res.status(200).json({ branches })
    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

module.exports = { createBranch, listBranches };
