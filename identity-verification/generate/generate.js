document.addEventListener('DOMContentLoaded', () => {
    const hostContactInput = document.getElementById('host-contact');
    const secretCodeInput = document.getElementById('secret-code');
    const generateSecretBtn = document.getElementById('generate-secret-btn');
    const form = document.getElementById('generator-form');
    const resultContainer = document.getElementById('result-container');
    const outputHash = document.getElementById('output-hash');

    // Generates a random 600-bit (75 byte) Base64 string
    generateSecretBtn.addEventListener('click', () => {
        const randomBytes = new Uint8Array(75);
        window.crypto.getRandomValues(randomBytes);
        const base64Code = btoa(String.fromCharCode(...randomBytes));
        secretCodeInput.value = base64Code;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const hostContact = hostContactInput.value.trim();
        const secretCode = secretCodeInput.value.trim();
        
        // New Protocol: Combine Host Contact and Secret Code
        const dataToHash = hostContact + secretCode;
        
        // Encode and Hash using SHA-512
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(dataToHash);
        const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer);
        
        // Convert ArrayBuffer to Hex String
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Display Result
        outputHash.value = hashHex;
        resultContainer.style.display = 'block';
        resultContainer.classList.remove('hidden');
    });

    // Copy to clipboard functionality
    document.getElementById('copy-secret-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(secretCodeInput.value);
    });

    document.getElementById('copy-hash-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(outputHash.value);
    });
});