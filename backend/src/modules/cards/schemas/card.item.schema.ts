import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { ObjectId, SchemaTypes, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import User from '../../users/schemas/user.schema';
import {
  CommentDocument,
  CommentSchema,
} from '../../comments/schemas/comment.schema';

export type CardItemDocument = CardItem & Document;

@Schema()
export default class CardItem {
  @Prop({ nullable: false })
  text!: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  votes!: User[] | ObjectId[];

  @Prop({ type: [CommentSchema] })
  comments!: CommentDocument[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | ObjectId;

  @Prop()
  createdByTeam!: string;
}

export const CardItemSchema = SchemaFactory.createForClass(CardItem);

CardItemSchema.plugin(leanVirtualsPlugin);
