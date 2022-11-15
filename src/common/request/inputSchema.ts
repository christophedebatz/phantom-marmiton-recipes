import { JSONSchemaType } from 'ajv'
import PhantomRequest from './PhantomRequest'

// @ts-ignore
const schema: JSONSchemaType<PhantomRequest> = {
  type: 'object',
  required: ['query'],
  additionalProperties: false,
  properties: {
    query: { type: 'string', nullable: false },
    pagesCount: { type: 'integer', nullable: true },
    filters: {
      type: 'object',
      additionalProperties: false,
      minProperties: 0,
      required: [],
      nullable: true,
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
