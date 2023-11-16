import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { DevLogger } from 'src/common/utils/DevLogger';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new DevLogger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createUserDto: CreateUserDto) {
    this.logger.log(`create user create - ${req.user}`);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`create user findOne - ${id}`);

    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    this.logger.log(`create user findOneByEmail - ${email}`);
    return this.usersService.findOneByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`create user update - ${id}`);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`create user remove - ${id}`);
    return this.usersService.remove(id);
  }
}
