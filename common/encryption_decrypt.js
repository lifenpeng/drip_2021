
const CryptoJS = require("crypto-js");

function encryptByDES(message, key = "R5ZFZmWrrp5F8X8l") {
    var keyHex = CryptoJS.enc.Utf8.parse(key);      
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function decryptByDES(ciphertext, key = "R5ZFZmWrrp5F8X8l") {        
    var keyHex = CryptoJS.enc.Utf8.parse(key);      
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = { encryptByDES, decryptByDES }