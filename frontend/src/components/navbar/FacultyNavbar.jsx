import React from 'react'
import "./navbar.css"
import { RxAvatar } from "react-icons/rx";

import logo from "../../assets/svg/kjsitLogo.svg"

const FacultyNavbar = () => {
  return (
    <div className='nav'>
        <img src={logo} style={{width:'25rem'}} />

        <div class="dropdown">
        <button class="dropbtn">Publications</button>
        <div class="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div class="dropdown">
        <button class="dropbtn">Research</button>
        <div class="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div class="dropdown">
        <button class="dropbtn">Consultancy</button>
        <div class="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div class="dropdown">
        <button class="dropbtn">Patents</button>
        <div class="dropdown-content">
            <a href="#">Link 1</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 2</a>
            <hr style={{height:'0.15rem',backgroundColor:'#a02929',width:'70%',marginLeft:'15%'}}></hr>
            <a href="#">Link 3</a>
        </div>
        </div>

        <div class="dropdown" style={{marginLeft:'auto',marginRight:'3.5rem'}}>
        <button class="dropbtn" style={{width:'5rem',height:'5rem'}}><RxAvatar style={{width:'50px',height:'50px'}} /></button>
        <div class="dropdown-content">
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