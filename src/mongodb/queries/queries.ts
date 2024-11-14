import clientPromise from '../connect'
import { User, Conversation, AIModel } from './types'


export async function getAccountDetails(userId: string): Promise<User | null> {
  try {
    const client = await clientPromise
    const connection = client.db(process.env.MONGODB_DB)

    const user = await connection.collection('Users')
    .findOne({ userId: userId })
    //don't get the _id field from the document
    .then((user) => user && { ...user, _id: undefined }) as User


    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch unit data')
  }
}

export async function getAllConversations(userId: string): Promise<Conversation[] | null> {
  try {
    const client = await clientPromise
    const connection = client.db(process.env.MONGODB_DB)
    const models = await connection.collection('AIModels')
        .find({})
        //don't get the _id field from each document
        .project({ _id: 0 })
        .toArray() as AIModel[]
    if (!models) {
        return null
    }
    
    const conversations = await connection.collection('Conversations')
      .find({ userId: userId })
      //don't get the _id field from each document
      .project({ _id: 0 })
      .toArray() as Conversation[]

    if (!conversations) {
      return null
    }

    //for each conversation, add the model details
    conversations.forEach((conversation: Conversation) => {
      const model = models.find((model) => model.modelId === conversation.modelId)
      if (model) {
        conversation.modelName = model.name
      }
    })

    return conversations
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch unit data')
  }
}
