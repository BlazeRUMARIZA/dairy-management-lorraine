import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected and require admin role
router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);

export default router;
