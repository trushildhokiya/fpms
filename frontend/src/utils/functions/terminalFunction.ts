import { store } from '@/app/store';
import { logout } from '@/features/user/userSlice';
import axios from 'axios';

const suggestion: string[] = [
    "Have you completed setting up your profile 🤔",
    "👉use re-init command to refresh your profile status.",
    "Have you filled all your data onto software🤔? ",
    "Have you tried using bulk upload feature 😎",
    "Pressing ctrl d on forms opens up navigation in forms 😱",
]
const terminalHandler: Function = (command: string) => {
    switch (command) {
        case 'suggestion':
            return suggestion[Math.floor(Math.random() * 5)]

        case 'open-tab':
            window.open("https://www.google.com", '_blank')?.focus()
            return "Opening new tab..."

        case 'patent':
            window.location.href = "/common/forms/patent"
            return "Opening patent tab..."

        case 'my-patent':
            window.location.href = "/common/display/patent"
            return "Opening my patents..."

        case 'copyright':
            window.location.href = "/common/forms/copyright"
            return "Opening copyright tab..."

        case 'my-copyright':
            window.location.href = "/common/display/copyright"
            return "Opening my copyrights..."

        case 'journal':
            window.location.href = "/common/forms/journal"
            return "Opening journal tab..."

        case 'my-journal':
            window.location.href = "/common/display/journal"
            return "Opening my journals..."

        case 'conference':
            window.location.href = "/common/forms/conference"
            return "Opening conference tab..."

        case 'my-conference':
            window.location.href = "/common/display/conference"
            return "Opening my conferences..."

        case 'book':
            window.location.href = "/common/forms/book"
            return "Opening book tab..."

        case 'my-book':
            window.location.href = "/common/display/book"
            return "Opening my books..."

        case 'book-chapter':
            window.location.href = "/common/forms/book-chapter"
            return "Opening book chapter tab..."

        case 'my-book-chapter':
            window.location.href = "/common/display/book-chapter"
            return "Opening my book chapters..."

        case 'nbp':
            window.location.href = "/common/forms/need-based-projects"
            return "Opening need based projects tab..."

        case 'my-nbp':
            window.location.href = "/common/display/need-based-projects"
            return "Opening my need based projects..."

        case 'awards-honors':
            window.location.href = "/common/forms/awards-honors"
            return "Opening awards honors tab..."

        case 'my-awards-honors':
            window.location.href = "/common/display/awards-honors"
            return "Opening my awards honors..."

        case 'projects':
            window.location.href = "/common/forms/projects"
            return "Opening projects tab..."

        case 'my-projects':
            window.location.href = "/common/display/projects"
            return "Opening my projects..."

        case 'consultancy':
            window.location.href = "/common/forms/consultancy"
            return "Opening consultancy tab..."

        case 'my-consultancy':
            window.location.href = "/common/display/consultancy"
            return "Opening my consultancy..."

        case 're-init':
            axios.put('/faculty/update-tags')
                .then((res) => {
                    return res.data.message
                })
                .catch((err) => {
                    return err.message
                })
            return "relogin for updates"

        case 'logout':
            localStorage.removeItem('token')
            store.dispatch(logout())
            window.location.href = "/auth/login"
            return "Logging Out ..."

        default:
            return `command ${command} not found :(`
    }
}


export default terminalHandler