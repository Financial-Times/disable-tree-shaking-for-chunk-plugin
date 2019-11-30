import { a1 } from './module-a'
import { b2 } from './module-b'
import { baz } from './external-lib-two'

const one = a1()
const two = b2()
const three = baz()

console.log(one, two, three)
