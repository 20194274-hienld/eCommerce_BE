'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflictRequestError } = require("../core/error.response")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        // try {
        // step1: check email exists??
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!')
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        if (newShop) {
            // created privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     },
            //     privateKey: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     }
            // })
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            console.log({ privateKey, publicKey }); // save collection key store

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey
            })

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'keyStore error'
                }
            }
            // console.log(`pubKeyString::`, publicKeyString);
            // const publicKeyObject = crypto.createPublicKey(publicKeyString)
            // console.log(`pubKeyObject::`, publicKeyObject);
            // created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Create Token Success::`, tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
        // } catch (err) {
        //     console.log(err);
        //     return {
        //         code: 'xxx',
        //         message: err.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService