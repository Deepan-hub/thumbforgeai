import express from 'express';
import { getThumbnailbyId, getUsersThumbnails, getUserCredits, addCredits, getTitleSuggestions, getCTRScore } from '../controllers/UserController.js';
import protect from '../middlewares/auth.js';

const UserRouter = express.Router();

UserRouter.get('/thumbnails', protect, getUsersThumbnails);
UserRouter.get('/thumbnail/:id', protect, getThumbnailbyId);
UserRouter.get('/credits', protect, getUserCredits);
UserRouter.post('/add-credits', protect, addCredits);
UserRouter.post('/title-suggestions', protect, getTitleSuggestions);
UserRouter.post('/ctr-score', protect, getCTRScore);

export default UserRouter;
