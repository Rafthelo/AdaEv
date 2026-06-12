const authService    = require('./auth.service');
const { successResponse } = require('../../helpers/response.helper');
const { HTTP_STATUS }     = require('../../constants/http.constants');

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 días
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };

    const { accessToken, refreshToken, user } = await authService.login(username, password, meta);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    return res.status(HTTP_STATUS.OK).json(
      successResponse({ accessToken, user }, 'Inicio de sesión exitoso')
    );
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error:   'AUTH_REQUIRED',
        message: 'Refresh token no encontrado',
      });
    }

    const { accessToken, refreshToken } = await authService.refresh(token);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    return res.status(HTTP_STATUS.OK).json(
      successResponse({ accessToken }, 'Token renovado exitosamente')
    );
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    const meta  = { ip: req.ip, userAgent: req.headers['user-agent'] };

    await authService.logout(token, req.user.id, meta);

    res.clearCookie(REFRESH_COOKIE);

    return res.status(HTTP_STATUS.OK).json(
      successResponse(null, 'Sesión cerrada exitosamente')
    );
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user.id);
    return res.status(HTTP_STATUS.OK).json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

module.exports = { login, refresh, logout, me };