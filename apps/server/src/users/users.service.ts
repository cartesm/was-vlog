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
import { EditUserDto } from './dto/editUserData.dto';
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
    const userMatch: UsersType = (
      await this.UsersModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            let: {
              localUserId: { $toString: '_id' },
            },
            from: 'followers',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$user', '$$localUserId'],
                  },
                },
              },
              {
                $project: {
                  follower: 1,
                },
              },
            ],
            as: 'followerCount',
          },
        },
        {
          $addFields: {
            followerCount: {
              $size: '$followerCount',
            },
            follow: userId
              ? {
                  $in: [
                    userId,
                    {
                      $map: {
                        input: '$followerCount',
                        as: 'follower',
                        in: '$$follower.follower',
                      },
                    },
                  ],
                }
              : false,
          },
        },
        {
          $project: {
            email: 0,
            pass: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ])
    )[0];

    if (!userMatch) this.exceptions.throwNotFound('test.users.notFound');
    return userMatch;
  }
  async getPrivateUserData(userId: Types.ObjectId): Promise<UsersType> {
    const userMatch: UsersType = await this.UsersModel.findOne({ _id: userId });

    if (!userMatch) this.exceptions.throwNotFound('test.users.notFound');
    return userMatch;
  }
  async getUserDataByEmail(email: string): Promise<UsersType> {
    return await this.UsersModel.findOne({ email });
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
      ...(userData.pass && { pass: await bcrypt.hash(userData.pass, 12) }),
    }).save();
    await this.historyService.createHistory(newUser.id);
    return newUser;
  }

  // edit secction
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

  async editProfileInfo(
    userId: Types.ObjectId,
    data: EditUserDto,
  ): Promise<ResponseWithMessage> {
    console.log(data);
    // si no hay contraseña se act ualiza y retorna
    if (!data.password) {
      console.log('no contra');
      await this.UsersModel.findOneAndUpdate({ _id: userId }, data);
      return {
        message: this.i18n.t('test.users.changed', {
          lang: I18nContext.current().lang,
        }),
      };
    }

    // busca si el user tiene contraseña creada o no
    const userMatch: UsersType = await this.UsersModel.findById(userId);
    if (!userMatch.pass) {
      await this.UsersModel.findOneAndUpdate(
        { _id: userId },
        { ...data, pass: await bcrypt.hash(data.password, 12) },
      );
      console.log('no existe contra');
      return {
        message: this.i18n.t('test.users.changed', {
          lang: I18nContext.current().lang,
        }),
      };
    }

    // si la validacion no es valida se retorna el error
    if (
      !(await bcrypt.compare(data.validationPass, userMatch.pass)) ||
      !data.validationPass
    ) {
      console.log('retorna error de validacion');
      this.exceptions.throwUnauthorized('test.users.errorPass');
    }
    // TODO: validar nombre de usuario
    console.log('se va');

    // se retorna actualizar con los nuevos valores
    await this.UsersModel.findOneAndUpdate(
      { _id: userId },
      {
        ...data,
        ...(data.password && { pass: await bcrypt.hash(data.password, 12) }),
      },
    );

    return {
      message: this.i18n.t('test.users.changed', {
        lang: I18nContext.current().lang,
      }),
    };
  }
}
