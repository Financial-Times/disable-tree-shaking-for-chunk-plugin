import { a1 } from './module-a'
import { b2 } from './module-b'
import { foo } from './external-lib'
import * as component from './external-component'

console.log(a1(), b2(), foo(), component())
