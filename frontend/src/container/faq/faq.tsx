import Footer from "@/components/footer/footer"
import CommonNavbar from "@/components/navbar/CommonNavbar"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Lightbulb } from "lucide-react"

const FAQs = () => {
    return (
        <div className="">
            <CommonNavbar />

            <div className="container my-10">

                <h1 className="text-3xl my-4 mt-[6rem] font-extrabold font-AzoSans tracking-wide text-red-800 underline underline-offset-4 uppercase">
                    Frequently Asked Questions
                </h1>
                <Accordion type="single" collapsible className="w-full font-Poppins">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is the Faculty Profile Management System?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    The Faculty Profile Management System is a platform designed to manage and display faculty profiles, including their qualifications, research, publications, and contact details.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How do I add a new faculty member to the system?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    To add a new faculty member, navigate to the register page and register yourself. Fill in the required fields such as email, department, and password, then save the entry.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can faculty members update their own profiles?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, faculty members can update their own profiles through a user-friendly interface after logging in with their credentials.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Is the system secure?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, the system implements robust security measures including encryption, secure logins, and access controls to protect sensitive data.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Can the profiles be customized?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, profiles can be customized with various sections including academic achievements, publications, research interests, and more.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Is there a search functionality?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, users can search for faculty members by name, department, or research interests using the built-in search functionality.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>How do I integrate this system with our existing website?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Integration can be achieved using provided API endpoints or embedding options. Consult the documentation for detailed instructions.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-8">
                        <AccordionTrigger>Can the system handle multiple departments?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, the system supports multiple departments and allows for organizing faculty members accordingly.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-9">
                        <AccordionTrigger>What kind of user roles are available?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    The system supports various user roles including admin, faculty, head of department, and coordinators. Each role has different access levels and permissions.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-10">
                        <AccordionTrigger>Are there reporting features?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, the system includes reporting features for generating statistics on faculty members, such as publication counts and departmental distribution.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-11">
                        <AccordionTrigger>How often is the system updated?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Updates are regularly provided to improve functionality, fix bugs, and enhance security. Check the update log for the latest changes.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-12">
                        <AccordionTrigger>Can I import data from other systems?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, the system supports data import features allowing you to migrate faculty information from other platforms using CSV or other formats.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-13">
                        <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Yes, the website can be downloaded as a desktop and mobile application and can be accessed from any device.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-14">
                        <AccordionTrigger>How can I get support if I encounter issues?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    Support is available through our email at <pre className="inline-block bg-red-800 text-white mx-2 p-2 rounded-md">fpms.tech@somaiya.edu</pre>
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-15">
                        <AccordionTrigger>What are the system requirements?</AccordionTrigger>
                        <AccordionContent>
                            <Alert>
                                <Lightbulb className="h-5 w-5 fill-amber-500" />
                                <AlertTitle className="font-semibold text-lg text-gray-800">Answer</AlertTitle>
                                <Separator className="border-[1px]" />
                                <AlertDescription className="my-3">
                                    The system requires a modern web browser and a stable internet connection. For server-side requirements, please refer to the technical documentation.
                                </AlertDescription>
                            </Alert>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>



            </div>
            <Footer />
        </div>
    )
}

export default FAQs