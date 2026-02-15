<style>
    #offcanvas-chatbot {
        max-height: 100vh;
    }

    /* Modern Chatbot Styles */
    #offcanvas-chatbot {
        max-height: 100vh;
        overflow: hidden;
    }

    #chatbot-messages {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: calc(100vh - 250px);
        /* Adjust based on the height of header and input area */
        overflow-y: auto;
        /* Enable vertical scrolling */
        padding-right: 8px;
        /* Add some padding to account for scrollbar */
    }

    .message {
        display: flex;
        align-items: flex-start;
        padding: 8px;
        border-radius: 12px;
        background-color: #f1f1f1;
        max-width: 80%;
        position: relative;
    }

    .message-user {
        background-color: #d1e7dd;
        align-self: flex-end;
    }

    .message-bot {
        background-color: #e9ecef;
        align-self: flex-start;
    }

    .message::before {
        content: '';
        position: absolute;
        top: 10px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
    }

    .message-user::before {
        right: -16px;
        border-left-color: #d1e7dd;
        border-width: 8px 16px 8px 0;
    }

    .message-bot::before {
        left: -16px;
        border-right-color: #e9ecef;
        border-width: 8px 0 8px 16px;
    }



    .message span {
        font-size: 1rem;
    }



    #user-input {
        border-radius: 9999px 0 0 9999px;
        /* Rounded for modern look */
        padding: 10px 16px;
    }

    #send-btn {
        border-radius: 0 9999px 9999px 0;
        padding: 10px 16px;
    }

    .sticky {
        position: sticky;
    }

    button {
        cursor: pointer;
    }
</style>

<!-- Off-Canvas Chatbot -->
<div id="offcanvas-chatbot"
    class="fixed top-10 right-0 w-full lg:w-1/3 h-full bg-white border-l border-gray-300 shadow-lg transform translate-x-full transition-transform">
    <div class="p-5 bg-gray-200 text-gray-700 font-semibold mt-5">
        Brainstormer
        <button id="close-offcanvas" class="float-right text-red-500">&times;</button>
    </div>
    <div class="p-4 flex-grow overflow-hidden" id="chatbot-messages">
        <!-- Chatbot messages will appear here -->
    </div>
    <!-- Fixed bottom input area -->
    <div class="p-4 border-t border-gray-300 bg-gray-300 fixed bottom-8 right-0 w-full z-50">
        <div class="flex mb-2">
            <button class="bg-gray-200 text-gray-700 shadow-sm p-2 rounded-lg hover:bg-gray-300 mr-2"
                onclick="sendPreMadeMessage('What is trending now?')">What is trending now?</button>
            <button class="bg-gray-200 text-gray-700 shadow-sm p-2 rounded-lg hover:bg-gray-300 mr-2"
                onclick="sendPreMadeMessage('Suggest me some ideas to write blogs')">Suggest me some ideas to write blogs</button>
            <button class="bg-gray-200 text-gray-700 shadow-sm p-2 rounded-lg hover:bg-gray-300"
                onclick="sendPreMadeMessage('What are the good writing skills?')">What are the good writing skills?</button>
        </div>
        <div class="flex">
            <input type="text" id="user-input"
                class="flex-grow border border-gray-300 p-2 rounded-l-lg focus:outline-none"
                placeholder="Type a message...">
            <button id="send-btn" class="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600">Send</button>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        const chatbotMessages = document.getElementById('chatbot-messages');

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });

        sendBtn.addEventListener('click', async () => {
            const userMessage = userInput.value.trim();
            if (userMessage) {
                addMessage('You', userMessage);

                try {
                    const response = await fetch('/chatbot/respond', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ message: userMessage })
                    });

                    const data = await response.json();
                    addMessage('Bot', data.response);
                } catch (error) {
                    console.error('Error:', error);
                    addMessage('Bot', 'Sorry, something went wrong.');
                }

                userInput.value = ''; // Clear input
            }
        });

        window.sendPreMadeMessage = function(message) {
            userInput.value = message;
            sendBtn.click();
            userInput.value = ''; // Clear input
        };

        function addMessage(sender, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            if (sender === 'You') {
                messageElement.classList.add('message-user');
            } else {
                messageElement.classList.add('message-bot');
            }

            messageElement.innerHTML = `<pre class="whitespace-pre-line font-sans">${message}</pre>`;
            chatbotMessages.appendChild(messageElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            userInput.value = ''; // Clear input
        }
    });
</script>

