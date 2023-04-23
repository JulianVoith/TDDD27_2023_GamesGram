import Image from 'next/image';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import styles from '@/styles/Profile.module.css';
import '@/styles/Profile.module.css';

export default function profile(props){

    function Header(){
        return (
        
        <div >
            <div className="container bootstrap-snippet header-container">
                <div className="bg-white">
                <div className="container py-5">
                    <div className= "media col-md-10 col-lg-8 col-xl-7 p-0 my-4 mx-auto">
                        <Image 
                        src={props.userInfo.avatar}
                        width={250}
                        height={250}
                        alt={props.userInfo.personaname}
                        className={styles.avatar}
                        />
                    <div className="media-body, ml-5">
                        <h4 className="font-weight-bold mb-4">Add Steam name here</h4>
                        <div className="text-muted mb-4">
                         Add About Text here
                        </div>
                        <a href="#" className="d-inline-block text-dark">
                        <strong>234</strong>
                        <span className="text-muted">followers</span>
                        </a>
                        <a href="#" className="d-inline-block text-dark ml-3">
                        <strong>111</strong>
                        <span className="text-muted">following</span>
                        </a>
                    </div>
                    </div>
                </div>
                
                <ul className="nav nav-tabs tabs-alt justify-content-center">
                    <li className="nav-item">
                    <a className="nav-link py-4 active" href="#">Posts</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Likes</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Followers</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link py-4" href="#">Following</a>
                    </li>
                </ul>
                </div>
            </div>

            </div>
        
        );
    } //image and hr

    return (
        <>
        <div> 
            <Header />
        </div>
        </>
    )
}

/*
            <div>
                <Image 
                    src={props.userInfo.avatar}
                    width={100}
                    height={100}
                    alt={props.userInfo.personaname}
                    className={styles.avatar}
                    />
            </div>
*/