import React from 'react';

type Props = {};

const Footer: React.FC<Props> = (props: Props) => {
  return (
    <div className='mt-10'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path className='fill-gray-800' fillOpacity="1" d="M0,160L48,154.7C96,149,192,139,288,160C384,181,480,235,576,224C672,213,768,139,864,101.3C960,64,1056,64,1152,69.3C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path className='fill-gray-800' fillOpacity="1" d="M0,192L60,192C120,192,240,192,360,170.7C480,149,600,107,720,101.3C840,96,960,128,1080,138.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg> */}
      <footer className="bg-gray-800 text-white py-8  font-Poppins text-sm leading-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-8 md:mb-0 md:flex-1 md: px-5">
              <img src="https://kjsit.somaiya.edu.in//assets/kjsieit/images/Logo/somaiya_logo.jpg" draggable="false" alt="Somaiya Trust Logo" className="h-16 mb-4" />
              <p>Somaiya K.J. Somaiya Institute of Technology (KJSIT) is committed to providing excellent education in the field of engineering and technology, fostering innovation, research, and holistic development of students.</p>

              <div className="flex space-x-8 mt-4 justify-center md:justify-normal">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img height="24" width="24" src="https://cdn.simpleicons.org/facebook/0866FF" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img height="24" width="24" src="https://cdn.simpleicons.org/instagram/E4405F" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <img height="24" width="24" src="https://cdn.simpleicons.org/x/000000" />
                </a>
              </div>
            </div>
            <div className="mb-8 md:mb-0 md:flex-1 mx-auto">
              <h3 className="font-bold mb-2">QUICK LINKS</h3>
              <ul className='text-center md:text-left'>
                <li><a href="#" className="hover:underline">HOME</a></li>
                <li><a href="#" className="hover:underline">ABOUT US</a></li>
                <li><a href="#" className="hover:underline">SERVICES</a></li>
                <li><a href="#" className="hover:underline">PROJECTS</a></li>
                <li><a href="#" className="hover:underline">SHOP</a></li>
                <li><a href="#" className="hover:underline">BLOG</a></li>
                <li><a href="#" className="hover:underline">CONTACT</a></li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0 md:flex-1 mx-auto ">
              <h3 className="font-bold mb-2 text-center md:text-left">HELP CENTER</h3>
              <ul className='text-center md:text-left' >
                <li><a href="#" className="hover:underline">FAQs</a></li>
                <li><a href="#" className="hover:underline">TERMS & CONDITIONS</a></li>
                <li><a href="#" className="hover:underline">PRIVACY</a></li>
                <li><a href="#" className="hover:underline">HOW IT WORKS</a></li>
                <li><a href="#" className="hover:underline">RETURN</a></li>
              </ul>
            </div>
            <div className="md:flex-1 text-center md:text-left">
              <h3 className="font-bold mb-2">COMPANY</h3>
              <p>Somaiya Ayurvihar Complex, Eastern Express Highway, Near Everard Nagar, Sion (East), Mumbai – 400 022</p>
              <p>info.tech@somaiya.edu</p>
              <p>91-22-44444408 / 44444403</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <p>© {new Date().getFullYear()} FPMS. ALL RIGHTS RESERVED.</p>
          <p>DESIGN BY Trushil Dhokiya</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
