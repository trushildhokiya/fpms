const asyncHandler = require('express-async-handler')
const Faculty = require('../models/faculty')

const getDashboardData = asyncHandler(async (req, res) => {
    // Get required data
    const { email } = req.decodedData;

    // Find user
    const user = await Faculty.findOne({ email }).populate(
        'patent copyright projects journal conference book bookChapter needBasedProjects consultancy'
    );

    if (!user) {
        res.status(400);
        throw new Error('User not found!');
    }

    // Calculate counts for each category
    const patentCount = user.patent.length;
    const copyrightCount = user.copyright.length;
    const publicationCount =
        user.journal.length + user.conference.length + user.book.length + user.bookChapter.length;
    const projectCount = user.needBasedProjects.length + user.projects.length;
    const consultancyCount = user.consultancy.length;

    // Prepare pie chart data
    const pieData = [
        {
            id: 'patent',
            value: patentCount,
        },
        {
            id: 'publication',
            value: publicationCount,
        },
        {
            id: 'project',
            value: projectCount,
        },
        {
            id: 'consultancy',
            value: consultancyCount,
        },
        {
            id: 'copyright',
            value: copyrightCount,
        },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const pastYearPerformanceData = [
        {
            id: 'Publication',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(user, 'publication', year),
            })),
        },
        {
            id: 'Project',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(user, 'project', year),
            })),
        },
        {
            id: 'Patent',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(user, 'patent', year),
            })),
        },
        {
            id: 'Consultancy',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(user, 'consultancy', year),
            })),
        },
        {
            id: 'Copyright',
            data: years.map((year) => ({
                x: year,
                y: calculateYearlyCount(user, 'copyright', year),
            })),
        },
    ];

    res.status(200).json({
        pie: pieData,
        pastYearPerformanceData: pastYearPerformanceData,
    });

});

// Helper function to calculate yearly counts for each category
function calculateYearlyCount(user, category, year) {

    switch (category) {
        case 'publication':
            return (
                user.journal.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length +
                user.conference.filter((item) => new Date(item.fromDate).getFullYear() === year).length +
                user.book.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length +
                user.bookChapter.filter((item) => new Date(item.dateOfPublication).getFullYear() === year).length
            );

        case 'project':
            return (
                user.needBasedProjects.filter((item) => new Date(item.startDate).getFullYear() === year)
                    .length +
                user.projects.filter((item) => new Date(item.startDate).getFullYear() === year).length
            );

        case 'patent':
            return user.patent.filter((item) => new Date(item.filingDate).getFullYear() === year).length;

        case 'consultancy':
            return user.consultancy.filter((item) => new Date(item.startDate).getFullYear() === year).length;

        case 'copyright':
            return user.copyright.filter((item) => new Date(item.startDate).getFullYear() === year).length;

        default:
            return 0;
    }
}

/**
 * UPDATE TAGS
 */

const tagUpdater = asyncHandler(async (req, res) => {
    const { email } = req.decodedData;

    const user = await Faculty.findOne({ email: email });

    if (!user) {
        res.status(400);
        throw new Error('Faculty not found');
    }

    const isProfileComplete = user.profile && user.researchProfile && user.experience.length > 0 && user.qualification.length >0;

    if (isProfileComplete) {
        const incompleteIndex = user.tags.indexOf('incomplete profile');
        if (incompleteIndex !== -1) {
            user.tags.splice(incompleteIndex, 1); // Remove 'incomplete profile' tag if it exists
        }
        if (!user.tags.includes('complete profile')) {
            user.tags.push('complete profile');
        }
    } else {
        const completeIndex = user.tags.indexOf('complete profile');
        if (completeIndex !== -1) {
            user.tags.splice(completeIndex, 1); // Remove 'complete profile' tag if it exists
        }
        if (!user.tags.includes('incomplete profile')) {
            user.tags.push('incomplete profile');
        }
    }

    await user.save();

    res.status(200).json({
        message: 'update success',
        tags: user.tags
    });
});

module.exports = {
    getDashboardData,
    tagUpdater
}