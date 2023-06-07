import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getEmailUser, getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'
const nodemailer = require('nodemailer') 

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const userId = getUserId(event)

    const newItem = await createTodo(newTodo, userId)

    const emailUser = getEmailUser(event)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user: 'huulamdo1234@gmail.com',
        pass: 'MysecretPassword'
      }
    })

    const mailOptions = {
      from: 'huulamdo1234@gmail.com',
      to: emailUser,
      subject: 'NEW TODO',
      text: `${newItem.name} need to do`
    };

    console.log(emailUser)

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem,
        info
      })
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: error.message
    }
  }
}
