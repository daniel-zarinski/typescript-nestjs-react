import { IUserSchema, Role } from '@lib/shared';
import { Inject, Injectable, InternalServerErrorException, Logger, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import User from './user.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(User) private readonly userModel: typeof User) {}

  async create(userSchema: Partial<IUserSchema>): Promise<User> {
    const userModel = User.fromJson(
      { ...userSchema, password: await this.encryptPassword(userSchema.password), roles: [Role.User] },
      { patch: true }, // removes id from required fields
    );

    try {
      const userByEmail = await this.findByEmail(userModel.email);

      if (userByEmail.id) throw new NotAcceptableException(`The email ${userSchema.email} is already taken.`);
    } catch (err) {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.nativeError?.sqlMessage);
    }

    return this.userModel.query().insertAndFetch(userSchema);
  }

  async findById(id: number) {
    return this.userModel.query().findById(id);
  }

  // findOne(id: number): Promise<User> {
  //   return this.usersRepository.findOne(id);
  // }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.query().findOne({
      email,
    });
    if (user) return user;
  }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }

  // async createMany(users: User[]) {
  //   await this.usersRepository.manager.transaction(async (manager) => {
  //     await Promise.all(users.map((user) => manager.save(user)));
  //   });
  // }

  async encryptPassword(password: string) {
    if (!password) return '';

    return bcrypt.hash(password, 12);
  }

  async verifyPassword(rawPassword: any, encryptedPassword: string) {
    return bcrypt.compare(rawPassword, encryptedPassword);
  }
}
