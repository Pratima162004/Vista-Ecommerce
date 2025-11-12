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
- Clothing (content.html#clothing) - Browse clothing items
- Accessories (content.html#accessories) - Browse accessories
- Shopping Cart (cart.html) - View cart and checkout
- Contact (contact.html) - Contact form page
- Product Details - Individual product pages

NAVIGATION HELP:
When users ask to navigate, help them by suggesting the appropriate page. You can mention:
- "Go to the homepage" → index.html
- "Show me clothing" → content.html#clothing
- "Show me accessories" → content.html#accessories
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

    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
    }

    // Enhanced navigation detection - supports products -> content sections
    function checkNavigationIntent(message) {
        const lowerMessage = message.toLowerCase();

        // Product keywords → clothing/accessories sections (auto-navigate)
        const productKeywords = {
            // Clothing
            'sweatshirt': 'content.html#clothing',
            'sweatshirts': 'content.html#clothing',
            'shirt': 'content.html#clothing',
            'shirts': 'content.html#clothing',
            'top': 'content.html#clothing',
            'tops': 'content.html#clothing',
            't-shirt': 'content.html#clothing',
            't shirt': 'content.html#clothing',
            'tshirt': 'content.html#clothing',
            'dress': 'content.html#clothing',
            'dresses': 'content.html#clothing',
            'pants': 'content.html#clothing',
            'trousers': 'content.html#clothing',
            'jeans': 'content.html#clothing',
            'jacket': 'content.html#clothing',
            'jackets': 'content.html#clothing',
            'hoodie': 'content.html#clothing',
            'hoodies': 'content.html#clothing',
            'apparel': 'content.html#clothing',
            'wear': 'content.html#clothing',
            'outfit': 'content.html#clothing',
            'outfits': 'content.html#clothing',
            // Accessories
            'accessories': 'content.html#accessories',
            'accessory': 'content.html#accessories',
            'bag': 'content.html#accessories',
            'bags': 'content.html#accessories',
            'jewelry': 'content.html#accessories',
            'jewellery': 'content.html#accessories',
            'watch': 'content.html#accessories',
            'watches': 'content.html#accessories',
            'belt': 'content.html#accessories',
            'belts': 'content.html#accessories',
            'wallet': 'content.html#accessories',
            'wallets': 'content.html#accessories',
            'sunglasses': 'content.html#accessories',
            'hat': 'content.html#accessories',
            'hats': 'content.html#accessories',
            'cap': 'content.html#accessories',
            'caps': 'content.html#accessories'
        };

        // Direct page navigation (ask confirmation)
        const directNavKeywords = {
            'home': 'index.html',
            'homepage': 'index.html',
            'main page': 'index.html',
            'clothing': 'content.html#clothing',
            'clothes': 'content.html#clothing',
            'cart': 'cart.html',
            'shopping cart': 'cart.html',
            'checkout': 'cart.html',
            'contact': 'contact.html',
            'contact us': 'contact.html'
        };

        for (const [k, page] of Object.entries(productKeywords)) {
            if (lowerMessage.includes(k)) return { page, autoNavigate: true };
        }
        for (const [k, page] of Object.entries(directNavKeywords)) {
            if (lowerMessage.includes(k)) return { page, autoNavigate: false };
        }
        return null;
    }

    // Fallback response system when API fails
    function getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        const websiteKeywords = {
            'sweatshirt': "We have a great selection of sweatshirts available in our clothing section.",
            'sweatshirts': "We have a great selection of sweatshirts available in our clothing section.",
            'shirt': "We offer a variety of shirts in our clothing collections.",
            'shirts': "We offer a variety of shirts in our clothing collections.",
            'top': "We have a wonderful collection of tops. Check out our clothing section.",
            'tops': "We have a wonderful collection of tops. Check out our clothing section.",
            'clothing': "We have a wide range of clothing for men and women. Browse our clothing section.",
            'clothes': "We have a wide range of clothing for men and women. Browse our clothing section.",
            'accessories': "We offer various accessories for men and women. Visit our accessories section.",
            'cart': "You can view your shopping cart and proceed to checkout on the cart page.",
            'checkout': "Please use the cart page to review your items and proceed with checkout.",
            'contact': "Reach out to us via our contact page. We’re located in Delhi, Purana Qila.",
            'vista': "Vista is an e-commerce store in Delhi, Purana Qila. How can I help you shop today?",
            'price': "For pricing, please browse product pages for details.",
            'size': "Sizes vary per item; see each product details page.",
            'delivery': "For delivery information, please contact us via the contact page.",
            'return': "For returns and exchanges, please contact us via the contact page.",
            'men': "Browse men’s clothing and accessories in our content page.",
            'women': "Browse women’s clothing and accessories in our content page.",
            'product': "We carry clothing and accessories. Would you like clothing or accessories?",
            'buy': "Add items to cart then proceed to checkout on the cart page.",
            'order': "Add items to cart and complete checkout on the cart page."
        };

        for (const [k, response] of Object.entries(websiteKeywords)) {
            if (lowerMessage.includes(k)) return response;
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I can help you find products, navigate pages, or answer questions about Vista.";
        }
        if (lowerMessage.includes('help')) {
            return "I can help you find products, navigate to clothing/accessories, view cart, and more. What do you need?";
        }
        return "I'm here to help you with Vista shopping. Ask me about clothing, accessories, navigating pages, or your cart.";
    }

    // Send message to Gemini API
    async function sendToGemini(userMessage) {
        try {
            const prompt = `${WEBSITE_CONTEXT}\n\nUser: ${userMessage}\n\nAssistant:`;
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                console.warn('Gemini API request failed, using fallback response');
                return getFallbackResponse(userMessage);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text.trim();
            } else {
                console.warn('Invalid API response format, using fallback');
                return getFallbackResponse(userMessage);
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return getFallbackResponse(userMessage);
        }
    }

    // Handle message sending
    async function handleSendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatbotInput.value = '';
        chatbotSend.disabled = true;

        const navResult = checkNavigationIntent(message);
        const navPage = navResult ? navResult.page : null;
        const shouldAutoNavigate = navResult ? navResult.autoNavigate : false;

        showTypingIndicator();

        try {
            let botResponse = await sendToGemini(message);

            if (navPage) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetBase = navPage.split('#')[0];
                if (targetBase !== currentPage) {
                    if (shouldAutoNavigate) {
                        botResponse += `\n\nTaking you to our ${targetBase.replace('.html', '')} page now...`;
                    } else {
                        botResponse += `\n\nWould you like me to take you to the ${targetBase.replace('.html', '')} page?`;
                    }
                }
            }

            removeTypingIndicator();
            addMessage(botResponse, false);

            // Auto navigation for product searches
            if (navPage && shouldAutoNavigate) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetBase = navPage.split('#')[0];
                setTimeout(() => {
                    if (targetBase !== currentPage) {
                        window.location.href = navPage;
                    } else {
                        // Same page: just adjust hash to scroll to section
                        if (navPage.includes('#')) {
                            window.location.hash = navPage.split('#')[1];
                        }
                    }
                }, 1200);
                return;
            }

            // Confirmation flow for direct nav
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
                        const targetBase = navPage.split('#')[0];
                        const shouldNavigate = confirm(`Would you like to go to the ${targetBase.replace('.html', '').replace(/\b\w/g, l => l.toUpperCase())} page?`);
                        if (shouldNavigate) window.location.href = navPage;
                    }, 800);
                }
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage("I encountered an error. Please try again or use the contact page.", false);
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