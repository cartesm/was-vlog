export interface ISubUser {
  img: string;
  _id: string;
  username: string;
  createdAt: string;
}

// ni idea donde se usa pero weno
export interface IUserAuth {
  username?: string;
  name?: string;
  pass?: string;
  email?: string;
  id?: string;
}

export interface IUser {
  username: string;
  img: string;
  _id: string;
  name: string;
  description?: string;
  pass?: string;
  createdAt: Date;
  followerCount: number;
  follow: boolean;
}
