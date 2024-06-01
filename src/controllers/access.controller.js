'use strict'

const AccessService = require("../services/access.service");

class AccessControlle {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signup::`, req.body);
            // 200 OK
            // 201 CREATED
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch {
            next(error)
        }
    }
}

module.exports = new AccessControlle()