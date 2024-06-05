import { classToPlain } from 'class-transformer';
import * as express from 'express';
import { RefreshTokenError } from '../api/errors/User';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { JwtService } from './JwtService';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { UserRepository } from '../api/repositories/UserRepository';
import { UserModel } from '../api/models/UserModel';
import { UserService } from '../api/services/UserService';


@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository:UserRepository,
        @Service() private jwtService: JwtService,
        @Service() private userService: UserService,
    ) {
    }

    public async parseAuthFromRequest(req: express.Request): Promise< undefined> {
        const authorization = req.header('Authorization');
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            const decoded = await this.jwtService.decode(authorization.split(' ')[1], env.jwt.secret);
            this.log.info('Credentials provided by the client', decoded, authorization);
            return decoded;
        }
        if (req.query && req.query.authToken && typeof req.query.authToken === 'string') {
            const decoded = await this.jwtService.decode(req.query.authToken, env.jwt.secret);
            this.log.info('Credentials provided by the client in params', decoded, authorization);
            return decoded;
        }
        this.log.info('No credentials provided by the client', authorization);
        return undefined;
    }

    public async login(username: string, password: string,res:any): Promise<any> {
        const dbUser = await this.userRepository.findOne({ email: username });
        if (dbUser) {
            const isCorrectPassword = await UserModel.comparePassword(dbUser, password);
            if (isCorrectPassword) {
                const token = this.jwtService.signJwt(dbUser);
                const refreshToken = this.jwtService.signRefreshJwt(dbUser);
                return {
                    ...classToPlain(await this.userService.userInfoById(dbUser.id)),
                    token,
                    refreshToken,
                    message: 'MESSAGES.USER.LOGIN_SUCCESS',
                };
            }
        }
        return {
            is_error: true,
        };
    }


    public async checkRefresh(refreshToken: string): Promise<any> {
        const user = await this.jwtService.decode(refreshToken, env.jwt.secretRefresh);

        if (!user) {
            throw new RefreshTokenError();
        } else {
            return {
                token: this.jwtService.signJwt(user),
                refreshToken: this.jwtService.signRefreshJwt(user),
            };
        }
    }

}
