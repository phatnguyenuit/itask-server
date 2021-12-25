import { Router } from 'express';
import { greet } from 'controllers/index/index.controller';

const router = Router({ caseSensitive: true });

router.get('/', greet);

export default router;
