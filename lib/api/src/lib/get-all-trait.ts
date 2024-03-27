type Metadata = Record<string, any>;

export function getAllTraits(metadata: Metadata[]) {
  let allTrait: Record<string, any> = {};
  let attrCount: Record<string, number> = {};
  for (let i = 0; i < metadata.length; i++) {
    let nft = metadata[i];
    if (nft && nft.attributes) {
      let { attributes } = nft;
      attributes = attributes.filter(
        (attribute: any) =>
          attribute['trait_type'] && attribute['value'] && !/None/gi.test(attribute['value'])
      );
      nft.attributes = attributes;
      if (attrCount[attributes.length]) {
        // @ts-ignore
        attrCount[attributes.length] = attrCount[attributes.length] + 1;
      } else {
        attrCount[attributes.length] = 1;
      }
      for (let j = 0; j < attributes.length; j++) {
        let attribute = attributes[j];
        let { trait_type, value } = attribute;
        if (trait_type && value) {
          if (allTrait[trait_type]) {
            allTrait[trait_type].sum++;
            if (allTrait[trait_type][value]) {
              allTrait[trait_type][value]++;
            } else {
              allTrait[trait_type][value] = 1;
            }
          } else {
            allTrait[trait_type] = { [value]: 1, sum: 1 };
          }
        }
      }
    }
  }
  return { allTrait, attrCount };
};