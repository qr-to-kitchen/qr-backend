import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('branches')
export class BranchesController {

  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get('my')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard)
  getMyBranch(@Request() req: any) {
    return this.branchesService.findByUserId(req.user.id);
  }

  @Get('user/:id')
  getBranchByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findByUserId(id);
  }

  @Get('restaurant/:id')
  getBranchByRestaurantId(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findByRestaurantId(id);
  }

  @Get(':id')
  getBranchById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findById(id);
  }

  @Get()
  getAll() {
    return this.branchesService.getAll();
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.deleteById(id);
  }
}
