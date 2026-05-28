import mongoose from "mongoose";

// 1. Sub-schema for Education
const educationSchema = new mongoose.Schema({
  universityName: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  degree: { type: String, default: "" },
  major: { type: String, default: "" },
  description: { type: String, default: "" },
});

// 2. Sub-schema for Experience
const experienceSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  companyName: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  currentlyWorking: { type: Boolean, default: false },
  workSummary: { type: String, default: "" },
});

// 3. Sub-schema for Skills (Ensures objects, not strings)
const skillSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  rating: { type: Number, default: 0 },
});

// 4. Sub-schema for Projects
const projectSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  link: { type: String, default: "" },
});

// MAIN RESUME SCHEMA
const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
    },
    // The "Glue" that links this to Pratik's current User ID
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true // Optimized for Dashboard fetching
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    address: { type: String, default: "" },
    jobDescription: {
        type: String,
        default: ""
    },
    atsScore: {
        type: Number,
        default: 0
    },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    
    // PRD WEEK 3: Appearance Controls
    themeColor: { type: String, default: "#9333ea" },
    templateName: { type: String, default: "ModernTemplate" },
    
    summary: { type: String, default: "" },
    
    // PRD WEEK 2: ATS Integration
    atsScore: { type: Number, default: 0 },

    // Embedded Sub-schemas
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    
  },
  { 
    timestamps: true // Critical for "Current Builds" sorting
  }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;