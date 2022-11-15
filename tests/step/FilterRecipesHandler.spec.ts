import FilterRecipesHandler from '../../src/step/FilterRecipesHandler'
import { DishFilter, FilterFactory } from '../../src/filter'
import { PhantomRequest } from '../../src/common/request'
import { expect } from 'chai'
import puppeteer, { Page } from 'puppeteer'
import * as TypeMoq from 'typemoq'

describe('How filter handler works', () => {
  it('checks that recipe filter handler is redirecting to the right URL', async () => {
  
    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox']
    // })s
    // const page = await browser.newPage()
    //
    // const pageMock: TypeMoq.IMock<Page> = TypeMoq.Mock.ofInstance<Page>(page)
    // const factoryMock: TypeMoq.IMock<FilterFactory> = TypeMoq.Mock.ofType(FilterFactory)
    // const filterMock: TypeMoq.IMock<DishFilter> = TypeMoq.Mock.ofType(DishFilter)
    //
    // const req: PhantomRequest = {
    //   query: 'hello',
    //   filters: {
    //     dish: ['Starters', 'Main courses']
    //   }
    // }
    //
    // pageMock.setup(x => x.goto(TypeMoq.It.isAnyString()))
    // factoryMock.setup(x => x.buildFilters()).returns(() => [filterMock.object])
    // filterMock.setup(x => x.supports(TypeMoq.It.isAnyString())).returns(() => true)
    // filterMock.setup(x => x.filters(pageMock.target, TypeMoq.It.isValue(req.filters.dish)))
    //
    // const filterRecipesHandler = new FilterRecipesHandler(factoryMock.object)
    // await filterRecipesHandler.handles(pageMock.object, req)
    //
    // expect(filterRecipesHandler.supports(req)).to.be.true
    // pageMock.verify(x => x.goto(TypeMoq.It.isValue('http://marmiton.org/recettes/recherche.aspx?dt=entree&dt=platprincipal')), TypeMoq.Times.once())
  })
})
