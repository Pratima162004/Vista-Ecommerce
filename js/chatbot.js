// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAKiwJmMvq4izLqV6L65CXQGjNCY69pBc4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Website context for the chatbot
const WEBSITE_CONTEXT = `
You are a helpful shopping assistant for Vista, an e-commerce website. Here's what you need to know:

WEBSITE INFORMATION:
- Brand Name: Vista
- Website Type: E-Commerce store
- Location: Delhi, Purana Qila

AVAILABLE PRODUCTS:
- Men's Clothing
- Women's Clothing
- Men's Accessories
- Women's Accessories

AVAILABLE PAGES:
- Homepage (index.html) - Main page with product listings
- Clothing (clothing.html) - Browse clothing items
- Accessories (accessories.html) - Browse accessories
- Shopping Cart (cart.html) - View cart and checkout
- Contact (contact.html) - Contact form page
- Product Details - Individual product pages

NAVIGATION HELP:
When users ask to navigate, help them by suggesting the appropriate page. You can mention:
- "Go to the homepage" → index.html
- "Show me clothing" → clothing.html
- "Show me accessories" → accessories.html
- "View my cart" → cart.html
- "Contact us" → contact.html

RESPONSE GUIDELINES:
1. For website-related questions (products, navigation, shopping): Provide helpful, specific answers
2. For general questions unrelated to Vista: Politely redirect with: "I'm here to help you with Vista shopping. How can I assist you with finding products or navigating our website?"
3. Be friendly, concise, and helpful
4. If asked about navigation, suggest the specific page they should visit
5. Keep responses under 150 words unless detailed explanation is needed
`;

// Chatbot functionality
(function() {
    // Prevent duplicate initialization
    if (window.chatbotInitialized) {
        return;
    }
    window.chatbotInitialized = true;

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Check if elements exist
    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatbotInput || !chatbotSend || !chatbotMessages) {
        console.error('Chatbot elements not found');
        return;
    }

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
    });

    // Add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Check if message is about navigation
    function checkNavigationIntent(message) {
        const navKeywords = {
            'home': 'index.html',
            'homepage': 'index.html',
            'main page': 'index.html',
            'clothing': 'clothing.html',
            'clothes': 'clothing.html',
            'accessories': 'accessories.html',
            'cart': 'cart.html',
            'shopping cart': 'cart.html',
            'checkout': 'cart.html',
            'contact': 'contact.html',
            'contact us': 'contact.html'
        };

        const lowerMessage = message.toLowerCase();
        for (const [keyword, page] of Object.entries(navKeywords)) {
            if (lowerMessage.includes(keyword)) {
                return page;
            }
        }
        return null;
    }

    // Send message to Gemini API
    async function sendToGemini(userMessage) {
        try {
            const prompt = `${WEBSITE_CONTEXT}\n\nUser: ${userMessage}\n\nAssistant:`;

            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our website directly!";
        }
    }

    // Handle message sending
    async function handleSendMessage() {
        const message = chatbotInput.value.trim();
        
        if (!message) return;

        // Add user message
        addMessage(message, true);
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        // Check for navigation intent
        const navPage = checkNavigationIntent(message);
        
        // Show typing indicator
        showTypingIndicator();

        try {
            // Get response from Gemini
            let botResponse = await sendToGemini(message);

            // If navigation detected and not already mentioned, add navigation help
            if (navPage && !botResponse.toLowerCase().includes(navPage)) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (navPage !== currentPage) {
                    botResponse += `\n\nWould you like me to take you to the ${navPage.replace('.html', '')} page?`;
                }
            }

            // Remove typing indicator
            removeTypingIndicator();

            // Add bot response
            addMessage(botResponse, false);

            // Handle navigation - check if response suggests navigation or user explicitly asked
            if (navPage) {
                const lowerResponse = botResponse.toLowerCase();
                const lowerMessage = message.toLowerCase();
                const wantsNavigation = lowerMessage.includes('go to') || 
                                       lowerMessage.includes('show me') || 
                                       lowerMessage.includes('take me') ||
                                       lowerMessage.includes('navigate') ||
                                       lowerResponse.includes('would you like') ||
                                       lowerResponse.includes('take you');

                if (wantsNavigation) {
                    setTimeout(() => {
                        const shouldNavigate = confirm(`Would you like to go to the ${navPage.replace('.html', '').replace(/\b\w/g, l => l.toUpperCase())} page?`);
                        if (shouldNavigate) {
                            window.location.href = navPage;
                        }
                    }, 1000);
                }
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage("I apologize, but I encountered an error. Please try again or contact us through our contact page.", false);
        } finally {
            chatbotSend.disabled = false;
            chatbotInput.focus();
        }
    }

    // Event listeners
    chatbotSend.addEventListener('click', handleSendMessage);
    
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
})();

