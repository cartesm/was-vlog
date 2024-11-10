import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersType } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { CreateUser } from 'src/users/interfaces/createUser.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { sevenMinutesInMilisecons } from 'src/configs';
import { HistoryService } from 'src/history/history.service';
import { ExceptionsService } from 'src/utils/exceptions.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private UsersModel: Model<UsersType>,
    private readonly i18n: I18nService,
    private cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private historyService: HistoryService,
    private exceptions: ExceptionsService,
  ) {}

  async getPublicUserData(userId: Types.ObjectId): Promise<UsersType> {
    const cacheMatch: string = await this.cacheManager.get('user:' + userId);
    if (cacheMatch) return JSON.parse(cacheMatch);
    const userMatch: UsersType = await this.UsersModel.findById(userId).select(
      '-email -pass -__v -updatedAt',
    );

    if (!userMatch) this.exceptions.throwNotFound('test.users.notFound');
    await this.cacheManager.set(
      'user:' + userMatch._id,
      JSON.stringify(userMatch),
      sevenMinutesInMilisecons,
    );
    return userMatch;
  }
  async getUserDataByEmail(email: string): Promise<UsersType> {
    const userMatch: UsersType = await this.UsersModel.findOne({ email });
    if (!userMatch) this.exceptions.throwNotFound('test.users.notFound');
    return userMatch;
  }
  async userExists(
    email?: string,
    username?: string,
  ): Promise<UsersType | null> {
    const userMatch: UsersType = await this.UsersModel.findOne({
      $or: [{ email, username }],
    });
    if (!userMatch) return null;
    return userMatch;
  }

  async createUser(userData: CreateUser): Promise<UsersType> {
    const userMatch: UsersType = await this.UsersModel.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });
    if (userMatch && userMatch.email == userData.email)
      this.exceptions.throwConflict('test.auth.conflicWithEmail');

    if (userMatch && userMatch.username == userData.username)
      this.exceptions.throwConflict('test.auth.conflicWithUsername');

    const newUser: UsersType = await new this.UsersModel({
      ...userData,
      pass: await bcrypt.hash(userData.pass, 12),
    }).save();
    await this.historyService.createHistory(newUser.id);
    return newUser;
  }

  // edit secction
  async editName(
    userID: Types.ObjectId,
    name: string,
  ): Promise<ResponseWithMessage> {
    const updatedName: UsersType = await this.UsersModel.findOneAndUpdate(
      { _id: userID },
      { name },
      { new: true },
    ).select('-email -password');
    await this.cacheManager.set(
      'user:' + updatedName._id,
      JSON.stringify(updatedName),
    );
    return {
      message: this.i18n.t('test.users.nameChanged', {
        lang: I18nContext.current().lang,
      }),
      data: updatedName.name,
    };
  }
  async editDescription(
    userID: Types.ObjectId,
    description: string,
  ): Promise<ResponseWithMessage> {
    const updatedDescription: UsersType =
      await this.UsersModel.findOneAndUpdate(
        { _id: userID },
        { description },
        { new: true },
      ).select('-email -password');
    await this.cacheManager.set(
      'user:' + updatedDescription._id,
      JSON.stringify(updatedDescription),
      sevenMinutesInMilisecons,
    );
    return {
      message: this.i18n.t('test.users.descriptionChanged', {
        lang: I18nContext.current().lang,
      }),
      data: updatedDescription.description,
    };
  }

  //---
  async changeUsername(
    userId: Types.ObjectId,
    username: string,
  ): Promise<ResponseWithMessage> {
    const exists: UsersType = await this.userExists(null, username);
    if (exists) this.exceptions.throwConflict('test.auth.conflicWithUsername');

    const updatedUsername: UsersType = await this.UsersModel.findOneAndUpdate(
      { _id: userId },
      { username },
      { new: true },
    ).select('-email -password username _id');

    // TODO: NOTIFICAR VIA EMAIL
    await this.cacheManager.set(
      'user:' + updatedUsername._id,
      JSON.stringify(updatedUsername),
      sevenMinutesInMilisecons,
    );
    return {
      message: this.i18n.t('test.users.usernameChanged'),
      data: updatedUsername.username,
    };
  }
  async changePassword(
    userId: Types.ObjectId,
    password: string,
  ): Promise<ResponseWithMessage> {
    //TODO:validar si existe contraseña o no
    const updatedPassword: UsersType = await this.UsersModel.findOneAndUpdate(
      { _id: userId },
      { pass: await bcrypt.hash(password, 12) },
      { new: true },
    ).select('-email -password');

    // TODO: NOTIFICAR VIA EMAIL

    await this.cacheManager.set(
      'user:' + updatedPassword._id,
      JSON.stringify(updatedPassword),
      sevenMinutesInMilisecons,
    );
    return {
      message: this.i18n.t('test.users.passwordChanged', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async changeUserProfileImage(
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    try {
      const { url } = await this.cloudinaryService.uploadFile(file);

      const updatedImg: UsersType = await this.UsersModel.findOneAndUpdate(
        { _id: userId },
        {
          img: url,
        },
        { new: true },
      ).select('-email -password');
      await this.cacheManager.set(
        'user:' + updatedImg._id,
        JSON.stringify(updatedImg),
        sevenMinutesInMilisecons,
      );
      return {
        message: this.i18n.t('test.users.imgChanged', {
          lang: I18nContext.current().lang,
        }),
        data: url,
      };
    } catch ({ message }) {
      throw new InternalServerErrorException(
        this.i18n.t('test.cloudinary.errorFileUpload', {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }
}
