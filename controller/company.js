const JobSeeker = require("../models/company"); // Changed to 'JobSeeker' to match the model name
const { response } = require("express");


exports.createCompany=async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.getAllCompany=async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getCompany=async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.updateCompany=async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.deleteCompany=async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
