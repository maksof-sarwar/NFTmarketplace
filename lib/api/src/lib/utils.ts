export const _skip = (input: { page: number; take: number }) => {
  const skip = (input.page - 1) * input.take;
  return {
    skip,
    take: input.take
  }
}