import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminRoleGuard } from 'src/guards/admin-role.guard';
import { Public } from 'src/decorators/public.decorator';
import { ResponseData } from 'src/interface/response.interface';
import { GetCategoryDto } from './dto/get-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.CREATED)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseData> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getCategories(
    @Query() getCategoryDto: GetCategoryDto,
  ): Promise<ResponseData> {
    return this.categoryService.getCategories(getCategoryDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getCategoryById(@Param('id') id: number): Promise<ResponseData> {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseData> {
    return this.categoryService.updateCategory(categoryId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  deleteCategory(@Param('id') categoryId: number): Promise<ResponseData> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
