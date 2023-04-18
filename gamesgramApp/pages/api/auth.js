import { withIronSession } from 'next-iron-session';
import Steam from 'steam-web';

const steam = new Steam({
  apiKey: 'FB453E73DBD4107207669FA395CBC366'
});

async function handleAuthRequest(req, res) {
    const { token } = req.body;
    
    try {
      const steamid = await steam.verifyLogin(token);
      const user = await steam.getUserSummary(steamid);
      
      req.session.set('user', {
        steamid: user.steamID,
        displayName: user.nickname
      });
      await req.session.save();
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: error.message });
    }
  }
  export default withIronSession(handleLoginRequest, {
    password: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    cookieName: 'GamesGram',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  });
