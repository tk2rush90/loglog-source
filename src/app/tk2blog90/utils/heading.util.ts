export class HeadingUtil {
  /**
   * Transform heading text to css id.
   * @param heading Heading text.
   */
  static toId(heading: string): string {
    return heading.toLowerCase().replace(/\s+/g, '-');
  }
}
