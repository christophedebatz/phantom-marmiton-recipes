import { Worker } from 'worker_threads'
import { AsyncTaskException } from './AsyncTaskException'
import fs from 'fs'
import path from 'path'

export class AsyncTaskService {
  public async schedule<T, R> (asyncTaskName: string, payload: Partial<T>): Promise<R> {
    const taskFilePath = path.resolve(__dirname, './lib-recipe-supplier.js')

    try {
      await this.assertTaskFileExists(taskFilePath)
      return await this.spawnTask(taskFilePath, { ...payload, ...{ path: 'lib-recipe-supplier.ts' } })
    } catch (error) {
      if (error instanceof Error) {
        throw new AsyncTaskException(error.message)
      } else {
        console.error(error)
      }
    }

    throw new AsyncTaskException('Unhandled error on scheduler service.')
  }

  private async spawnTask<T, R>(taskFilePath: string, payload: T): Promise<R> {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(taskFilePath, { workerData: { payload } })
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })
  }

  private async assertTaskFileExists (path: string): Promise<void> {
    return await new Promise<void>((resolve, reject) =>
      fs.access(path, error => (error != null) ? reject(error.message) : resolve())
    )
  }
}
