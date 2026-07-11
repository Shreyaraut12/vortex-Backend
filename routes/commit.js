const express=require('express');
const router= express.Router();
const commitModel=require('../models/commit.js');
const repoModel=require('../models/Repo.js');
const authMiddleware=require('../middleware/auth.js');
const crypto=require('crypto');
const userModel=require('../models/user.js')


//Award and badge function
const checkAndAwardBadges=async(user,commitCount)=>{
   if(commitCount >= 1 && commitCount < 5 && !user.badges.includes('first_commit')) {
    user.badges.push('first_commit')
}
if(commitCount >= 5 && !user.badges.includes('commit_5')) {
    user.badges.push('commit_5')
}
if(commitCount >= 10 && !user.badges.includes('commit_10')) {
    user.badges.push('commit_10')
}

if(user.streak === 3 && !user.badges.includes('streak_3')) {
    user.badges.push('streak_3')
}
if(user.streak === 7 && !user.badges.includes('streak_7')) {
    user.badges.push('streak_7')
}
}


router.post('/create', authMiddleware, async(req, res) => {
    try {
        //step 1:get data from req.body:

        const {message,repoId,files}=req.body;

        //step 2: check if repo exists:
        const repo=await repoModel.findById(repoId);
        if(!repo){
            return res.status(404).json({message:'Repo not found'})
        }

        //step 3:find the LAST commit of this repo.
        const lastCommit = await commitModel.findOne(
            { repo: repo._id },
            {},
            { sort: { createdAt: -1 }}
        )

        //step 4 : generate SHA-256 hash
        const hash = crypto
        .createHash('sha256')
        .update(`${message}${req.userId}${repoId}${Date.now()}`)
        .digest('hex')

         //step 5: create and save commit:

         const newCommit =new commitModel({
            message:message,
            author: req.userId,
            repo:repo._id,
            files:files,
            parentCommit: lastCommit ? lastCommit._id : null,
            hash:hash,
         })
         await newCommit.save();

          //XP and streak 

          // Get today's date (just the date, not time)

           const user = await userModel.findById(req.userId);
            user.totalXP=user.totalXP+20;

const today = new Date()
today.setHours(0, 0, 0, 0)  // removes time part

// Get yesterday
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)  // go back 1 day

// Get lastCommitDate (just date, no time)
const lastDate = new Date(user.lastCommitDate)
lastDate.setHours(0, 0, 0, 0)

if(lastDate.getTime() === yesterday.getTime()) {
    // committed yesterday → streak continues!!
    user.streak = user.streak + 1
} else if(lastDate.getTime() === today.getTime()) {
    // committed today already → streak stays same
} else {
    // missed days → reset!!
    user.streak = 1
}

// update lastCommitDate
user.lastCommitDate = today

const commitCount = await commitModel.countDocuments({ author: req.userId })
console.log('commitCount:', commitCount)
console.log('badges before:', user.badges)
await checkAndAwardBadges(user, commitCount)
console.log('badges after:', user.badges)
await user.save()
await checkAndAwardBadges(user, commitCount)
await user.save()  // save everything together!!
         res.status(201).json({
        message: 'Commit created successfully',
        commit: newCommit
    })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:repoId', authMiddleware, async(req, res) => {
    try {
        const { repoId } = req.params
        const commits = await commitModel.find(
            { repo: repoId },
            {},
            { sort: { createdAt: -1 }}
        )
        res.status(200).json({ commits })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports=router;