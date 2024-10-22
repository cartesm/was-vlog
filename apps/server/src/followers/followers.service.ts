import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { Followers, FollowersType } from './schemas/follower.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersService } from 'src/users/users.service';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class FollowersService {
  constructor(
    @InjectModel(Followers.name)
    private followersModel: PaginateModel<FollowersType>,
    private i18n: I18nService,
    private userService: UsersService,
    private exceptions: ExceptionsService,
  ) {}
  async followUser(
    user: Types.ObjectId,
    you: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    const follow: FollowersType = await this.followersModel.findOne({
      user,
      follower: you,
    });
    if (follow) this.exceptions.throwConflict('test.followers.exists');

    await new this.followersModel({ user, follower: you }).save();

    return {
      message: this.i18n.t('test.followers.follow', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async getFollowersCount(user: Types.ObjectId): Promise<number> {
    return await this.followersModel.countDocuments({ user });
  }
  async isFollow(follower: Types.ObjectId, you: Types.ObjectId) {
    const followMatch: FollowersType = await this.followersModel
      .findOne({
        user: follower,
        follower: you,
      })
      .populate('user', 'username img _id description')
      .select('user');
    if (!followMatch)
      return {
        user: await this.userService.getPublicUserData(follower),
        isFollow: false,
      };
    return {
      user: followMatch.user,
      isFollow: true,
      followersCount: await this.getFollowersCount(follower),
    };
  }
  async unfollowUser(
    you: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.followersModel.findOneAndDelete({
      user,
      follower: you,
    });
    return {
      message: this.i18n.t('test.followers.unfollow', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async deleteFollower(
    you: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.followersModel.findOneAndDelete({
      user: you,
      follower: user,
    });

    return {
      message: this.i18n.t('test.followers.deleteFollower'),
    };
  }
  async getFollowers(page: number, user: Types.ObjectId) {
    return await this.followersModel.paginate(
      {
        user,
      },
      {
        page,
        limit: 50,
        sort: { createdAt: -1 },
        populate: {
          path: 'follower',
          select: 'username img createdAt',
        },
        select: '-user',
      },
    );
  }
  async getUserFollings(page: number, user: Types.ObjectId) {
    return await this.followersModel.paginate(
      {
        follower: user,
      },
      {
        page,
        limit: 50,
        sort: { createdAt: -1 },
        populate: {
          path: 'user follower',
          select: 'username img createdAt',
        },
      },
    );
  }
}
