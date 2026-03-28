// Hashing function
async function hashStringSHA512(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Standardize email or phone inputs
function standardizeContact(input) {
    if (!input) return '';
    let cleaned = input.trim();
    
    // If it contains an '@', treat it as an email: lowercase and trim
    if (cleaned.includes('@')) {
        return cleaned.toLowerCase();
    } 
    
    // Otherwise, treat as a phone number: 
    // Strip all non-numeric characters, preserving a leading '+' if it exists
    const hasPlus = cleaned.startsWith('+');
    const digitsOnly = cleaned.replace(/\D/g, ''); 
    return hasPlus ? '+' + digitsOnly : digitsOnly;
}

// Handle Form Submission
document.getElementById('generator-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const btn = document.getElementById('generate-btn');
    btn.textContent = "Generating...";
    btn.disabled = true;

    // 1. Gather and Standardize inputs
    const rawUserContact = document.getElementById('user-contact').value;
    const rawHostContact = document.getElementById('host-contact').value;
    const rawSecretCode = document.getElementById('secret-code').value;

    const userContact = standardizeContact(rawUserContact);
    const hostContact = standardizeContact(rawHostContact);
    
    // For the secret code, remove ALL whitespace
    const secretCode = rawSecretCode.replace(/\s+/g, '');

    // Validate Base64 explicitly since <textarea> lacks the pattern attribute
    const base64Regex = /^[A-Za-z0-9+/]{100}$/;
    if (!base64Regex.test(secretCode)) {
        alert("Invalid format: The Secret Code must be exactly 100 Base64 characters.");
        btn.textContent = "Generate SHA-512 Hash";
        btn.disabled = false;
        return;
    }

    // Concatenate exactly as specified
    const combinedString = userContact + hostContact + secretCode;

    try {
        // Compute SHA-512 Hash
        const generatedHash = await hashStringSHA512(combinedString);

        // Display the result
        const resultContainer = document.getElementById('result-container');
        const outputHash = document.getElementById('output-hash');
        
        outputHash.value = `${generatedHash}`; 
        resultContainer.classList.remove('hidden');

    } catch (error) {
        console.error("Hashing failed:", error);
        alert("An error occurred while generating the hash.");
    } finally {
        btn.textContent = "Generate SHA-512 Hash";
        btn.disabled = false;
    }
});

// Generate Random Secure Code
document.getElementById('generate-secret-btn').addEventListener('click', function() {
    const randomBytes = new Uint8Array(75); // 600 bits = 75 bytes
    window.crypto.getRandomValues(randomBytes);
    
    // Convert to binary string securely, then to Base64
    const binaryString = Array.from(randomBytes).map(byte => String.fromCharCode(byte)).join('');
    const base64String = btoa(binaryString);
    
    document.getElementById('secret-code').value = base64String;
});

// Helper function to handle copying
async function copyToClipboard(elementId, buttonId, defaultText) {
    const textToCopy = document.getElementById(elementId).value;
    const copyBtn = document.getElementById(buttonId);
    
    if (!textToCopy) return;

    try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.textContent = "Copied!";
        copyBtn.style.backgroundColor = "#28a745"; // Green success color
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.textContent = defaultText;
            if (buttonId === 'copy-secret-btn') {
                copyBtn.style.backgroundColor = "#586069";
            } else {
                copyBtn.style.backgroundColor = "#24292e";
            }
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert("Failed to copy to clipboard. Please copy manually.");
    }
}

// Attach Copy Events
document.getElementById('copy-secret-btn').addEventListener('click', () => {
    copyToClipboard('secret-code', 'copy-secret-btn', 'Copy Code');
});

document.getElementById('copy-hash-btn').addEventListener('click', () => {
    copyToClipboard('output-hash', 'copy-hash-btn', 'Copy to Clipboard');
});