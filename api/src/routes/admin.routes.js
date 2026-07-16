import { Router } from 'express';
import { getCurrentAdmin, loginAdmin, updateAdminPassword } from '../controllers/adminAuth.controller.js';
import { resetContent, updateContent } from '../controllers/adminContent.controller.js';
import { listInquiries, updateInquiryStatus, getAnalytics } from '../controllers/adminInquiries.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', requireAdmin, getCurrentAdmin);
router.patch('/password', requireAdmin, updateAdminPassword);
router.put('/content', requireAdmin, updateContent);
router.post('/content/reset', requireAdmin, resetContent);
router.get('/inquiries', requireAdmin, listInquiries);
router.patch('/inquiries/:id/status', requireAdmin, updateInquiryStatus);
router.get('/analytics', requireAdmin, getAnalytics);

export default router;
