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
const fs = require('fs');
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


const addExperience = async (req, res) => {
  //get required data
  const { email } = req.decodedData;

  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  // add xperience json in array
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


const addConference = asyncHandler(async (req, res) => {

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
  const paperURL = req.files.paper[0].path;
  const certificateURL = req.files.certificate[0].path;


  // attach file path in data
  data.paper = paperURL;
  data.certificate = certificateURL;


  // create conference entry
  const conference = await Conference.create(data);

  // attach entry to involved faculties
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


const addConsultancy = asyncHandler(async (req, res) => {

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
  const sanctionedOrderURL = req.files.sanctionedOrder[0].path
  const transactionProofURL = req.files.transactionProof[0].path
  const completionCertificateURL = req.files.completionCertificate[0].path
  const supportingDocumentsURL = req.files.supportingDocuments[0].path

  // attach file path to data

  data.sanctionedOrder = sanctionedOrderURL
  data.transactionProof = transactionProofURL
  data.completionCertificate = completionCertificateURL
  data.supportingDocuments = supportingDocumentsURL


  // get all transactions
  const transactions = data.transactionDetails
  const transaction_ids = []

  for (const entry of transactions) {

    const createdTransaction = await Transaction.create(entry)
    transaction_ids.push(createdTransaction._id)

  }

  // change transactionDetails parameter of orginal data
  data.transactionDetails = transaction_ids

  // create consultancy entry
  const consultancy = await Consultancy.create(data);

  // attach entry to involved faculties
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


const addProject = asyncHandler(async (req, res) => {

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
  const sanctionedOrderURL = req.files.sanctionedOrder[0].path
  const transactionProofURL = req.files.transactionProof[0].path
  const completionCertificateURL = req.files.completionCertificate[0].path
  const supportingDocumentsURL = req.files.supportingDocuments[0].path

  // attach file path to data

  data.sanctionedOrder = sanctionedOrderURL
  data.transactionProof = transactionProofURL
  data.completionCertificate = completionCertificateURL
  data.supportingDocuments = supportingDocumentsURL


  // get all transactions
  const transactions = data.transactionDetails
  const transaction_ids = []

  for (const entry of transactions) {

    const createdTransaction = await Transaction.create(entry)
    transaction_ids.push(createdTransaction._id)

  }

  // change transactionDetails parameter of orginal data
  data.transactionDetails = transaction_ids

  // create project entry
  const project = await Project.create(data);

  // attach entry to involved faculties
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


module.exports = {
  addProfile,
  getProfileData,
  addExperience,
  getExperienceData,
  addResearchProfile,
  getResearchProfileData,
  addPatents,
  getPatentData,
  addCopyright,
  getCopyrightData,
  addBook,
  getBookData,
  addJournal,
  getJournalData,
  addConference,
  getConferenceData,
  addBookChapter,
  getBookChapterData,
  addNeedBasedProject,
  getNeedBasedProjectData,
  addAwardHonors,
  getAwardHonorsData,
  addConsultancy,
  getConsultancyData,
  addProject,
  getProjectsData,
  profileImageUpdate,
};
