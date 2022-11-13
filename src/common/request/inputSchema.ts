import { JSONSchemaType } from 'ajv'
import PhantomRequest from './PhantomRequest'

const schema: JSONSchemaType<PhantomRequest> = {
  type: 'object',
  required: ['query'],
  additionalProperties: false,
  properties: {
    query: { type: 'string', nullable: false },
    pagesCount: { type: 'integer', nullable: true },
    filters: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      minProperties: 0,
      required: [],
      properties: {
        dish: { type: 'array', nullable: true },
        difficulty: { type: 'array', nullable: true },
        cost: { type: 'array', nullable: true },
        duration: { type: 'array', nullable: true },
        seasonal: { type: 'boolean', nullable: true }
      }
    }
  }
}

export default schema
