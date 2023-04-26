import styles from '@/styles/Login.module.css';
import cx from 'classnames';
import { useState, useEffect } from 'react';

export default function LoginForm(props) {

  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [steamID, setSteamId] = useState('');

  /*const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };*/

  const handleSteamIDChange = (event) => {
    setSteamId(event.target.value);
  };

    const submitForm = async (steamID) => { //email, password) => {
        // Stop the form from submitting and refreshing the page.
        //event.preventDefault()
    
        // Get data from the form.
        /*const FormData = {
          email: email,
          password: password,
        }*/

        const FormData = {
          steamID: steamID,
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(FormData)
    
        // API endpoint where we send form data.
        const endpoint = '/api/login'
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)
        
        const data = await response.json();
        return data.token;
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await submitForm(steamID);//email, password);
        props.onLogin(token);
        return false;
      };

    return (
      <div className={cx(styles["login-gamesgram"],"text-center","mt-5")}> 
      <div className="card mb-4 rounded-3 shadow-sm">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <div className="form-floating">
            <input type="text" className="form-control" id="floatingInput" placeholder="STEAM_ID" value={steamID} onChange={handleSteamIDChange} />
            <label htmlFor="floatingInput">STEAM ID</label>
        </div>
        <div className={cx(styles.checkbox,"mb-3")}>
            <label>
            <input type="checkbox" value="remember-me" /> Remember me
            </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
      </div> 
      </div>
    )
  }


  /*
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <div className="form-floating">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={handleEmailChange} />
            <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            <label htmlFor="floatingPassword">Password</label>
        </div>

  */