const express = require('express');
const router = express.Router();
const { emailController, verifyToken } = require('../controllers/emailController');

// Email routes
router.post('/send-approval-email', verifyToken, emailController.sendApprovalEmail);
router.post('/resend-contract/:applicationId', verifyToken, emailController.resendContractEmail);
router.put('/track-contract/:applicationId', emailController.trackContractStatus);

module.exports = router;