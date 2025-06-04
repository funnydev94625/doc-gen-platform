const Policy = require('../models/Policy');
const Template = require('../models/Template');
const Section = require('../models/Section');
const Element = require('../models/Element');
const Answer = require('../models/Answer');

// Get all policies
exports.getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find()
            .populate('template_id', 'title description')
            .sort({ createdAt: -1 });
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single policy
exports.getPolicy = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id)
            .populate('template_id', 'title description');
        
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        
        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new policy
exports.createPolicy = async (req, res) => {
    try {
        const { template_id } = req.body;

        // Check if template exists
        const template = await Template.findById(template_id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        console.log(req.user)
        const policy = new Policy({
            template_id,
            createdBy: req.user.id // Assuming you have user info in req.user
        });

        const savedPolicy = await policy.save();
        res.status(201).json(savedPolicy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a policy
exports.updatePolicy = async (req, res) => {
    try {
        const { title, description } = req.body;
        const policy = await Policy.findById(req.params.id);

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Update fields
        if (title) policy.title = title;
        if (description) policy.description = description;

        const updatedPolicy = await policy.save();
        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a policy
exports.deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Delete associated answers
        await Answer.deleteMany({ policy_id: policy._id });

        // Delete the policy
        await policy.deleteOne();
        
        res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get policy with all related data (template, sections, elements, answers)
exports.getPolicyWithDetails = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id)
            .populate('template_id', 'title description');

        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Get sections for the template
        const sections = await Section.find({ 
            template_id: policy.template_id._id,
            isDel: false 
        }).sort({ title: 1 });

        // Get elements for the template
        const elements = await Element.find({ 
            template_id: policy.template_id._id,
            isDel: false 
        });

        // Get answers for the policy
        const answers = await Answer.find({ policy_id: policy._id });

        // Format the response
        const response = {
            policy,
            sections,
            elements,
            answers
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};