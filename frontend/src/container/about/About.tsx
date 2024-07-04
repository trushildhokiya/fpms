import CommonNavbar from "@/components/navbar/CommonNavbar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


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
      linkedinURI: 'https://www.linkedin.com/in/tavion-fernandes-0b1196252',
      githubURI: 'https://www.github.com/Tavion20',
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
      <div className="font-Poppins">
        <section className="container">
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
          {/* <div className="flex justify-center my-[5rem]">
            <img src='https://picsum.photos/800/300' className="rounded-lg" alt='random-image' />
          </div> */}

        </section>

        <section className="mt-8 relative bg-[url('https://kjsit.somaiya.edu.in/assets/kjsieit/images/infra/two.jpg')] bg-cover bg-center p-4 flex justify-end max-md:flex-col max-md:items-center">
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-30 z-0"></div>
          <div className="leading-8 text-md md:text-justify text-white bg-opacity-70 bg-black w-[50%] max-lg:w-[70%] max-md:w-full p-4 rounded-md m-4">
            <p className="my-3">
            This second Engineering College established by the Somaiya Trust in the year 2001, at Ayurvihar campus, Sion, was initiated with a first batch of 180 undergraduate students and three branches in Engineering—namely Electronics and Telecommunication Engineering, Computer Engineering, and Information Technology.          
            </p>
            <p className="my-3">
            KJSIT is recognized by the All India Council for Technical Education (AICTE) & the Govt. of Maharashtra with a permanent affiliation to the University of Mumbai (UOM). It is accredited with “A” Grade and 3.21 CGPA in its 1 st cycle for 5 years duration by National Assessment and Accreditation Council (NAAC) and it’s three programs - Computer Engineering, Electronics and Telecommunication Engineering and Electronics Engineering - are accredited by National Board of Accreditation. KJSIT is bestowed upon the “BEST COLLEGE AWARD” by the University of Mumbai in urban region and “Best Engineering College Award" by CSI local chapter and also from ISTE Maharashtra and Goa Section.
            </p>
            {/* <p className="my-3">
            Additionally, an undergraduate engineering program - Artificial Intelligence and Data Science - has been offered by KJSIT from the academic year 2020-21 with the intake capacity of 60 seats leading the total intake increased to 360. KJSIT is constantly identifying and developing latest and nascent technologies such as Artificial Intelligence, Machine Learning, Deep Learning and Block Chain Technology, etc. for enhancing student learning and growth.
            </p>
            <p className="my-3">
            University Grants Commission has conferred Autonomous Status to, K J Somaiya Institute of Technology, for a period of 10 years from the A.Y. 2021- 22 to A.Y. 2030-31 as per the provisions of Clause 3.13 and Clause 6.4 (i) of UGC Regulations dated 12.02.2018, whereby the Degree will be awarded by the University of Mumbai.
            </p> */}
          </div>
        </section>
        
        <h2 className="font-OpenSans text-3xl text-red-800 mt-6 font-bold container ">
          OUR FOUNDER
        </h2>
        <section className="container flex justify-around mt- 4 py-4 gap-4">
          <div className="relative">
            <div className="border-[5px] border-red-800 rounded-md bg-red-800 absolute top-[20px] bottom-[-20px] left-[-20px] right-[20px] z-[-1]"></div>
            <img className="rounded-md w-full shadow-lg drop-shadow-sm" src="https://kjsit.somaiya.edu.in/assets/kjsieit/images/about/founder.png" />
          </div>
          <div className="flex flex-col gap-4 w-[60%] justify-center">
            <div className="font-semibold text-3xl underline underline-offset-4">PADMA BHUSHAN K. J. SOMAIYA</div>
            <div className="font-semibold text-2xl">“Whatever you do in word or in deed, do all the Name of Lord, Giving Thanks to Him.”</div>
            <div>It’s no small achievement to distinguish oneself in such diverse fields as commerce, education, and philanthropy. Pujya Shriman Karamshibhai Jethabhai Somaiya, born on May 16 1902 in the remote village of Malunjar in Ahmednagar district of Maharashtra, India, was however, a blessed person by dint of hard work and singular devotion to service.</div>
            <div className="cursor-pointer hover:underline" onClick={() => window.location.href = 'https://www.somaiya.edu/en/history/#1'}>Learn more about our Founder ...</div>
          </div>
        </section>

        <section className="container" >

        {/* MEET THE DEVELOPERS  */}
        <h2 className="font-OpenSans text-3xl text-red-800 my-6 font-bold ">
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
                        <img src={`https://picsum.photos/1280/${720+member.id}`} className="rounded-lg object-cover h-full" alt='random-image' />
                      </div>
                      <div className="col-span-2 mx-4 my-4">
                        <h2 className="font-OpenSans text-lg text-gray-700 font-bold">
                          {member.name}
                        </h2>
                        <div className="">
                          <HoverCard>
                            <HoverCardTrigger>
                              <Badge variant='secondary' className="bg-amber-400">
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
        <h2 className="font-OpenSans text-3xl text-red-800 font-bold my-4 mt-[5rem]">
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
          </section>

      </div>
    </div>
  )
}

export default About