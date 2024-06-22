import { Delete, JsonController, Param, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { StepService } from "../services/StepService";
import { StepModel } from "../models/StepModel";
import { Response } from "express";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/step')

export class StepController {
    constructor(
        @Service() private stepService: StepService
    ) {
    }

    @Delete('/:id')
    @ResponseSchema(StepModel, {
        description: 'delete step'
    })
    public async deleteStep(@Param('id') id: number, @Res() res: Response): Promise<StepModel> {
        return await this.stepService.deleteStep(id, res)
    }

}