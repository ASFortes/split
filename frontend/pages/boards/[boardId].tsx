import React, { useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { QueryClient, dehydrate, useQuery, useQueryClient } from "react-query";
import dynamic from "next/dynamic";
import { getSession, useSession } from "next-auth/react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import useBoard from "../../hooks/useBoard";
import Text from "../../components/Primitives/Text";
import { useStoreContext } from "../../store/store";
import { getBoard, getBoards } from "../../api/boardService";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import { ERROR_LOADING_DATA, UNDEFINED } from "../../utils/constants";

const Column = dynamic(() => import("../../components/Board/Column"));
interface PathType {
  params: BoardKeyType;
}

interface BoardKeyType {
  [boardId: string]: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const session = await getSession();
  const id = context.params?.boardId?.toString();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["board", { id }], () => getBoard(id, session?.accessToken));
  return {
    props: {
      boardId: id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const session = await getSession();
  const boards = await getBoards(session?.accessToken);
  const paths: PathType[] = boards.map((board) => {
    return {
      params: {
        boardId: board?.id?.toString() ?? UNDEFINED,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

const Container = styled(Flex);

const Board: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { data: session } = useSession({ required: false });
  const { updateBoard } = useBoard();
  const { data, status } = useQuery(["board", { id: boardId }], () =>
    getBoard(boardId, session?.accessToken)
  );
  const { dispatch } = useStoreContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) dispatch({ type: "setTitle", val: data.title });
  }, [dispatch, data]);

  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    const message = update.destination
      ? `You have moved the card to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;

    provided.announce(message);
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const message = result.destination
      ? `You have moved the card from position ${result.source.index + 1} to ${
          result.destination.index + 1
        }`
      : `The card has been returned to its starting position of ${result.source.index + 1}`;

    provided.announce(message);

    const { destination, source, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (data) {
      const newData = {
        ...data,
      };

      if (type === "column") {
        const newCol = newData.columns[source.index];
        newData.columns.splice(source.index, 1);
        newData.columns.splice(destination.index, 0, newCol);
      }

      const start = data.columns.find((col) => col.id === source.droppableId);
      const finish = data.columns.find((col) => col.id === destination.droppableId);

      if (start && finish) {
        const startColIdx = data.columns.indexOf(start);
        const newStartCards = Array.from(start.cards);
        const cardToReorder = start.cards[source.index];
        newStartCards.splice(source.index, 1);

        const finishColIdx = data.columns.indexOf(finish);
        const newFinishCards = Array.from(finish.cards);

        if (start === finish) {
          newStartCards.splice(destination.index, 0, cardToReorder);
        } else {
          newFinishCards.splice(destination.index, 0, cardToReorder);

          finish.cards = newFinishCards;
          newData.columns.splice(finishColIdx, 1, finish);
        }

        start.cards = newStartCards;
        newData.columns.splice(startColIdx, 1, start);
      }
      queryClient.setQueryData(["board", { id: data.id }], newData);
      updateBoard.mutate({ newBoard: { ...newData }, token: session?.accessToken });
    }
  };

  if (status === "loading") return <Text>Loading ...</Text>;
  if (data) {
    return (
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {data.columns.map((column, index) => {
                return (
                  <Column
                    key={column.id}
                    title={column.title}
                    column={column}
                    cards={column.cards}
                    index={index}
                    columns={data.columns}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  return <Text>{ERROR_LOADING_DATA}</Text>;
};

export default Board;