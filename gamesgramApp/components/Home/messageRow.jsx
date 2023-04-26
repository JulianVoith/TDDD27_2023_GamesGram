import Image from 'next/image';
import styles from '@/styles/Home.module.css';//Maybe make a individual css?

function profile(ImagePath,UserName){
    return (
            < >
            <Image
            src={ImagePath}
            alt={UserName}
            className="photo"
            />
            </>
    )
};

function UserInfo(User){
    return(//TODO: finish CSS
        < >
        <div className={styles.XX}>
        <profile ImagePath={User.Image} UserName={User.name} />
        <p className={styles.XXX}>{User.name}</p>
        </div>
        </>
    )
}

function MessageFrame(User)