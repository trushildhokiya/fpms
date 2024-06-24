import HeadNavbar from "@/components/navbar/HeadNavbar"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select"
import { useDropzone } from "react-dropzone"

// Define the type for form options
interface FormOption {
    value: string;
    label: string;
}

// Define the type for form types
interface FormType {
    label: string;
    options: FormOption[];
}

// Define the form types array with proper types
const formTypes: FormType[] = [
    {
        label: 'Research',
        options: [
            { value: 'patent', label: 'Patent' },
            { value: 'copyright', label: 'Copyright' },
        ],
    },
    {
        label: 'Publications',
        options: [
            { value: 'journal', label: 'Journal' },
            { value: 'conference', label: 'Conference' },
            { value: 'book', label: 'Book' },
            { value: 'book-chapter', label: 'Book Chapter' },
        ],
    },
    {
        label: 'Projects',
        options: [
            { value: 'project', label: 'Major/Minor' },
            { value: 'need-based-proect', label: 'Need Based' },
            { value: 'awards-honors', label: 'Awards/Honors' },
        ],
    },
    {
        label: 'Achievements',
        options: [
            { value: 'sttp-condcuted', label: 'STTP/FDP Conducted' },
            { value: 'sttp-attended', label: 'STTP/FDP Attended' },
            { value: 'sttp-organised', label: 'STTP/FDP Organised' },
            { value: 'seminars-conducted', label: 'Seminars Conducted' },
            { value: 'seminars-attended', label: 'Seminars Attended' },
            { value: 'seminars-organised', label: 'Seminars Organised' },
            { value: 'course-certificate', label: 'Course Certification' },
            { value: 'awards-recieved', label: 'Awards and Recognitions' },
            { value: 'activity-conducted', label: 'Activity Conducted' },
        ],
    },
    {
        label: 'Profile Details',
        options: [
            { value: 'profile', label: 'Basic' },
            { value: 'experience', label: 'Experience' },
            { value: 'research-profile', label: 'Research Profile' },
        ],
    },
]

// Define the formTypeData object
const formTypeData: Record<string, object> = {
    patent: { key: "patent", description: "Patent form data" },
    copyright: { key: "copyright", description: "Copyright form data" },
    journal: { key: "journal", description: "Journal form data" },
    conference: { key: "conference", description: "Conference form data" },
    book: { key: "book", description: "Book form data" },
    bookChapter: { key: "book-chapter", description: "Book Chapter form data" },
    majorMinor: { key: "project", description: "Major/Minor Projects form data" },
    needBased: { key: "need-based-project", description: "Need Based Projects form data" },
    awardsHonors: { key: "awards-honors", description: "Awards/Honors Projects form data" },
    sttpConducted: { key: "sttp-conducted", description: "STTP/FDP Conducted form data" },
    sttpAttended: { key: "sttp-attended", description: "STTP/FDP Attended form data" },
    sttpOrganized: { key: "sttp-organized", description: "STTP/FDP Organized form data" },
    seminarsConducted: { key: "seminars-conducted", description: "Seminars Conducted form data" },
    seminarsAttended: { key: "seminars-attended", description: "Seminars Attended form data" },
    seminarsOrganized: { key: "seminars-organized", description: "Seminars Organized form data" },
    courseCertification: { key: "course-certificate", description: "Course Certification form data" },
    awardsRecognitions: { key: "awards-recieved", description: "Awards and Recognitions form data" },
    activityConducted: { key: "activity-conducted", description: "Activity Conducted form data" },
    basic: { key: "profile", description: "Basic Profile Details form data" },
    experience: { key: "experience", description: "Experience form data" },
    researchProfile: { key: "research-profile", description: "Research Profile form data" },
}

const Upload = () => {
    const [selectedFormType, setSelectedFormType] = useState<string | null>(null)
    const [files, setFiles] = useState<File[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.json']
        },
        multiple: true,
    })

    const handleFormTypeChange = (value: string) => {
        setSelectedFormType(value)
    }

    const handleDownloadJson = () => {
        if (selectedFormType) {
            const jsonData = formTypeData[selectedFormType]
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${selectedFormType}.json`
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    return (
        <div>
            <HeadNavbar />
            <div className="container mx-auto mt-10 p-4">
                <div className="flex justify-between items-center mb-8">
                    <Select onValueChange={handleFormTypeChange}>
                        <SelectTrigger className="w-72 h-12 text-lg">
                            <SelectValue placeholder="Select Form Type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto text-lg">
                            {formTypes.map((group, groupIndex) => (
                                <div key={group.label}>
                                    <SelectGroup>
                                        <SelectLabel className="text-lg">{group.label}</SelectLabel>
                                        {group.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="text-lg">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                    {groupIndex < formTypes.length - 1 && <SelectSeparator />}
                                </div>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleDownloadJson} disabled={!selectedFormType} className="h-12 text-lg">Download JSON</Button>
                </div>
                <div
                    {...getRootProps({
                        className: "dropzone border-dashed border-4 border-gray-400 p-16 rounded-lg flex flex-col items-center justify-center text-gray-600 hover:border-gray-500 hover:bg-gray-50 transition duration-150",
                    })}
                    style={{ minHeight: "300px" }}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-xl">Drop the files here...</p>
                    ) : (
                        <p className="text-xl">Drag 'n' drop some files here, or click to select files</p>
                    )}
                    <p className="text-lg text-red-500 mt-2">Only JSON files are allowed</p>
                </div>
                {files.length === 0 && (
                    <p className="mt-4 text-xl text-red-500">No file selected</p>
                )}
                {files.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Selected files:</h2>
                        <ul className="list-disc pl-8 text-lg">
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Upload
