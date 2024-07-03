import { store } from '@/app/store';
import { logout } from '@/features/user/userSlice';


const terminalHandler: Function = (command: string) => {
    switch (command) {
        case 'suggestion':
            return "Have you completed filling your profile data?"

        case 'open-tab':
            window.open("https://www.google.com", '_blank')?.focus()
            return "Opening new tab..."

        case 'patent':
            window.location.href = "/common/forms/patent"
            return "Opening patent tab..."

        case 'my-patent':
            window.location.href = "/common/display/patent"
            return "Opening my patents..."

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