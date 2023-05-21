import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getAttachmentUrl, getUploadUrl } from '../dataLayer/storageS3'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { getUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  })
}

export async function deleteTodo(todoId: string, userId: string) {
  try {
    const todo = await todoAccess.getTodoById(todoId)

    if (!todo) {
      throw new Error("Todo not found")
    }

    if (todo.userId !== userId) {
      throw new Error("User can't delete this todo")
    }

    return await todoAccess.deleteTodo(todoId)

  } catch (error) {
    console.log(error);

    return error
    
  }
  
}

export function createAttachmentPresignedUrl(attachementId: string) {
  const uploadUrl = getUploadUrl(attachementId)

  console.log('Presign Url: ', uploadUrl)

  return uploadUrl
}

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachementId: string
) {
  const attachmentUrl = getAttachmentUrl(attachementId)

  const todo = await todoAccess.getTodoById(todoId)

  if (!todo) {
    throw new Error('Todo not found')
  }

  if (todo.userId !== userId) {
    throw new Error("User can't change this todo")
  }

  await todoAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function getTodos(userId: string): Promise<any> {
  const todos = await todoAccess.getTodos(userId)

  return todos
}

export async function updateTodos(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
){
  try {
    const todo = await todoAccess.getTodoById(todoId)

    if (!todo) {
      throw new Error("Todo not found.")
    }

    if (todo.userId !== userId) {
      throw new Error("User can't update.")
    }

    await todoAccess.updateTodoItem(todoId, updateTodoRequest)


  } catch (e) {
    console.log(e);

    return e
    
  }
}
