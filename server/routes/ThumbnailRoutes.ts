import express from 'express';
import { deleteThumbnail, generateThumbnail, recreateThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate', protect, generateThumbnail);
ThumbnailRouter.post('/recreate', protect, upload.single('image'), recreateThumbnail);
ThumbnailRouter.delete('/delete/:id', protect, deleteThumbnail);

export default ThumbnailRouter;
