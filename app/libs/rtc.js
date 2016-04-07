const rtc = {
	configuration : {
		iceServers: [ {urls: "stun:stun.l.google.com:19302"} ]
	},
	sdpConstraintsReceive : {
		'mandatory': {
      'OfferToReceiveAudio':true, 
      'OfferToReceiveVideo':true 
    }
	},
	sdpConstraintsSend : {
		'mandatory': {
      'OfferToReceiveAudio':false, 
      'OfferToReceiveVideo':false
    }
	},
	audioOnly : {video: false, audio: true},
	videoOnly : {video: true, audio: false},
	videoHD: function (a = true ) {return  { audio: a, video: {mandatory: { minWidth: 1280, maxWidth: 1280 }}} },
	video640: function (a = true ) {return  { audio: a, video: {mandatory: { maxWidth: 640 }}} },
	video320: function (a = true ) {return  { audio: a, video: {mandatory:{ maxHeight: 240, maxWidth: 320 }}} },
	video240: function (a = true ) {return  { audio: a, video: {mandatory: { maxHeight: 180, maxWidth: 240 }}} },
	desktop : {video: {mandatory: {chromeMediaSource: 'desktop'}}}
}

if (window) {
	if (!window.RTCPeerConnection) {
    window.RTCPeerConnection = window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection || window.msRTCPeerConnection;
  }
	if (!window.RTCSessionDescription) {
    window.RTCSessionDescription = window.webkitRTCSessionDescription ||
    window.mozRTCSessionDescription || window.msRTCSessionDescription;
  }
	if (!window.RTCIceCandidate) {
    window.RTCIceCandidate = window.webkitRTCIceCandidate ||
    window.mozRTCIceCandidate || window.msRTCIceCandidate;
  }
}

if (navigator) {
	if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
	}
}

export default rtc;