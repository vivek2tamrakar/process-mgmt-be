import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { env } from '../env';
import { UserRepository } from '../api/repositories/UserRepository';

@Service()
export class JwtService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
    ) {
    }

    public signJwt(user: any): string {
        return jwt.sign(
            { userId: user.id },
            env.jwt.secret,
            { algorithm: env.jwt.algorithm, expiresIn: env.jwt.expireIN }
        );
    }

    public signRefreshJwt(user: any): any {
        return jwt.sign(
            { userId: user.id },
            env.jwt.secretRefresh,
            { algorithm: env.jwt.algorithmRefresh, expiresIn: env.jwt.refreshExpireIn }
        );
    }


    public async decode(token: string, secretKey: string): Promise< undefined | any> {
        const decoded :any= jwt.verify(token, secretKey);
        let user = await this.userRepository.findOne({
            where: {
                 id: decoded.userId ,
            },
        });

        if (user) {
            return user;
        }
        return undefined;;
    }

    public async getIdByToken(token: string, secretKey: string): Promise<any> {
        const decoded = jwt.verify(token, secretKey)
        if (decoded) {
            return decoded;
        }
        return undefined;
    }
}




