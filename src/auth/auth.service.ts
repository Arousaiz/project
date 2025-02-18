import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async SignIn(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOne(username);
      if (user) {
        const isMatch = await bcrypt.compare(password, user.HashedPassword);
        if (!isMatch) {
          throw new HttpException('Password is wrong', HttpStatus.BAD_REQUEST);
        }
        const payload = { sub: user.id, username: user.Username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new HttpException('User is not found', HttpStatus.BAD_REQUEST);
      }
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async Register(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOne(username);
      if (user) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hash = await bcrypt.hash(password, 10);
      const userToReturn = await this.userService.add({
        Username: username,
        HashedPassword: hash,
      });
      return userToReturn;
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
}
