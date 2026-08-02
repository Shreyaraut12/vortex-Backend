const Commit = require('../models/commit.js');
const Repo = require('../models/Repo.js');
const User = require('../models/user.js');
const crypto = require('crypto');

const checkAndAwardBadges = async (user, commitCount) => {
    if (commitCount >= 1 && commitCount < 5 && !user.badges.includes('first_commit')) {
        user.badges.push('first_commit')
    }
    if (commitCount >= 5 && !user.badges.includes('commit_5')) {
        user.badges.push('commit_5')
    }
    if (commitCount >= 10 && !user.badges.includes('commit_10')) {
        user.badges.push('commit_10')
    }

    if (user.streak === 3 && !user.badges.includes('streak_3')) {
        user.badges.push('streak_3')
    }
    if (user.streak === 7 && !user.badges.includes('streak_7')) {
        user.badges.push('streak_7')
    }
}

const createCommit = async ({ message, repoId, files, authorId }) => {
    const repo = await Repo.findById(repoId);
    if (!repo) {
        const error = new Error('Repo not found');
        error.statusCode = 404;
        throw error;
    }

    const lastCommit = await Commit.findOne(
        { repo: repo._id },
        {},
        { sort: { createdAt: -1 } }
    )

    const hash = crypto
        .createHash('sha256')
        .update(`${message}${authorId}${repoId}${Date.now()}`)
        .digest('hex')

    const newCommit = new Commit({
        message: message,
        author: authorId,
        repo: repo._id,
        files: files,
        parentCommit: lastCommit ? lastCommit._id : null,
        hash: hash,
    })
    await newCommit.save();

    const user = await User.findById(authorId);
    user.totalXP = user.totalXP + 20;

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const lastDate = new Date(user.lastCommitDate)
    lastDate.setHours(0, 0, 0, 0)

    if (lastDate.getTime() === yesterday.getTime()) {
        user.streak = user.streak + 1
    } else if (lastDate.getTime() === today.getTime()) {
        // committed today already, streak stays same
    } else {
        user.streak = 1
    }

    user.lastCommitDate = today

    const commitCount = await Commit.countDocuments({ author: authorId })
    console.log('commitCount:', commitCount)
    console.log('badges before:', user.badges)
    await checkAndAwardBadges(user, commitCount)
    console.log('badges after:', user.badges)
    await user.save()
    await checkAndAwardBadges(user, commitCount)
    await user.save()

    return newCommit;
}

const listCommits = async (repoId) => {
    const commits = await Commit.find(
        { repo: repoId },
        {},
        { sort: { createdAt: -1 } }
    )
    return commits;
}

module.exports = { createCommit, listCommits };
