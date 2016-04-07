import React from 'react'
import ReactDOM from 'react-dom';
import MediaStore from '../stores/MediaStore';

export default class StudentCapture extends React.Component {
  constructor(props) {
    super(props);

    this.state = {images:[]};
  }
  componentDidMount() {
    this.captureTimeout = 0;
    this.updateImages();  
  }
  componentWillUnmount() {
    window.clearTimeout(this.captureTimeout);
  }

  updateImages() {
    this.captureTimeout = window.setTimeout(() => {
      var mediaStore = MediaStore.getState();
      var currentTime = (new Date()).getTime();
      var currentImages = mediaStore.studentCaptureImages.filter((image) => {
        if (image.timestamp < currentTime - 10000)
          return false;
        return true;
      })
      this.setState({images: currentImages});
      this.updateImages();
    }, 1000);
  }

  render() {
    // console.log('StudentCapture',this.state);
    return(
      <div className='row'>
        {
          this.state.images.map((image, idx) => {
            return(
              <div key={idx} className='image-10pct'>
                <img src={image.jpg} className='media-show' alt={image.username} title={image.username}/>
              </div>
            );
          })
        }
      </div>
    )
  }
}
