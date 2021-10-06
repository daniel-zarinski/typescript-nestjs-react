import { IUser } from '@lib/database';
import { userSchema, IUserValues } from '@lib/schema';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { YupValidationPipe } from '../pipes/validation.pipe';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(
    @Body(new YupValidationPipe(userSchema))
    data: IUserValues,
  ): Promise<IUser> {
    this.logger.debug('attempting to create user with email: ', data.email, { ...data });
    const newUser = await this.usersService.create(data);

    return newUser.toJSON();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

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
