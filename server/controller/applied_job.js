const AppliedJob = require("../models/appliedJob");
const { response } = require("express");
const mongoose = require("mongoose");
const Job = require('../models/job');

// Create an applied job with validation
exports.createAppliedJob = async (req, res) => {
  console.log("Body:", req.body); // Log incoming data

  try {
    const { jobSeekerId, jobId, coverLetter, source, notes, resumeUrl } = req.body;

    // Check if jobSeekerId is valid
    if (!mongoose.Types.ObjectId.isValid(jobSeekerId)) {
      return res.status(400).json({ message: "Invalid jobSeekerId" });
    }

    // Construct new applied job data
    const newAppliedJob = {
      jobSeekerId,
      jobId,
      coverLetter,
      source,
      notes,
      resume: resumeUrl,
    };

    const savedAppliedJob = await AppliedJob.create(newAppliedJob);
    res.status(201).json(savedAppliedJob);
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(400).json({
      message: "Error creating job application",
      error: error.message,
    });
  }
};



exports.companyApplications = async (req, res) => {
  try {
    const employerId = req.params.id; // Assuming the employer is authenticated

    // Step 1: Find all jobs posted by this employer
    const jobs = await Job.find({ employerId }).select('_id title');

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this employer.' });
    }

    // Step 2: Extract jobIds and find applications
    const jobIds = jobs.map(job => job._id);
    const applications = await AppliedJob.find({ jobId: { $in: jobIds } })
      .populate('jobSeekerId', 'firstName lastName resume')
      .populate('jobId', 'title')
      .sort({ appliedDate: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};



// Fetch all applied jobs, allowing query filters
exports.getAllAppliedJobs = async (req, res) => {
  try {
    const { jobSeekerId, jobId, status } = req.query;
    let filter = {};

    if (jobSeekerId) filter.jobSeekerId = jobSeekerId;
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    const appliedJobs = await AppliedJob.find(filter)
      .populate("jobSeekerId") // Populating jobSeekerId to get more details
      .populate("jobId"); // Populating jobId to get more job details

    res.status(200).json(appliedJobs);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching job applications",
        error: error.message,
      });
  }
};

// Fetch applied job by ID
exports.getAppliedJobById = async (req, res) => {
  try {
    const appliedJob = await AppliedJob.findById(req.params.id)
      .populate("jobSeekerId")
      .populate("jobId");
    if (!appliedJob)
      return res.status(404).json({ message: "AppliedJob not found" });
    res.status(200).json(appliedJob);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching job application",
        error: error.message,
      });
  }
};

// Update applied job with validation
exports.updateAppliedJob = async (req, res) => {
  try {
    const { jobSeekerId, jobId, resume } = req.body;

    // Optional validation before update
    if (!jobSeekerId || !jobId || !resume) {
      return res
        .status(400)
        .json({ message: "jobSeekerId, jobId, and resume are required." });
    }

    const updatedAppliedJob = await AppliedJob.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("jobSeekerId")
      .populate("jobId");
    if (!updatedAppliedJob)
      return res.status(404).json({ message: "AppliedJob not found" });
    res.status(200).json(updatedAppliedJob);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Error updating job application",
        error: error.message,
      });
  }
};

// Delete an applied job
exports.deleteAppliedJob = async (req, res) => {
  try {
    const deletedAppliedJob = await AppliedJob.findByIdAndDelete(req.params.id);
    if (!deletedAppliedJob)
      return res.status(404).json({ message: "AppliedJob not found" });
    res.status(200).json({ message: "AppliedJob deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting job application",
        error: error.message,
      });
  }
};

// NEW: Fetch applied jobs by jobSeekerId
exports.getApplicationsByJobSeekerId = async (req, res) => {
  const { jobSeekerId } = req.params;

  try {
    // Fetch applied jobs by jobSeekerId
    const appliedJobs = await AppliedJob.find({ jobSeekerId });

    if (!appliedJobs || appliedJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No applied jobs found for this job seeker." });
    }

    res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching applied jobs.", error: error.message });
  }
};
