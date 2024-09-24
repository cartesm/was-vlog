import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersType } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { CreateUser } from 'src/users/interfaces/createUser.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private UsersModel: Model<UsersType>,
    private readonly i18n: I18nService,
    private cloudinaryService: CloudinaryService,
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
  async userExists(
    email?: string,
    username?: string,
  ): Promise<UsersType | null> {
    const userMatch: UsersType = await this.UsersModel.findOne({
      $or: [{ email, username }],
    });
    console.error('existe:');
    console.log(userMatch);
    if (!userMatch) return null;
    return userMatch;
  }

  async createUser(userData: CreateUser): Promise<UsersType> {
    console.log(userData.username);
    const userMatch: UsersType = await this.UsersModel.findOne({
      $or: [{ username: userData.username }, { email: userData.email }],
    });

    if (userMatch.email)
      throw new ConflictException(
        this.i18n.t('test.auth.conflicWithEmail', {
          lang: I18nContext.current().lang,
        }),
      );

    if (userMatch.username)
      throw new ConflictException(
        this.i18n.t('test.auth.conflicWithUsername', {
          lang: I18nContext.current().lang,
        }),
      );

    if (userData.pass) userData.pass = await bcrypt.hash(userData.pass, 12);
    return await new this.UsersModel(userData).save();
  }

  async editName(
    userID: Types.ObjectId,
    name: string,
  ): Promise<ResponseWithMessage> {
    const updatedName: UsersType = await this.UsersModel.findOneAndUpdate(
      { _id: userID },
      { name },
      { new: true },
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
    if (exists)
      throw new ConflictException(
        this.i18n.t('test.auth.conflicWithUsername', {
          lang: I18nContext.current().lang,
        }),
      );

    const updatedUsername: UsersType = await this.UsersModel.findOneAndUpdate(
      { _id: userId },
      { username },
      { new: true },
    ).select('username');
    // TODO: NOTIFICAR VIA EMAIL

    return {
      message: this.i18n.t('test.users.usernameChanged'),
      data: updatedUsername.username,
    };
  }
  async changePassword(
    userId: Types.ObjectId,
    password: string,
  ): Promise<ResponseWithMessage> {
    await this.UsersModel.findOneAndUpdate(
      { _id: userId },
      { pass: await bcrypt.hash(password, 12) },
      { new: false },
    );
    // TODO: NOTIFICAR VIA EMAIL
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

      await this.UsersModel.findOneAndUpdate(
        { _id: userId },
        {
          img: url,
        },
        { new: true },
      );
      console.log('he');
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
