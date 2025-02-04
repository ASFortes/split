import { LeanDocument } from 'mongoose';
import { UpdateBoardDto } from '../../dto/update-board.dto';
import { BoardDocument } from '../../schemas/board.schema';

export interface UpdateBoardService {
  update(
    userId: string,
    boardId: string,
    boardData: UpdateBoardDto,
  ): Promise<LeanDocument<BoardDocument> | null>;
  mergeBoards(
    subBoardId: string,
    userId: string,
  ): Promise<LeanDocument<BoardDocument> | null>;
}
