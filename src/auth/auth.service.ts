import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BaseUserDto } from 'src/user/dto/base_user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async SignIn({ Username, Password }: BaseUserDto): Promise<any> {
    try {
      const user = await this.userService.findOne(Username);
      if (user) {
        const isMatch = await bcrypt.compare(Password, user.HashedPassword);
        if (!isMatch) {
          throw new HttpException('Wrong data', HttpStatus.BAD_REQUEST);
        }
        const payload = { sub: user.id, username: user.Username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new HttpException('Wrong data', HttpStatus.BAD_REQUEST);
      }
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async Register({ Username, Password }: BaseUserDto): Promise<any> {
    try {
      const user = await this.userService.findOne(Username);
      if (user) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hash = await bcrypt.hash(Password, 10);
      const userToReturn = await this.userService.add({
        Username: Username,
        Password: hash,
      });
      return userToReturn;
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
}
