import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export class CardService {
  async createCard(input: Record<string, unknown>) {
    const params = {
      TableName: process.env.CARDS_TABLE,
      Item: {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    await client.send(new PutCommand(params));
    return params.Item;
  }

  async getCard(cardId: string) {
    const result = await client.send(
      new GetCommand({
        TableName: process.env.CARDS_TABLE,
        Key: { cardId },
      })
    );
    return result.Item;
  }

  async updateCard(cardId: string, updates: Record<string, unknown>) {
    const result = await client.send(
      new UpdateCommand({
        TableName: process.env.CARDS_TABLE,
        Key: { cardId },
        UpdateExpression: "SET updatedData = :v",
        ExpressionAttributeValues: { ":v": updates },
        ReturnValues: "ALL_NEW",
      })
    );
    return result.Attributes;
  }

  async deleteCard(cardId: string) {
    await client.send(
      new DeleteCommand({
        TableName: process.env.CARDS_TABLE,
        Key: { cardId },
      })
    );
    return { deleted: true };
  }

  async listCards() {
    const result = await client.send(
      new ScanCommand({ TableName: process.env.CARDS_TABLE })
    );
    return (result.Items as Record<string, unknown>[]) || [];
  }
}
