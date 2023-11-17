import { container } from 'tsyringe';
import { UserRepository } from './Repositories/Implementations/UserRepository';
import { UserService } from './Services/Implementations/UserService';
import { FacebookRepository } from './Repositories/Implementations/FacebookRepository';
import { FacebookService } from './Services/Implementations/FacebookService';

// Register your services and repositories as singletons
container.register<UserRepository>(UserRepository, { useClass: UserRepository });
container.register<UserService>(UserService, { useClass: UserService });

container.register<FacebookRepository>(FacebookRepository, { useClass: FacebookRepository });
container.register<FacebookService>(FacebookService, { useClass: FacebookService });

export { container };
