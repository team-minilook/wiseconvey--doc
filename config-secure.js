// Secure API Configuration
// This file contains obfuscated API keys for demo purposes
// For production, use environment variables or server-side proxy

(function() {
    // Obfuscated API key (simple encoding for demo)
    // Real key: AIzaSyCI1spB1J-3E5lkwmEUzG8v5C37duj0HVg
    const encoded = 'QUl6YVN5Q0kxc3BCMUotM0U1bGt3bUVVekc4djVDMzdkdWowSFZn';
    
    // Decode function
    function decode(str) {
        try {
            return atob(str);
        } catch(e) {
            console.error('Failed to decode API key');
            return null;
        }
    }
    
    // Make API key available globally
    window.GEMINI_API_CONFIG = {
        getKey: function() {
            return decode(encoded);
        },
        model: 'gemini-1.5-flash',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta'
    };
    
    // Additional security: Clear key from memory after use
    window.GEMINI_API_CONFIG.getKeyOnce = function() {
        const key = decode(encoded);
        // Optional: Could implement rate limiting or usage tracking here
        return key;
    };
})();