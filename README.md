
Electron and React based App created for a charity dnd stream on twitch. 

Includes:

- Wheel of fortune -> selected item's description gets displayed in twitch chat by bot
- Just Giving API based donation progress bar

Needs:

- Twitch Account name & auth token (for the twitch bot)
- Twitch Channel to join
- Just Giving API auth key
- Just Giving fundraising page short name

These can be added by creating a .env file in the root directory with the following Variables:

REACT_APP_JG_ID,
REACT_APP_FUND_PAGE,
REACT_APP_BOT_NAME,
REACT_APP_AUTH_TOKEN,
REACT_APP_CHANNEL_TO_JOIN

To Build:
npm run electron-pack

Uses:

Winwheel.js (https://github.com/zarocknz/javascript-winwheel)

React Sweet Progress (https://github.com/abraztsov/react-sweet-progress)

tmi.js (https://github.com/tmijs/tmi.js)



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Favicon by Sleepiestdesigns (http://www.sleepiestdesigns.com/)