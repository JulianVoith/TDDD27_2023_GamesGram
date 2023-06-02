import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import {GetUserInfo} from '@/components/Tools/getUserInfo'
import {GetUserMedia} from '@/components/Tools/getUsermedia'
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';
import PostWall from '@/components/PostWall';
import Post from '@/components/Post';
import { Modal } from 'react-bootstrap';
import Context from '@/context/Context';

export default function Game()
{

}