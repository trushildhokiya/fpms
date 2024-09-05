const asyncHandler = require("express-async-handler");
const Faculty = require("../models/faculty");
const Patent = require("../models/patent");
const Book = require("../models/book");
const Journal = require("../models/journal");
const Conference = require("../models/conference");
const Copyright = require("../models/copyright");
const BookChapter = require("../models/book-chapter");
const NeedBasedProject = require('../models/need-based-projects')
const AwardHonors = require('../models/award-honors')
const Consultancy = require('../models/consultancy')
const Transaction = require('../models/transaction')
const Project = require('../models/projects')
const AwardRecieved = require('../models/awards-recieved')
const ActivityConducted = require('../models/activity-conducted')
const CourseCertification = require('../models/course-certification')
const SttpAttended = require('../models/sttp-attended')
const SttpConducted = require('../models/sttp-conducted')
const SttpOrganized = require('../models/sttp-organized')
const SeminarAttended = require('../models/seminar-attended')
const SeminarConducted = require('../models/seminar-conducted')
const SeminarOrganised = require('../models/seminar-organised')
const fs = require('fs');
const download = require('download')
const validator = require('validator')
const moment = require('moment')
const path = require('path')
const uuid = require('uuid')

/**
 * CONSTANTS
 */
const baseUrl = 'http://localhost:5000';

/**
 * UPDATE PROFILE IMAGE
 */
const profileImageUpdate = asyncHandler(async (req, res) => {

  const { email } = req.decodedData;
  const newImagePath = req.file.path;

  try {
    // Find the faculty by email
    const user = await Faculty.findOne({ email });

    // If the faculty is not found, return an error
    if (!user) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const oldImageUrl = 'uploads' + user.profileImage.split('5000')[1];

    const newImageUrl = baseUrl + newImagePath.split('uploads\ '.trim())[1];

    user.profileImage = newImageUrl;

    await user.save();

    if (oldImageUrl && fs.existsSync(oldImageUrl)) {
      fs.unlinkSync(oldImageUrl);
    }

    res.status(200).json({
      status: 'success'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const addProfile = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // save data
  user.profile = data;
  await user.save();

  res.status(200).json({
    message: "success",
  });
});


const getProfileData = asyncHandler(async (req, res) => {
  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  const profileData = user.profile;

  res.status(200).json(profileData);
});


const updateProfile = asyncHandler(async (req, res) => {

  //get required data
  const { email } = req.decodedData;
  const data = req.body
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  user.profile = data
  await user.save()

  res.status(200).json({
    message: "success"
  });

})


const addExperience = async (req, res) => {
  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add experience json in array
  for (let i = 0; i < req.body.experienceDetails.length; i++) {
    const data = req.body.experienceDetails[i];
    data.experienceProof = req.files[i].path;

    user.experience.push(data);
  }

  await user.save();

  res.status(200).json({
    message: "success",
  });
};

const getExperienceData = asyncHandler(async (req, res) => {
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  const experienceData = user.experience;

  let industryExperienceMonths = 0;
  let teachingExperienceMonths = 0;

  experienceData.forEach((exp) => {
    // convert to Date
    const fromDate = new Date(exp.fromDate);
    const toDate = new Date(exp.toDate);

    //cqalculate total months
    let months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months += toDate.getMonth() - fromDate.getMonth();

    // handle partial months
    if (toDate.getDate() >= fromDate.getDate()) {
      months += 1;
    }

    // segregate data
    if (exp.experienceIndustry.toLowerCase() === "industry") {
      industryExperienceMonths += months;
    } else if (exp.experienceIndustry.toLowerCase() === "teaching") {
      teachingExperienceMonths += months;
    }
  });

  const totalExperienceMonths =
    industryExperienceMonths + teachingExperienceMonths;

  const formatExperience = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} years and ${remainingMonths} months`;
  };

  res.status(200).json({
    experience: experienceData,
    industryExperience: formatExperience(industryExperienceMonths),
    teachingExperience: formatExperience(teachingExperienceMonths),
    totalExperience: formatExperience(totalExperienceMonths),
  });
});


/**
 * @tutorial: gets data converts req.files to map and matches data by index if match replace existing value of file path
 * else keep it same , new entry create a new entry and push to data
 */
const updateExperience = asyncHandler(async (req, res) => {

  // Get required data
  const data = req.body.experienceDetails;
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // Convert files array into a map for easier access
  const files = req.files || [];

  const filesMap = files.reduce((acc, file) => {
    const index = parseInt(file.fieldname.match(/\d+/)[0], 10);
    acc[index] = file.path;
    return acc;
  }, {});

  // Update or add experience entries
  try {

    data.forEach((experience, index) => {

      const existingExperience = user.experience.id(experience._id);

      if (existingExperience) {

        // Update existing experience
        existingExperience.experienceType = experience.experienceType;
        existingExperience.organizationName = experience.organizationName;
        existingExperience.organizationAddress = experience.organizationAddress;
        existingExperience.organizationUrl = experience.organizationUrl;
        existingExperience.designation = experience.designation;
        existingExperience.fromDate = experience.fromDate;
        existingExperience.toDate = experience.toDate;
        existingExperience.experienceIndustry = experience.experienceIndustry;

        // Check if a new file is uploaded for this entry
        if (filesMap[index]) {

          if (existingExperience.experienceProof && fs.existsSync(existingExperience.experienceProof)) {
            fs.unlinkSync(existingExperience.experienceProof);
          }
          existingExperience.experienceProof = filesMap[index];

        } else {

          // Keep existing file path if no new file is uploaded
          existingExperience.experienceProof = existingExperience.experienceProof;
        }
      } else {

        // Add new experience if it doesn't exist
        user.experience.push({
          ...experience,
          experienceProof: filesMap[index] || experience.experienceProof || ''
        });
      }
    });

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "success",
      data: user.experience
    });

  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error(err);
  }
});

const addResearchProfile = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // save data
  user.researchProfile = data;
  await user.save();

  res.status(200).json({
    message: "success",
  });
});

const getResearchProfileData = asyncHandler(async (req, res) => {
  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  const researchProfileData = user.researchProfile;

  res.status(200).json(researchProfileData);
});


const updateResearchProfile = asyncHandler(async (req, res) => {

  //get required data
  const { email } = req.decodedData;
  const data = req.body
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  user.researchProfile = data
  await user.save()

  res.status(200).json({
    message: "success"
  });

})


const addQualification = asyncHandler(async (req, res) => {

  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // save data
  try {

    for (let i = 0; i < req.body.qualificationDetails.length; i++) {

      const data = req.body.qualificationDetails[i]
      data.proof = req.files[i].path
      user.qualification.push(data)

    }

    await user.save()

  }
  catch (err) {
    console.log(err);
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: "success",
  });

})


const getQualificationData = asyncHandler(async (req, res) => {

  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  const qualificationData = user.qualification;

  res.status(200).json(qualificationData);

})

/**
 * @tutorial: gets data converts req.files to map and matches data by index if match replace existing value of file path
 * else keep it same , new entry create a new entry and push to data
 */
const updateQualification = asyncHandler(async (req, res) => {

  // Get required data
  const data = req.body.qualificationDetails;
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // Convert files array into a map for easier access
  const files = req.files || [];
  const filesMap = files.reduce((acc, file) => {
    const index = parseInt(file.fieldname.match(/\d+/)[0], 10);
    acc[index] = file.path;
    return acc;
  }, {});

  // Update or add qualifications
  try {
    data.forEach((qualification, index) => {

      const existingQualification = user.qualification.id(qualification._id);

      if (existingQualification) {
        // Update existing qualification
        existingQualification.degree = qualification.degree;
        existingQualification.stream = qualification.stream;
        existingQualification.institute = qualification.institute;
        existingQualification.university = qualification.university;
        existingQualification.year = qualification.year;
        existingQualification.class = qualification.class;
        existingQualification.status = qualification.status;

        // Check if a new file is uploaded for this entry
        if (filesMap[index]) {

          if (existingQualification.proof && fs.existsSync(existingQualification.proof)) {
            fs.unlinkSync(existingQualification.proof);
          }
          existingQualification.proof = filesMap[index];

        } else {

          // Keep existing file path if no new file is uploaded
          existingQualification.proof = existingQualification.proof;
        }
      } else {

        // Add new qualification if it doesn't exist
        user.qualification.push({
          ...qualification,
          proof: filesMap[index] || qualification.proof || ""
        });

      }
    });

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "success",
    });

  } catch (err) {
    console.log(err);
    res.status(400);
    throw new Error(err);
  }
});



const addPatents = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // attach certificate url to data
  const certificateURL = req.file.path;
  data.patentCertificate = certificateURL;

  // create new patent entry
  const patent = await Patent.create(data);

  // attach patents to users
  for (const email of data.facultiesInvolved) {

    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { patent: patent._id } }
    );

  }

  res.status(200).json({
    message: "success",
  });

});


const getPatentData = asyncHandler(async (req, res) => {
  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate patents array to get full patent data
  await user.populate('patent')

  // Extract the populated patents data
  const patentData = user.patent

  // Send the response
  res.status(200).json(patentData);
});


const getPatentById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const patentData = await Patent.findById(id)

  // Send the response
  res.status(200).json(patentData);

})


const updatePatent = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const patent = await Patent.findById(req.body._id)

    if (!patent) {
      throw new Error("no patent found")
    }

    if (req.file) {

      if (patent.patentCertificate && fs.existsSync(patent.patentCertificate)) {
        fs.unlinkSync(patent.patentCertificate);
      }

      data.patentCertificate = req.file.path

    }

    await patent.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deletePatent = asyncHandler(async (req, res) => {

  const { patent_id } = req.body

  try {

    // Find the patent to get the necessary information
    const patent = await Patent.findById(patent_id);

    if (!patent) {
      throw new Error('Patent not found');
    }

    // Extract the list of faculty emails involved in the patent
    const facultyEmails = patent.facultiesInvolved;

    // Remove the patent ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { patent: patent_id } }
    );


    // Delete the associated file
    const filePath = patent.patentCertificate

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the patent entry from the database
    await Patent.findByIdAndDelete(patent_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addCopyright = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // attach file path to data
  const certificateURL = req.file.path;
  data.copyrightCertificate = certificateURL;

  // create new copyright entry
  const copyright = await Copyright.create(data);

  // attach copyright to faculties
  for (const email of data.facultiesInvolved) {

    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { copyright: copyright._id } }
    );

  }

  res.status(200).json({
    message: "success",
  });

});


const getCopyrightData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate copyrights array to get full copyright data
  await user.populate('copyright')

  // Extract the populated copyrights data
  const copyrightData = user.copyright

  // Send the response
  res.status(200).json(copyrightData);

});

const getCopyrightById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const copyrightData = await Copyright.findById(id)

  // Send the response
  res.status(200).json(copyrightData);

})


const updateCopyright = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const copyright = await Copyright.findById(req.body._id)

    if (!copyright) {
      throw new Error("no copyright found")
    }

    if (req.file) {

      if (copyright.copyrightCertificate && fs.existsSync(copyright.copyrightCertificate)) {
        fs.unlinkSync(copyright.copyrightCertificate);
      }

      data.copyrightCertificate = req.file.path

    }

    await copyright.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})


const deleteCopyright = asyncHandler(async (req, res) => {

  const { copyright_id } = req.body

  try {

    // Find the copyright to get the necessary information
    const copyright = await Copyright.findById(copyright_id);

    if (!copyright) {
      throw new Error('Copyright not found');
    }

    // Extract the list of faculty emails involved in the copyright
    const facultyEmails = copyright.facultiesInvolved;

    // Remove the copyright ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { copyright: copyright_id } }
    );


    // Delete the associated file
    const filePath = copyright.copyrightCertificate

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the copyright entry from the database
    await Copyright.findByIdAndDelete(copyright_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addJournal = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add file paths to data
  const paperURL = req.files.paper[0].path;
  const certificateURL = req.files.certificate[0].path;

  data.paper = paperURL;
  data.certificate = certificateURL;

  // create entry in journal
  const journal = await Journal.create(data);


  // attach entry to involved faculty

  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { journal: journal._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });

});


const getJournalData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate journal array to get full journal data
  await user.populate('journal')

  // Extract the populated journal data
  const journalData = user.journal

  // Send the response
  res.status(200).json(journalData);

});


const getJournalById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  const journalData = await Journal.findById(id)

  // Send the response
  res.status(200).json(journalData);

})


const updateJournal = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const journal = await Journal.findById(req.body._id)

    if (!journal) {
      throw new Error("no journal found")
    }

    if (req.files.paper) {

      if (journal.paper && fs.existsSync(journal.paper)) {
        fs.unlinkSync(journal.paper);
      }

      data.paper = req.files.paper[0].path

    }

    if (req.files.certificate) {

      if (journal.certificate && fs.existsSync(journal.certificate)) {
        fs.unlinkSync(journal.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    await journal.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deleteJournal = asyncHandler(async (req, res) => {

  const { journal_id } = req.body

  try {

    // Find the journal to get the necessary information
    const journal = await Journal.findById(journal_id);

    if (!journal) {
      throw new Error('Journal not found');
    }

    // Extract the list of faculty emails involved in the journal
    const facultyEmails = journal.facultiesInvolved;

    // Remove the journal ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { journal: journal_id } }
    );


    // Delete the associated file
    if (journal.paper && fs.existsSync(journal.paper)) {
      fs.unlinkSync(journal.paper);
    }

    if (journal.certificate && fs.existsSync(journal.certificate)) {
      fs.unlinkSync(journal.certificate);
    }

    // Delete the journal entry from the database
    await Journal.findByIdAndDelete(journal_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addConference = asyncHandler(async (req, res) => {
  // Get required data
  const data = req.body;
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // Initialize file paths
  let paperURL = data.paperUrl || '';  // Fallback if no file uploaded
  let certificateURL = data.certificateUrl || '';  // Fallback if no file uploaded

  // Check if files are present
  if (req.files.paper && req.files.paper.length > 0) {
    paperURL = req.files.paper[0].path;
  }

  if (req.files.certificate && req.files.certificate.length > 0) {
    certificateURL = req.files.certificate[0].path;
  }

  // Attach file paths in data
  data.paper = paperURL;
  data.certificate = certificateURL;

  // Create conference entry
  const conference = await Conference.create(data);

  // Attach entry to involved faculties
  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { conference: conference._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
});


const getConferenceData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate conference array to get full conference data
  await user.populate('conference')

  // Extract the populated conference data
  const conferenceData = user.conference

  // Send the response
  res.status(200).json(conferenceData);

});


const getConferenceById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const conferenceData = await Conference.findById(id)

  // Send the response
  res.status(200).json(conferenceData);

})


const updateConference = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const conference = await Conference.findById(req.body._id)

    if (!conference) {
      throw new Error("no conference found")
    }

    if (req.files.paper) {

      if (conference.paper && fs.existsSync(conference.paper)) {
        fs.unlinkSync(conference.paper);
      }

      data.paper = req.files.paper[0].path

    }

    if (req.files.certificate) {

      if (conference.certificate && fs.existsSync(conference.certificate)) {
        fs.unlinkSync(conference.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    await conference.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})


const deleteConference = asyncHandler(async (req, res) => {

  const { conference_id } = req.body

  try {

    // Find the conference to get the necessary information
    const conference = await Conference.findById(conference_id);

    if (!conference) {
      throw new Error('Conference not found');
    }

    // Extract the list of faculty emails involved in the conference
    const facultyEmails = conference.facultiesInvolved;

    // Remove the conference ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { conference: conference_id } }
    );


    // Delete the associated file
    if (conference.paper && fs.existsSync(conference.paper)) {
      fs.unlinkSync(conference.paper);
    }

    if (conference.certificate && fs.existsSync(conference.certificate)) {
      fs.unlinkSync(conference.certificate);
    }

    // Delete the conference entry from the database
    await Conference.findByIdAndDelete(conference_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addBook = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  //get proof file path
  const proofURL = req.file.path;
  data.proof = proofURL;

  // create book entry
  const book = await Book.create(data);

  // attach entry to invlolved faculty

  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { book: book._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
});



const getBookData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate book array to get full book data
  await user.populate('book')

  // Extract the populated book data
  const bookData = user.book

  // Send the response
  res.status(200).json(bookData);

});

const getBookById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const bookData = await Book.findById(id)

  // Send the response
  res.status(200).json(bookData);

})


const updateBook = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const book = await Book.findById(req.body._id)

    if (!book) {
      throw new Error("no book found")
    }

    if (req.file) {

      if (book.proof && fs.existsSync(book.proof)) {
        fs.unlinkSync(book.proof);
      }

      data.proof = req.file.path

    }

    await book.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})


const deleteBook = asyncHandler(async (req, res) => {

  const { book_id } = req.body

  try {

    // Find the book to get the necessary information
    const book = await Book.findById(book_id);

    if (!book) {
      throw new Error('Book not found');
    }

    // Extract the list of faculty emails involved in the book
    const facultyEmails = book.facultiesInvolved;

    // Remove the book ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { book: book_id } }
    );


    // Delete the associated file
    if (book.proof && fs.existsSync(book.proof)) {
      fs.unlinkSync(book.proof);
    }

    // Delete the book entry from the database
    await Book.findByIdAndDelete(book_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addBookChapter = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path and attach to data
  const certificateURL = req.file.path;
  data.proof = certificateURL;

  // create book chapter entry
  const bookChapter = await BookChapter.create(data);

  // attach entry to involved faculties

  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { bookChapter: bookChapter._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });

});


const getBookChapterData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate bookChapter array to get full bookChapter data
  await user.populate('bookChapter')

  // Extract the populated bookChapter data
  const bookChapterData = user.bookChapter

  // Send the response
  res.status(200).json(bookChapterData);

});


const getBookChapterById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const bookChapterData = await BookChapter.findById(id)

  // Send the response
  res.status(200).json(bookChapterData);

})


const updateBookChapter = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const bookChapter = await BookChapter.findById(req.body._id)

    if (!bookChapter) {
      throw new Error("no bookChapter found")
    }

    if (req.file) {

      if (bookChapter.proof && fs.existsSync(bookChapter.proof)) {
        fs.unlinkSync(bookChapter.proof);
      }

      data.proof = req.file.path

    }

    await bookChapter.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})


const deleteBookChapter = asyncHandler(async (req, res) => {

  const { book_chapter_id } = req.body

  try {

    // Find the book chapter to get the necessary information
    const bookChapter = await BookChapter.findById(book_chapter_id);

    if (!bookChapter) {
      throw new Error('Book not found');
    }

    // Extract the list of faculty emails involved in the book chapter
    const facultyEmails = bookChapter.facultiesInvolved;

    // Remove the book chapter ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { bookChapter: book_chapter_id } }
    );


    // Delete the associated file
    if (bookChapter.proof && fs.existsSync(bookChapter.proof)) {
      fs.unlinkSync(bookChapter.proof);
    }

    // Delete the book entry from the database
    await BookChapter.findByIdAndDelete(book_chapter_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addNeedBasedProject = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }


  //get file paths
  const sanctionedDocumentsURL = req.files.sanctionedDocuments[0].path
  const projectReportURL = req.files.projectReport[0].path
  const completionLetterURL = req.files.completionLetter[0].path
  const visitDocumentsURL = req.files.visitDocuments[0].path


  // attach file path in data
  data.sanctionedDocuments = sanctionedDocumentsURL
  data.projectReport = projectReportURL
  data.completionLetter = completionLetterURL
  data.visitDocuments = visitDocumentsURL

  // create book chapter entry
  const needBasedProject = await NeedBasedProject.create(data);

  // attach entry to involved faculties

  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { needBasedProjects: needBasedProject._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });

});

const getNeedBasedProjectById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const needBasedProjectData = await NeedBasedProject.findById(id)

  // Send the response
  res.status(200).json(needBasedProjectData);

})


const getNeedBasedProjectData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate bookChapter array to get full bookChapter data
  await user.populate('needBasedProjects')

  // Extract the populated bookChapter data
  const needBasedProjectData = user.needBasedProjects

  // Send the response
  res.status(200).json(needBasedProjectData);

});


const deleteNeedBasedProject = asyncHandler(async (req, res) => {

  const { project_id } = req.body

  try {

    // Find the project to get the necessary information
    const project = await NeedBasedProject.findById(project_id);

    if (!project) {
      throw new Error('Project not found');
    }

    // Delete the associated file
    if (project.sanctionedDocuments && fs.existsSync(project.sanctionedDocuments)) {
      fs.unlinkSync(project.sanctionedDocuments);
    }

    if (project.projectReport && fs.existsSync(project.projectReport)) {
      fs.unlinkSync(project.projectReport);
    }

    if (project.completionLetter && fs.existsSync(project.completionLetter)) {
      fs.unlinkSync(project.completionLetter);
    }

    if (project.visitDocuments && fs.existsSync(project.visitDocuments)) {
      fs.unlinkSync(project.visitDocuments);
    }

    // Extract the list of faculty emails involved in the project
    const facultyEmails = project.facultiesInvolved;

    // Remove the project ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { needBasedProjects: project_id } }
    );

    // Delete the project entry from the database
    await NeedBasedProject.findByIdAndDelete(project_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addAwardHonors = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path and attach to data
  const certificateURL = req.file.path;
  data.proof = certificateURL;

  // create book chapter entry
  const awardHonors = await AwardHonors.create(data);

  // add ref id to faculty 
  user.awardsHonors.push(awardHonors._id)
  await user.save()

  res.status(200).json({
    message: "success",
  });

});

const getAwardHonorsById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const awardHonorsData = await AwardHonors.findById(id)

  // Send the response
  res.status(200).json(awardHonorsData);

})

const getAwardHonorsData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate award honors array to get full award honors data
  await user.populate('awardsHonors')

  // Extract the populated award honors data
  const awardHonorsData = user.awardsHonors

  // Send the response
  res.status(200).json(awardHonorsData);

});


const updateAwardsHonors = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const awardHonors = await AwardHonors.findById(req.body._id)

    if (!awardHonors) {
      throw new Error("no award Honors found")
    }

    if (req.file) {

      if (awardHonors.proof && fs.existsSync(awardHonors.proof)) {
        fs.unlinkSync(awardHonors.proof);
      }

      data.proof = req.file.path

    }

    await awardHonors.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deleteAwardsHonors = asyncHandler(async (req, res) => {

  const { award_id } = req.body
  const { email } = req.decodedData

  try {

    // Find the awards honors to get the necessary information
    const awardsHonors = await AwardHonors.findById(award_id);

    if (!awardsHonors) {
      throw new Error('Awards Honors not found');
    }

    // Remove the awards honors ID from the faculty
    await Faculty.updateOne(
      { email: email },
      { $pull: { awardsHonors: award_id } }
    );


    // Delete the associated file
    if (awardsHonors.proof && fs.existsSync(awardsHonors.proof)) {
      fs.unlinkSync(awardsHonors.proof);
    }

    // Delete the awards honors entry from the database
    await AwardHonors.findByIdAndDelete(award_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addConsultancy = asyncHandler(async (req, res) => {

  // Get required data
  const data = req.body;
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // Get file paths
  const sanctionedOrderURL = req.files.sanctionedOrder[0].path;
  const transactionProofURL = req.files.transactionProof[0].path;
  const completionCertificateURL = req.files.completionCertificate[0].path;
  const supportingDocumentsURL = req.files.supportingDocuments[0].path;

  // Attach file paths to data
  data.sanctionedOrder = sanctionedOrderURL;
  data.transactionProof = transactionProofURL;
  data.completionCertificate = completionCertificateURL;
  data.supportingDocuments = supportingDocumentsURL;

  // Get all transactions
  const transactions = data.transactionDetails || []; // Default to empty array if undefined
  const transaction_ids = [];

  if (transactions.length > 0) {
    // Only create transactions if there are any
    for (const entry of transactions) {
      const createdTransaction = await Transaction.create(entry);
      transaction_ids.push(createdTransaction._id);
    }
  }

  // Change transactionDetails parameter of original data
  data.transactionDetails = transaction_ids;

  // Create consultancy entry
  const consultancy = await Consultancy.create(data);

  // Attach entry to involved faculties
  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { consultancy: consultancy._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });

});


const getConsultancyById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const consultancyData = await Consultancy.findById(id).populate('transactionDetails')

  // Send the response
  res.status(200).json(consultancyData);

})


const getConsultancyData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate consultancy array to get full consultancy data
  await user.populate({
    path: 'consultancy',
    populate: {
      path: 'transactionDetails',
      model: 'transaction'
    }
  })


  // Extract the populated consultancy data
  const consultancyData = user.consultancy

  // Send the response
  res.status(200).json(consultancyData);

});

const deleteConsultancy = asyncHandler(async (req, res) => {

  const { consultancy_id } = req.body

  try {

    // Find the consultancy to get the necessary information
    const consultancy = await Consultancy.findById(consultancy_id);

    if (!consultancy) {
      throw new Error('Consultancy not found');
    }

    // Delete the associated file
    if (consultancy.sanctionedOrder && fs.existsSync(consultancy.sanctionedOrder)) {
      fs.unlinkSync(consultancy.sanctionedOrder);
    }

    if (consultancy.transactionProof && fs.existsSync(consultancy.transactionProof)) {
      fs.unlinkSync(consultancy.transactionProof);
    }

    if (consultancy.completionCertificate && fs.existsSync(consultancy.completionCertificate)) {
      fs.unlinkSync(consultancy.completionCertificate);
    }

    if (consultancy.supportingDocuments && fs.existsSync(consultancy.supportingDocuments)) {
      fs.unlinkSync(consultancy.supportingDocuments);
    }

    // Delete associated transactions
    await Transaction.deleteMany({ _id: { $in: consultancy.transactionDetails } });

    // Extract the list of faculty emails involved in the consultancy
    const facultyEmails = consultancy.facultiesInvolved;

    // Remove the consultancy ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { consultancy: consultancy_id } }
    );

    // Delete the consultancy entry from the database
    await Consultancy.findByIdAndDelete(consultancy_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addProject = asyncHandler(async (req, res) => {

  // Get required data
  const data = req.body;
  const { email } = req.decodedData;

  // Find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // Get file paths
  const sanctionedOrderURL = req.files.sanctionedOrder[0].path;
  const transactionProofURL = req.files.transactionProof[0].path;
  const completionCertificateURL = req.files.completionCertificate[0].path;
  const supportingDocumentsURL = req.files.supportingDocuments[0].path;

  // Attach file paths to data
  data.sanctionedOrder = sanctionedOrderURL;
  data.transactionProof = transactionProofURL;
  data.completionCertificate = completionCertificateURL;
  data.supportingDocuments = supportingDocumentsURL;

  // Get all transactions
  const transactions = data.transactionDetails || []; // Default to empty array if undefined
  const transaction_ids = [];

  if (transactions.length > 0) {
    // Only create transactions if there are any
    for (const entry of transactions) {
      const createdTransaction = await Transaction.create(entry);
      transaction_ids.push(createdTransaction._id);
    }
  }

  // Change transactionDetails parameter of original data
  data.transactionDetails = transaction_ids;

  // Create project entry
  const project = await Project.create(data);

  // Attach entry to involved faculties
  for (const email of data.facultiesInvolved) {
    await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { projects: project._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });

});


const getProjectsData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate projects array to get full projects data
  await user.populate({
    path: 'projects',
    populate: {
      path: 'transactionDetails',
      model: 'transaction'
    }
  })


  // Extract the populated project data
  const projectData = user.projects

  // Send the response
  res.status(200).json(projectData);

});


const getProjectById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const projectData = await Project.findById(id).populate('transactionDetails')

  // Send the response
  res.status(200).json(projectData);

})



const deleteProject = asyncHandler(async (req, res) => {

  const { project_id } = req.body

  try {

    // Find the project to get the necessary information
    const project = await Project.findById(project_id);

    if (!project) {
      throw new Error('Project not found');
    }

    // Delete the associated file
    if (project.sanctionedOrder && fs.existsSync(project.sanctionedOrder)) {
      fs.unlinkSync(project.sanctionedOrder);
    }

    if (project.transactionProof && fs.existsSync(project.transactionProof)) {
      fs.unlinkSync(project.transactionProof);
    }

    if (project.completionCertificate && fs.existsSync(project.completionCertificate)) {
      fs.unlinkSync(project.completionCertificate);
    }

    if (project.supportingDocuments && fs.existsSync(project.supportingDocuments)) {
      fs.unlinkSync(project.supportingDocuments);
    }

    // Delete associated transactions
    await Transaction.deleteMany({ _id: { $in: project.transactionDetails } });

    // Extract the list of faculty emails involved in the project
    const facultyEmails = project.facultiesInvolved;

    // Remove the project ID from all related faculties
    await Faculty.updateMany(
      { email: { $in: facultyEmails } },
      { $pull: { projects: project_id } }
    );

    // Delete the project entry from the database
    await Project.findByIdAndDelete(project_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


// ACHIEVEMENTS FORMS

const addSttpConducted = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path 
  const certificateURL = req.files.certificate[0].path
  const invitationLetterURL = req.files.invitationLetter[0].path
  const photosURL = req.files.photos[0].path

  // attach file path to data

  data.certificate = certificateURL
  data.invitationLetter = invitationLetterURL
  data.photos = photosURL

  // create consultancy entry
  const sttpConducted = await SttpConducted.create(data);

  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { sttpConducted: sttpConducted._id } }
  );

  res.status(200).json({
    message: "success",
  });

});

const getSttpConductedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const sttpConductedData = await SttpConducted.findById(id)

  // Send the response
  res.status(200).json(sttpConductedData);

})


const getSttpConductedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate consultancy array to get full consultancy data
  await user.populate('sttpConducted')

  // Extract the populated consultancy data
  const sttpConductedData = user.sttpConducted

  // Send the response
  res.status(200).json(sttpConductedData);

});

const deleteSttpConducted = asyncHandler(async (req, res) => {

  const { sttpConducted_id } = req.body;
  const { email } = req.decodedData;

  try {

    // Find the STTP/FDP conducted entry to get the necessary information
    const sttpConducted = await SttpConducted.findById(sttpConducted_id);

    if (!sttpConducted) {
      return res.status(404).json({ message: 'STTP/FDP conducted not found' });
    }

    // Delete the associated files if they exist
    if (sttpConducted.certificate && fs.existsSync(sttpConducted.certificate)) {
      fs.unlinkSync(sttpConducted.certificate);
    }

    if (sttpConducted.invitationLetter && fs.existsSync(sttpConducted.invitationLetter)) {
      fs.unlinkSync(sttpConducted.invitationLetter);
    }

    if (sttpConducted.photos && fs.existsSync(sttpConducted.photos)) {
      fs.unlinkSync(sttpConducted.photos);
    }

    // Delete the STTP/FDP conducted entry from the database
    await SttpConducted.findByIdAndDelete(sttpConducted_id);

    // Update the Faculty document by removing the reference
    await Faculty.updateOne(
      { email: email },
      { $pull: { sttpConducted: sttpConducted_id } }
    );

    res.status(200).json({ message: 'success' });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const updateSttpConducted = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const sttpConducted = await SttpConducted.findById(req.body._id)

    if (!sttpConducted) {
      throw new Error("sttp Conducted not found")
    }

    if (req.files.certificate) {

      if (sttpConducted.certificate && fs.existsSync(sttpConducted.certificate)) {
        fs.unlinkSync(sttpConducted.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    if (req.files.invitationLetter) {

      if (sttpConducted.invitationLetter && fs.existsSync(sttpConducted.invitationLetter)) {
        fs.unlinkSync(sttpConducted.invitationLetter);
      }

      data.invitationLetter = req.files.invitationLetter[0].path

    }

    if (req.files.photos) {


      if (sttpConducted.photos && fs.existsSync(sttpConducted.photos)) {
        fs.unlinkSync(sttpConducted.photos);
      }

      data.photos = req.files.photos[0].path

    }

    await sttpConducted.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addSttpAttended = asyncHandler(async (req, res) => {
  try {
    // Get required data
    const data = req.body;
    const { email } = req.decodedData;

    // Find user
    const user = await Faculty.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Get file path
    const certificateURL = req.file?.path;

    if (!certificateURL) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    // Attach file path to data
    data.certificate = certificateURL;

    // Create consultancy entry
    const sttpAttendedEntry = await SttpAttended.create(data);

    // Update user with new sttpAttended entry
    user.sttpAttended.push(sttpAttendedEntry._id);
    await user.save();

    res.status(200).json({
      message: "success"
    });

  }
  catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});



const getSttpAttendedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  const sttpAttendedData = await SttpAttended.findById(id)

  // Send the response
  res.status(200).json(sttpAttendedData);

})


const getSttpAttendedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate sttp array to get full sttp data
  await user.populate('sttpAttended')

  // Extract the populated sttp data
  const sttpAttendedData = user.sttpAttended

  // Send the response
  res.status(200).json(sttpAttendedData);

});

const deleteSttpAttended = asyncHandler(async (req, res) => {
  const { sttpAttended_id } = req.body;
  const { email } = req.decodedData;

  try {

    // Find the STTP/FDP to get the necessary information
    const sttpAttended = await SttpAttended.findById(sttpAttended_id);
    if (!sttpAttended) {
      return res.status(404).json({ message: 'STTP/FDP not found' });
    }

    // Remove the STTP/FDP ID from the faculty
    await Faculty.updateOne(
      { email: email },
      { $pull: { sttpAttended: sttpAttended_id } }
    );

    // Delete the associated file
    if (sttpAttended.certificate && fs.existsSync(sttpAttended.certificate)) {
      fs.unlinkSync(sttpAttended.certificate);
    }

    // Delete the STTP/FDP entry from the database
    await SttpAttended.findByIdAndDelete(sttpAttended._id);

    res.status(200).json({
      message: 'success'
    });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const updateSttpAttended = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const sttpAttended = await SttpAttended.findById(req.body._id)

    if (!sttpAttended) {
      throw new Error("no sttpCond found")
    }

    if (req.file) {

      if (sttpAttended.certificate && fs.existsSync(sttpAttended.certificate)) {
        fs.unlinkSync(sttpAttended.certificate);
      }

      data.certificate = req.file.path

    }

    await sttpAttended.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addSttpOrganized = asyncHandler(async (req, res) => {
  console.log('adding......')

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path 
  const uploadFundSanctionedLetterURL = req.files.fundSanctionedLetter[0].path
  const uploadUtilizationCertificateURL = req.files.utilizationCertificate[0].path
  const uploadBannerURL = req.files.banner[0].path
  const uploadScheduleOfOrganizerURL = req.files.schedule[0].path
  const uploadCertificateLOAURL = req.files.certificate[0].path
  const uploadSupportingDocumentsURL = req.files.supportingDocuments[0].path
  const uploadReportURL = req.files.report[0].path
  const uploadPhotosURL = req.files.photos[0].path

  // attach file path to data

  data.uploadFundSanctionedLetter = uploadFundSanctionedLetterURL
  data.uploadUtilizationCertificate = uploadUtilizationCertificateURL
  data.uploadBanner = uploadBannerURL
  data.uploadScheduleOfOrganizer = uploadScheduleOfOrganizerURL
  data.uploadCertificateLOA = uploadCertificateLOAURL
  data.uploadSupportingDocuments = uploadSupportingDocumentsURL
  data.uploadReport = uploadReportURL
  data.uploadPhotos = uploadPhotosURL

  // create consultancy entry
  const sttpOrg = await sttpOrganized.create(data);
  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { sttpOrganized: sttpOrg._id } }
  );

  res.status(200).json({
    message: "success",
  });

});

const getSttpOrganizedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const sttpOrganizedData = await sttpOrganized.findById(id)

  // Send the response
  res.status(200).json(sttpOrganizedData);

})


const getSttpOrganizedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate consultancy array to get full consultancy data
  await user.populate('sttpOrganized')


  // Extract the populated consultancy data
  const sttpOrganizedData = user.sttpOrganized

  // Send the response
  res.status(200).json(sttpOrganizedData);

});

const deleteSttpOrganized = asyncHandler(async (req, res) => {

  const { sttpOrg_id } = req.body

  try {

    // Find the STTP/FDP to get the necessary information
    const sttpOrg = await sttpOrganized.findById(sttpOrg_id);

    if (!sttpOrg) {
      throw new Error('STTP/FDP not found');
    }

    // Delete the associated file
    if (sttpOrg.uploadFundSanctionedLetter && fs.existsSync(sttpOrg.uploadFundSanctionedLetter)) {
      fs.unlinkSync(sttpOrg.uploadFundSanctionedLetter);
    }

    if (sttpOrg.uploadUtilizationCertificate && fs.existsSync(sttpOrg.uploadUtilizationCertificate)) {
      fs.unlinkSync(sttpOrg.uploadUtilizationCertificate);
    }

    if (sttpOrg.uploadBanner && fs.existsSync(sttpOrg.uploadBanner)) {
      fs.unlinkSync(sttpOrg.uploadBanner);
    }

    if (sttpOrg.uploadScheduleOfOrganizer && fs.existsSync(sttpOrg.uploadScheduleOfOrganizer)) {
      fs.unlinkSync(sttpOrg.uploadScheduleOfOrganizer);
    }

    if (sttpOrg.uploadCertificateLOA && fs.existsSync(sttpOrg.uploadCertificateLOA)) {
      fs.unlinkSync(sttpOrg.uploadCertificateLOA);
    }

    if (sttpOrg.uploadSupportingDocuments && fs.existsSync(sttpOrg.uploadSupportingDocuments)) {
      fs.unlinkSync(sttpOrg.uploadSupportingDocuments);
    }

    if (sttpOrg.uploadReport && fs.existsSync(sttpOrg.uploadReport)) {
      fs.unlinkSync(sttpOrg.uploadReport);
    }

    if (sttpOrg.uploadPhotos && fs.existsSync(sttpOrg.uploadPhotos)) {
      fs.unlinkSync(sttpOrg.uploadPhotos);
    }


    // Delete the STTP/FDP entry from the database
    await sttpOrganized.findByIdAndDelete(sttpOrg_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const updateSttpOrganized = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const sttpOrg = await sttpOrganized.findById(req.body._id)

    if (!sttpOrg) {
      throw new Error("no sttpOrg found")
    }

    if (req.files.fundSanctionedLetter) {
      if (sttpOrg.uploadFundSanctionedLetter && fs.existsSync(sttpOrg.uploadFundSanctionedLetter)) {
        fs.unlinkSync(sttpOrg.uploadFundSanctionedLetter);
      }
      data.uploadFundSanctionedLetter = req.files.fundSanctionedLetter[0].path;
    }

    if (req.files.utilizationCertificate) {
      if (sttpOrg.uploadUtilizationCertificate && fs.existsSync(sttpOrg.uploadUtilizationCertificate)) {
        fs.unlinkSync(sttpOrg.uploadUtilizationCertificate);
      }
      data.uploadUtilizationCertificate = req.files.utilizationCertificate[0].path;
    }

    if (req.files.banner) {
      if (sttpOrg.uploadBanner && fs.existsSync(sttpOrg.uploadBanner)) {
        fs.unlinkSync(sttpOrg.uploadBanner);
      }
      data.uploadBanner = req.files.banner[0].path;
    }

    if (req.files.schedule) {
      if (sttpOrg.uploadScheduleOfOrganizer && fs.existsSync(sttpOrg.uploadScheduleOfOrganizer)) {
        fs.unlinkSync(sttpOrg.uploadScheduleOfOrganizer);
      }
      data.uploadScheduleOfOrganizer = req.files.schedule[0].path;
    }

    if (req.files.certificate) {
      if (sttpOrg.uploadCertificateLOA && fs.existsSync(sttpOrg.uploadCertificateLOA)) {
        fs.unlinkSync(sttpOrg.uploadCertificateLOA);
      }
      data.uploadCertificateLOA = req.files.certificate[0].path;
    }

    if (req.files.supportingDocuments) {
      if (sttpOrg.uploadSupportingDocuments && fs.existsSync(sttpOrg.uploadSupportingDocuments)) {
        fs.unlinkSync(sttpOrg.uploadSupportingDocuments);
      }
      data.uploadSupportingDocuments = req.files.supportingDocuments[0].path;
    }

    if (req.files.report) {
      if (sttpOrg.uploadReport && fs.existsSync(sttpOrg.uploadReport)) {
        fs.unlinkSync(sttpOrg.uploadReport);
      }
      data.uploadReport = req.files.report[0].path;
    }

    if (req.files.photos) {
      if (sttpOrg.uploadPhotos && fs.existsSync(sttpOrg.uploadPhotos)) {
        fs.unlinkSync(sttpOrg.uploadPhotos);
      }
      data.uploadPhotos = req.files.photos[0].path;
    }


    await sttpOrg.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

/*
Seminar Controller
*/

const addSeminarAttended = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }
  // get file path 
  const certificateURL = req.files.certificate[0].path
  const photosURL = req.files.photos[0].path

  // attach file path to data
  data.certificate = certificateURL
  data.photos = photosURL

  // create entry
  const seminarAttended = await SeminarAttended.create(data);

  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { seminarAttended: seminarAttended._id } }
  );

  res.status(200).json({
    message: "success",
  });

});

const getSeminarAttendedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  const seminarAttendedData = await SeminarAttended.findById(id)

  // Send the response
  res.status(200).json(seminarAttendedData);

})


const getSeminarAttendedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate seminar array to get full seminar data
  await user.populate('seminarAttended')


  // Extract the populated seminar data
  const seminarAttendedData = user.seminarAttended

  // Send the response
  res.status(200).json(seminarAttendedData);

});


const deleteSeminarAttended = asyncHandler(async (req, res) => {
  const { seminarAttended_id } = req.body;
  const { email } = req.decodedData;

  try {
    // Find the Seminar to get the necessary information
    const seminarAttended = await SeminarAttended.findById(seminarAttended_id);

    if (!seminarAttended) {
      return res.status(404).json({ message: 'Seminar not found' });
    }

    // Update Faculty document
    await Faculty.updateOne(
      { email: email },
      { $pull: { seminarAttended: seminarAttended._id } }
    );

    // Delete the associated files if they exist
    if (seminarAttended.certificate && fs.existsSync(seminarAttended.certificate)) {
      fs.unlinkSync(seminarAttended.certificate);
    }

    if (seminarAttended.photos && fs.existsSync(seminarAttended.photos)) {
      fs.unlinkSync(seminarAttended.photos);
    }

    // Delete the Seminar entry from the database
    await SeminarAttended.findByIdAndDelete(seminarAttended_id);

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server Error' });
  }
});

const updateSeminarAttended = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const seminarAttended = await SeminarAttended.findById(req.body._id)

    if (!seminarAttended) {
      throw new Error("no seminarAttended found")
    }

    if (req.files.certificate) {

      if (seminarAttended.certificate && fs.existsSync(seminarAttended.certificate)) {
        fs.unlinkSync(seminarAttended.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    if (req.files.photos) {
      if (seminarAttended.photos && fs.existsSync(seminarAttended.photos)) {
        fs.unlinkSync(seminarAttended.photos);
      }

      data.photos = req.files.photos[0].path
    }

    await seminarAttended.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addSeminarConducted = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path 
  const certificateURL = req.files.certificate[0].path
  const invitationLetterURL = req.files.invitationLetter[0].path
  const photoURL = req.files.photos[0].path

  // attach file path to data

  data.certificate = certificateURL
  data.invitationLetter = invitationLetterURL
  data.photos = photoURL

  // create consultancy entry
  const seminarConducted = await SeminarConducted.create(data);

  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { seminarConducted: seminarConducted._id } }
  );

  res.status(200).json({
    message: "success",
  });

});

const getSeminarConductedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const seminarConductedData = await SeminarConducted.findById(id)

  // Send the response
  res.status(200).json(seminarConductedData);

})


const getSeminarConductedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate consultancy array to get full consultancy data
  await user.populate('seminarConducted')

  // Extract the populated consultancy data
  const seminarConductedData = user.seminarConducted

  // Send the response
  res.status(200).json(seminarConductedData);

});

const deleteSeminarConducted = asyncHandler(async (req, res) => {

  const { seminarConducted_id } = req.body
  const { email } = req.decodedData


  try {

    // Find the Seminar to get the necessary information
    const seminarConducted = await SeminarConducted.findById(seminarConducted_id);

    if (!seminarConducted) {
      throw new Error('Seminar Conducted not found');
    }

    await Faculty.updateOne(
      { email: email },
      { $pull: { seminarConducted: seminarConducted._id } }
    );
    
    // Delete the associated file
    if (seminarConducted.certificate && fs.existsSync(seminarConducted.certificate)) {
      fs.unlinkSync(seminarConducted.certificate);
    }

    if (seminarConducted.invitationLetter && fs.existsSync(seminarConducted.invitationLetter)) {
      fs.unlinkSync(seminarConducted.invitationLetter);
    }

    if (seminarConducted.photos && fs.existsSync(seminarConducted.photos)) {
      fs.unlinkSync(seminarConducted.photos);
    }

    // Delete the Seminar entry from the database
    await SeminarConducted.findByIdAndDelete(seminarConducted_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const updateSeminarConducted = asyncHandler(async (req, res) => {

  const data = req.body  

  try {

    const seminarConducted = await SeminarConducted.findById(req.body._id)

    if (!seminarConducted) {
      throw new Error("Seminar Conducted not found!")
    }

    if (req.files.certificate) {

      if (seminarConducted.certificate && fs.existsSync(seminarConducted.certificate)) {
        fs.unlinkSync(seminarConducted.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    if (req.files.invitationLetter) {

      if (seminarConducted.invitationLetter && fs.existsSync(seminarConducted.invitationLetter)) {
        fs.unlinkSync(seminarConducted.invitationLetter);
      }

      data.invitationLetter = req.files.invitationLetter[0].path

    }

    if (req.files.photos) {


      if (seminarConducted.photos && fs.existsSync(seminarConducted.photos)) {
        fs.unlinkSync(seminarConducted.photos);
      }

      data.photos = req.files.photos[0].path

    }

    await seminarConducted.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const addSeminarOrganized = asyncHandler(async (req, res) => {
  console.log('adding......')

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // get file path 
  const uploadUtilizationCertificateURL = req.files.utilizationCertificate[0].path
  const uploadBannerURL = req.files.banner[0].path
  const uploadScheduleOfOrganizerURL = req.files.schedule[0].path
  const uploadCertificateLOAURL = req.files.certificate[0].path
  const uploadSupportingDocumentsURL = req.files.supportingDocuments[0].path
  const uploadReportURL = req.files.report[0].path
  const uploadPhotosURL = req.files.photos[0].path
  const uploadFundSanctionedLetterURL = req.files.fundSanctionedLetter[0].path
  const uploadInvitationLetterURL = req.files.uploadInvitationLetter[0].path
  const uploadCertificateLOAToSpeakerURL = req.files.uploadCertificateLOAToSpeaker[0].path
  const uploadCertificateOfOrganizerURL = req.files.uploadCertificateOfOrganizer[0].path
  const uploadLOAOfOrganizerURL = req.files.uploadLOAOfOrganizer[0].path

  // attach file path to data
  data.uploadFundSanctionedLetter = uploadFundSanctionedLetterURL
  data.uploadUtilizationCertificate = uploadUtilizationCertificateURL
  data.uploadBanner = uploadBannerURL
  data.uploadScheduleOfOrganizer = uploadScheduleOfOrganizerURL
  data.uploadCertificateLOA = uploadCertificateLOAURL
  data.uploadSupportingDocuments = uploadSupportingDocumentsURL
  data.uploadReport = uploadReportURL
  data.uploadPhotos = uploadPhotosURL
  data.uploadInvitationLetter = uploadInvitationLetterURL
  data.uploadCertificateLOAToSpeaker = uploadCertificateLOAToSpeakerURL
  data.uploadCertificateOfOrganizer = uploadCertificateOfOrganizerURL
  data.uploadLOAOfOrganizer = uploadLOAOfOrganizerURL

  // create consultancy entry
  const seminarOrg = await seminarOrganized.create(data);
  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { seminarOrganized: seminarOrg._id } }
  );

  res.status(200).json({
    message: "success",
  });

});

const getSeminarOrganizedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }


  const seminarOrganizedData = await seminarOrganised.findById(id)

  // Send the response
  res.status(200).json(seminarOrganizedData);

})


const getSeminarOrganizedData = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate consultancy array to get full consultancy data
  await user.populate('seminarOrganized')


  // Extract the populated consultancy data
  const seminarOrganizedData = user.sttpOrganized

  // Send the response
  res.status(200).json(seminarOrganizedData);

});

const deleteSeminarOrganized = asyncHandler(async (req, res) => {

  const { seminarOrg_id } = req.body

  try {

    // Find the Seminar Org to get the necessary information
    const seminarOrg = await seminarOrganised.findById(sttpOrg_id);

    if (!seminarOrg) {
      throw new Error('Seminar org not found');
    }

    // Delete the associated file
    if (seminarOrg.uploadFundSanctionedLetter && fs.existsSync(seminarOrg.uploadFundSanctionedLetter)) {
      fs.unlinkSync(seminarOrg.uploadFundSanctionedLetter);
    }

    if (seminarOrg.uploadUtilizationCertificate && fs.existsSync(seminarOrg.uploadUtilizationCertificate)) {
      fs.unlinkSync(seminarOrg.uploadUtilizationCertificate);
    }

    if (seminarOrg.uploadBanner && fs.existsSync(seminarOrg.uploadBanner)) {
      fs.unlinkSync(seminarOrg.uploadBanner);
    }

    if (seminarOrg.uploadScheduleOfOrganizer && fs.existsSync(seminarOrg.uploadScheduleOfOrganizer)) {
      fs.unlinkSync(seminarOrg.uploadScheduleOfOrganizer);
    }

    if (seminarOrg.uploadCertificateLOA && fs.existsSync(seminarOrg.uploadCertificateLOA)) {
      fs.unlinkSync(seminarOrg.uploadCertificateLOA);
    }

    if (seminarOrg.uploadSupportingDocuments && fs.existsSync(seminarOrg.uploadSupportingDocuments)) {
      fs.unlinkSync(seminarOrg.uploadSupportingDocuments);
    }

    if (seminarOrg.uploadReport && fs.existsSync(seminarOrg.uploadReport)) {
      fs.unlinkSync(seminarOrg.uploadReport);
    }

    if (seminarOrg.uploadPhotos && fs.existsSync(seminarOrg.uploadPhotos)) {
      fs.unlinkSync(seminarOrg.uploadPhotos);
    }

    if (seminarOrg.uploadInvitationLetter && fs.existsSync(seminarOrg.uploadInvitationLetter)) {
      fs.unlinkSync(seminarOrg.uploadInvitationLetter);
    }

    if (seminarOrg.uploadCertificateLOAToSpeaker && fs.existsSync(seminarOrg.uploadCertificateLOAToSpeaker)) {
      fs.unlinkSync(seminarOrg.uploadCertificateLOAToSpeaker);
    }

    if (seminarOrg.uploadCertificateOfOrganizer && fs.existsSync(seminarOrg.uploadCertificateOfOrganizer)) {
      fs.unlinkSync(seminarOrg.uploadCertificateOfOrganizer);
    }

    if (seminarOrg.uploadLOAOfOrganizer && fs.existsSync(seminarOrg.uploadLOAOfOrganizer)) {
      fs.unlinkSync(seminarOrg.uploadLOAOfOrganizer);
    }


    // Delete the Seminar org entry from the database
    await seminarOrganised.findByIdAndDelete(seminarOrg_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

const updateSeminarOrganized = asyncHandler(async (req, res) => {

  const data = req.body

  try {

    const seminarOrg = await seminarOrganised.findById(req.body._id)

    if (!seminarOrg) {
      throw new Error("no seminarOrg found")
    }

    if (req.files.fundSanctionedLetter) {
      if (seminarOrg.uploadFundSanctionedLetter && fs.existsSync(seminarOrg.uploadFundSanctionedLetter)) {
        fs.unlinkSync(seminarOrg.uploadFundSanctionedLetter);
      }
      data.uploadFundSanctionedLetter = req.files.fundSanctionedLetter[0].path;
    }

    if (req.files.utilizationCertificate) {
      if (seminarOrg.uploadUtilizationCertificate && fs.existsSync(seminarOrg.uploadUtilizationCertificate)) {
        fs.unlinkSync(seminarOrg.uploadUtilizationCertificate);
      }
      data.uploadUtilizationCertificate = req.files.utilizationCertificate[0].path;
    }

    if (req.files.banner) {
      if (seminarOrg.uploadBanner && fs.existsSync(seminarOrg.uploadBanner)) {
        fs.unlinkSync(seminarOrg.uploadBanner);
      }
      data.uploadBanner = req.files.banner[0].path;
    }

    if (req.files.schedule) {
      if (seminarOrg.uploadScheduleOfOrganizer && fs.existsSync(seminarOrg.uploadScheduleOfOrganizer)) {
        fs.unlinkSync(seminarOrg.uploadScheduleOfOrganizer);
      }
      data.uploadScheduleOfOrganizer = req.files.schedule[0].path;
    }

    if (req.files.certificate) {
      if (seminarOrg.uploadCertificateLOA && fs.existsSync(seminarOrg.uploadCertificateLOA)) {
        fs.unlinkSync(seminarOrg.uploadCertificateLOA);
      }
      data.uploadCertificateLOA = req.files.certificate[0].path;
    }

    if (req.files.supportingDocuments) {
      if (seminarOrg.uploadSupportingDocuments && fs.existsSync(seminarOrg.uploadSupportingDocuments)) {
        fs.unlinkSync(seminarOrg.uploadSupportingDocuments);
      }
      data.uploadSupportingDocuments = req.files.supportingDocuments[0].path;
    }

    if (req.files.report) {
      if (seminarOrg.uploadReport && fs.existsSync(seminarOrg.uploadReport)) {
        fs.unlinkSync(seminarOrg.uploadReport);
      }
      data.uploadReport = req.files.report[0].path;
    }

    if (req.files.photos) {
      if (seminarOrg.uploadPhotos && fs.existsSync(seminarOrg.uploadPhotos)) {
        fs.unlinkSync(seminarOrg.uploadPhotos);
      }
      data.uploadPhotos = req.files.photos[0].path;
    }

    if (req.files.photos) {
      if (seminarOrg.uploadInvitationLetter && fs.existsSync(seminarOrg.uploadInvitationLetter)) {
        fs.unlinkSync(seminarOrg.uploadInvitationLetter);
      }
      data.uploadInvitationLetter = req.files.photos[0].path;
    }

    if (req.files.photos) {
      if (seminarOrg.uploadCertificateLOAToSpeaker && fs.existsSync(seminarOrg.uploadCertificateLOAToSpeaker)) {
        fs.unlinkSync(seminarOrg.uploadCertificateLOAToSpeaker);
      }
      data.uploadCertificateLOAToSpeaker = req.files.photos[0].path;
    }

    if (req.files.photos) {
      if (seminarOrg.uploadCertificateOfOrganizer && fs.existsSync(seminarOrg.uploadCertificateOfOrganizer)) {
        fs.unlinkSync(seminarOrg.uploadCertificateOfOrganizer);
      }
      data.uploadCertificateOfOrganizer = req.files.photos[0].path;
    }

    if (req.files.photos) {
      if (seminarOrg.uploadLOAOfOrganizer && fs.existsSync(seminarOrg.uploadLOAOfOrganizer)) {
        fs.unlinkSync(seminarOrg.uploadLOAOfOrganizer);
      }
      data.uploadLOAOfOrganizer = req.files.photos[0].path;
    }

    await seminarOrg.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

/**
 * AWARDS RECEIVED
*/

const addAwardRecieved = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add file paths to data
  const certificateURL = req.files.certificate[0].path;
  const photosURL = req.files.photos[0].path;

  data.certificate = certificateURL;
  data.photos = photosURL;

  // create new Award Received entry
  const awardRecieved = await AwardRecieved.create(data);

  // add ref id to faculty 
  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { awardRecieved: awardRecieved._id } }
  );

  res.status(200).json({
    message: "success",
  });

});


const getAwardRecievedData = asyncHandler(async (req, res) => {
  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate Award Received array to get full awards_recieved data
  await user.populate('awardRecieved')

  // Extract the populated Award Received data
  const awardRecievedData = user.awardRecieved

  // Send the response
  res.status(200).json(awardRecievedData);
});


const getAwardRecievedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Find by id
  const awardRecievedData = await AwardRecieved.findById(id)

  // Send the response
  res.status(200).json(awardRecievedData);

})


const updateAwardRecieved = asyncHandler(async (req, res) => {
  // Get required data
  const data = req.body

  try {

    // Find the Award Received to get the necessary information
    const awardRecieved = await AwardRecieved.findById(req.body._id)

    if (!awardRecieved) {
      throw new Error("Awards Received not found")
    }

    // Update the certificate in Award Received
    if (req.files.certificate) {

      if (awardRecieved.certificate && fs.existsSync(awardRecieved.certificate)) {
        fs.unlinkSync(awardRecieved.certificate);
      }

      data.certificate = req.files.certificate[0].path

    }

    // Update the photos in Award Received
    if (req.files.photos) {

      if (awardRecieved.photos && fs.existsSync(awardRecieved.photos)) {
        fs.unlinkSync(awardRecieved.photos);
      }

      data.photos = req.files.photos[0].path

    }

    await awardRecieved.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deleteAwardRecieved = asyncHandler(async (req, res) => {

  const { awards_recieved_id } = req.body
  const { email } = req.decodedData

  try {

    // Find the Award Received to get the necessary information
    const awardRecieved = await AwardRecieved.findById(awards_recieved_id);

    if (!awardRecieved) {
      throw new Error('Awards Received not found');
    }

    // Delete the associated file
    // Delete the certificate
    if (awardRecieved.certificate && fs.existsSync(awardRecieved.certificate)) {
      fs.unlinkSync(awardRecieved.certificate);
    }

    // Delete the photos
    if (awardRecieved.photos && fs.existsSync(awardRecieved.photos)) {
      fs.unlinkSync(awardRecieved.photos);
    }

    // Remove the Award Received ID from the faculty
    await Faculty.updateOne(
      { email: email },
      { $pull: { awardRecieved: awards_recieved_id } }
    );

    // Delete the Award Received entry from the database
    await AwardRecieved.findByIdAndDelete(awards_recieved_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addActivityConducted = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add file paths to data
  const certificateURL = req.files.certificate[0].path;
  const bannerURL = req.files.banner[0].path;
  const reportURL = req.files.report[0].path;
  const photosURL = req.files.photos[0].path;

  data.invitationLetter = invitationLetterURL;
  data.certificate = certificateURL;
  data.banner = bannerURL;
  data.report = reportURL;
  data.photos = photosURL;

  // create new Award Received entry
  const activityConducted = await ActivityConducted.create(data);

  // add ref id to faculty 
  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { activityConducted: activityConducted._id } }
  );

  res.status(200).json({
    message: "success",
  });

});


const getActivityConductedData = asyncHandler(async (req, res) => {
  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate Award Received array to get full awards_recieved data
  await user.populate('activityConducted')

  // Extract the populated Award Received data
  const activityConductedData = user.activityConducted

  // Send the response
  res.status(200).json(activityConductedData);
});


const getActivityConductedById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Find by id
  const activityConductedData = await ActivityConducted.findById(id)

  // Send the response
  res.status(200).json(activityConductedData);

})


const updateActivityConducted = asyncHandler(async (req, res) => {
  // Get required data
  const data = req.body
  console.log(data)
  try {
    // Find the Activity Conducted to get the necessary information
    const activityConducted = await ActivityConducted.findById(req.body._id)

    if (!activityConducted) {
      throw new Error("Activity Conducted not found")
    }

    // Update the Activity Conducted
    // Update the invitation letter in Activity Conducted
    if (req.files.invitationLetter) {
      if (activityConducted.invitationLetter && fs.existsSync(activityConducted.invitationLetter)) {
        fs.unlinkSync(activityConducted.invitationLetter);
      }
      data.invitationLetter = req.files.invitationLetter[0].path
    }

    // Update the certificate in Activity Conducted
    if (req.files.certificate) {
      if (activityConducted.certificate && fs.existsSync(activityConducted.certificate)) {
        fs.unlinkSync(activityConducted.certificate);
      }
      data.certificate = req.files.certificate[0].path
    }

    // Update the banner in Activity Conducted
    if (req.files.banner) {
      if (activityConducted.banner && fs.existsSync(activityConducted.banner)) {
        fs.unlinkSync(activityConducted.banner);
      }
      data.banner = req.files.banner[0].path
    }

    // Update the report in Activity Conducted
    if (req.files.report) {
      if (activityConducted.report && fs.existsSync(activityConducted.report)) {
        fs.unlinkSync(activityConducted.report);
      }
      data.report = req.files.report[0].path
    }

    // Update the photos in Activity Conducted
    if (req.files.photos) {
      if (activityConducted.photos && fs.existsSync(activityConducted.photos)) {
        fs.unlinkSync(activityConducted.photos);
      }
      data.photos = req.files.photos[0].path
    }
    await activityConducted.updateOne(data)

  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deleteActivityConducted = asyncHandler(async (req, res) => {
  const { activity_conducted_id } = req.body
  const { email } = req.decodedData

  try {
    // Find the Award Received to get the necessary information
    const activityConducted = await ActivityConducted.findById(activity_conducted_id);

    if (!activityConducted) {
      throw new Error('Activity Conducted not found');
    }

    // Delete the associated file
    // Delete the invitationLetter
    if (activityConducted.invitationLetter && fs.existsSync(activityConducted.invitationLetter)) {
      fs.unlinkSync(activityConducted.invitationLetter);
    }

    // Delete the certificate
    if (activityConducted.certificate && fs.existsSync(activityConducted.certificate)) {
      fs.unlinkSync(activityConducted.certificate);
    }

    // Delete the banner
    if (activityConducted.banner && fs.existsSync(activityConducted.banner)) {
      fs.unlinkSync(activityConducted.banner);
    }

    // Delete the report
    if (activityConducted.report && fs.existsSync(activityConducted.report)) {
      fs.unlinkSync(activityConducted.report);
    }

    // Delete the photos
    if (activityConducted.photos && fs.existsSync(activityConducted.photos)) {
      fs.unlinkSync(activityConducted.photos);
    }


    // Remove the Award Received ID from the faculty
    await Faculty.updateOne(
      { email: email },
      { $pull: { activityConducted: activity_conducted_id } }
    );

    // Delete the Award Received entry from the database
    await ActivityConducted.findByIdAndDelete(activity_conducted_id);

  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})


const addCourseCertification = asyncHandler(async (req, res) => {

  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add file paths to data
  const certificateURL = req.file.path;
  data.certificate = certificateURL;

  // create new Course Certification entry
  const courseCertification = await CourseCertification.create(data);

  // add ref id to faculty 
  await Faculty.findOneAndUpdate(
    { email: email },
    { $push: { courseCertification: courseCertification._id } }
  );

  res.status(200).json({
    message: "success",
  });

});


const getCourseCertificationData = asyncHandler(async (req, res) => {
  // Get required data
  const { email } = req.decodedData

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Populate Course Certification array to get full Course Certification data
  await user.populate('courseCertification')

  // Extract the populated Course Certification data
  const courseCertificationData = user.courseCertification

  // Send the response
  res.status(200).json(courseCertificationData);
});


const getCourseCertificationById = asyncHandler(async (req, res) => {

  // Get required data
  const { email } = req.decodedData
  const { id } = req.params

  // Find user
  const user = await Faculty.findOne({ email: email })

  if (!user) {
    res.status(400);
    throw new Error("User not found!")
  }

  // Find by id
  const courseCertificationData = await CourseCertification.findById(id)

  // Send the response
  res.status(200).json(courseCertificationData);

})


const updateCourseCertification = asyncHandler(async (req, res) => {
  // Get required data
  const data = req.body
  try {
    // Find the Course Certification to get the necessary information
    const courseCertification = await CourseCertification.findById(req.body._id)

    if (!courseCertification) {
      throw new Error("Course Certification not found")
    }

    // Update the certificate
    if (req.file) {
      if (courseCertification.certificate && fs.existsSync(courseCertification.certificate)) {
        fs.unlinkSync(courseCertification.certificate);
      }
      data.certificate = req.file.path
    }

    await courseCertification.updateOne(data)
  }
  catch (err) {
    res.status(400)
    throw new Error(err)
  }

  res.status(200).json({
    message: 'success'
  })

})

const deleteCourseCertification = asyncHandler(async (req, res) => {
  const { course_certification_id } = req.body
  const { email } = req.decodedData

  try {
    // Find the Course Certification to get the necessary information
    const courseCertification = await CourseCertification.findById(course_certification_id);

    if (!courseCertification) {
      throw new Error('Course Certification not found');
    }

    // Delete the certificate
    if (courseCertification.certificate && fs.existsSync(courseCertification.certificate)) {
      fs.unlinkSync(courseCertification.certificate);
    }

    // Remove the Course Certification ID from the faculty
    await Faculty.updateOne(
      { email: email },
      { $pull: { courseCertification: course_certification_id } }
    );

    // Delete the Course Certification entry from the database
    await CourseCertification.findByIdAndDelete(course_certification_id);
  }
  catch (error) {
    throw new Error(error)
  }

  res.status(200).json({
    message: 'success'
  })

})

/**
 * ACTIVITY CONDUCTED END
*/



/**
 * BULK UPLOAD LOGIC
 */

const bulkUploader = asyncHandler(async (req, res) => {

  const { formData, formType } = req.body
  const { email } = req.decodedData

  try {
    switch (formType) {

      case "journal":
        await journalBulkUploader(formData)
        break;

      case "conference":
        await conferenceBulkUploader(formData)
        break;

      case "book":
        await bookBulkUploader(formData);
        break;

      case "book-chapter":
        await bookChapterBulkUploader(formData);
        break;

      case "patent":
        await patentBulkUploader(formData);
        break;

      case "copyright":
        await copyrightBulkUploader(formData);
        break;

      case "award-honors":
        await awardsHonorsBulkUploader(formData, email);
        break;

      case "consultancy":
        await consultancyBulkUploader(formData);
        break;

      case "projects":
        await projectBulkUploader(formData);
        break;

      case "need-based-project":
        await needBasedProjectBulkUploader(formData);
        break;

      default:
        console.error("Unknown form type");
        res.status(400).json({ message: 'Unknown form type' });
    }
  }
  catch (err) {
    console.log(err.message);
    res.status(400)
    throw new Error(`${err.message}`)
  }

  res.status(200).json({
    message: 'success'
  })

})

const patentBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Format to required data. Convert date string to JS Date object
      form.filingDate = moment(form.filingDate, 'DD/MM/YYYY').toDate();
      form.grantDate = moment(form.grantDate, 'DD/MM/YYYY').toDate();
      form.inventors = form.inventors.split(',')
      form.affiliationInventors = form.affiliationInventors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');

      // Filename and path for file
      const filename = 'patent-proof-' + uuid.v7()
      const destination = 'uploads/patent';

      // Download file and set file path in form object
      form.patentCertificate = await downloadFile(form.patentCertificate, destination, filename);

      // Create new patent entry
      const patent = await Patent.create(form);

      // Attach patents to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { patent: patent._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return;
}

const copyrightBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date string to JS Date object
      form.startDate = moment(form.startDate, 'DD-MM-YYYY').toDate();
      form.endDate = moment(form.endDate, 'DD-MM-YYYY').toDate();
      form.inventors = form.inventors.split(',')
      form.affiliationInventors = form.affiliationInventors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');

      // Filename and path for file
      const filename = 'copyright-proof-' + uuid.v7();
      const destination = 'uploads/copyright';

      // Download file and set file path in form object
      form.copyrightCertificate = await downloadFile(form.copyrightCertificate, destination, filename);

      // Create new patent entry
      const copyright = await Copyright.create(form);

      // Attach copyrights to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { copyright: copyright._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

const journalBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert data tyes and formatting
      form.dateOfPublication = moment(form.dateOfPublication, 'DD/MM/YYYY').toDate();
      form.authors = form.authors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.authorsAffiliation = form.authorsAffiliation.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.indexing = form.indexing.split(',').map(item => item.trim()).filter(item => item !== '');
      form.impactFactor = Number(form.impactFactor)
      form.pageFrom = Number(form.pageFrom)
      form.pageTo = Number(form.pageTo)
      form.citationCount = Number(form.citationCount)

      // Filename and path for file
      const destination = 'uploads/journal';

      // Download file and set file path in form object
      form.paper = await downloadFile(form.paper, destination, 'journal-proof-' + uuid.v7());
      form.certificate = await downloadFile(form.certificate, destination, 'journal-proof-' + uuid.v7());

      // Create new journal entry
      const journal = await Journal.create(form);

      // Attach jourrnal to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { journal: journal._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

const conferenceBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date string to JS Date object
      form.fromDate = moment(form.fromDate, 'DD/MM/YYYY').toDate();
      form.toDate = moment(form.toDate, 'DD/MM/YYYY').toDate();
      form.publicationDate = moment(form.publicationDate, 'DD/MM/YYYY').toDate();
      form.authors = form.authors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.authorsAffiliation = form.authorsAffiliation.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.indexing = form.indexing.split(',').map(item => item.trim()).filter(item => item !== '');
      form.impactFactor = Number(form.impactFactor)
      form.yearOfPublication = Number(form.yearOfPublication)
      form.citationCount = Number(form.citationCount)

      // Filename and path for file
      const destination = 'uploads/conference';

      // Download file and set file path in form object
      form.paper = await downloadFile(form.paper, destination, 'conference-proof-' + uuid.v7());
      form.certificate = await downloadFile(form.certificate, destination, 'conference-proof-' + uuid.v7());

      // Create new journal entry
      const conference = await Conference.create(form);

      // Attach jourrnal to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { conference: conference._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

const bookBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date string to JS Date object
      form.dateOfPublication = moment(form.dateOfPublication, 'DD-MM-YYYY').toDate();
      form.authors = form.authors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.authorsAffiliation = form.authorsAffiliation.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.indexing = form.indexing.split(',').map(item => item.trim()).filter(item => item !== '');
      form.impactFactor = Number(form.impactFactor)
      form.citationCount = Number(form.citationCount)

      // Filename and path for file
      const destination = 'uploads/book';

      // Download file and set file path in form object
      form.proof = await downloadFile(form.proof, destination, 'book-proof-' + uuid.v7());

      // Create new journal entry
      const book = await Book.create(form);

      // Attach jourrnal to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { book: book._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

const bookChapterBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date string to JS Date object
      form.dateOfPublication = moment(form.dateOfPublication, 'DD-MM-YYYY').toDate();
      form.authors = form.authors.split(',').map(item => item.trim()).filter(item => item !== '');
      form.authorsAffiliation = form.authorsAffiliation.split(',').map(item => item.trim()).filter(item => item !== '');
      form.departmentInvolved = form.departmentInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.facultiesInvolved = form.facultiesInvolved.split(',').map(item => item.trim()).filter(item => item !== '');
      form.indexing = form.indexing.split(',').map(item => item.trim()).filter(item => item !== '');
      form.impactFactor = Number(form.impactFactor)
      form.citationCount = Number(form.citationCount)

      // Filename and path for file
      const destination = 'uploads/book-chapter';

      // Download file and set file path in form object
      form.proof = await downloadFile(form.proof, destination, 'book-chapter-proof-' + uuid.v7());

      // Create new journal entry
      const bookChapter = await BookChapter.create(form);

      // Attach jourrnal to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { bookChapter: bookChapter._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

/**
 * @deprecated: Depracted till a new function is wrote
 */
const projectBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date strings to JS Date objects if needed
      form.startDate = moment(form.startDate, 'DD-MM-YYYY').toDate();
      form.endDate = moment(form.endDate, 'DD-MM-YYYY').toDate();

      // Filename and path for file
      const destination = 'uploads/project';

      // Download files and set file paths in form object
      form.sanctionedOrder = await downloadFile(form.sanctionedOrder, destination, 'project-proof-' + uuid.v7());
      form.transactionProof = await downloadFile(form.transactionProof, destination, 'project-proof-' + uuid.v7());
      form.completionCertificate = await downloadFile(form.completionCertificate, destination, 'project-proof-' + uuid.v7());
      form.supportingDocuments = await downloadFile(form.supportingDocuments, destination, 'project-proof-' + uuid.v7());

      // Get all transactions and create them
      const transactions = form.transactionDetails;
      const transaction_ids = [];

      for (const entry of transactions) {
        const createdTransaction = await Transaction.create(entry);
        transaction_ids.push(createdTransaction._id);
      }

      // Change transactionDetails parameter of original form data
      form.transactionDetails = transaction_ids;

      // Create new project entry
      const project = await Project.create(form);

      // Attach project entry to involved faculties
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { projects: project._id } }
        );
      }
    }
  } catch (err) {
    throw err;
  }

  return;

}

/**
 * @deprecated: Depracted till a new function is wrote
 */
const needBasedProjectBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date string to JS Date object
      form.startDate = moment(form.startDate, 'DD-MM-YYYY').toDate();
      form.endDate = moment(form.endDate, 'DD-MM-YYYY').toDate();

      // Filename and path for file
      const destination = 'uploads/need-based-projects';

      // Download file and set file path in form object
      form.sanctionedDocuments = await downloadFile(form.sanctionedDocuments, destination, 'need-based-project-proof-' + uuid.v7());
      form.projectReport = await downloadFile(form.projectReport, destination, 'need-based-project-proof-' + uuid.v7());
      form.completionLetter = await downloadFile(form.completionLetter, destination, 'need-based-project-proof-' + uuid.v7());
      form.visitDocuments = await downloadFile(form.visitDocuments, destination, 'need-based-project-proof-' + uuid.v7());

      // Create new journal entry
      const needBasedProject = await NeedBasedProject.create(form);

      // Attach jourrnal to users
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { needBasedProjects: needBasedProject._id } }
        );
      }

    }
  }
  catch (err) {
    throw err
  }

  return
}

/**
 * @deprecated: Depracted till a new function is wrote
 */
const consultancyBulkUploader = async (formData) => {

  try {
    for (let form of formData) {

      // Convert date strings to JS Date objects if needed
      form.startDate = moment(form.startDate, 'DD-MM-YYYY').toDate();
      form.endDate = moment(form.endDate, 'DD-MM-YYYY').toDate();

      // Filename and path for file
      const destination = 'uploads/consultancy';

      // Download files and set file paths in form object
      form.sanctionedOrder = await downloadFile(form.sanctionedOrder, destination, 'consultancy-proof-' + uuid.v7());
      form.transactionProof = await downloadFile(form.transactionProof, destination, 'consultancy-proof-' + uuid.v7());
      form.completionCertificate = await downloadFile(form.completionCertificate, destination, 'consultancy-proof-' + uuid.v7());
      form.supportingDocuments = await downloadFile(form.supportingDocuments, destination, 'consultancy-proof-' + uuid.v7());

      // Get all transactions and create them
      const transactions = form.transactionDetails;
      const transaction_ids = [];

      for (const entry of transactions) {
        const createdTransaction = await Transaction.create(entry);
        transaction_ids.push(createdTransaction._id);
      }

      // Change transactionDetails parameter of original form data
      form.transactionDetails = transaction_ids;

      // Create new consultancy entry
      const consultancy = await Consultancy.create(form);

      // Attach consultancy entry to involved faculties
      for (const email of form.facultiesInvolved) {
        await Faculty.findOneAndUpdate(
          { email: email },
          { $push: { consultancy: consultancy._id } }
        );
      }
    }
  } catch (err) {
    throw err;
  }

  return;
}

const awardsHonorsBulkUploader = async (formData, email) => {

  try {

    const user = await Faculty.findOne({ email: email })

    for (let form of formData) {

      form.year = Number(form.year)

      // Filename and path for file
      const destination = 'uploads/award-honors';

      // Download file and set file path in form object
      form.proof = await downloadFile(form.proof, destination, 'award-honors-' + uuid.v7());

      // create book chapter entry
      const awardHonors = await AwardHonors.create(form);

      // add ref id to faculty 
      user.awardsHonors.push(awardHonors._id)

    }

    await user.save()
  }
  catch (err) {
    throw err
  }

  return
}


// Function to check if the link is a Google Drive link
function isGoogleDriveLink(url) {
  return url.includes('drive.google.com');
}

// Function to extract the file ID from the shared Google Drive link
function extractFileId(url) {
  const match = url.match(/\/d\/(.*?)\//);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('Invalid Google Drive URL');
  }
}

// Function to generate the direct download link for Google Drive
function generateGoogleDriveDownloadLink(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Function to download the file using the appropriate link
async function downloadFile(link, destination, filename) {

  let completeFileName

  try {
    let downloadUrl = link;

    if (!validator.isURL(link)) {
      throw new Error("Invalid URL found");
    }

    // Check if the link is a Google Drive link
    if (isGoogleDriveLink(link)) {
      const fileId = extractFileId(link);
      downloadUrl = generateGoogleDriveDownloadLink(fileId);
    }

    // Get the file extension from the URL or set a default extension
    completeFileName = `${filename}.pdf`;

    // Download the file and save with the specified name and extension
    await download(downloadUrl, destination, {
      filename: completeFileName,
    });

    console.log(`Download completed: ${completeFileName}`);

  } catch (err) {
    console.error(`Error downloading file: ${err.message}`);
    throw err;
  }

  return path.join(destination, completeFileName);
}

module.exports = {
  // Add operations
  addProfile,
  addExperience,
  addResearchProfile,
  addQualification,
  addPatents,
  addCopyright,
  addBook,
  addJournal,
  addConference,
  addBookChapter,
  addNeedBasedProject,
  addAwardHonors,
  addConsultancy,
  addProject,
  addAwardRecieved,
  addActivityConducted,
  addCourseCertification,
  addSttpConducted,
  addSttpAttended,
  addSttpOrganized,
  addSeminarAttended,
  addSeminarConducted,
  addSeminarOrganized,

  // Get operations
  getProfileData,
  getExperienceData,
  getResearchProfileData,
  getQualificationData,
  getPatentData,
  getCopyrightData,
  getBookData,
  getJournalData,
  getConferenceData,
  getBookChapterData,
  getNeedBasedProjectData,
  getAwardHonorsData,
  getConsultancyData,
  getProjectsData,
  getAwardRecievedData,
  getActivityConductedData,
  getCourseCertificationData,
  getSttpConductedData,
  getSttpAttendedData,
  getSttpOrganizedData,
  getSeminarAttendedData,
  getSeminarConductedData,
  getSeminarOrganizedData,

  // Get by ID operations
  getPatentById,
  getCopyrightById,
  getJournalById,
  getConferenceById,
  getBookById,
  getBookChapterById,
  getAwardHonorsById,
  getNeedBasedProjectById,
  getProjectById,
  getConsultancyById,
  getAwardRecievedById,
  getActivityConductedById,
  getCourseCertificationById,
  getSttpConductedById,
  getSttpAttendedById,
  getSttpOrganizedById,
  getSeminarAttendedById,
  getSeminarConductedById,
  getSeminarOrganizedById,

  // Update operations
  updateProfile,
  updateExperience,
  updateResearchProfile,
  updateQualification,
  updatePatent,
  updateCopyright,
  updateJournal,
  updateConference,
  updateBook,
  updateBookChapter,
  updateAwardsHonors,
  updateAwardRecieved,
  updateActivityConducted,
  updateCourseCertification,
  updateSttpConducted,
  updateSttpAttended,
  updateSttpOrganized,
  updateSeminarAttended,
  updateSeminarConducted,
  updateSeminarOrganized,

  // Delete operations
  deletePatent,
  deleteCopyright,
  deleteJournal,
  deleteConference,
  deleteBook,
  deleteBookChapter,
  deleteAwardsHonors,
  deleteProject,
  deleteNeedBasedProject,
  deleteConsultancy,
  deleteAwardRecieved,
  deleteActivityConducted,
  deleteCourseCertification,
  deleteSttpConducted,
  deleteSttpAttended,
  deleteSttpOrganized,
  deleteSeminarAttended,
  deleteSeminarConducted,
  deleteSeminarOrganized,

  // Other operations
  profileImageUpdate,
  bulkUploader,
};
