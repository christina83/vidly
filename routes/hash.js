// Datei ist nur dazu da, encryption zu demonstrieren

const bcrypt = require('bcryptjs');

// 1234 -> abcd ist der Hash (kann nicht wieder zurück verwandelt werden)
// but a hacker could encrypt popular passwords and compare his list of hashes to my hash
// Solution: Use a salt to make the hash different each time
// the salt gets concatenated to the hash and make the whole string different
// later when we want to verify the users password, we have to hash it again, but we also need the salt to produce that hash

// Take asynchronuous method version, because node applications only have a single thread (don't keep it busy)
async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
}

run();
