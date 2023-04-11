import styles from '@/styles/Login.module.css'
import cx from 'classnames'
import Link from 'next/link'


export default function LoginForm(){
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
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className={cx(styles.checkbox,"mb-3")}>
                <label>
                <input type="checkbox" value="remember-me" /> Remember me
                </label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
            </div>
        <div className={styles.signUp}>
            <div>
                <div class="card mb-4 rounded-3 shadow-sm">
                    You don't have an account? <Link href="/LoginAndSignUp/signup-gamesgram">Sign up!</Link>
                </div>
            </div>
        </div>
      </main>
        
        </>
    )
}