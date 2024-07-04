import { Authorized, Body, Delete, JsonController, Param, Patch, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { StepService } from "../services/StepService";
import { StepModel } from "../models/StepModel";
import { Response } from "express";
import { UserRoles } from "../enums/Users";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/step')

export class StepController {
    constructor(
        @Service() private stepService: StepService
    ) {
    }

    // @Authorized(UserRoles.COMPANY)
    @Patch('/')
    @ResponseSchema(StepModel, {
        description: 'update run checklist'
    })
    public async updateRunChecklist(@Body() body: any, @Req() req: any): Promise<StepModel> {
        return await this.stepService.updateRunChecklist(body)
    }

    @Authorized(UserRoles.COMPANY)
    @Delete('/:id')
    @ResponseSchema(StepModel, {
        description: 'delete step'
    })
    public async deleteStep(@Param('id') id: number, @Res() res: Response): Promise<StepModel> {
        return await this.stepService.deleteStep(id, res)
    }

}