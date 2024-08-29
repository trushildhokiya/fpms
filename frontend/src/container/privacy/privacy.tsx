import Footer from '@/components/footer/footer'
import CommonNavbar from '@/components/navbar/CommonNavbar'

const Privacy = () => {
  return (
    <div>
      <CommonNavbar />
      <div className="container mt-[6rem] my-5 px-4">
        <h1 className="text-3xl font-extrabold font-AzoSans tracking-wide text-red-800 underline underline-offset-4 uppercase">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6 font-Poppins leading-6 text-gray-700">
          <p>
            At the Faculty Profile Management System (FPMS), we prioritize your privacy and are committed to protecting your personal data. This Privacy Policy details how we collect, use, and safeguard your information when you interact with our platform. When you register or update your profile on FPMS, we collect personal data such as your name, email address, contact details, and professional qualifications. This data is essential for creating and maintaining your profile, facilitating communication, and enhancing the overall functionality of our system. We use this information to ensure that your profile is accurately represented and to provide you with relevant updates about our services.
          </p>

          <p>
            We implement robust security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. This includes the use of encryption technologies, secure servers, and regular security audits. However, it's important to acknowledge that no system is entirely immune to security risks, and while we strive to protect your information to the best of our ability, we cannot guarantee absolute security. Additionally, we retain your personal data only as long as necessary for the purposes described in this policy or as required by law. Should you wish to access, correct, or delete any of your personal data, please contact us at the email address provided below.
          </p>

          <p>
            This Privacy Policy may be updated periodically to reflect changes in our practices or legal requirements. We encourage you to review this page regularly to stay informed about how we are safeguarding your information. If we make significant changes to this policy, we will notify you by updating the policy on our website and, if appropriate, via email. For any questions or concerns regarding this Privacy Policy or our data handling practices, please reach out to us at <a href="mailto:fpms.tech@somaiya.edu" className="text-blue-500 hover:underline">fpms.tech@somaiya.edu</a>. We are committed to ensuring that your experience with FPMS is secure and satisfactory.
          </p>
        </div>

        <div className="mt-12 font-Poppins ">
            <h2 className="text-2xl font-semibold text-red-800">Additional Information</h2>

            <p className="mt-4 leading-6">
              Users of FPMS are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. We advise you to log out from your account at the end of each session and to use strong, unique passwords to protect your data. If you suspect any unauthorized use of your account, please contact us immediately.
            </p>

            <p className="mt-4 leading-6">
              FPMS may contain links to third-party websites and services. Please be aware that we are not responsible for the privacy practices or content of such third parties. We encourage you to review the privacy policies of any third-party sites you visit. The inclusion of a link on FPMS does not imply endorsement of the linked site or its practices.
            </p>

            <p className="mt-4 leading-6">
              In certain circumstances, we may be required to disclose your information to comply with legal obligations or to respond to valid requests by public authorities. This may include responding to subpoenas, court orders, or legal processes. We will make reasonable efforts to notify you of such disclosures where permitted by law.
            </p>

            <p className="mt-4 leading-6">
              If you have any concerns about our Privacy Policy or how your personal data is handled, please feel free to contact us. We are dedicated to addressing any issues or questions you may have in a timely and effective manner.
            </p>
          </div>
      </div>
      <Footer />
    </div>
  )
}

export default Privacy
