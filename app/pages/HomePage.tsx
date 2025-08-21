import { motion, useAnimation } from "motion/react";
import {
  createRef,
  useRef,
  useState,
  type ComponentProps,
  type Ref,
} from "react";
import cn from "~/utils/cn";

type DotProps = {
  selected?: boolean;
};

const Dot = (props: DotProps) => {
  const { selected } = props;

  const dotCss = cn("size-5 bg-gray-200 rounded-full");
  const selectedCss = selected && cn("bg-gray-500");
  const finalDotCss = cn(dotCss, selectedCss);

  return <div className={finalDotCss} />;
};

export type ItemProps = {
  imgSrc: string;
  text: string;
  ref: Ref<HTMLDivElement>;
};

export type ItemsPropsWithoutRef = Omit<ItemProps, "ref">;

const Item = (props: ItemProps) => {
  const { imgSrc, text, ref } = props;

  return (
    <div
      className="flex flex-col min-w-full text-center gap-2 items-center"
      ref={ref}
    >
      <img src={imgSrc} className="size-40" />
      <span>{text}</span>
    </div>
  );
};

type HomePageProps = {
  items: ItemsPropsWithoutRef[];
};

const HomePage = (props: HomePageProps) => {
  const { items } = props;
  const itemRefsRef = useRef(items.map(() => createRef<HTMLDivElement>()));
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);
  const itemsDraggableContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const nextItem = () => {
    if (currentItem === items.length - 1) return currentItem;
    setCurrentItem((prev) => prev + 1);
    return currentItem + 1;
  };

  const previousItem = () => {
    if (currentItem === 0) return currentItem;
    setCurrentItem((prev) => prev - 1);
    return currentItem - 1;
  };

  const getCenters = () => {
    const itemsContainer = itemsContainerRef.current;
    const itemRefs = itemRefsRef.current;
    if (!itemsContainer || !items) return;

    const itemsContainerRect = itemsContainer.getBoundingClientRect();
    const itemsContainerCenter =
      itemsContainerRect.left + itemsContainerRect.width / 2;

    const itemCenters = itemRefs.map((itemRef) => {
      const item = itemRef.current;
      if (!item) return null;

      const itemRect = item.getBoundingClientRect();
      return itemRect.left + itemRect.width / 2;
    });

    return { itemsContainerCenter, itemCenters };
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragUpdate = () => {
    // Deny any handling if it is not dragging.
    // Without this will cause conflict with onDragEnd.
    if (!isDragging) return;

    const centers = getCenters();
    if (!centers) return;
    const { itemCenters, itemsContainerCenter } = centers;
    let closesDistance = Infinity;
    itemCenters.forEach((center, index) => {
      if (!center) return;
      const distance = Math.abs(center - itemsContainerCenter);
      if (distance >= closesDistance) return;
      closesDistance = distance;
      setCurrentItem(index);
    });
  };

  const handleDragEnd: ComponentProps<typeof motion.div>["onDragEnd"] = (
    _event,
    info
  ) => {
    setIsDragging(false);
    const { velocity } = info;
    let finalItem = currentItem;
    if (velocity.x > 500) finalItem = previousItem();
    else if (velocity.x < -500) finalItem = nextItem();
    
    // translateX instead of x to make it responsive
    controls.start({ x: 0, translateX: `${-finalItem * 100}%` });
  };

  const renderItems = () => {
    return items.map((item, index) => (
      <Item {...item} key={index} ref={itemRefsRef.current[index]} />
    ));
  };

  const renderDots = () => {
    return items.map((_item, index) => {
      return <Dot key={index} selected={currentItem === index} />;
    });
  };

  return (
    <main className="flex justify-center items-center p-20 min-h-dvh flex-col gap-10">
      <div ref={itemsContainerRef} className="flex overflow-hidden">
        <motion.div
          ref={itemsDraggableContainerRef}
          className="flex w-full"
          drag="x"
          onUpdate={handleDragUpdate}
          animate={controls}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragMomentum={false}
        >
          {renderItems()}
        </motion.div>
      </div>
      <div className="flex gap-5">{renderDots()}</div>
    </main>
  );
};

export default HomePage;
