import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { ProductOrderController } from './adapters/input/controllers/ProductOrderController';

const app = createExpressServer({
  controllers: [ProductOrderController], // Passar todas as controllers aqui
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});