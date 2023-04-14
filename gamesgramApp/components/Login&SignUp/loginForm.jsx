export default function LoginForm() {
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
    
        // Get data from the form.
        const data = {
          email: event.target.email.value,
          password: event.target.password.value,
        }

        console.log("data",data)
    
        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)
    
        // API endpoint where we send form data.
        const endpoint = '/login'
    
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
    
        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        
        console.log(response);
        //TODO: reset state

        return false;
      }

    return (
      <form onSubmit={handleSubmit}>
        <h1 >Please sign in</h1>
        <label htmlFor="email">Email address</label>
        <input type="text" id="email" name="email" required />
  
        <label htmlFor="password">password</label>
        <input type="password" id="password" name="password" required />
  
        <button type="submit">Sign in</button>
      </form>
    )
  }