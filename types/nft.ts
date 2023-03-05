export type TraitType = "attack" | "health" | "speed";

export type NftAttribute = {
  trait_type: TraitType;
  value: string;
};

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
};
