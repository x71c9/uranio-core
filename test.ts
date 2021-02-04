// const element_def = {
//   element1: {
//     name: {
//     }
//   },
//   element2: {
//     age: {
//     }
//   }
// } as const;

// const element_def_optional = {
//   element1: {
//     title: {
//     }
//   },
//   element2: {
//     price: {
//     }
//   }
// } as const;

// export type ElementName = 'element1' | 'element2';

// export type ElementShape<A extends ElementName> = {
//   [k in keyof typeof element_def[A]]: string
// } & {
//   [k in keyof typeof element_def_optional[A]]?: string
// };

// export type Element<A extends ElementName> = ElementShape<A> & {_id: ''};

// function process_partial<E extends ElementName>(name: E, partial:Partial<ElementShape<E>>){
//   console.log(name, partial);
// }

// export function process_shape<E extends ElementName>(name: E, shape:ElementShape<E>):void{
//   process_partial(name, shape);
// }

// export function process<E extends ElementName>(name: E, element:Element<E>):void{
//   process_partial(name, element);
// }
