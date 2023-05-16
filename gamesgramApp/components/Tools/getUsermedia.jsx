export async function GetUserMedia(steamid) {
    // Default options are marked with *
    const endpoint = `/api/getPosts/${steamid}`;
    const options = {
    // The method is POST because we are sending data.
        method: 'GET',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
            'token': window.localStorage.getItem("token")
        },};
  
    const response = await fetch(endpoint, options);
    const data = await response.json();

    return data;
  }