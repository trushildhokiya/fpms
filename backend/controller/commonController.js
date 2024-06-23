const asyncHandler = require("express-async-handler");
const Faculty = require("../models/faculty");
const Patent = require("../models/patent");
const Book = require("../models/book");
const Journal = require("../models/journal");
const Conference = require("../models/conference");
const Copyright = require("../models/copyright");
const BookChapter = require("../models/book-chapter");

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

  // Populate patents array to get full patent data
  await user.populate('copyright')

  // Extract the populated patents data
  const copyrightData = user.copyright

  // Send the response
  res.status(200).json(copyrightData);

});

/*
ADD BOOK
*/

const addBook = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  // console.log(data);
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  //if you have single file input
  const certificateURL = req.file.path;
  data.proof = certificateURL;
  const book = await Book.create(data);

  for (const email of data.facultiesInvolved) {
    const faculty = await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { book: book._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
});

/*
ADD JOURNAL
*/

const addJournal = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;
  // console.log(data);
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  //if you have multiple file inputs
  const paperURL = req.files.paper[0].path;
  const certificateURL = req.files.certificate[0].path;

  data.paper = paperURL;
  data.certificate = certificateURL;
  const journal = await Journal.create(data);
  // console.log(data);

  for (const email of data.facultiesInvolved) {
    const faculty = await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { journal: journal._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
});




/*
ADD MAJOR/MINOR
*/

/*
ADD NEED BASED
*/

/*
ADD AWARDS & HONORS
*/

/*
ADD CONSULTANCY
*/

/*
ADD CONFERENCE
*/
const addConference = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;
  // console.log(data);
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  //if you have multiple file inputs
  const paperURL = req.files.paper[0].path;
  const certificateURL = req.files.certificate[0].path;

  data.paper = paperURL;
  data.certificate = certificateURL;
  const conference = await Conference.create(data);
  // console.log(data);

  for (const email of data.facultiesInvolved) {
    const faculty = await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { conference: conference._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
});

/*
ADD BOOK CHAPTER
*/
const addBookChapter = asyncHandler(async (req, res) => {
  //get required data
  const data = req.body;
  const { email } = req.decodedData;

  console.log(data);
  // find user
  const user = await Faculty.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  //if you have single file input
  const certificateURL = req.file.path;
  data.proof = certificateURL;
  const bookChapter = await BookChapter.create(data);

  for (const email of data.facultiesInvolved) {
    const faculty = await Faculty.findOneAndUpdate(
      { email: email },
      { $push: { bookChapter: bookChapter._id } }
    );
  }

  res.status(200).json({
    message: "success",
  });
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
  addJournal,
  addConference,
  addBookChapter,
};
