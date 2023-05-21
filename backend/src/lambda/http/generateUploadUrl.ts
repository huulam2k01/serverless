import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'

import {
  createAttachmentPresignedUrl,
  updateAttachmentUrl
} from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)

    const attachementId = uuid.v4()

    const uploadUrl = createAttachmentPresignedUrl(attachementId)

    await updateAttachmentUrl(userId, todoId, attachementId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*' 
      },
      body: JSON.stringify({ uploadUrl: uploadUrl })
    }
  } catch (error) {
    console.log(error)

    return {
      statusCode: error.code || 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({ msg: error.message })
    }
  }
}
