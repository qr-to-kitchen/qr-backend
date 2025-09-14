import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrUpdateBranchDishDto } from './create-or-update-branch-dish.dto';

export class BulkSaveBranchDishes {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @ApiProperty({
    example: [
      { id: 1, isAvailable: false },
      { isAvailable: true, customPrice: 10.4, branchId: 4, dishId: 3 }
    ]
  })
  @Type(() => CreateOrUpdateBranchDishDto)
  branchDishes: CreateOrUpdateBranchDishDto[];

  @IsNotEmpty({ message: 'El id del socket es obligatorio.'})
  @ApiProperty({ example: 'string' })
  socketId: string;
}