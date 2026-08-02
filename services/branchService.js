const Branch = require('../models/branch.js');
const Repo = require('../models/Repo.js');

const createBranch = async ({ name, repoId, headCommit, createdBy }) => {
    const repo = await Repo.findById(repoId)
    if (!repo) {
        const error = new Error('Repo not found');
        error.statusCode = 404;
        throw error;
    }

    const existingName = await Branch.findOne({ name: name });
    if (existingName) {
        const error = new Error('Branch name Already Exists');
        error.statusCode = 400;
        throw error;
    }

    const newBranch = new Branch({
        name: name,
        repo: repo._id,
        headCommit: headCommit,
        createdBy: createdBy,
    })

    await newBranch.save();
    return newBranch;
}

const listBranches = async (repoId) => {
    const branches = await Branch.find(
        { repo: repoId },
        {},
        { sort: { createdAt: -1 } }
    )
    return branches;
}

module.exports = { createBranch, listBranches };
