import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ScoreRecord } from './types';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMO_TABLE!;

export async function saveScore(record: ScoreRecord): Promise<void> {
  const ttl = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK: `SCORE#${record.id}`,
      SK: 'META',
      ...record,
      ttl,
    },
  }));
}

export async function getScore(id: string): Promise<ScoreRecord | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: `SCORE#${id}`, SK: 'META' },
  }));
  if (!result.Item) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { PK, SK, ttl, ...record } = result.Item;
  return record as ScoreRecord;
}

export async function isProUser(ip: string): Promise<boolean> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `RATE#${ip}`, SK: 'META' },
    }));
    if (!result.Item?.pro_until) return false;
    return result.Item.pro_until > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function getAndIncrementProCount(ip: string): Promise<number> {
  const monthKey = new Date().toISOString().slice(0, 7);
  const result = await docClient.send(new UpdateCommand({
    TableName: TABLE,
    Key: { PK: `RATE#${ip}`, SK: `PRO#${monthKey}` },
    UpdateExpression: 'ADD #count :one',
    ExpressionAttributeNames: { '#count': 'count' },
    ExpressionAttributeValues: { ':one': 1 },
    ReturnValues: 'UPDATED_NEW',
  }));
  return (result.Attributes?.count as number) ?? 1;
}

export async function setProUntil(ip: string, proUntil: number): Promise<void> {
  await docClient.send(new UpdateCommand({
    TableName: TABLE,
    Key: { PK: `RATE#${ip}`, SK: 'META' },
    UpdateExpression: 'SET pro_until = :v',
    ExpressionAttributeValues: { ':v': proUntil },
  }));
}
