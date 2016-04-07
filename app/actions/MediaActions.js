import alt from '../libs/alt';

function MediaActions() {
	this.generateActions('sendCapture', 'connectVideo', 'disconnectVideo', 'stopLocalStream', 'startReceiveCapture', 'stopReceiveCapture');
}
MediaActions.prototype.startLocalStream = function(constraints) {
	return ((dispatch) => {
		navigator.getUserMedia(constraints, 
			(stream) => dispatch(stream),
			(error) => {
				console.warn('setLocalStream error', error);
				dispatch()
			}
		);
	});
}

export default alt.createActions(MediaActions);
// export default alt.generateActions('setLocalStream', 'sendCapture', 'connectVideo', 'disconnectVideo');
// console.log('MediaActions', myActions);
// export default myActions;