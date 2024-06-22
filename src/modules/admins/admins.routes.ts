import { Router } from 'express';
import {
  createNewAdmin,
  getAdminByProviderId,
  getAdminSessionsByAdminId,
  getAllAdmins,
} from './admins.controller';

const router = Router();

router.post('/admins', createNewAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/:adminId/sessions', getAdminSessionsByAdminId);
router.get('/admins/:provider/:id', getAdminByProviderId);

export default router;
