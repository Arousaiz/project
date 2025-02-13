import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { BaseUserDto } from './dto/base_user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async add(user: BaseUserDto): Promise<User> {
    const data = this.usersRepository.create({
      Username: user.Username,
      HashedPassword: user.Password,
    });
    return await this.usersRepository.save(data);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ Username: username });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: number, user: UserDto): Promise<any> {
    const data = await this.usersRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const updatedUser: User = {
      id: id,
      Email: user.Email,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      HashedPassword: user.Password,
    };
    return await this.usersRepository.update(id, updatedUser);
  }
}
