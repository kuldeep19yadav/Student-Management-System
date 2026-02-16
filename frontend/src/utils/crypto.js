//  Convert ArrayBuffer to Base64 safely
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

//  Convert PEM public key string to CryptoKey
async function importPublicKey(pem) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";

  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\n/g, "");

  const binaryDer = window.atob(pemContents);
  const binaryArray = new Uint8Array(
    [...binaryDer].map((char) => char.charCodeAt(0)),
  );

  return await window.crypto.subtle.importKey(
    "spki",
    binaryArray.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"],
  );
}

//  Hybrid Encryption Function
export async function encryptPayload(data, publicKeyPem) {
  //  Generate AES-256 key
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"],
  );

  //  Encode data
  const encodedData = new TextEncoder().encode(JSON.stringify(data));

  //  Generate IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  //  Encrypt data using AES-GCM
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encodedData,
  );

  //  Export AES key (raw format)
  const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  //  Import RSA public key
  const rsaPublicKey = await importPublicKey(publicKeyPem);

  //  Encrypt AES key using RSA-OAEP
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    rsaPublicKey,
    exportedAesKey,
  );

  //  Return Base64 encoded payload
  return {
    encryptedKey: arrayBufferToBase64(encryptedKey),
    encryptedData: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv),
  };
}
