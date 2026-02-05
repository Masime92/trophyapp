
const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const axios = require('axios');
const session = require('express-session');

const app = express();
const PORT = 3001;
const STEAM_API_KEY = process.env.API_KEY; // Nutze deinen API Key

// Passport Konfiguration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: `http://localhost:${PORT}/auth/steam/return`,
    realm: `http://localhost:${PORT}/`,
    apiKey: STEAM_API_KEY
  },
  (identifier, profile, done) => {
    // Profil enthält die validierte SteamID64
    return done(null, profile);
  }
));

app.use(session({
  secret: 'trophyhunter-pro-secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Endpoint 1: Login Start
app.get('/auth/steam', passport.authenticate('steam'));

// Endpoint 2: Return & Data Aggregation
app.get('/auth/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/' }),
  async (req, res) => {
    const steamId = req.user.id;
    
    try {
      // 1. GetPlayerSummaries (Avatar, Name)
      const userSummary = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`);
      
      // 2. GetOwnedGames (Die Hardcore-Abfrage)
      // include_appinfo=1 -> Namen/Bilder
      // include_played_free_games=1 -> F2P Titel
      // skip_unvetted_apps=false -> WICHTIG: Zeigt auch nicht verifizierte Spiele (Indies/Nische)
      const ownedGames = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&skip_unvetted_apps=false`);

      // Sende Daten zurück an die App (oder via PostMessage für WebView)
      const userData = {
        summary: userSummary.data.response.players[0],
        games: ownedGames.data.response.games || []
      };

      // In einer mobilen WebView schicken wir die Daten oft als Script-Result oder redirect URL
      res.send(`
        <script>
          if (window.opener) {
            window.opener.postMessage(${JSON.stringify(userData)}, "*");
            window.close();
          } else {
            // Für mobile WebViews: Redirect mit Daten in Fragment oder Query
            window.location.href = "trophyhunter://auth?data=" + encodeURIComponent(JSON.stringify(userData));
          }
        </script>
      `);
    } catch (error) {
      res.status(500).send("Fehler beim Abruf der Steam-Daten");
    }
  }
);

app.listen(PORT, () => console.log(`Steam Auth Server läuft auf Port ${PORT}`));
