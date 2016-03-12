import React from 'react';
import ReactDOM from 'react-dom';

export default class SlideShow extends React.Component {
  componentDidMount() {
    // using jQuery-touchswipe plugin
    this.slideShowEl = ReactDOM.findDOMNode(this.refs.slideImg);
    $(this.slideShowEl).swipe({
      swipe: (event, direction, distance, duration, fingerCount, fingerData) => {
        switch(direction) {
          case 'left':
            this.props.onNext();
            break;
          case 'right':
            this.props.onPrev();
            break;
        }
      }
    });
  }
  componentWillUnmount() {
    $(this.slideShowEl).swipe("destroy");
  }
  render() {
    // var slideUrl = null; //this.state.slideDeckData[state.slideIdLecturer].url;
    console.log('slideshow', this.props);
    var slideUrl = null;
    try {
      slideUrl = this.props.slides.slideDeckData[this.props.slides.slideNoLocal].url;
    }
    catch (e) {}
    console.log('SlideShow', slideUrl);
    return (
      <div>
        <div ref="slideImg" onClick={this.props.onSlideClick}><img src={slideUrl} className="slide-show" /></div>
        <div>
          <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-default" onClick={this.props.onFirst}>
              <span className="glyphicon glyphicon-fast-backward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onPrev}>
              <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onNext}>
              <span className="glyphicon glyphicon-forward" aria-hidden="true"></span>
            </button>
            <button type="button" className="btn btn-default" onClick={this.props.onLast}>
              <span className="glyphicon glyphicon-fast-forward" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
