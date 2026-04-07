document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verification-form');
    const hostContactInput = document.getElementById('host-contact');
    const secretCodeInput = document.getElementById('secret-code');
    const resultMessage = document.getElementById('result-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const hostContact = hostContactInput.value.trim();
        const secretCode = secretCodeInput.value.trim();
        
        // Reset message state
        resultMessage.className = 'hidden';
        resultMessage.textContent = 'Verifying...';
        resultMessage.classList.remove('hidden');
        
        try {
            // Check if validHashes array exists (from hashes.js)
            if (typeof validHashes === 'undefined') {
                throw new Error("Hash database not found.");
            }

            // Execute the Zero-Knowledge Protocol: Host Contact + Secret Code
            const dataToHash = hostContact + secretCode;
            
            // Encode the string into an ArrayBuffer
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(dataToHash);
            
            // Perform the SHA-512 hash operation
            const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer);
            
            // Convert the resulting ArrayBuffer to a Hex String
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Verify if the generated hash exists in the known valid hashes
            if (validHashes.includes(hashHex)) {
                resultMessage.textContent = '✅ Verification Successful: Identity confirmed.';
                resultMessage.className = 'success-message';
            } else {
                resultMessage.textContent = '❌ Verification Failed: Invalid credentials or code.';
                resultMessage.className = 'error-message';
            }

        } catch (error) {
            console.error("Verification error:", error);
            resultMessage.textContent = '⚠️ An error occurred during the verification process.';
            resultMessage.className = 'error-message';
        }
    });
});
