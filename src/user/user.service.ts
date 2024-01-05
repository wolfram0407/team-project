import { ConflictException, Injectable, UnauthorizedException, Patch } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService
{
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) { }


  async createUser(email: string, password: string, name: string, signup_type: string)
  {
    console.log('create', email, password, name, signup_type)
    const existUser = await this.findUserByEmail(email);
    if (existUser)
      throw new ConflictException('User already exists')
    const hashRound = this.configService.get<number>('PASSWORD_HASH_ROUNDS')
    const hashPassword = hashSync(password, hashRound)
    return await this.userRepository.save({
      email,
      password: hashPassword,
      name,
      signup_type
    })

  }

  async login(email: string, password: string)
  {
    const user = await this.findUserByEmailAndPassword(email)
    if (!user)
      throw new UnauthorizedException('이메일을 확인해주세요.');

    if (!compareSync(password, user?.password ?? ''))
      throw new UnauthorizedException('비밀번호를 확인해주세요.');

    const payload = { sub: user.user_id, tokenType: 'access' };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' })
    };

  }

  async updateUserInfo(userId: number, name: string)
  {
    const updated = await this.userRepository.update({ user_id: userId }, { name })

    return updated;
  }

  async deleteUser(userId: number)
  {
    return await this.userRepository.softDelete({ user_id: userId })
  }

  async findUserById(user_id: number)
  {
    return await this.userRepository.findOneBy({ user_id })
  }

  async findUserByEmailAndPassword(email: string)
  {
    return await this.userRepository.findOne({
      select: ['user_id', 'email', 'password', 'name', 'grade', 'signup_type'],
      where: [{ email }],
    });
  }
  async findUserByEmail(email: string)
  {
    return await this.userRepository.findOneBy({ email })
  }
}
