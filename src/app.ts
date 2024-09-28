import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import { container } from 'tsyringe'; // Importa o container do tsyringe
import { ShopifySyncController } from './adapters/input/controllers/ShopifySyncController';
import { setupDependencyInjection } from './config/dependencyInjection';
import { TsyringeAdapter } from './config/tsyringeAdapter';
import { AppDataSource } from './config/typeOrmConfig';

// Configuração para o routing-controllers usar o tsyringe como container
useContainer(new TsyringeAdapter(container));

// Setup the dependency injection
setupDependencyInjection();

if (!AppDataSource.isInitialized) {
  AppDataSource.initialize()
  .then(() => {
      console.log('Data Source has been initialized!');
      const app = createExpressServer({
        controllers: [ShopifySyncController],
      });

      app.listen(3000, () => {
        console.log('Server running on port 3000');
      });
  })
  .catch((err) => {
      console.error('Error during Data Source initialization', err);
  });
}





