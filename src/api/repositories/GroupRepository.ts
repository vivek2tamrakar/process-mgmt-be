import { EntityRepository, Repository } from "typeorm";
import { GroupModel } from "../models/GroupModel";

@EntityRepository(GroupModel)
export class GroupRepository extends Repository<GroupModel> {

    public async getGroupList(filter: any): Promise<GroupModel[] | any> {
        const qb = await this.createQueryBuilder('group')
        return qb.getMany()
    }

}