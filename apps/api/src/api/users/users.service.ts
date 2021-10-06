import { User } from '@lib/database';
import { IUserValues, IUserModelValues } from '@lib/schema';
import { Role } from '@lib/shared';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(User) private readonly userModel: typeof User) {}

  async create(data: IUserValues): Promise<User> {
    const password = await this.encryptPassword(data.password);
    const user = User.fromJson({ ...data, password, roles: [Role.User] }); // this throws
    let existingEmail: User | undefined;

    try {
      existingEmail = await this.findByEmail(user.email);
    } catch (err) {
      this.logger.warn(err);
      throw new InternalServerErrorException(err.nativeError?.sqlMessage);
    }

    if (existingEmail)
      throw new NotAcceptableException(`The email ${data.email} is already taken.`);

    return this.userModel.query().insertAndFetch(user);
  }

  async findAll() {
    return this.userModel.query().whereNotDeleted();
  }

  async findById(id: number) {
    return this.userModel.query().findById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.query().findOne({
      email,
    });

    if (user) return user;
  }

  async delete(id: number): Promise<void> {
    await this.userModel.query().findById(id).delete();
  }

  async createMany(users: IUserModelValues[]) {
    await Promise.all(users.map((user) => this.create(user)));
  }

  async encryptPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(rawPassword: string, encryptedPassword: string) {
    return bcrypt.compare(rawPassword, encryptedPassword);
  }
}
