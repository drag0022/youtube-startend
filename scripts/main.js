const APP = {
    key: '',
    init: ()=>{
        APP.listeners();
    },
    listeners: ()=>{
        document.getElementById('ytUrl').addEventListener('focusout', LINK.linkValidate);
    }
}
const AUTH = {
    key: 'AIzaSyBP_1wzI-fMFMIT-zQJVLT7snr-VmQDUAM',
    clientID: '593561666155-c1vb78e1i3e4gt7dcm9ajbh22969i9ot.apps.googleusercontent.com',
    gAuth: () => {
        function authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
            .then(function() { console.log("Sign-in successful"); },
                    function(err) { console.error("Error signing in", err); });
        }
        function loadClient() {
        gapi.client.setApiKey(`${AUTH.key}`);
        return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(function() { console.log("GAPI client loaded for API"); },
                    function(err) { console.error("Error loading GAPI client for API", err); });
        }
        //TODO Make sure the client is loaded and sign-in is complete before calling this method.
        function execute() {
            
        return gapi.client.youtube.videos.list({
            "part": [
            "snippet,contentDetails,statistics"
            ],
            "id": [
            `${LINK.videoId}`
            ]
        })
            .then(function(response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    //if video ID is found, save video details in VIDEO.data
                    if(response.result.items){
                        VIDEO.data = response.result.items[0];
                        console.log('video id', LINK.videoId);
                        
                        
                    } else {
                        console.log('0 results', response.result.items.length());
                    }
                    },
                    function(err) { console.error("Execute error", err); });
        }
        gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: `${AUTH.clientID}`});
        });
        authenticate().then(loadClient)
        execute()
}
}
const LINK = {
    input: '',
    videoId: '',
    linkValidate: (ev) => {
        ev.preventDefault();
        document.getElementById('ytUrlLabel').innerHTML = "";
        //checks if user input link is a youtube link
        if (document.getElementById('ytUrl').value.split(".").includes('youtube')){
            LINK.input =  document.getElementById('ytUrl').value;
            document.getElementById('ytUrlLabel').innerHTML = "Valid URL!";
            console.log('valid url');
            LINK.getId();
            AUTH.gAuth();
            VIDEO.showVideo();
        } else {
            // display error message in text field
            LINK.linkError();
            console.log('invalid url');
        }
        //trigger AUTH.gAuth() and get ID
        
    },
    linkError: () => {
        //TODO add css class linkError to change color of field to red
        let textField = document.getElementById('ytUrl');
        textField.classList.add('linkError');
        //TODO add css class linkErrorText to change color of text to red
        let textFieldLabel = document.getElementById('ytUrlLabel');
        textFieldLabel.innerHTML = `${textFieldLabel.innerHTML} <span class="linkErrorText">Enter a valid YouTube URL!</span>`;
    },
    getId: ()=> {
        //dissect user input youtube link to extract video ID
        console.log('getting the id');
        let url = document.getElementById('ytUrl').value;
        let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);
        if (match && match[2].length == 11) {
            LINK.videoId = match[2];
        } else {
                //error
                console.log('couldnt get the id');
            }
    }
}
const VIDEO = {
    data: [],
    showVideo: () => {
        //build HTML for details about video

        let videoThumb = document.querySelector('.videoThumb');
        console.log(videoThumb);
        videoThumb.src = VIDEO.data.snippet.thumbnails.high.url;
        videoThumb.alt = VIDEO.data.snippet.localized.title;

        let videoLength = document.querySelector('.videoLength');
        let length = VIDEO.data.contentDetails.duration;
        videoLength.innerHTML = `Length: ${length}`;

        let videoViews = document.querySelector('.videoViews');
        let views = VIDEO.data.statistics.viewCount;
        videoViews.innerHTML = `Views: ${views}`;
        
        let videoTitle = document.querySelector('.videoTitle');
        videoTitle.innerHTML = VIDEO.data.snippet.localized.title;
    }
}
document.addEventListener('DOMContentLoaded', APP.init);