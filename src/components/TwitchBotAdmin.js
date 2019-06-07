import React from 'react'

import tmi from 'tmi.js'

//require('dotenv').config()
class TwitchBotAdmin extends React.Component {
    constructor(){
        super()
        this.state = {

            messagesToSpam: [],
            wheelMessages: [],
            connected: false,
            client: null,
            connectButton: "Connect",
        }
        this.joinChannel = this.joinChannel.bind(this)
        this.messageInChat  = this.messageInChat.bind(this)
    }
    componentDidMount(){


    }
    messageInChat( message){
      if (this.state.connected === true){
            let client = this.state.client
            let toSend = "/me " + message
            client.say(process.env.REACT_APP_CHANNEL_TO_JOIN, toSend)
      }
      console.log(message,'this is what the bot says')
    }
    joinChannel(){
        const options = {
        options:  {
            debug: false
        },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: process.env.REACT_APP_BOT_NAME,
            password: process.env.REACT_APP_AUTH_TOKEN
        },
        channels: [ process.env.REACT_APP_CHANNEL_TO_JOIN ]
     
    }
       
       
        if (!this.state.connected){
            let client = new tmi.client(options);
            client.connect()
            .then( () =>
                this.setState({

                    connected: true,
                    client: client,
                    connectButton: "Disconnect"
                })
            )
        }
        else {
            let client = this.state.client
            client.disconnect()

            .then( () =>
                this.setState({

                    connected: false,
                    client: null,
                    connectButton: "Connect"
                })
            )
        }
        
    }


    render(){
    // Connect the client to the server..
       return(
            <div className="Content">
                <button className=" myButton" onClick={this.joinChannel}>{this.state.connectButton}</button>
            </div>
        )
    }
}
export default TwitchBotAdmin