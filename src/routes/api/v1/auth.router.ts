import express from 'express';
import * as authController from 'controllers/auth/auth.controller';

const router = express.Router();

router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);
router.post('/signup', authController.signup);

export default router;
