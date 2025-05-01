import { Logger } from 'winston';
import { AuthService } from 'src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { PrismaService } from 'src/common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
} as unknown as Logger;

const mockValidationService = {
  validate: jest.fn(),
};

const mockPrismaService = {
  user: {
    count: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockLogger },
        { provide: ValidationService, useValue: mockValidationService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a new user', async () => {
      const request = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass123',
        confirmPassword: 'pass123',
      };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.count.mockResolvedValue(0);
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashed-password' as never);
      mockPrismaService.user.create.mockResolvedValue({
        name: 'Test',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      const result = await authService.register(request);

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalled();
      expect(hashSpy).toHaveBeenCalledWith('pass123', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'Test', email: 'test@example.com' });
    });

    it('should throw if user already exists', async () => {
      const request = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass123',
        confirmPassword: 'pass123',
      };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.count.mockResolvedValue(1);

      await expect(authService.register(request)).rejects.toThrow(
        'User already exists',
      );

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalled();
    });

    it('should throw if passwords do not match', async () => {
      const request = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass123',
        confirmPassword: 'pass123fail',
      };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.count.mockResolvedValue(0);

      await expect(authService.register(request)).rejects.toThrow(
        'Passwords do not match',
      );

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return name and token', async () => {
      const request = { email: 'test@example.com', password: 'pass123' };
      const user = {
        id: '1',
        name: 'Test',
        password: 'hashed-password',
        role: 'USER',
      };
      const updatedUser = { ...user, token: 'jwt', last_login: new Date() };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue('jwt');
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await authService.login(request);

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(compareSpy).toHaveBeenCalledWith('pass123', 'hashed-password');
      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { token: 'jwt', last_login: new Date() },
      });
      expect(result).toEqual({ name: 'Test', token: 'jwt' });
    });

    it('should throw if user not found', async () => {
      const request = { email: 'notfound@example.com', password: 'pass' };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(request)).rejects.toThrow(
        'Email or password is incorrect',
      );

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
    });

    it('should throw if password is invalid', async () => {
      const request = { email: 'john@example.com', password: 'pass123fail' };
      const user = {
        id: '1',
        name: 'Test',
        password: 'hashed-password',
        role: 'USER',
      };
      mockValidationService.validate.mockReturnValue(request);
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as never);

      await expect(authService.login(request)).rejects.toThrow(
        'Email or password is incorrect',
      );

      expect(mockValidationService.validate).toHaveBeenCalled();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(compareSpy).toHaveBeenCalledWith('pass123fail', 'hashed-password');
    });
  });

  describe('logout', () => {
    it('should clear user token and return true', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await authService.logout('user-id');

      expect(result).toBe(true);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { token: null },
      });
    });
  });
});
