import { Body, JsonController, Post, Req, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { AuthService } from '../../auth/AuthService';
import { LoginRequest, RefreshTokenRequest } from './requests/User';
import { UserResponse } from './respons/User';

@JsonController('/auth')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @Post('/login')
    @ResponseSchema(UserResponse, {
        description: 'User login with username/password',
    })
    public async login(@Body() body: LoginRequest, @Req() req: any, @Res() res: any): Promise<UserResponse> {
        const dbUser = await this.authService.login(body.username, body.password, res);
        if (dbUser.is_error) {
            return res.status(400).send({
                success: false, error: dbUser.message ||
                    'MESSAGES.USER.INVALID_LOGIN', ipAddress: req.headers['x-forwarded-for'] || req.ip,
            });
        }
        return {
            ...dbUser,
            ipAddress: req.headers['x-forwarded-for'] || req.ip,
        };
    }

    @Post('/refreshtoken')
    @ResponseSchema(UserResponse, {
        description: 'Refresh auth token',
    })
    public async refreshToken(@Body() body: RefreshTokenRequest, @Req() req: any): Promise<UserResponse> {
        const newTokenPair = await this.authService.checkRefresh(body.refreshToken);
        return newTokenPair;
    }
}
