import { EntityRepository, Repository } from "typeorm";
import { ProcessModel } from "../models/ProcessModel";

@EntityRepository(ProcessModel)
export class ProcessRepository extends Repository<ProcessModel> {

    public async getProcessList(userId: number): Promise<ProcessModel[] | any> {
        let assign, created;
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt', 'process.isReview', 'process.reviewDate',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.lastReview', 'step.updatedAt',
                'assign.id',
                'user.id', 'user.email',
            ])
            .leftJoin('process.step', 'step')
            .leftJoin('process.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        const createdQuery = qb.clone();
        created = await createdQuery.andWhere('process.user_id =:userId', { userId: userId }).getMany();
        const assignQuery = qb.clone();
        assign = await assignQuery.andWhere('assign.assign_user_id=:assignUserId', { assignUserId: userId }).getMany();
        return { created, assign }
    }

    public async processDataById(processId: number): Promise<ProcessModel> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.groupId', 'process.folderId', 'process.tags',
                'process.description', 'process.createdAt', 'process.updatedAt', 'process.tags', 'process.description',
                'step.id', 'step.stepDescription'
            ])
            .leftJoin('process.step', 'step')
            // .leftJoin('process.folder', 'folder')
            // .leftJoin('process.group', 'group')
            // .leftJoin('process.user', 'user')
            .andWhere('process.id=:processId', { processId: processId })
console.log('qb',qb.getQuery());
        return qb.getOne()
    }

    public async getHomeData(userId: number): Promise<ProcessModel[]> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.isReview', 'process.reviewDate',
            ])
        qb.andWhere('process.user_id =:userId', { userId: userId })
        qb.orderBy('process.created_at', 'DESC')
        return qb.getMany()
    }

    public async searchProcess(userId: number, filter: any): Promise<ProcessModel[] | any> {
        const create = await this.query(`SELECT
    process.id,
    process.name,
    process.created_at as createdAt,
    process.tags,
    process.description,
    process.updated_at as updatedAt,
    process.is_review as isReview,
    process.review_date as reviewDate,
    process.deleted_at as deletedAt,
    users.id AS userId,
    users.email,
    \`group\`.id AS groupId,
    \`group\`.name AS groupName,
    folder.id AS folderId,
    folder.name AS folderName
    FROM
    process
    LEFT JOIN assign ON process.id = assign.process_id
    LEFT JOIN users ON assign.user_id = users.id
    LEFT JOIN \`group\` ON process.group_id = \`group\`.id
    LEFT JOIN folder ON process.folder_id = folder.id
WHERE
    process.user_id = ${userId}
    ${filter.tags ? `AND (process.tags LIKE '%${filter.tags}%' OR process.name LIKE '%${filter.tags}%')` : ''}
    `);

        // WHERE process.user_id = ${userId}

        // const qbCreate = await this.createQueryBuilder('process')
        //     .select([
        //         'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt',
        //         'assign.id',
        //         'user.id', 'user.email',
        //         'group.id', 'group.name',
        //         'folder.id', 'folder.name'
        //     ])
        //     .leftJoin('process.assign', 'assign',)
        //     .leftJoin('assign.user', 'user')
        //     .leftJoin('process.group', 'group')
        //     .leftJoin('process.folder', 'folder')
        // qbCreate.andWhere('process.user_id =:userId', { userId: userId })
        // if (filter.tags)
        //     qbCreate.andWhere(` process.tags LIKE :tags`, { tags: `%${filter.tags}%` });
        // const create = await qbCreate.getMany();
        // console.log(create, "777777777777777777777777")

        const folderGroupAssign = await this.query(`SELECT DISTINCT 
            p.id as id,p.name as name,p.user_id as userId ,p.group_id as groupId,p.folder_id as folderId,
            p.tags as tags,p.description as description ,p.created_at as createdAt,
            p.is_review as isReview,p.review_date as reviewDate,
            p.updated_at as updatedAt,p.deleted_at as deletedAt,
            f.name as folderName,
            u.email as email,
            \`group\`.id AS groupId,
            \`group\`.name AS groupName
            FROM process p 
            LEFT JOIN assign a ON p.id = a.process_id
            LEFT JOIN users u  ON a.assign_user_id=u.id
            LEFT JOIN folder f ON p.folder_id =f.id
            LEFT JOIN \`group\` ON p.group_id = \`group\`.id
            LEFT JOIN(SELECT DISTINCT process_id FROM assign WHERE assign_user_id =  ${userId}) AS direct_access ON p.id = direct_access.process_id
            LEFT JOIN(SELECT DISTINCT p.id FROM process p
               JOIN assign ag ON ag.group_id = p.group_id WHERE ag.assign_user_id = ${userId}) AS group_access ON p.id = group_access.id
            LEFT JOIN(SELECT DISTINCT p.id FROM process p JOIN assign af ON af.folder_id = p.folder_id WHERE af.assign_user_id =  ${userId}) AS folder_access ON p.id = folder_access.id WHERE (a.assign_user_id =  ${userId} OR group_access.id IS NOT NULL OR folder_access.id IS NOT NULL )
             ${filter.tags ? `AND (p.tags LIKE '%${filter.tags}%' OR p.name LIKE '%${filter.tags}%')` : ''}
            `);

        return [...create, ...folderGroupAssign]
    }

}