import CommonNavbar from "@/components/navbar/CommonNavbar"

const About = () => {
  return (
    <div>
      <CommonNavbar />
      <div className="about-us p-8">
        <h1 className="text-3xl font-bold mb-4">About Faculty Profile Management System</h1>
        <p className="text-gray-700 mb-6">
          Welcome to the Faculty Profile Management System developed by the Computer Department at KJSIT. Our team has worked diligently to create an efficient and user-friendly platform tailored to meet the specific needs of our faculty members.
        </p>

        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          The primary mission of this system is to streamline the management of faculty profiles, providing a centralized hub for storing, updating, and accessing important information related to our esteemed educators. By leveraging modern web technologies, we aim to enhance efficiency and collaboration within the academic community.
        </p>

        <h2 className="text-2xl font-bold mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Effortless Profile Management: Easily update and maintain personal and professional information.</li>
          <li>Research Showcase: Highlight research publications, projects, and achievements.</li>
          <li>Interactive User Interface: Enjoy a seamless and intuitive experience with our user-friendly interface.</li>
          <li>Data Security: Your information is secure with robust authentication and authorization mechanisms.</li>
          <li>Responsive Design: Access the system from any device, ensuring a consistent experience.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
        <p className="text-gray-700 mb-6">
          The Faculty Profile Management System is built using TSX, a variant of TypeScript commonly used in conjunction with React for building user interfaces. This allows us to deliver a dynamic and responsive application that meets the standards of modern web development.
        </p>

        <h2 className="text-2xl font-bold mb-2">Feedback and Support</h2>
        <p className="text-gray-700 mb-6">
          We value your feedback! If you have any suggestions, encounter issues, or need assistance, please don't hesitate to reach out to our support team. Your input is crucial in helping us improve and refine the system.
        </p>

        <h2 className="text-2xl font-bold mb-2">Thank You</h2>
        <p className="text-gray-700 mb-6">
          We express our gratitude to the faculty members, administrators, and everyone involved in the development and deployment of the Faculty Profile Management System. Your collaboration and support have been instrumental in making this project a reality.
        </p>

        <p className="text-gray-700">
          Thank you for using the Faculty Profile Management System at KJSIT. We are committed to continuous improvement and providing a platform that enhances the overall academic experience for our faculty members.
        </p>
      </div>
    </div>
  )
}

export default About