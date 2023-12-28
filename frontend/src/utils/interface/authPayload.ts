export  interface authPayloadInterface {
    email: string,
    role: string,
    profileImage: string ,
    institute: string| null,
    department: string|null,
    tags: [string] | null
}