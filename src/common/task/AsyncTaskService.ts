import { Worker } from 'worker_threads'
import { AsyncTaskException } from './AsyncTaskException'
import fs from 'fs'

export class AsyncTaskService {
  
  public async schedule<T, R> (asyncTaskName: string, payload: T): Promise<R> {
    const taskFilePath = __dirname + '/lib-recipe-supplier.js'

    try {
      await this.assertTaskFileExists(taskFilePath)
      return this.spawnTask(taskFilePath, payload)
      
    } catch (error) {
      if (error instanceof Error) {
        throw new AsyncTaskException(error.message)
      } else {
        console.error(error)
      }
    }
    
    throw new Error('Unhandled error on scheduler service.')
  }

  private spawnTask<T, R>(taskFilePath: string, payload: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(taskFilePath, { workerData: { payload } });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      })
    })
  }
  
  private assertTaskFileExists(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) =>
      fs.access(path, error => !!error ? reject(error.message) : resolve())
    )
  }
}
