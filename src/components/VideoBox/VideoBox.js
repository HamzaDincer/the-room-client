import React, { useEffect, useRef, useState } from 'react';
import { socket, peer } from '../../socket';
import "./VideoBox.scss"
import SpeechToText from '../../components/SpeechToText/SpeechToText';
function VideoBox(props){

    const videoRef = useRef(null);

    useEffect(() => {

        videoRef.current.srcObject = props.src.stream;
        videoRef.current.onloadedmetadata = function(e) {
            videoRef.current.play();
        };


    },[props.src]);


    return (
        <div className="video-box" >
            <video className="video-stream" ref={videoRef} muted={props.isLocal}  />
        </div>
    );

};

export default function VideoGrid(props){

    const [videoSources, setVideoSources] = useState([]);
    let myVideoStream = {'id': socket.id , 'stream':props.myVideoStream} ;
    
    useEffect(() => {

        peer.on('open', id => { 
            myVideoStream.id = id ;
            socket.emit('join-room','1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', id);
        });
    
        // When we receive call from others
        // (This happens from every other users when we join a room)
        peer.on('call', call => { 

            if (!props.isAccessGranted) {
                console.log('Camera and microphone access has not been granted yet.');
                return;
              }
    
            // Stream them our video/audio
            call.answer(myVideoStream.stream) 

            call.on('stream', userVideoStream => { 
                setVideoSources(videoSources => {
                    if(!videoSources.some(e => e.id === call.peer)){
                        return [ ...videoSources,{'id': call.peer , 'stream':userVideoStream}];
                    }else{
                       return videoSources;
                    }
                });
            });
    
            // Log when an error happen on the call
            call.on("error", (err) => {
                console.log(err);
            });
    
        });
    
        // If a new user connect
        socket.on('user-connected', userId => { 

            // Call the new user
            const call = peer.call(userId, myVideoStream.stream);
            console.log('user connected')
    
            call.on("stream", userVideoStream => {
                console.log('received new user' )
                setVideoSources([ ...videoSources, {'id': userId , 'stream':userVideoStream}]);
            });
    
            // If they leave, remove their video (doesn't work)
            // call.on('close', () => {
            //     video.remove();
            // });
    
            //If the call gives an error
            call.on("error", (err) => {
                console.log(err);
            });


        });
    
        // If a user disconnect
        socket.on('user-disconnected', userId => { 
            setVideoSources(videoSources => videoSources.filter(a => a.id !== userId));
        });
        
        // listVideoBoxes = videoSources.map(source => <VideoBox src={source}  />);


        return () => {

            socket.off('user-connected');
            socket.off('user-disconnected');
            peer.off('open');
            peer.off('call');
        
        };

    });

    return(
        <>
        <div id="video-grid" className="">
            <VideoBox src={myVideoStream} isLocal muted/>
            {videoSources.map(source => (
                <VideoBox key={myVideoStream.id} src={source} isLocal={false}/>
            ))}
        </div>
        <SpeechToText />
        </>
    );

};