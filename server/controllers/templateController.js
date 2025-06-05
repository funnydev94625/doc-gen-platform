const Template = require('../models/Template')

exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find()
        res.json(templates)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}

exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id)
        if (!template) {
            return res.status(404).json({ msg: 'Template not found' })
        }
        res.json(template)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Template not found' })
        }
        res.status(500).send('Server error')
    }
}
