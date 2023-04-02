import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async getAllBoard(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('boards');

    query.where('boards.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`Can't find Board with id is ${id}`);
    }

    return board;
  }
  // getBoardById(id: string): Board {
  //   const board = this.boards.find((board) => board.id === id);
  //   if (!board) {
  //     throw new NotFoundException(`Can't find Board with id is ${id}`);
  //   }
  //   return board;
  // }

  async deleteBoard(id: number, user: User): Promise<void> {
    const query = this.boardRepository.createQueryBuilder('boards');

    const result = await query
      .delete()
      .from(Board)
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId: user.id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id is ${id}`);
    }
  }
  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;

    await this.boardRepository.save(board);

    return board;
  }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
