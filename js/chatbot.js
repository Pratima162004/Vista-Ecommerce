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

    // Enhanced navigation detection - maps products to pages with auto-navigation
    function checkNavigationIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        // Product keywords that should auto-navigate to clothing page
        const productKeywords = {
            'sweatshirt': 'clothing.html',
            'sweatshirts': 'clothing.html',
            'shirt': 'clothing.html',
            'shirts': 'clothing.html',
            'top': 'clothing.html',
            'tops': 'clothing.html',
            't-shirt': 'clothing.html',
            'tshirt': 'clothing.html',
            't shirt': 'clothing.html',
            'dress': 'clothing.html',
            'dresses': 'clothing.html',
            'pants': 'clothing.html',
            'trousers': 'clothing.html',
            'jeans': 'clothing.html',
            'jacket': 'clothing.html',
            'jackets': 'clothing.html',
            'hoodie': 'clothing.html',
            'hoodies': 'clothing.html',
            'apparel': 'clothing.html',
            'wear': 'clothing.html',
            'outfit': 'clothing.html',
            'outfits': 'clothing.html',
            // Accessories
            'bag': 'accessories.html',
            'bags': 'accessories.html',
            'jewelry': 'accessories.html',
            'jewellery': 'accessories.html',
            'watch': 'accessories.html',
            'watches': 'accessories.html',
            'belt': 'accessories.html',
            'belts': 'accessories.html',
            'wallet': 'accessories.html',
            'wallets': 'accessories.html',
            'sunglasses': 'accessories.html',
            'hat': 'accessories.html',
            'hats': 'accessories.html',
            'cap': 'accessories.html',
            'caps': 'accessories.html'
        };
        
        // Direct navigation keywords (require confirmation)
        const directNavKeywords = {
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
        
        // Check product keywords first (auto-navigate)
        for (const [keyword, page] of Object.entries(productKeywords)) {
            if (lowerMessage.includes(keyword)) {
                return { page: page, autoNavigate: true };
            }
        }
        
        // Check direct navigation keywords (with confirmation)
        for (const [keyword, page] of Object.entries(directNavKeywords)) {
            if (lowerMessage.includes(keyword)) {
                return { page: page, autoNavigate: false };
            }
        }
        
        return null;
    }

    // Fallback response system for when API fails
    function getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Website-related keywords
        const websiteKeywords = {
            'sweatshirt': "We have a great selection of sweatshirts available! You can find them in our Men's and Women's Clothing sections.",
            'sweatshirts': "We have a great selection of sweatshirts available! You can find them in our Men's and Women's Clothing sections.",
            'shirt': "We offer a variety of shirts in our Men's and Women's Clothing collections.",
            'shirts': "We offer a variety of shirts in our Men's and Women's Clothing collections.",
            'top': "We have a wonderful collection of tops for women! Check out our Women's Clothing section.",
            'tops': "We have a wonderful collection of tops for women! Check out our Women's Clothing section.",
            'clothing': "We have a wide range of clothing for both men and women. You can browse our clothing page to see all available items including shirts, sweatshirts, tops, and more!",
            'clothes': "We have a wide range of clothing for both men and women. You can browse our clothing page to see all available items!",
            'accessories': "We offer various accessories for both men and women including bags, jewelry, and more. Visit our accessories page to see the full collection.",
            'cart': "You can view your shopping cart and proceed to checkout by visiting our cart page. Would you like me to take you there?",
            'checkout': "To complete your purchase, please visit the cart page where you can review your items and proceed with checkout.",
            'contact': "You can reach out to us through our contact page. We're located in Delhi, Purana Qila and we'd love to hear from you!",
            'vista': "Vista is an e-commerce store located in Delhi, Purana Qila. We offer men's and women's clothing and accessories. How can I help you find what you're looking for?",
            'price': "For specific pricing information, please browse our product pages. You'll find detailed pricing for each item there.",
            'size': "We offer various sizes for our clothing items. Check the product details page for specific size availability.",
            'delivery': "For delivery information, please contact us through our contact page. We're happy to help with shipping details!",
            'return': "For return and exchange policies, please contact us through our contact page. We'll be happy to assist you!",
            'men': "We have a great selection of men's clothing and accessories! Browse our Men's Clothing and Men's Accessories sections to see what's available.",
            'women': "We offer a wide variety of women's clothing and accessories! Check out our Women's Clothing and Women's Accessories sections.",
            'product': "We have a diverse range of products including clothing and accessories for both men and women. Would you like to browse our clothing or accessories pages?",
            'buy': "You can add items to your cart and purchase them through our website. Browse our clothing or accessories pages to get started!",
            'order': "To place an order, simply add items to your cart and proceed to checkout. You can view your cart at any time to review your selections."
        };
        
        // Check for website-related queries
        for (const [keyword, response] of Object.entries(websiteKeywords)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        // General questions - provide helpful but redirecting response
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm your Vista shopping assistant. I can help you find products, navigate our website, or answer questions about Vista. What would you like to know?";
        }
        
        if (lowerMessage.includes('help')) {
            return "I'm here to help you with Vista! I can assist you with:\n- Finding products (clothing, accessories)\n- Navigating to different pages\n- Answering questions about our store\n\nWhat would you like help with?";
        }
        
        // Default response for general questions
        return "I'm here to help you with Vista shopping! I can assist you with finding products, navigating our website, or answering questions about Vista. For general questions unrelated to shopping, I'd recommend browsing our website directly. How can I help you with Vista today?";
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
                // If API fails, use fallback
                console.warn('Gemini API request failed, using fallback response');
                return getFallbackResponse(userMessage);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                // If response format is invalid, use fallback
                console.warn('Invalid API response format, using fallback');
                return getFallbackResponse(userMessage);
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            // Use fallback response instead of generic error
            return getFallbackResponse(userMessage);
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
        const navResult = checkNavigationIntent(message);
        const navPage = navResult ? navResult.page : null;
        const shouldAutoNavigate = navResult ? navResult.autoNavigate : false;
        
        // Show typing indicator
        showTypingIndicator();

        try {
            // Get response from Gemini
            let botResponse = await sendToGemini(message);

            // If navigation detected, add appropriate message
            if (navPage) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (navPage !== currentPage) {
                    if (shouldAutoNavigate) {
                        // For product searches, auto-navigate
                        botResponse += `\n\nTaking you to our ${navPage.replace('.html', '')} page now...`;
                    } else {
                        // For direct navigation requests, ask for confirmation
                        botResponse += `\n\nWould you like me to take you to the ${navPage.replace('.html', '')} page?`;
                    }
                }
            }

            // Remove typing indicator
            removeTypingIndicator();

            // Add bot response
            addMessage(botResponse, false);

            // Handle automatic navigation for product searches
            if (navPage && shouldAutoNavigate) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (navPage !== currentPage) {
                    // Auto-navigate after a short delay to show the message
                    setTimeout(() => {
                        window.location.href = navPage;
                    }, 1500); // 1.5 second delay
                    return; // Exit early since we're navigating
                }
            }

            // Handle navigation with confirmation for direct requests
            if (navPage && !shouldAutoNavigate) {
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

