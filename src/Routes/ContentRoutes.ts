import express from 'express';
import { container } from 'tsyringe';
import { ContentController } from '../Controllers/ContentController';

const router = express.Router();

// Resolve all dependencies of ContentController
const contentController = container.resolve(ContentController);

router.post('/createContent', [], contentController.createContent);

export default router;