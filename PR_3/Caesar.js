class CaesarCipher {
    static encrypt(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt();
            const base = char.charCodeAt(0) < 97 ? 65 : 97; // A=65, a=97
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char; 
    }).join('');
}


static decrypt(text, shift) {
    return this.encrypt(text, 26 - (shift % 26)); 
}
}


const ball = {
color: "red",
size: "medium",
sport: "basketball"
};


const shift = 1;


const encryptedBall = {
color: CaesarCipher.encrypt(ball.color, shift),
size: CaesarCipher.encrypt(ball.size, shift),
sport: CaesarCipher.encrypt(ball.sport, shift)
};


console.log("Зашифрованные данные объекта ball:");
console.log(encryptedBall);

const decryptedBall = {
color: CaesarCipher.decrypt(encryptedBall.color, shift),
size: CaesarCipher.decrypt(encryptedBall.size, shift),
sport: CaesarCipher.decrypt(encryptedBall.sport, shift)
};

console.log("Расшифрованные данные объекта ball:");
console.log(decryptedBall);