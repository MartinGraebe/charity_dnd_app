import React from "react"
import { Progress } from 'react-sweet-progress'
import "react-sweet-progress/lib/style.css"
import { ipcRenderer} from 'electron'
import {
   

   FETCH_OPTIONS_FROM_STORAGE,
   SAVE_OPTIONS_IN_STORAGE,
   HANDLE_FETCH_OPTIONS_FROM_STORAGE,
   HANDLE_SAVE_OPTIONS_IN_STORAGE
} from '../../utils/constants' 




class Widget extends React.Component {

    constructor(){

        super()
        this.state = {

            totalGoal: 0,
            reached: 0,
            apiKey: process.env.REACT_APP_JG_ID,
            eventID: process.env.REACT_APP_FUND_PAGE,
            dataObject: '',
            targetAmount: '',
            currency: '',
            raisedAmount:'',
            percentageRaised: '',
            strokeColor: 'blue',
            chromaColour: 'green',
            textColour: 'white',
            backgroundColour: 'black',
            trailColor: '#efefef',
            config: [],
            
            
        }
        this.getData = this.getData.bind(this)

        this.handleChangeChroma = this.handleChangeChroma.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        this.handleChangeStroke = this.handleChangeStroke.bind(this)
        this.handleChangeBackground = this.handleChangeBackground.bind(this)
        this.handleChangeTrail = this.handleChangeTrail.bind(this)

        this.loadConfig = this.loadConfig.bind(this)
        this.handleConfig = this.handleConfig.bind(this)
        this.saveConfig = this.saveConfig.bind(this)
        this.loadSavedConfig = this.loadSavedConfig.bind(this)
        this.createConfig = this.createConfig.bind(this)
    }
    componentDidMount(){
        this.getData()
       this.intervalId = setInterval(() => this.getData(), 30000);

       ipcRenderer.send(FETCH_OPTIONS_FROM_STORAGE, 'ping')
       ipcRenderer.on(HANDLE_FETCH_OPTIONS_FROM_STORAGE, this.loadConfig)
       ipcRenderer.on(HANDLE_SAVE_OPTIONS_IN_STORAGE, this.handleConfig) 
    }
    componentWillUnmount(){

        clearInterval(this.intervalId)

        ipcRenderer.removeListener(HANDLE_FETCH_OPTIONS_FROM_STORAGE, this.loadConfig)
        ipcRenderer.removeListener(HANDLE_SAVE_OPTIONS_IN_STORAGE, this.handleConfig) 
    }

     /* SAVING CONFIG*/
     loadConfig(event, data){
        const { text } = data
        if (text != null){
            this.setState({
                config: text,
            })
            console.log (this.state.config, 'loaded')
            this.loadSavedConfig()
        }
        else console.log('No config file')

    }
    loadSavedConfig(){
        const {config} = this.state
        this.setState({

            chromaColour: config[0],
            textColour: config[1],
            backgroundColour: config[2],
            trailColor: config[3]

        })
    }
    handleConfig(event,data){
        console.log(data,'Config submitted')
    }
  async  saveConfig(){
        console.log('Config has been saved')
        await this.createConfig()
        ipcRenderer.send(SAVE_OPTIONS_IN_STORAGE, this.state.config)

    }
    async createConfig(){
        const {chromaColour, textColour, backgroundColour, trailColor} = this.state
        const cache = [chromaColour, textColour, backgroundColour, trailColor]
        this.setState({
            config: cache

        })
    }

     getData(){
        const url =  "https://api.justgiving.com/" + this.state.apiKey + "/v1/fundraising/pages/" + this.state.eventID
        console.log(url, 'this should be the url')
        
            
    
        fetch(url,{
        headers:{"Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then (data =>{
            this.setState({

                dataObject: data,
                targetAmount: data.fundraisingTarget,
                currency: data.currencySymbol,
                raisedAmount: data.totalRaisedOnline,
                percentageRaised: data.totalRaisedPercentageOfFundraisingTarget,
                
            })
        })
    }
    handleChangeChroma(event){
        
        this.setState({chromaColour: event.target.value})
         
    }
    handleChangeText(event){
        this.setState({textColour: event.target.value})

    }
    handleChangeBackground(event){
        this.setState({backgroundColour: event.target.value})

    }
    handleChangeStroke(event){
        this.setState({strokeColor: event.target.value})

    }
    handleChangeTrail(event){
        this.setState({trailColor: event.target.value})

    }

    render(){

        return (
           
           <div className="mainContainer">
            <div className="progressContainer" style={{ backgroundColor: this.state.chromaColour}}>
                    <div className="everything" style={{ backgroundColor: this.state.backgroundColour, color: this.state.textColour}}>
                        <div className="progressBar">
                        
                        
                                
                                <div className="labels">
                                        <label>{this.state.currency}{this.state.raisedAmount}</label>  
                                    </div>
                                  {(this.state.percentageRaised > 100)  ? <Progress percent="100" 
                                         theme={
                                            {
                                            
                                            active: {
                                                
                                                trailColor: this.state.trailColor,
                                                color: this.state.strokeColor
                                            }
                                            ,
                                                success: {
                                                    
                                                    trailColor: this.state.trailColor,
                                                    color: this.state.strokeColor
                                                  },
                                            }
                                        }
                                   /> : <Progress percent={this.state.percentageRaised} 
                                            theme={
                                                {
                                                
                                                active: {
                                                    
                                                    trailColor: this.state.trailColor,
                                                    color: this.state.strokeColor
                                                },
                                                success: {
                                                    
                                                    trailColor: this.state.trailColor,
                                                    color: this.state.strokeColor
                                                  },
                                                }
                                            }
                                    />} 
                               
                                    <div className="labels">
                                        <label>{this.state.currency}{this.state.targetAmount}</label>  
                                    </div>
                                
                        </div>
                        <div className="progressTotal">

                            <label className="labels">{this.state.percentageRaised}% Raised So Far</label>
                        </div>


                    

                    </div>
                 
                </div>
                <div className="progressList">
                        <div className="option">
                        <label> Chroma Key: </label>
                            <input type="text" name="chroma" value={this.state.chromaColour} onChange={this.handleChangeChroma} />
                        </div>
                        <div className="option">
                        <label> Text Colour: </label>
                            <input type="text" name="textColour" value={this.state.textColour} onChange={this.handleChangeText} />
                        </div>
                        <div className="option">
                            <label> Background Colour: </label>
                                <input type="text" name="backgroundColour" value={this.state.backgroundColour} onChange={this.handleChangeBackground} />
                        </div>
                        <div className="option">
                            <label> Stroke Colour: </label>
                                <input type="text" name="strokeColour" value={this.state.strokeColor} onChange={this.handleChangeStroke} />
                        </div>
                        <div className="option">
                            <label> Trail Colour: </label>
                                <input type="text" name="trailColour" value={this.state.trailColor} onChange={this.handleChangeTrail} />
                        </div>
                        <button className="configButton" onClick={this.saveConfig}>Save Config</button>
                    </div>
            </div>
        )
    }

}

export default Widget