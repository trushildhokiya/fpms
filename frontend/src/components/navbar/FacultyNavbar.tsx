import "./navbar.css"
import { RxAvatar } from "react-icons/rx";

import logo from "../../assets/svg/kjsitLogo.svg"

const FacultyNavbar = () => {
  return (
    <div className='nav'>
        <img src={logo} style={{width:'25rem'}} />

        <div className="dropdown">
        <button className="dropbtn">Publications</button>
        <div className="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div className="dropdown">
        <button className="dropbtn">Research</button>
        <div className="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div className="dropdown">
        <button className="dropbtn">Consultancy</button>
        <div className="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div className="dropdown">
        <button className="dropbtn">Patents</button>
        <div className="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div className="dropdown" style={{marginLeft:'auto',marginRight:'3.5rem'}}>
        <button className="dropbtn" style={{width:'5rem',height:'5rem'}}><RxAvatar style={{width:'50px',height:'50px'}} /></button>
        <div className="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.1rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

    </div>
  )
}

export default FacultyNavbar