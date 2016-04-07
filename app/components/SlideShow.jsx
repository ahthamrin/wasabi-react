import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import StudentUIStore from '../stores/StudentUIStore';
import AlertActions from '../actions/AlertActions';


export default class SlideShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSlide: true
    };
  }
  componentDidMount() {
    // using jQuery-touchswipe plugin
    this.slideShowEl = ReactDOM.findDOMNode(this.refs.slideImg);

    $(this.slideShowEl)
    .on('swipe', this.handleTouch)
    .on('tap', this.handleTouch)
    .on('vmousemove', this.handleTouch)
    ;
    // $(this.slideShowEl).swipe({
    //   tap: (event, target) => {console.log('tap', event, target);},
    //   doubleTap: (event, target) => {console.log('doubleTap', event, target);},
    //   longTap: (event, target) => {console.log('longTap', event, target);},
    //   swipe: (event, direction, distance, duration, fingerCount, fingerData) => {
    //     switch(direction) {
    //       case 'left':
    //         this.props.onNext();
    //         break;
    //       case 'right':
    //         this.props.onPrev();
    //         break;
    //     }
    //   }
    // });
    StudentUIStore.listen(this.handleStudentUIStore);

    this.setState({showSlide: this.props.showIfVideoLarge === StudentUIStore.getState().videoLarge});
  }
  componentWillUnmount() {
    // $(this.slideShowEl).swipe("destroy");
    $(this.slideShowEl)
    .off('swipe', this.handleTouch)
    .off('tap', this.handleTouch)
    ;
    StudentUIStore.unlisten(this.handleStudentUIStore);
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    try {
      if (
           nextProps.slideNoLocal !== this.props.slideNoLocal
        || nextProps.slideDeckData !== this.props.slideDeckData
        || nextState.showSlide !== this.state.showSlide
        )
        return true;

      return false;
    }
    catch(e) {
      return true;
    }
  }

  handleTouch = (event) => {
    console.log('handleTouch', event);
  }
  handleStudentUIStore = (state) => {
    this.setState({showSlide: this.props.showIfVideoLarge === state.videoLarge});
  }

  render() {
    console.log('slideshow', this.props);
    var slideUrl = null;
    try {
      slideUrl = this.props.slideDeckData[this.props.slideNoLocal].url;
    }
    catch (e) {}
    var showSlide = this.state.showSlide ? '' : 'hidden';
    var showCtrl = this.props.showIfVideoLarge ? 'hidden' : '';
    return (
      <div className={showSlide}>
        <div ref="slideImg" onClick={this.props.onSlideClick}><img src={slideUrl} className="slide-show" /></div>
        <div className={showCtrl}>
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-default" onClick={this.props.onFirst}>
              <i className="fa fa-fast-backward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onPrev}>
              <i className="fa fa-step-backward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onNext}>
              <i className="fa fa-step-forward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onLast}>
              <i className="fa fa-fast-forward" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SlideShow.propTypes = {
  showIfVideoLarge: PropTypes.bool.isRequired,
  onSlideClick: PropTypes.func,
  onFirst: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  onLast: PropTypes.func
}
