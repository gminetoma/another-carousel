import { faker } from "@faker-js/faker";
import type { ItemsPropsWithoutRef } from "./HomePage";

const getItems = () => {
  const items: ItemsPropsWithoutRef[] = [];

  for (let index = 0; index < 4; index++) {
    items.push({
      imgSrc: faker.image.avatarGitHub(),
      text: faker.lorem.paragraph(),
    });
  }

  return items;
};

const items = getItems();

export default items;
