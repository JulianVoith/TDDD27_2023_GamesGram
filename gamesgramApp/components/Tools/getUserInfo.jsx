//Helper function to fetch user information from backend. Could be transferred to SWR
//if no steam id is provided the logged in user is fetched
export async function GetUserInfo(steamid = null) {
    // Default options are marked with *
    const endpoint = steamid ? `/api/GetUserInfo/${steamid}` : '/api/GetUserInfo';
    const options = {
      // The method is POST because we are sending data.
      method: 'GET',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'token':window.localStorage.getItem("token")
      },};
    const response = await fetch(endpoint, options);
    const data = await response.json();
    return data.response.players; // parses JSON response into native JavaScript objects
  }