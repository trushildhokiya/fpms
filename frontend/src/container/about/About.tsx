import CommonNavbar from "@/components/navbar/CommonNavbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Footer from "@/components/footer/footer"


const About = () => {

  const teamData = [
    {
      id: 1,
      name: 'Trushil Dhokiya',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: 'https://in.linkedin.com/in/trushil-dhokiya',
      githubURI: 'https://www.github.com/trushildhokiya',
    },
    {
      id: 2,
      name: 'Hitanshu Gandhi',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: '',
      githubURI: '',
    },
    {
      id: 3,
      name: 'Tavion Fernandes',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: '',
      githubURI: '',
    },
    {
      id: 4,
      name: 'Ojas Golatkar',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: '',
      githubURI: '',
    },
    {
      id: 5,
      name: 'Kushal Harsora',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: '',
      githubURI: '',
    },
    {
      id: 6,
      name: 'Devam Dixit',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas sed aut ipsam?',
      linkedinURI: '',
      githubURI: '',
    },
  ]

  return (
    <div>
      <CommonNavbar />
      <div className="container font-Poppins">

        {/* HEADING  */}
        <h1 className="font-AzoSans font-bold text-3xl md:text-5xl tracking-wide my-6 text-red-800 ">
          <span className="border-b-4 border-red-800">
            ABOUT
          </span>
        </h1>

        {/* STARTER TEXT  */}
        <p className="text-red-800 text-xl font-OpenSans font-bold my-2 ">
          Greetings from the Computer Department at KJSIT!
        </p>

        <div className="leading-8 text-md md:text-justify">
          <p className="my-3">
            We're thrilled to introduce you to the Faculty Profile Management System (FPMS), a cutting-edge platform designed to revolutionize the way we manage and showcase the achievements of our esteemed faculty members. 🚀
          </p>

          <p className="my-3">
            At FPMS, we believe in fostering innovation, collaboration, and efficiency within our academic community. This system is crafted with precision to meet the unique needs of our faculty, providing a centralized hub for seamless profile management and information sharing.
          </p>
        </div>

        {/* IMAGE  */}
        <div className="flex justify-center my-[5rem]">
          <img src='https://picsum.photos/800/300' className="rounded-lg" alt='random-image' />
        </div>

        {/* MEET THE DEVELOPERS  */}
        <h2 className="font-OpenSans text-2xl text-red-800 my-6 font-bold ">
          OUR TEAM
        </h2>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">

          {
            teamData.map((member) => {
              return (

                <Card key={member.id}>
                  <CardContent className="p-0 m-0">
                    <div className="grid grid-cols-3">
                      <div className="col-span-1">
                        <img src={`https://picsum.photos/1280/${720+member.id}`} draggable={false} className="rounded-lg object-cover h-full" alt='random-image' />
                      </div>
                      <div className="col-span-2 mx-4 my-4">
                        <h2 className="font-OpenSans text-lg text-gray-700 font-bold">
                          {member.name}
                        </h2>
                        <div className="">
                          <HoverCard>
                            <HoverCardTrigger>
                              <Badge variant='secondary' className="bg-amber-400  bg-opacity-30 text-amber-600">
                                Active
                              </Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs text-gray-500">
                              This Badge indicates that the person has actively contributed in the development of the software
                            </HoverCardContent>
                          </HoverCard>

                        </div>
                        <p className="text-sm text-gray-600 leading-6 my-3">
                          {member.description}
                        </p>
                        <div className="flex justify-center">
                          <a href={member.linkedinURI} target="_blank" >
                            <div className="bg-red-800 p-2 rounded-full text-white mx-3 my-3">
                              <Linkedin />
                            </div>
                          </a>
                          <a href={member.githubURI} target="_blank">
                            <div className="bg-red-800 p-2 rounded-full text-white mx-3 my-3">
                              <Github />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              )
            })
          }

        </div>

        {/* FEEDBACK */}
        <h2 className="font-OpenSans text-2xl text-red-800 font-bold my-4 mt-[5rem]">
          FEEDBACK
        </h2>
        <div className="mb-[5rem]">
          <p className="leading-6 md:text-justify my-3">
            At FPMS, your feedback is invaluable to us. We strive for excellence and continuous improvement, and your insights play a crucial role in shaping the future of our platform.
          </p>
          <p className="leading-6 md:text-justify my-3">

            Whether you have suggestions, encounter challenges, or simply want to share your experience, we welcome your thoughts with open arms. Your feedback empowers us to refine and enhance the Faculty Profile Management System, ensuring it meets the evolving needs of our academic community.
          </p>
          <p className="leading-6 md:text-justify my-3">

            Thank you for taking the time to contribute to the growth of FPMS. Together, let's build a platform that truly serves and elevates the academic experience for everyone.
          </p>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default About