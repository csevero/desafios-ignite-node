import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from 'src/utils/dynamodbClient';
import { v4 as uuidV4 } from 'uuid';

interface ITodo {
  title: string;
  deadline: Date;
}

export const handle: APIGatewayProxyHandler = async event => {
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ITodo;
  const todo_id = uuidV4();

  const teste = await document
    .put({
      TableName: 'users_todos',
      Item: {
        id: todo_id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: todo_id,
      user_id,
      title,
      done: false,
      deadline: new Date(deadline),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
