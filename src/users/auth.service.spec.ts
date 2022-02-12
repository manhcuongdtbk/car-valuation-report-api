import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('cuong@hanligu.com', '123456');

    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('cuong@hanligu.com', '123456');

    try {
      await service.signup('cuong@hanligu.com', '654321');
    } catch (error) {
      expect(error).toEqual(new BadRequestException('email in use'));
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('cuong@hanligu.com', '123456');
    } catch (error) {
      expect(error).toEqual(new NotFoundException('user not found'));
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('cuong@hanligu.com', '123456');

    try {
      await service.signin('cuong@hanligu.com', '654321');
    } catch (error) {
      expect(error).toEqual(new BadRequestException('bad password'));
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('cuong@hanligu.com', '123456');
    const user = await service.signin('cuong@hanligu.com', '123456');

    expect(user).toBeDefined();
  });
});
