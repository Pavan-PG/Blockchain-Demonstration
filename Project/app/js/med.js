import EmbarkJS from 'Embark/EmbarkJS';
import web3 from 'Embark/web3';

const PRIVATE_MESSAGE_REGEX = /^\/msg (0x[A-Za-z0-9]{130}) (.*)$/;
const MEDICAL_CHANNEL = "Medical";


EmbarkJS.onReady(async (err) => {
    if (err) {
        alert("EmbarkJS is not available");
        return;
    }

    const channelName = document.getElementById('channel-name')
    channelName.innerHTML = MEDICAL_CHANNEL;

    const channelSymKey = await web3.shh.generateSymKeyFromPassword(MEDICAL_CHANNEL);


    const pubKey = await web3.shh.getPublicKey(EmbarkJS.Messages.currentMessages.sig);


    document.getElementById('chat-form').onsubmit = (e) => {
        e.preventDefault();

        const message = document.getElementById('input-text').value;
        if (message.startsWith('/msg')) {
            if (PRIVATE_MESSAGE_REGEX.test(message)) {
                const msgParts = message.match(PRIVATE_MESSAGE_REGEX);
                const contactCode = msgParts[1];
                const messageContent = msgParts[2];

                EmbarkJS.Messages.sendMessage({
                    pubKey: contactCode,
                    topic: MEDICAL_CHANNEL,
                    data: messageContent
                });



                // Since we cannot receive private messages sent to someone else, we need to add it manually on the UI
                addMessage(messageContent, new Date().getTime() / 1000);
            }
        } else {
            EmbarkJS.Messages.sendMessage({
                symKeyID: channelSymKey,
                topic: MEDICAL_CHANNEL,
                data: message
            });
        }
    }


    EmbarkJS.Messages.listenTo({
        topic: [MEDICAL_CHANNEL],
        symKeyID: channelSymKey
    }, (error, message) => {
        if (error) {
            alert("Error during subscription");
            return;
        }

        const { data, time } = message;

        addMessage(data, time);
    });



    EmbarkJS.Messages.listenTo({
        usePrivateKey: true,
        privateKeyID: EmbarkJS.Messages.currentMessages.sig
    }, (error, message) => {
        if (error) {
            alert("Error during subscription");
            return;
        }

        const { data, time } = message;
        addMessage(data, time);
    });




    const contactCode = document.getElementById('contact-code')
    contactCode.innerHTML = pubKey;

    const addMessage = (data, time) => {
        // Create new li for chat text 
        const li = document.createElement('li');
        const timeSpan = document.createElement("span");
        const p = document.createElement("p");

        const timeFormat = (new Date(time * 1000).toLocaleTimeString());

        const attr = document.createAttribute("class");
        attr.value = "time";

        timeSpan.append(document.createTextNode(timeFormat));
        timeSpan.setAttributeNode(attr);

        p.appendChild(document.createTextNode(data));

        li.appendChild(timeSpan);
        li.appendChild(p);

        const chatText = document.getElementById('chat-text');
        chatText.appendChild(li);

        // Scroll div
        const chatArea = document.getElementById("chat-area");
        chatArea.scrollTop = chatArea.scrollHeight;

        // Clear text area
        document.getElementById('input-text').value = "";
    }
});
