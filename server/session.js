// TODO: Add session maker function

function createSession() {
    const max = 1000;
    let rand_num = Math.floor(Math.random() * max);
    const timestamp = Date.now().toString(36);

    // Concatenate the random number and timestamp
    const input = `${rand_num}-${timestamp}`;

    // Hash the input using the Web Crypto API
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
        .then(hashBuffer => {
            // Convert the hash buffer to a hex string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        });
}

// // Example usage
// createSession().then(sessionHash => {
//     console.log('Session Hash:', sessionHash);
// });
