import { BaseUserDto } from './base_user.dto';

export interface UserDto extends BaseUserDto {
  FirstName: string;
  LastName: string;
  Email: string;
}
