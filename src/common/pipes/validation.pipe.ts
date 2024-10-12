import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {MESSAGES} from '../constants/messages.constants';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, {metatype} : ArgumentMetadata) {
        if(!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException({
                message: MESSAGES.ERROR.VALIDATION_FAILED,
                errors: this.formatErrors(errors)
            });
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype as any);
    }

    private formatErrors(errors: any[]) {
        return errors.map(err => {
            return {
                field: err.property,
                errors: Object.values(err.constraints)
            };
        });
    }
}