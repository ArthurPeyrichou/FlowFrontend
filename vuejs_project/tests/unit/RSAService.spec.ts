import { RSAService } from '@/services/RSAService'
import JSEncrypt from 'jsencrypt'

describe('RSA encryption and decryption service', () => {
  it('Encrypt and decrypt', () => {
    const keys = new JSEncrypt()
    const rsaService = new RSAService(keys.getPrivateKey(), keys.getPublicKey())

    expect(keys.getPrivateKey()).toEqual(rsaService.getPrivateKey())
    expect(keys.getPublicKey()).toEqual(rsaService.getPublicKey())

    const msg = 'Message de test'
    const crypted = rsaService.encrypt(msg)
    const decrypt = rsaService.decrypt(crypted)

    expect(msg).not.toEqual(crypted)
    expect(decrypt).toEqual('Message de test')
  })
})
