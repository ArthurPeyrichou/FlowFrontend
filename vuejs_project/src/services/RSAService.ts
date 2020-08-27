import { Buffer } from 'buffer/'
import * as crypto from 'crypto-browserify'

// use the public and private keys
// ...
export class RSAService {
  private privateKey: string
  private publicKey: string

  constructor (privateKey: string, publicKey: string) {
    this.privateKey = privateKey
    this.publicKey = publicKey
  }

  encrypt (plaintext: string): string {
    if (this.publicKey === '') { return plaintext }

    try {
      const buffer = new Buffer(plaintext)
      const encrypted = crypto.publicEncrypt({
        key: this.publicKey,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING
      }, buffer)
      return encrypted.toString('base64')
    } catch (e) {
      return ''
    }
  }

  decrypt (cypher: string): string {
    if (this.privateKey === '') { return cypher }

    try {
      const buffer = Buffer.from(cypher, 'base64')
      const plaintext = crypto.privateDecrypt({
        key: this.privateKey,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING
      }, buffer)
      return plaintext.toString('utf8')
    } catch (e) {
      return ''
    }
  }

  getPublicKey (): string {
    return this.publicKey
  }

  getPrivateKey (): string {
    return this.privateKey
  }
}
