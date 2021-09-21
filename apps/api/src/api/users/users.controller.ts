import { IUserSchema, userSchema } from '@lib/shared';
import { Body, ClassSerializerInterceptor, Controller, Logger, NotAcceptableException, Post, UseInterceptors, UsePipes } from '@nestjs/common';
import { YupValidationPipe } from '../pipes/validation.pipe';
import User from './user.model';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @UsePipes(new YupValidationPipe(userSchema))
  async create(
    @Body()
    data: IUserSchema,
  ): Promise<User> {
    this.logger.debug('attempting to create user: ', data);

    try {
      const user = await userSchema.validate(data, { stripUnknown: true });

      return this.usersService.create(user);
    } catch (err) {
      this.logger.warn({ err });
      throw new NotAcceptableException(err.message);
    }
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // @Get('/me')
  // @UseGuards(JwtAuthGuard)
  // getMe() {
  //   return {};
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  // @Delete(':id')
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  //   this.logger.log(`Deleting user id ${id}`);

  //   return this.usersService.remove(id);
  // }
}
