const Repo = require('../models/Repo.js');

const createRepo = async ({ name, description, visibility, owner }) => {
    const newRepo = new Repo({
        name: name,
        description: description,
        owner: owner,
        visibility: visibility,
    });

    await newRepo.save();
    return newRepo;
};

const listRepos = async (owner) => {
    const repos = await Repo.find({ owner: owner });
    return repos;
};

module.exports = { createRepo, listRepos };
