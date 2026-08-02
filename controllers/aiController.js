const aiService = require('../services/aiService.js');

const generateCommitMessage = async (req, res) => {
    try {
        const { files } = req.body

        const result = await aiService.generateCommitMessage(files);
        res.status(200).json(result)

    } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message })
    }
}

module.exports = { generateCommitMessage };
