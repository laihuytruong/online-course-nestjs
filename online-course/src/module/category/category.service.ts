import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from 'src/entities/category.entity';
import { ResponseData } from 'src/interface/response.interface';
import { GetCategoryDto } from './dto/get-category.dto';
// import { MenuCategory, MenuClass } from 'src/constants/course';
import { PageMetaDto } from 'src/common/paginate/page-meta.dto';
import { PageDto } from 'src/common/paginate/paginate.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseData> {
    const { name, parentId } = createCategoryDto;

    if (parentId) {
      const parentCategory =
        await this.categoryRepository.getCategoryById(parentId);
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category: Category = {
      name,
      parentId,
    };

    const categoryCreate =
      await this.categoryRepository.createCategory(category);

    const responseData: ResponseData = {
      message: 'Create category successfully',
      data: categoryCreate,
    };

    return responseData;
  }

  async getCategories(getCategoryDto: GetCategoryDto): Promise<ResponseData> {
    const { order, page, pageSize, skip, search, parentId } = getCategoryDto;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    queryBuilder
      .orderBy('category.created_at', order)
      .leftJoinAndSelect('category.children', 'children');

    if (parentId) {
      if (parentId === -1) {
        queryBuilder.where('category.parentId IS NULL');
      } else {
        queryBuilder.where('category.parentId = :parentId', { parentId });
      }
    }

    if (search) {
      queryBuilder.where('UPPER(category.name) LIKE UPPER(:searchQuery)', {
        searchQuery: `%${search}%`,
      });
    }

    const totalCounts = await queryBuilder.getCount();

    queryBuilder.skip(skip).take(pageSize);

    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      totalCounts,
      pageOptionsDto: {
        skip,
        order,
        page,
        pageSize,
      },
    });
    const data = new PageDto(entities, pageMetaDto);

    const responseData: ResponseData = {
      message: 'Get categories successfully!',
      data,
    };

    return responseData;
  }

  async getCategoryById(categoryId: number): Promise<ResponseData> {
    const category =
      await this.categoryRepository.getCategoryByIdRelation(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const responseData: ResponseData = {
      message: 'Get category successfully',
      data: category,
    };

    return responseData;
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseData> {
    const { name, parentId } = updateCategoryDto;

    const category = await this.categoryRepository.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (name) {
      const categoryByTier =
        await this.categoryRepository.getCategoryByIdName(name);

      if (categoryByTier && categoryByTier.id !== categoryId) {
        throw new ConflictException('Name already exists');
      }
      category.name = name;
    }

    if (parentId) {
      const categoryParent =
        await this.categoryRepository.getCategoryById(parentId);

      if (!categoryParent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    category.parentId = parentId || null;

    await this.categoryRepository.save(category);
    const responseData: ResponseData = {
      message: 'Update category successfully',
      data: category,
    };
    return responseData;
  }

  async deleteCategory(categoryId: number): Promise<ResponseData> {
    const category = await this.categoryRepository.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.delete(categoryId);

    const responseData: ResponseData = {
      message: 'Delete category successfully!',
    };

    return responseData;
  }

  // private mapCategoriesToMenuCategories(
  //   categories: Category[],
  // ): MenuCategory[] {
  //   return categories.map((category) => {
  //     const menuCategory: MenuCategory = {
  //       name: category.name,
  //       parentId: category.parentId,
  //       groupName: category.name.toLowerCase().split(' ').join('_'),
  //       children: [],
  //     };
  //     return menuCategory;
  //   });
  // }

  // private genClass(menus: MenuCategory[], menuClass: MenuClass) {
  //   menus.forEach((menu) => {
  //     if (menu.groupName.length && menu.groupName) {
  //       menuClass[`group/${menu.groupName}`] = `group/${menu.groupName}`;
  //       menuClass[`group-hover/${menu.groupName}:block`] =
  //         `group-hover/${menu.groupName}:block`;

  //       // Recursively call genClass for children
  //       this.genClass(menu.children, menuClass);
  //     }
  //   });
  // }
}
