import Ajv from 'ajv'
import { PhantomRequest, schema } from './request'
import { Scrapper, Listenable, StepHandlerFactory } from './scrap'
import Buster from 'phantombuster'

const handlerFactory = new StepHandlerFactory()
const ajv = new Ajv()

export const main = async (buster: Buster): Promise<void> => {
  const validate = ajv.compile<PhantomRequest>(schema)

  if (validate(buster.argument)) {
    const scrapper = new Scrapper(handlerFactory.build())
    scrapper.attachListener(new class implements Listenable {
      onMessage = (message: string): void => console.log(`* ${message}`)
      onFailure = (message: string): void => console.error(`* ${message}`)
      onProgress = (percent: number, message: string): void => buster.progressHint(percent, message)
    }())
    const recipes = await scrapper.scrap(buster.argument)
    await buster.setResultObject(recipes)
    process.exit()
  }

  if (validate.errors != null) {
    validate.errors.forEach(error => {
      console.error(`Given argument ${error.message}`)
    })
  }

  process.exit(1)
}
