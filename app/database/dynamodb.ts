import * as AWS from "aws-sdk";
import { IParams, ISetParams, IDynamoInteraction } from "../../types/index";

AWS.config.update({
  region: "us-east-1",
  dynamodb: {
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  },
});

const documentClient = new AWS.DynamoDB.DocumentClient();

const fetchUser: IDynamoInteraction = async (discordId) : Promise<any> => {
  const params: IParams = {
    TableName: "verified",
    Key: {
      discordId: discordId,
    },
  };

  let data  = await documentClient.get(params).promise();
  return data.Item;
};

const setUserVerified: IDynamoInteraction = async (discordId, userId) => {
  const params: ISetParams = {
    TableName: "verified",
    Item: {
      discordId: discordId,
      userId: userId,
      verified: true,
    },
  };
  return documentClient.put(params).promise();
};

const deleteVerifiedUser: IDynamoInteraction = async (discordId) => {
    const params: IParams = {
        TableName: 'verified',
        Key: {
            'discordId': discordId
        }
    }
    return documentClient.delete(params).promise()
}

export {
    fetchUser, setUserVerified, deleteVerifiedUser
}