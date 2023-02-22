const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SERCRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SERCRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})

        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await TokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_ACCESS_SERCRET)
            return user
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const user = jwt.verify(token, process.env.JWT_REFRESH_SERCRET)
            return user
        } catch(e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()