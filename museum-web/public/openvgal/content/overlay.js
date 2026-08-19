// Overlay functionality
// callbacks
function CB_toggleLike() {
    const likeButton = document.querySelector('.like-button');
    likeButton.classList.toggle('liked');
}

function CB_buy() {};
function CB_mint() {};

function CB_artwork_picked(index) {
    return function() {
        manual_navigation_idx = index;
        manual_move();
    };
}

// -----------------------------------------------------------------------------
// 유틸 함수들
// -----------------------------------------------------------------------------

function manual_move() {
    //get active camera
    const camera = scene.activeCamera;
    const camera_distance = [4, 6];

    var gallery = config_file_content[current_gallery];
    var dict_items = Object.keys(gallery).filter(key => gallery[key]["resource_type"] == "image");
    if (dict_items.length == 0) return;
    var n_items = dict_items.length;

    //check limits
    if (manual_navigation_idx < 0) {
        manual_navigation_idx = n_items - 1;
    } else if (manual_navigation_idx == n_items) {
        manual_navigation_idx = 0;
    }

    //get position and vector. Assuming they are JSON strings of 3-element arrays [x, y, z]
    let item_position_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['location']);
    let item_vector_array = JSON.parse(gallery[dict_items[manual_navigation_idx]]['vector']);

    // Create Babylon.js Vector3 objects
    const target_position = new BABYLON.Vector3(item_position_array[0], item_position_array[2], item_position_array[1]);
    const target_vector = new BABYLON.Vector3(item_vector_array[0], item_vector_array[2], item_vector_array[1]).normalize();

    // Calculate the camera's position to be in front of the item
    let camera_position;
    if (window.innerWidth > 600) {
        camera_position = target_position.add(target_vector.scale(camera_distance[0]));
    } else {
        camera_position = target_position.add(target_vector.scale(camera_distance[1]));
    }

    // Aim the camera at the target
    camera.position = camera_position;
    camera.setTarget(target_position);

    showInfoBox("Title:  " + gallery[dict_items[manual_navigation_idx]]["metadata"], dict_items[manual_navigation_idx]);
}

function manual_move_backward() {
    manual_navigation_idx--;
    manual_move();
}

function manual_move_forward() {
    manual_navigation_idx++;
    manual_move();
}

// -----------------------------------------------------------------------------
// 히든 작품 판별 함수 (populate_template 로직과 맞춤)
// -----------------------------------------------------------------------------
function isHiddenArtwork(artworkId) {
    try {
        const galleriesWithHiddenArtworks = ["gallery3", "gallery4"];

        // 현재 갤러리가 히든 작품이 있는 갤러리가 아니면 false
        if (!galleriesWithHiddenArtworks.includes(current_gallery)) {
            return false;
        }

        const gallery = config_file_content[current_gallery];
        if (!gallery) return false;

        const dict_items = Object.keys(gallery).filter(
            key => gallery[key]["resource_type"] == "image"
        );
        if (dict_items.length === 0) return false;

        // 마지막 이미지가 히든 작품
        const lastArtworkId = dict_items[dict_items.length - 1];

        return artworkId === lastArtworkId;
    } catch (e) {
        console.warn("isHiddenArtwork error:", e);
        return false;
    }
}

// -----------------------------------------------------------------------------
// InfoBox + 버튼
// -----------------------------------------------------------------------------

// show metadata or other info
function showInfoBox(title, artworkId) {
    document.getElementById("artwork-info").innerText = title;
    // enable action buttons
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

// -----------------------------------------------------------------------------
// Help popup functionality
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Chat functionality
// -----------------------------------------------------------------------------
let currentArtworkId = null;
let conversationCount = 0;
let isStreaming = false;

function openChat(artworkId) {
    currentArtworkId = artworkId;
    conversationCount = 0;
    document.getElementById('chat-container').style.display = 'flex';
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear previous messages

    if (isHiddenArtwork(artworkId)) {
        addMessageToChat(
            'ai',
            "이 작품은 히든 작품입니다! 🎨\n먼저 작품을 감상한 뒤, 당신이 느낀 해석을 자유롭게 적어주세요.\n그 다음에 제가 점수를 매기고, 일반적인 해석도 함께 알려드릴게요."
        );
    } else {
        addMessageToChat('ai', `안녕하세요! '${artworkId}'에 대해 무엇이 궁금하신가요?`);
    }
}

function closeChat() {
    document.getElementById('chat-container').style.display = 'none';
    currentArtworkId = null;
    conversationCount = 0;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;
    if (isStreaming) {
        addMessageToChat('ai', '잠시만요! 이전 답변이 완료되면 이어갈게요.');
        return;
    }

    isStreaming = true;
    addMessageToChat('user', message);
    input.value = '';

    const aiMessage = addMessageToChat('ai', '답변을 작성하는 중입니다...');

    try {
        const hiddenMode = isHiddenArtwork(currentArtworkId);
        const countForRequest = conversationCount;

        // 일반 작품일 때만 conversationCount 증가
        if (!hiddenMode) {
            conversationCount += 1;
        }

        // 히든 / 일반 분기
        const url = hiddenMode ? '/api/hidden-artwork' : '/api/chat-gemini';
        const body = hiddenMode
            ? JSON.stringify({
                  artworkId: currentArtworkId,
                  interpretation: message, // 히든 작품: 사용자의 해석
              })
            : JSON.stringify({
                  artworkId: currentArtworkId,
                  message: message,
                  conversationCount: countForRequest,
              });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'AI 응답을 불러오지 못했습니다.');
        }

        if (!response.body) {
            throw new Error('스트리밍 응답을 받을 수 없습니다.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            aiText += decoder.decode(value, { stream: true });
            aiMessage.innerText = aiText.trim();
        }

        const finalText = (aiText + decoder.decode()).trim();
        aiMessage.innerText = finalText || '응답이 전달되지 않았어요. 다시 시도해볼까요?';
    } catch (error) {
        console.error('Error sending chat message:', error);
        aiMessage.innerText = error.message || 'Sorry, I am having trouble connecting. Please try again later.';
        if (!isHiddenArtwork(currentArtworkId)) {
            conversationCount = Math.max(0, conversationCount - 1);
        }
    } finally {
        isStreaming = false;
    }
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

// -----------------------------------------------------------------------------
// Load overlay content
// -----------------------------------------------------------------------------
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
                if (event.key === 'Enter' && !event.repeat) {
                    event.preventDefault();
                    sendChatMessage();
                }
            });
        });
});
