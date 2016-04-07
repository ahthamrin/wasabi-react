import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import '../vendors/bxslider/jquery.bxslider.css';
import '../vendors/bxslider/jquery.bxslider.js';

export default class BxSlideShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSizeLarge: true,
      slideDeckTimestamp: 0,
      slideNoLocal: 0
    };
  }
  componentDidMount() {
    console.log('BxSlideShow componentDidMount');
    // using jQuery-touchswipe plugin
    this.slideShowEl = ReactDOM.findDOMNode(this.refs.slideshow);
    this.setState({isSizeLarge: this.props.sizeIsLarge});
    this.slider = null;
  }
  componentWillUnmount() {
    // $(this.slideShowEl).swipe("destroy");
    try {
      this.slider.destroySlider();
    }
    catch(e) {}
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.slideNoLocal != this.state.slideNoLocal) {
      console.log('BxSlideShow receive props', nextProps);
      this.setState({slideNoLocal: nextProps.slideNoLocal});
      if (this.slider && !this.slider.isWorking())
        this.slider.goToSlide(nextProps.slideNoLocal);
    }
  }
  shouldComponentUpdate(nextProps) {
    if (this.state.slideDeckTimestamp != nextProps.slideDeckTimestamp) {
      this.setState({slideDeckTimestamp: nextProps.slideDeckTimestamp});
      return true;
    }
    if (nextProps.sizeIsLarge !== this.state.isSizeLarge) {
      this.setState({isSizeLarge: this.props.sizeIsLarge});
      return true;
    }
    if (nextProps.slideNoLocal != this.state.slideNoLocal) {
      this.setState({slideNoLocal: nextProps.slideNoLocal});
      if (this.slider)
        this.slider.goToSlide(nextProps.slideNoLocal);
    }
    return false;
  }
  componentDidUpdate() {
    console.log('BxSlideShow componentDidUpdate');
    if (this.props.slideDeckLength) {
      if (this.slider)
        this.slider.destroySlider();
      $(this.slideShowEl).bxSlider({
        mode: this.props.isLecturer ? 'fade' : 'horizontal',
        adaptiveHeight: false,
        easing: 'ease',
        speed: this.props.isLecturer ? 0 : 300,
        pager: false,
        infiniteLoop: false,
        hideControlOnEnd: true,
        startSlide: this.state.slideNoLocal,
        controls: this.props.showCtrlBtn ? false : true,
        onSlideAfter: (el, oldIndex, newIndex) => {
          if (newIndex !== this.state.slideNoLocal)
            this.setState({slideNoLocal: newIndex});
          // console.log('Bx afterChange', this.state.slideNoLocal, newIndex);
          this.props.onSlideChange.call(null, oldIndex, newIndex)
        },
        // onSliderResize: () => { console.log('onSliderResize', this.props, arguments)},
      });
      this.slider = $(this.slideShowEl).data('bxSlider');
      console.log('slider', $(this.slideShowEl).data('bxSlider'));
    }
  }

  handleTouch = (event) => {
    console.log('handleTouch', event);
  }

  render() {
    console.log('BxSlideShow', this.props);
    var showCtrl = !this.props.showCtrlBtn ? 'hidden' : '';
    return (
      <div>
        <ul className='bxslider' ref='slideshow'>
          {
            this.props.slideDeckData.map((slide,idx) => {
              return(
                <li key={idx}><img src={slide.url} /></li>
              );
            })
          }
        </ul>
        <div className={showCtrl}>
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-default" onClick={() =>{console.log('click'); this.props.onFirst.call(null, 0)}}>
              <i className="fa fa-fast-backward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={() =>{this.props.onPrev.call(null, this.slider.getCurrentSlide())}}>
              <i className="fa fa-step-backward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={() =>{this.props.onNext.call(null, this.slider.getCurrentSlide())}}>
              <i className="fa fa-step-forward" aria-hidden="true"></i>
            </button>
            <button type="button" className="btn btn-default" onClick={() =>{this.props.onLast.call(null, this.props.slideDeckLength-1)}}>
              <i className="fa fa-fast-forward" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

BxSlideShow.propTypes = {
  isLecturer: PropTypes.bool,
  onSlideChange: PropTypes.func,
  onFirst: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  onLast: PropTypes.func
}
