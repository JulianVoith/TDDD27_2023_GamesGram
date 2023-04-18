import Image from "next/image";

import { useState } from "react";

function Login() {
  const [steamLoginUrl, setSteamLoginUrl] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("/auth", {
        method: "POST",
        redirect: 'follow',
        mode: 'same-origin',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      console.log(response);
      //const { url } = await response.json();
      setSteamLoginUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>
        <Image 
        src="/images/auth_wide.png"
        width={180}
        height={35}
        alt="Login with Steam"
        />
      </button>
      {steamLoginUrl && <a href={steamLoginUrl}>Login with Steam</a>}
    </div>
  );
}

export default Login;
