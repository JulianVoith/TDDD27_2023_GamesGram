import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import cx from 'classnames';
import styles from '@/styles/Search.module.css';
import {Button,Modal,Form} from 'react-bootstrap';
import SearchBar from './SearchBar';

export default function Search(){

    return(
        <>
        <SearchBar/>
        </>
    );
}