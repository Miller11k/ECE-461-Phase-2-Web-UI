import crypto from 'crypto';

// Hashes an input combined with a salt using SHA-256 (synchronous)
export function hashWithSalt(input, salt = "") {
    const saltedInput = `${input}-${salt}`; // Combine input and salt
    return crypto.createHash('sha256').update(saltedInput).digest('hex');
}


// Generates a cryptographically secure random salt
export function createSalt(length = 16) {
    const array = crypto.randomBytes(length); // Use crypto for secure random values
    return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Combines a password with a generated salt and hashes it through 12 rounds (synchronous)
export function generatePassword(plaintext, salt, rounds = 12) {
    let hashValue = plaintext; // Start with the password

    // Perform 12 rounds of hashing
    for (let i = 0; i <= rounds; i++) {
        hashValue = hashWithSalt(hashValue, salt); // Hash the result of the previous round
    }

    return hashValue; // Return the final hash
}

export function validatePassword(plaintext, ciphertext, salt) {
    let password = plaintext
    for(let i  = 0; i <= 12; i++){
        password = hashWithSalt(password, salt);
    }
    return(password == ciphertext);
}