// Overlay functionality
// callbacks
function CB_toggleLike() {
    const likeButton = document.querySelector('.like-button');
    likeButton.classList.toggle('liked');
}

function CB_buy(){};
function CB_mint(){};

function CB_artwork_picked(index) {
	return function() {
		manual_navigation_idx = index;
		manual_move();
	};
}


//rest of utility functions

function manual_move(){
	//get active camera
	const camera = scene.activeCamera;
	const camera_distance = [4, 6];


	var gallery=config_file_content[current_gallery];
	var dict_items=Object.keys(gallery).filter(key => gallery[key]["resource_type"]== "image");
	if (dict_items.length ==0) return;
	var n_items=dict_items.length;

	//check limits
	if (manual_navigation_idx<0){
		manual_navigation_idx= n_items-1;
	} else if (manual_navigation_idx ==n_items){
		manual_navigation_idx=0;
	}


	//get position and vector. Assuming they are JSON strings of 3-element arrays [x, y, z]
	let item_position_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['location']);
	let item_vector_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['vector']);

	// Create Babylon.js Vector3 objects
	const target_position = new BABYLON.Vector3(item_position_array[0], item_position_array[2], item_position_array[1]);
	const target_vector = new BABYLON.Vector3(item_vector_array[0], item_vector_array[2], item_vector_array[1]).normalize();

	// Calculate the camera's position to be in front of the item
	let camera_position;
	if  (window.innerWidth>600){
	    camera_position = target_position.add(target_vector.scale(camera_distance[0]));
	}
	else {
	    camera_position = target_position.add(target_vector.scale(camera_distance[1]));
	}

	// Aim the camera at the target
	camera.position = camera_position;
	camera.setTarget(target_position);

	showInfoBox("Title:  " + gallery[dict_items[manual_navigation_idx]]["metadata"], dict_items[manual_navigation_idx]);


}

function manual_move_backward(){
	manual_navigation_idx--;
	manual_move();
}

function manual_move_forward(){
	manual_navigation_idx++;
	manual_move();
}

// show metadata or other info
function showInfoBox(title, artworkId) {
    document.getElementById("artwork-info").innerText = title;
    //enable action buttons
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = false;
    });

    const chatButton = document.createElement('button');
    chatButton.classList.add('action-button');
    chatButton.innerText = 'Chat';
    chatButton.onclick = () => openChat(artworkId);
    
    const actionButtons = document.querySelector('.action-buttons');
    // clear existing buttons before adding new ones
    actionButtons.innerHTML = '';
    actionButtons.appendChild(chatButton);
}

function hideInfoBox() {
    document.getElementById("artwork-info").innerText = "";
    //disable action buttons. Called when entering a new gallery
    document.querySelectorAll('.action-button').forEach(button => {
        button.disabled = true;
    });
    const likeButton = document.querySelector('.like-button');
    if (likeButton) {
        likeButton.classList.remove('liked');
    }
}



// Help popup functionality
function toggleHelp() {
    const helpPopup = document.getElementById('help-popup');
    helpPopup.style.display = helpPopup.style.display === 'none' ? 'block' : 'none';
}

function changeLanguage(lang) {
    // Remove active class from all language buttons and texts
    document.querySelectorAll('.lang-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.help-text').forEach(text => text.classList.remove('active'));
    
    // Add active class to selected language button and text
    document.querySelector(`.lang-button[onclick="changeLanguage('${lang}')"]`).classList.add('active');
    document.querySelector(`.help-text.${lang}`).classList.add('active');
}

// Chat functionality
let currentArtworkId = null;

function openChat(artworkId) {
    currentArtworkId = artworkId;
    document.getElementById('chat-container').style.display = 'flex';
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear previous messages
    addMessageToChat('ai', `안녕하세요! '${artworkId}'에 대해 무엇이 궁금하신가요?`);
}

function closeChat() {
    document.getElementById('chat-container').style.display = 'none';
    currentArtworkId = null;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '' || !currentArtworkId) return;

    addMessageToChat('user', message);
    input.value = '';
    input.disabled = true; // Disable input while processing

    const analyzingMessage = addMessageToChat('ai', '이미지를 분석하고 있습니다. 잠시만 기다려 주세요...');
    console.log('[CHAT] "Analyzing" message added.');

    try {
        console.log('[CHAT] Looking up artwork resource...');
        const artworkResource = config_file_content[current_gallery][currentArtworkId]?.resource;
        if (!artworkResource) {
            throw new Error(`Artwork resource not found for ID: ${currentArtworkId}`);
        }
        
        const imageUrl = `/openvgal/content/${artworkResource}`;
        console.log(`[CHAT] Fetching image from: ${imageUrl}`);

        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Image not found at path: ${imageUrl}`);
        }
        const imageBlob = await imageResponse.blob();
        const imageBase64 = await blobToBase64(imageBlob);
        console.log('[CHAT] Image fetched and converted to base64.');


        console.log('[CHAT] Sending request to /api/chat-groq...');
        const response = await fetch('/api/chat-groq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageBase64: imageBase64,
                message: message,
            }),
        });
        console.log(`[CHAT] Received response with status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorData.error || 'Network response was not ok');
        }

        console.log('[CHAT] Parsing JSON response...');
        const data = await response.json();
        console.log('[CHAT] JSON parsed successfully:', data);
        
        console.log('[CHAT] Removing "Analyzing" message...');
        analyzingMessage.remove();
        console.log('[CHAT] "Analyzing" message removed.');

        console.log('[CHAT] Adding final AI reply...');
        addMessageToChat('ai', data.reply);
        console.log('[CHAT] Final AI reply added.');

    } catch (error) {
        console.error('[CHAT] Error in sendChatMessage:', error);
        
        if (analyzingMessage) {
            analyzingMessage.remove();
        }

        addMessageToChat('ai', `죄송합니다. 메시지를 보내는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        console.log('[CHAT] Re-enabling input.');
        input.disabled = false; // Re-enable input
        input.focus();
    }
}

// Helper function to convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', `${sender}-message`);
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageElement;
}


// Load overlay content
document.addEventListener('DOMContentLoaded', function() {
    fetch('overlay.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            // Initialize help popup as hidden
            document.getElementById('help-popup').style.display = 'none';
            hideInfoBox(); // Call hideInfoBox to set initial state

            // Add event listener for chat input
            document.getElementById('chat-input').addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sendChatMessage();
                }
            });
        });
});