/**
 * Make same property optional on type
 *
 * @example
 * ```typescript
 * interface Post {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<Post, 'id' | 'email'>;
 *
 * ```
 */

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
