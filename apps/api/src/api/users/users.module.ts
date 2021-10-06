import { User } from '@lib/database';
import { Module } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { UsersService } from './users.service';

@Module({
  imports: [ObjectionModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
