import styles from '@/styles/Login.module.css';
import cx from 'classnames';
import Link from 'next/link';
import Image from 'next/image';


export default function LoginForm(){
    // what is cx classname doing?

    const LoginWSteam = () => (
        <Image
          src="/images/steam_logo.png" // Route of the image file
          height={60} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="LogoSteam"
        />
      );
    
      const LoginWGoggle = () => (
        <Image
          src="/images/google_logo.png" // Route of the image file
          height={60} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="LogoGoggle"
        />
      );

      const callLogin = async () => {
        try{
            const res = await fetch('/login/');
            const data = await res.json();
        }catch (err){
            console.log(err);
        }
      };


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
        <div>
            <h2 className={styles.h2}><span className={styles.h2span}>Or</span></h2>
        </div> 

        <div >
            <LoginWSteam />   <LoginWGoggle />
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