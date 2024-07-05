import { store } from '@/app/store';
import { logout } from '@/features/user/userSlice';

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