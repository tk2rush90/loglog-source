export interface PostMeta {
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  contents: string;
  banner: string;
  thumbnail: string;
  bannerCredit: {
    name: string;
    id: string;
  };
  publish: string;
}
