import React from 'react';
import AltContainer from 'alt-container';

import LiveClassActions from '../actions/LiveClassActions';
import LiveClassStore from '../stores/LiveClassStore';
import MediaActions from '../actions/MediaActions';
import MediaStore from '../stores/MediaStore';
import AlertActions from '../actions/AlertActions';

import BxSlideShow from '../components/BxSlideShow.jsx';
import VideoLocal from '../containers/VideoLocal.jsx';
import StudentCapture from '../components/StudentCapture.jsx';


export default class TestSlideShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      webRTC: false
    };

    this.rtcConnected = false;
    this.localStream = null;
  }

  componentDidMount() {
    LiveClassActions.subscribe({slideDeckId:100, user: {username:'aht', role:'student'}});

  }
  componentWillUnmount() {
    // SlideActions.unsubscribe(100);
  }
  componentWillReceiveProps() {
    console.log('TestSlideShow receive props', arguments);
  }

  // slides
  handleSlideChange = (oldIndex, newIndex) => {
    // console.log('slidechange', oldIndex, newIndex);
  }
  handleSlideFirst = (event) => {
    var slideStore = LiveClassStore.getState();

    SlideActions.gotoSlide({slideNoLocal: 0});
  }
  handleSlideLast = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    SlideActions.gotoSlide({slideNoLocal: slideLength-1});
  }
  handleSlidePrev = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    SlideActions.gotoSlide({slideNoLocal: slideNo > 0 ? slideNo - 1 : 0 });
  }
  handleSlideNext = (event) => {
    var slideStore = LiveClassStore.getState();
    var slideNo = slideStore.slideNoLocal;
    var slideLength = slideStore.slideDeckLength;

    LiveClassActions.gotoSlide({slideNoLocal: slideNo < slideLength-1 ? slideNo + 1 : slideLength-1 });
  }


  render() {
    console.log('TestSlideShow', this.props);
    return(
      <div>
      <div className='row'>
        <div className='col-xs-12 col-sm-9'>
        <AltContainer
          store={SlideStore}
        >
          <BxSlideShow
            showIfVideoLarge={false}
            onFirst={this.handleSlideFirst}
            onLast={this.handleSlideLast}
            onPrev={this.handleSlidePrev}
            onNext={this.handleSlideNext}
            onSlideChange={this.handleSlideChange}
          />
        </AltContainer>
        </div>
        <div className='col-xs-12 col-sm-3'>
        <button type='button' className='btn btn-default'>RTC Test</button>
        </div>
      </div>
      <div className='container-fluid'>
      </div>
      </div>
    );
  }
}
