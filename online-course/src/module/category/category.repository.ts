import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {
    super(Category, dataSource.createEntityManager());
  }

  async createCategory(categoryData: Category): Promise<Category> {
    try {
      const category = this.create(categoryData);
      const categoryCreated = await this.save(category);

      return categoryCreated;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Name already exists');
      }
      throw new InternalServerErrorException('Something error');
    }
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.findOneBy({ id: categoryId });

    return category;
  }

  async getCategoryByIdRelation(categoryId: number): Promise<Category> {
    const category = await this.findOne({
      where: {
        id: categoryId,
      },
      relations: ['children'],
    });

    return category;
  }

  async getCategoryByIdName(name: string): Promise<Category> {
    const category = await this.findOne({
      where: {
        name,
      },
    });

    return category;
  }
}
