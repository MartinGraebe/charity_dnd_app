import React from 'react'
import Winwheel from 'winwheel'
import {TweenMax} from 'gsap'
import wildMagic from './wildMagic'
import TwitchBotAdmin from './TwitchBotAdmin.js'
import WheelSelectItem from './WheelSelectItem'

import arrow from '../assets/pointerwheel.png'

 import { ipcRenderer} from 'electron'
 import {
    FETCH_TEXT_FROM_STORAGE,
    SAVE_TEXT_IN_STORAGE,
    HANDLE_FETCH_TEXT_FROM_STORAGE,
    HANDLE_SAVE_TEXT_IN_STORAGE,

    FETCH_CONFIG_FROM_STORAGE,
    SAVE_CONFIG_IN_STORAGE,
    HANDLE_FETCH_CONFIG_FROM_STORAGE,
    HANDLE_SAVE_CONFIG_IN_STORAGE
} from '../../utils/constants' 
import { createConfigItem } from '@babel/core';

 class WheelAdmin extends React.Component {

    constructor(){
        super()
        this.state = {

            canvasWidth: 880,
            canvasHeight: 550,
            prizePool: [],
            numberOfSeg: 8,
            sizeOfWheel: 212,
            xCenter: null,
            yCenter: null,
            fontSize: 24,
            canvasID: "myCanvas",
            wheelPower: 0,
            wheelSpinning: false,
            wheelObject: [],
            winningSegment: null,
            wheelCreated: false,
            elementCache: wildMagic,
            loadedList: [],
            textStuff: 'Enter the long description part here',
            newItemTitle: 'Enter short description here',
            chromaColour: 'green',
            textColour: '#FFFF',
            borderColour: '#FFFF',
            segmentColour: '#000000',
            config: [],
           
       
        }
        this.createdWheel = this.createdWheel.bind(this)
        this.startWheel = this.startWheel.bind(this)
        this.resetWheel = this.resetWheel.bind(this)
        this.alertPrize = this.alertPrize.bind(this)
        this.sendMessagetoChild = this.sendMessagetoChild.bind(this)
        this.findFullText = this.findFullText.bind(this)
        this.pickItems = this.pickItems.bind(this)
        this.updatePrizes = this.updatePrizes.bind(this)
        this.loadItems = this.loadItems.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.saveItems = this.saveItems.bind(this)

        this.loadConfig = this.loadConfig.bind(this)
        this.handleConfig = this.handleConfig.bind(this)
        this.saveConfig = this.saveConfig.bind(this)
        this.loadSavedConfig = this.loadSavedConfig.bind(this)
        this.createConfig = this.createConfig.bind(this)

        this.handleChangeInBox = this.handleChangeInBox.bind(this)
        this.handleChangeInTitle = this.handleChangeInTitle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
       
        this.handleChangeChroma = this.handleChangeChroma.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        this.handleChangeSegment = this.handleChangeSegment.bind(this)
        this.handleChangeBorder = this.handleChangeBorder.bind(this)

    }
    sendMessagetoChild(message){
        this.refs.TwitchBotAdmin.messageInChat(message)
    }
    componentDidMount(){
        
           
        
        
                console.log('loadSTuff')
                ipcRenderer.send(FETCH_TEXT_FROM_STORAGE, 'ping')
               ipcRenderer.on(HANDLE_FETCH_TEXT_FROM_STORAGE, this.loadItems)
               ipcRenderer.on(HANDLE_SAVE_TEXT_IN_STORAGE, this.handleSave) 

               ipcRenderer.send(FETCH_CONFIG_FROM_STORAGE, 'ping')
               ipcRenderer.on(HANDLE_FETCH_CONFIG_FROM_STORAGE, this.loadConfig)
               ipcRenderer.on(HANDLE_SAVE_CONFIG_IN_STORAGE, this.handleConfig) 
              
               
       
    }
    componentWillUnmount(){
        ipcRenderer.removeListener(HANDLE_FETCH_TEXT_FROM_STORAGE, this.loadItems)
        ipcRenderer.removeListener(HANDLE_SAVE_TEXT_IN_STORAGE, this.handleSave) 

        ipcRenderer.removeListener(HANDLE_FETCH_CONFIG_FROM_STORAGE, this.loadConfig)
        ipcRenderer.removeListener(HANDLE_SAVE_CONFIG_IN_STORAGE, this.handleConfig) 
    }

    componentDidUpdate(){
        
    }

  /* SAVING CONTENT*/
    loadItems(event, data){
        const { text } = data
        if (text != null){
            this.setState({
                elementCache: text,
            })
            console.log (this.state.elementCache, 'loaded')
        }
        else console.log('No save file')

    }
    handleSave(event,data){
        console.log(data,'Save submitted')
    }
    saveItems(){
        console.log('List has been saved')

        ipcRenderer.send(SAVE_TEXT_IN_STORAGE, this.state.elementCache)

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
            borderColour: config[2],
            segmentColour: config[3]

        })
    }
    handleConfig(event,data){
        console.log(data,'Config submitted')
    }
  async  saveConfig(){
        console.log('Config has been saved')
        await this.createConfig()
        ipcRenderer.send(SAVE_CONFIG_IN_STORAGE, this.state.config)

    }
    async createConfig(){
        const {chromaColour, textColour, borderColour, segmentColour} = this.state
        const cache = [chromaColour, textColour, borderColour, segmentColour]
        this.setState({
            config: cache

        })
    }
    /* delete item from list */
    deleteItem(){
        const {elementCache} = this.state
        let newCache = elementCache.filter(item => item.inUse == false)
        
        this.setState({
            elementCache: newCache
        })
     

    }
    
 async   createdWheel(){
      
    await  this.updatePrizes()
        let segMents = []
            for(let i = 0; i < this.state.prizePool.length; i++ ) {
               
                let help = {'fillStyle' : this.state.segmentColour, 'text' : this.state.prizePool[i] }
               
                segMents.push(help)
            }
        if (segMents.length != 0) { 
            let theWheel = new Winwheel({

                'canvasId'    : this.state.canvasID,
                'numSegments' : this.state.prizePool.length,
                'outerRadius' : this.state.sizeOfWheel,
                'centerX'     : this.state.xCenter,
                'centerY'     : this.state.yCenter,
                'textFontFamily': 'BebasNeueRegular',
                'textFontSize': this.state.fontSize,
                'strokeStyle' : this.state.borderColour,
                'textFillStyle': this.state.textColour,
                'segments'    : segMents,
                'animation'   : 
                {
                        'type'     : 'spinToStop',
                        'duration' : 5,
                        'spins'    : 8,
                    'callbackFinished' : this.alertPrize,
                }
            })
            this.setState({
                wheelObject: theWheel,
                wheelCreated: true
            })
            
        }
        else alert("Please Select Items first")

    }
    startWheel(){
        if (this.state.wheelSpinning == false) {
            
        }  
        
        this.state.wheelObject.startAnimation(true)  
        this.setState({
            wheelSpinning: true

        })

    }
    resetWheel(){
       
    if (this.state.wheelCreated ){
            let theWheel = this.state.wheelObject
            theWheel.stopAnimation(false)
            theWheel.rotatingAngle = 0
            theWheel.draw()
            this.createdWheel()
            this.setState({
                wheelSpinning: false
        })
    }
    }
    alertPrize(indicatedSegment){

        
        this.setState({
            winningSegment: indicatedSegment.text,
        })
        let text = this.findFullText(indicatedSegment.text)
       this.sendMessagetoChild(text)
        console.log(text,"alertPrize")
        console.log(indicatedSegment.text)
    }
    findFullText(message){
        let text = ""
        const toLookthrough = this.state.elementCache
        
        for(let i = 0; i < toLookthrough.length; i++ ) {
            let stringToSearch = toLookthrough[i].label
           
            if (stringToSearch === message ){
               console.log("BREAK")
               text = toLookthrough[i].label + " - " + toLookthrough[i].fullText
              
                break
             
           }
            
           
            
           
           
           
        }
        return text
    }
   async pickItems(id){
       
     await  this.setState( prevState => {
        
            const updatedCache = prevState.elementCache.map(item => {

                if(item.id === id ){
                    item.inUse = !item.inUse
                }
                return item
            })
            return {
                elementCache: updatedCache
            }
       })
       this.updatePrizes()
      
       this.resetWheel()
    }
   async updatePrizes(){

        const updatedPrizes = this.state.elementCache.filter( (item) => {
            return item.inUse
        }).map((item)=> {
            return item.label
        })
       
        this.setState({

            prizePool: updatedPrizes
        })
    }
    handleChangeInBox(event){
     
        this.setState({textStuff: event.target.value})
        
    }
    handleChangeInTitle(event){
       
        this.setState({newItemTitle: event.target.value})
        
    }
   async handleSubmit(event){

        let temp = this.state.elementCache
        let n = temp.length - 1
        let ID = temp[n].id

        let add = {id: n+2, label: this.state.newItemTitle, fullText: this.state.textStuff, fillStyle: "#eae56f", inUse: false }

       
       let array = this.state.elementCache
       array.push(add)
      
        this.setState({
            elementCache: array ,
            newItemTitle: 'Enter short description here',
            textStuff: 'Enter the long description part here'

        })
      
        event.preventDefault()

    }
      /* Event handler for the Chroma Key field */
      handleChangeChroma(event){
        
        this.setState({chromaColour: event.target.value})
         
    }
    handleChangeText(event){
        this.setState({textColour: event.target.value})

    }
    handleChangeBorder(event){
        this.setState({borderColour: event.target.value})

    }
    handleChangeSegment(event){
        this.setState({segmentColour: event.target.value})

    }
    render(){
      const wheelItems =  this.state.elementCache.map(item => <WheelSelectItem key={item.id} item={item} handleChange={this.pickItems }/>)
        return (

            <div className="Content">
               <div className="wheel-back" style={{ backgroundColor: this.state.chromaColour}}>
                   <div className="canvas-house">
                    <canvas 
                        id={this.state.canvasID}
                        width={this.state.canvasWidth}
                        height={this.state.canvasHeight}
                        ref="canvas"
                    /> 
                    <img className="pointer" src={arrow} alt="V"  />
                  
                    </div>
                    </div>
                 <div className="sub-content"> 
                <div  className="Button-hold"> 
                    { ! this.state.wheelCreated ? <button className="myButton" onClick={this.createdWheel}>Create Wheel </button> : null }
                    {  this.state.wheelCreated && ! this.state.wheelSpinning ? <button className="myButton" onClick={this.startWheel}>Start</button> : null }
                    {  this.state.wheelCreated && this.state.wheelSpinning ? <button className="myButton" onClick={this.resetWheel}>Reset</button> : null }
                    <TwitchBotAdmin ref="TwitchBotAdmin" />
                    </div>
                    <div >
            
                        


                    </div>
                  
                    <div>
                    <form className="form-list" onSubmit={this.handleSubmit}>     
                                
                                <input type="text" name="shortTitle" value={this.state.newItemTitle} onChange={this.handleChangeInTitle} />
                                <textarea  
                                    value={this.state.textStuff}
                                    onChange={this.handleChangeInBox}
                                />
                                
                                <input type="submit" className="myButton" value="Add Item" />
                        </form>
                        <div className="Button-hold">
                                        <button className="myButton" onClick={this.saveItems}>Save List</button>
                            {  !this.state.wheelCreated ? <button className="myButton" onClick={this.deleteItem}>Delete Item</button> : null }
                          
                        </div>
               
                    </div>
                   
                </div>
                
                <div className="list">
                        {wheelItems}
                        
                    </div>

                <div className="list">
                    <div className="option">
                    <label> Chroma Key: </label>
                        <input type="text" name="chroma" value={this.state.chromaColour} onChange={this.handleChangeChroma} />
                    </div>
                    <div className="option">
                    <label> Text Colour: </label>
                        <input type="text" name="textColour" value={this.state.textColour} onChange={this.handleChangeText} />
                    </div>
                    <div className="option">
                        <label> Border Colour: </label>
                            <input type="text" name="borderColour" value={this.state.borderColour} onChange={this.handleChangeBorder} />
                    </div>
                    <div className="option">
                        <label> Segment Colour: </label>
                            <input type="text" name="segmentColour" value={this.state.segmentColour} onChange={this.handleChangeSegment} />
                    </div>
                    <button className="configButton" onClick={this.saveConfig}>Save Config</button>
                </div>
                
               
    
      
         
      
      
   
   

               
            </div>
        )
    }

}
export default WheelAdmin 