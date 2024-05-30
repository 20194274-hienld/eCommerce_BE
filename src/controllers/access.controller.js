'use strict'

class AccessControlle {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signup::`, req.body);
            // 200 OK
            // 201 CREATED
            return res.status(201).json({
                code: '20001',
                metadata: {
                    userid: 1
                }
            })
        } catch {
            next(error)
        }
    }
}

module.exports = new AccessControlle()