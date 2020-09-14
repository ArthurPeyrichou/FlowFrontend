import { RSAService } from '@/services/RSAService'

describe('RSA encryption and decryption service', () => {
  it('Encrypt and decrypt', () => {
    // ReferenceError: regeneratorRuntime is not defined
    /* window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    ).then(keyPair => {
      window.crypto.subtle.exportKey(
        'pkcs8',
        keyPair.privateKey
      ).then(exportedPrivateKey => {
        window.crypto.subtle.exportKey(
          'spki',
          keyPair.publicKey
        ).then(exportedPublicKey => {
          const rsaService = new RSAService(RSAService.bKeyToString(true, exportedPrivateKey as ArrayBuffer), RSAService.bKeyToString(false, exportedPublicKey))

          const msg = 'Message de test'
          const crypted = rsaService.encrypt(msg)
          const decrypt = rsaService.decrypt(crypted)

          expect(msg).not.toEqual(crypted)
          expect(decrypt).toEqual('Message de test')
        })
      })
    }) */
  })
})
