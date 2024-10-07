import { Injectable } from '@nestjs/common';
import { Socket } from 'src/entities/socket.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SocketRepository extends Repository<Socket> {
  constructor(private dataSource: DataSource) {
    super(Socket, dataSource.createEntityManager());
  }
}
