import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersType } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { CreateUser } from 'src/users/interfaces/createUser.interface';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private UsersModel: Model<UsersType>,
    private readonly i18n: I18nService,
  ) {}

  async getPublicUserData(userId: Types.ObjectId): Promise<UsersType> {
    const userMatch: UsersType =
      await this.UsersModel.findById(userId).select('-email -password');
    if (!userMatch)
      throw new NotFoundException(
        this.i18n.t('test.users.notFound', {
          lang: I18nContext.current().lang,
        }),
      );
    return userMatch;
  }
  async getUserDataByEmail(email: string): Promise<UsersType> {
    const userMatch: UsersType = await this.UsersModel.findOne({ email });
    if (!userMatch)
      throw new NotFoundException(
        this.i18n.t('test.users.notFound', {
          lang: I18nContext.current().lang,
        }),
      );
    return userMatch;
  }
  async userExists(email: string): Promise<UsersType | null> {
    const userMatch: UsersType = await this.UsersModel.findOne({ email });
    if (!userMatch) return null;
    return userMatch;
  }

  async createUser(userData: CreateUser): Promise<UsersType> {
    const userEmailMatch: UsersType = await this.UsersModel.findOne({
      email: userData.email,
    });
    if (userEmailMatch)
      throw new ConflictException(
        this.i18n.t('test.auth.conflicWithEmail', {
          lang: I18nContext.current().lang,
        }),
      );
    const userUsernameMatch: UsersType = await this.UsersModel.findOne({
      username: userData.username,
    });

    if (userUsernameMatch)
      throw new ConflictException(
        this.i18n.t('test.auth.conflicWithUsername', {
          lang: I18nContext.current().lang,
        }),
      );
    if (userData.pass) userData.pass = await bcrypt.hash(userData.pass, 12);
    return await new this.UsersModel(userData).save();
  }
}
