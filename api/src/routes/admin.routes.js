import { Router } from 'express';
import { getCurrentAdmin, loginAdmin } from '../controllers/adminAuth.controller.js';
import { resetContent, updateContent } from '../controllers/adminContent.controller.js';
import { listInquiries } from '../controllers/adminInquiries.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', requireAdmin, getCurrentAdmin);
router.put('/content', requireAdmin, updateContent);
router.post('/content/reset', requireAdmin, resetContent);
router.get('/inquiries', requireAdmin, listInquiries);

export default router;
