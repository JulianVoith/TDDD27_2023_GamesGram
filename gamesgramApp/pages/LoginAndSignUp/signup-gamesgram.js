import styles from '@/styles/Login.module.css'
import cx from 'classnames'
import Link from 'next/link'


export default function SignUpForm(){
    // what is cx classname doing?
    return (
        <>
        
      <main className={cx(styles["login-gamesgram"],"text-center","mt-5")}> 
        <div className="card mb-4 rounded-3 shadow-sm">
            <form>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Full Name" />
                    <label htmlFor="floatingInput">Full Name</label>
                </div>
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Username" />
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
            </form>
        </div>
        <div>
            <h2 className={styles.h2}><span className={styles.h2span}>Or</span></h2>
        </div> 

        <div>
            Here will be steam
        </div>
        <div>
            Here will be Google
        </div>

        <div><Link href={"/LoginAndSignUp/login-gamesgram"}>Go Back</Link></div>

      </main>
        
        </>
    )
}