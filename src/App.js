
import React from "react";
import styled, { css, keyframes } from 'styled-components';


//we will be changing following variables all the time
let left = 0; //left style property of our carousel
let leftOn100Percents = 0; //left property of animation on 100%
let shouldIUseAnimation = false; //this variable defines if our app should use animation
let carouselWidth = 0; //we'll need this variable, if we change the resolution and we need to change amount of slides on one page

function returnWidth() {
  return css`${carouselWidth}`;
}

// following function returns dynamical animation
function animation(){
  return shouldIUseAnimation==true ? css`${
      keyframes`
        0%{
          left: ${left}px;
        }
        100%{
          left: ${leftOn100Percents}px;
        }`
  }` : null;
}

//i couldn't pass animation to div element without using styled.div
const Elements = styled.div.attrs(props => ({//i solved "over 200 classes generated" warning by using attrs method
  style: {
    left: props.left,
  },
}))`
  position: absolute;
  display: grid;
  height: 100%;
  width: ${returnWidth}%;
  grid-template-columns: repeat(20, 1fr);
  animation-name: ${animation};
  animation-duration: 1s;
  animation-fill-mode: forwards;
  left: ${left}px;
`

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0, //current page number
      touchX: 0, //x coordinate of touch/click
      resolutionWidth: 0, //width of our screen
      swipingRight: false, //shows if we're swiping right
      swipingLeft: false, //shows if we're swiping left
      mouseIsDown: false, //shows if mouse is down
      amountOfSlidesOnPage: 0 // slides on page
    };

    this.slideWidthRef = React.createRef(); //we need define ref to get width of our screen
    this.carouselWidthRef = React.createRef();
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.mouseStart = this.mouseStart.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseEnd = this.mouseEnd.bind(this);
  }


  //we set a timer to check every 0.05 seconds if screen resolution has changed
  componentDidMount () {
    this.interval = setInterval(() => this.setResolution(), 50);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  //in this function we control resolution
  setResolution () {
    this.setState({});
    const width = this.slideWidthRef.current.getBoundingClientRect().width;
    if(this.state.resolutionWidth !== width) {
      left = -(this.state.pageNum*width);
      leftOn100Percents = -(this.state.pageNum*width);
      this.setState({
        resolutionWidth: width,
        amountOfSlidesOnPage: this.carouselWidthRef.current.getBoundingClientRect().width/width
      });
    }

    //we need following code to avoid situations like we are on last slide and rotating our device horizontally
    if(this.state.pageNum>Math.round(19-this.state.amountOfSlidesOnPage+1)){
      left = -((19-this.state.amountOfSlidesOnPage+1)*width);
      leftOn100Percents = left;
      this.setState({
        pageNum: Math.round(19-this.state.amountOfSlidesOnPage+1)
      });
    }

    //amount of slides on one page is depended on screen width
    if(this.carouselWidthRef.current.getBoundingClientRect().width<500) carouselWidth = 2000;
    else if(this.carouselWidthRef.current.getBoundingClientRect().width<1200) carouselWidth = 1000;
    else carouselWidth = 2000/3;
  }


  //we use this function when our slide is being dragged
  swipe (distance) {
    left = -this.state.pageNum*this.slideWidthRef.current.getBoundingClientRect().width;
    const touchScreenWidth = this.state.resolutionWidth;
    if(distance>0 && this.state.pageNum<(19-this.state.amountOfSlidesOnPage+1)){
      left = -this.state.pageNum*touchScreenWidth - distance;
      leftOn100Percents = left;
      this.setState({
        swipingRight: true,
        swipingLeft: false
      });
    }

    else if(distance<0 && this.state.pageNum>0){
      left = -this.state.pageNum*touchScreenWidth - distance;
      leftOn100Percents = left;
      this.setState({
        swipingRight: false,
        swipingLeft: true
      });
    }
  }


  //we use this function when our slide stops being dragged
  endingAnimation () {
    //we enable using animation and changing it's 100% left and state pageNum value
    const touchScreenWidth = this.state.resolutionWidth;
    shouldIUseAnimation = true;
    const finalDistance =this.state.swipingRight==true ? (touchScreenWidth*this.state.pageNum-left)-touchScreenWidth*this.state.pageNum : (touchScreenWidth*this.state.pageNum+left) + touchScreenWidth*this.state.pageNum;
    if(this.state.swipingRight===true || this.state.swipingLeft===true){
      if (finalDistance > touchScreenWidth / 2 || finalDistance > touchScreenWidth) {
        let a = this.state.swipingRight == true ? this.state.pageNum + 1 : this.state.pageNum - 1;
        this.setState({
          pageNum: a
        })
        leftOn100Percents = -a * touchScreenWidth;
      } else {
        leftOn100Percents = -this.state.pageNum * touchScreenWidth;
        this.setState({});
      }
    }
  }

  touchStart (event) { //this function runs on touch
    this.setState({
      touchX : event.touches[0].clientX
    });
  }

  touchMove (event) { //this function runs on touch swipe
    let distance = this.state.touchX-event.touches[0].clientX;
    shouldIUseAnimation = false;
    this.swipe(distance);
  }

  touchEnd () { //this function runs on
    this.endingAnimation();
    this.setState({
      swipingRight: false,
      swipingLeft: false
    });
  }

  /*
  mouse events use the same code as touch events (we also define mouseIsDown state)
   */
  mouseStart (event) {
    this.setState({
      touchX : event.clientX,
      mouseIsDown : true
    });
  }

  mouseMove (event) {
    if(this.state.mouseIsDown==true){
      let distance = this.state.touchX - event.clientX;
      shouldIUseAnimation = false;
      this.swipe(distance);
    }
  }

  mouseEnd (event) {
    this.endingAnimation();

    this.setState({
      swipingRight: false,
      swipingLeft: false,
      mouseIsDown: false
    });
  }


  render() {
    return (
        <div id="frame">
          <div id = "carousel" ref={this.carouselWidthRef}>
            <Elements left={left} id="elements"  onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd} onMouseDown={this.mouseStart} onMouseMove={this.mouseMove} onMouseUp={this.mouseEnd}>
              {this.props.SHADESOFBLUE.map((elem) =>  <div ref={this.slideWidthRef} style={{"backgroundColor": elem[1]}} className={"colorPage"} key={elem[0]}><h1>{elem[0]}</h1></div>)}
            </Elements>
          </div>
        </div>
    )
  }
}

export default App;

