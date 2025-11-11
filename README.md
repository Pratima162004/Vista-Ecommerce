# Vista - E-Commerce Website

A modern, fully responsive e-commerce website built with HTML, CSS, and JavaScript. Features an AI-powered chatbot for enhanced user experience and seamless shopping navigation.

![Vista E-Commerce](https://img.shields.io/badge/Brand-Vista-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🌟 Features

### Core E-Commerce Features
- **Product Catalog**: Browse men's and women's clothing and accessories
- **Shopping Cart**: Add items to cart with real-time updates
- **Product Details**: Detailed product pages with images and descriptions
- **Order Management**: Complete checkout flow with order confirmation
- **Responsive Design**: Fully responsive layout for all devices

### Advanced Features
- **AI-Powered Chatbot**: Integrated Gemini AI chatbot for customer support
  - Website content awareness
  - Automatic navigation assistance
  - Product recommendations
  - General customer support
- **Contact Form**: User-friendly contact page with form validation
- **Dynamic Content Loading**: Products loaded via API integration
- **Modern UI/UX**: Clean, professional design with smooth animations

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**:
  - jQuery 3.4.1
  - Slick Carousel (for image sliders)
  - Font Awesome (for icons)
- **APIs**:
  - Google Gemini AI API (for chatbot)
  - MockAPI (for product data)
- **Fonts**: Google Fonts (Lato, Source Sans Pro)

## 📁 Project Structure

```
E-CommerceWebsite-master/
│
├── index.html              # Homepage
├── cart.html               # Shopping cart page
├── contact.html            # Contact form page
├── content.html            # Product listing page
├── contentDetails.html     # Product details page
├── orderPlaced.html        # Order confirmation page
├── chatbot.html            # Chatbot component
├── header.html             # Header component
├── footer.html             # Footer component
├── slider.html             # Image slider component
│
├── css/
│   ├── header.css          # Header styles
│   ├── footer.css           # Footer styles
│   ├── cart.css             # Cart page styles
│   ├── contact.css          # Contact page styles
│   ├── content.css          # Product listing styles
│   ├── contetDetails.css    # Product details styles
│   ├── orderPlaced.css      # Order confirmation styles
│   └── chatbot.css          # Chatbot styles
│
├── js/
│   ├── chatbot.js           # Chatbot functionality & Gemini API integration
│   ├── content.js           # Product listing logic
│   ├── contentDetails.js    # Product details logic
│   ├── cart.js              # Shopping cart logic
│   ├── orderPlaced.js       # Order confirmation logic
│   └── jQuery3.4.1.js       # jQuery library
│
└── img/                     # Image assets
    ├── img1.png
    ├── img2.png
    ├── img3.png
    └── img4.png
```

## 🛠️ Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for testing)

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pratima162004/E-CommerceWebsite.git
   cd E-CommerceWebsite
   ```

2. **Open the project**
   - Option 1: Open `index.html` directly in your browser
   - Option 2: Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the website**
   - Navigate to `http://localhost:8000` (or the port you specified)
   - Or simply open `index.html` in your browser

## 📖 Usage

### Navigation
- **Homepage**: Browse featured products and categories
- **Clothing**: View men's and women's clothing collections
- **Accessories**: Browse accessories for men and women
- **Cart**: View and manage items in your shopping cart
- **Contact**: Reach out via the contact form

### Chatbot Features
The AI chatbot (Vista Assistant) can help you with:
- Finding products and categories
- Navigating to different pages
- Answering questions about Vista
- General shopping assistance

**To use the chatbot:**
1. Click the chat icon in the bottom-right corner
2. Type your question or request
3. The chatbot will respond and can help navigate you to relevant pages

## 🎨 Key Features Explained

### 1. Dynamic Product Loading
Products are fetched from an external API and dynamically rendered on the page.

### 2. Shopping Cart
- Add items to cart
- Real-time cart badge updates
- Persistent cart state using cookies
- Checkout functionality

### 3. AI Chatbot Integration
- Powered by Google Gemini AI
- Context-aware responses about the website
- Automatic navigation assistance
- Handles both website-related and general queries

### 4. Contact Form
- Name, Email, Subject, and Message fields
- Form validation
- Success confirmation message

## 🔧 Configuration

### Chatbot API Key
The chatbot uses Google Gemini API. To update the API key:
1. Open `js/chatbot.js`
2. Update the `GEMINI_API_KEY` constant:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
   ```

**⚠️ Security Note**: For production, move the API key to environment variables or use a backend proxy to keep it secure.

### Product API
Products are currently loaded from a MockAPI endpoint. To change the API:
1. Open `js/content.js`
2. Update the API endpoint in the `httpRequest.open()` call

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Pages Overview

| Page | Description |
|------|-------------|
| **Homepage** | Main landing page with product slider and categories |
| **Product Listing** | Display of all clothing and accessories |
| **Product Details** | Individual product information and purchase options |
| **Shopping Cart** | Cart management and checkout |
| **Order Confirmation** | Order success page |
| **Contact** | Contact form for customer inquiries |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Pratima Kumari**

- LinkedIn: [@pratima--kumari](https://www.linkedin.com/in/pratima--kumari/)
- GitHub: [@Pratima162004](https://github.com/Pratima162004)

## 🙏 Acknowledgments

- Google Gemini AI for chatbot capabilities
- MockAPI for product data
- Font Awesome for icons
- Google Fonts for typography
- Slick Carousel for image sliders

## 📸 Screenshots

### Homepage
![Homepage](https://user-images.githubusercontent.com/17312616/65086776-b1beb080-d9d0-11e9-9983-143d61ed8fdc.png)

### Product Details
![Product Details](https://user-images.githubusercontent.com/17312616/65086777-b1beb080-d9d0-11e9-9e2b-af3b7210bdf3.png)

### Shopping Cart
![Shopping Cart](https://user-images.githubusercontent.com/17312616/65086778-b2574700-d9d0-11e9-9983-143d61ed8fdc.png)

### Order Confirmation
![Order Confirmation](https://user-images.githubusercontent.com/17312616/65086779-b2efdd80-d9d0-11e9-95d5-4b1a48eafe04.png)

## 📞 Support

For support, email or reach out via:
- **Contact Page**: Use the contact form on the website
- **LinkedIn**: [Pratima Kumari](https://www.linkedin.com/in/pratima--kumari/)
- **GitHub Issues**: Open an issue on GitHub

## 🚧 Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment gateway integration
- [ ] Product search functionality
- [ ] Product filtering and sorting
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Admin dashboard

---

⭐ If you like this project, please give it a star on GitHub!
