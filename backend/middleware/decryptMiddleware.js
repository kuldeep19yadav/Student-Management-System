const crypto = require("crypto");

module.exports = function (privateKey) {
  return function (req, res, next) {
    try {
      const { encryptedKey, encryptedData, iv } = req.body;

      if (!encryptedKey || !encryptedData || !iv) {
        return res.status(400).json({ message: "Encrypted payload missing" });
      }

      //  Decrypt AES key using RSA-OAEP
      const aesKey = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(encryptedKey, "base64"),
      );

      //  Decrypt data using AES-256-GCM
      const encryptedBuffer = Buffer.from(encryptedData, "base64");
      const ivBuffer = Buffer.from(iv, "base64");

      // GCM: last 16 bytes are auth tag
      const authTag = encryptedBuffer.slice(-16);
      const encryptedText = encryptedBuffer.slice(0, -16);

      const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, ivBuffer);

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedText, null, "utf8");
      decrypted += decipher.final("utf8");

      req.body = JSON.parse(decrypted);

      next();
    } catch (err) {
      console.error("Decryption error:", err);
      return res.status(500).json({ message: "Decryption failed" });
    }
  };
};
