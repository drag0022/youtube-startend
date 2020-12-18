const APP = {
    key: '',
    init: ()=>{
        APP.listeners();
    },
    listeners: ()=>{
        document.getElementById('ytUrl').addEventListener('focusout', LINK.linkValidate);
    }
}
const LINK = {
    input: '',
    linkValidate: () => {
        document.getElementById('ytUrlLabel').innerHTML = "";
        //checks if user input link is a youtube link
        if (document.getElementById('ytUrl').value.split(".").includes('youtube')){
            LINK.input =  document.getElementById('ytUrl').value;
            document.getElementById('ytUrlLabel').innerHTML = "Valid URL!";
            console.log('valid url');
            console.log(LINK.input);
        } else {
            // display error message in text field
            LINK.linkError();
            console.log('invalid url');
        }
    },
    linkError: () => {
        //TODO add css class linkError to change color of field to red
        let textField = document.getElementById('ytUrl');
        textField.classList.add('linkError');
        //TODO add css class linkErrorText to change color of text to red
        let textFieldLabel = document.getElementById('ytUrlLabel');
        textFieldLabel.innerHTML = `${textFieldLabel.innerHTML} <span class="linkErrorText">Enter a valid YouTube URL!</span>`;
    },
}
document.addEventListener('DOMContentLoaded', APP.init);