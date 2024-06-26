const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const needBasedProjectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    outcomes: {
      type: String,
      required: true,
    },

    institutionAddress: {
      type: String,
      required: true,
    },

    departmentInvolved: {
      type: [String],
      required: true,
    },

    facultiesInvolved: {
      type: [String],
      required: true,
    },

    institutionName: {
      type: String,
      required: true,
    },

    facultyCoordinatorName: {
      type: String,
      required: true,
    },

    facultyCoordinatorDepartment: {
      type: String,
      required: true,
    },

    facultyCoordinatorContact: {
      type: String,
      required: true,
    },

    facultyCoordinatorEmail: {
      type: String,
      required: true,
    },

    students: {
      type: [studentSchema], // Embedding Student schema
      required: true,
    },

    collaborationType: {
      type: String,
      required: true,
    },

    institutionUrl: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    sanctionedDocuments: {
      type: String,
      required: true,
    },

    projectReport: {
      type: String,
      required: true,
    },

    completionLetter: {
      type: String,
      required: true,
    },

    visitDocuments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Export models
module.exports = mongoose.model("needBasedProject", needBasedProjectSchema);
