const asyncHandler = require('express-async-handler');
const Faculty = require('../models/faculty')
const Patent = require('../models/patent')
const Copyright = require('../models/copyright')
const Journal = require('../models/journal')
const Conference = require('../models/conference')
const Book = require('../models/book')
const Projects = require('../models/projects')
const Consultancy = require('../models/consultancy')
const BookChapter = require('../models/book-chapter')
const NeedBasedProjects = require('../models/need-based-projects')
const Notification = require('../models/notification')
const nodemailer = require('nodemailer');
const consultancy = require('../models/consultancy');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_KEY
    }
});



/**
 * CREATE NOTIFICATION 
 */

const createNotification = asyncHandler(async (req, res) => {

    const { title, description, imageUrl, referenceUrl, department } = req.body

    const notification = await Notification.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        referenceUrl: referenceUrl,
        department: department
    })

    if (!notification) {
        //Error
        res.status(500)
        throw new Error('Internal Server Error')
    }

    res.status(200).json({
        status: 'Success'
    })

})

/**
 * GET NOTIFICATIONS
 */

const getNotifications = asyncHandler(async (req, res) => {

    const { email } = req.headers

    const user = await Faculty.findOne({ email: email })

    if (!user) {
        //Error
        res.status(401)
        throw new Error('User not found')
    }

    const department = user.department

    const notification = await Notification.find({ department: department })

    res.status(200).json(notification)

})

/**
 * GET FACULTIES LIST
 */
const getFacultiesList = asyncHandler(async (req, res) => {

    const { email } = req.headers

    const user = await Faculty.findOne({ email: email })


    if (!user) {
        //Error
        res.status(401)
        throw new Error('User not found')
    }

    const department = user.department

    const faculties = await Faculty.find({ department: department })
        .select('profileImage email department tags')
        .exec();

    // formatting data

    const formattedFaculties = faculties.map((faculty) => {

        const formattedFaculty = faculty.toObject(); // convert to plain js object

        if (formattedFaculty.tags.includes('inactive')) {

            formattedFaculty.verified = false;
        }
        else {

            formattedFaculty.verified = true;
        }

        return formattedFaculty;
    });

    res.status(200).json(formattedFaculties);
})


/**
 * TOGGLE APPROVAL
 */

const toggleFacultyApproval = asyncHandler(async (req, res) => {

    const { isCoordinator, email } = req.body

    const user = await Faculty.findOne({ email: email })
    let message


    if (!user) {
        //Error
        res.status(400)
        throw new Error('User not found')
    }

    const verified = user.tags.includes('active')

    if (verified) {
        // If user is currently verified, remove 'active' and add 'inactive'
        const index = user.tags.indexOf('active')
        user.tags.set(index, 'inactive')

        message = 'Your account has been deactivated by your Department Head. Please contact your department head in case of any queries. We are sad to see you leave. Rest assured your data is safe with us. '

    } else {
        // If user is currently not verified, remove 'inactive' and add 'active'
        const index = user.tags.indexOf('inactive')
        user.tags.set(index, 'active')

        message = '<strong> Congratulations ! </strong> You are now approved by your department Head for using the FPMS software. Login with your credentials and get ready for exciting journey ahead.<br /> Best regards <br /> <strong> TEAM FPMS </strong>'

        if (!isCoordinator) {
            const coordinatorIndex = user.tags.indexOf('research coordinator');
            if (coordinatorIndex !== -1) {
                user.tags.splice(coordinatorIndex, 1); // Remove 'research coordinator' tag if it exists
            }
        }

        if (isCoordinator) {

            if (user.tags.indexOf('research coordinator') === -1) {
                user.tags.push('research coordinator')
            }

            message = '<strong> Congratulations ! </strong> You are now approved by your department Head for using the FPMS software and have been appointed as <strong> Research and Development Coordinator </strong> . Login with your credentials and get ready for exciting journey ahead.<br /> Best regards <br /> <strong> TEAM FPMS </strong>'
        }

    }

    await user.save()

    const mailOptions = {

        from: '"FPMS SERVER 💀" <phantomcoder325@gmail.com>',
        to: email,
        subject: "ACCOUNT CREDENTIALS",
        html: `
                    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                     <div style="background-color: #ef4444; color: #fff; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 4px;">
                         🚀 ACCOUNT UPDATE : FPMS
                    </div>
                    <div style="margin-top: 20px;">
                         <p> ${message} <p>
                    </div>
                    <div style="margin-top: 20px; text-align: center; color: #888;">
                        &copy; FPMS. All rights reserved. ${new Date().getFullYear()}
                    </div>
                    </div>
    
            `,
    }


    // transporter.sendMail(mailOptions, (err, info) => {
    //     if (err) {
    //         res.status(500)
    //         throw new Error('Internal Server Error in mailer!')
    //     }
    // });


    res.status(200).json({
        status: 'Success',
    })
})

/**
 * GET PATENT DATA
 */
const getPatentData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental patent data
    const patentData = await Patent.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(patentData);
});


/**
 * GET COPYRIGHT DATA
 */
const getCopyrightData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental copyright data
    const copyrightData = await Copyright.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(copyrightData);
});


/**
 * GET JOURNAL DATA
 */
const getJournalData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental journal data
    const journalData = await Journal.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(journalData);
});

/**
 * GET CONFERENCE DATA
 */
const getConferenceData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental conference data
    const conferenceData = await Conference.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(conferenceData);
});

/**
 * GET BOOK DATA
 */
const getBookData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental book data
    const bookData = await Book.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(bookData);
});


/**
 * GET BOOK CHAPTER DATA
 */
const getBookChapterData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental book chapter data
    const bookChapterData = await BookChapter.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(bookChapterData);
});

/**
 * GET NEED  BASED PROJECT DATA
 */
const getNeedBasedProjectsData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental nbd data
    const needBasedProjectsData = await NeedBasedProjects.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    res.status(200).json(needBasedProjectsData);
});

/**
 * GET AWARDS HONORS DATA
 */
const getAwardsHonorsData = asyncHandler(async (req, res) => {
    // Get department from the decoded token data
    const { department } = req.decodedData;

    // Find all faculty members in the department and populate their awardsHonors
    const departmentFacultyData = await Faculty.find({ department }).populate('awardsHonors');

    // Extract and flatten the awardsHonors data
    const awardsHonorsData = departmentFacultyData
        .map(faculty => faculty.awardsHonors)
        .flat();

    console.log(awardsHonorsData);

    res.status(200).json(awardsHonorsData);
});

/**
 * GET MAJOR MINOR PROJECTS DATA
 */
const getProjectsData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental projects data
    const projectsData = await Projects.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    }).populate('transactionDetails');

    res.status(200).json(projectsData);
});

/**
 * GET CONSULTANCY DATA
 */
const getConsultancyData = asyncHandler(async (req, res) => {

    // get department
    const { department } = req.decodedData;

    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get departmental consultancy data
    const consultancyData = await Consultancy.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    }).populate('transactionDetails');

    res.status(200).json(consultancyData);
});


const getDashboardData = asyncHandler(async (req, res) => {
    // Get department from decoded data
    const { department } = req.decodedData;


    // construct case insensitive regex
    const regex = new RegExp(department, 'i');

    // get Data
    const departmentPatents = await Patent.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    })

    const departmentConsultancys = await Consultancy.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    })

    const departmentCopyrights = await Copyright.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    })

    const departmentJournals = await Journal.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    const departmentConferences = await Conference.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    const departmentBooks = await Book.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    const departmentBookChapters = await BookChapter.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    const departmentNeedBasedProjects = await NeedBasedProjects.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });

    const departmentProjects = await Projects.find({
        departmentInvolved: {
            $elemMatch: {
                $regex: regex
            }
        }
    });


    // Prepare pie chart data
    const pieData = [
        { id: 'patent', value: departmentPatents.length },
        { id: 'publication', value: departmentJournals.length + departmentConferences.length + departmentBooks.length + departmentBookChapters.length },
        { id: 'project', value: departmentNeedBasedProjects.length + departmentProjects.length },
        { id: 'consultancy', value: departmentConsultancys.length },
        { id: 'copyright', value: departmentCopyrights.length },
    ];

    // club data to data component
    let processingData = {
        patent: departmentPatents,
        copyright: departmentCopyrights,
        project: departmentProjects,
        needBasedProjects: departmentNeedBasedProjects,
        journal: departmentJournals,
        conference: departmentConferences,
        bookChapter: departmentBookChapters,
        book: departmentBooks,
        consultancy: departmentConsultancys
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const pastYearPerformanceData = [
        {
            id: 'Publication',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(processingData, 'publication', year),
            })),
        },
        {
            id: 'Project',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(processingData, 'project', year),
            })),
        },
        {
            id: 'Patent',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(processingData, 'patent', year),
            })),
        },
        {
            id: 'Consultancy',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(processingData, 'consultancy', year),
            })),
        },
        {
            id: 'Copyright',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(processingData, 'copyright', year),
            })),
        },
    ];

    res.status(200).json({
        pie: pieData,
        pastYearPerformanceData: pastYearPerformanceData,
    });

});

// Helper function to calculate yearly counts for each category
function calculateYearlyCount(data, category, year) {
    switch (category) {
        case 'publication':
            return (
                data.journal.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length +
                data.conference.filter((item) => new Date(item.fromDate).getFullYear() === year).length +
                data.book.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length +
                data.bookChapter.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length
            );
        case 'project':
            return (
                data.needBasedProjects.filter((item) => new Date(item.startDate).getFullYear() === year)
                    .length +
                data.project.filter((item) => new Date(item.startDate).getFullYear() === year).length
            );

        case 'patent':
            return data.patent.filter((item) => new Date(item.filingDate).getFullYear() === year).length;

        case 'consultancy':
            return data.consultancy.filter((item) => new Date(item.startDate).getFullYear() === year).length;


        case 'copyright':
            return data.copyright.filter((item) => new Date(item.startDate).getFullYear() === year).length;

        default:
            return 0;
    }
}


module.exports = {
    createNotification,
    getNotifications,
    getFacultiesList,
    toggleFacultyApproval,
    getPatentData,
    getCopyrightData,
    getJournalData,
    getConferenceData,
    getBookData,
    getBookChapterData,
    getNeedBasedProjectsData,
    getAwardsHonorsData,
    getProjectsData,
    getConsultancyData,
    getDashboardData
}