import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const calculatorsPath = path.join(__dirname, '../controllers/calculators');

fs.readdirSync(calculatorsPath).forEach(async (file) => {
  if (file.endsWith('.js')) {
    const routeName = file.replace('.controller.js', '');
    const modulePath = path.join(calculatorsPath, file);
    const { default: Controller } = await import(`file://${modulePath}`);
    
    if (Controller) {
      const controllerInstance = new Controller();
      // Assuming a 'calculate' method exists on the controller
      if (typeof controllerInstance.calculate === 'function') {
        router.post(`/${routeName}`, (req, res) => controllerInstance.calculate(req, res));
      } else {
        // Fallback for controllers that might not have a 'calculate' method
        router.use(`/${routeName}`, (req, res, next) => {
            // You might want to implement a default behavior or an error message here
            res.status(404).send('Not implemented');
        });
      }
    }
  }
});

export default router;
