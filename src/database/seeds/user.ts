import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserRoles } from '../../api/enums/Users';
import { UserModel } from '../../api/models/UserModel';

export class CreateUser implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const users = [{name:'admin', email: 'admin123@gmail.com', password: 'admin123' }];
        for (const u of users) {
            const user = new UserModel();
            user.name=u.name;
            user.email = u.email;
            user.password = await UserModel.hashPassword(u.password);
            user.role=UserRoles.ADMIN
            await em.save(user);
        }
    }
}
