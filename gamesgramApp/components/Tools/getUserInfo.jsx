export async function GetUserInfo(steamid = {}) {
    // Default options are marked with *
    const endpoint =`/api/GetUserInfo/${steamid}`;
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
    return data.response.players[0]; // parses JSON response into native JavaScript objects
  }