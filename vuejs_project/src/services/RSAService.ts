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
      // key size / 8 - 11
      if (plaintext.length < 100) {
        return this.encryptPart(plaintext)
      } else {
        let offset = 0
        let res = ''
        while (offset < plaintext.length) {
          const size = Math.min(100, plaintext.length - offset)
          res += this.encryptPart(plaintext.substring(offset, offset + size))
          offset += size
          if (offset < plaintext.length) {
            res += ','
          }
        }
        return res
      }
    } catch (e) {
      return ''
    }
  }

  private encryptPart (plaintext: string): string {
    const buffer = new Buffer(plaintext)
    const encrypted = crypto.publicEncrypt({
      key: this.publicKey,
      passphrase: '',
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)
    return encrypted.toString('base64')
  }

  decrypt (cypher: string): string {
    if (this.privateKey === '') { return cypher }
    try {
      let res = ''
      cypher.split(',').forEach(el => { res += this.decryptPart(el) })
      return res
    } catch (e) {
      return ''
    }
  }

  private decryptPart (cypher: string): string {
    const buffer = Buffer.from(cypher, 'base64')
    const plaintext = crypto.privateDecrypt({
      key: this.privateKey,
      passphrase: '',
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)
    return plaintext.toString('utf8')
  }

  getPublicKey (): string {
    return this.publicKey
  }

  getPrivateKey (): string {
    return this.privateKey
  }
}
