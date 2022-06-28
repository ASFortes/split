import { LeanDocument } from 'mongoose';
import { CardItemDocument } from '../../schemas/card.item.schema';
import { CardDocument } from '../../schemas/card.schema';

export interface GetCardService {
  getCardFromBoard(
    boardId: string,
    cardId: string,
  ): Promise<LeanDocument<CardDocument> | null>;
  getCardItemFromGroup(
    boardId: string,
    cardItemId: string,
  ): Promise<LeanDocument<CardItemDocument> | null>;
}
