import { Buffer } from 'buffer/'
import * as crypto from 'crypto-browserify'

// use the public and private keys
// ...
export class RSAService {
  private privateKey: string
  private publicKey: string
  private keySize: number
  private maxTextLenght: number

  private cryptoPrivKey: CryptoKey | null
  private cryptoPubKey: CryptoKey | null

  private isActive: boolean

  constructor (privateKey: string, publicKey: string, isActive = true, keySize = 4096) {
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.cryptoPrivKey = null
    this.cryptoPubKey = null
    this.keySize = keySize
    this.maxTextLenght = Math.round(this.keySize / 8) - 11
    this.isActive = isActive
  }

  getPublicKey (): string {
    return this.publicKey
  }

  getPrivateKey (): string {
    return this.privateKey
  }

  encrypt (plaintext: string) {
    if (!this.isActive || this.publicKey === '') { return encodeURIComponent(plaintext) }
    try {
      const t1 = performance.now()
      if (plaintext.length < this.maxTextLenght) {
        return this.encryptPart(plaintext)
      } else {
        let offset = 0
        let res = ''
        while (offset < plaintext.length) {
          const size = Math.min(this.maxTextLenght, plaintext.length - offset)
          res += this.encryptPart(plaintext.substring(offset, offset + size))
          offset += size
          if (offset < plaintext.length) {
            res += ','
          }
        }
        const t2 = performance.now()
        console.warn('Encrypt:', Math.ceil(t2 - t1))
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
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)
    return encrypted.toString('base64')
  }

  decrypt (cypher: string): string {
    if (!this.isActive || this.privateKey === '') { return cypher }
    try {
      const t1 = performance.now()
      let res = ''
      cypher.split(',').forEach(el => { res += this.decryptPart(el) })
      const t2 = performance.now()
      console.warn('Decrypt:', Math.ceil(t2 - t1))
      return res
    } catch (e) {
      return ''
    }
  }

  private decryptPart (cypher: string): string {
    const buffer = Buffer.from(cypher, 'base64')
    const plaintext = crypto.privateDecrypt({
      key: this.privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)
    return plaintext.toString('utf8')
  }

  /**
   * Demo for encrypt and decrypt with window.crypto
   */
  demoCryptoFunction (): void {
    if (this.cryptoPrivKey && this.cryptoPubKey) {
      const enc = new TextEncoder()
      const dec = new TextDecoder()
      console.warn(new Date().getMilliseconds())
      const encodedMessage = enc.encode('vive les pommes et la vie!')
      window.crypto.subtle.encrypt({
        name: 'RSA-OAEP'
      },
      this.cryptoPubKey,
      encodedMessage
      ).then(encryptedText => {
        console.log(encryptedText)
        if (this.cryptoPrivKey) {
          window.crypto.subtle.decrypt({
            name: 'RSA-OAEP'
          },
          this.cryptoPrivKey,
          encryptedText
          ).then(decryptedText => {
            console.log(decryptedText)
            console.log(dec.decode(decryptedText))
            console.warn(new Date().getMilliseconds())
          })
        }
      })
    }
  }

  async cryptoEncrypt (plaintext: string) {
    if (this.publicKey === '') { return plaintext }
    try {
      if (plaintext.length < this.maxTextLenght) {
        return await this.cryptoEncryptPart(plaintext)
      } else {
        let offset = 0
        const res: Array<Promise<string>> = []
        while (offset < plaintext.length) {
          const size = Math.min(this.maxTextLenght, plaintext.length - offset)
          res.push(this.cryptoEncryptPart(plaintext.substring(offset, offset + size)))
          offset += size
        }
        return await Promise.all(res).then((result: Array<string>) => {
          let resultString = result[0]
          for (let i = 1; i < result.length; ++i) {
            resultString += ',' + result[i]
          }
          return resultString
        })
      }
    } catch (e) {
      return ''
    }
  }

  async cryptoDecrypt (cypher: string) {
    if (this.privateKey === '') { return cypher }
    try {
      const res: Array<Promise<string>> = []
      cypher.split(',').forEach(el => { res.push(this.cryptoDecryptPart(el)) })
      return await Promise.all(res).then((result: Array<string>) => {
        let resultString = ''
        for (let i = 0; i < result.length; ++i) {
          resultString += result[i]
        }
        console.warn(resultString)
        return resultString
      })
    } catch (e) {
      return ''
    }
  }

  private async cryptoEncryptPart (plaintext: string) {
    if (this.cryptoPubKey) {
      const enc = new TextEncoder()
      const dec = new TextDecoder()
      const encodedMessage = enc.encode(plaintext)
      return await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP'
      },
      this.cryptoPubKey,
      encodedMessage
      ).then(encryptedText => {
        return RSAService.arrayBufferToBase64(encryptedText)
      }, err => {
        console.error(err)
        return ''
      })
    } else {
      return ''
    }
  }

  private async cryptoDecryptPart (encryptedText: string) {
    if (this.cryptoPrivKey) {
      const enc = new TextEncoder()
      const dec = new TextDecoder()
      const encodedMessage = enc.encode(encryptedText)
      return await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP'
      },
      this.cryptoPrivKey,
      encodedMessage
      ).then(plaintext => {
        return dec.decode(plaintext)
      }, err => {
        console.error(err)
        return ''
      })
    } else {
      return ''
    }
  }

  public setCryptoKeys (keys: CryptoKeyPair): void {
    this.cryptoPrivKey = keys.privateKey
    this.cryptoPubKey = keys.publicKey
  }

  public setCryptoPrivKey (keys: CryptoKey): void {
    this.cryptoPrivKey = keys
  }

  private str2ab (str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }

  public setCryptoPubKey (pem: string): void {
    // fetch the part of the PEM string between header and footer
    const pemHeader = '-----BEGIN PUBLIC KEY-----'
    const pemFooter = '-----END PUBLIC KEY-----'
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents)
    // convert from a binary string to an ArrayBuffer
    const binaryDer = this.str2ab(binaryDerString)
    window.crypto.subtle.importKey('spki', binaryDer, {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']).then(key => { this.cryptoPubKey = key })
  }

  private static base64ToArrayBuffer (base64: string): ArrayBuffer {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  private static arrayBufferToBase64 (arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer)
    let byteString = ''
    for (let i = 0; i < byteArray.length; i++) {
      byteString += String.fromCharCode(byteArray[i])
    }
    return window.btoa(byteString)
  }

  private static addNewLines (str: string): string {
    let finalString = ''
    while (str.length > 0) {
      finalString += str.substring(0, 64) + '\n'
      str = str.substring(64)
    }
    return finalString
  }

  static bKeyToString (isPrivate: boolean, arrayBuffer: ArrayBuffer): string {
    return '-----BEGIN ' + (isPrivate ? 'PRIVATE' : 'PUBLIC') + ' KEY-----\n' + this.addNewLines(this.arrayBufferToBase64(arrayBuffer)) + '-----END ' + (isPrivate ? 'PRIVATE' : 'PUBLIC') + ' KEY-----'
  }
}
