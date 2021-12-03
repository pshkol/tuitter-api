import { Injectable, NotFoundException } from '@nestjs/common';
import { Tuit } from './tuit.entity';
import { CreateTuitDto, PaginationQueryDto, UpdateTuitDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities';

@Injectable()
export class TuitsService {
  constructor(
    @InjectRepository(Tuit) private tuitRepo: Repository<Tuit>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getTuits({ limit, offset }: PaginationQueryDto): Promise<Tuit[]> {
    return await this.tuitRepo.find({
      relations: ['user'],
      skip: offset,
      take: limit,
    });
  }

  async getTuit(id: number): Promise<Tuit> {
    const tuit = await this.tuitRepo.findOne(id, { relations: ['user'] });

    if (!tuit) {
      throw new NotFoundException('Resource not found');
    }

    return tuit;
  }

  async createTuit({ message, user }: CreateTuitDto) {
    const tuit = this.tuitRepo.create({
      message, user
    });
    await this.tuitRepo.save(tuit);
  }

  async updateTuit(id: number, tuit: UpdateTuitDto) {
    await this.tuitRepo.update(id, tuit);
  }

  async removeTuit(id: number) {
    await this.tuitRepo.delete(id);
  }
}
