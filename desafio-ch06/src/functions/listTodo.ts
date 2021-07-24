import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from 'src/utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async event => {
  const { id: user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: 'users_todos',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': user_id,
      },
    })
    .promise();

  const todos = response.Items;

  return {
    statusCode: 201,
    body: JSON.stringify({
      todos,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
