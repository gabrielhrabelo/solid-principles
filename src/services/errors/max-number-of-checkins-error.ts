export class MaxNumberCheckinsError extends Error {
  constructor() {
    super('Max number of check-in reached.')
  }
}
