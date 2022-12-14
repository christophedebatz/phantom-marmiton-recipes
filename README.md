## Marmiton Phantom
An automatic tool to get data from marmiton.org with Phantom Company / PhantomBuster SDK.
## Code installation

```
$ git clone git@github.com:christophedebatz/phantom-marmiton-recipes.git marmiton-phantom && cd marmiton-phantom && npm i
```

> **Tips**
> You must set the API key in the file `phantombuster.cson`. 

## Phantom Buster setup
You can test this Phantom by setuping 3 js phantoms
- 1 facade script ("facade.js")
- 2 libraries ("lib-common.js" and "lib-recipe-supplier.js")

Webpack is used to split the code in these 3 parts avoiding too much code per part.

Installed Phantom is available here https://phantombuster.com/8341509714173889/2285315004236918/marmiton

### Body payload
Here is the body payload:
```
{
  query: string
  pagesCount?: number
  filters?: {
    dish?: string[]
    difficulty?: string[]
    cost?: string[]
    duration?: string[]
    seasonal?: boolean
  }
}
```

### Response object
The response object interface can be found here `src/step/dto/Recipe.ts`

#### TS ignored rules
- https://github.com/typescript-eslint/typescript-eslint/issues/4619#issuecomment-1055614155
- https://github.com/mainmatter/eslint-config-simplabs/issues/33

### Features
As bonuses, I've always tried to:
- Keep strict TS at a high level (no explicit any for instance)
- Use a JSON Schema as body param validator
- Use a local bundle (webpack) and Phantom dependencies to split the code
- Use interface segregation and open/close code (to fulfill with SOLID principles)
- Comment/describe interfaces and public methods

I offered some bonus features:
- The pages length to scrap as a parameter (`pagesCount`)
- Some filters are available as parameters (`filters`)

Unfortunatly, I started unit testing but I faced some issue to mock `Page` Puppeteer object and I missed some time to keep going.
I used typemoq, chai and mocha.

### Conclusion

The public methods and interfaces are commented.
All other explanations can be asked by email (christophe.db<at>gmail.com) or during our Wednesday interview.
