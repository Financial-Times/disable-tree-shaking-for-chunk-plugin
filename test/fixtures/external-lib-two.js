import { foo } from './external-lib-one'

export function baz() {
  return foo()
}

export function qux() {
  return 'bar'
}
