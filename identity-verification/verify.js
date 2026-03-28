// Helper: Hash a string using SHA-512
async function hashStringSHA512(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Constant-time comparison to prevent timing attacks
function constantTimeCompare(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
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

// Main execution block
document.getElementById('verification-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const btn = document.getElementById('verify-btn');
    const resultDiv = document.getElementById('result-message');
    
    btn.textContent = "Verifying...";
    btn.disabled = true;
    resultDiv.classList.add('hidden');

    // Ensure the hashes.js file loaded correctly
    if (typeof validHashes === 'undefined' || validHashes.length === 0) {
        alert("Verification system is currently offline (Database missing).");
        btn.textContent = "Verify Identity";
        btn.disabled = false;
        return;
    }

    // 1. Gather and Standardize inputs
    const rawUserContact = document.getElementById('user-contact').value;
    const rawHostContact = document.getElementById('host-contact').value;
    const rawSecretCode = document.getElementById('secret-code').value;

    const userContact = standardizeContact(rawUserContact);
    const hostContact = standardizeContact(rawHostContact);
    
    // For the secret code, remove ALL whitespace (including newlines from copy/pasting)
    const secretCode = rawSecretCode.replace(/\s+/g, '');

    // Explicit validation for the Base64 textarea
    const base64Regex = /^[A-Za-z0-9+/]{100}$/;
    if (!base64Regex.test(secretCode)) {
        alert("Invalid format: The Secret Code must be exactly 100 Base64 characters.");
        btn.textContent = "Verify Identity";
        btn.disabled = false;
        return;
    }

    // 2. Concatenate exactly as specified
    const combinedString = userContact + hostContact + secretCode;

    try {
        // 3. Compute SHA-512 Hash
        const computedHash = await hashStringSHA512(combinedString);
        let isVerified = false;

        // 4. Securely compare against the list loaded from hashes.js
        for (const knownHash of validHashes) {
            if (constantTimeCompare(computedHash, knownHash)) {
                isVerified = true;
                break;
            }
        }

        // 5. Display exact message requested
        resultDiv.classList.remove('hidden', 'verified', 'not-verified');

        if (isVerified) {
            resultDiv.textContent = "Verified";
            resultDiv.classList.add('verified');
        } else {
            resultDiv.textContent = "Not Verified";
            resultDiv.classList.add('not-verified');
        }

    } catch (error) {
        console.error("Verification process failed:", error);
        alert("An error occurred during verification.");
    } finally {
        btn.textContent = "Verify Identity";
        btn.disabled = false;
    }
});