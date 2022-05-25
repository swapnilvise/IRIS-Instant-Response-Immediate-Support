import callerRouter from './caller-router.js';
import erRouter from './er-router.js';
import userInfoRouter from './userInfo-router.js';
import loginRouter from './login-router.js'
import updatePasswordRouter from './updatePassword-router.js';

export default (app) => {
    app.use('/', erRouter);
    app.use('/', userInfoRouter);
    app.use('/', callerRouter);
    app.use('/', loginRouter);
    app.use('/', updatePasswordRouter);
}