const app = require("express")();
const axios = require("axios");
require("dotenv").config();

const { REDIRECT_URL, PORT, CLIENT_ID } = process.env;

app.get("/", (req, res) => {
  res.status(200).send("healthy");
});
app.get("/twitter", (req, res) => {
  res.redirect(
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`
  );
});
app.get("/twitterHome", async (req, res) => {
  try {
    const { code } = req.query;
    const data = {
      grant_type: "authorization_code",
      code: code,
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URL,
      code_verifier: "challenge",
    };
    const response = await axios({
      method: "post",
      url: "https://api.twitter.com/2/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    const access_token = response.data.access_token;
    const userDetails = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.send(userDetails.data.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
