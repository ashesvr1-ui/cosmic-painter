const express = require("express")
const session = require("express-session")
const OAuth2 = require("discord-oauth2")
const dotenv = require("dotenv")
const path = require("path")

dotenv.config()

const app = express()
const oauth = new OAuth2()

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(express.static("public"))

app.get("/login", (req, res) => {

  const url = oauth.generateAuthUrl({
    clientId: process.env.CLIENT_ID,
    scope: ["identify", "guilds.members.read"],
    redirectUri: process.env.REDIRECT_URI
  })

  res.redirect(url)
})

app.get("/callback", async (req, res) => {

    try {

        const code = req.query.code

        const token = await oauth.tokenRequest({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            code,
            scope: "identify guilds.members.read",
            grantType: "authorization_code",
            redirectUri: process.env.REDIRECT_URI
        })

        const memberRes = await fetch(
            `https://discord.com/api/users/@me/guilds/${process.env.GUILD_ID}/member`,
            {
                headers: {
                    authorization:
                        `${token.token_type} ${token.access_token}`
                }
            }
        )

        const member = await memberRes.json()

        const hasRole =
            member.roles &&
            member.roles.includes(process.env.ROLE_ID)

        if (hasRole) {

            res.send("ROLE WORKS")

        } else {

            res.send(
                "NO ROLE FOUND <br><br>" +
                JSON.stringify(member)
            )

        }

    } catch (err) {

        console.log(err)

        res.send("ERROR")

    }

})